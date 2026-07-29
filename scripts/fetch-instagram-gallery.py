#!/usr/bin/env python3
"""
Pull recent public posts from @shadeandshine and map them into
gallery project assets for the marketing site.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

import instaloader
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "assets" / "instagram"
META_PATH = OUT_DIR / "manifest.json"
USERNAME = "shadeandshine"
MAX_POSTS = 12


def clean_caption(caption: str | None) -> tuple[str, str]:
    """Return (title, service) guesses from caption."""
    if not caption:
        return ("Shade & Shine Project", "Detailing")

    first = caption.strip().split("\n")[0].strip()
    first = re.sub(r"#\w+", "", first).strip(" -–—|")
    first = re.sub(r"\s+", " ", first)
    if len(first) > 48:
        first = first[:45].rstrip() + "…"
    if not first:
        first = "Shade & Shine Project"

    lower = caption.lower()
    service = "Detailing"
    for key, label in [
        ("ppf", "Paint Protection Film"),
        ("paint protection", "Paint Protection Film"),
        ("ceramic", "Ceramic Coating"),
        ("feynlab", "Ceramic Coating"),
        ("tint", "Window Tint"),
        ("wrap", "Vinyl Wrap"),
        ("correction", "Paint Correction"),
        ("detail", "Full Detail"),
    ]:
        if key in lower:
            service = label
            break
    return first, service


def to_web_jpg(src: Path, dest: Path, max_side: int = 1600) -> None:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    scale = min(1.0, max_side / max(w, h))
    if scale < 1.0:
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=86, optimize=True)


def main() -> None:
    if OUT_DIR.exists():
        # keep folder, clear previous jpgs/manifest
        for p in OUT_DIR.glob("*"):
            if p.is_file():
                p.unlink()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    L = instaloader.Instaloader(
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        post_metadata_txt_pattern="",
        dirname_pattern=str(OUT_DIR / "_raw"),
        filename_pattern="{shortcode}",
        quiet=True,
    )

    print(f"Fetching @{USERNAME} …")
    profile = instaloader.Profile.from_username(L.context, USERNAME)
    print(f"Profile: {profile.full_name} · {profile.mediacount} posts")

    projects = []
    count = 0
    for post in profile.get_posts():
        if count >= MAX_POSTS:
            break
        if post.is_video:
            continue

        L.download_post(post, target="_raw")
        # Find downloaded image(s) for this shortcode
        raw_dir = OUT_DIR / "_raw"
        candidates = sorted(raw_dir.glob(f"{post.shortcode}*"))
        img_files = [
            p
            for p in candidates
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ]
        if not img_files:
            # sidecar / alternate naming
            img_files = [
                p
                for p in raw_dir.rglob("*")
                if post.shortcode in p.name
                and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
            ]
        if not img_files:
            print(f"  skip {post.shortcode}: no image")
            continue

        # Prefer first frame of carousel
        src = img_files[0]
        dest_name = f"project-{count + 1:02d}.jpg"
        dest = OUT_DIR / dest_name
        to_web_jpg(src, dest)

        title, service = clean_caption(post.caption)
        entry = {
            "id": count + 1,
            "title": title,
            "service": service,
            "image": f"/assets/instagram/{dest_name}",
            "shortcode": post.shortcode,
            "url": f"https://www.instagram.com/p/{post.shortcode}/",
            "likes": post.likes,
            "date": post.date_utc.isoformat(),
        }
        projects.append(entry)
        count += 1
        print(f"  [{count}] {dest_name} ← {title} ({service})")

    # cleanup raw downloads
    raw = OUT_DIR / "_raw"
    if raw.exists():
        shutil.rmtree(raw, ignore_errors=True)

    META_PATH.write_text(json.dumps({"username": USERNAME, "projects": projects}, indent=2))
    print(f"\nWrote {len(projects)} images → {OUT_DIR}")
    print(f"Manifest → {META_PATH}")

    # Emit TS snippet for convenience
    ts_path = OUT_DIR / "gallery-snippet.ts"
    lines = ["export const galleryProjects = ["]
    for p in projects[:8]:
        title = p["title"].replace('"', '\\"')
        lines.append("  {")
        lines.append(f"    id: {p['id']},")
        lines.append(f'    title: "{title}",')
        lines.append(f'    service: "{p["service"]}",')
        lines.append(f'    image: "{p["image"]}",')
        lines.append("  },")
    lines.append("];")
    ts_path.write_text("\n".join(lines) + "\n")
    print(f"Snippet → {ts_path}")


if __name__ == "__main__":
    main()
