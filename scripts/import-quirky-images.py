"""Import approved quirky replacements without changing other reference sets."""
from pathlib import Path
from PIL import Image
import json, sys

ROOT=Path(__file__).resolve().parents[1]/'web/public'
record_path=ROOT/'quirky-generation.json'
records=json.loads(record_path.read_text(encoding='utf-8')) if record_path.exists() else {}
rows=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
for row in rows:
    folder='quirky' if row['id']=='hero' else 'detail-previews/quirky-v1'
    filename='mascot.webp' if row['id']=='hero' else row['id']+'.webp'
    dest=ROOT/folder/filename
    dest.parent.mkdir(parents=True,exist_ok=True)
    with Image.open(row['source']) as source:
        source.load()
        image=source.convert('RGB')
        image.thumbnail((1280,1280) if row['id']=='hero' else (640,640),Image.Resampling.LANCZOS)
        image.save(dest,'WEBP',quality=87,method=6)
    records[row['id']]={'image':'/'+dest.relative_to(ROOT).as_posix(),'generator':'built-in image_gen','prompt':row['prompt'],'original':Path(row['source']).name}
record_path.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'imported':len(rows),'total':len(records)}))
