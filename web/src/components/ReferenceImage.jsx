import { useState } from 'react'

export default function ReferenceImage({ src, alt, diagram = false }) {
  const [failed, setFailed] = useState(false)
  return failed ? <div className="reference-image-error" role="img" aria-label={`${alt}，圖片暫時無法載入`}>圖片暫時無法載入</div> :
    <img className={`reference-image${diagram ? ' reference-image--diagram' : ''}`} src={src} alt={alt}
      width="512" height="512" loading="lazy" decoding="async" onError={() => setFailed(true)} />
}
