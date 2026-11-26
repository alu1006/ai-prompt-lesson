import { useState } from 'react'
import { buildPrompts, selectionTags } from '../../utils/prompts.js'
import { isTurnaround } from '../../data/turnaroundPrompt.js'
import AssistantLaunch from '../AssistantLaunch.jsx'
import CopyButton from '../CopyButton.jsx'

export default function PromptStep({ selection, onPrev, onSave }) {
  const [saved, setSaved] = useState(false)
  const { zh, en } = buildPrompts(selection)
  const turnaround = isTurnaround(selection)

  const handleSave = () => {
    onSave({
      id: `user-${Date.now()}`,
      title: turnaround ? '手繪角色三視圖' : selection.subject || '我的 Prompt',
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
        <h2>{turnaround ? '手繪角色三視圖 Prompt' : '你的 Prompt 完成了！'}</h2>
        <p>{turnaround ? '複製完整範本，並在生成工具中一起上傳手繪草圖。' : '以下是根據你的選擇組合出的提示詞，複製後可貼到 AI 工具使用'}</p>
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
      {turnaround && <div className="turnaround-note"><strong>先上傳草圖，再貼上 Prompt</strong><p>這個範本以你上傳的手繪角色為準，保留原始比例與手繪感。一般的主體、風格、配色與細節選擇不會加入三視圖範本。</p><p>若側面或背面在草圖中沒有呈現，請補充關鍵特徵；生成後再檢查三個視角是否一致。</p></div>}
      {!turnaround && selection.palette?.enabled && <div className="prompt-palette-summary" aria-label="所選配色">{selection.palette.colors.map((hex, index) => <span key={index}><i style={{ background: hex }} />{hex}</span>)}</div>}
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
          <span className="prompt-block-hint">{turnaround ? '完整三視圖範本的英文版本' : '預設主體附英文；自訂描述保留原文'}</span>
          <CopyButton text={en} />
        </div>
        <div className="prompt-block-text en">{en}</div>
      </div>

      <AssistantLaunch zh={zh} en={en} turnaround={turnaround} />

      {/* Usage tips */}
      <div className="prompt-tips">
        <h4>怎麼使用這個 Prompt？</h4>
        <ol>
          <li>選擇要帶入的中文提示詞 / English Prompt</li>
          <li>點擊 ChatGPT 或 Gemini 入口；未自動帶入時貼上提示詞</li>
          <li>{turnaround ? '上傳手繪草圖，再貼入提示詞並要求生成圖像' : '貼入文字框後要求生成圖像'}</li>
          <li>{turnaround ? '檢查正面、側面、背面的頭身比例、服裝、髮型、道具與特徵是否一致' : '可以調整描述、重新選擇細節，看看效果有什麼不同！'}</li>
        </ol>
      </div>

      <div className="step-nav">
        <button className="btn-prev" onClick={onPrev}>← 返回產品／用途</button>
        <button className="btn-next" onClick={handleSave} disabled={saved}>
          {saved ? '✓ 已收藏' : '收藏此 Prompt'}
        </button>
      </div>
    </div>
  )
}
