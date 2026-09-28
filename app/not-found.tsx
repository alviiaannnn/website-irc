import { ButtonLink, Eyebrow, Ring } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="grid flex-1 lg:grid-cols-2">
      <div className="flex items-center px-4 py-24 md:px-6 lg:justify-end lg:pr-12">
        <div className="max-w-md">
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-navy-900">Page not found.</h1>
          <p className="mt-4 text-lg text-navy-600">This page has flown off course.</p>
          <div className="mt-8"><ButtonLink href="/">Back to home</ButtonLink></div>
        </div>
      </div>
      <div className="relative min-h-60 overflow-hidden bg-secondary">
        <Ring className="-top-28 -right-28 w-[26rem] border-[56px]" />
      </div>
    </section>
  )
}
