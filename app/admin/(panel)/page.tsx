import { AdminLink, Icon, LibraryUpload } from '@/components/admin'
import { cardCls, homeOf, modules, sitePages } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'
import { PageCards } from './ui'

export const metadata = { title: 'Dashboard' }

const quick = [
  { href: '/admin/supporters/new', label: 'Add a supporter', note: 'After the payment arrives' },
  { href: '/admin/entries/new', label: 'Add a competition result', note: 'Timeline and achievements' },
  { href: '/admin/news/new', label: 'Add a news link', note: 'Gallery & News page' },
  { href: '/admin/pages/gallery-news#gallery', label: 'Add gallery photos', note: 'Upload many at once' },
]

export default async function Dashboard() {
  const { db, profile, user } = await requireEditor()
  const keys = sitePages.flatMap((p) => p.modules)
  const [counts, { data: changes }, { data: profiles }] = await Promise.all([
    Promise.all(keys.map(async (k) => (await db.from(modules[k].table).select('id', { count: 'exact', head: true })).count ?? 0)),
    db.from('recent_changes').select('*').order('updated_at', { ascending: false }).limit(8),
    db.from('profiles').select('id, full_name'),
  ])
  const perPage = Object.fromEntries(sitePages.map((p) => [p.slug, p.modules.reduce((n, k) => n + counts[keys.indexOf(k)], 0)]))
  const who = (id: string | null) => (id ? profiles?.find((p) => p.id === id)?.full_name ?? 'Admin' : 'Initial import')
  const link = (c: { module: string; id: string }) => (c.module === 'media' ? '/admin/media' : c.module === 'settings' ? '/admin/settings' : `/admin/${c.module}/${c.id}`)

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-navy-600">Hi {profile.full_name?.split(' ')[0] ?? user.email} 👋</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-navy-900">Which page do you want to edit?</h1>
          <p className="mt-1 text-navy-600">Pick a page below, or press <kbd className="rounded-md border border-navy-200 bg-white px-1.5 font-mono text-xs">/</kbd> to search for any heading, person or project.</p>
        </div>
        <LibraryUpload />
      </header>

      <PageCards counts={perPage} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className={`${cardCls} p-5`}>
          <h2 className="font-semibold tracking-tight text-navy-900">Quick actions</h2>
          <ul className="mt-3 space-y-1">
            {quick.map((q) => (
              <li key={q.href}>
                <AdminLink href={q.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-surface">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary-ink"><Icon name="plus" className="size-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy-900">{q.label}</span>
                    <span className="block text-xs text-navy-600">{q.note}</span>
                  </span>
                  <Icon name="chevron" className="size-4 text-navy-400 transition group-hover:translate-x-0.5" />
                </AdminLink>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${cardCls} p-5`}>
          <h2 className="font-semibold tracking-tight text-navy-900">Recent changes</h2>
          <ul className="mt-3 divide-y divide-navy-200/70">
            {changes?.map((c) => (
              <li key={c.module + c.id}>
                <AdminLink href={link(c)} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 rounded-lg px-1 py-2.5 hover:bg-surface/60">
                  <span className="min-w-0 truncate text-sm font-medium text-navy-900">
                    {c.label} <span className="font-normal text-navy-600">· {modules[c.module]?.title ?? 'Photos'}</span>
                  </span>
                  <span className="text-xs text-navy-600">
                    {who(c.updated_by)} · {new Date(c.updated_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' })}
                  </span>
                </AdminLink>
              </li>
            ))}
          </ul>
          <AdminLink href={homeOf('page-sections')} className="mt-3 inline-block text-sm font-medium text-navy-600 hover:text-navy-900">All pages →</AdminLink>
        </section>
      </div>
    </div>
  )
}
