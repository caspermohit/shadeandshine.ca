#!/usr/bin/env python3
"""
Analyze the wrap-studio base car and bake color variants as PNGs.

Uses public/ppf-car.png (white Porsche, transparent BG) as the canvas —
same asset as the PPF visualizer — so Dream Wrap feels consistent.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "ppf-car.png"
# Prefer dedicated wrap source if present
ALT = ROOT / "public" / "img" / "porsche-white-bg-e1760411459923.png"
OUT = ROOT / "public" / "wraps"
ANALYSIS = OUT / "analysis.json"

WRAPS = [
    # id, name, RGB, matte(0-1), shift(secondary RGB or None), shimmer
    ("midnight", "Midnight Black", (42, 44, 54), 0.18, None, False),
    ("arctic", "Arctic White", (236, 238, 242), 0.05, None, False),
    ("crimson", "Crimson Red", (168, 22, 34), 0.1, None, False),
    ("ocean", "Ocean Blue", (28, 78, 168), 0.1, None, False),
    ("aurora", "Aurora Shift", (148, 40, 210), 0.05, (20, 210, 230), True),
    ("chameleon", "Chameleon", (34, 175, 100), 0.05, (230, 150, 45), True),
    ("satin-chrome", "Satin Chrome", (138, 142, 152), 0.35, (200, 205, 214), False),
    ("matte-forge", "Matte Forge", (118, 112, 104), 0.55, None, False),
]


def smoothstep(x: np.ndarray, edge0: float, edge1: float) -> np.ndarray:
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def analyze(rgb: np.ndarray, alpha: np.ndarray) -> dict:
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    opaque = alpha > 20
    body = opaque & (lum > 70)
    glassish = opaque & (lum > 18) & (lum < 70)
    dark = opaque & (lum <= 18)

    return {
        "size": [int(rgb.shape[1]), int(rgb.shape[0])],
        "opaque_frac": float(opaque.mean()),
        "body_frac": float(body.mean()),
        "glassish_frac": float(glassish.mean()),
        "dark_trim_frac": float(dark.mean()),
        "lum_mean_body": float(lum[body].mean()) if body.any() else 0.0,
        "lum_mean_glass": float(lum[glassish].mean()) if glassish.any() else 0.0,
    }


def paint_mask(lum: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """
    Soft mask of body panels to recolor.
    Keeps tires / grille / deep glass mostly untouched.
    """
    a = alpha.astype(np.float32) / 255.0
    # Body paint on this white car is bright; glass/trim fall off below ~70
    body = smoothstep(lum, 35.0, 95.0)
    # Soften extreme specular so chrome bits stay believable
    return np.clip(body * a, 0.0, 1.0)


def colorize_shade(
    lum: np.ndarray,
    color: tuple[int, int, int],
    matte: float,
    shift: tuple[int, int, int] | None,
    x_norm: np.ndarray,
) -> np.ndarray:
    t = np.clip(lum / 255.0, 0.0, 1.0)
    # Slightly lift midtones so dark wraps still read shape
    shade = np.power(t, 0.78 + 0.22 * matte)

    c0 = np.array(color, dtype=np.float32)
    if shift is not None:
        c1 = np.array(shift, dtype=np.float32)
        # Color-shift: blend hues by horizontal position + luminance
        mix = np.clip(0.35 + 0.55 * x_norm + 0.25 * (1.0 - t), 0.0, 1.0)
        base_c = c0 * (1.0 - mix[..., None]) + c1 * mix[..., None]
    else:
        base_c = c0

    painted = base_c * shade[..., None]

    # Specular: matte kills highlights; gloss keeps white sheen
    highlight = np.clip((t - (0.55 + 0.22 * matte)) / (0.45 - 0.12 * matte), 0.0, 1.0)
    highlight = highlight * highlight
    sheen = 1.0 - 0.8 * matte
    painted = painted * (1.0 - highlight[..., None] * 0.5 * sheen) + (
        255.0 * highlight[..., None] * 0.95 * sheen
        + painted * highlight[..., None] * (1.0 - 0.95 * sheen)
    )

    return np.clip(painted, 0, 255)


def studio_spotlights(h: int, w: int) -> np.ndarray:
    """Soft white key / fill / rim lights (0–1) for showing wrap color."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xn, yn = xx / max(w - 1, 1), yy / max(h - 1, 1)

    def spot(cx: float, cy: float, sx: float, sy: float, gain: float) -> np.ndarray:
        return gain * np.exp(-(((xn - cx) / sx) ** 2 + ((yn - cy) / sy) ** 2))

    key = spot(0.32, 0.18, 0.38, 0.42, 1.0)  # upper-left key
    fill = spot(0.62, 0.55, 0.45, 0.5, 0.42)  # mid fill
    rim = spot(0.88, 0.28, 0.28, 0.36, 0.7)  # right rim
    hood = spot(0.42, 0.32, 0.22, 0.18, 0.55)  # hood pop
    return np.clip(key + fill + rim + hood, 0.0, 1.0)


def apply_midnight(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """
    Glossy midnight black tuned for a black studio UI:
    deep body, thin speculars, cool edge rim — not washed grey.
    """
    from PIL import ImageFilter as _IF

    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    h, w = lum.shape
    t = np.clip(lum / 255.0, 0.0, 1.0)
    mask = paint_mask(lum, alpha)
    lights = studio_spotlights(h, w)

    a_img = Image.fromarray(alpha.astype(np.uint8), "L")
    edge = np.array(a_img.filter(_IF.FIND_EDGES), dtype=np.float32) / 255.0
    edge = (
        np.array(
            Image.fromarray((np.clip(edge, 0, 1) * 255).astype(np.uint8)).filter(
                _IF.GaussianBlur(2.5)
            ),
            dtype=np.float32,
        )
        / 255.0
    )
    edge = np.clip(edge * 1.8, 0, 1) * (alpha.astype(np.float32) / 255.0)

    body_color = np.array([18.0, 19.0, 24.0], dtype=np.float32)
    shade = np.power(np.clip(t * 1.05 + 0.04, 0, 1), 0.9)
    painted = np.clip(body_color * (shade[..., None] * 2.2), 0, 48)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xn, yn = xx / max(w - 1, 1), yy / max(h - 1, 1)
    side_fill = np.exp(-(((xn - 0.62) / 0.38) ** 2 + ((yn - 0.52) / 0.42) ** 2))
    side_fill = side_fill * mask * (0.55 + 0.45 * t)
    painted = painted + side_fill[..., None] * np.array([14.0, 15.0, 20.0])

    spec = np.clip((t - 0.80) / 0.20, 0.0, 1.0) ** 2.4
    spec = np.clip(spec + lights * np.clip((t - 0.72) / 0.28, 0, 1) * 0.35, 0, 1) * mask
    painted = painted * (1.0 - spec[..., None]) + np.array([230.0, 236.0, 245.0]) * spec[
        ..., None
    ]

    painted = painted + edge[..., None] * np.array([55.0, 65.0, 85.0])
    painted = painted + (lights * mask * 0.22)[..., None] * np.array([20.0, 24.0, 34.0])

    out = rgb * (1.0 - mask[..., None]) + np.clip(painted, 0, 255) * mask[..., None]
    return np.dstack([np.clip(out, 0, 255).astype(np.uint8), alpha.astype(np.uint8)])


def apply_wrap(
    rgb: np.ndarray,
    alpha: np.ndarray,
    color: tuple[int, int, int],
    matte: float,
    shift: tuple[int, int, int] | None,
    wrap_id: str | None = None,
) -> np.ndarray:
    if wrap_id == "midnight":
        return apply_midnight(rgb, alpha)

    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    h, w = lum.shape
    x_norm = np.linspace(0.0, 1.0, w, dtype=np.float32)[None, :].repeat(h, axis=0)
    mask = paint_mask(lum, alpha)
    painted = colorize_shade(lum, color, matte, shift, x_norm)
    out = rgb * (1.0 - mask[..., None]) + painted * mask[..., None]

    # Bake soft white spotlights onto body so wrap color reads clearly
    lights = studio_spotlights(h, w) * mask * (1.0 - 0.55 * matte)
    # Soft-light toward white without crushing chroma in midtones
    out = out + lights[..., None] * (255.0 - out) * 0.28
    # Extra specular glints on gloss finishes
    glint = np.clip(lights - 0.62, 0.0, 1.0) ** 2 * (1.0 - matte)
    out = out + glint[..., None] * 40.0
    # Keep dark/matte wraps readable on black UI backgrounds
    if matte >= 0.45 or (color[0] + color[1] + color[2]) < 120:
        out = out + mask[..., None] * 22.0

    rgba = np.dstack([np.clip(out, 0, 255).astype(np.uint8), alpha])
    return rgba


def main() -> None:
    src = SRC if SRC.exists() else ALT
    if not src.exists():
        raise SystemExit(f"Missing source car image: {SRC} or {ALT}")

    OUT.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.float32)
    alpha = arr[:, :, 3]

    stats = analyze(rgb, alpha)
    stats["source"] = str(src.relative_to(ROOT))
    print("Analysis:", json.dumps(stats, indent=2))

    # Base PNG (normalized export)
    base_path = OUT / "base.png"
    im.save(base_path, optimize=True)
    print(f"Wrote {base_path.relative_to(ROOT)}")

    # Debug mask preview
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    mask = (paint_mask(lum, alpha) * 255).astype(np.uint8)
    Image.fromarray(mask).save(OUT / "_paint-mask.png")

    manifest = []
    for wid, name, color, matte, shift, shimmer in WRAPS:
        rgba = apply_wrap(rgb, alpha, color, matte, shift, wrap_id=wid)
        path = OUT / f"{wid}.png"
        Image.fromarray(rgba, "RGBA").save(path, optimize=True)
        entry = {
            "id": wid,
            "name": name,
            "src": f"/wraps/{wid}.png",
            "accent": "#{:02x}{:02x}{:02x}".format(*color),
            "shimmer": shimmer,
            "matte": matte,
        }
        manifest.append(entry)
        print(f"Wrote {path.relative_to(ROOT)}  ({name})")

    ANALYSIS.write_text(json.dumps({"analysis": stats, "wraps": manifest}, indent=2))
    print(f"Wrote {ANALYSIS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
