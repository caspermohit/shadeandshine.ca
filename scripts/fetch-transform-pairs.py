#!/usr/bin/env python3
"""
Fetch Instagram carousels that work as before/after for Transformations.
Saves pairs into public/assets/projects/transforms/
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

import instaloader
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "projects" / "transforms"
USERNAME = "shadeandshine"
MAX_PAIRS = 4


def to_jpg(src: Path, dest: Path, max_side: int = 1600) -> None:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    scale = min(1.0, max_side / max(w, h))
    if scale < 1:
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=86, optimize=True)


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)
    raw = OUT / "_raw"
    raw.mkdir(exist_ok=True)

    L = instaloader.Instaloader(
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        post_metadata_txt_pattern="",
        dirname_pattern=str(raw),
        filename_pattern="{shortcode}_{mediaid}",
        quiet=True,
    )

    profile = instaloader.Profile.from_username(L.context, USERNAME)
    pairs = []
    # Also collect strong single "after" shots we can pair with nearby posts
    singles: list[dict] = []

    for post in profile.get_posts():
        if len(pairs) >= MAX_PAIRS and len(singles) >= 8:
            break
        if post.is_video and not post.typename == "GraphSidecar":
            continue

        L.download_post(post, target=".")
        imgs = sorted(
            p
            for p in raw.rglob("*")
            if post.shortcode in p.name
            and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        )
        # Keep unique by size
        seen = set()
        unique = []
        for p in imgs:
            key = (p.stat().st_size, p.name.split("_")[0])
            if key in seen:
                continue
            seen.add(key)
            unique.append(p)

        caption = (post.caption or "").split("\n")[0][:60]
        if len(unique) >= 2:
            idx = len(pairs) + 1
            before = OUT / f"before-{idx:02d}.jpg"
            after = OUT / f"after-{idx:02d}.jpg"
            # Convention on detailing IG: often after first, before second — or reverse.
            # Prefer darker/dirtier as before by mean luminance.
            def mean_lum(path: Path) -> float:
                a = list(Image.open(path).convert("L").resize((64, 64)).getdata())
                return sum(a) / len(a)

            a, b = unique[0], unique[1]
            if mean_lum(a) >= mean_lum(b):
                after_src, before_src = a, b
            else:
                before_src, after_src = a, b
            to_jpg(before_src, before)
            to_jpg(after_src, after)
            pairs.append(
                {
                    "id": idx,
                    "title": caption or f"Transformation {idx}",
                    "shortcode": post.shortcode,
                    "before": f"/assets/projects/transforms/before-{idx:02d}.jpg",
                    "after": f"/assets/projects/transforms/after-{idx:02d}.jpg",
                }
            )
            print(f"pair {idx}: {post.shortcode} ({len(unique)} frames)")
        elif unique:
            singles.append(
                {
                    "shortcode": post.shortcode,
                    "caption": caption,
                    "path": unique[0],
                    "lum": float(
                        sum(
                            Image.open(unique[0])
                            .convert("L")
                            .resize((48, 48))
                            .getdata()
                        )
                    )
                    / (48 * 48),
                }
            )

    # If not enough carousel pairs, synthesize from darker→brighter single shots
    while len(pairs) < MAX_PAIRS and len(singles) >= 2:
        singles_sorted = sorted(singles, key=lambda s: s["lum"])
        before_s = singles_sorted[0]
        after_s = singles_sorted[-1]
        if before_s["shortcode"] == after_s["shortcode"]:
            break
        idx = len(pairs) + 1
        before = OUT / f"before-{idx:02d}.jpg"
        after = OUT / f"after-{idx:02d}.jpg"
        to_jpg(before_s["path"], before)
        to_jpg(after_s["path"], after)
        pairs.append(
            {
                "id": idx,
                "title": after_s["caption"] or f"Transformation {idx}",
                "shortcode": after_s["shortcode"],
                "before": f"/assets/projects/transforms/before-{idx:02d}.jpg",
                "after": f"/assets/projects/transforms/after-{idx:02d}.jpg",
                "note": "paired-by-luminance",
            }
        )
        singles = [
            s
            for s in singles
            if s["shortcode"] not in {before_s["shortcode"], after_s["shortcode"]}
        ]
        print(f"synth pair {idx}: {before_s['shortcode']} → {after_s['shortcode']}")

    shutil.rmtree(raw, ignore_errors=True)
    (OUT / "manifest.json").write_text(json.dumps({"pairs": pairs}, indent=2))
    print(f"Wrote {len(pairs)} transform pairs → {OUT}")


if __name__ == "__main__":
    main()
