import { useState } from 'react'
import StyleGallery from '../StyleGallery.jsx'
import { ERA_ORDER, MOVEMENT_ERA } from '../../data/eraData.js'
import { AMERICAN_ANIMATION, JAPANESE_ANIME } from '../../data/customPanels.js'
import MovementCard from '../MovementCard.jsx'

export default function StyleStep({ artData, selected = [], onSelect, onNext, onPrev }) {
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
        <p>從 100 種風格探索畫面語言，可選一種，也可以混合搭配</p>
      </div>

      {/* Tab selector */}
      <div className="style-tabs">
        <button
          className={`style-tab${tab === 'intuitive' ? ' active' : ''}`}
          onClick={() => setTab('intuitive')}
        >
          風格圖庫 · 100
        </button>
        <button
          className={`style-tab${tab === 'movement' ? ' active' : ''}`}
          onClick={() => setTab('movement')}
        >
          藝術流派
        </button>
      </div>

      {tab === 'intuitive' && (
        <StyleGallery selected={selected} onSelect={handleIntuitiveSelect} />
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
          已選風格（{selected.length}）：{selected.map(s => (
            <button key={s.id} type="button" className="selected-style-chip" onClick={() => onSelect(s)} aria-label={`移除${s.label_zh}`}>
              {s.label_zh} <span aria-hidden="true">×</span>
            </button>
          ))}
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
