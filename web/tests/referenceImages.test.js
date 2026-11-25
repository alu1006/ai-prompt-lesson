import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { SUBJECT_PRESETS } from '../src/data/subjectLibrary.js'
import { DETAIL_CATEGORIES } from '../src/data/detailOptions.js'

test('all 120 subject options have individual local illustration paths', () => {
  assert.equal(SUBJECT_PRESETS.length, 120)
  const paths = SUBJECT_PRESETS.map(s => s.img)
  assert.equal(new Set(paths).size, 120)
  for (const item of SUBJECT_PRESETS) {
    assert.ok(item.img?.startsWith('/subject-previews/'), item.zh)
    assert.ok(existsSync(fileURLToPath(new URL(`../public${item.img}`, import.meta.url))), item.img)
  }
})

test('every one of the 144 detail options has a local visual reference', () => {
  const options = DETAIL_CATEGORIES.flatMap(c => c.options)
  assert.equal(options.length, 144)
  for (const option of options) {
    assert.ok(option.img, option.zh)
    assert.ok(existsSync(fileURLToPath(new URL(`../public${option.img}`, import.meta.url))), option.img)
  }
})

test('composition and aspect ratio examples use precise vector diagrams', () => {
  for (const category of DETAIL_CATEGORIES.filter(c => ['composition','ratio'].includes(c.key))) {
    for (const option of category.options) assert.ok(option.img?.endsWith('.svg'), option.zh)
  }
})

test('aspect-ratio diagrams preserve their stated frame dimensions', () => {
  for (const option of DETAIL_CATEGORIES.find(c => c.key === 'ratio').options) {
    const svg = readFileSync(new URL(`../public${option.img}`, import.meta.url), 'utf8')
    const frame = svg.match(/<rect data-frame="true"[^>]+width="([\d.]+)" height="([\d.]+)"/)
    assert.ok(frame, option.zh)
    const [w, h] = option.zh.match(/\d+:\d+/)[0].split(':').map(Number)
    assert.ok(Math.abs(Number(frame[1])/Number(frame[2]) - w/h) < 0.000001, option.zh)
  }
})

test('new raster references have a generation record for each image', () => {
  const records = JSON.parse(readFileSync(new URL('../public/reference-generation.json',import.meta.url),'utf8'))
  const generated = [...SUBJECT_PRESETS, ...DETAIL_CATEGORIES.flatMap(c=>c.options).filter(o=>o.img.startsWith('/detail-previews/v1/') && o.img.endsWith('.webp'))]
  assert.equal(generated.length, 204)
  assert.equal(Object.keys(records).length, 204)
  assert.equal(new Set(Object.values(records).map(r=>r.original)).size, 204)
  for (const item of generated) {
    const record = Object.values(records).find(r=>r.image===item.img)
    assert.ok(record?.prompt.includes(item.en), item.zh)
    assert.equal(record.generator, 'built-in image_gen')
  }
})

test('the 36 legacy detail illustrations are replaced by quirky cat references', () => {
  const options = DETAIL_CATEGORIES.flatMap(c=>c.options)
  assert.equal(options.filter(o=>o.img.startsWith('/tag-previews/')).length,0)
  const quirky = options.filter(o=>o.img.startsWith('/detail-previews/quirky-v1/'))
  assert.equal(quirky.length,36)
  const records = JSON.parse(readFileSync(new URL('../public/quirky-generation.json',import.meta.url),'utf8'))
  for (const option of quirky) {
    const record = Object.values(records).find(r=>r.image===option.img)
    assert.ok(record?.prompt.includes(option.en),option.zh)
    assert.ok(existsSync(fileURLToPath(new URL(`../public${option.img}`,import.meta.url))),option.zh)
  }
})
