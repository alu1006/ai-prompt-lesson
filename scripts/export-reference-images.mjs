import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUBJECT_PRESETS } from '../web/src/data/subjectLibrary.js'
import { DETAIL_CATEGORIES } from '../web/src/data/detailOptions.js'

if (!process.argv[2]) throw new Error('Provide an absolute export directory')
const publicRoot = fileURLToPath(new URL('../web/public/', import.meta.url))
const output = path.resolve(process.argv[2])
fs.mkdirSync(output, { recursive: true })
const index = [
  ...SUBJECT_PRESETS.map(s => ({ type: '主體', category: s.category, zh: s.zh, en: s.en, image: s.img.slice(1) })),
  ...DETAIL_CATEGORIES.flatMap(c => c.options.map(o => ({ type: '細節', category: c.label, zh: o.zh, en: o.en, description: o.desc, image: o.img.slice(1) }))),
]
for (const item of index) {
  const dest = path.join(output, item.image)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(path.join(publicRoot, item.image), dest)
}
fs.writeFileSync(path.join(output, 'index.json'), JSON.stringify(index, null, 2))
fs.copyFileSync(path.join(publicRoot, 'reference-generation.json'), path.join(output, 'generation.json'))
fs.copyFileSync(path.join(publicRoot, 'quirky-generation.json'), path.join(output, 'quirky-generation.json'))
fs.writeFileSync(path.join(output, 'README.txt'), '主體與細節參考圖庫\n\n120 個主體與 144 個細節皆有對應圖片。index.json 提供分類、中英文名稱、說明與相對圖片路徑。generation.json 記錄 204 張生成圖片之實際提示詞與來源。quirky-generation.json 記錄另行重生的 36 張搞怪橘貓細節圖與網站主視覺提示詞。另含 24 張精確 SVG 構圖／比例示意。\n\n生成圖片是教學參考，並非生物學、工藝製程或攝影技法的唯一標準。原始生成 PNG 保留於本機 .codex/generated_images；網頁採用壓縮 WebP。\n')
console.log(`Exported ${index.length} subject/detail illustrations.`)
