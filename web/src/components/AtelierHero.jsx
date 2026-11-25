export default function AtelierHero({ onBegin }) {
  return <section className="atelier-hero" aria-labelledby="atelier-title">
    <div className="hero-ground" aria-hidden="true" />
    <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>INTRODUCTION</span></div>
    <div className="hero-vertical"><span lang="en">The art of prompting</span><p>以文字，形塑想像</p></div>
    <div className="hero-copy">
      <span className="editorial-eyebrow">A SMALL IDEA. AN OPEN WORLD.</span>
      <h2 id="atelier-title">從一個想法，<br />開始創作。</h2>
      <p>觀察一種風格，選擇一個主體。<br />讓腦海裡的畫面，慢慢有了形狀。</p>
      <button type="button" className="editorial-link" onClick={onBegin}>開始製作 Prompt <span aria-hidden="true">↗</span></button>
    </div>
    <figure className="hero-media">
      <img src="/editorial/indigo-landscape.webp" alt="靛藍水彩山巒與湖面倒影，淡淡顏料在紙上暈開" width="1536" height="512" fetchpriority="high" />
      <figcaption><span>LANDSCAPE STUDY / AI GENERATED</span><span>藍色・留白・想像</span></figcaption>
    </figure>
    <a href="#lesson-content" className="hero-scroll"><span>向下探索教材</span><i aria-hidden="true">↓</i></a>
  </section>
}
