/**
 * generate-style-previews.js
 * 為直覺風格選項生成 DALL-E 3 示範圖
 * 統一主體：一隻坐著的貓，方便學生對比不同風格
 * 用法: node generate-style-previews.js
 * 圖片輸出至 web/public/style-previews/
 */

import OpenAI from 'openai'
import { config } from 'dotenv'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, 'web', 'public', 'style-previews')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const STYLE_PROMPTS = [
  {
    id: 'watercolor',
    prompt: 'A cat sitting gracefully, watercolor painting style, soft transparent color washes, delicate brushstrokes, white paper texture showing through, gentle bleeding edges, fine art',
  },
  {
    id: 'oil',
    prompt: 'A cat sitting gracefully, oil painting style, thick impasto brushstrokes, rich saturated colors, visible paint texture, dramatic lighting, museum quality fine art painting',
  },
  {
    id: 'sketch',
    prompt: 'A cat sitting gracefully, pencil sketch drawing, black and white, detailed crosshatching and shading, hand-drawn lines on white paper, fine art sketch',
  },
  {
    id: 'anime',
    prompt: 'A cat sitting gracefully, Japanese anime illustration style, clean bold outlines, flat vivid colors, large expressive eyes, cute kawaii style, digital art',
  },
  {
    id: 'inkwash',
    prompt: 'A cat sitting gracefully, Chinese ink wash painting style, sumi-e brushwork, black ink gradients on white background, minimalist elegant, traditional East Asian art',
  },
  {
    id: 'pixel',
    prompt: 'A cat sitting gracefully, pixel art style, 8-bit retro video game aesthetic, visible square pixels, limited color palette, nostalgic game sprite',
  },
  {
    id: 'fantasy',
    prompt: 'A magical glowing cat sitting gracefully, epic fantasy digital illustration, mystical atmosphere, dramatic lighting, sparkles and magical aura, detailed concept art',
  },
  {
    id: 'lowpoly',
    prompt: 'A cat sitting gracefully, low poly art style, geometric triangular facets, flat shaded polygons, modern minimalist 3D geometric aesthetic, clean colors',
  },
  {
    id: 'steampunk',
    prompt: 'A cat sitting gracefully, steampunk style, Victorian era brass gears and cogs, mechanical parts, sepia and bronze tones, industrial fantasy aesthetic, detailed illustration',
  },
  {
    id: 'photorealistic',
    prompt: 'A cat sitting gracefully, ultra photorealistic photography, hyperdetailed fur texture, studio lighting, perfect focus, award-winning wildlife photograph, 8K quality',
  },

  // ── 風格關鍵詞 ──
  {
    id: 'doodle',
    prompt: 'A cat sitting gracefully, casual doodle art style, loose hand-drawn lines, scribbled texture, ballpoint pen on notebook paper, playful and spontaneous',
  },
  {
    id: 'naive-art',
    prompt: 'A cat sitting gracefully, naive folk art style, childlike drawing, simple shapes, flat bright colors, innocent and primitive aesthetic, outsider art',
  },
  {
    id: 'sticker-art',
    prompt: 'A cute cat sitting gracefully, die-cut sticker design, thick black outline, vibrant flat colors, isolated on pure white background, kawaii sticker style',
  },
  {
    id: 'lofi-cartoon',
    prompt: 'A cat sitting gracefully, lo-fi cartoon style, flat simple shapes, slightly imperfect wobbly lines, muted pastel palette, cozy and unpretentious illustration',
  },
  {
    id: 'line-drawing',
    prompt: 'A cat sitting gracefully, minimalist single-line outline drawing, clean simple contour lines only, no fill, no shading, pure black on white, elegant line art',
  },
  {
    id: 'quirky-cute',
    prompt: 'A quirky cat sitting gracefully, weird kawaii character art, oddly proportioned features, unexpected details, charming imperfections, unique personality, cute but strange illustration',
  },
  {
    id: 'draft',
    prompt: 'A cat sitting gracefully, rough pencil draft sketch, construction lines visible, multiple overlapping gesture lines, unfinished concept sketch, technical drawing feel',
  },

  // ── 筆觸關鍵詞 ──
  {
    id: 'textured-brush',
    prompt: 'A cat sitting gracefully, heavily textured brushstrokes, visible dry brush paint texture, impasto thick paint marks, tactile surface quality, expressive brushwork',
  },
  {
    id: 'rough-lines',
    prompt: 'A cat sitting gracefully, rough scratchy hand-drawn lines, raw unpolished strokes, irregular jagged edges, energetic quick mark-making, gritty linework',
  },
  {
    id: 'hand-drawn',
    prompt: 'A cat sitting gracefully, warm hand-drawn illustration, organic imperfect natural lines, human touch quality, felt-tip pen on paper, heartfelt and personal',
  },
  {
    id: 'ink-brush',
    prompt: 'A cat sitting gracefully, expressive ink brush painting, bold sumi ink brushstrokes, varying pressure creates thick and thin lines, calligraphic energy, East Asian brush art',
  },
  {
    id: 'charcoal',
    prompt: 'A cat sitting gracefully, charcoal drawing on textured paper, smudged tones, soft blended shadows, rich dark values, powdery grainy texture, classical drawing technique',
  },
  {
    id: 'grainy',
    prompt: 'A cat sitting gracefully, risograph print style, heavy film grain noise, halftone dot texture, muted limited color palette, analog printing imperfections, lo-fi zine aesthetic',
  },
  {
    id: 'uneven-lines',
    prompt: 'A cat sitting gracefully, expressive variable line weight illustration, thick and thin non-uniform strokes, calligraphic linework, gestural mark-making, bold dynamic linework',
  },
]

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generateAndSave({ id, prompt }) {
  const filename = `${id}.png`
  const filepath = join(OUTPUT_DIR, filename)

  if (existsSync(filepath)) {
    console.log(`[skip] ${id} — 已存在`)
    return true
  }

  try {
    console.log(`[生成] ${id}...`)
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

    console.log(`[完成] ${id} → style-previews/${filename}`)
    return true
  } catch (err) {
    console.error(`[錯誤] ${id}: ${err.message}`)
    return false
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('錯誤：未設定 OPENAI_API_KEY')
    process.exit(1)
  }

  await mkdir(OUTPUT_DIR, { recursive: true })

  console.log(`開始生成 ${STYLE_PROMPTS.length} 張風格示範圖（統一主體：貓）...`)
  console.log(`輸出目錄：${OUTPUT_DIR}\n`)

  let done = 0, failed = 0
  for (let i = 0; i < STYLE_PROMPTS.length; i++) {
    const ok = await generateAndSave(STYLE_PROMPTS[i])
    if (ok) done++; else failed++
    if (i < STYLE_PROMPTS.length - 1) await sleep(2500)
  }

  console.log(`\n=== 完成 ===`)
  console.log(`成功：${done}  失敗：${failed}  共：${STYLE_PROMPTS.length}`)
  if (failed > 0) console.log('重新執行可跳過已完成的，只重試失敗的。')
}

main().catch(console.error)
