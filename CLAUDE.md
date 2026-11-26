# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev:all        # Start backend (port 3001) + frontend (port 5173) with hot reload
npm run dev            # Backend only (node --watch server.js)
cd web && npm run dev  # Frontend only (Vite dev server)
cd web && npm test     # Catalog/image integrity, filtering, palette regression tests
```

### Production
```bash
npm run serve          # Build frontend then serve via backend
npm run build:web      # Build frontend to web/dist/
```

### Art data
```bash
pip install -r requirements.txt   # Python dep: requests
python fetch_art_data.py          # Fetch art movements/artists/paintings from Wikidata → web/public/art_data.json
```

### Environment
Create `.env` in project root:
```
OPENAI_API_KEY=sk-...
```

## Architecture

**Art style image generator with Traditional Chinese UI.** Two-process setup: Express backend + React/Vite frontend.

### Backend (`server.js`)
Express on port 3001. Two endpoints:
- `POST /api/generate` — receives `{ imageBase64, mimeType, prompt, styleContext: { movementName, artistName, paintingName } }`. If a photo is provided, calls **GPT-4o Vision** to describe the subject, then **DALL-E 3** to generate; without a photo, generates a style example directly. Returns `{ imageUrl, revisedPrompt }`.
- `GET /api/health` — returns server status and whether `OPENAI_API_KEY` is set.

In production, also serves `web/dist/` as static files.

### Frontend (`web/`)
React 18 + Vite SPA. Dev server at port 5173 proxies `/api` to port 3001.

**Visual system:** `playful.css` is the final active override after `App.css` and `editorial.css`. It uses warm cream, black outlines, orange/lime/pink accents, bold sans-serif text and quirky stickers. App contains the shared masthead/footer and six-step navigation. `AtelierHero.jsx` appears only on the introductory step with `/quirky/mascot.webp`; its actual generation prompt is in `quirky-generation.json`. Responsive layout changes at 1000px and 700px; mobile keeps all six step controls visible.

**Quiz:** `quizSets.js` preserves four fixed groups of six original real/AI examples. `IntroStep` uses its reducer to start at group one, clamp previous/next at the boundaries, clear answers on group changes, and offer restarting after the fourth group. Never regenerate these examples without checking their real/AI attribution.

**Detail navigation:** `detailSections.js` groups the unchanged 12 categories into six independent entrances: palette, action (action/attire), scene (scene/time/weather/material), camera (angle/composition/ratio), lighting, mood (mood/expression). Searches stay within the active entrance. Selection remains in App, so changing entrances never clears it.

**Turnaround and launch:** ProductStep includes `turnaround`. `turnaroundPrompt.js` contains the user's complete original-character sketch template and English translation. `buildPrompts` and `selectionTags` return only this template and its applicable tags when selected; regular options are preserved but excluded. The sketch is uploaded in the chosen external generator. `AssistantLaunch.jsx` selects Chinese/English; ChatGPT uses URL-encoded `q` with clipboard fallback, Gemini must finish copying before navigating and offers a manual link if popups are blocked. `CopyButton.jsx` reports clipboard failures for previews and saved prompts.

**Cat series:** All 100 style images, 120 subjects and 120 raster details use the same quirky orange-cat mascot (36 detail images were already generated). Subjects use costume/shape variations; prompt subject text remains unchanged. The 24 composition/ratio SVGs retain precise diagrams. `scripts/import-cat-series.py` imports completed built-in imagegen jobs from ignored `.cat-generation/` while preserving original PNGs and generation manifests.

**Wizard flow** — `App.jsx` orchestrates 6 steps in order:

| Step | Component | Purpose |
|------|-----------|---------|
| 0 | `IntroStep` | Educational intro about AI |
| 1 | `SubjectStep` | User describes the subject (free text) |
| 2 | `StyleStep` | Pick visual style(s) — two tabs below |
| 3 | `DetailsStep` | Detail options (action, lighting, angle, etc.) |
| 4 | `ProductStep` | Choose output product type |
| 5 | `PromptStep` | Assembled prompt preview + generate + save to localStorage |

**StyleStep tabs:**
- **風格圖庫 (Intuitive)** — 100 styles in ten categories defined in `web/src/data/styleCatalog.js`, re-exported by `intuitiveStyles.js`. `StyleGallery.jsx` provides Chinese/English search, category and selected-only filters. Each has a generated WebP in `web/public/style-previews/v2/`; `generation.json` records each actual generation prompt.
- **藝術流派 (Art Movements)** — Wikidata-sourced movements grouped by era (`eraData.js`), plus two hardcoded custom panels (`customPanels.js`): American animation artists and Japanese anime artists

**Style selection shape** (collected in `App.jsx` `styles` state, an array):
```js
{ id, label_zh, label_en, type }  // type: 'intuitive' | 'movement' | 'artist' | 'painting'
```

**Art data shape** (from `art_data.json` or `customPanels.js`):
```js
movement: { id, name_zh, name_en, painting_count, artists[] }
artist:   { id, name_zh, name_en, wiki, paintings[] }
painting: { id, name_zh, name_en, image_url? }
```

`art_data.json` is generated by `fetch_art_data.py` and not committed. If missing, the "藝術流派" tab shows a notice to run the script. The "直覺風格" tab works without it.

**Key data files in `web/src/data/`:**
- `intuitiveStyles.js` — intuitive style presets with English prompt keywords used directly in DALL-E prompts
- `styleCatalog.js` — canonical 100-style catalog, category list, and `filterStyles` helper
- `subjectLibrary.js` — 120 bilingual subject presets in 12 categories, cross-category search and exact preset English mapping; re-exported by `subjectPresets.js`. Custom subjects retain the entered text.
- `detailOptions.js` — 12 detail categories, 12 bilingual options each; `level` separates six basic and six advanced categories. Existing `img` references remain optional; new options have teaching descriptions.
- `utils/prompts.js` — shared `buildPrompts` and `selectionTags` iterate all detail categories so newly added selections appear in both languages and saved summaries.
- `eraData.js` — maps Wikidata Q-IDs to historical era groupings
- `customPanels.js` — two hardcoded panels (American animation, Japanese anime)
- `subjectPresets.js`, `detailOptions.js` — preset options for subject/detail steps

**Image utilities:**
- `utils/imageUrl.js` (`toDisplayUrl`) — converts Wikimedia Commons URLs to HTTPS thumbnail URLs; filters `.tif` files
- Legacy tag previews are superseded by 36 quirky orange-cat images under `web/public/detail-previews/quirky-v1/`.

**Saved prompts** are stored in `localStorage` under the key `savedPrompts` and viewable via `SavedPromptsPage`.

**Palette:** `ColorPalette.jsx` is shown in DetailsStep; App stores its optional enabled state. `utils/palette.js` handles HSL harmonies, locked swatches, one to four colors, and color-role instructions in both languages. Selected palettes are also stored with saved prompts. Image generation is external; the color-block preview is only a diagram, not live AI output.

**Style asset workflow:** Use built-in image generation for individual images. `scripts/import-style-images.py <local-manifest.json>` encodes originals as 768px WebP and records provenance without altering source PNGs. `node scripts/export-style-reference.mjs <absolute-directory>` exports all 100 images with a UTF-8 CSV and prompts for teacher reference.

**Subject/detail images:** Each of the 120 subjects has a stable ordinal `sNN-NN` reference under `subject-previews/v1/`; keep group/entry order stable when editing. Other detail images use `d-<category>-NN` under `detail-previews/v1/`. `scripts/import-reference-images.py <manifest.json>` encodes 204 independently generated originals to 640px WebP and writes `reference-generation.json`. The original 36 tag references are remapped to `q-<category>-NN` in `detail-previews/quirky-v1/`; `scripts/import-quirky-images.py` records these and the hero in `quirky-generation.json`, preserving original PNGs. `node scripts/generate-reference-diagrams.mjs` builds 24 SVG composition/aspect-ratio diagrams. Do not replace precise ratio diagrams with approximate generated rectangles. `ReferenceImage.jsx` provides shared lazy loading, accessible text and visible failure handling.

> **Note:** `GeneratorModal.jsx` is legacy code from the previous architecture (MovementCard browse → modal generate flow). The current entry point is the wizard in `App.jsx`.
