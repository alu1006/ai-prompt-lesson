import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as subjects from '../src/data/subjectPresets.js'
import { DETAIL_CATEGORIES } from '../src/data/detailOptions.js'

test('subject references offer 120 distinct bilingual examples in 12 categories', () => {
  assert.equal(subjects.SUBJECT_CATEGORIES.length, 12)
  const all = subjects.SUBJECT_CATEGORIES.flatMap(c => c.presets)
  assert.equal(all.length, 120)
  assert.equal(new Set(all.map(s => s.zh)).size, 120)
  for (const category of subjects.SUBJECT_CATEGORIES) {
    assert.equal(category.presets.length, 10)
    for (const s of category.presets) assert.ok(s.zh && s.en)
  }
})

test('subject search spans categories and translates known presets without changing free text', () => {
  assert.equal(typeof subjects.searchSubjects, 'function')
  assert.equal(subjects.searchSubjects({ query: 'ASTRONAUT' })[0].zh, '一個太空人')
  assert.equal(subjects.searchSubjects({ category: '植物花卉' }).length, 10)
  assert.equal(subjects.searchSubjects({ query: '不存在的選項' }).length, 0)
  assert.equal(subjects.subjectEnglish('一個太空人'), 'an astronaut')
  assert.equal(subjects.subjectEnglish('我自己設計的角色'), '我自己設計的角色')
})

test('detail references have 12 categories of 12 unique bilingual options', () => {
  assert.equal(DETAIL_CATEGORIES.length, 12)
  assert.equal(new Set(DETAIL_CATEGORIES.map(c => c.key)).size, 12)
  for (const category of DETAIL_CATEGORIES) {
    assert.equal(category.options.length, 12, category.key)
    assert.equal(new Set(category.options.map(o => o.zh)).size, 12, category.key)
    for (const option of category.options) assert.ok(option.zh && option.en && option.desc)
  }
})

test('every detail category reaches both prompts and saved summary tags', async () => {
  const prompts = await import('../src/utils/prompts.js').catch(() => ({}))
  assert.equal(typeof prompts.buildPrompts, 'function')
  const selection = { subject: '一個太空人', styles: [], palette: { enabled: false } }
  for (const category of DETAIL_CATEGORIES) selection[category.key] = category.options[0]
  const result = prompts.buildPrompts(selection)
  assert.match(result.en, /an astronaut/)
  for (const category of DETAIL_CATEGORIES) {
    assert.ok(result.zh.includes(category.options[0].zh), category.key)
    assert.ok(result.en.includes(category.options[0].en), category.key)
    assert.ok(prompts.selectionTags(selection).some(t => t.label === category.label && t.value === category.options[0].zh))
  }
  assert.equal(prompts.buildPrompts({subject: '自訂主體'}).zh, '自訂主體')
  assert.equal(prompts.buildPrompts({subject: '自訂主體'}).en, '自訂主體')
})
