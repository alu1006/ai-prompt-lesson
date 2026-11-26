import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { DETAIL_CATEGORIES } from '../web/src/data/detailOptions.js'

const root = fileURLToPath(new URL('../web/public/', import.meta.url))
const esc = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
function cat(x,y,size=1) {
  return `<g data-mascot="quirky-orange-cat" transform="translate(${x} ${y}) scale(${size})" stroke="#25282c" stroke-width="1.8" stroke-linejoin="round"><path d="M18 40C56 66 67 14 43 13C25 12 26 35 43 32C56 28 48 17 40 21" fill="none" stroke="#25282c" stroke-width="10" stroke-linecap="round"/><path d="M18 40C56 66 67 14 43 13C25 12 26 35 43 32C56 28 48 17 40 21" fill="none" stroke="#ff9a45" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="25" rx="23" ry="28" fill="#ff9a45"/><ellipse cx="0" cy="31" rx="12" ry="18" fill="#fff3d1" stroke="none"/><path d="M-23 -7L-22 -35L-7 -22L7 -22L22 -35L23 -7Q28 17 0 17Q-28 17 -23 -7Z" fill="#ff9a45"/><path d="M-6 -20L-4 -13M0 -22L1 -14M7 -20L7 -14" stroke="#b54b16" stroke-width="3"/><ellipse cx="-9" cy="-6" rx="9" ry="11" fill="#fffdf5"/><ellipse cx="10" cy="-5" rx="6" ry="8" fill="#fffdf5"/><ellipse cx="-7" cy="-5" rx="2.4" ry="4" fill="#25282c" stroke="none"/><ellipse cx="9" cy="-4" rx="2" ry="3" fill="#25282c" stroke="none"/><path d="M-2 7L3 7L0 10Z" fill="#25282c"/><path d="M0 11Q3 21 7 12" fill="#ff91b0"/><path d="M-20 48Q-26 58 -12 53M15 49Q26 58 25 49" fill="#ff9a45"/></g>`
}
const frame = '<rect x="20" y="65" width="280" height="190" rx="3" fill="#f3ead7" stroke="#9e917a" stroke-width="2"/>'
const guides = '<g stroke="#8f9f93" stroke-width="1.5" stroke-dasharray="5 5"><path d="M113.333 65V255M206.667 65V255M20 128.333H300M20 191.667H300"/></g>'
const compositions = [
  frame+cat(160,150),
  frame+guides+cat(113.333,168,.85)+'<circle cx="113.333" cy="191.667" r="7" fill="none" stroke="#b24833" stroke-width="2"/>',
  frame+cat(160,150)+'<g fill="#788f73"><ellipse cx="58" cy="197" rx="17" ry="25"/><ellipse cx="262" cy="197" rx="17" ry="25"/></g><path d="M160 65V255" stroke="#9c8260" stroke-dasharray="4 4"/>',
  frame+'<path d="M35 240L285 80" stroke="#8f9f93" stroke-width="2" stroke-dasharray="6 4"/>'+cat(85,198,.65)+cat(175,146,.65)+cat(262,95,.65),
  frame+cat(88,200,.48)+'<rect x="145" y="90" width="130" height="135" fill="none" stroke="#bfb39d" stroke-dasharray="4 5"/>',
  frame+cat(160,158,.85)+'<path d="M22 255V65H298V255H277V87H43V255Z" fill="#657c66"/><path d="M42 83Q95 95 95 132Q55 125 42 83M277 83Q226 95 224 132Q263 125 277 83" fill="#8aa17e"/>',
  frame+'<path d="M30 253L160 153L290 253M100 255L160 153L220 255" stroke="#bea77c" stroke-width="7" fill="none"/>'+cat(160,127,.6),
  frame+`<g clip-path="url(#clip)">${cat(160,155,2.8)}</g>`,
  frame+cat(85,159,.9)+'<path d="M150 90H276M150 110H270M150 130H245" stroke="#c3b79f" stroke-width="3" stroke-dasharray="6 5"/>',
  frame+cat(235,159,.9)+'<path d="M44 90H170M44 110H165M44 130H140" stroke="#c3b79f" stroke-width="3" stroke-dasharray="6 5"/>',
  frame+'<rect x="55" y="90" width="60" height="90" rx="3" fill="#658574"/><rect x="59" y="94" width="52" height="82" fill="#eee0bf"/><circle cx="220" cy="124" r="27" fill="#d3a76e"/><circle cx="220" cy="124" r="20" fill="#765b42"/><path d="M244 110Q268 108 268 124Q267 142 245 137" fill="none" stroke="#d3a76e" stroke-width="6"/><path d="M140 221L236 221" stroke="#a47e55" stroke-width="10" stroke-linecap="round"/>'+cat(83,210,.4),
  frame+[85,160,235].flatMap(x=>[115,205].map(y=>cat(x,y,.47))).join(''),
]

for (const category of DETAIL_CATEGORIES.filter(c=>['ratio','composition'].includes(c.key))) {
  for (const [index,option] of category.options.entries()) {
    let content
    if (category.key==='ratio') {
      const [a,b] = option.zh.match(/\d+:\d+/)[0].split(':').map(Number)
      const scale = Math.min(240/a,210/b), w=a*scale,h=b*scale
      const x=(320-w)/2,y=(300-h)/2
      content=`<rect data-frame="true" x="${x}" y="${y}" width="${w}" height="${h}" fill="#ece0c5" stroke="#8c6b31" stroke-width="2"/><path d="M${x} ${y+h*.7} Q160 ${y+h*.4} ${x+w} ${y+h*.7}V${y+h}H${x}Z" fill="#9eaf91"/><circle cx="${x+w*.7}" cy="${y+h*.25}" r="${Math.min(w,h)*.09}" fill="#d5a251"/><text x="160" y="292" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#705b35">${a}:${b}</text>`
      content+=cat(160,y+h*.46,Math.min(w,h)/120)
    } else content=compositions[index]
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img"><title>${esc(option.zh)}示意</title><defs><clipPath id="clip"><rect x="20" y="65" width="280" height="190"/></clipPath></defs><rect width="320" height="320" fill="#faf7ef"/>${content}</svg>`
    const dest = root + option.img.slice(1)
    fs.mkdirSync(fileURLToPath(new URL('../web/public/detail-previews/v1/',import.meta.url)),{recursive:true})
    fs.writeFileSync(dest,svg)
  }
}
console.log('Created 24 precise composition and aspect-ratio diagrams.')
