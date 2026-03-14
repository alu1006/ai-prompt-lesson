import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const LESSON_URL = 'https://ai-prompt-lesson.codinglu.tw/'

const GUESS_IMAGES_A = [
  {
    id: 'portrait',
    src: '/intro/real-portrait-18c.jpg',
    title: '18 世紀貴族肖像',
    isAI: false,
    reveal: '真實畫作 — Gainsborough《藍衣男孩》(The Blue Boy，1770)，現藏美國加州 Huntington 美術館。18 世紀英國油畫的精緻質感，常讓人以為是 AI！',
  },
  {
    id: 'ai-city',
    src: '/intro/guess-ai-2.png',
    title: '巴黎街頭讀報老人',
    isAI: true,
    reveal: 'AI 生成 — 來源：Gemini／Prompt：A candid shot of an old man reading a newspaper at a cozy street cafe in Paris, sunlight filtering through tree leaves, warm tones, Fujifilm XT4, nostalgic film grain, realistic street photography, unposed. 逼真的光影與構圖，讓許多人以為是真實街拍！',
  },
  {
    id: 'ai-portrait',
    src: '/intro/guess-ai-3.png',
    title: '都市街頭女子',
    isAI: true,
    reveal: 'AI 生成 — 來源：lummi.ai／Prompt：Stylish woman in oversized gray coat and sunglasses in urban setting, exuding confidence and modern fashion sense. 照片級真實感是 AI 圖像的典型特徵。',
  },
  {
    id: 'pearl',
    src: '/intro/real-girl-pearl-earring.jpg',
    title: '戴珍珠耳環的少女',
    isAI: false,
    reveal: '真實畫作 — 維梅爾（Vermeer）1665 年油畫，現藏荷蘭海牙莫瑞泰斯皇家美術館。360 年前的人類傑作！',
  },
  {
    id: 'starry-night',
    src: '/intro/guess-real-1.png',
    title: '星夜',
    isAI: true,
    reveal: 'AI 生成，靈感來自梵谷風格 — 原作是梵谷 1889 年油畫，現藏紐約現代藝術博物館（MoMA）。旋渦狀筆觸讓許多人以為是 AI！',
    original: '/intro/original-starry-night.jpg',
    originalLabel: '查看梵谷原作',
  },
  {
    id: 'great-wave',
    src: '/intro/guess-real-2.png',
    title: '巨浪',
    isAI: true,
    reveal: 'AI 生成，靈感來自北齋風格 — 原作是葛飾北齋《神奈川沖浪裏》1831 年木刻版畫。極具設計感的構圖讓人誤以為是現代 AI！',
    original: '/intro/original-great-wave.jpg',
    originalLabel: '查看北齋原作',
  },
]

const GUESS_IMAGES_B = [
  {
    id: 'telephone-booths',
    src: '/intro/real-telephone-booths.jpg',
    title: '電話亭',
    isAI: false,
    reveal: '真實畫作 — 理查德·埃斯特斯《電話亭》(Telephone Booths，1968)，超寫實主義 (Hyperrealism) 代表作。埃斯特斯將多張照片和記憶重新組合，創造出比真實更真實的光影世界，徹底模糊了繪畫與攝影的界限！',
    original: 'https://www.museothyssen.org/en/collection/artists/estes-richard/telephone-booths',
    originalLabel: '在提森博物館查看原作',
  },
  {
    id: 'wanderer',
    src: '/intro/real-wanderer.jpg',
    title: '霧海上的流浪者',
    isAI: false,
    reveal: '真實畫作 — 卡斯帕·大衛·弗里德里希《霧海上的流浪者》(1818)，浪漫主義 (Romanticism) 的標誌性作品。它不追求細節的寫實，而是強調崇高 (Sublime) 的精神體驗——大自然的宏大與人類的渺小。',
    original: 'https://en.wikipedia.org/wiki/Wanderer_above_the_Sea_of_Fog',
    originalLabel: '查看維基百科介紹',
  },
  {
    id: 'help-squirrel',
    src: '/intro/real-help-squirrel.jpg',
    title: 'Help!!!',
    isAI: false,
    reveal: '真實照片 — Tibor Kercz 攝影，Comedy Wildlife Photography Awards 2017 得獎作品。攝影師在對的時間按下快門，捕捉到這個千載難逢的爆笑瞬間！',
  },
  {
    id: 'ai-rainy-day',
    src: '/intro/ai-rainy-day.jpg',
    title: '雨後林間',
    isAI: true,
    reveal: 'AI 生成 — 來源：Gemini。刻意加入細微的膠片噪點 (Film Grain) 和淺景深 (Shallow Depth of Field)，近處落葉與人影呈現自然的模糊質感，光線也是擴散的柔和日光，讓整體氛圍避免了 AI 常見的過度清晰感。',
  },
  {
    id: 'ai-dali',
    src: '/intro/ai-dali.jpg',
    title: '熔化的時代',
    isAI: true,
    reveal: 'AI 生成，超現實主義仿作 — 來源：Gemini，靈感來自薩爾瓦多·達利。保留了熔化的時鐘與夢幻景觀，但融入現代科技的荒謬：熔化的伺服器架、佈滿螞蟻的智慧型手機，以及顯示著熔化社群媒體圖標的螢幕。',
  },
  {
    id: 'monkey-escape',
    src: '/intro/real-monkey-escape.jpg',
    title: 'Monkey Escape',
    isAI: false,
    reveal: '真實照片 — Katy Laveck-Foster 攝影，Comedy Wildlife Photography Awards 得獎作品。這隻猴子的逃跑表情和姿態，正是真實自然觀察才能捕捉到的珍貴瞬間！',
  },
]

// 每次重新整理隨機顯示 A 或 B 組
const GUESS_IMAGES = Math.random() < 0.5 ? GUESS_IMAGES_A : GUESS_IMAGES_B

export default function IntroStep({ onNext }) {
  const [slide, setSlide] = useState(0)
  const [revealed, setRevealed] = useState({})

  const toggleReveal = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="intro-step">
      {/* Slide tab nav */}
      <div className="intro-tabs">
        {['什麼是生成式 AI', '猜真假活動', 'Prompt 如何影響結果'].map((label, i) => (
          <button
            key={i}
            className={`intro-tab${slide === i ? ' active' : ''}`}
            onClick={() => setSlide(i)}
          >
            <span className="intro-tab-num">{i + 1}</span> {label}
          </button>
        ))}
      </div>

      <div className="intro-content">

        {/* ── Slide 1 ── */}
        {slide === 0 && (
          <div className="intro-slide">
            <h2 className="intro-title">什麼是生成式 AI？</h2>
            <p className="intro-subtitle">Generative Artificial Intelligence</p>
            <div className="intro-cards-row">
              <div className="intro-card">
                <div className="intro-card-icon">🧠</div>
                <h3>學習大量資料</h3>
                <p>AI 從數百萬張圖片和文字描述中學習——學會什麼樣的文字對應什麼樣的視覺內容</p>
              </div>
              <div className="intro-arrow">→</div>
              <div className="intro-card">
                <div className="intro-card-icon">✍️</div>
                <h3>接收文字指令</h3>
                <p>你用文字描述想看到的畫面，這段描述叫做 <strong>Prompt（提示詞）</strong></p>
              </div>
              <div className="intro-arrow">→</div>
              <div className="intro-card">
                <div className="intro-card-icon">🎨</div>
                <h3>產生全新圖像</h3>
                <p>AI 根據 Prompt，在幾秒鐘內「想像」並繪製出一張從未存在過的圖片</p>
              </div>
            </div>
            <div className="intro-note">
              <strong>常見工具：</strong> DALL-E 3（OpenAI）、Midjourney、Stable Diffusion、Adobe Firefly
            </div>
            <div className="intro-qr-block">
              <QRCodeSVG value={LESSON_URL} size={128} />
              <div className="intro-qr-info">
                <p className="intro-qr-label">掃描 QR Code 開啟本課程</p>
                <a href={LESSON_URL} target="_blank" rel="noopener noreferrer" className="intro-qr-url">{LESSON_URL}</a>
              </div>
            </div>
          </div>
        )}

        {/* ── Slide 2: 猜真假 ── */}
        {slide === 1 && (
          <div className="intro-slide">
            <h2 className="intro-title">猜真假</h2>
            <p className="intro-subtitle">哪些是人類創作的？哪些是 AI 生成的？請記住你的答案！</p>
            <div className="guess-grid">
              {GUESS_IMAGES.map((img, index) => (
                <div key={img.id} className={`guess-card${revealed[img.id] ? (img.isAI ? ' revealed-ai' : ' revealed-real') : ''}`}>
                  {/* 編號 */}
                  <div className="guess-number">{index + 1}</div>

                  {/* 圖片（hover 放大） */}
                  <div className="guess-img-wrap">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="guess-img-zoomable"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                    <div className="guess-img-fallback" style={{ display: 'none' }}>
                      <span>🖼️</span><span>{img.title}</span>
                    </div>
                  </div>

                  {/* 底部 */}
                  <div className="guess-card-footer">
                    <span className="guess-title">{img.title}</span>
                    {!revealed[img.id] ? (
                      <button className="btn-reveal" onClick={() => toggleReveal(img.id)}>揭曉答案</button>
                    ) : (
                      <div className="guess-answer">
                        <span className={`guess-badge ${img.isAI ? 'ai' : 'real'}`}>
                          {img.isAI ? '🤖 AI 生成' : '🎨 真實畫作'}
                        </span>
                        <p className="guess-explanation">{img.reveal}</p>
                        {img.original && (
                          <a className="btn-original" href={img.original} target="_blank" rel="noopener noreferrer">{img.originalLabel} →</a>
                        )}
                        <button className="btn-hide" onClick={() => toggleReveal(img.id)}>收起</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Slide 3: Prompt ── */}
        {slide === 2 && (
          <div className="intro-slide">
            <h2 className="intro-title">Prompt 如何影響結果？</h2>
            <p className="intro-subtitle">越具體的描述，越精準的圖像</p>
            <div className="prompt-compare-visual">
              {[
                { level: '模糊', text: '"一隻貓"', img: '/intro/prompt-weak.png', note: '結果隨機，什麼都有可能' },
                { level: '加入風格與場景', text: '"一隻黑貓，坐在窗邊，水彩風格"', img: '/intro/prompt-medium.png', note: '顏色、姿勢、風格有了方向' },
                { level: '完整描述', text: '"一隻黑貓，窗邊，月光逆光，神秘氛圍，水彩，冷色調，夜晚"', img: '/intro/prompt-strong.png', note: '每個視覺細節都被精準控制' },
              ].map((item, i) => (
                <div key={i} className="prompt-visual-item">
                  <div className="prompt-visual-meta">
                    <span className={`prompt-visual-level level-${i}`}>{item.level}</span>
                    <span className="prompt-visual-text">{item.text}</span>
                  </div>
                  <div className="prompt-visual-img-wrap">
                    <img src={item.img} alt={item.level} className="prompt-visual-img"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                    <div className="prompt-visual-placeholder" style={{ display: 'none' }}><span>🖼️</span></div>
                  </div>
                  <p className="prompt-visual-note">{item.note}</p>
                  {i < 2 && <div className="prompt-visual-arrow">↓ 加入更多細節</div>}
                </div>
              ))}
            </div>
            <div className="intro-note">今天我們會一步步選擇這些元素，組合出你的專屬 Prompt！</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="step-nav">
        {slide > 0
          ? <button className="btn-prev" onClick={() => setSlide(s => s - 1)}>← 上一頁</button>
          : <div />
        }
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {slide < 2 && (
            <button className="btn-prev" onClick={() => setSlide(s => s + 1)}>下一頁 →</button>
          )}
          <button className="btn-next" onClick={onNext}>開始製作 Prompt →</button>
        </div>
      </div>
    </div>
  )
}
