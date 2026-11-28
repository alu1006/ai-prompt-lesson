# Google 登入與私人收藏設定

此文件的 Firestore 規則、Firebase CLI 與主站測試指令以 `alu1006/codinglu-next` 為準；本 repo 的前端在 `web/`，測試與建置使用 `cd web && npm test && npm run build`。

目前程式已備妥，但尚未連接 Firebase 專案。缺少設定時不發出登入／資料請求，也不顯示雲端儲存成功；提示詞工具繼續提供原本的本機收藏。

## 需要站主完成的一次設定

1. 在 https://console.firebase.google.com/ 建立專案，新增 Web App；不需開啟 Analytics。
2. Authentication → Sign-in method 啟用 Google，選擇專案支援電子郵件。
3. Authentication → Settings → Authorized domains 加入 `codinglu.tw`、`www.codinglu.tw`、`ai-prompt-lesson.codinglu.tw`。本機測試再加入 `localhost`。
4. 建立 Cloud Firestore **Standard / Native mode** 的 `(default)` 資料庫，使用正式模式。選擇合適區域後不任意更換。不要使用測試模式的公開規則。
5. 將本 repo 的 `firestore.rules` 完整貼入 Firestore → Rules 並發布；或以 Firebase CLI `firebase deploy --only firestore:rules --project <你的 projectId>`。規則只允許本人讀寫 `users/{uid}/favorites/{id}`。
6. 取得 Project settings → Your apps 的 Web 設定（`apiKey`、`authDomain`、`projectId`、`appId`）。這些是公開 Web 設定，不是服務帳戶私鑰；請勿提供 service account JSON。
7. 主站 Vercel 的 Production 設定四個變數：`NEXT_PUBLIC_FIREBASE_API_KEY`、`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`、`NEXT_PUBLIC_FIREBASE_PROJECT_ID`、`NEXT_PUBLIC_FIREBASE_APP_ID`，再重新部署。Preview 若需測試須另設定及授權網域。
8. 提示詞工具 Vercel `ai-prompt-lesson` 專案的 Production Environment Variables 設定對應 `VITE_FIREBASE_API_KEY`、`VITE_FIREBASE_AUTH_DOMAIN`、`VITE_FIREBASE_PROJECT_ID`、`VITE_FIREBASE_APP_ID`。使用同一組 Firebase 專案，重新部署 Vercel。現有 GitHub Pages workflow 並非目前正式網站的部署來源。

不需伺服器私鑰，不需分享 Google 密碼。設定好公開 Web config 後即可讓此 chat 協助接續部署；登入時由站主自行在 Google 視窗操作。

## 行為

- 主站 `/account` 顯示 Google 登入、私人收藏、中英文複製與移除。
- 提示詞工具未登入沿用 `savedPrompts` 本機資料；登入後只讀目前帳號的雲端資料。切換帳號／登出立即清空舊帳號畫面及取消舊訂閱。
- 同一 Firebase 專案內相同 Google 帳號共用收藏；不同網域的 Firebase Auth 登入狀態不共用，各自首次登入，沒有自製跨域 token 傳遞。
- 本機收藏不自動併入帳號。按「匯入本機…」才複製到目前帳號；保留本機原檔，不會刪除或移轉原資料。
- SHA-256(中英文內容) 做文件 id，同內容匯入可重試，不覆寫既有收藏；時間由伺服器產生。
- 雲端只保存標題、中英文文字、標籤、來源及建立時間。圖片、完整 selection、Google token 不寫入收藏。
- 網路／權限失敗顯示錯誤，不標示已收藏；收藏權限以 Firestore 規則驗證，前端 uid 並非安全邊界。

## 維護與測試

`src/lib/account/model.mjs`、`useMember.jsx` 與 ai-prompt-lesson `web/src/account/` 的同名檔案需同步；資料格式 v1，兩站使用相同規則。

```sh
npm run test:members
npx firebase emulators:exec --only firestore --project demo-codinglu-members 'node --test tests/firestore-rules.test.mjs'
npm run build -- --webpack
```

Emulator 測試需要 Java 21。驗證匿名拒絕、不同帳號隔離、本人讀寫、資料限制、不可覆寫與匯入去重。本機模型／Emulator 通過不等同真實 Google 登入通過；正式服務設定後需由站主用兩個 Google 帳號實測：登入→收藏→主站讀取→切換帳號→確認隔離→登出。

官方參考：
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/auth/web/auth-state-persistence
- https://firebase.google.com/docs/firestore/security/rules-conditions
