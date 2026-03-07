# CLAUDE.md

此檔案提供 Claude Code (claude.ai/code) 在此專案中工作時的指引。

## 常用指令

### 開發模式（全端）
```bash
npm run dev:all        # 同時啟動後端（port 3001）與前端（port 5173），支援熱重載
npm run dev            # 僅啟動後端（node --watch server.js）
cd web && npm run dev  # 僅啟動前端（Vite dev server）
```

### 正式環境
```bash
npm run serve          # 建置前端後以後端服務靜態檔案
npm run build:web      # 將前端建置至 web/dist/
```

### 資料抓取
```bash
python fetch_art_data.py   # 從 Wikidata 抓取藝術流派、藝術家、畫作 → 輸出 art_data.json
pip install -r requirements.txt  # Python 依賴套件：requests
```

### 環境變數
在專案根目錄建立 `.env`：
```
OPENAI_API_KEY=sk-...
```

## 架構說明

本專案是一個**繁體中文介面的藝術風格圖像生成器**，採雙行程架構：

### 後端（`server.js`）
Express 伺服器，監聽 port 3001，提供兩個端點：
- `POST /api/generate`：接收可選的參考照片（base64）與風格上下文（流派／藝術家／畫作名稱）。若有照片，先呼叫 **GPT-4o Vision** 描述照片主題，再呼叫 **DALL-E 3** 生成風格畫作；若無照片則直接生成風格示例。
- `GET /api/health`：回傳伺服器狀態與 API key 是否已設定。

正式環境下亦從 `web/dist/` 服務已建置的前端。

### 前端（`web/`）
React 18 + Vite SPA，開發時運行於 port 5173（`/api` 請求代理至 port 3001）。

**資料流：**
1. 啟動時 `App.jsx` 抓取 `/art_data.json`（靜態檔案，已列入 .gitignore，由 `fetch_art_data.py` 生成）
2. 流派依 `eraData.js` 的對應（Wikidata Q-ID → 時代分組）分組，並依序渲染：`EraSection` → `MovementCard` → `ArtistCard` → `PaintingCard`
3. 在任一層級（流派／藝術家／畫作）點擊「以此風格生成」，開啟帶有所選上下文的 `GeneratorModal`
4. `GeneratorModal` 讓使用者：選擇提示詞標籤（主體動作、光影、角度、背景等）、上傳參考照片（選填）、預覽並編輯提示詞，最後呼叫 `/api/generate`

**兩個自訂面板**（非 Wikidata 來源）以硬編碼方式定義於 `web/src/data/customPanels.js`：美式動畫藝術家與日式動漫藝術家。

**核心資料結構**（來自 `art_data.json` 或 `customPanels.js`）：
```
movement: { id, name_zh, name_en, painting_count, artists[] }
artist:   { id, name_zh, name_en, wiki, paintings[] }
painting: { id, name_zh, name_en, image_url? }
```

Wikimedia Commons 圖片 URL 由 `utils/imageUrl.js`（`toDisplayUrl`）轉換為 HTTPS 縮圖 URL，`.tif` 格式會被過濾掉。

標籤預覽圖（顯示為 tooltip）存放於 `web/public/tag-previews/`，由 `generate-tag-previews.js` 生成。
