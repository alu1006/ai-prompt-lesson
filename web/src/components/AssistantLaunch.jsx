import { useState } from 'react'
import { assistantUrl, openCopiedAssistant } from '../utils/aiLaunch.js'

export default function AssistantLaunch({ zh, en, turnaround }) {
  const [language, setLanguage] = useState('zh')
  const [status, setStatus] = useState('')
  const [manualOpen, setManualOpen] = useState(false)
  const prompt = language === 'zh' ? zh : en
  const ready = Boolean(prompt.trim())
  const copyFor = async provider => {
    try {
      if (provider === 'gemini') {
        const opened = await openCopiedAssistant('gemini',prompt,{open:url=>window.open(url,'_blank'),copy:text=>navigator.clipboard.writeText(text)})
        setManualOpen(!opened)
        setStatus(opened ? '已複製提示詞！在 Gemini 貼上即可。' : '已複製提示詞；瀏覽器未開啟新分頁，請按下方連結開啟 Gemini。')
      } else {
        await navigator.clipboard.writeText(prompt)
        setStatus('已複製提示詞；ChatGPT 也會嘗試自動帶入。若未帶入，請直接貼上。')
      }
    } catch {
      setStatus('瀏覽器未允許複製。請使用上方提示詞區塊手動選取並複製，再貼到生成工具。')
    }
  }
  return <section className="assistant-launch" aria-label="選擇生成工具">
    <div className="assistant-launch-heading"><h3>帶著 Prompt 出發！</h3><label>帶入語言<select value={language} onChange={e=>{setLanguage(e.target.value);setStatus('');setManualOpen(false)}}><option value="zh">中文提示詞</option><option value="en">English Prompt</option></select></label></div>
    <div className="assistant-launch-grid">
      <a className="assistant-link chatgpt" href={ready ? assistantUrl('chatgpt',prompt) : undefined} aria-disabled={!ready} target="_blank" rel="noopener noreferrer" onClick={e=>{if(!ready){e.preventDefault();return}copyFor('chatgpt')}}><strong>ChatGPT <span aria-hidden="true">↗</span></strong><span>開啟並帶入提示詞</span></a>
      <button type="button" className="assistant-link gemini" disabled={!ready} onClick={()=>copyFor('gemini')}><strong>Gemini <span aria-hidden="true">✦</span></strong><span>複製提示詞並開啟，貼上即可</span></button>
    </div>
    <p className="assistant-launch-status" role="status">{status || 'ChatGPT 嘗試自動帶入；Gemini 需貼上。若需登入，登入後可貼上已複製的提示詞。'}</p>
    {manualOpen && <a href={assistantUrl('gemini',prompt)} target="_blank" rel="noopener noreferrer">提示詞已複製，開啟 Gemini →</a>}
    {turnaround && <p className="assistant-upload-reminder">三視圖請在選用的工具中另外上傳手繪草圖。</p>}
  </section>
}
