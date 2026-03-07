import { useState } from 'react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button className="btn-copy" onClick={copy}>
      {copied ? '✓ 已複製' : '複製'}
    </button>
  )
}

export const DEMO_PROMPTS = [
  {
    id: 'demo-1',
    isDemo: true,
    title: '粉色觸手生物貼紙',
    analysis: '這個 Prompt 準確地捕捉了生物的顏色、獨特的姿勢（觸手心形）、非常具體且獨特的面部表情（困倦的眼睛、貓嘴、長舌頭），以及其古怪的手繪貼紙風格。',
    tags: [
      { label: '風格', value: '手繪塗鴉貼紙' },
      { label: '主體', value: '粉色觸手生物' },
      { label: '姿勢', value: '觸手舉起成愛心' },
      { label: '表情', value: '困倦眼睛、貓嘴、長舌頭' },
      { label: '背景', value: '純白去背' },
    ],
    prompt_en: 'A hand-drawn doodle-style illustration of a quirky, anthropomorphic, light-pink-skinned creature with thick, textured black outlines. The creature stands with both of its upper limbs (tentacles) arched and curled above its head, forming a heart shape. Its unique facial expression features two large, sleepy, heavy-lidded blue eyes with lowered lids. Below the eyes is a small W-shaped cat-mouth, and a long, thin, extended pink tongue hanging vertically straight down from the center of its face, reaching its lower belly. Its body has a light pink hue, and a clean, off-white circular patch is visible on its lower belly. The overall style is playful, cute, and lo-fi, with a slightly textured, pencil-like outline. The creature is centered and isolated on a pure white background.',
  },
]

export default function SavedPromptsPage({ userPrompts, onDelete, onClose }) {
  const all = [...DEMO_PROMPTS, ...userPrompts]

  return (
    <div className="saved-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="saved-panel">
        <div className="saved-header">
          <h2>收藏的 Prompt</h2>
          <button className="saved-close" onClick={onClose}>✕</button>
        </div>

        {all.length === 0 ? (
          <div className="saved-empty">還沒有收藏，去做一個 Prompt 試試！</div>
        ) : (
          <div className="saved-list">
            {all.map(p => (
              <div key={p.id} className="saved-item">
                <div className="saved-item-top">
                  <div>
                    <span className="saved-item-title">{p.title}</span>
                    {p.isDemo && <span className="saved-demo-badge">示範</span>}
                  </div>
                  {!p.isDemo && (
                    <button className="saved-delete" onClick={() => onDelete(p.id)}>刪除</button>
                  )}
                </div>

                {p.analysis && (
                  <p className="saved-analysis">{p.analysis}</p>
                )}

                <div className="saved-tags">
                  {p.tags.map(t => (
                    <span key={t.label} className="prompt-tag">
                      <span className="prompt-tag-label">{t.label}</span>
                      <span className="prompt-tag-value">{t.value}</span>
                    </span>
                  ))}
                </div>

                <div className="saved-prompt-block">
                  <CopyButton text={p.prompt_en} />
                  <p className="saved-prompt-text">{p.prompt_en}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
