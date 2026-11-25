import { useEffect, useState } from 'react'
import { colorAtHue, generatePalette, hexToHsl, hslToHex, HARMONIES, PALETTE_ROLES } from '../utils/palette.js'

function Swatch({ color, index, locked, onColor, onLock }) {
  const [draft, setDraft] = useState(color)
  useEffect(() => setDraft(color), [color])
  const valid = /^#[\da-f]{6}$/i.test(draft)
  return <div className="palette-swatch">
    <label className="palette-color-well" style={{ background: color }}>
      <span className="sr-only">選擇{PALETTE_ROLES[index]}</span>
      <input type="color" value={color} onChange={e => onColor(e.target.value.toUpperCase())} />
    </label>
    <div className="palette-swatch-meta"><strong>{PALETTE_ROLES[index]}</strong>
      <button type="button" aria-pressed={locked} onClick={onLock} aria-label={`${locked ? '解鎖' : '鎖定'}${PALETTE_ROLES[index]}`}>{locked ? '已鎖定' : '鎖定'}</button>
    </div>
    <input className="palette-hex" aria-label={`${PALETTE_ROLES[index]} HEX`} value={draft} maxLength={7}
      aria-invalid={!valid} onChange={e => { setDraft(e.target.value); if (/^#[\da-f]{6}$/i.test(e.target.value)) onColor(e.target.value.toUpperCase()) }}
      onBlur={() => { if (!valid) setDraft(color) }} />
  </div>
}

export default function ColorPalette({ value, onChange }) {
  const [copyStatus, setCopyStatus] = useState('')
  useEffect(() => setCopyStatus(''), [value.colors])
  const hue = hexToHsl(value.base)[0]
  const update = (changes) => onChange({ ...value, ...changes })
  const regenerate = (base = value.base, count = value.colors.length, harmony = value.harmony) => {
    update({ base, harmony, colors: generatePalette(base, count, harmony, value.colors, value.locked),
      locked: Array.from({ length: count }, (_, i) => !!value.locked[i]) })
  }
  const setHue = h => regenerate(colorAtHue(value.base, h))
  const wheelPointer = e => {
    if (!value.enabled || (e.type === 'pointermove' && !e.buttons)) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2, y = e.clientY - rect.top - rect.height / 2
    setHue((Math.atan2(x, -y) * 180 / Math.PI + 360) % 360)
    if (e.type === 'pointerdown') e.currentTarget.setPointerCapture(e.pointerId)
  }
  const c = i => value.colors[i % value.colors.length]
  return <section className="palette-panel" aria-label="1 到 4 色配色工具">
    <div className="palette-heading"><div><span className="style-library-kicker">COLOR LAB · 01—04</span><h3>先決定，你想用幾個顏色？</h3></div>
      <label><input type="checkbox" checked={value.enabled} onChange={e => update({ enabled: e.target.checked })} />使用限定配色</label>
    </div>
    <p className="palette-intro">從色輪選基準色，再試試配色規則。色票會加入中英文 Prompt；生成後可比對圖片是否符合你的配色。</p>
    <fieldset disabled={!value.enabled} className="palette-fieldset"><legend className="sr-only">配色設定</legend>
      <div className="palette-workbench"><div className="palette-wheel-column">
        <div className="palette-wheel" onPointerDown={wheelPointer} onPointerMove={wheelPointer} aria-hidden="true">
          <div className="palette-wheel-inner" style={{ background: value.base }} />
          <span className="palette-wheel-marker" style={{ left: `${50 + 43 * Math.sin(hue * Math.PI / 180)}%`, top: `${50 - 43 * Math.cos(hue * Math.PI / 180)}%` }} />
        </div>
        <label className="palette-hue-label">色相 {Math.round(hue)}°<input type="range" min="0" max="359" value={Math.round(hue)} onChange={e => setHue(Number(e.target.value))} /></label>
        <label className="palette-base">色輪基準色<input type="color" value={value.base} onChange={e => regenerate(e.target.value.toUpperCase())} /></label>
      </div>
      <div className="palette-settings"><div className="palette-count"><span>色數</span>{[1, 2, 3, 4].map(n => <button key={n} type="button" aria-pressed={value.colors.length === n} onClick={() => regenerate(value.base, n)}>{n} 色</button>)}</div>
        <label className="palette-rule">配色規則<select value={value.harmony} onChange={e => regenerate(value.base, value.colors.length, e.target.value)}>{HARMONIES.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        <div className="palette-swatches" style={{ gridTemplateColumns: `repeat(${value.colors.length}, minmax(0, 1fr))` }}>
          {value.colors.map((color, index) => <Swatch key={index} color={color} index={index} locked={value.locked[index]}
            onColor={hex => update({ colors: value.colors.map((v, i) => i === index ? hex : v) })}
            onLock={() => update({ locked: value.colors.map((_, i) => i === index ? !value.locked[i] : !!value.locked[i]) })} />)}
        </div>
        <div className="palette-actions"><button type="button" disabled={value.locked.every(Boolean)} onClick={() => regenerate(hslToHex(Math.random() * 360, .55 + Math.random() * .25, .4 + Math.random() * .2))}>重新配色</button>
          <button type="button" onClick={() => navigator.clipboard.writeText(value.colors.join(', ')).then(() => setCopyStatus('色票已複製')).catch(() => setCopyStatus('請選取 HEX 欄位手動複製'))}>複製色票</button>
          <span>鎖定的色票會保留；點色塊可自由調色。</span><span role="status">{copyStatus}</span></div>
        <label className="palette-bw"><input type="checkbox" checked={value.allowBW} onChange={e => update({ allowBW: e.target.checked })} />允許額外使用黑白（不計入以上色數）</label>
        <div className="palette-preview"><svg viewBox="0 0 240 140" role="img" aria-label="限定色票的簡單構圖示意">
          <rect width="240" height="140" rx="8" fill={value.colors.length === 4 ? c(3) : 'none'} />
          <ellipse cx="142" cy="103" rx="40" ry="29" fill={c(0)} /><path d="M108 62 L111 20 L137 43 L159 20 L176 62 Z" fill={c(0)} /><ellipse cx="142" cy="62" rx="35" ry="27" fill={c(0)} />
          <circle cx="130" cy="60" r="3" fill={c(1)} /><circle cx="153" cy="60" r="3" fill={c(1)} />
          <path d="M49 90 H85 L79 128 H55 Z" fill={c(1)} /><path d="M66 91 Q31 61 45 42 Q73 48 66 91 M67 87 Q99 58 90 38 Q62 49 67 87" fill={c(2)} />
        </svg><span>色塊構圖示意{value.colors.length < 4 ? '（透明底）' : ''}<br />不是 AI 即時生成預覽</span></div>
      </div></div>
    </fieldset>
    {value.enabled && <p className="palette-teaching">{value.colors.length === 1 ? '1 色提示：若黑白也算色數，單色圖形可搭配透明底；單色深淺屬於同色相變化。' : '觀察：哪個顏色最搶眼？試著把它用在小面積點綴，再比較畫面重點。'} 限定色數適合平塗與版畫；水彩與光影通常會產生更多色階。</p>}
  </section>
}
