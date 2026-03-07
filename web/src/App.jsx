import { useState, useEffect } from 'react'
import SavedPromptsPage from './components/SavedPromptsPage.jsx'
import IntroStep from './components/steps/IntroStep.jsx'
import SubjectStep from './components/steps/SubjectStep.jsx'
import StyleStep from './components/steps/StyleStep.jsx'
import DetailsStep from './components/steps/DetailsStep.jsx'
import ProductStep from './components/steps/ProductStep.jsx'
import PromptStep from './components/steps/PromptStep.jsx'

const STEPS = [
  { id: 'intro',   label: '關於 AI' },
  { id: 'subject', label: '主體' },
  { id: 'style',   label: '風格' },
  { id: 'details', label: '細節' },
  { id: 'product', label: '產品' },
  { id: 'prompt',  label: 'Prompt' },
]

const EMPTY_DETAILS = { action: null, scene: null, angle: null, lighting: null, mood: null }

export default function App() {
  const [step, setStep]       = useState(0)
  const [artData, setArtData] = useState(null)
  const [subject, setSubject] = useState('')
  const [style,   setStyle]   = useState(null)
  const [details, setDetails] = useState(EMPTY_DETAILS)
  const [product, setProduct] = useState(null)
  const [showSaved, setShowSaved] = useState(false)
  const [savedPrompts, setSavedPrompts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPrompts') || '[]') } catch { return [] }
  })

  const savePrompt = (entry) => {
    const updated = [entry, ...savedPrompts]
    setSavedPrompts(updated)
    localStorage.setItem('savedPrompts', JSON.stringify(updated))
  }
  const deletePrompt = (id) => {
    const updated = savedPrompts.filter(p => p.id !== id)
    setSavedPrompts(updated)
    localStorage.setItem('savedPrompts', JSON.stringify(updated))
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

  const selection = { subject, style, ...details, product }

  return (
    <div className="wizard-app">
      {showSaved && (
        <SavedPromptsPage
          userPrompts={savedPrompts}
          onDelete={deletePrompt}
          onClose={() => setShowSaved(false)}
        />
      )}

      {/* ── Header ── */}
      <header className="wizard-header">
        <div className="wizard-header-row">
          <div>
            <h1>藝術風格生成器</h1>
            <p>學習如何用 Prompt 引導 AI 創作圖像</p>
          </div>
          <button className="btn-saved-open" onClick={() => setShowSaved(true)}>
            收藏 {savedPrompts.length > 0 && <span className="saved-count">{savedPrompts.length}</span>}
          </button>
        </div>
      </header>

      {/* ── Step indicator ── */}
      <nav className="wizard-nav">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`wizard-step-btn${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
            onClick={() => goTo(i)}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className="wsb-num">{i < step ? '✓' : i + 1}</span>
            <span className="wsb-label">{s.label}</span>
          </button>
        ))}
        <div
          className="wizard-progress-bar"
          style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
        />
      </nav>

      {/* ── Step content ── */}
      <main className="wizard-main">
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
            selected={style}
            onSelect={setStyle}
            onNext={next}
            onPrev={prev}
          />
        )}
        {step === 3 && (
          <DetailsStep
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
          />
        )}
      </main>
    </div>
  )
}
