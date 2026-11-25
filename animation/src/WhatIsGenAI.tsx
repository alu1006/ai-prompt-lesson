import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Easing, Img, Interactive, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

const GOLD = '#8b6914';
const INK = '#1a1714';
const GREEN = '#2d6a4f';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)};
const card: CSSProperties = {
  background: '#fff', border: '3px solid #e5e1d8', borderRadius: 28, boxShadow: '0 16px 40px rgba(60,45,10,.10)',
};

const Scene = ({length, title, step, children}: {length: number; title: string; step: string; children: ReactNode}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: interpolate(frame, [0, 12, length - 12, length], [0, 1, 1, 0], clamp)}}>
      <Interactive.Div name="Title" style={{
        position: 'absolute', top: 80, width: '100%', textAlign: 'center', fontSize: 80, fontWeight: 700, color: INK,
        translate: interpolate(frame, [0, 24], ['0px 40px', '0px 0px'], out),
      }}>
        {step && <span style={{color: GOLD, marginRight: 32}}>{step}</span>}{title}
      </Interactive.Div>
      {children}
    </AbsoluteFill>
  );
};

const Caption = ({children, at}: {children: ReactNode; at: number}) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div name="Caption" style={{
      position: 'absolute', bottom: 80, width: '100%', textAlign: 'center', fontSize: 52, color: '#5c544a',
      opacity: interpolate(frame, [at, at + 18], [0, 1], clamp),
    }}>{children}</Interactive.Div>
  );
};

// AI 模型：節點連線，active 越高越亮
const LAYERS = [3, 4, 4, 3];
const pt = (l: number, i: number) => [60 + l * 100, 210 + (i - (LAYERS[l] - 1) / 2) * 92];
const Model = ({active}: {active: number}) => {
  const frame = useCurrentFrame();
  const pulse = (k: number) => 0.5 + 0.5 * Math.sin(frame / 5 - k * 1.5);
  return (
    <div style={{...card, width: 420, height: 500}}>
      <svg width={420} height={420} viewBox="0 0 420 420">
        {LAYERS.slice(0, -1).flatMap((n, l) =>
          Array.from({length: n}).flatMap((_, i) =>
            Array.from({length: LAYERS[l + 1]}).map((__, j) => {
              const [x1, y1] = pt(l, i);
              const [x2, y2] = pt(l + 1, j);
              return <line key={`${l}${i}${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={3} opacity={0.15 + 0.4 * active * pulse(l)} />;
            })))}
        {LAYERS.flatMap((n, l) => Array.from({length: n}).map((_, i) => {
          const [x, y] = pt(l, i);
          return <circle key={`${l}${i}`} cx={x} cy={y} r={20 + 5 * active * pulse(l)} fill={GOLD} opacity={0.45 + 0.55 * active * pulse(l)} />;
        }))}
      </svg>
      <div style={{textAlign: 'center', fontSize: 44, fontWeight: 700, color: GOLD, marginTop: -6}}>AI 模型</div>
    </div>
  );
};

const PAIRS = [['watercolor', '水彩'], ['pixel', '像素'], ['anime', '動漫'], ['oil', '油畫'], ['sketch', '素描'], ['inkwash', '水墨']];

const Learn = () => {
  const frame = useCurrentFrame();
  return (
    <Scene length={180} step="1" title="學習大量資料">
      <div style={{position: 'absolute', left: 1330, top: 290}}>
        <Model active={interpolate(frame, [66, 90, 165, 178], [0, 1, 1, 0.4], clamp)} />
      </div>
      {PAIRS.map(([id, label], i) => {
        const x = 150 + (i % 3) * 300;
        const y = 220 + Math.floor(i / 3) * 330;
        const go = 66 + i * 13;
        return (
          <Interactive.Div key={id} name={label} style={{
            ...card, position: 'absolute', left: x, top: y, width: 260, padding: 14, boxSizing: 'border-box',
            opacity: interpolate(frame, [8 + i * 6, 22 + i * 6, go + 18, go + 26], [0, 1, 1, 0], clamp),
            translate: interpolate(frame, [go, go + 26], ['0px 0px', `${1410 - x}px ${380 - y}px`], {...clamp, easing: Easing.in(Easing.cubic)}),
            scale: interpolate(frame, [go, go + 26], [1, 0.25], clamp),
          }}>
            <Img src={staticFile(`${id}.webp`)} style={{width: 226, height: 200, objectFit: 'cover', borderRadius: 16, display: 'block'}} />
            <div style={{textAlign: 'center', fontSize: 44, fontWeight: 700, color: GREEN, marginTop: 6}}>「{label}」</div>
          </Interactive.Div>
        );
      })}
      <Caption at={70}>從無數「圖片＋文字」中，找出文字和畫面的對應規律</Caption>
    </Scene>
  );
};

const CHIPS = ['一隻黑貓', '窗邊', '月光逆光', '水彩風格', '夜晚'];
const PROMPT = CHIPS.join('，');

const Prompt = () => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [16, 76], [0, PROMPT.length], clamp));
  return (
    <Scene length={150} step="2" title="接收文字指令">
      <div style={{...card, position: 'absolute', left: 150, top: 270, width: 1060, padding: '34px 44px', boxSizing: 'border-box'}}>
        <div style={{fontSize: 40, color: GOLD, fontWeight: 700, marginBottom: 14}}>Prompt（提示詞）</div>
        <div style={{fontSize: 46, color: INK, minHeight: 70, whiteSpace: 'nowrap'}}>
          {PROMPT.slice(0, chars)}
          <span style={{color: GOLD, opacity: Math.floor(frame / 12) % 2}}>|</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 1330, top: 290}}>
        <Model active={interpolate(frame, [100, 120], [0, 1], clamp)} />
      </div>
      {CHIPS.map((c, i) => {
        const x = 150 + (i % 3) * 360;
        const y = 540 + Math.floor(i / 3) * 140;
        const go = 96 + i * 5;
        return (
          <Interactive.Div key={c} name={c} style={{
            position: 'absolute', left: x, top: y, width: 320, padding: '20px 0', textAlign: 'center', borderRadius: 60,
            background: GREEN, color: '#fff', fontSize: 48, fontWeight: 700,
            opacity: interpolate(frame, [76 + i * 3, 84 + i * 3, go + 16, go + 22], [0, 1, 1, 0], clamp),
            translate: interpolate(frame, [go, go + 22], ['0px 0px', `${1380 - x}px ${480 - y}px`], {...clamp, easing: Easing.in(Easing.cubic)}),
            scale: interpolate(frame, [go, go + 22], [1, 0.3], clamp),
          }}>{c}</Interactive.Div>
        );
      })}
      <Caption at={84}>用文字描述你想看到的畫面，越具體越好</Caption>
    </Scene>
  );
};

const Generate = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [24, 150], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const n = Math.round(t * 20);
  const shift = Math.floor(frame / 3) * 37;
  return (
    <Scene length={210} step="3" title="產生全新圖像">
      <div style={{position: 'absolute', left: 170, top: 290}}>
        <Model active={interpolate(frame, [0, 10, 150, 170], [1, 1, 1, 0.2], clamp)} />
      </div>
      <div style={{position: 'absolute', left: 630, top: 440, fontSize: 130, color: GOLD}}>→</div>
      <div style={{...card, position: 'absolute', left: 820, top: 225, width: 640, height: 640, overflow: 'hidden'}}>
        <Img src={staticFile('cat.webp')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${(1 - t) * 34}px)`}} />
        <AbsoluteFill style={{
          backgroundImage: `url(${staticFile('noise.webp')})`, backgroundSize: '640px 640px', imageRendering: 'pixelated',
          backgroundPosition: `${(shift * 4) % 640}px ${(shift * 12) % 640}px`, opacity: 1 - t,
        }} />
      </div>
      <div style={{position: 'absolute', left: 1510, top: 400, width: 300}}>
        <div style={{fontSize: 46, color: '#5c544a'}}>{n < 20 ? '去除雜訊' : '完成！'}</div>
        <div style={{fontSize: 80, fontWeight: 700, color: n < 20 ? GOLD : GREEN}}>{n} / 20</div>
        <div style={{height: 22, borderRadius: 11, background: '#e5e1d8', marginTop: 20}}>
          <div style={{height: '100%', width: `${t * 100}%`, borderRadius: 11, background: n < 20 ? GOLD : GREEN}} />
        </div>
      </div>
      <Caption at={30}>從一團雜訊開始，一步步「想像」出全新的圖片</Caption>
    </Scene>
  );
};

const RECAP = [['1', '學習', '看大量圖片和文字'], ['2', '理解', '讀懂你的 Prompt'], ['3', '生成', '產生全新圖像']];

const Recap = () => {
  const frame = useCurrentFrame();
  return (
    <Scene length={120} step="" title="這就是生成式 AI！">
      {RECAP.map(([num, head, body], i) => (
        <Interactive.Div key={num} name={head} style={{
          ...card, position: 'absolute', left: 150 + i * 560, top: 330, width: 500, height: 400, textAlign: 'center', paddingTop: 44, boxSizing: 'border-box',
          opacity: interpolate(frame, [10 + i * 12, 26 + i * 12], [0, 1], clamp),
          translate: interpolate(frame, [10 + i * 12, 34 + i * 12], ['0px 60px', '0px 0px'], out),
        }}>
          <div style={{width: 90, height: 90, lineHeight: '90px', borderRadius: 45, background: GOLD, color: '#fff', fontSize: 52, fontWeight: 700, margin: '0 auto'}}>{num}</div>
          <div style={{fontSize: 76, fontWeight: 700, color: INK, marginTop: 14}}>{head}</div>
          <div style={{fontSize: 46, color: '#5c544a', marginTop: 12}}>{body}</div>
        </Interactive.Div>
      ))}
      <Caption at={54}>AI 不是把舊圖剪貼拼湊，而是依學到的規律重新產生</Caption>
    </Scene>
  );
};

export const WhatIsGenAI = () => (
  <AbsoluteFill style={{background: '#f8f7f4', fontFamily: '"Microsoft JhengHei", "Noto Sans TC", "PingFang TC", sans-serif'}}>
    <Sequence name="學習" durationInFrames={180}><Learn /></Sequence>
    <Sequence name="指令" from={180} durationInFrames={150}><Prompt /></Sequence>
    <Sequence name="生成" from={330} durationInFrames={210}><Generate /></Sequence>
    <Sequence name="回顧" from={540} durationInFrames={120}><Recap /></Sequence>
  </AbsoluteFill>
);
