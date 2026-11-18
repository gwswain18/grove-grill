"""Shrink photos the owner uploads through the admin.

A photo straight from a phone can be 5 MB or more, which makes the page slow to open on a phone.
This walks the folders it is given and rewrites any photo that is too big: it turns the photo the
right way up, scales it down so the longest side is at most MAX_SIDE pixels, and saves it again
without the hidden camera details (which can include where the photo was taken).

Photos that are already small are left exactly as they are, so running this twice changes nothing.

Usage: shrink_photos.py <folder> [<folder> ...]      (needs Pillow)
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

MAX_SIDE = 1600           # pixels, longest side
MAX_BYTES = 450 * 1024    # anything heavier than this is saved again
TYPES = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG", ".webp": "WEBP"}


def has_private_details(img):
    """True when the photo is stored sideways or carries a GPS position."""
    try:
        exif = img.getexif()
    except Exception:
        return False
    return exif.get(0x0112, 1) != 1 or bool(exif.get_ifd(0x8825))


def shrink(path):
    """Rewrite one photo if it needs it. Returns a short note, or None when it was left alone."""
    kind = TYPES.get(path.suffix.lower())
    if not kind:
        return None
    before = path.stat().st_size
    with Image.open(path) as img:
        img.load()
        too_wide = max(img.size) > MAX_SIDE
        private = has_private_details(img)
        if not (too_wide or private or before > MAX_BYTES):
            return None
        out = ImageOps.exif_transpose(img)
        if too_wide:
            out.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        if kind == "JPEG":
            out = out.convert("RGB")
            options = dict(quality=82, optimize=True, progressive=True)
        elif kind == "WEBP":
            options = dict(quality=82, method=6)
        else:
            options = dict(optimize=True)
        # Save to a temporary file first so a failure can never leave a half-written photo behind.
        tmp = path.with_name(path.name + ".tmp")
        out.save(tmp, kind, **options)
        size = out.size
    after = tmp.stat().st_size
    if after >= before and not (too_wide or private):
        # Saving again did not help (it can make a small, well-compressed photo bigger).
        tmp.unlink()
        return None
    tmp.replace(path)
    return f"{path}: {before // 1024} KB -> {after // 1024} KB, {size[0]}x{size[1]}"


def main(folders):
    changed = 0
    for folder in folders:
        for path in sorted(Path(folder).rglob("*")):
            if not path.is_file():
                continue
            try:
                note = shrink(path)
            except Exception as err:  # one odd file must never stop the rest
                print(f"skipped {path}: {err}")
                continue
            if note:
                print(note)
                changed += 1
    print(f"{changed} photo(s) shrunk")


if __name__ == "__main__":
    main(sys.argv[1:])
