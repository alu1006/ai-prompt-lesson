import { test } from 'node:test'
import assert from 'node:assert/strict'

test('quiz always begins with the first fixed six-image set', async () => {
  const quiz = await import('../src/data/quizSets.js').catch(() => ({}))
  assert.equal(typeof quiz.createQuizState, 'function')
  assert.equal(quiz.GUESS_SETS.length, 4)
  assert.deepEqual(quiz.createQuizState(), { setIndex: 0, revealed: {} })
  for (const set of quiz.GUESS_SETS) assert.equal(set.length, 6)
  assert.equal(quiz.GUESS_SETS[0][0].id, 'portrait')
})

test('next and previous follow set order and clear revealed answers', async () => {
  const quiz = await import('../src/data/quizSets.js').catch(() => ({}))
  assert.equal(typeof quiz.quizReducer, 'function')
  let state = quiz.createQuizState()
  state = quiz.quizReducer(state, { type: 'reveal', id: 'portrait' })
  assert.equal(state.revealed.portrait, true)
  state = quiz.quizReducer(state, { type: 'move', direction: 1 })
  assert.deepEqual(state, { setIndex: 1, revealed: {} })
  state = quiz.quizReducer(state, { type: 'move', direction: 1 })
  assert.equal(state.setIndex, 2)
  state = quiz.quizReducer(state, { type: 'move', direction: -1 })
  assert.equal(state.setIndex, 1)
})

test('set navigation never wraps or selects a random set', async () => {
  const quiz = await import('../src/data/quizSets.js').catch(() => ({}))
  assert.equal(typeof quiz.quizReducer, 'function')
  assert.equal(quiz.quizReducer(quiz.createQuizState(), { type: 'move', direction: -1 }).setIndex, 0)
  const end = { setIndex: 3, revealed: {} }
  assert.deepEqual(quiz.quizReducer(end, { type: 'move', direction: 1 }), end)
  assert.deepEqual(quiz.quizReducer(end, { type: 'first' }), quiz.createQuizState())
})
