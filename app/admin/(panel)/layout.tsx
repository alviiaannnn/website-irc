import Image from 'next/image'
import { signOut } from '../actions'
import { NavLink } from '@/components/admin'
import { Wordmark } from '@/components/navbar'
import { modules, nav } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'

export default async function Panel({ children }: LayoutProps<'/admin'>) {
  const { user, profile } = await requireEditor()
  const groups = [
    { title: '', items: [['/admin', 'Dashboard']] },
    ...nav.map((g) => ({ title: g.title, items: g.items.map((k) => [`/admin/${k}`, modules[k].title]) })),
    { title: 'Library', items: [['/admin/media', 'Photos']] },
    { title: 'Site', items: [['/admin/settings', 'Settings'], ...(profile.role === 'admin' ? [['/admin/users', 'Accounts']] : [])] },
  ]
  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-navy-200/70 bg-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center gap-3 px-5">
          <Image src="/brand/logo.png" alt="" width={32} height={32} className="size-8" />
          <Wordmark />
          <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-navy-600">Admin</span>
        </div>
        <nav aria-label="Admin" className="flex gap-4 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-5 lg:overflow-y-auto lg:pb-0">
          {groups.map((g) => (
            <div key={g.title || 'main'} className="shrink-0">
              {g.title && <p className="hidden px-3 pb-1 text-xs font-semibold tracking-[0.14em] text-navy-600 uppercase lg:block">{g.title}</p>}
              <ul className="flex gap-1 lg:block lg:space-y-0.5">
                {g.items.map(([href, label]) => <li key={href}><NavLink href={href}>{label}</NavLink></li>)}
              </ul>
            </div>
          ))}
        </nav>
        <div className="hidden border-t border-navy-200/70 p-4 text-sm lg:block">
          <p className="truncate font-medium text-navy-900">{profile.full_name ?? user.email}</p>
          <p className="text-xs text-navy-600 capitalize">{profile.role}</p>
          <div className="mt-3 flex gap-4">
            <a href="/" target="_blank" className="text-navy-600 hover:text-navy-900">View site ↗</a>
            <form action={signOut}><button className="text-navy-600 hover:text-navy-900">Sign out</button></form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
        <form action={signOut} className="mt-10 text-sm lg:hidden"><button className="text-navy-600 underline">Sign out</button></form>
      </main>
    </div>
  )
}
