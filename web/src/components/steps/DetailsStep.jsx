import { DETAIL_CATEGORIES } from '../../data/detailOptions.js'

export default function DetailsStep({ details, onChange, onNext, onPrev }) {
  const toggle = (key, option) => {
    const current = details[key]
    onChange(key, current?.zh === option.zh ? null : option)
  }

  return (
    <div className="wizard-step-page">
      <div className="step-heading">
        <h2>細節設定</h2>
        <p>每個類別可選一項（也可以跳過）——點擊圖片卡來選擇</p>
      </div>

      <div className="details-categories">
        {DETAIL_CATEGORIES.map(cat => (
          <div key={cat.key} className="detail-cat">
            <div className="detail-cat-header">
              <span className="detail-cat-icon">{cat.icon}</span>
              <span className="detail-cat-label">{cat.label}</span>
              {details[cat.key] && (
                <span className="detail-selected-badge">{details[cat.key].zh}</span>
              )}
            </div>
            <div className="detail-options-row">
              {cat.options.map(opt => {
                const isSelected = details[cat.key]?.zh === opt.zh
                return (
                  <button
                    key={opt.zh}
                    className={`detail-option${isSelected ? ' selected' : ''}`}
                    onClick={() => toggle(cat.key, opt)}
                  >
                    <div className="detail-option-img-wrap">
                      <img
                        src={opt.img}
                        alt={opt.zh}
                        className="detail-option-img"
                        onError={e => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="detail-option-placeholder" style={{ display: 'none' }}>
                        <span>{cat.icon}</span>
                      </div>
                    </div>
                    <span className="detail-option-label">{opt.zh}</span>
                    {isSelected && <span className="detail-check">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 上一步</button>
        <button className="btn-next" onClick={onNext}>
          完成，查看 Prompt →
        </button>
      </div>
    </div>
  )
}
