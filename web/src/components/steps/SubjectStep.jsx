import { useState } from 'react'
import { SUBJECT_CATEGORIES } from '../../data/subjectPresets.js'

export default function SubjectStep({ value, onChange, onNext, onPrev }) {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="wizard-step-page">
      <div className="step-heading">
        <h2>主體是什麼？</h2>
        <p>描述你想畫的主角——可以是人、動物或場所</p>
      </div>

      {/* Text input */}
      <div className="subject-input-wrap">
        <input
          className="subject-input"
          type="text"
          placeholder="例如：一隻白色的貓、一個穿著盔甲的騎士..."
          value={value}
          onChange={e => onChange(e.target.value)}
          autoFocus
        />
      </div>

      {/* Category tabs */}
      <div className="preset-cats">
        {SUBJECT_CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            className={`preset-cat-btn${activeCategory === i ? ' active' : ''}`}
            onClick={() => setActiveCategory(i)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Preset chips */}
      <div className="preset-chips">
        {SUBJECT_CATEGORIES[activeCategory].presets.map(preset => (
          <button
            key={preset}
            className={`preset-chip${value === preset ? ' active' : ''}`}
            onClick={() => onChange(value === preset ? '' : preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Preview */}
      {value && (
        <div className="subject-preview">
          <span className="subject-preview-label">已選擇</span>
          <span className="subject-preview-value">{value}</span>
        </div>
      )}

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 上一步</button>
        <button className="btn-next" onClick={onNext} disabled={!value.trim()}>
          下一步：選風格 →
        </button>
      </div>
    </div>
  )
}
