import { useState } from 'react'
import { SUBJECT_CATEGORIES, searchSubjects, subjectEnglish } from '../../data/subjectPresets.js'
import ReferenceImage from '../ReferenceImage.jsx'

export default function SubjectStep({ value, onChange, onNext, onPrev }) {
  const [activeCategory, setActiveCategory] = useState('')
  const [query, setQuery] = useState('')
  const presets = searchSubjects({ query, category: activeCategory })
  const translated = subjectEnglish(value)

  return (
    <div className="wizard-step-page">
      <div className="step-heading">
        <h2>主體是什麼？</h2>
        <p>120 個主體靈感，從角色、動植物到食物與想像世界。選一個起點，再加入你自己的觀察。</p>
      </div>

      {/* Text input */}
      <div className="subject-input-wrap">
        <input
          className="subject-input"
          type="text"
          aria-label="主體描述"
          placeholder="例如：一隻白色的貓、一個穿著盔甲的騎士..."
          value={value}
          onChange={e => onChange(e.target.value)}
          autoFocus
        />
      </div>
      <div className="subject-guide"><strong>把主體說清楚</strong><p>試著補上「數量＋特徵＋主體＋獨特配件」。例如：一隻戴著紅色圍巾、耳朵有白色斑點的狐狸。</p><p>想畫多人或物件組合？也可以直接輸入，例如「一位園丁和一隻趴在花盆旁的貓」。</p></div>

      <label className="library-search-label">搜尋主體參考<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜尋水豚、咖啡、astronaut…" /></label>

      {/* Category tabs */}
      <div className="preset-cats">
        <button type="button" className={`preset-cat-btn${!activeCategory ? ' active' : ''}`} aria-pressed={!activeCategory} onClick={() => setActiveCategory('')}>全部 · 120</button>
        {SUBJECT_CATEGORIES.map(cat => (
          <button
            key={cat.label}
            type="button"
            className={`preset-cat-btn${activeCategory === cat.label ? ' active' : ''}`}
            aria-pressed={activeCategory === cat.label}
            onClick={() => setActiveCategory(cat.label)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
      <div className="library-result-line"><span role="status">顯示 {presets.length} / 120 個主體</span>{(query || activeCategory) && <button type="button" onClick={() => { setQuery(''); setActiveCategory('') }}>清除篩選</button>}</div>

      {/* Preset chips */}
      <div className="subject-library-grid">
        {presets.map(preset => (
          <button
            key={preset.zh}
            type="button"
            className={`subject-reference${value === preset.zh ? ' active' : ''}`}
            aria-pressed={value === preset.zh}
            onClick={() => onChange(value === preset.zh ? '' : preset.zh)}
          >
            <ReferenceImage src={preset.img} alt={`${preset.zh}示意`} />
            <div className="subject-reference-copy">
            <span className="subject-reference-category">{preset.category}</span>
            <strong>{preset.zh}</strong>
            <span lang="en">{preset.en}</span>
            </div>
          </button>
        ))}
      </div>
      {!presets.length && <p className="style-empty">沒有找到這個主體；可以換個關鍵字，或直接在上方輸入你自己的描述。</p>}

      {/* Preview */}
      {value && (
        <div className="subject-preview">
          <span className="subject-preview-label">已選擇</span>
          <span className="subject-preview-value">{value}</span>
          {translated !== value && <span className="subject-english-preview" lang="en">{translated}</span>}
        </div>
      )}
      <p className="library-footnote">預設主體會附英文對照；自由輸入會保留原文，也可以直接使用中文提示詞。</p>
      <p className="library-footnote">主體配圖為 AI 生成參考，供辨識特徵與構思使用；實際生成結果會依提示詞改變。</p>

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 上一步</button>
        <button className="btn-next" onClick={onNext} disabled={!value.trim()}>
          下一步：選風格 →
        </button>
      </div>
    </div>
  )
}
