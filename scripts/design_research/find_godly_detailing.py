#!/usr/bin/env python3
"""
Find auto-detailing company websites with "godly" (award-tier) design.

Searches the web + design galleries, fetches candidate sites, scores them for
premium UX/visual signals, and writes a ranked inspiration report you can use
to elevate Shade & Shine toward godly.website / Awwwards-level craft.

Usage:
  cd scripts/design_research
  python3 -m venv .venv && source .venv/bin/activate
  pip install -r requirements.txt
  python find_godly_detailing.py
  python find_godly_detailing.py --limit 25 --out ../../design-inspiration
"""

from __future__ import annotations

import argparse
import json
import re
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

try:
    from ddgs import DDGS
except ImportError:  # pragma: no cover
    try:
        from duckduckgo_search import DDGS  # type: ignore
    except ImportError:
        DDGS = None  # type: ignore


USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)

# Seed URLs known for strong detailing / automotive craft (plus galleries).
SEED_SITES = [
    "https://ateliercarcare.co.uk",
    "https://mintdetail.com",
    "https://www.detailpros.ky",
    "https://pureppf.com",
    "https://www.adamspolishes.com",
    "https://www.chemicalguys.com",
    "https://www.ceramicpro.com",
    "https://www.xpel.com",
    "https://www.feynlab.com",
    "https://www.modesta-japan.com",
    "https://www.gtechniq.com",
    "https://www.optimum.com",
    "https://www.blackstone-tek.com",
    "https://www.supercardetailing.com",
    "https://www.luxurydetail.com",
    "https://www.detailking.com",
    "https://www.theultimatedetailer.com",
    "https://www.autogeek.net",
    "https://www.drbeige.com",
    "https://www.shinearmor.com",
]

SEARCH_QUERIES = [
    "best auto detailing website design 2025",
    "premium car detailing website dark luxury design",
    "PPF ceramic coating studio website design inspiration",
    "award winning auto detailing website",
    "luxury car care website Awwwards",
    "godly.website automotive detailing",
    "best ceramic coating company website design",
    "high end detailing studio website portfolio",
    "paint protection film studio website redesign case study",
    "premium detailing booking website dark theme",
]

GALLERY_QUERIES = [
    "site:awwwards.com detailing OR \"car care\" OR automotive",
    "site:cssdesignawards.com detailing OR automotive",
    "site:godly.website automotive OR car OR detailing",
    "site:httpster.net car detailing",
    "\"case study\" detailing website redesign dark premium",
]

# Patterns that signal "godly" craft on a landing page.
GODLY_SIGNALS: list[tuple[str, int, str]] = [
    (r"fonts\.(google|bunny)|typekit|fontshare|fonts\.cdnfonts", 8, "Custom / web fonts"),
    (r"framer-motion|gsap|locomotive|lenis|smooth.?scroll|parallax", 12, "Motion / scroll craft"),
    (r"<video|background.?video|mux\.com|vimeo|youtube\.com/embed", 10, "Video presence"),
    (r"webgl|three\.js|splinetool|canvas", 10, "3D / WebGL"),
    (r"booking|book.?now|schedule|calendly|setmore|squareup\.com/appointments", 10, "Clear booking CTA"),
    (r"ceramic|ppf|paint.?protection|tint|detail", 6, "Service vocabulary on-page"),
    (r"before.?after|compare|slider|twentytwenty", 8, "Before/after storytelling"),
    (r"review|testimonial|google.?rating|trustpilot", 6, "Social proof"),
    (r"package|pricing|starting.?at|from\s*\$", 6, "Package / pricing clarity"),
    (r"og:image|twitter:card", 4, "Share / OG polish"),
    (r"preload|fetchpriority|next/image|srcset", 4, "Perf-minded imagery"),
    (r"dark|bg-black|#000|#0a0a0a|zinc-950|neutral-950", 6, "Dark premium palette cues"),
    (r"tracking-\[|letter-spacing|uppercase.*tracking", 4, "Expressive type treatment"),
    (r"clip-path|mask-image|mix-blend|backdrop-blur", 5, "Advanced CSS craft"),
]

SKIP_HOST_PARTS = (
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "linkedin.com",
    "twitter.com",
    "x.com",
    "pinterest.com",
    "tiktok.com",
    "reddit.com",
    "wikipedia.org",
    "google.com",
    "bing.com",
    "duckduckgo.com",
    "amazon.com",
    "ebay.com",
    "yelp.com",
    "tripadvisor.com",
    "medium.com",
    "github.com",
    "notion.so",
    "figma.com",
    "behance.net",
    "dribbble.com",
)


@dataclass
class SiteResult:
    url: str
    title: str = ""
    score: int = 0
    signals: list[str] = field(default_factory=list)
    source: str = ""
    snippet: str = ""
    status: int | None = None
    error: str = ""
    design_notes: list[str] = field(default_factory=list)


def normalize_url(url: str) -> str | None:
    url = url.strip()
    if not url:
        return None
    if url.startswith("//"):
        url = "https:" + url
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if not host or any(bad in host for bad in SKIP_HOST_PARTS):
        return None
    # Strip tracking / ref noise
    clean = f"{parsed.scheme}://{host}{parsed.path or '/'}"
    if clean.endswith("/") and len(parsed.path or "/") > 1:
        clean = clean.rstrip("/")
    return clean


def root_url(url: str) -> str:
    p = urlparse(url)
    return f"{p.scheme}://{p.hostname}"


def search_web(queries: Iterable[str], per_query: int = 8) -> list[tuple[str, str, str]]:
    """Return list of (url, title, snippet) from DuckDuckGo."""
    found: list[tuple[str, str, str]] = []
    if DDGS is None:
        print("⚠ ddgs not installed — using seeds only")
        return found

    ddgs = DDGS()
    for q in queries:
        try:
            results = list(ddgs.text(q, max_results=per_query))
        except Exception as exc:  # noqa: BLE001
            print(f"  search failed for '{q}': {exc}")
            continue
        for item in results:
            href = normalize_url(item.get("href") or item.get("link") or "")
            if not href:
                continue
            found.append(
                (
                    href,
                    (item.get("title") or "").strip(),
                    (item.get("body") or item.get("snippet") or "").strip(),
                )
            )
        time.sleep(0.5)
    return found


def fetch_html(url: str, timeout: float = 12.0) -> tuple[int | None, str, str]:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
        }
    )
    try:
        resp = session.get(url, timeout=timeout, allow_redirects=True)
        # Prefer homepage if we landed on a long case-study path with no detailing brand
        return resp.status_code, resp.url, resp.text[:450_000]
    except requests.RequestException as exc:
        return None, url, str(exc)


def score_html(html: str, final_url: str) -> tuple[int, list[str], list[str], str]:
    soup = BeautifulSoup(html, "lxml")
    title = (soup.title.string or "").strip() if soup.title else ""
    text_blob = html.lower()

    score = 0
    signals: list[str] = []
    notes: list[str] = []

    for pattern, pts, label in GODLY_SIGNALS:
        if re.search(pattern, text_blob, re.I):
            score += pts
            signals.append(label)

    # Structural heuristics
    h1s = soup.find_all("h1")
    if h1s:
        score += 4
        signals.append("Clear H1 hierarchy")
    imgs = soup.find_all("img")
    if len(imgs) >= 6:
        score += 4
        signals.append("Image-rich layout")
    links = soup.find_all("a", href=True)
    cta_hits = sum(
        1
        for a in links
        if re.search(r"book|quote|contact|schedule|protect", a.get_text(" ", strip=True), re.I)
    )
    if cta_hits >= 2:
        score += 6
        signals.append("Multiple conversion CTAs")

    # Design notes for Shade & Shine
    if "Video presence" in signals:
        notes.append("Consider a full-bleed hero video or cinematic still sequence")
    if "Motion / scroll craft" in signals:
        notes.append("Add intentional scroll-linked motion (2–3 signature moments)")
    if "Before/after storytelling" in signals:
        notes.append("Keep / elevate interactive before-after as a hero proof section")
    if "Package / pricing clarity" in signals:
        notes.append("Package cards with escalating coverage (already on PPF) — mirror elsewhere")
    if "Dark premium palette cues" in signals:
        notes.append("Stay black/premium; avoid generic purple/cream AI defaults")
    if "Custom / web fonts" in signals:
        notes.append("Expressive display + clean body pair (avoid Inter/Roboto defaults)")

    # Soft bonus for short memorable hostnames
    host = (urlparse(final_url).hostname or "").replace("www.", "")
    if host.count(".") == 1 and len(host.split(".")[0]) <= 14:
        score += 2

    return score, sorted(set(signals)), notes, title


def extract_case_study_target(html: str, page_url: str) -> str | None:
    """If result is an agency case study, try to pull the live client site URL."""
    soup = BeautifulSoup(html, "lxml")
    for a in soup.find_all("a", href=True):
        label = a.get_text(" ", strip=True).lower()
        href = a["href"]
        if re.search(r"visit|live site|view site|launch|website", label):
            full = normalize_url(urljoin(page_url, href))
            if full and urlparse(full).hostname != urlparse(page_url).hostname:
                return root_url(full)
    # og:url sometimes points at client
    og = soup.find("meta", property="og:url")
    if og and og.get("content"):
        cand = normalize_url(og["content"])
        if cand and urlparse(cand).hostname != urlparse(page_url).hostname:
            return root_url(cand)
    return None


def analyze_candidate(url: str, source: str, snippet: str = "", title_hint: str = "") -> SiteResult:
    status, final_url, body = fetch_html(url)
    result = SiteResult(url=root_url(final_url if status else url), source=source, snippet=snippet)

    if status is None:
        result.error = body
        return result

    result.status = status
    if status >= 400:
        result.error = f"HTTP {status}"
        return result

    # Agency case studies → follow through to client site when possible
    if re.search(r"case.?study|agency|studio|labs", urlparse(url).path + url, re.I):
        live = extract_case_study_target(body, final_url)
        if live:
            status2, final2, body2 = fetch_html(live)
            if status2 and status2 < 400:
                result.url = root_url(final2)
                result.source = f"{source} → live site"
                body = body2
                final_url = final2
                status = status2

    score, signals, notes, title = score_html(body, final_url)
    result.score = score
    result.signals = signals
    result.design_notes = notes
    result.title = title or title_hint
    result.status = status
    return result


def dedupe_keep_best(results: list[SiteResult]) -> list[SiteResult]:
    best: dict[str, SiteResult] = {}
    for r in results:
        host = (urlparse(r.url).hostname or "").lower().removeprefix("www.")
        if not host:
            continue
        prev = best.get(host)
        if prev is None or r.score > prev.score:
            best[host] = r
    return sorted(best.values(), key=lambda x: (-x.score, x.url))


def write_report(results: list[SiteResult], out_dir: Path) -> tuple[Path, Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    json_path = out_dir / f"godly-detailing-{stamp}.json"
    md_path = out_dir / f"godly-detailing-{stamp}.md"

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(results),
        "results": [asdict(r) for r in results],
        "shade_and_shine_playbook": PLAYBOOK,
    }
    json_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    lines = [
        "# Godly Detailing Design Research",
        "",
        f"Generated: {payload['generated_at']}",
        "",
        "Ranked auto-detailing / car-care sites scored for premium “godly” design signals "
        "(motion, typography, video, booking UX, dark craft, social proof).",
        "",
        "## Top picks",
        "",
    ]
    for i, r in enumerate(results[:20], 1):
        lines.append(f"### {i}. {r.title or urlparse(r.url).hostname} — score **{r.score}**")
        lines.append(f"- URL: {r.url}")
        lines.append(f"- Source: {r.source}")
        if r.signals:
            lines.append(f"- Signals: {', '.join(r.signals)}")
        if r.design_notes:
            lines.append(f"- Steal for S&S: {'; '.join(r.design_notes)}")
        if r.snippet:
            lines.append(f"- Snippet: {r.snippet[:220]}")
        lines.append("")

    lines.extend(["## Shade & Shine playbook", ""])
    for item in PLAYBOOK:
        lines.append(f"- **{item['area']}**: {item['action']}")
    lines.append("")
    lines.append("## How to use")
    lines.append("1. Open the top 10 URLs on desktop + mobile.")
    lines.append("2. Screenshot hero, packages, proof, and booking flow.")
    lines.append("3. Map 3 patterns into Shade & Shine (hero craft, package UX, motion).")
    lines.append("")

    md_path.write_text("\n".join(lines), encoding="utf-8")
    return json_path, md_path


PLAYBOOK = [
    {
        "area": "Hero",
        "action": "One composition: brand-first name, one line, one CTA, full-bleed car atmosphere — no dashboard clutter.",
    },
    {
        "area": "Typography",
        "action": "Expressive display + refined sans; kill default Inter/Roboto stacks.",
    },
    {
        "area": "Motion",
        "action": "Ship 2–3 intentional motions (hero reveal, package swap, before/after) — not noise.",
    },
    {
        "area": "Packages",
        "action": "Keep escalating PPF visualizer; mirror that clarity on ceramic/tint packages.",
    },
    {
        "area": "Proof",
        "action": "Real project photography + Google reviews near CTAs; before/after as a primary section.",
    },
    {
        "area": "Booking",
        "action": "Primary CTA always visible; quote form pre-selects service from package clicks.",
    },
    {
        "area": "Color",
        "action": "Black studio base + one metallic/blue accent (already on brand) — avoid purple/cream AI clichés.",
    },
]


def main() -> None:
    parser = argparse.ArgumentParser(description="Find godly-designed detailing company websites")
    parser.add_argument("--limit", type=int, default=30, help="Max sites to deeply analyze")
    parser.add_argument(
        "--out",
        type=Path,
        default=Path(__file__).resolve().parent / "output",
        help="Output directory for JSON + Markdown report",
    )
    parser.add_argument("--skip-search", action="store_true", help="Only analyze seed URLs")
    parser.add_argument("--seeds-only-score", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()

    candidates: dict[str, tuple[str, str, str]] = {}

    print("→ Loading seed detailing / car-care URLs…")
    for url in SEED_SITES:
        n = normalize_url(url)
        if n:
            candidates[root_url(n)] = (root_url(n), "seed", "")

    if not args.skip_search:
        print("→ Searching the web for premium detailing designs…")
        hits = search_web(SEARCH_QUERIES + GALLERY_QUERIES, per_query=6)
        for href, title, snippet in hits:
            key = root_url(href)
            if key not in candidates:
                candidates[key] = (href, title or "search", snippet)
        print(f"  collected {len(candidates)} unique hosts")
    else:
        print("  search skipped")

    # Prefer analyzing homepage roots
    queue = list(candidates.items())
    # Light prioritization: seeds + URLs mentioning detail/ppf/ceramic first
    def priority(item: tuple[str, tuple[str, str, str]]) -> tuple[int, str]:
        key, (href, source, _) = item
        blob = f"{key} {source} {href}".lower()
        boost = 0
        if source == "seed":
            boost += 50
        if re.search(r"detail|ppf|ceramic|tint|polish|wrap|car.?care", blob):
            boost += 20
        return (-boost, key)

    queue.sort(key=priority)
    queue = queue[: args.limit]

    print(f"→ Analyzing {len(queue)} sites…")
    results: list[SiteResult] = []
    for i, (host, (href, source, snippet)) in enumerate(queue, 1):
        print(f"  [{i}/{len(queue)}] {host}")
        try:
            results.append(analyze_candidate(href, source=source, snippet=snippet, title_hint=source))
        except Exception as exc:  # noqa: BLE001
            results.append(SiteResult(url=host, source=source, error=str(exc)))
        time.sleep(0.35)

    ranked = dedupe_keep_best([r for r in results if not r.error and r.score > 0])
    # Keep failures separately in JSON via full list, but report focuses on ranked
    json_path, md_path = write_report(ranked, args.out)

    print()
    print(f"✓ Ranked {len(ranked)} sites")
    print(f"✓ Report: {md_path}")
    print(f"✓ Data:   {json_path}")
    print()
    print("Top 8:")
    for i, r in enumerate(ranked[:8], 1):
        print(f"  {i}. [{r.score:3d}] {r.url}  — {', '.join(r.signals[:4])}")


if __name__ == "__main__":
    main()
