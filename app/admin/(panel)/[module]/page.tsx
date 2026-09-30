import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { BulkUpload } from '@/components/admin'
import { btnCls, modules, pageNames } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'
import { mediaUrl } from '@/lib/media'

type Row = Record<string, unknown> & { id: string; _m?: { path: string; alt: string } | null }

// Page text groups follow the site's menu order.
const order = (page: string) => { const i = Object.keys(pageNames).indexOf(page); return i < 0 ? 99 : i }

const text = (v: unknown) => (Array.isArray(v) ? v.join(', ') : v == null || v === '' ? '' : String(v))

function Thumb({ m }: { m: Row['_m'] }) {
  return (
    <span className="relative block size-14 shrink-0 overflow-hidden rounded-lg bg-surface">
      {m && <Image src={mediaUrl(m.path)} alt={m.alt} fill sizes="56px" className="object-cover" />}
    </span>
  )
}

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-navy-600">{children}</span>
)

export default async function ModuleList({ params, searchParams }: PageProps<'/admin/[module]'>) {
  const { module: key } = await params
  const { ok, error } = await searchParams
  const mod = modules[key]
  if (!mod) notFound()
  const { db } = await requireEditor()

  if (mod.singleton) {
    const { data } = await db.from(mod.table).select('id').limit(1).single()
    if (!data) notFound()
    redirect(`/admin/${key}/${data.id}`)
  }

  // Embed the first photo and the names behind reference columns.
  const photo = mod.fields.find((f) => f.type === 'media')
  const refs = mod.fields.filter((f) => f.ref && mod.meta?.includes(f.name))
  const select = ['*', photo && `_m:media!${photo.name}(path,alt)`, ...refs.map((f) => `r_${f.name}:${f.ref!.table}!${f.name}(${f.ref!.label})`)]
  let query = db.from(mod.table).select(select.filter(Boolean).join(','))
  for (const o of mod.order) query = query.order(o.replace('-', ''), { ascending: !o.startsWith('-') })
  const { data, error: loadError } = await query
  const rows = (data ?? []) as unknown as Row[]
  const meta = (r: Row) =>
    (mod.meta ?? []).map((c) => (c === 'amount' ? `IDR ${Number(r[c]).toLocaleString('id-ID')}` : refs.some((f) => f.name === c) ? text((r[`r_${c}`] as Row | null)?.[refs.find((f) => f.name === c)!.ref!.label]) : text(r[c]))).filter(Boolean).join(' · ')
  const badges = (r: Row) => (
    <>
      {r.is_published === false && <Badge>Hidden</Badge>}
      {r.is_featured === true && <Badge>Featured</Badge>}
    </>
  )
  const competitions = key === 'gallery' ? (await db.from('competitions').select('id, name').order('sort_order')).data ?? [] : []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">{mod.title}</h1>
          <p className="mt-1 text-navy-600">{mod.hint}</p>
        </div>
        <div className="flex gap-2">
          {key === 'gallery' && <BulkUpload competitions={competitions} />}
          {mod.create && <Link href={`/admin/${key}/new`} className={btnCls}>+ Add new</Link>}
        </div>
      </div>
      {ok && <p role="status" className="rounded-xl border border-navy-200/70 bg-white px-4 py-3 text-sm font-medium text-navy-900">✓ {String(ok)}</p>}
      {(error || loadError) && <p role="alert" className="rounded-xl border border-navy-200/70 bg-white px-4 py-3 text-sm font-medium text-primary-ink">{String(error ?? loadError?.message)}</p>}

      {key === 'page-sections' ? (
        [...new Set(rows.map((r) => String(r.page)))].sort((x, y) => order(x) - order(y)).map((page) => (
          <section key={page}>
            <h2 className="mb-2 text-sm font-semibold tracking-[0.14em] text-navy-600 uppercase">{pageNames[page] ?? page} page</h2>
            <ul className="divide-y divide-navy-200/70 rounded-2xl border border-navy-200/70 bg-white">
              {rows.filter((r) => r.page === page).map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/${key}/${r.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-surface">
                    <Thumb m={r._m} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-navy-900">{text(r.title) || <span className="text-navy-600">(no heading)</span>}</span>
                      <span className="block truncate text-sm text-navy-600">{text(r.body).replace(/\s+/g, ' ') || 'No text'}</span>
                    </span>
                    <span className="hidden font-mono text-xs text-navy-600 sm:block">{String(r.key)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : key === 'gallery' ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/${key}/${r.id}`} className="group block overflow-hidden rounded-2xl border border-navy-200/70 bg-white hover:border-navy-400">
                <span className="relative block aspect-square bg-surface">
                  {r._m && <Image src={mediaUrl(r._m.path)} alt={r._m.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />}
                </span>
                <span className="block p-3">
                  <span className="block truncate text-sm font-medium text-navy-900">{text(r.caption) || 'No caption'}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-navy-600">{meta(r)} {badges(r)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-navy-200/70 rounded-2xl border border-navy-200/70 bg-white">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/${key}/${r.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-surface">
                {photo && <Thumb m={r._m} />}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 font-medium text-navy-900">{text(r[mod.label]) || '(untitled)'} {badges(r)}</span>
                  <span className="block truncate text-sm text-navy-600">{meta(r)}</span>
                </span>
                <span aria-hidden className="text-navy-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {rows.length === 0 && <p className="rounded-2xl border border-dashed border-navy-200 p-8 text-center text-navy-600">Nothing here yet.</p>}
    </div>
  )
}
