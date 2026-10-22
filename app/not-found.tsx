import { Buttons, Eyebrow, Markdown, Ring } from '@/components/ui'
import { getSections } from '@/lib/data'

// Texts: Admin → Menu & footer → Page not found.
export default async function NotFound() {
  const s = (await getSections('site'))['not-found']
  return (
    <section className="grid flex-1 lg:grid-cols-2">
      <div className="flex items-center px-4 py-24 md:px-6 lg:justify-end lg:pr-12">
        <div className="max-w-md">
          <Eyebrow>{s?.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-navy-900">{s?.title ?? 'Page not found.'}</h1>
          <Markdown text={s?.body} className="mt-4 text-lg text-navy-600" />
          <Buttons items={s?.buttons ?? ['Back to home | /']} className="mt-8" />
        </div>
      </div>
      <div className="relative min-h-60 overflow-hidden bg-secondary">
        <Ring className="-top-28 -right-28 w-[26rem] border-[56px]" />
      </div>
    </section>
  )
}
