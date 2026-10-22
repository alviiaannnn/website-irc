// Server-rendered pieces shared by the admin screens.
import { Fragment } from 'react'
import { AdminLink, Icon } from '@/components/admin'
import { cardCls, sitePages } from '@/lib/admin'

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-navy-600">
      {items.map((it, i) => (
        <Fragment key={it.label + i}>
          {i > 0 && <Icon name="chevron" className="size-3.5 text-navy-400" />}
          {it.href ? (
            <AdminLink href={it.href} className="font-medium hover:text-navy-900">{it.label}</AdminLink>
          ) : (
            <span aria-current="page" className="font-medium text-navy-900">{it.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

/** Quick jump between the website pages, in the site's menu order. */
export function PageSwitcher({ current }: { current?: string }) {
  return (
    <nav aria-label="Website pages" className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
      <ul className="flex gap-1.5">
        {sitePages.map((p) => (
          <li key={p.slug}>
            <AdminLink
              href={`/admin/pages/${p.slug}`}
              aria-current={p.slug === current ? 'page' : undefined}
              className={`inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition ${
                p.slug === current ? 'border-secondary bg-secondary text-white' : 'border-navy-200 bg-white text-navy-800 hover:border-navy-400'
              }`}
            >
              {p.name}
            </AdminLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** One card per website page. */
export function PageCards({ counts }: { counts?: Record<string, number> }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {sitePages.map((p, i) => (
        <li key={p.slug}>
          <AdminLink href={`/admin/pages/${p.slug}`} className={`${cardCls} group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-lg hover:shadow-navy-900/5`}>
            <span className="flex items-center justify-between">
              <span className="font-mono text-xs text-navy-400">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-mono text-xs text-navy-600">{p.path}</span>
            </span>
            <span className="mt-6 flex items-center justify-between gap-2 text-lg font-semibold tracking-tight text-navy-900">
              {p.name}
              <Icon name="chevron" className="size-4 text-navy-400 transition group-hover:translate-x-0.5 group-hover:text-navy-900" />
            </span>
            <span className="mt-1 text-sm text-navy-600">{p.hint}</span>
            {counts && (
              <span className="mt-4 flex flex-wrap gap-1.5 text-xs text-navy-600">
                <span className="rounded-md bg-surface px-2 py-0.5">{p.sections.length} text blocks</span>
                {p.modules.length > 0 && <span className="rounded-md bg-surface px-2 py-0.5">{counts[p.slug] ?? 0} items</span>}
              </span>
            )}
          </AdminLink>
        </li>
      ))}
    </ul>
  )
}
