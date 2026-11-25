export const PALETTE_ROLES = ['主色', '輔色', '點綴色', '背景色']
const EN_ROLES = ['primary', 'secondary', 'accent', 'background']
export const HARMONIES = [
  ['analogous', '類似色'], ['complementary', '互補色'], ['monochrome', '單色深淺'],
  ['triadic', '三角配色'], ['tetradic', '四角配色'],
]

export function hexToHsl(hex) {
  const rgb = hex.replace('#', '').match(/../g).map(v => parseInt(v, 16) / 255)
  const [r, g, b] = rgb, max = Math.max(...rgb), min = Math.min(...rgb), delta = max - min
  const l = (max + min) / 2
  let h = 0
  if (delta) {
    h = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  }
  return [((h * 60) + 360) % 360, delta ? delta / (1 - Math.abs(2 * l - 1)) : 0, l]
}

export function hslToHex(h, s, l) {
  const a = s * Math.min(l, 1 - l)
  const channel = n => {
    const k = (n + ((h % 360) + 360) % 360 / 30) % 12
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
      .toString(16).padStart(2, '0')
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase()
}

export function colorAtHue(base, hue) {
  const [, saturation, lightness] = hexToHsl(base)
  return hslToHex(hue, saturation || .65, lightness === 0 || lightness === 1 ? .5 : lightness)
}

export function generatePalette(base, count, mode, previous = [], locked = []) {
  const n = Math.max(1, Math.min(4, count))
  const [h, s, l] = hexToHsl(base)
  const offsets = mode === 'complementary' ? [0, 180, 0, 180] :
    mode === 'triadic' ? [0, 120, 240, 0] : mode === 'tetradic' ? [0, 90, 180, 270] : [0, 30, -30, 60]
  const colors = Array.from({ length: n }, (_, i) => {
    if (locked[i] && previous[i]) return previous[i]
    if (i === 0) return base.toUpperCase()
    if (mode === 'monochrome') return hslToHex(h, s, [l, .78, .27, .91][i])
    const lightness = (mode === 'complementary' && i > 1) || (mode === 'triadic' && i === 3) ? Math.max(.15, Math.min(.85, l + .2)) : l
    return hslToHex(h + offsets[i], s || .55, lightness)
  })
  const used = new Set()
  return colors.map((color, i) => {
    if (!locked[i] && used.has(color)) {
      color = [.22, .42, .62, .82, .92].map(lightness =>
        hslToHex(h + offsets[i], mode === 'monochrome' ? s : s || .55, lightness),
      ).find(candidate => !used.has(candidate))
    }
    used.add(color)
    return color
  })
}

export const DEFAULT_PALETTE = {
  enabled: false, base: '#D87536', harmony: 'analogous', allowBW: false,
  colors: generatePalette('#D87536', 3, 'analogous'), locked: [false, false, false],
}

export function palettePrompt(palette) {
  if (!palette?.enabled || !palette.colors?.length) return { zh: '', en: '' }
  const { colors, allowBW } = palette
  return {
    zh: `限定 ${colors.length} 色配色：${colors.map((hex, i) => `${PALETTE_ROLES[i]} ${hex}`).join('、')}；${allowBW ? '另可使用黑白' : '黑白也計入色數，不加入其他顏色'}；使用平塗色塊，避免漸層`,
    en: `limited ${colors.length}-color palette: ${colors.map((hex, i) => `${EN_ROLES[i]} ${hex}`).join(', ')}; ${allowBW ? 'black and white are additionally allowed' : 'no additional colors, including extra black or white'}; flat color fills, no gradients`,
  }
}
