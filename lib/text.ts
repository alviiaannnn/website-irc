// Plain-text helpers for admin-written content. No React here, so scripts/check-text.mjs can run them.

export type ListNode = { text: string; children: ListNode[] }

/** "- item" lines (indent 2 spaces to nest) → tree. Textareas submit \r\n line breaks, so split on both. */
export function listItems(text: string | null | undefined): ListNode[] {
  const root: ListNode[] = []
  const stack = [{ depth: -1, list: root }]
  for (const line of (text ?? '').split(/\r?\n/)) {
    const m = line.match(/^(\s*)- (.*)$/)
    if (!m) continue
    while (stack[stack.length - 1].depth >= m[1].length) stack.pop()
    const node = { text: m[2], children: [] }
    stack[stack.length - 1].list.push(node)
    stack.push({ depth: m[1].length, list: node.children })
  }
  return root
}

/** Body text without its lists (the lists are rendered separately, e.g. as pills). */
export const leadText = (text: string | null | undefined) =>
  (text ?? '').split(/\r?\n\s*\n/).filter((b) => !/^\s*- /.test(b)).join('\n\n')
