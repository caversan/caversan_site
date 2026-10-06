"""Generate smaller lossless WebP assets and update local references."""
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.image-tools'))
from PIL import Image

replacements = {}
report = []
for source in sorted((ROOT / 'img').rglob('*')):
    if source.suffix.lower() not in {'.png', '.jpg', '.jpeg'}:
        continue
    with Image.open(source) as image:
        if getattr(image, 'is_animated', False):
            continue
        pixels = image.convert('RGBA')
        target = source.with_suffix('.webp')
        options = dict(lossless=True, quality=100, method=6, exact=True)
        for key in ('icc_profile', 'exif'):
            if image.info.get(key):
                options[key] = image.info[key]
        pixels.save(target, 'WEBP', **options)
    with Image.open(target) as result:
        if result.convert('RGBA').tobytes() != pixels.tobytes():
            target.unlink()
            raise RuntimeError(f'Pixel mismatch: {source}')
    before, after = source.stat().st_size, target.stat().st_size
    if after >= before:
        target.unlink()
        after = before
    else:
        replacements[source.relative_to(ROOT).as_posix()] = target.relative_to(ROOT).as_posix()
    report.append(dict(file=source.relative_to(ROOT).as_posix(), before=before, after=after))

for folder in ('js', 'css', 'scripts'):
    for path in (ROOT / folder).rglob('*'):
        if path.suffix in {'.js', '.cjs', '.json', '.css'}:
            content = path.read_text(encoding='utf-8')
            updated = content
            for old, new in replacements.items():
                updated = updated.replace(old, new)
            if updated != content:
                path.write_text(updated, encoding='utf-8')
for path in (ROOT / 'index.html',):
    content = path.read_text(encoding='utf-8')
    for old, new in replacements.items():
        content = content.replace(old, new)
    path.write_text(content, encoding='utf-8')

# Skill illustrations and logos have filenames assembled at runtime.
script = ROOT / 'js/script.js'
content = script.read_text(encoding='utf-8')
for old, new in replacements.items():
    if old.startswith('img/logos/'):
        content = content.replace('"' + Path(old).name + '"', '"' + Path(new).name + '"')
if all(f'img/skills/{name}.png' in replacements for name in ('web', 'iot', 'multimidia')):
    content = content.replace('img/skills/${skillImages[i]}.png', 'img/skills/${skillImages[i]}.webp')
script.write_text(content, encoding='utf-8')
(ROOT / 'scripts/image-optimization-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
before = sum(row['before'] for row in report)
after = sum(row['after'] for row in report)
print(f'{len(report)} images checked; {len(replacements)} smaller variants; {before:,} -> {after:,} bytes ({(1-after/before)*100:.1f}% saved).')
