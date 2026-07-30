#!/usr/bin/env python3
"""Bake glass-only VLT levels into public/tints/ from the clean black-BG SUV."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "tints"
SRC = OUT / "source.png"

LEVELS = [
    ("clear", 0.0),
    ("light-50", 0.55),
    ("medium-35", 0.72),
    ("dark-20", 0.86),
    ("limo-5", 0.96),
]

SEEDS = [
    (512, 232), (480, 224), (544, 224), (448, 248), (576, 248),
    (416, 208), (608, 208), (512, 272), (464, 192), (560, 192),
    (384, 256), (640, 256), (512, 176), (450, 300),
]

FALLBACK_POLY = [
    (330, 168), (400, 160), (512, 156), (624, 160), (700, 168),
    (730, 210), (750, 260), (760, 310), (730, 328), (512, 336),
    (294, 328), (270, 310), (278, 260), (298, 210),
]


def glass_mask(car: np.ndarray) -> np.ndarray:
    h, w = car.shape[:2]
    r = car[:, :, 0]
    g = car[:, :, 1]
    b = car[:, :, 2]
    redness = r - np.maximum(g, b)
    lum = car.mean(2)
    sat = (car.max(2) - car.min(2)) / (car.max(2) + 1e-3)
    is_red = (redness > 45) & (r > 100)

    roi = np.zeros((h, w), dtype=bool)
    roi[150:340, 280:760] = True
    cand = roi & (~is_red) & (lum > 8) & (
        (sat < 0.38) | (lum < 100) | ((lum > 80) & (lum < 210) & (sat < 0.5))
    )

    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    for x, y in SEEDS:
        if 0 <= x < w and 0 <= y < h and cand[y, x]:
            visited[y, x] = True
            q.append((x, y))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, 1), (1, -1), (-1, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and cand[ny, nx]:
                visited[ny, nx] = True
                q.append((nx, ny))

    mask = visited.astype(np.float32)
    mimg = Image.fromarray((mask * 255).astype(np.uint8))
    mimg = mimg.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
    mimg = mimg.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    mimg = mimg.filter(ImageFilter.GaussianBlur(1.6))
    mask = np.array(mimg).astype(np.float32) / 255.0
    mask *= 1.0 - is_red.astype(np.float32) * 0.98

    if h >= 1024:
        mask[:156, :] = 0
        for i, y in enumerate(range(156, 164)):
            mask[y] *= (i + 1) / 8.0
        mask = np.array(
            Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8)).filter(
                ImageFilter.GaussianBlur(0.8)
            )
        ).astype(np.float32) / 255.0
        mask *= 1.0 - is_red.astype(np.float32) * 0.99
        mask[:154, :] = 0

    ys, xs = np.where(mask > 0.35)
    ok = (
        len(xs) > 20000
        and float(mask[min(400, h - 1), w // 2]) < 0.15
        and (len(ys) == 0 or int(ys.max()) < 360)
    )
    if not ok:
        pimg = Image.new("L", (w, h), 0)
        ImageDraw.Draw(pimg).polygon(FALLBACK_POLY, fill=255)
        mask = np.array(pimg.filter(ImageFilter.GaussianBlur(1.5))).astype(np.float32) / 255.0
        mask *= 1.0 - is_red.astype(np.float32) * 0.98
    return mask


def apply_tint(rgb: np.ndarray, mask: np.ndarray, strength: float) -> np.ndarray:
    if strength < 0.01:
        return rgb.copy()
    m = mask * strength
    out = rgb * (1.0 - m[..., None] * 0.94)
    mid = np.clip((rgb.mean(2) - 35) / 150.0, 0, 1)
    out = out * (1.0 - (m * mid * strength * 0.7)[..., None])
    hi = np.clip((rgb.max(2) - 190) / 50.0, 0, 1) * mask * (1 - strength * 0.85)
    return np.clip(out + hi[..., None] * 18, 0, 255)


def main() -> None:
    if not SRC.exists():
        raise FileNotFoundError(f"Missing {SRC}")

    OUT.mkdir(parents=True, exist_ok=True)
    car = np.array(Image.open(SRC).convert("RGB")).astype(np.float32)
    mask = glass_mask(car)

    for slug, strength in LEVELS:
        tinted = apply_tint(car, mask, strength)
        Image.fromarray(tinted.astype(np.uint8)).save(OUT / f"{slug}.png", optimize=True)
        print(f"wrote {slug}")

    diff = (apply_tint(car, mask, 0.0) - apply_tint(car, mask, 0.96)).mean(2)
    assert float(diff[min(400, car.shape[0] - 1), car.shape[1] // 2]) < 2.0
    assert float(diff[240, car.shape[1] // 2]) > 30.0
    print("done")


if __name__ == "__main__":
    main()
