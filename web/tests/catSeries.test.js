import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { SUBJECT_PRESETS } from '../src/data/subjectLibrary.js'
import { DETAIL_CATEGORIES } from '../src/data/detailOptions.js'
import { INTUITIVE_STYLES } from '../src/data/styleCatalog.js'

test('all subject and remaining raster detail references use the same orange cat series', () => {
  const records=JSON.parse(readFileSync(new URL('../public/reference-generation.json',import.meta.url),'utf8'))
  const expected=[...SUBJECT_PRESETS.map(s=>s.img),...DETAIL_CATEGORIES.flatMap(c=>c.options.filter(o=>o.img.startsWith('/detail-previews/v1/')&&o.img.endsWith('.webp')).map(o=>o.img))]
  assert.equal(expected.length,204)
  for(const path of expected){
    const record=Object.values(records).find(r=>r.image===path)
    assert.ok(record?.prompt.includes('SAME original quirky orange tabby mascot'),path)
  }
})

test('all 100 styles retain their own medium while showing the common cat mascot', () => {
  const records=JSON.parse(readFileSync(new URL('../public/style-previews/v2/generation.json',import.meta.url),'utf8'))
  for(const style of INTUITIVE_STYLES){
    assert.ok(records[style.id]?.prompt.includes('SAME original quirky orange tabby mascot'),style.id)
    assert.ok(records[style.id]?.prompt.includes(style.name_en),style.id)
  }
})
