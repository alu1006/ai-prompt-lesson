import test from 'node:test'
import assert from 'node:assert/strict'
import { assistantUrl, openCopiedAssistant } from '../src/utils/aiLaunch.js'

test('ChatGPT receives the full selected prompt with safe URL encoding', () => {
  const prompt='請生成圖像：橘貓 & 夥伴\n白色背景 #1？'
  const url=new URL(assistantUrl('chatgpt',prompt))
  assert.equal(url.origin,'https://chatgpt.com')
  assert.equal(url.searchParams.get('q'),prompt)
})

test('Gemini opens its app without claiming unsupported prompt parameters', () => {
  assert.equal(assistantUrl('gemini','圖像 prompt'),'https://gemini.google.com/app')
  assert.throws(()=>assistantUrl('unknown','test'))
})

test('Gemini navigates only after clipboard succeeds', async () => {
  const events=[]
  const target={opener:{}}
  assert.equal(await openCopiedAssistant('gemini','完整提示詞',{open:url=>{events.push(url);return target},copy:async text=>{events.push(text)}}),true)
  assert.deepEqual(events,['完整提示詞','https://gemini.google.com/app'])
  assert.equal(target.opener,null)
})

test('clipboard failure stays on the current page; blocked popups preserve copied text', async () => {
  await assert.rejects(openCopiedAssistant('gemini','prompt',{open:()=>assert.fail('must not open'),copy:async()=>{throw new Error('denied')}}))
  let copied=false
  assert.equal(await openCopiedAssistant('gemini','prompt',{open:()=>null,copy:async()=>{copied=true}}),false)
  assert.ok(copied)
})
