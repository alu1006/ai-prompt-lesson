"""Encode generated originals for the web; preserve the source PNG files."""
import json
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'web/public/style-previews/v2'
DEST.mkdir(parents=True, exist_ok=True)
manifest = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
record_path = DEST / 'generation.json'
records = json.loads(record_path.read_text(encoding='utf-8')) if record_path.exists() else {}
for item in manifest:
    source = Path(item['source'])
    target = DEST / f"{item['id']}.webp"
    with Image.open(source) as original:
        original.load()
        if original.width < 512 or original.height < 512:
            raise ValueError(f'Unexpectedly small generated image: {source.name}')
        image = original.convert('RGB')
        image.thumbnail((768, 768), Image.Resampling.LANCZOS)
        image.save(target, 'WEBP', quality=86, method=6)
    records[item['id']] = {
        'generator': 'built-in image_gen',
        'original': source.name,
        'prompt': item['prompt'],
        'image': f"/style-previews/v2/{item['id']}.webp",
    }
record_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'imported': len(manifest), 'total': len(records), 'bytes': sum(p.stat().st_size for p in DEST.glob('*.webp'))}))
