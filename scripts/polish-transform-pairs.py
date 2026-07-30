#!/usr/bin/env python3
"""Polish before/after transform pairs for cleaner slider presentation.

- Matches each pair to a shared center crop (same framing feel)
- Gentle clarity / contrast so dirt vs clean reads clearly
- Writes optimized JPEGs in place (keeps originals as *.orig.jpg once)
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "projects" / "transforms"
TARGET = (1600, 1000)


def backup(path: Path) -> None:
    orig = path.with_suffix(".orig.jpg")
    if not orig.exists():
        orig.write_bytes(path.read_bytes())


def cover_crop(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Center-crop to aspect, then resize — keeps subject framed consistently."""
    tw, th = size
    w, h = im.size
    target_aspect = tw / th
    src_aspect = w / h
    if src_aspect > target_aspect:
        # too wide — crop sides
        nw = int(h * target_aspect)
        left = (w - nw) // 2
        im = im.crop((left, 0, left + nw, h))
    else:
        nh = int(w / target_aspect)
        top = int((h - nh) * 0.38)  # bias slightly up (cabin / seat)
        top = max(0, min(top, h - nh))
        im = im.crop((0, top, w, top + nh))
    return im.resize(size, Image.Resampling.LANCZOS)


def polish(im: Image.Image, *, after: bool) -> Image.Image:
    im = ImageOps.exif_transpose(im).convert("RGB")
    im = cover_crop(im, TARGET)
    # Mild denoise + sharpen for web
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=2))
    if after:
        im = ImageEnhance.Contrast(im).enhance(1.08)
        im = ImageEnhance.Color(im).enhance(1.06)
        im = ImageEnhance.Brightness(im).enhance(1.02)
    else:
        # Keep before a touch flatter so the reveal pops
        im = ImageEnhance.Contrast(im).enhance(1.04)
        im = ImageEnhance.Color(im).enhance(0.98)
    return im


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for i in range(1, 4):
        before_p = OUT / f"before-{i:02d}.jpg"
        after_p = OUT / f"after-{i:02d}.jpg"
        if not before_p.exists() or not after_p.exists():
            print(f"skip {i}: missing files")
            continue
        backup(before_p)
        backup(after_p)
        # Prefer originals if we already polished once
        before_src = before_p.with_suffix(".orig.jpg")
        after_src = after_p.with_suffix(".orig.jpg")
        before = polish(Image.open(before_src), after=False)
        after = polish(Image.open(after_src), after=True)
        before.save(before_p, "JPEG", quality=88, optimize=True, progressive=True)
        after.save(after_p, "JPEG", quality=88, optimize=True, progressive=True)
        print(f"polished pair {i:02d} → {TARGET[0]}x{TARGET[1]}")
    print("done")


if __name__ == "__main__":
    main()
