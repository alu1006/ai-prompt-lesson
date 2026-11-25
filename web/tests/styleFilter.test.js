import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as catalog from '../src/data/styleCatalog.js'

test('students can search Chinese names and English techniques', () => {
  assert.equal(typeof catalog.filterStyles, 'function')
  assert.deepEqual(catalog.filterStyles({ query: '  CYANOTYPE ' }).map(s => s.id), ['cyanotype'])
  assert.deepEqual(catalog.filterStyles({ query: '刺繡' }).map(s => s.id), ['embroidery'])
})

test('category, query and selected-only filters work together', () => {
  assert.equal(typeof catalog.filterStyles, 'function')
  assert.equal(catalog.filterStyles({ category: '紙藝拼貼' }).length, 10)
  assert.deepEqual(catalog.filterStyles({ category: '紙藝拼貼', selectedOnly: true, selectedIds: ['papercut', 'oil'] }).map(s => s.id), ['papercut'])
  assert.deepEqual(catalog.filterStyles({ query: '沒有這種風格' }), [])
  assert.deepEqual(catalog.filterStyles({ selectedOnly: true, selectedIds: [] }), [])
})
