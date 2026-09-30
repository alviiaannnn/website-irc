'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    label: 'Research',
    href: '/research',
    children: [
      { href: '/research#teams', label: 'Research Teams' },
      { href: '/research#projects', label: 'Projects' },
      { href: '/research#competitions', label: 'Competitions' },
    ],
  },
  { href: '/gallery-news', label: 'Gallery & News' },
  { href: '/teams', label: 'Teams' },
  {
    label: 'Support',
    href: '/sponsors',
    children: [
      { href: '/sponsors', label: 'Sponsors' },
      { href: '/support', label: 'Individual Support' },
    ],
  },
]

/** "IRC." wordmark with the red dot, as in irc-mobile. */
export function Wordmark({ light }: { light?: boolean }) {
  return (
    <span className={`text-lg font-semibold tracking-[-0.025em] ${light ? 'text-white' : 'text-navy-900'}`}>
      IRC<span aria-hidden className="text-primary">.</span>
    </span>
  )
}

export function Navbar({ orgName }: { orgName: string }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState<string | null>(null) // label of the open dropdown

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMenuOpen(false)
    setDropOpen(null)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setDropOpen(null), setMenuOpen(false))
    const onClick = (e: MouseEvent) => !(e.target as Element).closest('[data-dropdown]') && setDropOpen(null)
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [])

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]))
  const linkCls = (on: boolean) =>
    `rounded-lg px-2.5 py-2 text-sm font-medium transition-colors lg:px-3 ${on ? 'text-navy-900' : 'text-navy-600 hover:text-navy-900'}`

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-navy-200/70 bg-white/90 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:h-18 md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${orgName} home`}>
          <Image src="/brand/logo.png" alt="" width={40} height={40} className="size-10" preload />
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l) =>
            l.children ? (
              <li key={l.label} data-dropdown className="relative">
                <button
                  type="button"
                  aria-expanded={dropOpen === l.label}
                  aria-controls={`${l.label}-menu`}
                  onClick={() => setDropOpen((o) => (o === l.label ? null : l.label))}
                  className={`${linkCls(l.children.some((c) => active(c.href)))} inline-flex items-center gap-1`}
                >
                  {l.label}
                  <svg aria-hidden viewBox="0 0 20 20" className={`size-4 fill-current transition-transform ${dropOpen === l.label ? 'rotate-180' : ''}`}><path d="M5 7l5 6 5-6z" /></svg>
                </button>
                <ul id={`${l.label}-menu`} hidden={dropOpen !== l.label} className="absolute top-full left-1/2 mt-2 w-60 -translate-x-1/2 rounded-xl border border-navy-200/70 bg-white p-1.5 shadow-lg shadow-navy-900/5">
                  {l.children.map((c, i) => (
                    <li key={c.href}>
                      <Link href={c.href} onClick={() => setDropOpen(null)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-900 hover:bg-surface">
                        <span className="font-mono text-xs text-navy-600">0{i + 1}</span>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={l.href}>
                <Link href={l.href} className={linkCls(active(l.href))} aria-current={active(l.href) ? 'page' : undefined}>
                  {l.label}
                  {active(l.href) && <span aria-hidden className="text-primary">.</span>}
                </Link>
              </li>
            ),
          )}
          <li className="ml-2">
            <Link href="/contact" className="inline-flex min-h-10 items-center rounded-xl bg-primary-ink px-4 text-sm font-semibold text-white transition hover:brightness-90">
              Contact
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-lg text-navy-900 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="size-6 stroke-current" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </nav>

      <div id="mobile-menu" hidden={!menuOpen} className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-navy-200/70 bg-white md:hidden">
        <ul className="mx-auto max-w-[1200px] divide-y divide-navy-200/70 px-4">
          {links.map((l) => (
            <li key={l.label} className="py-1">
              <Link href={l.href} className="block py-3 text-lg font-semibold tracking-tight text-navy-900">{l.label}</Link>
              {l.children && (
                <ul className="pb-2">
                  {l.children.map((c, i) => (
                    <li key={c.href}>
                      <Link href={c.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-2 text-navy-600">
                        <span className="font-mono text-xs">0{i + 1}</span>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="py-4">
            <Link href="/contact" className="flex min-h-12 items-center justify-center rounded-xl bg-primary-ink font-semibold text-white">Contact</Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
