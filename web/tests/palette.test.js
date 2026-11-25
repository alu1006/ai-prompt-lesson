import { test } from 'node:test'
import assert from 'node:assert/strict'

test('harmony generation supports one through four colors and preserves locked swatches', async () => {
  const palette = await import('../src/utils/palette.js').catch(() => ({}))
  assert.equal(typeof palette.generatePalette, 'function')
  for (const mode of ['monochrome', 'analogous', 'complementary', 'triadic', 'tetradic']) {
    for (let n = 1; n <= 4; n++) {
      const colors = palette.generatePalette('#D87536', n, mode)
      assert.equal(colors.length, n)
      for (const hex of colors) assert.match(hex, /^#[0-9A-F]{6}$/)
    }
  }
  assert.deepEqual(palette.generatePalette('#FF0000', 2, 'complementary'), ['#FF0000', '#00FFFF'])
  assert.equal(palette.generatePalette('#FF0000', 3, 'analogous', ['#123456'], [true])[0], '#123456')
})

test('disabled palettes add no instructions and enabled palettes include color roles', async () => {
  const palette = await import('../src/utils/palette.js').catch(() => ({}))
  assert.equal(typeof palette.palettePrompt, 'function')
  assert.deepEqual(palette.palettePrompt({ enabled: false }), { zh: '', en: '' })
  const result = palette.palettePrompt({ enabled: true, colors: ['#123456', '#ABCDEF'], allowBW: false })
  assert.match(result.zh, /限定 2 色/)
  assert.match(result.zh, /主色 #123456/)
  assert.match(result.en, /primary #123456/)
  assert.match(result.en, /no additional colors/)
  assert.match(palette.palettePrompt({ enabled: true, colors: ['#123456'], allowBW: true }).zh, /另可使用黑白/)
})

test('the color wheel can leave black and white and automatic colors remain distinct', async () => {
  const palette = await import('../src/utils/palette.js')
  assert.equal(typeof palette.colorAtHue, 'function')
  for (const base of ['#000000', '#FFFFFF']) {
    const adjusted = palette.colorAtHue(base, 180)
    assert.notEqual(adjusted, base)
    assert.match(adjusted, /^#[0-9A-F]{6}$/)
  }
  for (const base of ['#000000', '#FFFFFF', '#C7C7C7']) {
    for (const mode of ['monochrome', 'analogous', 'complementary', 'triadic', 'tetradic']) {
      assert.equal(new Set(palette.generatePalette(base, 4, mode)).size, 4, `${base}: ${mode}`)
    }
  }
})
