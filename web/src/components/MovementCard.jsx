import { useState } from 'react'
import ArtistCard from './ArtistCard.jsx'

export default function MovementCard({ movement, onSelect, variant = 'default' }) {
  const [expanded, setExpanded] = useState(false)
  const name = movement.name_zh || movement.name_en

  // Only show artists that have at least one painting
  const artists = movement.artists.filter(a => a.paintings.length > 0)

  const countLabel = movement.painting_count != null
    ? `${movement.painting_count.toLocaleString()} 幅畫作 · ${artists.length} 位藝術家`
    : `${artists.length} 位藝術家`

  return (
    <div className={`movement-card movement-card--${variant}${expanded ? ' expanded' : ''}`}>
      <div className="movement-header" onClick={() => setExpanded(e => !e)}>
        <div className="movement-title">
          <h2>{name}</h2>
          <span className="painting-count">{countLabel}</span>
        </div>
        <div className="movement-actions">
          <button
            className="btn-generate"
            onClick={e => { e.stopPropagation(); onSelect({ movement, artist: null, painting: null }) }}
          >
            以此風格生成
          </button>
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="artist-grid">
          {artists.length > 0 ? artists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} movement={movement} onSelect={onSelect} />
          )) : (
            <p className="no-artists">此流派無可顯示的藝術家</p>
          )}
        </div>
      )}
    </div>
  )
}
