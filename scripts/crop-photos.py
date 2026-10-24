"""
Re-creates the cropped photos the site uses from the owner's originals
(assets/photo-originals/ -> public/images/).

Why each crop exists (see README "Photo changes"):
- storefront-dusk / storefront-day: remove a cigarette price promo sign ("Right on the Money $4.69").
- storefront-side-ice: remove a window poster advertising tobacco cans.
- coffee-bar: remove a coffee sign reading "EST. 2014" (store opened 2023) and a pizza poster with garbled text.
- slushie-machines: remove a wall sign that reads "185 QUICK STOP" (wrong name).
- ice-cream-freezer: remove the tobacco shelf beside the freezer.
- chips-aisle-wide: remove background signs that read "185 QUICK STOP".
- auto-care: remove garbled background signs.
- interior-counter-wide: keep the "Quick · Clean · Kind" wall, drop the cigarette back bar and garbled banner.
- atm: remove the screen (garbled on-screen text).

Run: python scripts/crop-photos.py
"""
from pathlib import Path
from PIL import Image

PROJECT = Path(__file__).resolve().parent.parent
# Uncropped originals live outside public/ so they are never served by the website.
SOURCE = PROJECT / "assets" / "photo-originals"
OUTPUT = PROJECT / "public" / "images"

CROPS = {
    # source: (output, (left, top, right, bottom))
    "storefront/storefront-dusk.jpg": ("storefront/storefront-dusk-building.jpg", (230, 40, 1448, 750)),
    "storefront/storefront-day.jpg": ("storefront/storefront-day-building.jpg", (0, 150, 1792, 1150)),
    "storefront/storefront-side-ice.jpg": ("storefront/storefront-side-food-signs.jpg", (810, 700, 1792, 1300)),
    "food/coffee-bar.jpg": ("food/coffee-bar-machines.jpg", (310, 250, 1640, 1344)),
    "food/slushie-machines.jpg": ("food/slushie-machines-bowls.jpg", (230, 300, 1792, 1344)),
    "food/ice-cream-freezer.jpg": ("food/ice-cream-freezer-tight.jpg", (60, 30, 995, 1680)),
    "aisles/chips-aisle-wide.jpg": ("aisles/chips-aisle-lower.jpg", (0, 480, 1792, 1344)),
    "aisles/auto-care.jpg": ("aisles/auto-care-shelves.jpg", (130, 330, 1792, 1344)),
    "aisles/interior-counter-wide.jpg": ("aisles/interior-tagline-band.jpg", (230, 380, 1700, 760)),
    "services/atm.jpg": ("services/atm-keypad.jpg", (0, 925, 1264, 1600)),
}

for src, (out, box) in CROPS.items():
    im = Image.open(SOURCE / src)
    cropped = im.crop(box)
    cropped.save(OUTPUT / out, quality=88, optimize=True, progressive=True)
    print(f"{out}: {cropped.size[0]}x{cropped.size[1]}")
