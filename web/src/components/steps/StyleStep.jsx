import { useState } from 'react'
import { INTUITIVE_STYLES } from '../../data/intuitiveStyles.js'
import { ERA_ORDER, MOVEMENT_ERA } from '../../data/eraData.js'
import { AMERICAN_ANIMATION, JAPANESE_ANIME } from '../../data/customPanels.js'
import MovementCard from '../MovementCard.jsx'

export default function StyleStep({ artData, selected = [], onSelect, onNext, onPrev }) {
  const isSelected = (id) => selected.some(s => s.id === id)
  const [tab, setTab] = useState('intuitive') // 'intuitive' | 'movement'

  // Group movements by era
  const eraGroups = artData ? ERA_ORDER.map(era => ({
    era,
    movements: artData.art_movements
      .filter(m => MOVEMENT_ERA[m.id]?.eraKey === era.key)
      .sort((a, b) => (MOVEMENT_ERA[a.id]?.year ?? 0) - (MOVEMENT_ERA[b.id]?.year ?? 0)),
  })).filter(g => g.movements.length > 0) : []

  const customPanels = [AMERICAN_ANIMATION, JAPANESE_ANIME]

  // MovementCard calls onSelect({ movement, artist, painting })
  // We convert that to our style selection format
  const handleMovementSelect = ({ movement, artist, painting }) => {
    if (painting) {
      onSelect({
        id: painting.id,
        label_zh: `《${painting.name_zh || painting.name_en}》風格（${artist?.name_zh || movement.name_zh}）`,
        label_en: `inspired by "${painting.name_en || painting.name_zh}", ${artist ? `in the style of ${artist.name_en}` : ''}, ${movement.name_en} movement`,
        type: 'painting',
      })
    } else if (artist) {
      onSelect({
        id: `${movement.id}-${artist.id}`,
        label_zh: `${artist.name_zh || artist.name_en} 的風格`,
        label_en: `in the style of ${artist.name_en || artist.name_zh}, ${movement.name_en} movement`,
        type: 'artist',
      })
    } else {
      onSelect({
        id: movement.id,
        label_zh: `${movement.name_zh || movement.name_en} 流派`,
        label_en: `${movement.name_en || movement.name_zh} movement`,
        type: 'movement',
      })
    }
  }

  const handleIntuitiveSelect = (style) => {
    onSelect({ id: style.id, label_zh: style.name_zh, label_en: style.name_en, type: 'intuitive' })
  }

  return (
    <div className="wizard-step-page">
      <div className="step-heading">
        <h2>選擇風格</h2>
        <p>選一種視覺風格，讓 AI 知道你想要的畫面感</p>
      </div>

      {/* Tab selector */}
      <div className="style-tabs">
        <button
          className={`style-tab${tab === 'intuitive' ? ' active' : ''}`}
          onClick={() => setTab('intuitive')}
        >
          直覺風格
        </button>
        <button
          className={`style-tab${tab === 'movement' ? ' active' : ''}`}
          onClick={() => setTab('movement')}
        >
          藝術流派
        </button>
      </div>

      {/* ── Intuitive styles ── */}
      {tab === 'intuitive' && (
        <div className="style-grid">
          {INTUITIVE_STYLES.map(style => {
            const active = isSelected(style.id)
            return (
              <button
                key={style.id}
                className={`style-tile${active ? ' selected' : ''}`}
                onClick={() => handleIntuitiveSelect(style)}
              >
                {style.image && (
                  <img
                    src={style.image}
                    alt={style.name_zh}
                    className="style-tile-img"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                )}
                <div
                  className="style-tile-placeholder"
                  style={{
                    background: style.color + '22',
                    borderColor: style.color + '55',
                    display: style.image ? 'none' : 'flex',
                  }}
                >
                  <span style={{ color: style.color, fontSize: '2rem' }}>✦</span>
                </div>
                <div className="style-tile-info">
                  <span className="style-tile-name">{style.name_zh}</span>
                  <span className="style-tile-desc">{style.desc}</span>
                </div>
                {active && <span className="style-tile-check">✓</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Art movements (original MovementCard UI) ── */}
      {tab === 'movement' && (
        <div className="movement-browse">
          {!artData && (
            <div className="no-data-note">
              需先執行 <code>python fetch_art_data.py</code> 產生 art_data.json
            </div>
          )}

          {eraGroups.map(({ era, movements }) => (
            <div key={era.key} className="era-section">
              <div className="era-header">
                <h2 className="era-name">{era.name_zh}</h2>
                <span className="era-years">{era.yearRange}</span>
              </div>
              <div className="era-movements">
                {movements.map(movement => (
                  <MovementCard
                    key={movement.id}
                    movement={movement}
                    onSelect={handleMovementSelect}
                  />
                ))}
              </div>
            </div>
          ))}

          {customPanels.map((panel, i) => (
            <div key={panel.id} className={`era-section custom-section custom-${i === 0 ? 'animation' : 'anime'}`}>
              <div className="era-header">
                <h2 className="era-name">{panel.name_zh}</h2>
              </div>
              <div className="era-movements">
                <MovementCard
                  movement={panel}
                  onSelect={handleMovementSelect}
                  variant={i === 0 ? 'animation' : 'anime'}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected styles display */}
      {selected.length > 0 && (
        <div className="selected-style-bar">
          已選風格：{selected.map(s => <strong key={s.id} style={{ marginRight: '0.5rem' }}>{s.label_zh}</strong>)}
        </div>
      )}

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 上一步</button>
        <button className="btn-next" onClick={onNext} disabled={selected.length === 0}>
          下一步：選細節 →
        </button>
      </div>
    </div>
  )
}
