import Link from 'next/link'
import { LibraryUpload } from '@/components/admin'
import { modules, nav } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'

export const metadata = { title: 'Dashboard' }

export default async function Dashboard() {
  const { db, profile, user } = await requireEditor()
  const keys = nav.flatMap((g) => g.items)
  const [counts, { data: changes }, { data: profiles }, { count: photos }] = await Promise.all([
    Promise.all(keys.map(async (k) => (await db.from(modules[k].table).select('id', { count: 'exact', head: true })).count ?? 0)),
    db.from('recent_changes').select('*').order('updated_at', { ascending: false }).limit(10),
    db.from('profiles').select('id, full_name'),
    db.from('media').select('id', { count: 'exact', head: true }),
  ])
  const who = (id: string | null) => (id ? profiles?.find((p) => p.id === id)?.full_name ?? 'Admin' : 'Initial import')

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-navy-600">Hi {profile.full_name?.split(' ')[0] ?? user.email}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-navy-900">What do you want to edit?</h1>
        </div>
        <LibraryUpload />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[...keys.map((k, i) => ({ href: `/admin/${k}`, title: modules[k].title, hint: modules[k].hint, n: counts[i] })),
          { href: '/admin/media', title: 'Photos', hint: 'Every uploaded photo. Reuse them anywhere.', n: photos ?? 0 }].map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="block h-full rounded-2xl border border-navy-200/70 bg-white p-5 transition-colors hover:border-navy-400">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-semibold tracking-tight text-navy-900">{c.title}</span>
                <span className="font-mono text-sm text-navy-600">{c.n}</span>
              </span>
              <span className="mt-1 block text-sm text-navy-600">{c.hint}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section>
        <h2 className="text-lg font-semibold tracking-tight text-navy-900">Recent changes</h2>
        <ul className="mt-3 divide-y divide-navy-200/70 rounded-2xl border border-navy-200/70 bg-white">
          {changes?.map((c) => (
            <li key={c.module + c.id}>
              <Link href={c.module === 'media' ? '/admin/media' : `/admin/${c.module}/${c.id}`} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 hover:bg-surface">
                <span className="text-sm font-medium text-navy-900">
                  {c.label} <span className="font-normal text-navy-600">· {modules[c.module]?.title ?? 'Photos'}</span>
                </span>
                <span className="text-xs text-navy-600">
                  {who(c.updated_by)} · {new Date(c.updated_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
