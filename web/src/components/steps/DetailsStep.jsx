import { useState } from 'react'
import { DETAIL_CATEGORIES } from '../../data/detailOptions.js'
import { DETAIL_SECTIONS, sectionCategories } from '../../data/detailSections.js'
import ColorPalette from '../ColorPalette.jsx'
import ReferenceImage from '../ReferenceImage.jsx'

function DetailOption({ option, selected, onClick }) {
  return <button type="button" className={`detail-reference${selected ? ' selected' : ''}`} aria-pressed={selected} onClick={onClick}>
    <ReferenceImage src={option.img} alt={`${option.zh}示意`} diagram={option.img.endsWith('.svg')} />
    <div className="detail-reference-copy"><strong>{option.zh}</strong><span>{option.desc}</span><small lang="en">{option.en}</small></div>
    {selected && <span className="detail-reference-check" aria-hidden="true">✓</span>}
  </button>
}

export default function DetailsStep({ details, onChange, palette, onPaletteChange, onNext, onPrev }) {
  const [sectionId, setSectionId] = useState('palette')
  const [query, setQuery] = useState('')
  const term = query.trim().toLocaleLowerCase()
  const selected = DETAIL_CATEGORIES.filter(c => details[c.key])
  const section = DETAIL_SECTIONS.find(s => s.id === sectionId)
  const categories = sectionCategories(sectionId, query)
  const total = sectionCategories(sectionId).reduce((n,c)=>n+c.options.length,0)
  const sectionIndex = DETAIL_SECTIONS.indexOf(section)
  const changeSection = (id, scroll = false) => {
    setSectionId(id)
    setQuery('')
    if (scroll) requestAnimationFrame(() => {
      const panel = document.getElementById('detail-section-content')
      panel?.focus({ preventScroll: true })
      panel?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
  }
  const count = categories.reduce((total, c) => total + c.options.length, 0)
  return <div className="wizard-step-page">
    <div className="step-heading"><h2>細節設定</h2><p>拆開想，一次選一件事。配色加上 144 個細節參考，先挑 2～3 個重點就好。</p></div>
    <nav className="detail-section-nav" aria-label="細節分類">{DETAIL_SECTIONS.map((s,index) => {
      const chosen = s.id === 'palette' ? (palette?.enabled ? palette.colors.length : 0) : s.keys.filter(key=>details[key]).length
      return <button key={s.id} type="button" aria-current={sectionId === s.id ? 'step' : undefined} aria-controls="detail-section-content" onClick={()=>changeSection(s.id)}><span className="detail-section-index">0{index+1}</span><span aria-hidden="true">{s.icon}</span><strong>{s.label}</strong>{chosen > 0 && <small>{s.id==='palette' ? `${chosen} 色` : `已選 ${chosen}`}</small>}</button>
    })}</nav>
    {selected.length > 0 && <div className="detail-selected-summary" aria-label="已選細節">{selected.map(c => <button key={c.key} type="button" onClick={() => onChange(c.key, null)} aria-label={`移除${c.label}：${details[c.key].zh}`}>{c.label}：{details[c.key].zh} <span aria-hidden="true">×</span></button>)}</div>}
    <section id="detail-section-content" className="detail-section-content" tabIndex={-1} aria-label={`${section.label}設定`}>
    <div className="detail-library-heading"><span className="style-library-kicker">DETAIL {String(sectionIndex+1).padStart(2,'0')} / 06</span><h3>{section.label}</h3><p>{section.hint} 切換分類會保留已選內容。</p></div>
    {sectionId === 'palette' ? <ColorPalette value={palette} onChange={onPaletteChange} /> : <>
    <label className="library-search-label">搜尋{section.label}參考<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={`搜尋${section.label}中的中文或英文關鍵字…`} /></label>
    <div className="library-result-line"><span role="status">顯示 {count} / {total} 個{section.label}選項{term ? '（目前分類）' : ''} · 全部已選 {selected.length} / 12 類</span>{query && <button type="button" onClick={() => setQuery('')}>清除搜尋</button>}</div>
    <div className="detail-library-categories">{categories.map(c => <section key={c.key} className="detail-reference-category" aria-label={c.label}>
      <div className="detail-reference-heading"><h3><span aria-hidden="true">{c.icon} </span>{c.label}</h3><span>{c.options.length} 個參考 · 單選</span>{details[c.key] && <button type="button" onClick={() => onChange(c.key, null)}>清除{c.label}</button>}</div>
      <div className="detail-reference-grid">{c.options.map(o => <DetailOption key={o.zh} option={o} selected={details[c.key]?.zh === o.zh} onClick={() => onChange(c.key, details[c.key]?.zh === o.zh ? null : o)} />)}</div>
    </section>)}</div>
    {!categories.length && <p className="style-empty">沒有符合的細節。試試中文名稱、英文關鍵字，或清除搜尋。</p>}
    </>}
    <div className="detail-section-pager"><button type="button" disabled={sectionIndex===0} onClick={()=>changeSection(DETAIL_SECTIONS[sectionIndex-1].id,true)}>← 上一類{sectionIndex>0 ? `：${DETAIL_SECTIONS[sectionIndex-1].label}` : ''}</button><button type="button" disabled={sectionIndex===DETAIL_SECTIONS.length-1} onClick={()=>changeSection(DETAIL_SECTIONS[sectionIndex+1].id,true)}>下一類{sectionIndex<DETAIL_SECTIONS.length-1 ? `：${DETAIL_SECTIONS[sectionIndex+1].label}` : ''} →</button></div>
    </section>
    <div className="detail-learning-note"><strong>小實驗：一次只改一項</strong><p>固定主體與風格，只把「自然光」改成「月光」，比較明暗、色彩和氣氛。選了「畫面比例」後，也請在生成工具裡確認輸出尺寸設定。</p><p>注意條件是否互相衝突：例如「純色背景」與「森林」、「正午」與「月光」。不必把每個類別都選滿。</p></div>
    <div className="step-nav"><button className="btn-prev" onClick={onPrev}>← 上一步</button><button className="btn-next" onClick={onNext}>下一步：產品／用途 →</button></div>
  </div>
}
