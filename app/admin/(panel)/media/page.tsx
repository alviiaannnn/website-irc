import Image from 'next/image'
import Link from 'next/link'
import { deleteMedia, updateMediaAlt } from '../../actions'
import { ConfirmButton, LibraryUpload, ReplaceMedia } from '@/components/admin'
import { inputCls, mediaRefs, modules } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'
import { mediaUrl } from '@/lib/media'

export const metadata = { title: 'Photos' }

export default async function MediaLibrary({ searchParams }: PageProps<'/admin/media'>) {
  const { ok, error, q } = await searchParams
  const { db } = await requireEditor()
  let query = db.from('media').select('*').order('created_at', { ascending: false })
  if (q) query = query.ilike('alt', `%${String(q)}%`)
  const { data: media } = await query

  // Where each photo is used: media id → module keys.
  const usage = new Map<string, Set<string>>()
  await Promise.all(
    mediaRefs.map(async ([table, column, module]) => {
      const { data } = await db.from(table).select(column).not(column, 'is', null)
      for (const r of (data ?? []) as unknown as Record<string, string>[]) {
        usage.set(r[column], (usage.get(r[column]) ?? new Set()).add(module))
      }
    }),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Photos</h1>
          <p className="mt-1 text-navy-600">Every uploaded photo is saved here and can be picked in any photo field. JPG, PNG or WebP up to 5 MB.</p>
        </div>
        <LibraryUpload />
      </div>
      <form className="flex gap-2">
        <input type="search" name="q" defaultValue={q ? String(q) : ''} placeholder="Search by description…" aria-label="Search photos" className={`${inputCls} mt-0 max-w-sm`} />
      </form>
      {ok && <p role="status" className="rounded-xl border border-navy-200/70 bg-white px-4 py-3 text-sm font-medium text-navy-900">✓ {String(ok)}</p>}
      {error && <p role="alert" className="rounded-xl border border-navy-200/70 bg-white px-4 py-3 text-sm font-medium text-primary-ink">{String(error)}</p>}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {media?.map((m) => {
          const used = [...(usage.get(m.id) ?? [])]
          return (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-navy-200/70 bg-white">
              <a href={mediaUrl(m.path)} target="_blank" className="relative block aspect-[4/3] bg-surface" title="Open full size">
                <Image src={mediaUrl(m.path)} alt={m.alt} fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </a>
              <div className="space-y-3 p-4">
                <form action={updateMediaAlt.bind(null, m.id)} className="flex items-end gap-2">
                  <label className="flex-1 text-xs font-medium text-navy-800">
                    Description
                    <input name="alt" required defaultValue={m.alt} className={inputCls} />
                  </label>
                  <button className="min-h-10 rounded-xl border border-navy-200 px-3 text-sm font-medium text-navy-900 hover:border-navy-600">Save</button>
                </form>
                <p className="flex flex-wrap gap-1.5 text-xs">
                  {used.length ? (
                    used.map((u) => <Link key={u} href={`/admin/${u}`} className="rounded-md bg-surface px-2 py-0.5 font-medium text-navy-600 hover:text-navy-900">{modules[u].title}</Link>)
                  ) : (
                    <span className="text-navy-600">Not used yet</span>
                  )}
                </p>
                <div className="flex items-center justify-between border-t border-navy-200/70 pt-3">
                  <ReplaceMedia id={m.id} />
                  <span className="font-mono text-xs text-navy-600">{m.width}×{m.height}</span>
                  {used.length === 0 && (
                    <form action={deleteMedia.bind(null, m.id)}>
                      <ConfirmButton message="Delete this photo permanently?">Delete</ConfirmButton>
                    </form>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {media?.length === 0 && <p className="rounded-2xl border border-dashed border-navy-200 p-8 text-center text-navy-600">No photos found.</p>}
    </div>
  )
}
