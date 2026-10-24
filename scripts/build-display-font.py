"""
Builds app/fonts/archivo-display.woff2: Archivo ExtraBold (Google Fonts, SIL Open Font
License) pinned at 118% width and subset to Latin, for the site's display headings.

Usage: python scripts/build-display-font.py [width]
Needs: pip install fonttools brotli
"""
import io
import sys
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

WIDTH = float(sys.argv[1]) if len(sys.argv) > 1 else 118
CSS_URL = f"https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@{WIDTH:g},800&display=swap"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
OUT = Path(__file__).resolve().parent.parent / "app" / "fonts" / "archivo-display.woff2"

css = urllib.request.urlopen(urllib.request.Request(CSS_URL, headers={"User-Agent": UA})).read().decode()
latin = css[css.index("/* latin */"):]
url = latin[latin.index("url(") + 4 : latin.index(")")]
font = TTFont(io.BytesIO(urllib.request.urlopen(url).read()))

if "fvar" in font:
    axes = {a.axisTag for a in font["fvar"].axes}
    font = instancer.instantiateVariableFont(font, {k: v for k, v in {"wdth": WIDTH, "wght": 800}.items() if k in axes})

opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["kern", "liga", "calt", "case"]
opts.name_IDs = ["*"]
unicodes = list(range(0x20, 0x7F)) + [0xA0, 0xA9, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2044]
subsetter = subset.Subsetter(opts)
subsetter.populate(unicodes=unicodes)
subsetter.subset(font)
font.flavor = "woff2"
font.save(OUT)
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
