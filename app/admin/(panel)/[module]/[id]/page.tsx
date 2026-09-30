import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deleteRow, saveRow } from '../../../actions'
import { AdminForm, ConfirmButton, GalleryField, MediaField } from '@/components/admin'
import { inputCls, modules, pageNames, type Field } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'
import type { Media } from '@/lib/data'

type Row = Record<string, unknown>
const M = 'id,path,alt,width,height'

function get(row: Row, name: string): unknown {
  const [col, k] = name.split('.')
  return k ? (row[col] as Row | null)?.[k] : row[col]
}

export default async function EditRow({ params, searchParams }: PageProps<'/admin/[module]/[id]'>) {
  const { module: key, id } = await params
  const { saved } = await searchParams
  const mod = modules[key]
  if (!mod) notFound()
  const { db } = await requireEditor()
  const isNew = id === 'new'
  if (isNew && !mod.create) notFound()

  const row: Row | null = isNew ? {} : (await db.from(mod.table).select('*').eq('id', id).maybeSingle()).data
  if (!row) notFound()

  const needsMedia = mod.fields.some((f) => f.type === 'media' || f.type === 'gallery')
  const library: Media[] = needsMedia ? (await db.from('media').select(M).order('created_at', { ascending: false })).data ?? [] : []
  const refs: Record<string, { id: string; label: string }[]> = {}
  for (const f of mod.fields.filter((f) => f.ref)) {
    const { data } = await db.from(f.ref!.table).select(`id, ${f.ref!.label}`).order(f.ref!.label)
    refs[f.name] = ((data ?? []) as unknown as Row[]).map((r) => ({ id: String(r.id), label: String(r[f.ref!.label]) }))
  }
  const gallery: Media[] =
    mod.fields.some((f) => f.type === 'gallery') && !isNew
      ? ((await db.from('project_media').select(`sort_order, media(${M})`).eq('project_id', id).order('sort_order')).data ?? []).map(
          (g) => g.media as unknown as Media,
        )
      : []

  const input = (f: Field) => {
    const v = get(row, f.name)
    const common = { id: f.name, name: f.name, required: f.required, 'aria-describedby': f.help ? `${f.name}-help` : undefined }
    switch (f.type) {
      case 'textarea':
        return <textarea {...common} rows={f.name === 'body' || f.name === 'description' || f.name === 'journey' ? 9 : 4} defaultValue={(v as string) ?? ''} className={`${inputCls} leading-relaxed`} />
      case 'lines':
        return <textarea {...common} rows={5} defaultValue={((v as string[]) ?? []).join('\n')} className={inputCls} />
      case 'tags':
        return <input {...common} defaultValue={((v as string[]) ?? []).join(', ')} className={inputCls} />
      case 'select':
        return (
          <select {...common} defaultValue={(v as string) ?? ''} className={`${inputCls} capitalize`}>
            {!f.required && <option value="">None</option>}
            {f.options!.map((o) => <option key={o}>{o}</option>)}
          </select>
        )
      case 'ref':
        return (
          <select {...common} defaultValue={(v as string) ?? ''} className={inputCls}>
            <option value="">None</option>
            {refs[f.name].map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        )
      default: {
        const type = { number: 'number', date: 'date', email: 'email' }[f.type as string] ?? 'text'
        return <input {...common} type={type} defaultValue={(v as string | number) ?? ''} pattern={f.type === 'slug' ? '[a-z0-9\\-]+' : undefined} className={inputCls} />
      }
    }
  }

  const toggles = mod.fields.filter((f) => f.type === 'bool')
  const title = key === 'page-sections' ? `${pageNames[String(row.page)] ?? row.page} · ${row.key}` : isNew ? `New ${mod.title.toLowerCase()} item` : String(row[mod.label] ?? 'Untitled')
  return (
    <div className="max-w-3xl space-y-6">
      <Link href={mod.singleton ? '/admin' : `/admin/${key}`} className="text-sm font-medium text-navy-600 hover:text-navy-900">← {mod.singleton ? 'Dashboard' : mod.title}</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900 capitalize">{title}</h1>
        {!isNew && <a href={mod.view(row)} target="_blank" className="text-sm font-medium text-navy-600 hover:text-navy-900">View on site ↗</a>}
      </div>
      <div className="rounded-2xl border border-navy-200/70 bg-white px-6 pt-6">
        <AdminForm action={saveRow.bind(null, key, id)} initialOk={saved ? 'Saved.' : undefined}>
          {mod.fields.filter((f) => f.type !== 'bool').map((f) =>
            f.type === 'media' ? (
              <MediaField key={f.name} name={f.name} label={f.label} required={f.required} library={library} initial={library.find((m) => m.id === get(row, f.name)) ?? null} />
            ) : f.type === 'gallery' ? (
              <GalleryField key={f.name} name={f.name} label={f.label} library={library} initial={gallery} />
            ) : (
              <div key={f.name}>
                <label htmlFor={f.name} className="text-sm font-medium text-navy-800">{f.label}{f.required && ' *'}</label>
                {input(f)}
                {f.help && <p id={`${f.name}-help`} className="mt-1.5 text-xs text-navy-600">{f.help}</p>}
              </div>
            ),
          )}
          {toggles.length > 0 && (
            <div className="space-y-3 rounded-xl bg-surface p-4">
              {toggles.map((f) => (
                <label key={f.name} className="flex items-center gap-3 text-sm font-medium text-navy-900">
                  <input type="checkbox" name={f.name} defaultChecked={isNew ? f.name === 'is_published' : !!get(row, f.name)} className="size-5 accent-secondary" />
                  {f.label}
                </label>
              ))}
            </div>
          )}
        </AdminForm>
      </div>
      {mod.create && !isNew && (
        <form action={deleteRow.bind(null, key, id)} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-200/70 bg-white px-6 py-4">
          <p className="text-sm text-navy-600">Remove this item from the website permanently.</p>
          <ConfirmButton message="Delete this item? This cannot be undone.">Delete</ConfirmButton>
        </form>
      )}
    </div>
  )
}
