import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePrompt, promptId, memberError } from '../src/account/model.mjs';
const entry = { title: ' 山巒 ', prompt_en: ' watercolor mountain ', tags: [{ label: '風格', value: '水彩' }] };
test('normalization removes arbitrary fields and limits content', () => {
  const value = normalizePrompt({ ...entry, id: 'legacy', isAdmin: true, title: 'x'.repeat(200), selection: { private: true } });
  assert.equal(value.title.length, 160);
  assert.equal(value.prompt_en, 'watercolor mountain');
  assert.equal(value.source, 'ai-prompt-lesson');
  assert.equal('isAdmin' in value, false);
  assert.equal('selection' in value, false);
});
test('empty or malformed prompts cannot be saved', () => {
  for (const value of [null, {}, { prompt_en: 4 }, { prompt_en: '  ' }]) assert.throws(() => normalizePrompt(value));
});
test('import uses content hashes, deduplicates legacy ids, retains Chinese differences', async () => {
  assert.equal(await promptId(entry), await promptId({ ...entry, id: 'another-id', title: '改標題' }));
  assert.notEqual(await promptId(entry), await promptId({ ...entry, prompt_zh: '水彩山巒' }));
  assert.match(await promptId(entry), /^[a-f0-9]{64}$/);
});
test('storage and login errors provide retryable messages without raw details', () => {
  for (const code of ['permission-denied','unavailable','auth/unauthorized-domain','auth/popup-blocked']) assert.ok(memberError({ code }).length > 8);
  assert.equal(memberError({ message: 'secret' }).includes('secret'), false);
});
