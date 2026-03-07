import express from 'express'
import { config } from 'dotenv'
import OpenAI from 'openai'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json({ limit: '10mb' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/generate
// Body: { imageBase64, mimeType, prompt, styleContext: { movementName, artistName, paintingName } }
// Response: { imageUrl, revisedPrompt }
app.post('/api/generate', async (req, res) => {
  try {
    const { imageBase64, mimeType, prompt, styleContext } = req.body

    if (!styleContext?.movementName) {
      return res.status(400).json({ error: '缺少風格上下文' })
    }
    if (imageBase64 && typeof imageBase64 === 'string') {
      const estimatedBytes = Math.ceil(imageBase64.length * 0.75)
      if (estimatedBytes > 20_000_000) {
        return res.status(400).json({ error: '圖像過大，請使用小於 15MB 的圖像' })
      }
    }

    const { movementName, artistName, paintingName } = styleContext

    const styleParts = [
      paintingName ? `inspired by "${paintingName}"` : null,
      artistName ? `in the style of ${artistName}` : null,
      `${movementName} movement`,
    ].filter(Boolean).join(', ')

    const userAddition = prompt?.trim() ? `, ${prompt.trim()}` : ''

    let dallePrompt
    if (imageBase64 && typeof imageBase64 === 'string') {
      // Step 1: GPT-4o Vision — describe the uploaded photo subject
      console.log('[generate] Calling GPT-4o Vision...')
      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`,
                detail: 'low',
              }
            },
            {
              type: 'text',
              text: 'Describe the main subject of this photo in one concise English sentence. Focus on what or who is depicted and key visual elements. Do not comment on style or quality.',
            }
          ]
        }]
      })
      const subjectDescription = visionResponse.choices[0]?.message?.content?.trim()
      if (!subjectDescription) throw new Error('GPT-4o Vision 未返回描述')
      console.log('[generate] Subject:', subjectDescription)
      dallePrompt = `${subjectDescription}, ${styleParts}, fine art painting, museum quality${userAddition}`
    } else {
      // No reference photo — generate a style example directly
      console.log('[generate] No photo provided, generating style example...')
      dallePrompt = `A fine art painting, ${styleParts}, museum quality${userAddition}`
    }
    console.log('[generate] DALL-E prompt:', dallePrompt)

    // Step 3: DALL-E 3 generation
    console.log('[generate] Calling DALL-E 3...')
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: dallePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    })

    const imageUrl = imageResponse.data[0]?.url
    const revisedPrompt = imageResponse.data[0]?.revised_prompt
    if (!imageUrl) throw new Error('DALL-E 3 未返回圖像')

    console.log('[generate] Done.')
    return res.json({ imageUrl, revisedPrompt })

  } catch (err) {
    console.error('[generate] Error:', err)
    if (err?.status && err?.error) {
      const msg = err.error?.message || '未知的 OpenAI 錯誤'
      if (err.status === 429) return res.status(429).json({ error: 'API 請求過於頻繁，請稍後再試' })
      if (err.status === 400 && msg.toLowerCase().includes('safety')) {
        return res.status(400).json({ error: '圖像或提示詞未通過安全審查，請修改後重試' })
      }
      return res.status(500).json({ error: `OpenAI 錯誤: ${msg}` })
    }
    return res.status(500).json({ error: err.message || '伺服器內部錯誤' })
  }
})

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, apiKeySet: !!process.env.OPENAI_API_KEY, timestamp: new Date().toISOString() })
})

// Serve built frontend in production
const webDist = join(__dirname, 'web', 'dist')
app.use(express.static(webDist))
app.get('*', (req, res) => {
  res.sendFile(join(webDist, 'index.html'), err => {
    if (err) res.status(404).send('Not found — run `npm run build:web` first')
  })
})

app.listen(PORT, () => {
  console.log(`Art Generator server running on http://localhost:${PORT}`)
  if (!process.env.OPENAI_API_KEY) {
    console.warn('WARNING: OPENAI_API_KEY is not set. API calls will fail.')
  }
})
