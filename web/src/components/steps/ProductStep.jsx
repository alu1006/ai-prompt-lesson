const PRODUCTS = [
  {
    id: 'turnaround',
    name_zh: '角色三視圖',
    icon: '✎',
    prompt_en: '',
  },
  {
    id: 'tshirt',
    name_zh: 'T恤',
    icon: '👕',
    prompt_en: 'flat graphic design on white background, isolated, no background, suitable for T-shirt screen printing, bold outlines',
  },
  {
    id: 'mug',
    name_zh: '馬克杯',
    icon: '☕',
    prompt_en: 'wrap-around illustration on white background, isolated, no background, suitable for mug printing, high contrast',
  },
  {
    id: 'phonecase',
    name_zh: '手機殼',
    icon: '📱',
    prompt_en: 'centered graphic on white background, isolated, no background, suitable for phone case printing, vibrant colors',
  },
  {
    id: 'totebag',
    name_zh: '托特包',
    icon: '🛍️',
    prompt_en: 'bold flat illustration on white background, isolated, no background, suitable for tote bag printing',
  },
  {
    id: 'poster',
    name_zh: '海報',
    icon: '🖼️',
    prompt_en: 'centered composition, high resolution, on white background, suitable for poster printing, large format',
  },
  {
    id: 'sticker',
    name_zh: '貼紙',
    icon: '✨',
    prompt_en: 'die-cut sticker design, thick white outline, isolated on white background, no background, vibrant colors, cute style',
  },
  {
    id: 'cap',
    name_zh: '帽子',
    icon: '🧢',
    prompt_en: 'small emblem or patch design, isolated on white background, no background, suitable for embroidery or cap printing',
  },
  {
    id: 'pillow',
    name_zh: '抱枕',
    icon: '🛋️',
    prompt_en: 'square composition, soft illustration on white background, isolated, no background, suitable for pillow printing',
  },
  {
    id: 'none',
    name_zh: '不做產品',
    icon: '—',
    prompt_en: '',
  },
]

export { PRODUCTS }

export default function ProductStep({ selected, onSelect, onNext, onPrev }) {
  return (
    <div className="wizard-step-page">
      <div className="step-heading">
        <h2>產品／用途</h2>
        <p>把圖案做成產品，或將手繪草圖整理成同一角色的正面、側面與背面設定圖。</p>
      </div>

      <div className="product-grid">
        {PRODUCTS.map(p => {
          const isSelected = selected?.id === p.id
          return (
            <button
              key={p.id}
              className={`product-card${isSelected ? ' selected' : ''}`}
              onClick={() => onSelect(isSelected ? null : p)}
            >
              <span className="product-icon">{p.icon}</span>
              <span className="product-name">{p.name_zh}</span>
              {p.id === 'turnaround' && <span className="product-purpose-hint">手繪草圖 → 正面・側面・背面</span>}
              {isSelected && <span className="product-check">✓</span>}
            </button>
          )
        })}
      </div>

      {selected?.id === 'turnaround' && <div className="turnaround-note"><strong>保留你的原創角色，整理成三個視角</strong><p>使用你提供的三視圖範本，保留草圖的比例、五官、服裝、道具與手繪感，三個視角並排在白色背景。</p><ol><li>準備清楚完整的手繪草圖。</li><li>下一步複製三視圖 Prompt，到生成工具上傳草圖並貼上文字。</li><li>檢查三個視角的比例與特徵；草圖沒畫出的側面、背面細節，可補充說明。</li></ol><p>三視圖使用獨立範本；前面選的主體、風格、配色與細節會保留，但不加入此範本。</p></div>}
      {selected && !['none','turnaround'].includes(selected.id) && (
        <div className="selected-style-bar">
          已選：<strong>{selected.name_zh}</strong> — Prompt 會加入去背與印刷優化
        </div>
      )}

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 上一步</button>
        <button className="btn-next" onClick={onNext}>
          {selected ? '下一步：查看 Prompt →' : '跳過 →'}
        </button>
      </div>
    </div>
  )
}
