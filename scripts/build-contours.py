"""
Builds public/textures/contours.svg: an original, tileable pattern of topographic
contour lines (gentle rolling hills). It is not traced from any real map: the hills
are a smooth periodic function, so the tile repeats seamlessly in both directions.

The SVG is used as a CSS mask (see .texture-contour in app/globals.css), so its own
stroke color doesn't matter; the visible color comes from the theme tokens.

Usage: python scripts/build-contours.py   (needs numpy and matplotlib)
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

W, H = 640, 400  # tile size in px (also the CSS mask size, so strokes stay 1px)
OUT = Path(__file__).resolve().parent.parent / "public" / "textures" / "contours.svg"
rng = np.random.default_rng(185)

xs = np.linspace(0, W, 321)
ys = np.linspace(0, H, 201)
X, Y = np.meshgrid(xs, ys)


def wrap(d, period):
    return (d + period / 2) % period - period / 2


field = np.zeros_like(X)
for _ in range(7):  # broad hills, wrapped so the tile is seamless
    cx, cy = rng.uniform(0, W), rng.uniform(0, H)
    sx, sy = rng.uniform(70, 150), rng.uniform(50, 110)
    amp = rng.uniform(0.6, 1.2)
    dx, dy = wrap(X - cx, W), wrap(Y - cy, H)
    field += amp * np.exp(-(dx**2 / (2 * sx**2) + dy**2 / (2 * sy**2)))
# long gentle ridges (periodic in both directions)
field += 0.18 * np.sin(2 * np.pi * (X / W + 2 * Y / H)) + 0.12 * np.cos(2 * np.pi * (2 * X / W - Y / H))

levels = np.linspace(field.min(), field.max(), 13)[1:-1]
cs = plt.contour(X, Y, field, levels=levels)


def simplify(points, tol):
    """Ramer-Douglas-Peucker."""
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    ab = b - a
    norm = np.hypot(*ab) or 1.0
    dists = np.abs(np.cross(ab, points - a)) / norm
    i = int(np.argmax(dists))
    if dists[i] > tol:
        return np.vstack([simplify(points[: i + 1], tol)[:-1], simplify(points[i:], tol)])
    return np.vstack([a, b])


paths = []
for segs in cs.allsegs:
    for seg in segs:
        if len(seg) < 4:
            continue
        pts = np.round(simplify(np.asarray(seg), 1.4)).astype(int)
        if len(pts) < 2:
            continue
        d = f"M{pts[0][0]} {pts[0][1]}" + "".join(
            f"l{dx} {dy}" for dx, dy in np.diff(pts, axis=0) if dx or dy
        )
        paths.append(d)

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
    f'<path fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="{"".join(paths)}"/></svg>'
)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(svg, encoding="utf8")
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes, {len(paths)} lines)")
