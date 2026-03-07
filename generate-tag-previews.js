/**
 * generate-tag-previews.js
 * 為 GeneratorModal 的所有標籤生成 DALL-E 3 預覽圖
 * 用法: node generate-tag-previews.js
 * 圖片輸出至 web/public/tag-previews/
 */

import OpenAI from 'openai'
import { config } from 'dotenv'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, 'web', 'public', 'tag-previews')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// DALL-E 3 英文提示詞，每個標籤清楚示範其視覺概念
const TAG_PROMPTS = {
  // 主體動作
  '站立': 'A person standing upright in a neutral elegant pose, fine art oil painting, museum quality, plain background',
  '坐著': 'A person sitting relaxed on a wooden chair, fine art oil painting, museum quality',
  '行走': 'A person walking forward with natural stride and slight motion, fine art oil painting, museum quality',
  '奔跑': 'A person running with dynamic energy and clear sense of speed and motion, fine art oil painting, museum quality',
  '回頭望': 'A person turning to look back over their shoulder, three-quarter rear view, fine art oil painting, museum quality',
  '擁抱': 'Two people sharing a warm tender embrace, fine art oil painting, museum quality',
  '沉思': 'A person in deep contemplation, chin resting on hand, thoughtful expression, fine art oil painting, museum quality',
  '跳舞': 'A person dancing gracefully with flowing movement and expressive arms, fine art oil painting, museum quality',

  // 光影
  '自然光': 'A scene bathed in soft natural daylight, even illumination with gentle shadows, fine art oil painting, museum quality',
  '黃金時段': 'Warm golden hour sunset light casting long shadows and orange-gold tones across a landscape, fine art oil painting',
  '逆光': 'Strong backlight creating a glowing silhouette with rim light around the edges, dramatic effect, fine art oil painting',
  '柔光': 'Soft diffused overcast lighting with no harsh shadows, gentle and even illumination, fine art oil painting, museum quality',
  '強烈陰影': 'Dramatic chiaroscuro with deep dark shadows and brilliant bright highlights, Rembrandt-style lighting, fine art oil painting',
  '燭光': 'A face illuminated by warm flickering candlelight in a dark room, orange-amber glow, fine art oil painting',
  '夜燈': 'Warm artificial lamp light creating a pool of light in darkness at night indoors, fine art oil painting',

  // 拍攝角度
  '正面': 'A direct symmetrical front-facing portrait looking straight at the viewer, fine art oil painting, museum quality',
  '側面': 'A pure side profile portrait silhouette view, fine art oil painting, museum quality',
  '俯視': "Bird's eye view looking directly straight down from above, overhead top-down perspective, fine art oil painting",
  '仰視': "Dramatic low angle looking upward from below, worm's eye view perspective with foreshortening, fine art oil painting",
  '特寫': 'Extreme close-up of a face filling the entire frame, intimate detail, fine art oil painting, museum quality',
  '半身': 'Half-body portrait showing the subject from head to waist, classic bust composition, fine art oil painting',
  '全身': 'Full body portrait showing a person from head to toe in their entirety, fine art oil painting, museum quality',
  '遠景': 'Extreme wide establishing shot with a tiny distant figure in a vast expansive landscape, fine art oil painting',

  // 背景
  '室內': 'Cozy indoor interior room with warm lighting, furniture and personal objects, fine art oil painting, museum quality',
  '戶外': 'Open outdoor natural environment with sky, fresh air and natural elements, fine art oil painting, museum quality',
  '城市': 'Urban cityscape with tall buildings, streets and architectural structures, fine art oil painting, museum quality',
  '森林': 'Dense lush forest with tall trees and dappled sunlight filtering through green canopy, fine art oil painting',
  '海邊': 'Coastal beach scene with rolling ocean waves and sandy shore, fine art oil painting, museum quality',
  '花園': 'Beautiful garden in full bloom with colorful flowers and manicured green plants, fine art oil painting',
  '山景': 'Majestic mountain landscape with dramatic peaks, valleys and open sky, fine art oil painting, museum quality',
  '抽象': 'Abstract non-representational background with geometric shapes, lines and flat color fields, fine art painting',

  // 情緒氛圍
  '寧靜': 'Peaceful serene calm scene with still water and tranquil quiet atmosphere, fine art oil painting, museum quality',
  '神祕': 'Mysterious enigmatic scene with swirling mist, deep shadows and a sense of hidden secrets, fine art oil painting',
  '歡快': 'Joyful cheerful happy scene with bright vibrant colors and lively energetic mood, fine art oil painting',
  '憂鬱': 'Melancholic sad mood with muted grey-blue colors and somber contemplative atmosphere, fine art oil painting',
  '壯闊': 'Grand majestic epic scene with vast scale, powerful forces and overwhelming grandeur, fine art oil painting',
  '溫暖': 'Warm cozy comfortable and inviting atmosphere, safe and homey feeling with soft warm tones, fine art oil painting',
  '孤寂': 'A solitary lone figure isolated in a vast empty space, sense of loneliness and solitude, fine art oil painting',
  '夢幻': 'Dreamlike surreal fantastical ethereal scene with magical floating elements and soft glowing light, fine art oil painting',

  // 色調
  '暖色調': 'Color palette dominated by warm reds oranges and yellows, fiery and inviting tones, fine art oil painting',
  '冷色調': 'Color palette dominated by cool blues purples and greens, serene and cold tones, fine art oil painting',
  '單色': 'Monochromatic color scheme using a single hue in various tones shades and tints, fine art oil painting',
  '高對比': 'High contrast image with stark brilliant whites and deep rich blacks, no midtones, fine art oil painting',
  '柔和淡雅': 'Soft pastel colors with gentle delicate muted subtle tones, fine art oil painting, museum quality',
  '飽和鮮豔': 'Highly saturated vivid bold intense colors, maximum vibrancy and richness, fine art oil painting',

  // 時間段
  '清晨': 'Early morning dawn scene with soft pink-gold light, morning mist and dew drops, fine art oil painting',
  '正午': 'Bright midday summer sun high overhead, harsh direct light and short sharp shadows, fine art oil painting',
  '傍晚': 'Late afternoon warm light with long elongated golden shadows stretching across the ground, fine art oil painting',
  '黃昏': 'Dusk twilight scene with dramatic colorful sunset sky transitioning from orange to deep blue, fine art oil painting',
  '深夜': 'Deep quiet night with a starry sky, crescent moon and subtle dark blue-black tones, fine art oil painting',

  // 構圖
  '黃金比例': 'Composition following the golden ratio spiral, perfectly balanced focal point and harmonious arrangement, fine art oil painting',
  '對稱構圖': 'Perfectly symmetrical left-right mirror image composition, everything evenly balanced, fine art oil painting',
  '大量留白': 'Minimalist composition with a small subject and large empty negative space, Japanese ma aesthetic, fine art oil painting',
  '動態構圖': 'Dynamic energetic composition with strong diagonal lines conveying movement and kinetic energy, fine art oil painting',
  '對角線': 'Strong diagonal lines cutting boldly across the frame from corner to corner, creating visual tension, fine art oil painting',

  // 季節
  '春天': 'Spring season with cherry blossoms, pink and white flowers and soft fresh green leaves, fine art oil painting',
  '夏天': 'Summer season with lush dense green foliage, bright warm sunshine and vivid blue sky, fine art oil painting',
  '秋天': 'Autumn fall season with golden orange red and brown fallen leaves, fine art oil painting, museum quality',
  '冬天': 'Winter season with fresh white snow covering bare trees and frozen ground, fine art oil painting, museum quality',

  // 細節程度
  '寫實細緻': 'Photorealistic highly detailed painting with precise textures, fine details and perfect rendering, fine art oil painting',
  '印象朦朧': 'Impressionistic painting style with loose soft brushstrokes, atmospheric blurring and painterly quality',
  '草圖感': 'Rough sketch-like artistic style with loose expressive pencil charcoal or ink lines, hand-drawn feel',
  '半抽象': 'Semi-abstract style balancing recognizable real-world forms with abstract painterly elements, fine art oil painting',
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generateAndSave(tag, prompt) {
  const filename = `${tag}.png`
  const filepath = join(OUTPUT_DIR, filename)

  if (existsSync(filepath)) {
    console.log(`[skip] ${tag} — 已存在`)
    return true
  }

  try {
    console.log(`[生成] ${tag}...`)
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    })

    const url = response.data[0]?.url
    if (!url) throw new Error('未取得圖片 URL')

    const res = await fetch(url)
    if (!res.ok) throw new Error(`下載失敗: ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    await writeFile(filepath, buffer)

    console.log(`[完成] ${tag} → tag-previews/${filename}`)
    return true
  } catch (err) {
    console.error(`[錯誤] ${tag}: ${err.message}`)
    return false
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('錯誤：未設定 OPENAI_API_KEY')
    process.exit(1)
  }

  await mkdir(OUTPUT_DIR, { recursive: true })

  const entries = Object.entries(TAG_PROMPTS)
  const total = entries.length
  console.log(`開始生成 ${total} 張標籤預覽圖...`)
  console.log(`輸出目錄：${OUTPUT_DIR}\n`)

  let done = 0
  let failed = 0

  for (let i = 0; i < entries.length; i++) {
    const [tag, prompt] = entries[i]
    const ok = await generateAndSave(tag, prompt)
    if (ok) done++; else failed++
    // 避免超過 API 速率限制
    if (i < entries.length - 1) await sleep(2500)
  }

  console.log(`\n=== 完成 ===`)
  console.log(`成功：${done}  失敗：${failed}  共：${total}`)
  if (failed > 0) {
    console.log('重新執行腳本可跳過已完成的圖片，只重試失敗的。')
  }
}

main().catch(console.error)
