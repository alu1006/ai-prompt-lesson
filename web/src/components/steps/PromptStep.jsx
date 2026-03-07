import { useState } from 'react'

function buildPrompts(selection) {
  const { subject, style, action, scene, angle, lighting, mood, product } = selection

  // ── 中文 prompt ──
  const zhParts = []
  if (subject) zhParts.push(subject)
  if (action?.zh) zhParts.push(action.zh)
  if (scene?.zh) zhParts.push(`在${scene.zh}`)
  if (angle?.zh) zhParts.push(`${angle.zh}視角`)
  if (style?.label_zh) zhParts.push(`以${style.label_zh}風格`)
  if (lighting?.zh) zhParts.push(lighting.zh)
  if (mood?.zh) zhParts.push(`${mood.zh}氛圍`)
  if (product?.id && product.id !== 'none') zhParts.push(`去背、適合印製於${product.name_zh}`)

  // ── English prompt ──
  const enParts = []
  if (subject) enParts.push(subject)
  if (action?.en) enParts.push(action.en)
  if (scene?.en) enParts.push(scene.en)
  if (angle?.en) enParts.push(angle.en)
  if (style?.label_en) enParts.push(style.label_en)
  if (lighting?.en) enParts.push(lighting.en)
  if (mood?.en) enParts.push(mood.en)
  if (product?.prompt_en) enParts.push(product.prompt_en)
  enParts.push('highly detailed, award-winning')

  return {
    zh: zhParts.join('，'),
    en: enParts.join(', '),
  }
}

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
      tags: [
        selection.subject && { label: '主體', value: selection.subject },
        selection.style && { label: '風格', value: selection.style.label_zh },
        selection.action && { label: '動作', value: selection.action.zh },
        selection.scene && { label: '場景', value: selection.scene.zh },
        selection.angle && { label: '鏡頭', value: selection.angle.zh },
        selection.lighting && { label: '光影', value: selection.lighting.zh },
        selection.mood && { label: '情緒', value: selection.mood.zh },
        selection.product?.id && selection.product.id !== 'none' && { label: '產品', value: selection.product.name_zh },
      ].filter(Boolean),
      prompt_zh: zh,
      prompt_en: en,
    })
    setSaved(true)
  }

  const tags = [
    selection.subject && { label: '主體', value: selection.subject },
    selection.style && { label: '風格', value: selection.style.label_zh },
    selection.action && { label: '動作', value: selection.action.zh },
    selection.scene && { label: '場景', value: selection.scene.zh },
    selection.angle && { label: '鏡頭', value: selection.angle.zh },
    selection.lighting && { label: '光影', value: selection.lighting.zh },
    selection.mood && { label: '情緒', value: selection.mood.zh },
    selection.product?.id && selection.product.id !== 'none' && { label: '產品', value: selection.product.name_zh },
  ].filter(Boolean)

  return (
    <div className="wizard-step-page">
      <div className="step-heading">
        <h2>你的 Prompt 完成了！</h2>
        <p>以下是根據你的選擇組合出的提示詞，複製後可貼到 AI 工具使用</p>
      </div>

      {/* Tags summary */}
      <div className="prompt-tags-summary">
        {tags.map(t => (
          <span key={t.label} className="prompt-tag">
            <span className="prompt-tag-label">{t.label}</span>
            <span className="prompt-tag-value">{t.value}</span>
          </span>
        ))}
      </div>

      {/* Chinese prompt */}
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
          <span className="prompt-block-hint">推薦用於 DALL-E、Midjourney 等工具</span>
          <CopyButton text={en} />
        </div>
        <div className="prompt-block-text en">{en}</div>
      </div>

      {/* Usage tips */}
      <div className="prompt-tips">
        <h4>怎麼使用這個 Prompt？</h4>
        <ol>
          <li>複製上方的中文提示詞 / English Prompt</li>
          <li>前往 <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer"><strong>Gemini</strong></a></li>
          <li>貼入文字框後按下生成，等待 10–30 秒</li>
          <li>可以調整描述、重新選擇細節，看看效果有什麼不同！</li>
        </ol>
      </div>

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 返回修改細節</button>
        <button className="btn-next" onClick={handleSave} disabled={saved}>
          {saved ? '✓ 已收藏' : '收藏此 Prompt'}
        </button>
      </div>
    </div>
  )
}
