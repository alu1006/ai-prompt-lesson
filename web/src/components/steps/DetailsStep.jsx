import { useState } from 'react'
import { DETAIL_CATEGORIES } from '../../data/detailOptions.js'
import ColorPalette from '../ColorPalette.jsx'

function DetailOption({ option, selected, onClick }) {
  const [failed, setFailed] = useState(false)
  return <button type="button" className={`detail-reference${selected ? ' selected' : ''}`} aria-pressed={selected} onClick={onClick}>
    {option.img && !failed && <img src={option.img} alt={`${option.zh}示意`} loading="lazy" decoding="async" width="96" height="96" onError={() => setFailed(true)} />}
    <div className="detail-reference-copy"><strong>{option.zh}</strong><span>{option.desc}</span><small lang="en">{option.en}</small></div>
    {selected && <span className="detail-reference-check" aria-hidden="true">✓</span>}
  </button>
}

export default function DetailsStep({ details, onChange, palette, onPaletteChange, onNext, onPrev }) {
  const [level, setLevel] = useState('basic')
  const [query, setQuery] = useState('')
  const term = query.trim().toLocaleLowerCase()
  const selected = DETAIL_CATEGORIES.filter(c => details[c.key])
  const categories = DETAIL_CATEGORIES.filter(c => term || level === 'all' || c.level === level)
    .map(c => ({ ...c, options: c.options.filter(o => !term || `${c.label} ${o.zh} ${o.en} ${o.desc}`.toLocaleLowerCase().includes(term)) }))
    .filter(c => c.options.length)
  const count = categories.reduce((total, c) => total + c.options.length, 0)
  return <div className="wizard-step-page">
    <div className="step-heading"><h2>細節設定</h2><p>12 類、144 個細節參考。每類選一項，也可以跳過；先挑 2～3 個重點，再觀察生成結果。</p></div>
    <ColorPalette value={palette} onChange={onPaletteChange} />
    <div className="detail-library-heading"><span className="style-library-kicker">DETAIL LIBRARY · 144</span><h3>用細節，讓想像更具體</h3><p>有生命的主體可以選動作、表情與服裝；建築或物件可從場景、構圖與材質開始。每個選項都有英文與觀察提示。</p></div>
    <label className="library-search-label">搜尋細節參考<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜尋逆光、留白、雪、macro…" /></label>
    <div className="detail-level-tabs" aria-label="細節範圍">{[['basic','基本細節'],['advanced','進階細節'],['all','全部細節']].map(([id, name]) => <button key={id} type="button" aria-pressed={level === id} onClick={() => setLevel(id)}>{name}</button>)}</div>
    <div className="library-result-line"><span role="status">顯示 {count} / 144 個選項{term ? '（搜尋全部分類）' : ''} · 已選 {selected.length} / 12 類</span>{query && <button type="button" onClick={() => setQuery('')}>清除搜尋</button>}</div>
    {selected.length > 0 && <div className="detail-selected-summary" aria-label="已選細節">{selected.map(c => <button key={c.key} type="button" onClick={() => onChange(c.key, null)} aria-label={`移除${c.label}：${details[c.key].zh}`}>{c.label}：{details[c.key].zh} <span aria-hidden="true">×</span></button>)}</div>}
    <div className="detail-library-categories">{categories.map(c => <section key={c.key} className="detail-reference-category" aria-label={c.label}>
      <div className="detail-reference-heading"><h3><span aria-hidden="true">{c.icon} </span>{c.label}</h3><span>{c.options.length} 個參考 · 單選</span>{details[c.key] && <button type="button" onClick={() => onChange(c.key, null)}>清除{c.label}</button>}</div>
      <div className="detail-reference-grid">{c.options.map(o => <DetailOption key={o.zh} option={o} selected={details[c.key]?.zh === o.zh} onClick={() => onChange(c.key, details[c.key]?.zh === o.zh ? null : o)} />)}</div>
    </section>)}</div>
    {!categories.length && <p className="style-empty">沒有符合的細節。試試中文名稱、英文關鍵字，或清除搜尋。</p>}
    <div className="detail-learning-note"><strong>小實驗：一次只改一項</strong><p>固定主體與風格，只把「自然光」改成「月光」，比較明暗、色彩和氣氛。選了「畫面比例」後，也請在生成工具裡確認輸出尺寸設定。</p><p>注意條件是否互相衝突：例如「純色背景」與「森林」、「正午」與「月光」。不必把每個類別都選滿。</p></div>
    <div className="step-nav"><button className="btn-prev" onClick={onPrev}>← 上一步</button><button className="btn-next" onClick={onNext}>下一步：選擇產品 →</button></div>
  </div>
}
