import { DETAIL_CATEGORIES } from '../data/detailOptions.js'
import { subjectEnglish } from '../data/subjectPresets.js'
import { palettePrompt } from './palette.js'
import { TURNAROUND_PROMPT, isTurnaround } from '../data/turnaroundPrompt.js'

export function selectionTags(selection) {
  if (isTurnaround(selection)) return [{ label: '用途', value: '角色三視圖' }, { label: '參考', value: '上傳的手繪草圖' }]
  return [
    selection.subject && { label: '主體', value: selection.subject },
    ...(selection.styles || []).map(style => ({ label: '風格', value: style.label_zh })),
    ...DETAIL_CATEGORIES.flatMap(category => selection[category.key]?.zh ?
      [{ label: category.label, value: selection[category.key].zh }] : []),
    selection.product?.id && selection.product.id !== 'none' && { label: '產品', value: selection.product.name_zh },
  ].filter(Boolean)
}

export function buildPrompts(selection) {
  if (isTurnaround(selection)) return { ...TURNAROUND_PROMPT }
  const { subject, styles = [], product } = selection
  const zh = [], en = []
  if (subject) { zh.push(subject); en.push(subjectEnglish(subject)) }
  if (styles.length) {
    zh.push(`以${styles.map(s => s.label_zh).join('、')}風格`)
    en.push(styles.map(s => s.label_en).join(', '))
  }
  for (const category of DETAIL_CATEGORIES) {
    const detail = selection[category.key]
    if (detail?.zh) zh.push(`${category.label}：${detail.zh}`)
    if (detail?.en) en.push(detail.en)
  }
  if (product?.id && product.id !== 'none') zh.push(`去背、適合印製於${product.name_zh}`)
  if (product?.prompt_en) en.push(product.prompt_en)
  const palette = palettePrompt(selection.palette)
  if (palette.zh) zh.push(palette.zh)
  if (palette.en) en.push(palette.en)
  return { zh: zh.join('，'), en: en.join(', ') }
}
