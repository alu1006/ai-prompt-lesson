// download-artworks.mjs  —  node download-artworks.mjs
import https from 'node:https'
import http from 'node:http'
import { createWriteStream, existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, 'web', 'public', 'intro')

// Wikimedia thumbnail URLs (800px width)
const ARTWORKS = [
  {
    file: 'original-starry-night.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    label: '梵谷《星夜》',
  },
  {
    file: 'original-great-wave.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/800px-The_Great_Wave_off_Kanagawa.jpg',
    label: '葛飾北齋《神奈川沖浪裏》',
  },
  {
    // 布欣《蓬巴杜夫人像》1756 — 18世紀法國宮廷肖像
    file: 'real-portrait-18c.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Boucher_Marquise_de_Pompadour.jpg/500px-Boucher_Marquise_de_Pompadour.jpg',
    label: '布欣《蓬巴杜夫人》',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vigée_Lebrun%2C_Élisabeth_-_Portrait_of_Marie_Antoinette_-_1783.jpg/500px-Vigée_Lebrun%2C_Élisabeth_-_Portrait_of_Marie_Antoinette_-_1783.jpg',
  },
]

function get(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    mod.get(url, {
      headers: {
        'User-Agent': 'ArtEducationProject/1.0 (open educational use)',
        'Accept': 'image/jpeg,image/png,image/*',
      }
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location).then(resolve).catch(reject)
      }
      resolve(res)
    }).on('error', reject)
  })
}

function download(url, dest) {
  return new Promise(async (resolve, reject) => {
    if (existsSync(dest)) {
      console.log(`[skip] ${dest}`)
      return resolve(true)
    }
    try {
      const res = await get(url)
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        res.resume()
        return
      }
      const file = createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
      file.on('error', reject)
    } catch (e) { reject(e) }
  })
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  await mkdir(OUT, { recursive: true })

  for (let i = 0; i < ARTWORKS.length; i++) {
    const { file, url, label, fallback } = ARTWORKS[i]
    const dest = join(OUT, file)
    process.stdout.write(`[下載] ${label}... `)
    try {
      await download(url, dest)
      console.log('完成')
    } catch (e) {
      console.log(`失敗 (${e.message})`)
      if (fallback) {
        process.stdout.write(`  [備用] `)
        try {
          await download(fallback, dest)
          console.log('完成')
        } catch (e2) {
          console.log(`備用也失敗: ${e2.message}`)
        }
      }
    }
    if (i < ARTWORKS.length - 1) await sleep(4000)
  }
  console.log('\n=== 完成 ===')
}

main().catch(console.error)
