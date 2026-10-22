// Regression check for the admin text parser: npm run check
import assert from 'node:assert/strict'
import { fill, isLinkLine, labels, leadText, listItems, pairs, parseLink } from '../lib/text.ts'

// What a <textarea> actually submits: \r\n line breaks (this once rendered only the last item).
const crlf = '- Thank-you mention on our Instagram\r\n- Your name on our website\r\n  - nested\r\n- After-movie credits'
assert.deepEqual(listItems(crlf).map((n) => n.text), ['Thank-you mention on our Instagram', 'Your name on our website', 'After-movie credits'])
assert.deepEqual(listItems(crlf)[1].children.map((n) => n.text), ['nested'])
assert.deepEqual(listItems('- a\n- b').map((n) => n.text), ['a', 'b'])
assert.equal(leadText('Intro line.\r\n\r\n- a\r\n- b'), 'Intro line.')

// Buttons: "Label | link", one per line.
assert.deepEqual(parseLink('Become a Sponsor | /contact?topic=sponsorship'), { label: 'Become a Sponsor', href: '/contact?topic=sponsorship' })
assert.deepEqual(parseLink('A | B | #x'), { label: 'A | B', href: '#x' })
assert.ok(isLinkLine('About IRC | #story') && isLinkLine('Site | https://x.id') && !isLinkLine('About IRC') && !isLinkLine('| /x') && !isLinkLine('A | javascript:x'))
assert.equal(fill('{sponsors} partners · {nope}', { sponsors: 10 }), '10 partners · {nope}')
assert.deepEqual(pairs('- Competing since: {since}\r\n- Odd line'), [{ label: 'Competing since', value: '{since}' }, { label: 'Odd line', value: '' }])
assert.deepEqual(labels('- Nama\n- \n', ['Name', 'Email', 'Topic']), ['Nama', 'Email', 'Topic'])
console.log('text helpers ok')
