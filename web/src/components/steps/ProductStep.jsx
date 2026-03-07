const PRODUCTS = [
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
        <h2>選擇產品</h2>
        <p>要把這張圖印在什麼上？AI 會自動調整 Prompt 讓圖片適合製作成產品（去背、適合印刷）</p>
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
              {isSelected && <span className="product-check">✓</span>}
            </button>
          )
        })}
      </div>

      {selected && selected.id !== 'none' && (
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
