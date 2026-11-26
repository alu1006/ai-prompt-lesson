import test from 'node:test'
import assert from 'node:assert/strict'
import { DETAIL_CATEGORIES } from '../src/data/detailOptions.js'
import { DETAIL_SECTIONS, sectionCategories } from '../src/data/detailSections.js'
import { buildPrompts, selectionTags } from '../src/utils/prompts.js'

test('six detail sections include every original category exactly once', () => {
  assert.deepEqual(DETAIL_SECTIONS.map(s=>s.label), ['配色','動作','場景','鏡頭','光影','情緒'])
  const keys=DETAIL_SECTIONS.flatMap(s=>s.keys)
  assert.equal(new Set(keys).size,DETAIL_CATEGORIES.length)
  assert.deepEqual([...keys].sort(),DETAIL_CATEGORIES.map(c=>c.key).sort())
  assert.equal(sectionCategories('palette').length,0)
  assert.equal(DETAIL_SECTIONS.reduce((n,s)=>n+sectionCategories(s.id).reduce((m,c)=>m+c.options.length,0),0),144)
})

test('detail search remains scoped to the chosen section', () => {
  assert.deepEqual(sectionCategories('action','moonlight'),[])
  assert.ok(sectionCategories('lighting','月光').some(c=>c.options.some(o=>o.zh==='月光')))
})

test('turnaround keeps the complete character-preservation template without conflicting selections', () => {
  const selection={subject:'不同的新角色',styles:[{label_zh:'霓虹',label_en:'neon'}],scene:{zh:'森林',en:'in a forest'},product:{id:'turnaround',name_zh:'角色三視圖'},palette:{enabled:true,colors:['#ff0000']}}
  const {zh,en}=buildPrompts(selection)
  for(const text of ['正面、側面與背面','不要改變頭身比例','不要加入文字或背景場景','不要模仿任何知名角色','白色背景','保留原始筆觸與手繪感']) assert.ok(zh.includes(text),text)
  assert.ok(en.includes('front, side and back'))
  assert.ok(en.includes('Do not change the head-to-body proportions'))
  assert.ok(!zh.includes('森林') && !en.includes('neon') && !zh.includes('#ff0000'))
  assert.deepEqual(selectionTags(selection),[{label:'用途',value:'角色三視圖'},{label:'參考',value:'上傳的手繪草圖'}])
})
