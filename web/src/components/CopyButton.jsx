import { useState } from 'react'

export default function CopyButton({ text }) {
  const [state, setState] = useState('')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setState('success')
    } catch {
      setState('error')
    }
  }
  return <span className="copy-control"><button type="button" className="btn-copy" onClick={copy}>{state === 'success' ? '✓ 已複製' : '複製'}</button><span role="status">{state === 'error' ? '無法複製，請手動選取下方文字。' : ''}</span></span>
}
