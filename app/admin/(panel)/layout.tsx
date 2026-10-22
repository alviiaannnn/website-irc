import Image from 'next/image'
import { signOut } from '../actions'
import { Finder, Icon, NavLink } from '@/components/admin'
import { Wordmark } from '@/components/navbar'
import { sitePages } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'

export default async function Panel({ children }: LayoutProps<'/admin'>) {
  const { user, profile } = await requireEditor()
  const name = profile.full_name ?? user.email ?? 'Admin'
  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-navy-900 text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="flex h-16 items-center gap-3 px-5">
          <Image src="/brand/logo.png" alt="" width={32} height={32} className="size-8 rounded-full bg-white p-0.5" />
          <Wordmark light />
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-navy-200">Admin</span>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-1 lg:overflow-y-auto lg:pb-4">
          <NavLink href="/admin" icon="home">Dashboard</NavLink>
          <div className="contents lg:block">
            <NavLink href="/admin/pages" icon="pages">Pages</NavLink>
            <ul className="mt-1 mb-2 hidden space-y-0.5 border-l border-white/10 pl-2 lg:ml-5 lg:block">
              {sitePages.map((p) => <li key={p.slug}><NavLink href={`/admin/pages/${p.slug}`} sub>{p.name}</NavLink></li>)}
            </ul>
          </div>
          <NavLink href="/admin/media" icon="photo">Photos</NavLink>
          <NavLink href="/admin/settings" icon="settings">Settings</NavLink>
          {profile.role === 'admin' && <NavLink href="/admin/users" icon="users">Accounts</NavLink>}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-semibold text-white">{name[0]?.toUpperCase()}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{name}</span>
              <span className="block text-xs text-navy-200 capitalize">{profile.role}</span>
            </span>
          </div>
          <form action={signOut} className="mt-3">
            <button className="flex items-center gap-2 text-sm text-navy-200 hover:text-white"><Icon name="logout" className="size-4" /> Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="sticky top-0 z-20 border-b border-navy-200/70 bg-surface/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-10">
            <Finder />
            <a href="/" target="_blank" className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900">
              <span className="hidden sm:inline">View website</span> <Icon name="external" className="size-4" />
            </a>
          </div>
        </div>
        <main className="mx-auto max-w-5xl px-4 py-8 md:px-10 md:py-10">{children}</main>
        <form action={signOut} className="px-4 pb-10 text-sm lg:hidden"><button className="text-navy-600 underline">Sign out</button></form>
      </div>
    </div>
  )
}
