import { useState, useReducer } from 'react'
import { GUESS_SETS, createQuizState, quizReducer } from '../../data/quizSets.js'
import { QRCodeSVG } from 'qrcode.react'

const LESSON_URL = 'https://ai-prompt-lesson.codinglu.tw/'

export default function IntroStep({ onNext }) {
  const [slide, setSlide] = useState(0)
  const [{ setIndex, revealed }, dispatch] = useReducer(quizReducer, undefined, createQuizState)
  const guessImages = GUESS_SETS[setIndex]

  const toggleReveal = (id) => dispatch({ type: 'reveal', id })

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
            <h2 className="intro-title">猜猜看！誰是 AI？</h2>
            <p className="intro-subtitle">哪些是人類創作的？哪些是 AI 生成的？請記住你的答案！</p>
            <div className="quiz-set-controls" aria-label="猜猜看題組導覽">
              <div className="quiz-set-status" role="status" aria-live="polite"><strong>第 {setIndex + 1} 組 / {GUESS_SETS.length} 組</strong><span>固定順序，每組 6 題。切換題組會收起答案。</span></div>
              <div className="quiz-set-buttons">
                <button type="button" onClick={() => dispatch({ type: 'move', direction: -1 })} disabled={setIndex === 0}>← 上一組</button>
                <button type="button" onClick={() => dispatch({ type: 'move', direction: 1 })} disabled={setIndex === GUESS_SETS.length - 1}>下一組 →</button>
                {setIndex === GUESS_SETS.length - 1 && <button type="button" onClick={() => dispatch({ type: 'first' })}>重看第一組</button>}
              </div>
            </div>
            <div className="guess-grid">
              {guessImages.map((img, index) => (
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
