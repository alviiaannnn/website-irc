import type { ListItem } from '@/components/admin'
import { modules } from './admin'
import type { sessionDb } from './supabase'

type Row = Record<string, unknown> & { id: string; _m?: { path: string; alt: string } | null }
type Db = Awaited<ReturnType<typeof sessionDb>>

const text = (v: unknown) => (Array.isArray(v) ? v.join(', ') : v == null || v === '' ? '' : String(v))

// Names for the groups a list is split by (people.group); other groups show their raw value (entries.year).
const groupNames: Record<string, string> = { committee: 'Committee', supervisor: 'Supervisors', advisor: 'Research advisor', pic: 'Persons in charge' }

/** A module's rows as admin list items, split into groups when the module has one. */
export async function loadItems(db: Db, key: string): Promise<{ groups: { name: string | null; items: ListItem[] }[]; error?: string }> {
  const mod = modules[key]
  // Embed the first photo and the names behind reference columns.
  const photo = mod.fields.find((f) => f.type === 'media')
  const refs = mod.fields.filter((f) => f.ref && mod.meta?.includes(f.name))
  const select = ['*', photo && `_m:media!${photo.name}(path,alt)`, ...refs.map((f) => `r_${f.name}:${f.ref!.table}!${f.name}(${f.ref!.label})`)]
  let query = db.from(mod.table).select(select.filter(Boolean).join(','))
  for (const o of mod.order) query = query.order(o.replace('-', ''), { ascending: !o.startsWith('-') })
  const { data, error } = await query
  const rows = (data ?? []) as unknown as Row[]

  const meta = (r: Row) =>
    (mod.meta ?? [])
      .map((c) => {
        if (c === 'amount') return `IDR ${Number(r[c]).toLocaleString('id-ID')}`
        const ref = refs.find((f) => f.name === c)
        return ref ? text((r[`r_${c}`] as Row | null)?.[ref.ref!.label]) : text(r[c])
      })
      .filter(Boolean)
      .join(' · ')
  const item = (r: Row): ListItem => ({
    id: r.id,
    href: `/admin/${key}/${r.id}`,
    title: text(r[mod.label]) || (key === 'gallery' ? 'No caption' : '(untitled)'),
    meta: meta(r),
    thumb: photo ? (r._m ?? null) : undefined,
    badges: [r.is_published === false && 'Hidden', r.is_featured === true && 'Featured'].filter((b): b is string => !!b),
  })

  if (!mod.group) return { groups: [{ name: null, items: rows.map(item) }], error: error?.message }
  const names = [...new Set(rows.map((r) => text(r[mod.group!])))]
  return {
    groups: names.map((g) => ({ name: groupNames[g] ?? g, items: rows.filter((r) => text(r[mod.group!]) === g).map(item) })),
    error: error?.message,
  }
}
