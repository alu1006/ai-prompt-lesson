import { useState } from 'react'
import { buildPrompts, selectionTags } from '../../utils/prompts.js'

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

export default function PromptStep({ selection, onPrev, onSave }) {
  const [saved, setSaved] = useState(false)
  const { zh, en } = buildPrompts(selection)

  const handleSave = () => {
    onSave({
      id: `user-${Date.now()}`,
      title: selection.subject || '我的 Prompt',
      tags: selectionTags(selection),
      prompt_zh: zh,
      prompt_en: en,
      palette: selection.palette,
      selection,
    })
    setSaved(true)
  }

  const tags = selectionTags(selection)

  return (
    <div className="wizard-step-page">
      <div className="step-heading">
        <h2>你的 Prompt 完成了！</h2>
        <p>以下是根據你的選擇組合出的提示詞，複製後可貼到 AI 工具使用</p>
      </div>

      {/* Tags summary */}
      <div className="prompt-tags-summary">
        {tags.map(t => (
          <span key={`${t.label}-${t.value}`} className="prompt-tag">
            <span className="prompt-tag-label">{t.label}</span>
            <span className="prompt-tag-value">{t.value}</span>
          </span>
        ))}
      </div>

      {/* Chinese prompt */}
      {selection.palette?.enabled && <div className="prompt-palette-summary" aria-label="所選配色">{selection.palette.colors.map((hex, index) => <span key={index}><i style={{ background: hex }} />{hex}</span>)}</div>}
      <div className="prompt-block">
        <div className="prompt-block-header">
          <span className="prompt-block-title">中文提示詞</span>
          <CopyButton text={zh} />
        </div>
        <div className="prompt-block-text zh">{zh || '（尚未選擇任何元素）'}</div>
      </div>

      {/* English prompt */}
      <div className="prompt-block">
        <div className="prompt-block-header">
          <span className="prompt-block-title">English Prompt</span>
          <span className="prompt-block-hint">預設主體附英文；自訂描述保留原文</span>
          <CopyButton text={en} />
        </div>
        <div className="prompt-block-text en">{en}</div>
      </div>

      {/* Gemini CTA */}
      <a
        className="btn-gemini-cta"
        href="https://gemini.google.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="btn-gemini-icon">✦</span>
        前往 Gemini 生成圖像
        <span className="btn-gemini-sub">複製上方 Prompt 貼入即可</span>
      </a>

      {/* Usage tips */}
      <div className="prompt-tips">
        <h4>怎麼使用這個 Prompt？</h4>
        <ol>
          <li>複製上方的中文提示詞 / English Prompt</li>
          <li>點擊上方按鈕前往 Gemini</li>
          <li>貼入文字框後按下生成，等待 10–30 秒</li>
          <li>可以調整描述、重新選擇細節，看看效果有什麼不同！</li>
        </ol>
      </div>

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 返回選擇產品</button>
        <button className="btn-next" onClick={handleSave} disabled={saved}>
          {saved ? '✓ 已收藏' : '收藏此 Prompt'}
        </button>
      </div>
    </div>
  )
}
