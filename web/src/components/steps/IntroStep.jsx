import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const LESSON_URL = 'https://ai-prompt-lesson.codinglu.tw/'

const GUESS_IMAGES_A = [
  {
    id: 'portrait',
    src: '/intro/real-portrait-18c.webp',
    title: '18 世紀貴族肖像',
    isAI: false,
    reveal: '真實畫作 — Gainsborough《藍衣男孩》(The Blue Boy，1770)，現藏美國加州 Huntington 美術館。18 世紀英國油畫的精緻質感，常讓人以為是 AI！',
  },
  {
    id: 'ai-city',
    src: '/intro/guess-ai-2.webp',
    title: '巴黎街頭讀報老人',
    isAI: true,
    reveal: 'AI 生成 — 來源：Gemini／Prompt：A candid shot of an old man reading a newspaper at a cozy street cafe in Paris, sunlight filtering through tree leaves, warm tones, Fujifilm XT4, nostalgic film grain, realistic street photography, unposed. 逼真的光影與構圖，讓許多人以為是真實街拍！',
  },
  {
    id: 'ai-portrait',
    src: '/intro/guess-ai-3.webp',
    title: '都市街頭女子',
    isAI: true,
    reveal: 'AI 生成 — 來源：lummi.ai／Prompt：Stylish woman in oversized gray coat and sunglasses in urban setting, exuding confidence and modern fashion sense. 照片級真實感是 AI 圖像的典型特徵。',
  },
  {
    id: 'pearl',
    src: '/intro/real-girl-pearl-earring.webp',
    title: '戴珍珠耳環的少女',
    isAI: false,
    reveal: '真實畫作 — 維梅爾（Vermeer）1665 年油畫，現藏荷蘭海牙莫瑞泰斯皇家美術館。360 年前的人類傑作！',
  },
  {
    id: 'starry-night',
    src: '/intro/guess-real-1.webp',
    title: '星夜',
    isAI: true,
    reveal: 'AI 生成，靈感來自梵谷風格 — 原作是梵谷 1889 年油畫，現藏紐約現代藝術博物館（MoMA）。旋渦狀筆觸讓許多人以為是 AI！',
    original: '/intro/original-starry-night.webp',
    originalLabel: '查看梵谷原作',
  },
  {
    id: 'great-wave',
    src: '/intro/guess-real-2.webp',
    title: '巨浪',
    isAI: true,
    reveal: 'AI 生成，靈感來自北齋風格 — 原作是葛飾北齋《神奈川沖浪裏》1831 年木刻版畫。極具設計感的構圖讓人誤以為是現代 AI！',
    original: '/intro/original-great-wave.webp',
    originalLabel: '查看北齋原作',
  },
]

const GUESS_IMAGES_B = [
  {
    id: 'telephone-booths',
    src: '/intro/real-telephone-booths.webp',
    title: '電話亭',
    isAI: false,
    reveal: '真實畫作 — 理查德·埃斯特斯《電話亭》(Telephone Booths，1968)，超寫實主義 (Hyperrealism) 代表作。埃斯特斯將多張照片和記憶重新組合，創造出比真實更真實的光影世界，徹底模糊了繪畫與攝影的界限！',
    original: 'https://www.museothyssen.org/en/collection/artists/estes-richard/telephone-booths',
    originalLabel: '在提森博物館查看原作',
  },
  {
    id: 'wanderer',
    src: '/intro/real-wanderer.webp',
    title: '霧海上的流浪者',
    isAI: false,
    reveal: '真實畫作 — 卡斯帕·大衛·弗里德里希《霧海上的流浪者》(1818)，浪漫主義 (Romanticism) 的標誌性作品。它不追求細節的寫實，而是強調崇高 (Sublime) 的精神體驗——大自然的宏大與人類的渺小。',
    original: 'https://en.wikipedia.org/wiki/Wanderer_above_the_Sea_of_Fog',
    originalLabel: '查看維基百科介紹',
  },
  {
    id: 'help-squirrel',
    src: '/intro/real-help-squirrel.webp',
    title: 'Help!!!',
    isAI: false,
    isPhoto: true,
    reveal: '真實照片 — Tibor Kercz 攝影，Comedy Wildlife Photography Awards 2017 得獎作品。攝影師在對的時間按下快門，捕捉到這個千載難逢的爆笑瞬間！',
  },
  {
    id: 'ai-rainy-day',
    src: '/intro/ai-rainy-day.webp',
    title: '雨後林間',
    isAI: true,
    reveal: 'AI 生成 — 來源：Gemini。刻意加入細微的膠片噪點 (Film Grain) 和淺景深 (Shallow Depth of Field)，近處落葉與人影呈現自然的模糊質感，光線也是擴散的柔和日光，讓整體氛圍避免了 AI 常見的過度清晰感。',
  },
  {
    id: 'ai-dali',
    src: '/intro/ai-dali.webp',
    title: '熔化的時代',
    isAI: true,
    reveal: 'AI 生成，超現實主義仿作 — 來源：Gemini，靈感來自薩爾瓦多·達利。保留了熔化的時鐘與夢幻景觀，但融入現代科技的荒謬：熔化的伺服器架、佈滿螞蟻的智慧型手機，以及顯示著熔化社群媒體圖標的螢幕。',
  },
  {
    id: 'monkey-escape',
    src: '/intro/real-monkey-escape.webp',
    title: 'Monkey Escape',
    isAI: false,
    isPhoto: true,
    reveal: '真實照片 — Katy Laveck-Foster 攝影，Comedy Wildlife Photography Awards 得獎作品。這隻猴子的逃跑表情和姿態，正是真實自然觀察才能捕捉到的珍貴瞬間！',
  },
]

const GUESS_IMAGES_C = [
  {
    id: 'kingfisher',
    src: '/intro/ai-kingfisher.webp',
    title: '翠鳥捕魚',
    isAI: true,
    reveal: 'AI 生成 — 來源：ChatGPT／Prompt：Wildlife photograph of a kingfisher bursting out of the water with a small fish, frozen droplets, 600mm telephoto, shallow depth of field, overcast morning light, natural colors. 指定鏡頭焦段與淺景深，是讓 AI 圖像看起來像生態攝影的關鍵！',
  },
  {
    id: 'vertumnus',
    src: '/intro/real-vertumnus.webp',
    title: '蔬果人像',
    isAI: false,
    reveal: '真實畫作 — 阿爾欽博托（Arcimboldo）《威爾圖努斯》(Vertumnus，約 1591)，現藏瑞典斯庫克洛斯特城堡。畫中人其實是神聖羅馬帝國皇帝魯道夫二世，四百多年前就有這麼像 AI 的創意！',
    original: 'https://en.wikipedia.org/wiki/Vertumnus_(Arcimboldo)',
    originalLabel: '查看維基百科介紹',
  },
  {
    id: 'night-market',
    src: '/intro/ai-night-market.webp',
    title: '夜市攤販',
    isAI: true,
    reveal: 'AI 生成 — 來源：ChatGPT／Prompt：Candid documentary photo of an elderly vendor cooking at a Taiwanese night market, steam rising, warm bulb light, slightly imperfect framing, 35mm film grain, natural skin texture, no readable text. 刻意要求「不完美構圖」與底片顆粒，讓畫面像真實街拍。',
  },
  {
    id: 'prismatic',
    src: '/intro/real-prismatic.webp',
    title: '彩色溫泉',
    isAI: false,
    isPhoto: true,
    reveal: '真實照片 — 美國黃石公園大稜鏡溫泉空拍，Jim Peaco／美國國家公園管理局攝影（2001）。邊緣的橘黃色主要來自嗜熱微生物，大自然的配色比 AI 還大膽！',
    original: 'https://en.wikipedia.org/wiki/Grand_Prismatic_Spring',
    originalLabel: '查看維基百科介紹',
  },
  {
    id: 'emir',
    src: '/intro/real-emir.webp',
    title: '藍袍貴族',
    isAI: false,
    isPhoto: true,
    reveal: '真實照片 — 普羅庫金-戈爾斯基（Prokudin-Gorsky）1911 年拍攝的布哈拉末代埃米爾阿利姆汗。他分別透過紅、綠、藍濾鏡拍三張黑白底片再合成，一百多年前就有真正的彩色照片！',
    original: 'https://en.wikipedia.org/wiki/Sergey_Prokudin-Gorsky',
    originalLabel: '查看維基百科介紹',
  },
  {
    id: 'still-life',
    src: '/intro/ai-still-life.webp',
    title: '檸檬與生蠔',
    isAI: true,
    reveal: 'AI 生成 — 來源：ChatGPT／Prompt：17th-century Dutch still life oil painting, half-peeled lemon, pewter jug, oysters and a wilting tulip on dark linen, side window light, visible craquelure and aged varnish, no signature. 連老油畫的龜裂紋與泛黃光油都能用 Prompt 指定！',
  },
]

const GUESS_IMAGES_D = [
  {
    id: 'klint-swan',
    src: '/intro/real-klint-swan.webp',
    title: '彩色圓盤',
    isAI: false,
    reveal: '真實畫作 — 希爾瑪·阿芙·克林特（Hilma af Klint）《天鵝 No. 17》(1915)。她是抽象藝術的先驅，作品在生前極少公開，簡潔的構圖常被以為是現代電腦繪圖！',
    original: 'https://en.wikipedia.org/wiki/Hilma_af_Klint',
    originalLabel: '查看維基百科介紹',
  },
  {
    id: 'claude-planes',
    src: '/intro/ai-claude-planes.webp',
    title: '漂浮的色塊',
    isAI: true,
    reveal: 'AI 生成 — 來源：Claude 撰寫 Python 程式繪製，靈感來自至上主義。它不是用文字直接生圖，而是用程式碼算出色塊位置，再加上顏料濃淡與畫布紋理。AI 也能「寫程式來畫畫」！',
  },
  {
    id: 'kandinsky',
    src: '/intro/real-kandinsky.webp',
    title: '幾何交響',
    isAI: false,
    reveal: '真實畫作 — 康丁斯基（Kandinsky）《構成第八號》(Composition VIII，1923)，現藏紐約古根漢美術館。他把繪畫比作音樂，用圓形、線條與色彩「作曲」。',
    original: 'https://en.wikipedia.org/wiki/Wassily_Kandinsky',
    originalLabel: '查看維基百科介紹',
  },
  {
    id: 'claude-grid',
    src: '/intro/ai-claude-grid.webp',
    title: '彩色花園',
    isAI: true,
    reveal: 'AI 生成 — 來源：Claude 撰寫 Python 程式繪製。每個方格的寬度、顏色與歪斜角度都由亂數決定，所以看起來像手繪；換一個亂數種子，就會變成另一幅畫。',
  },
  {
    id: 'claude-orbits',
    src: '/intro/ai-claude-orbits.webp',
    title: '內在軌道',
    isAI: true,
    reveal: 'AI 生成 — 來源：Claude 撰寫 Python 程式繪製，靈感來自早期抽象藝術的同心圓與對稱符號。線條的抖動是刻意加入的雜訊，用來模仿人手的不完美！',
  },
  {
    id: 'malevich',
    src: '/intro/real-malevich.webp',
    title: '藍色方塊',
    isAI: false,
    reveal: '真實畫作 — 馬列維奇（Malevich）《至上主義構圖》(Suprematist Composition，1916)。他主張捨棄具體物象，只用純粹的幾何與色彩表達情感，一百多年前就如此前衛！',
    original: 'https://en.wikipedia.org/wiki/Suprematist_Composition',
    originalLabel: '查看維基百科介紹',
  },
]

// 每次重新整理隨機顯示其中一組
const GUESS_SETS = [GUESS_IMAGES_A, GUESS_IMAGES_B, GUESS_IMAGES_C, GUESS_IMAGES_D]
const GUESS_IMAGES = GUESS_SETS[Math.floor(Math.random() * GUESS_SETS.length)]

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
            <video
              className="intro-video"
              src="/intro/what-is-gen-ai.mp4"
              poster="/intro/what-is-gen-ai-poster.webp"
              aria-label="動畫：生成式 AI 先學習大量資料，再接收文字指令，最後從雜訊逐步產生全新圖像"
              controls
              muted
              playsInline
              preload="metadata"
            />
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
                          {img.isAI ? '🤖 AI 生成' : img.isPhoto ? '📷 真實照片' : '🎨 真實畫作'}
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
                { level: '模糊', text: '"一隻貓"', img: '/intro/prompt-weak.webp', note: '結果隨機，什麼都有可能' },
                { level: '加入風格與場景', text: '"一隻黑貓，坐在窗邊，水彩風格"', img: '/intro/prompt-medium.webp', note: '顏色、姿勢、風格有了方向' },
                { level: '完整描述', text: '"一隻黑貓，窗邊，月光逆光，神秘氛圍，水彩，冷色調，夜晚"', img: '/intro/prompt-strong.webp', note: '每個視覺細節都被精準控制' },
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
