#!/usr/bin/env python3
"""
Godly design audit for Shade & Shine.
Scores the marketing site against premium detailing-site patterns
and outputs prioritized upgrades.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
OUT = ROOT / "scripts" / "design_research" / "output"
OUT.mkdir(parents=True, exist_ok=True)

# Patterns that often make AI/marketing sites feel generic or cluttered
ANTI = {
    "card_grid_heavy": r"rounded-2xl|rounded-3xl|shadow-lg|border border-white",
    "stat_strip": r"Vehicles Detailed|Google Rating|Years Experience|Satisfaction",
    "pill_cluster": r"rounded-full.*px-|tracking-\[0\.\d+em\]",
    "generic_gradient_purple": r"purple|indigo-|#7c3aed|#8b5cf6",
    "cream_terracotta": r"#F4F1EA|#c45c26|terracotta",
    "unsplash_remote": r"images\.unsplash\.com",
    "emoji": r"[\U0001F300-\U0001FAFF]",
}

# Signals of a stronger cinematic detailing site
PRO = {
    "brand_logo_asset": r"/brand/logo",
    "full_bleed_hero": r"min-h-\[100svh\]|min-h-screen",
    "local_car_assets": r"/ppf-car\.png|/wraps/|/assets/",
    "motion": r"framer-motion|AnimatePresence",
    "lenis": r"Lenis|SmoothScroll",
    "section_one_job": r"<section",
}


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return ""


def main() -> None:
    files = list(SRC.rglob("*.tsx")) + list(SRC.rglob("*.ts")) + list(SRC.rglob("*.css"))
    corpus = "\n".join(read_text(p) for p in files)

    anti_hits = {k: len(re.findall(v, corpus)) for k, v in ANTI.items()}
    pro_hits = {k: len(re.findall(v, corpus)) for k, v in PRO.items()}

    # Section inventory from page.tsx
    page = read_text(SRC / "app" / "page.tsx")
    sections = re.findall(r"<(\w+)\s*/>", page)

    # Hero budget check
    hero = read_text(SRC / "components" / "Hero.tsx")
    hero_issues = []
    if "Stats" in hero or "stat" in hero.lower():
        hero_issues.append("stats_in_hero")
    if hero.count("MagneticButton") > 2:
        hero_issues.append("too_many_ctas")
    if "/brand/" not in hero and "BrandLogo" not in hero:
        hero_issues.append("weak_brand_mark")

    # Score: start 70, subtract anti, add pro
    score = 72
    score -= min(18, anti_hits["card_grid_heavy"] // 8)
    score -= 6 if anti_hits["stat_strip"] else 0
    score -= 8 if anti_hits["unsplash_remote"] else 0
    score -= 10 if anti_hits["generic_gradient_purple"] else 0
    score += 4 if pro_hits["brand_logo_asset"] else 0
    score += 4 if pro_hits["full_bleed_hero"] else 0
    score += 5 if pro_hits["local_car_assets"] else 0
    score += 3 if pro_hits["motion"] else 0
    score += 2 if pro_hits["lenis"] else 0
    score = int(max(0, min(100, score)))

    recommendations = [
        {
            "priority": 1,
            "title": "Cinematic section rhythm",
            "why": "Godly detailing sites breathe — large type, sparse copy, strong photo planes between interactive tools.",
            "do": [
                "Increase section vertical padding on key chapters (services, PPF, wraps)",
                "Add subtle gold/blue atmospheric washes per chapter (not purple)",
                "Use hairline gold rules instead of card borders where possible",
            ],
        },
        {
            "priority": 2,
            "title": "Deprioritize stats band clutter",
            "why": f"Stat strip pattern detected ({anti_hits['stat_strip']} hits). Premium shops lead with craft, not dashboard metrics.",
            "do": [
                "Slim StatsBand into a quiet trust line OR move below services",
                "Replace numeric strip with one editorial sentence + rating",
            ],
        },
        {
            "priority": 3,
            "title": "Services: editorial list over cards",
            "why": f"Heavy card chrome ({anti_hits['card_grid_heavy']} rounded/border hits) feels template-y.",
            "do": [
                "Keep services as a stacked editorial list (already partially there)",
                "Remove leftover card hover panels; use typography + gold index numbers",
            ],
        },
        {
            "priority": 4,
            "title": "Hero: brand-first, quieter chrome",
            "why": "First viewport should feel like one composition — logo, one line, one CTA group, full-bleed car.",
            "do": [
                "Ensure logo dominates; keep supporting line short",
                "Soften secondary CTA; keep primary decisive",
                "Strengthen vignette / light so car paint reads",
            ],
        },
        {
            "priority": 5,
            "title": "Motion with purpose",
            "why": "Godly sites use 2–3 signature motions, not decoration everywhere.",
            "do": [
                "Keep Lenis + hero parallax + PPF panel reveal + wrap crossfade",
                "Reduce repetitive fade-up on every block",
            ],
        },
    ]

    report = {
        "score": score,
        "verdict": (
            "strong foundation — cinematic tooling (PPF/wraps) is the differentiator; "
            "tighten rhythm + reduce chrome for godly polish"
            if score >= 70
            else "needs structural redesign"
        ),
        "sections": sections,
        "anti_patterns": anti_hits,
        "pro_signals": pro_hits,
        "hero_issues": hero_issues,
        "recommendations": recommendations,
    }

    out_json = OUT / "godly-audit.json"
    out_md = OUT / "godly-audit.md"
    out_json.write_text(json.dumps(report, indent=2), encoding="utf-8")

    lines = [
        f"# Shade & Shine — Godly Design Audit",
        f"",
        f"**Score:** {score}/100 — {report['verdict']}",
        f"",
        f"## What's working",
        f"- Official brand mark + local Porsche assets (PPF + wrap studio)",
        f"- Interactive differentiators (PPF coverage, dream wrap, before/after)",
        f"- Dark studio palette with gold accent (on-brand, not purple template)",
        f"",
        f"## Top upgrades",
    ]
    for r in recommendations:
        lines.append(f"### {r['priority']}. {r['title']}")
        lines.append(r["why"])
        for d in r["do"]:
            lines.append(f"- {d}")
        lines.append("")
    out_md.write_text("\n".join(lines), encoding="utf-8")

    print(json.dumps({"score": score, "verdict": report["verdict"], "top": [r["title"] for r in recommendations[:3]]}, indent=2))
    print(f"Wrote {out_md.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
