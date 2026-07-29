#!/usr/bin/env python3
"""Rasterize CM Auto Detailing SVG panels onto public/ppf-car.png (1600×584).

Uses the exact Inkscape coordinate system + image placement from
cmautodetailing.ca so the blue coverage sits flush on the Porsche.

Usage:
  python3 scripts/generate-ppf-masks.py
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter
from svgpathtools import parse_path

ROOT = Path(__file__).resolve().parents[1]
CAR_PATH = ROOT / "public" / "ppf-car.png"
SVG_PATH = ROOT / "public" / "ppf-overlay.svg"
OUT_DIR = ROOT / "public" / "ppf-masks"

BLUE = (0, 144, 255)
ALPHA = 102  # ~40% like CM

# CM SVG constants
VB_W, VB_H = 201.46048, 66.655319
G_TX, G_TY = -4.0, -192.0
IMG_TX, IMG_TY = -8.0, 205.0
IMG_SCALE = 1.11

# Image element box in viewBox space (after both transforms)
BOX_X = G_TX + IMG_TX  # -12
BOX_Y = G_TY + IMG_TY  # 13
BOX_W = VB_W * IMG_SCALE
BOX_H = VB_H * IMG_SCALE

# Fine balance nudge in PNG pixels (positive = right / down)
ALIGN_DX = 0
ALIGN_DY = 0

# Exact CM Auto Detailing data-panels maps
# Bronze = basic, Silver = full-front, Gold = full-body
PACKAGE_PANELS: dict[str, list[str]] = {
    "bronze": ["upper-bumper", "partial-fender-2"],
    "silver": ["upper-bumper", "lower-bumper", "mirror", "partial-fender-2"],
    "gold": [
        "full-bumper-2",
        "mirror",
        "partial-fender-2",
        "fender",
        "hood",
    ],
    "platinum": [
        "headlights",
        "full-bumper-2",
        "partial-fender-2",
        "fender",
        "hood",
        "rocker",
        "door",
        "quarter",
        "mirror",
        "roof",
        "rear-bumper",
    ],
}


def image_placement(pw: int, ph: int) -> tuple[float, float, float, float]:
    """Where the PNG sits inside the CM <image> box (preserveAspectRatio=meet)."""
    # Uniform scale limited by the tighter axis (meet)
    s = min(BOX_W / pw, BOX_H / ph)
    disp_w = pw * s
    disp_h = ph * s
    # Centered in the image box
    origin_x = BOX_X + (BOX_W - disp_w) / 2
    origin_y = BOX_Y + (BOX_H - disp_h) / 2
    return origin_x, origin_y, disp_w, disp_h


def svg_to_png(
    x: float,
    y: float,
    pw: int,
    ph: int,
    origin_x: float,
    origin_y: float,
    disp_w: float,
    disp_h: float,
) -> tuple[float, float]:
    """Map Inkscape path coords → PNG pixels via CM image placement."""
    vb_x = x + G_TX
    vb_y = y + G_TY
    px = (vb_x - origin_x) / disp_w * pw + ALIGN_DX
    py = (vb_y - origin_y) / disp_h * ph + ALIGN_DY
    return px, py


def load_panel_paths(svg_file: Path) -> dict[str, str]:
    tree = ET.parse(svg_file)
    root = tree.getroot()
    panels: dict[str, str] = {}
    for el in root.iter():
        tag = el.tag.split("}")[-1]
        if tag != "path":
            continue
        pid = el.attrib.get("id")
        d = el.attrib.get("d")
        if pid and d:
            panels[pid] = d
    return panels


def path_to_polygon(
    d: str,
    pw: int,
    ph: int,
    placement: tuple[float, float, float, float],
    extra_ty: float = 0.0,
) -> list[tuple[float, float]]:
    path = parse_path(d)
    ox, oy, dw, dh = placement
    pts: list[tuple[float, float]] = []
    n = max(100, int(path.length() / 0.3) if path.length() else 100)
    for i in range(n + 1):
        t = i / n
        try:
            pt = path.point(t)
        except Exception:
            continue
        x, y = svg_to_png(pt.real, pt.imag + extra_ty, pw, ph, ox, oy, dw, dh)
        pts.append((x, y))
    return pts


def rasterize_panels(
    panel_ids: list[str],
    panel_ds: dict[str, str],
    size: tuple[int, int],
    placement: tuple[float, float, float, float],
) -> Image.Image:
    w, h = size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    for pid in panel_ids:
        d = panel_ds.get(pid)
        if not d:
            print(f"  missing panel: {pid}")
            continue
        extra_ty = 98.23 if pid == "roof" else 0.0
        poly = path_to_polygon(d, w, h, placement, extra_ty=extra_ty)
        if len(poly) >= 3:
            draw.polygon(poly, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(0.7))


def clip_to_car(mask: Image.Image, car: Image.Image) -> Image.Image:
    """Drop blue that lands on empty (transparent) background only."""
    w, h = mask.size
    px = car.load()
    m = mask.load()
    out = Image.new("L", (w, h), 0)
    o = out.load()
    for y in range(h):
        for x in range(w):
            a = m[x, y]
            if a < 8:
                continue
            # Keep wherever the car asset has pixels (including dark intakes)
            if px[x, y][3] < 40:
                continue
            o[x, y] = a
    return out


def save_mask(mask: Image.Image, path: Path) -> Image.Image:
    w, h = mask.size
    rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    rgba.paste(Image.new("RGBA", (w, h), (*BLUE, ALPHA)), (0, 0), mask)
    rgba.save(path)
    return rgba


def main() -> None:
    car = Image.open(CAR_PATH).convert("RGBA")
    w, h = car.size
    placement = image_placement(w, h)
    ox, oy, dw, dh = placement
    print(f"car {w}x{h}")
    print(f"image box: ({BOX_X:.2f},{BOX_Y:.2f}) {BOX_W:.2f}x{BOX_H:.2f}")
    print(f"png place: ({ox:.2f},{oy:.2f}) {dw:.2f}x{dh:.2f}  letterbox x={(BOX_W-dw)/2:.2f}")

    panel_ds = load_panel_paths(SVG_PATH)
    print(f"loaded {len(panel_ds)} panels: {sorted(panel_ds)}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    bg = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    base = Image.alpha_composite(bg, car)

    for name, ids in PACKAGE_PANELS.items():
        print(f"rasterizing {name}…")
        mask = rasterize_panels(ids, panel_ds, (w, h), placement)
        mask = clip_to_car(mask, car)
        rgba = save_mask(mask, OUT_DIR / f"{name}.png")
        preview = Image.alpha_composite(base, rgba)
        preview.save(OUT_DIR / f"_preview-{name}.png")
        print(f"  wrote {name}.png + preview")


if __name__ == "__main__":
    main()
