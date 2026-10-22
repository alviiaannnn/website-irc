import { Breadcrumbs, PageCards } from '../ui'

export const metadata = { title: 'Pages' }

export default function Pages() {
  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ href: '/admin', label: 'Dashboard' }, { label: 'Pages' }]} />
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Website pages</h1>
        <p className="mt-1 text-navy-600">Same pages as the menu on the website. Open one to edit its text and the content shown on it.</p>
      </header>
      <PageCards />
    </div>
  )
}
