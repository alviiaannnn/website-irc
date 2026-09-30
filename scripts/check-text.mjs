// Regression check for the admin text parser: npm run check
import assert from 'node:assert/strict'
import { leadText, listItems } from '../lib/text.ts'

// What a <textarea> actually submits: \r\n line breaks (this once rendered only the last item).
const crlf = '- Thank-you mention on our Instagram\r\n- Your name on our website\r\n  - nested\r\n- After-movie credits'
assert.deepEqual(listItems(crlf).map((n) => n.text), ['Thank-you mention on our Instagram', 'Your name on our website', 'After-movie credits'])
assert.deepEqual(listItems(crlf)[1].children.map((n) => n.text), ['nested'])
assert.deepEqual(listItems('- a\n- b').map((n) => n.text), ['a', 'b'])
assert.equal(leadText('Intro line.\r\n\r\n- a\r\n- b'), 'Intro line.')
console.log('text helpers ok')
