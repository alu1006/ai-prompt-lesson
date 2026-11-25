import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { INTUITIVE_STYLES } from '../web/src/data/styleCatalog.js'

const root = fileURLToPath(new URL('../', import.meta.url))
if (!process.argv[2]) throw new Error('Provide an absolute export directory')
const output = path.resolve(process.argv[2])
const images = path.join(output, 'images')
fs.mkdirSync(images, { recursive: true })
const cell = value => `"${String(value).replaceAll('"', '""')}"`
const rows = [['分類', '風格', '辨識特徵', '英文提示詞', '配圖']]
for (const style of INTUITIVE_STYLES) {
  fs.copyFileSync(path.join(root, 'web/public', style.image), path.join(images, `${style.id}.webp`))
  rows.push([style.category, style.name_zh, style.desc, style.name_en, `images/${style.id}.webp`])
}
fs.writeFileSync(path.join(output, '100-styles.csv'), '\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n'))
fs.copyFileSync(path.join(root, 'web/public/style-previews/v2/generation.json'), path.join(output, 'generation.json'))
fs.writeFileSync(path.join(output, 'README.txt'), '100 種風格參考配圖\n\nimages/：100 張獨立 AI 生成配圖（WebP）。\n100-styles.csv：分類、風格名稱、辨識特徵與英文提示詞，可用 Excel 開啟。\ngeneration.json：每張圖片的實際生成提示詞與來源檔名。\n\n配圖固定以坐姿貓與盆栽比較不同媒材、技法與畫面語言。生成式 AI 仍會帶來姿勢、比例與構圖差異；圖片是教學示意，並非工藝製程或藝術流派的唯一標準。\n')
console.log(`Exported ${INTUITIVE_STYLES.length} styles to ${output}`)
