import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { toDisplayUrl } from '../utils/imageUrl.js'

export default function PaintingCard({ painting, artist, movement, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [hoverPos, setHoverPos] = useState(null)
  const cardRef = useRef(null)
  const name = painting.name_zh || painting.name_en
  const thumbUrl = toDisplayUrl(painting.image_url, 200)

  if (!thumbUrl || imgFailed) return null

  const handleMouseEnter = () => {
    const rect = cardRef.current.getBoundingClientRect()
    setHoverPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <div
      ref={cardRef}
      className="painting-card"
      onClick={() => onSelect({ movement, artist, painting })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHoverPos(null)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect({ movement, artist, painting })}
      title={`以《${name}》風格生成`}
    >
      <div className="painting-thumb-wrapper">
        <img
          src={thumbUrl}
          alt={name}
          className="painting-thumb"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      </div>
      <p className="painting-name">{name}</p>

      {hoverPos && createPortal(
        <div
          className="painting-zoom-overlay"
          style={{ left: hoverPos.x, top: hoverPos.y }}
          onMouseLeave={() => setHoverPos(null)}
        >
          <img src={thumbUrl} alt={name} />
          <p>{name}</p>
        </div>,
        document.body
      )}
    </div>
  )
}
