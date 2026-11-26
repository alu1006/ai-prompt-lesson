import { useState } from 'react'
import { INTUITIVE_STYLES, STYLE_CATEGORIES, filterStyles } from '../data/styleCatalog.js'

function StyleTile({ style, selected, onSelect }) {
  const [failed, setFailed] = useState(false)
  return (
    <button type="button" className={`style-tile${selected ? ' selected' : ''}`}
      aria-pressed={selected} onClick={() => onSelect(style)} title={style.name_en}>
      {failed ? <div className="style-image-error">圖片暫時無法載入<br />仍可選擇此風格</div> :
        <img src={style.image} alt={`${style.name_zh}示範：拿著鉛筆的搞怪橘貓`}
          className="style-tile-img" width="768" height="768" loading="lazy" decoding="async"
          onError={() => setFailed(true)} />}
      <div className="style-tile-info">
        <span className="style-tile-category">{style.category}</span>
        <span className="style-tile-name">{style.name_zh}</span>
        <span className="style-tile-desc">{style.desc}</span>
        <span className="style-tile-keyword" lang="en">{style.name_en.split(',')[0]}</span>
      </div>
      {selected && <span className="style-tile-check" aria-hidden="true">✓</span>}
    </button>
  )
}

export default function StyleGallery({ selected, onSelect }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [selectedOnly, setSelectedOnly] = useState(false)
  const selectedIds = selected.map(s => s.id)
  const styles = filterStyles({ query, category, selectedOnly, selectedIds })
  const clear = () => { setQuery(''); setCategory(''); setSelectedOnly(false) }
  return (
    <section className="style-library" aria-label="100 種風格圖庫">
      <div className="style-library-note">
        <span className="style-library-kicker">STYLE ATLAS · 100</span>
        <h3>同一隻貓，100 種畫面語言</h3>
        <p>比較線條、材質、光影與色塊，再點選你想嘗試的風格。配圖為 AI 生成示意，實際結果會隨工具與提示詞改變。</p>
      </div>
      <div className="style-library-controls">
        <label className="style-search">搜尋風格
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="例如：水彩、刺繡、pixel…" />
        </label>
        <label className="style-category-select">風格分類
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">全部分類（100）</option>
            {STYLE_CATEGORIES.map(name => <option key={name} value={name}>{name}（10）</option>)}
          </select>
        </label>
        <label className="style-selected-filter"><input type="checkbox" checked={selectedOnly} onChange={e => setSelectedOnly(e.target.checked)} />只看已選</label>
      </div>
      <div className="style-library-status">
        <p role="status" aria-live="polite">顯示 {styles.length} / {INTUITIVE_STYLES.length} 種風格</p>
        {(query || category || selectedOnly) && <button type="button" onClick={clear}>清除篩選</button>}
      </div>
      {styles.length ? <div className="style-grid">
        {styles.map(style => <StyleTile key={style.id} style={style} selected={selectedIds.includes(style.id)} onSelect={onSelect} />)}
      </div> : <div className="style-empty"><p>沒有符合條件的風格，試試其他關鍵字或分類。</p><button type="button" onClick={clear}>顯示全部風格</button></div>}
    </section>
  )
}
