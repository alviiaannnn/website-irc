import { notFound } from 'next/navigation'
import { deleteRow, saveRow } from '../../../actions'
import { AdminForm, ConfirmButton, GalleryField, Icon, MediaField } from '@/components/admin'
import { btnGhost, cardCls, fieldsFor, homeOf, inputCls, modules, pageNames, sectionInfo, sitePages, type Field } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'
import type { Media } from '@/lib/data'
import { Breadcrumbs } from '../../ui'

type Row = Record<string, unknown>
const M = 'id,path,alt,width,height'

function get(row: Row, name: string): unknown {
  const [col, k] = name.split('.')
  return k ? (row[col] as Row | null)?.[k] : row[col]
}

export async function generateMetadata({ params }: PageProps<'/admin/[module]/[id]'>) {
  const { module: key, id } = await params
  return { title: `${id === 'new' ? 'New' : 'Edit'} · ${modules[key]?.title ?? 'Admin'}` }
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

  const fields = fieldsFor(key, row)
  const needsMedia = fields.some((f) => f.type === 'media' || f.type === 'gallery')
  const refFields = fields.filter((f) => f.ref)
  const [library, refLists, gallery] = await Promise.all([
    needsMedia ? db.from('media').select(M).order('created_at', { ascending: false }).then((r) => (r.data ?? []) as Media[]) : ([] as Media[]),
    Promise.all(
      refFields.map(async (f) => {
        const { data } = await db.from(f.ref!.table).select(`id, ${f.ref!.label}`).order(f.ref!.label)
        return ((data ?? []) as unknown as Row[]).map((r) => ({ id: String(r.id), label: String(r[f.ref!.label]) }))
      }),
    ),
    fields.some((f) => f.type === 'gallery') && !isNew
      ? db.from('project_media').select(`sort_order, media(${M})`).eq('project_id', id).order('sort_order').then((r) => (r.data ?? []).map((g) => g.media as unknown as Media))
      : ([] as Media[]),
  ])
  const refs = Object.fromEntries(refFields.map((f, i) => [f.name, refLists[i]]))

  const input = (f: Field) => {
    const v = get(row, f.name)
    const common = { id: f.name, name: f.name, required: f.required, 'aria-describedby': f.help ? `${f.name}-help` : undefined }
    switch (f.type) {
      case 'textarea':
        return <textarea {...common} rows={f.name === 'body' || f.name === 'description' || f.name === 'journey' ? 9 : 4} defaultValue={(v as string) ?? ''} className={`${inputCls} leading-relaxed`} />
      case 'lines':
      case 'buttons':
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

  const isSection = key === 'page-sections'
  const page = isSection ? sitePages.find((p) => p.slug === row.page) : sitePages.find((p) => homeOf(key).startsWith(`/admin/pages/${p.slug}#`))
  const where = isSection ? sectionInfo(String(row.page), String(row.key))?.label : null
  const toggles = fields.filter((f) => f.type === 'bool')
  const title = isSection ? String(row.title || where || row.key) : mod.singleton ? mod.title : isNew ? `New ${mod.title.toLowerCase()} item` : String(row[mod.label] ?? 'Untitled')
  const crumbs = [
    { href: '/admin', label: 'Dashboard' },
    ...(page ? [{ href: `/admin/pages/${page.slug}`, label: page.name }] : []),
    ...(isSection ? [{ href: `/admin/pages/${row.page}#text`, label: 'Text on this page' }] : mod.singleton ? [] : [{ href: homeOf(key), label: mod.title }]),
    { label: isNew ? 'New' : title },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <Breadcrumbs items={crumbs} />
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {isSection && <p className="text-sm font-medium text-primary-ink">{pageNames[String(row.page)] ?? String(row.page)} page</p>}
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-balance text-navy-900">{title}</h1>
        </div>
        {!isNew && (
          <a href={mod.view(row)} target="_blank" className={btnGhost}>
            View on site <Icon name="external" className="size-4" />
          </a>
        )}
      </header>
      {where && (
        <p className="flex items-start gap-3 rounded-xl border border-secondary/15 bg-secondary/5 px-4 py-3 text-sm text-navy-800">
          <Icon name="pages" className="mt-0.5 size-4 text-secondary" />
          <span><span className="font-semibold">Where it shows:</span> {where}</span>
        </p>
      )}
      <div className={`${cardCls} px-6 pt-6`}>
        <AdminForm action={saveRow.bind(null, key, id)} initialOk={saved ? 'Saved.' : undefined}>
          {toggles.length > 0 && (
            <div className="space-y-3 rounded-xl bg-surface p-4">
              {toggles.map((f) => (
                <label key={f.name} className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-navy-900">
                  {f.label}
                  <span className="relative inline-flex shrink-0">
                    <input type="checkbox" name={f.name} defaultChecked={isNew ? f.name === 'is_published' : !!get(row, f.name)} className="peer sr-only" />
                    <span aria-hidden className="h-6 w-11 rounded-full bg-navy-200 transition peer-checked:bg-tier-green peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary" />
                    <span aria-hidden className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </span>
                </label>
              ))}
            </div>
          )}
          {fields.filter((f) => f.type !== 'bool').map((f) =>
            f.type === 'media' ? (
              <MediaField key={f.name} name={f.name} label={f.label} required={f.required} library={library} initial={library.find((m) => m.id === get(row, f.name)) ?? null} />
            ) : f.type === 'gallery' ? (
              <GalleryField key={f.name} name={f.name} label={f.label} library={library} initial={gallery} />
            ) : (
              <div key={f.name}>
                <label htmlFor={f.name} className="text-sm font-medium text-navy-800">{f.label}{f.required && <span className="text-primary-ink"> *</span>}</label>
                {input(f)}
                {f.help && <p id={`${f.name}-help`} className="mt-1.5 text-xs text-navy-600">{f.help}</p>}
              </div>
            ),
          )}
        </AdminForm>
      </div>
      {mod.create && !isNew && (
        <form action={deleteRow.bind(null, key, id)} className={`${cardCls} flex flex-wrap items-center justify-between gap-3 px-6 py-4`}>
          <p className="text-sm text-navy-600">Remove this item from the website permanently.</p>
          <ConfirmButton message="Delete this item? This cannot be undone.">Delete</ConfirmButton>
        </form>
      )}
    </div>
  )
}
