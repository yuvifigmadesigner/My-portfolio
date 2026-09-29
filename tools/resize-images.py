"""Make the small, compressed copies of the site's images.

The site never loads the big originals in Assets/. It loads the copies in each
folder's `sizes/` subfolder (name-<width>.webp), so phones get small files and
big screens get sharp ones.

To change an image:
  1. Replace the original, keeping its name (e.g. Assets/about/photo.webp).
  2. Run:  python tools/resize-images.py
Only images that changed are rebuilt. Add --all to rebuild everything.
Needs Python 3 with Pillow (pip install pillow).
"""
import glob
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

# original (glob) -> (widths in px, webp quality). None = keep the original width.
JOBS = [
    ('Assets/about/photo.webp',            [400, 800, 1200], 82),
    ('Assets/work/nook.webp',              [400, 800, 1200], 82),
    ('Assets/work/better-decisions.webp',  [400, 800, 1200], 82),
    ('Assets/work/zefyron.webp',           [420, 840, 1260], 82),
    ('Assets/nook/cover.webp',             [720, 1072, 1428], 82),
    ('Assets/nook/research.webp',          [720, 1072, 1428], 82),
    ('Assets/nook/park.webp',              [800, 1440, 2880], 80),
    ('Assets/nook/post-card.webp',         [None], 82),
    ('Assets/nook/card-pattern.webp',      [None], 85),
    ('Assets/nook/screens/*.webp',         [216, 324, 432], 82),
    ('Assets/mascots/mascot-peek.webp',    [None], 85),
    ('Assets/mascots/mascot-sleep.webp',   [None], 85),
    ('Assets/mascots/mascot-chat.webp',    [None], 85),
    ('Assets/mascots/mascot-reading.webp', [None], 85),
    ('Assets/icons/tools/*.webp',          [132], 85),
]


def build(src, widths, quality, force):
    folder, name = os.path.split(src)
    stem = os.path.splitext(name)[0]
    out_dir = os.path.join(folder, 'sizes')
    os.makedirs(out_dir, exist_ok=True)
    image = None
    for width in widths:
        if width is None:
            with Image.open(src) as probe:
                width = probe.size[0]
        out = os.path.join(out_dir, f'{stem}-{width}.webp')
        if not force and os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
            continue
        if image is None:
            image = Image.open(src)
            image.load()
            image = image.convert('RGBA')
        copy = image
        if width < image.size[0]:
            copy = image.resize((width, round(image.size[1] * width / image.size[0])), Image.LANCZOS)
        copy.save(out, 'WEBP', quality=quality, method=6)
        print(f'  {os.path.relpath(out, ROOT):58} {os.path.getsize(out) / 1024:6.1f} KB')


def main():
    force = '--all' in sys.argv
    os.chdir(ROOT)
    for pattern, widths, quality in JOBS:
        matches = sorted(glob.glob(pattern))
        if not matches:
            print(f'! nothing matches {pattern}')
        for src in matches:
            build(src, widths, quality, force)
    print('done')


if __name__ == '__main__':
    main()
