// Shared schema v1. Keep this file identical in codinglu-next and ai-prompt-lesson.
export function normalizePrompt(entry) {
  if (!entry || typeof entry !== "object") throw new Error("提示詞格式不正確");
  const text = (value, max) =>
    typeof value === "string" ? value.trim().slice(0, max) : "";
  const prompt_en = text(entry.prompt_en, 20000);
  const prompt_zh = text(entry.prompt_zh, 20000);
  if (!prompt_en && !prompt_zh) throw new Error("請先完成提示詞再收藏");
  return {
    version: 1,
    kind: "prompt",
    title: text(entry.title, 160) || "我的 Prompt",
    prompt_en,
    prompt_zh,
    tags: (Array.isArray(entry.tags) ? entry.tags : [])
      .slice(0, 40)
      .map((tag) => ({
        label: text(tag?.label, 40),
        value: text(tag?.value, 200),
      }))
      .filter((tag) => tag.label && tag.value),
    source: "ai-prompt-lesson",
  };
}
export async function promptId(entry) {
  const normalized = normalizePrompt(entry);
  const bytes = new TextEncoder().encode(
    JSON.stringify([normalized.prompt_en, normalized.prompt_zh]),
  );
  const hash = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
export function memberError(error) {
  const code = error?.code || "";
  if (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request"
  )
    return "登入視窗已關閉，請重新登入。";
  if (code === "auth/popup-blocked")
    return "瀏覽器阻擋登入視窗，請允許此網站開啟彈出視窗後重試。";
  if (code === "auth/unauthorized-domain")
    return "此網址尚未啟用 Google 登入，請聯絡站方。";
  if (code === "permission-denied")
    return "無法存取雲端收藏，請重新登入；若仍失敗，請聯絡站方。";
  if (code === "unavailable" || code === "auth/network-request-failed")
    return "網路連線中斷，請連線後重試。";
  return "操作未完成，請稍後重試。";
}
