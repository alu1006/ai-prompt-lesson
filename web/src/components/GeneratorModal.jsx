import { useState, useEffect, useRef, useMemo } from 'react'
import { toDisplayUrl } from '../utils/imageUrl.js'

const FIELDS = [
  {
    key: 'action', label: '主體動作', icon: '🏃',
    tags: ['站立', '坐著', '行走', '奔跑', '回頭望', '擁抱', '沉思', '跳舞'],
  },
  {
    key: 'lighting', label: '光影', icon: '☀️',
    tags: ['自然光', '黃金時段', '逆光', '柔光', '強烈陰影', '燭光', '夜燈'],
  },
  {
    key: 'angle', label: '拍攝角度', icon: '📐',
    tags: ['正面', '側面', '俯視', '仰視', '特寫', '半身', '全身', '遠景'],
  },
  {
    key: 'background', label: '背景', icon: '🏞️',
    tags: ['室內', '戶外', '城市', '森林', '海邊', '花園', '山景', '抽象'],
  },
  {
    key: 'mood', label: '情緒氛圍', icon: '🎭',
    tags: ['寧靜', '神祕', '歡快', '憂鬱', '壯闊', '溫暖', '孤寂', '夢幻'],
  },
  {
    key: 'color', label: '色調', icon: '🎨',
    tags: ['暖色調', '冷色調', '單色', '高對比', '柔和淡雅', '飽和鮮豔'],
  },
  {
    key: 'time', label: '時間段', icon: '🌅',
    tags: ['清晨', '正午', '傍晚', '黃昏', '深夜'],
  },
  {
    key: 'composition', label: '構圖', icon: '🖼️',
    tags: ['黃金比例', '對稱構圖', '大量留白', '動態構圖', '對角線'],
  },
  {
    key: 'season', label: '季節', icon: '🍂',
    tags: ['春天', '夏天', '秋天', '冬天'],
  },
  {
    key: 'detail', label: '細節程度', icon: '🔍',
    tags: ['寫實細緻', '印象朦朧', '草圖感', '半抽象'],
  },
]

// AI 生成的標籤預覽圖（執行 generate-tag-previews.js 後產生）
// 圖片存於 web/public/tag-previews/
const TAG_PREVIEWS = {
  // 主體動作
  '站立':    { src: '/tag-previews/站立.png',    desc: '人物直立站著，姿態自然端正' },
  '坐著':    { src: '/tag-previews/坐著.png',    desc: '人物放鬆坐在椅子上' },
  '行走':    { src: '/tag-previews/行走.png',    desc: '人物自然向前行走的姿態' },
  '奔跑':    { src: '/tag-previews/奔跑.png',    desc: '人物全力奔跑，充滿動感與速度感' },
  '回頭望':  { src: '/tag-previews/回頭望.png',  desc: '人物轉身回頭望向身後' },
  '擁抱':    { src: '/tag-previews/擁抱.png',    desc: '兩人溫暖相擁' },
  '沉思':    { src: '/tag-previews/沉思.png',    desc: '人物托腮沉浸在思考中' },
  '跳舞':    { src: '/tag-previews/跳舞.png',    desc: '人物優雅地舞動，身姿流暢' },
  // 光影
  '自然光':   { src: '/tag-previews/自然光.png',   desc: '柔和均勻的自然日光，陰影輕淡' },
  '黃金時段': { src: '/tag-previews/黃金時段.png', desc: '日落前橙金色暖光，影子拉長' },
  '逆光':    { src: '/tag-previews/逆光.png',    desc: '強烈背光，主體呈現剪影與輪廓光' },
  '柔光':    { src: '/tag-previews/柔光.png',    desc: '散射柔和光線，無明顯陰影' },
  '強烈陰影': { src: '/tag-previews/強烈陰影.png', desc: '強烈明暗對比，Chiaroscuro 效果' },
  '燭光':    { src: '/tag-previews/燭光.png',    desc: '昏暗中溫暖搖曳的燭火光芒' },
  '夜燈':    { src: '/tag-previews/夜燈.png',    desc: '夜晚室內燈光，形成溫暖光圈' },
  // 拍攝角度
  '正面':    { src: '/tag-previews/正面.png',    desc: '正對鏡頭的對稱正面視角' },
  '側面':    { src: '/tag-previews/側面.png',    desc: '純側面輪廓剪影視角' },
  '俯視':    { src: '/tag-previews/俯視.png',    desc: '由正上方往下俯瞰的鳥瞰視角' },
  '仰視':    { src: '/tag-previews/仰視.png',    desc: '由下往上仰望的低角度視角，有強烈透視感' },
  '特寫':    { src: '/tag-previews/特寫.png',    desc: '極近距離特寫，臉部細節填滿畫面' },
  '半身':    { src: '/tag-previews/半身.png',    desc: '頭部到腰部的半身構圖' },
  '全身':    { src: '/tag-previews/全身.png',    desc: '從頭到腳的完整全身構圖' },
  '遠景':    { src: '/tag-previews/遠景.png',    desc: '廣闊遠景，人物在浩瀚環境中顯得渺小' },
  // 背景
  '室內':    { src: '/tag-previews/室內.png',    desc: '溫馨室內空間，有傢俱與室內陳設' },
  '戶外':    { src: '/tag-previews/戶外.png',    desc: '開闊的戶外自然環境' },
  '城市':    { src: '/tag-previews/城市.png',    desc: '都市景觀，高樓、街道與建築' },
  '森林':    { src: '/tag-previews/森林.png',    desc: '茂密森林，陽光穿透樹冠灑落' },
  '海邊':    { src: '/tag-previews/海邊.png',    desc: '海岸線，浪潮與沙灘' },
  '花園':    { src: '/tag-previews/花園.png',    desc: '百花盛開的美麗花園' },
  '山景':    { src: '/tag-previews/山景.png',    desc: '壯闊山脈，峰巒連綿' },
  '抽象':    { src: '/tag-previews/抽象.png',    desc: '非具象的幾何形狀與色塊組成的抽象背景' },
  // 情緒氛圍
  '寧靜':    { src: '/tag-previews/寧靜.png',    desc: '平靜安詳，如鏡面般靜止的氛圍' },
  '神祕':    { src: '/tag-previews/神祕.png',    desc: '迷霧與陰影交織的神秘感' },
  '歡快':    { src: '/tag-previews/歡快.png',    desc: '明亮鮮豔的色彩與歡樂活潑的氣息' },
  '憂鬱':    { src: '/tag-previews/憂鬱.png',    desc: '灰藍色調，沉鬱低迴的情緒' },
  '壯闊':    { src: '/tag-previews/壯闊.png',    desc: '宏偉壯觀的氣魄，令人震撼' },
  '溫暖':    { src: '/tag-previews/溫暖.png',    desc: '溫馨舒適、令人安心的溫暖感' },
  '孤寂':    { src: '/tag-previews/孤寂.png',    desc: '孤獨的身影置身於無垠空間' },
  '夢幻':    { src: '/tag-previews/夢幻.png',    desc: '如夢似幻的超現實飄渺意境' },
  // 色調
  '暖色調':   { src: '/tag-previews/暖色調.png',   desc: '以紅、橙、黃為主的溫暖色彩' },
  '冷色調':   { src: '/tag-previews/冷色調.png',   desc: '以藍、紫、綠為主的冷靜色彩' },
  '單色':    { src: '/tag-previews/單色.png',    desc: '同一色相的深淺濃淡變化' },
  '高對比':   { src: '/tag-previews/高對比.png',   desc: '強烈的黑白明暗對比，無中間色調' },
  '柔和淡雅': { src: '/tag-previews/柔和淡雅.png', desc: '粉嫩柔和的低飽和度淡雅色彩' },
  '飽和鮮豔': { src: '/tag-previews/飽和鮮豔.png', desc: '高飽和度、色彩濃烈鮮明奪目' },
  // 時間段
  '清晨':    { src: '/tag-previews/清晨.png',    desc: '清晨曙光初現，薄霧與晨露' },
  '正午':    { src: '/tag-previews/正午.png',    desc: '正午強烈陽光直射，影子短小' },
  '傍晚':    { src: '/tag-previews/傍晚.png',    desc: '傍晚柔和斜陽，影子拉長' },
  '黃昏':    { src: '/tag-previews/黃昏.png',    desc: '日落後彩霞滿天，白晝轉入黑夜' },
  '深夜':    { src: '/tag-previews/深夜.png',    desc: '深沉黑夜，繁星或月光靜謐照耀' },
  // 構圖
  '黃金比例': { src: '/tag-previews/黃金比例.png', desc: '符合黃金比例螺旋的和諧平衡構圖' },
  '對稱構圖': { src: '/tag-previews/對稱構圖.png', desc: '左右完全對稱、均衡穩定的構圖' },
  '大量留白': { src: '/tag-previews/大量留白.png', desc: '主體小而背景空曠，東方式留白美學' },
  '動態構圖': { src: '/tag-previews/動態構圖.png', desc: '對角線與斜線帶出強烈動感與張力' },
  '對角線':   { src: '/tag-previews/對角線.png',   desc: '鮮明對角線穿越畫面，製造視覺張力' },
  // 季節
  '春天':    { src: '/tag-previews/春天.png',    desc: '春日櫻花與嫩綠新芽，生機盎然' },
  '夏天':    { src: '/tag-previews/夏天.png',    desc: '夏日濃密綠蔭與耀眼藍天' },
  '秋天':    { src: '/tag-previews/秋天.png',    desc: '秋天金橙紅葉，落葉繽紛' },
  '冬天':    { src: '/tag-previews/冬天.png',    desc: '冬日白雪覆蓋的蕭瑟枯枝大地' },
  // 細節程度
  '寫實細緻': { src: '/tag-previews/寫實細緻.png', desc: '近乎照片的高度細緻寫實筆觸' },
  '印象朦朧': { src: '/tag-previews/印象朦朧.png', desc: '印象派風格，色彩朦朧如夢' },
  '草圖感':   { src: '/tag-previews/草圖感.png',   desc: '鉛筆或炭筆的粗獷素描線條感' },
  '半抽象':   { src: '/tag-previews/半抽象.png',   desc: '具象與抽象之間，形體依稀可辨' },
}

const BASIC_KEYS    = ['action', 'lighting', 'angle', 'background']
const ADVANCED_KEYS = ['mood', 'color', 'time', 'composition', 'season', 'detail']

function compilePrompt(tags, customs, styleParts) {
  const parts = [...styleParts]
  const add = (key, fmt) => {
    const v = [tags[key], customs[key]].filter(Boolean).join('，')
    if (v) parts.push(fmt(v))
  }
  add('action',      v => `主體${v}`)
  add('background',  v => `${v}場景`)
  add('lighting',    v => `${v}`)
  add('angle',       v => `${v}視角`)
  add('mood',        v => `${v}氛圍`)
  add('color',       v => `${v}`)
  add('time',        v => `${v}`)
  add('composition', v => `${v}`)
  add('season',      v => `${v}`)
  add('detail',      v => `${v}`)
  return parts.join('，')
}

const emptyFields = () => Object.fromEntries(FIELDS.map(f => [f.key, '']))

export default function GeneratorModal({ context, onClose }) {
  const { movement, artist, painting } = context

  const styleParts = useMemo(() => [
    painting ? `受《${painting.name_zh || painting.name_en}》啟發` : null,
    artist   ? `${artist.name_zh || artist.name_en}的風格` : null,
    `${movement.name_zh || movement.name_en}流派`,
  ].filter(Boolean), [movement, artist, painting])

  const [uploadedFile, setUploadedFile]   = useState(null)
  const [previewUrl,   setPreviewUrl]     = useState(null)
  const [generating,   setGenerating]     = useState(false)
  const [result,       setResult]         = useState(null)
  const [genError,     setGenError]       = useState(null)
  const [dragOver,     setDragOver]       = useState(false)
  const [showAdvanced, setShowAdvanced]   = useState(false)
  const [selectedTags, setSelectedTags]   = useState(emptyFields)
  const [customTexts,  setCustomTexts]    = useState(emptyFields)
  const [prompt,       setPrompt]         = useState(() => styleParts.join('，'))
  const [promptEdited, setPromptEdited]   = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  // Auto-recompile prompt when fields change (unless user has manually edited)
  useEffect(() => {
    if (!promptEdited) {
      setPrompt(compilePrompt(selectedTags, customTexts, styleParts))
    }
  }, [selectedTags, customTexts, styleParts, promptEdited])

  function toggleTag(fieldKey, tag) {
    setSelectedTags(prev => ({ ...prev, [fieldKey]: prev[fieldKey] === tag ? '' : tag }))
    setPromptEdited(false)
  }

  function setCustomText(fieldKey, value) {
    setCustomTexts(prev => ({ ...prev, [fieldKey]: value }))
    setPromptEdited(false)
  }

  function handlePromptChange(e) {
    setPrompt(e.target.value)
    setPromptEdited(true)
  }

  function resetPrompt() {
    setPromptEdited(false)
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setUploadedFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setGenError(null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function handleGenerate() {
    setGenerating(true)
    setGenError(null)
    setResult(null)
    try {
      const base64 = await fileToBase64(uploadedFile)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: uploadedFile.type,
          prompt,
          styleContext: {
            movementName: movement.name_zh || movement.name_en,
            artistName:   artist  ? (artist.name_zh  || artist.name_en)  : null,
            paintingName: painting ? (painting.name_zh || painting.name_en) : null,
          }
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || `伺服器錯誤 ${response.status}`)
      setResult(data)
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const refThumbUrl = painting ? toDisplayUrl(painting.image_url, 120) : null

  const renderField = field => (
    <div key={field.key} className="pfield">
      <div className="pfield-header">
        <span className="pfield-icon">{field.icon}</span>
        <span className="pfield-label">{field.label}</span>
      </div>
      <div className="pfield-tags">
        {field.tags.map(tag => {
          const preview = TAG_PREVIEWS[tag]
          const btn = (
            <button
              type="button"
              className={`ptag${selectedTags[field.key] === tag ? ' active' : ''}${preview ? ' has-preview' : ''}`}
              onClick={() => toggleTag(field.key, tag)}
            >
              {tag}
            </button>
          )
          return preview ? (
            <span key={tag} className="ptag-wrapper">
              {btn}
              <span className="ptag-tooltip">
                <img src={preview.src} alt={tag} onError={e => { e.target.style.display = 'none' }} />
                <p className="ptag-tooltip-desc">{preview.desc}</p>
              </span>
            </span>
          ) : (
            <span key={tag}>{btn}</span>
          )
        })}
      </div>
      <input
        className="pfield-input"
        type="text"
        placeholder="自訂..."
        value={customTexts[field.key]}
        onChange={e => setCustomText(field.key, e.target.value)}
      />
    </div>
  )

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" role="dialog" aria-modal="true">

        <div className="modal-header">
          <div className="context-breadcrumb">
            <span className="crumb crumb-movement">{movement.name_zh || movement.name_en}</span>
            {artist && <><span className="crumb-sep">›</span><span className="crumb crumb-artist">{artist.name_zh || artist.name_en}</span></>}
            {painting && <><span className="crumb-sep">›</span><span className="crumb crumb-painting">《{painting.name_zh || painting.name_en}》</span></>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="關閉">✕</button>
        </div>

        <div className="modal-body">

          {refThumbUrl && (
            <div className="reference-row">
              <span className="section-label">參考畫作</span>
              <img src={refThumbUrl} alt={painting.name_zh} className="ref-thumb" onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          {/* Upload */}
          <div>
            <p className="section-label">上傳參考照片 <span className="section-optional">（選填）</span></p>
            <div
              className={`upload-zone${dragOver ? ' drag-over' : ''}${uploadedFile ? ' has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl
                ? <img src={previewUrl} alt="已上傳" className="upload-preview" />
                : <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>點擊或拖曳照片至此</span>
                    <span className="upload-hint">不上傳也可直接生成風格示例</span>
                  </div>
              }
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          </div>

          {/* Structured prompt fields */}
          <div>
            <p className="section-label">描述畫面</p>
            <div className="prompt-fields">
              {FIELDS.filter(f => BASIC_KEYS.includes(f.key)).map(renderField)}
              {showAdvanced && FIELDS.filter(f => ADVANCED_KEYS.includes(f.key)).map(renderField)}
              <button type="button" className="btn-toggle-advanced"
                onClick={() => setShowAdvanced(v => !v)}>
                {showAdvanced ? '收起進階選項 ▲' : '更多選項 ▼'}
              </button>
            </div>
          </div>

          {/* Prompt preview */}
          <div>
            <div className="prompt-preview-header">
              <span className="section-label" style={{ marginBottom: 0 }}>提示詞預覽</span>
              {promptEdited && (
                <button type="button" className="btn-reset-prompt" onClick={resetPrompt}>
                  重設 ↺
                </button>
              )}
            </div>
            <textarea
              className="prompt-textarea"
              value={prompt}
              onChange={handlePromptChange}
              rows={3}
              placeholder="描述您希望生成的圖像..."
            />
            {promptEdited && <p className="prompt-edited-hint">已手動修改 · 點擊「重設」可恢復自動生成</p>}
          </div>

          {genError && <div className="gen-error">⚠️ {genError}</div>}

          <button
            className={`btn-generate-main${generating ? ' loading' : ''}`}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '生成中...' : uploadedFile ? '以照片風格生成' : '生成風格示例'}
          </button>

          {result && (
            <div className="result-section">
              <p className="section-label">生成結果</p>
              <img src={result.imageUrl} alt="生成圖像" className="result-image" />
              {result.revisedPrompt && (
                <details className="revised-prompt">
                  <summary>DALL-E 修訂後的提示詞</summary>
                  <p>{result.revisedPrompt}</p>
                </details>
              )}
              <a href={result.imageUrl} download="generated-art.png" className="btn-download"
                target="_blank" rel="noreferrer">
                下載圖像
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
