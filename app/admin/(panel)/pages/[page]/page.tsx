import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AdminLink, BulkUpload, Flash, Icon, SortableList } from '@/components/admin'
import { btnCls, btnGhost, cardCls, homeOf, modules, sectionUses, sitePages } from '@/lib/admin'
import { loadItems } from '@/lib/admin-rows'
import { requireEditor } from '@/lib/auth'
import { mediaUrl } from '@/lib/media'
import { Breadcrumbs, PageSwitcher } from '../../ui'

export async function generateMetadata({ params }: PageProps<'/admin/pages/[page]'>) {
  const { page } = await params
  return { title: sitePages.find((p) => p.slug === page)?.name ?? 'Page' }
}

type Section = { id: string; key: string; title: string | null; body: string | null; buttons: string[] | null; page: string; media: { path: string; alt: string } | null }

export default async function PageHub({ params, searchParams }: PageProps<'/admin/pages/[page]'>) {
  const { page: slug } = await params
  const { ok, error } = await searchParams
  const page = sitePages.find((p) => p.slug === slug)
  if (!page) notFound()
  const { db } = await requireEditor()

  const [{ data }, lists, competitions] = await Promise.all([
    db.from('page_sections').select('*,media:media!media_id(path,alt)').eq('page', slug),
    Promise.all(page.modules.map((k) => loadItems(db, k))),
    page.modules.includes('gallery') ? db.from('competitions').select('id, name').order('sort_order').then((r) => r.data ?? []) : [],
  ])
  const rows = (data ?? []) as unknown as Section[]
  // Site order first; sections the map does not know yet go last so nothing is hidden.
  const known = page.sections.map((s) => s.key)
  const sections = [
    ...page.sections.flatMap(({ key, label }) => rows.filter((r) => r.key === key).map((r) => ({ ...r, label }))),
    ...rows.filter((r) => !known.includes(r.key)).map((r) => ({ ...r, label: r.key })),
  ]

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ href: '/admin', label: 'Dashboard' }, { href: '/admin/pages', label: 'Pages' }, { label: page.name }]} />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">{page.name}</h1>
          <p className="mt-1 text-navy-600">{page.hint} Everything is listed in the order it appears on the page.</p>
        </div>
        <a href={page.path} target="_blank" className={btnGhost}>
          View page <Icon name="external" className="size-4" />
        </a>
      </header>
      <PageSwitcher current={slug} />
      <Flash ok={ok} error={error} />

      <section id="text" className={`${cardCls} overflow-hidden`}>
        <div className="flex items-center gap-3 border-b border-navy-200/70 px-5 py-4">
          <span className="grid size-9 place-items-center rounded-xl bg-surface text-secondary"><Icon name="text" className="size-5" /></span>
          <div>
            <h2 className="font-semibold tracking-tight text-navy-900">Text on this page</h2>
            <p className="text-sm text-navy-600">Headings, paragraphs, buttons and photos, from top to bottom.</p>
          </div>
        </div>
        <ol className="divide-y divide-navy-200/70">
          {sections.map((s, i) => (
            <li key={s.id}>
              <AdminLink href={`/admin/page-sections/${s.id}`} className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-surface/70">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary font-mono text-xs text-white">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-navy-600">{s.label}</span>
                  {s.title && <span className="block truncate font-semibold text-navy-900">{s.title}</span>}
                  {(!!s.body || !!s.buttons?.length) && (
                    <span className={`block truncate text-sm ${s.title ? 'text-navy-600' : 'font-medium text-navy-900'}`}>
                      {s.body?.replace(/\s+/g, ' ') || s.buttons?.map((b) => b.split('|')[0].trim()).join(' · ')}
                    </span>
                  )}
                  {!s.title && !s.body && !s.buttons?.length && <span className="block text-sm text-navy-400">(empty)</span>}
                </span>
                {sectionUses(s, 'media') && (
                  <span className="relative hidden size-12 shrink-0 overflow-hidden rounded-lg bg-surface sm:block">
                    {s.media && <Image src={mediaUrl(s.media.path)} alt={s.media.alt} fill sizes="48px" className="object-cover" />}
                  </span>
                )}
                <span className="hidden text-sm font-medium text-navy-600 group-hover:text-navy-900 sm:block">Edit</span>
                <Icon name="chevron" className="size-4 text-navy-400" />
              </AdminLink>
            </li>
          ))}
        </ol>
      </section>

      {page.modules.map((key, i) => {
        const mod = modules[key]
        const { groups, error: loadError } = lists[i]
        const count = groups.reduce((n, g) => n + g.items.length, 0)
        return (
          <section key={key} id={key} className={`${cardCls} scroll-mt-6 p-5`}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-surface text-secondary"><Icon name="list" className="size-5" /></span>
                <div>
                  <h2 className="font-semibold tracking-tight text-navy-900">{mod.title} <span className="ml-1 font-mono text-sm font-normal text-navy-600">{count}</span></h2>
                  <p className="text-sm text-navy-600">{mod.hint}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {key === 'gallery' && <BulkUpload competitions={competitions} />}
                {mod.create && (
                  <AdminLink href={`/admin/${key}/new`} className={btnCls}>
                    <Icon name="plus" className="size-4" /> Add
                  </AdminLink>
                )}
              </div>
            </div>
            {loadError && <Flash error={loadError} />}
            <div className="space-y-6">
              {groups.map((g) => (
                <div key={g.name ?? 'all'}>
                  {g.name && <h3 className="mb-2 text-xs font-semibold tracking-[0.14em] text-navy-600 uppercase">{g.name}</h3>}
                  <SortableList module={key} items={g.items} sortable={!!mod.sortable} layout={key === 'gallery' ? 'grid' : 'list'} thumbs={mod.fields.some((f) => f.type === 'media')} />
                </div>
              ))}
            </div>
            {count === 0 && <p className="rounded-xl border border-dashed border-navy-200 p-8 text-center text-sm text-navy-600">Nothing here yet.</p>}
          </section>
        )
      })}

      {page.alsoShows && (
        <section className={`${cardCls} p-5`}>
          <h2 className="font-semibold tracking-tight text-navy-900">Also on this page</h2>
          <p className="text-sm text-navy-600">This content is edited where it lives:</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {page.alsoShows.map((a) => (
              <li key={a.module}>
                <AdminLink href={homeOf(a.module)} className="flex h-full items-center justify-between gap-3 rounded-xl border border-navy-200/70 px-4 py-3 transition hover:border-navy-400 hover:bg-surface/60">
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">{modules[a.module].title}</span>
                    <span className="block text-xs text-navy-600">{a.note}</span>
                  </span>
                  <Icon name="chevron" className="size-4 text-navy-400" />
                </AdminLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
