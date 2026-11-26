export function assistantUrl(provider, prompt) {
  if (provider === 'chatgpt') return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
  if (provider === 'gemini') return 'https://gemini.google.com/app'
  throw new Error(`Unknown assistant: ${provider}`)
}

export async function openCopiedAssistant(provider, prompt, { open, copy }) {
  await copy(prompt)
  const target = open(assistantUrl(provider, prompt))
  if (target) target.opener = null
  return Boolean(target)
}
