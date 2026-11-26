"""Import each completed cat-series image; retain source PNGs and prompt provenance."""
from pathlib import Path
from PIL import Image
import json

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'web/public'
QUEUE=ROOT/'.cat-generation'
record_paths={'style':PUBLIC/'style-previews/v2/generation.json', 'subject':PUBLIC/'reference-generation.json', 'detail':PUBLIC/'reference-generation.json'}
records={path:json.loads(path.read_text(encoding='utf8')) for path in set(record_paths.values())}
count=0
for row_path in sorted(QUEUE.glob('*-*.json')):
    row=json.loads(row_path.read_text(encoding='utf8'))
    record=records[record_paths[row['kind']]]
    source=Path(row['source'])
    if record.get(row['id'],{}).get('original')==source.name:
        continue
    target=PUBLIC/row['image'].lstrip('/')
    with Image.open(source) as original:
        original.load()
        if min(original.size)<512:
            raise ValueError(f'Unexpected image size: {source}')
        image=original.convert('RGB')
        size=768 if row['kind']=='style' else 640
        image.thumbnail((size,size),Image.Resampling.LANCZOS)
        image.save(target,'WEBP',quality=87,method=6)
    record[row['id']]={'image':row['image'],'generator':'built-in image_gen','original':source.name,'prompt':row['prompt']}
    count+=1
for path,manifest in records.items():
    path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'imported_now':count,'completed':len(list(QUEUE.glob('*-*.json'))),'total':304}))
