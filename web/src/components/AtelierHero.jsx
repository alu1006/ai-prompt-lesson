export default function AtelierHero({ onBegin }) {
  return <section className="quirky-hero" aria-labelledby="atelier-title">
    <div className="quirky-hero-copy">
      <span className="quirky-kicker">PROMPT PLAYGROUND / 怪點子實驗室</span>
      <h2 id="atelier-title">你的怪點子，<br /><em>今天出道。</em></h2>
      <p className="quirky-hero-lead">不怕怪，只怕說不清楚。</p>
      <p>挑主體、混風格、加細節，<br />把腦袋裡的奇怪畫面變成 AI 看得懂的提示詞。</p>
      <button type="button" className="quirky-start" onClick={onBegin}>開玩！製作 Prompt <span aria-hidden="true">↗</span></button>
      <div className="quirky-stats"><span><b>100</b> 種風格</span><span><b>120</b> 個主體</span><span><b>144</b> 個細節</span></div>
    </div>
    <figure className="quirky-hero-art">
      <span className="hero-sticker sticker-lime">想像力，<br />不用乖。</span>
      <img src="/quirky/mascot.webp" alt="大小眼橘貓拿著超大鉛筆，和戴紙皇冠的粉紅小怪獸一起準備創作" width="1536" height="1024" fetchpriority="high" />
      <figcaption>原創搞怪角色 · AI 生成示意</figcaption>
      <span className="hero-sticker sticker-pink" aria-hidden="true">✷ WEIRD IS GOOD ✷</span>
    </figure>
    <a href="#lesson-content" className="quirky-explore">先暖身：認識 AI、猜猜真假 <span aria-hidden="true">↓</span></a>
  </section>
}
