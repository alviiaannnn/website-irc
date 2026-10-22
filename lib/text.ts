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

export const isPodium = (result: string | null) => !!result && /^(1st|2nd|3rd)\b/i.test(result)

/** Body text without its lists (the lists are rendered separately, e.g. as pills). */
export const leadText = (text: string | null | undefined) =>
  (text ?? '').split(/\r?\n\s*\n/).filter((b) => !/^\s*- /.test(b)).join('\n\n')

export type LinkItem = { label: string; href: string }
/** "Label | link" (one button line). The last "|" splits, so labels may contain one. */
export function parseLink(line: string): LinkItem {
  const i = line.lastIndexOf('|')
  return i < 0 ? { label: line.trim(), href: '' } : { label: line.slice(0, i).trim(), href: line.slice(i + 1).trim() }
}
export const isLinkLine = (line: string) => /^.*\S.*\|\s*(https?:\/\/|\/|#|mailto:|tel:)\S*\s*$/.test(line)

/** Replaces {name} placeholders; unknown ones stay as written. */
export const fill = (text: string | null | undefined, vars: Record<string, string | number>) =>
  (text ?? '').replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))

/** "- Label: value" lines → pairs (the first ": " splits). */
export const pairs = (text: string | null | undefined) =>
  listItems(text).map((n) => {
    const i = n.text.indexOf(': ')
    return i < 0 ? { label: n.text, value: '' } : { label: n.text.slice(0, i), value: n.text.slice(i + 2) }
  })

/** A fixed-order list of labels; an empty or missing line keeps the built-in text. */
export const labels = <T extends readonly string[]>(text: string | null | undefined, defaults: T): { [K in keyof T]: string } => {
  const items = listItems(text).map((n) => n.text.trim())
  return defaults.map((d, i) => items[i] || d) as { [K in keyof T]: string }
}
