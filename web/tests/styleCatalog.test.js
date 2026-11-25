import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { INTUITIVE_STYLES } from '../src/data/intuitiveStyles.js'

test('students can browse exactly 100 distinct named styles', () => {
  assert.equal(INTUITIVE_STYLES.length, 100)
  assert.equal(new Set(INTUITIVE_STYLES.map(s => s.id)).size, 100)
  assert.equal(new Set(INTUITIVE_STYLES.map(s => s.name_zh)).size, 100)
  for (const s of INTUITIVE_STYLES) {
    assert.ok(s.name_en && s.desc && s.category && s.image, s.id)
  }
})

test('the library has ten equally sized teaching categories', () => {
  const counts = new Map()
  for (const s of INTUITIVE_STYLES) counts.set(s.category, (counts.get(s.category) || 0) + 1)
  assert.equal(counts.size, 10)
  for (const count of counts.values()) assert.equal(count, 10)
})

test('each style has its own local generated image', () => {
  assert.equal(new Set(INTUITIVE_STYLES.map(s => s.image)).size, 100)
  for (const s of INTUITIVE_STYLES) {
    assert.ok(existsSync(fileURLToPath(new URL(`../public${s.image}`, import.meta.url))), s.image)
  }
})

test('all images have distinct generation records tied to their style prompts', () => {
  const records = JSON.parse(readFileSync(new URL('../public/style-previews/v2/generation.json', import.meta.url), 'utf8'))
  assert.equal(Object.keys(records).length, 100)
  assert.equal(new Set(Object.values(records).map(r => r.original)).size, 100)
  for (const style of INTUITIVE_STYLES) {
    assert.ok(records[style.id]?.prompt.includes(style.name_en), style.id)
    assert.equal(records[style.id].image, style.image)
  }
})
