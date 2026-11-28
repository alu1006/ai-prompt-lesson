import { useState, useEffect } from 'react'
import { useMember } from './account/useMember.jsx'
import AccountControls from './account/AccountControls.jsx'
import './account/member.css'
import SavedPromptsPage from './components/SavedPromptsPage.jsx'
import IntroStep from './components/steps/IntroStep.jsx'
import SubjectStep from './components/steps/SubjectStep.jsx'
import StyleStep from './components/steps/StyleStep.jsx'
import DetailsStep from './components/steps/DetailsStep.jsx'
import ProductStep from './components/steps/ProductStep.jsx'
import PromptStep from './components/steps/PromptStep.jsx'
import { DEFAULT_PALETTE } from './utils/palette.js'
import { EMPTY_DETAILS } from './data/detailOptions.js'
import AtelierHero from './components/AtelierHero.jsx'

const MEMBER_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}
const STEPS = [
  { id: 'intro',   label: '關於 AI', en: 'ABOUT AI' },
  { id: 'subject', label: '主體', en: 'SUBJECT' },
  { id: 'style',   label: '風格', en: 'STYLE' },
  { id: 'details', label: '細節', en: 'DETAILS' },
  { id: 'product', label: '用途', en: 'PURPOSE' },
  { id: 'prompt',  label: 'Prompt', en: 'YOUR PROMPT' },
]


export default function App() {
  const [step, setStep]       = useState(0)
  const [artData, setArtData] = useState(null)
  const [subject, setSubject] = useState('')
  const [styles,  setStyles]  = useState([])

  const toggleStyle = (s) => setStyles(prev =>
    prev.find(x => x.id === s.id) ? prev.filter(x => x.id !== s.id) : [...prev, s]
  )
  const [details, setDetails] = useState(EMPTY_DETAILS)
  const [palette, setPalette] = useState(DEFAULT_PALETTE)
  const [product, setProduct] = useState(null)
  const [showSaved, setShowSaved] = useState(false)
  const member = useMember(MEMBER_CONFIG)
  const [localPrompts, setLocalPrompts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('savedPrompts') || '[]')
      return Array.isArray(stored) ? stored.filter(p => p && typeof p.id === 'string' && typeof p.prompt_en === 'string' && Array.isArray(p.tags)) : []
    } catch { return [] }
  })
  const [localError, setLocalError] = useState('')
  const [importNotice, setImportNotice] = useState('')
  const savedPrompts = member.user ? member.favorites : localPrompts
  useEffect(() => { setImportNotice(''); setLocalError('') }, [member.user?.uid])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [step])

  const savePrompt = async (entry) => {
    setLocalError('')
    if (member.configured && !member.authReady) { setLocalError('正在確認登入狀態，請稍後再收藏。'); return false }
    if (member.user) {
      if (!member.cloudReady) { setLocalError('雲端收藏尚未載入，請稍後重試。'); return false }
      return member.save(entry)
    }
    try {
      const updated = [entry, ...localPrompts]
      localStorage.setItem('savedPrompts', JSON.stringify(updated))
      setLocalPrompts(updated)
      return true
    } catch { setLocalError('無法保存本機收藏，請檢查瀏覽器儲存空間。'); return false }
  }
  const deletePrompt = async (id) => {
    if (member.user) return member.remove(id)
    try {
      const updated = localPrompts.filter(p => p.id !== id)
      localStorage.setItem('savedPrompts', JSON.stringify(updated))
      setLocalPrompts(updated)
      return true
    } catch { setLocalError('刪除未完成，請檢查瀏覽器儲存設定。'); return false }
  }
  const importLocal = async () => {
    setImportNotice('')
    if (await member.importPrompts(localPrompts)) setImportNotice('本機收藏已匯入目前帳號；原本的本機收藏仍保留。')
  }

  useEffect(() => {
    fetch('/art_data.json')
      .then(r => r.ok ? r.json() : null)
      .then(setArtData)
      .catch(() => null)
  }, [])

  const updateDetail = (key, value) =>
    setDetails(prev => ({ ...prev, [key]: value }))

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep(s => Math.max(s - 1, 0))
  const goTo = (i) => setStep(i)

  const selection = { subject, styles, ...details, product, palette }

  return (
    <div className={`wizard-app atelier-site${step === 0 ? ' atelier-home' : ''}`}>
      <a className="skip-to-content" href="#lesson-content">跳至教材內容</a>
      {showSaved && (
        <SavedPromptsPage
          userPrompts={savedPrompts}
          storageLabel={member.user ? '帳號收藏（雲端）' : '本機收藏（此瀏覽器）'}
          busy={member.busy || Boolean(member.user && !member.cloudReady)}
          error={member.error || localError}
          onDelete={deletePrompt}
          onClose={() => setShowSaved(false)}
        />
      )}

      {/* ── Header ── */}
      <header className="atelier-masthead">
        <h1 className="sr-only">藝術風格生成器</h1>
        <button type="button" className="atelier-brand" aria-label="藝術風格生成器首頁" onClick={() => goTo(0)}>
          <svg viewBox="0 0 46 42" fill="none" aria-hidden="true"><path d="M6 16L5 3L17 10Q24 7 31 11L41 4L39 20Q44 39 23 39Q3 39 6 16Z" fill="#ff9a45" stroke="currentColor" strokeWidth="2"/><ellipse cx="17" cy="21" rx="7" ry="8" fill="white" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="32" cy="21" rx="5" ry="6" fill="white" stroke="currentColor" strokeWidth="1.5"/><circle cx="18" cy="22" r="2" fill="currentColor"/><circle cx="31" cy="21" r="2" fill="currentColor"/><path d="M23 30L26 29L25 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span><strong>藝術風格生成器</strong><span lang="en">THE WEIRD IDEA LAB</span></span>
        </button>

      {/* ── Step indicator ── */}
      <nav className="wizard-nav" aria-label="教材步驟">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`wizard-step-btn${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`第 ${i + 1} 步：${s.label}`}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className="wsb-num">{i < step ? '✓' : i + 1}</span>
            <span className="wsb-label">{s.label}</span>
            <span className="wsb-en" lang="en">{s.en}</span>
          </button>
        ))}
        <div
          className="wizard-progress-bar"
          style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
        />
      </nav>
        <button className="btn-saved-open" onClick={() => setShowSaved(true)} aria-label={`開啟收藏，${savedPrompts.length} 個已存提示詞`}>
          <svg viewBox="0 0 20 24" width="14" height="18" fill="none" aria-hidden="true"><path d="M4 3H16V21L10 16L4 21V3Z" stroke="currentColor" strokeWidth="1" /></svg>
          <span>收藏</span>{savedPrompts.length > 0 && <span className="saved-count">{savedPrompts.length}</span>}
        </button>
      </header>

      <AccountControls member={member} localCount={localPrompts.length} onImport={importLocal} importNotice={importNotice} />
      {localError && <p className="member-controls" role="alert">{localError}</p>}
      {step === 0 && <AtelierHero onBegin={() => goTo(1)} />}

      {/* ── Step content ── */}
      <main className="wizard-main" id="lesson-content" tabIndex="-1">
        <div className="chapter-caption"><span lang="en">{STEPS[step].en}</span><span>{String(step + 1).padStart(2, '0')} — 06</span></div>
        <div className="chapter-rail" aria-hidden="true">{STEPS[step].label}<span>EXPLORING VISUAL LANGUAGE</span></div>
        {step === 0 && <IntroStep onNext={next} />}
        {step === 1 && (
          <SubjectStep
            value={subject}
            onChange={setSubject}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 2 && (
          <StyleStep
            artData={artData}
            selected={styles}
            onSelect={toggleStyle}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 3 && (
          <DetailsStep
            palette={palette}
            onPaletteChange={setPalette}
            details={details}
            onChange={updateDetail}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 4 && (
          <ProductStep
            selected={product}
            onSelect={setProduct}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 5 && (
          <PromptStep
            selection={selection}
            onPrev={prev}
            onSave={savePrompt}
            accountKey={member.user?.uid || 'guest'}
            storageLabel={member.user ? '帳號' : '本機'}
          />
        )}
      </main>
      <footer className="atelier-footer">
        <div className="footer-signature"><span>藝術風格生成器</span><small>正經學提示詞，不正經玩想像。</small></div>
        <nav aria-label="頁尾教材導覽">{STEPS.map((s, i) => <button type="button" key={s.id} onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}>{s.label}</button>)}</nav>
        <span className="footer-colophon">CODINGLU · CREATIVE LEARNING</span>
      </footer>
    </div>
  )
}
