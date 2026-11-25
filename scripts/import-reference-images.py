"""Convert individually generated originals into classroom web assets."""
from pathlib import Path
import sys, json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
records_path = ROOT / 'web/public/reference-generation.json'
records = json.loads(records_path.read_text(encoding='utf-8')) if records_path.exists() else {}
rows = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
for row in rows:
    dest = ROOT / 'web/public' / ('subject-previews/v1' if row['id'].startswith('s') else 'detail-previews/v1')
    dest.mkdir(parents=True, exist_ok=True)
    target = dest / (row['id'] + '.webp')
    if records.get(row['id'], {}).get('original') != Path(row['source']).name or not target.exists():
        with Image.open(row['source']) as source:
            source.load()
            if min(source.size) < 512:
                raise ValueError(f"Generated source is unexpectedly small: {row['id']}")
            image = source.convert('RGB')
            image.thumbnail((640,640), Image.Resampling.LANCZOS)
            image.save(target, 'WEBP', quality=84, method=6)
    records[row['id']] = {'image': '/' + target.relative_to(ROOT / 'web/public').as_posix(),
        'generator': 'built-in image_gen', 'original': Path(row['source']).name, 'prompt': row['prompt']}
records_path.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'imported': len(rows), 'total': len(records)}))
