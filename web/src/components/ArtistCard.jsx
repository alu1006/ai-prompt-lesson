import PaintingCard from './PaintingCard.jsx'
import { toDisplayUrl } from '../utils/imageUrl.js'

export default function ArtistCard({ artist, movement, onSelect }) {
  const zh = artist.name_zh || ''
  const en = artist.name_en || ''
  const showBoth = zh && en && zh !== en
  const displayPaintings = artist.paintings.filter(p => toDisplayUrl(p.image_url, 200) !== null)

  const nameNode = artist.wiki ? (
    <a
      className="artist-name-link"
      href={artist.wiki}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
    >
      {zh || en}
      {showBoth && <span className="artist-name-en"> ({en})</span>}
    </a>
  ) : (
    <span>
      {zh || en}
      {showBoth && <span className="artist-name-en"> ({en})</span>}
    </span>
  )

  return (
    <div className="artist-card">
      <div className="artist-header">
        <h3 className="artist-name">{nameNode}</h3>
        <button
          className="btn-generate-sm"
          onClick={() => onSelect({ movement, artist, painting: null })}
        >
          以此藝術家生成
        </button>
      </div>
      {displayPaintings.length > 0 && (
        <div className="painting-row">
          {displayPaintings.map(painting => (
            <PaintingCard
              key={painting.id}
              painting={painting}
              artist={artist}
              movement={movement}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
