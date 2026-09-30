import type { Metadata } from 'next'
import { ButtonLink, Container, Markdown, PageHeader, StepPills, listItems } from '@/components/ui'
import { getSections, getSupporters } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Individual Support',
  description: 'Support IPB Robotic Club as an individual on our road to SAFMC 2027: contribution tiers, benefits, and our supporters.',
}

// Content lives in Page text → sponsors (support, tier-1..3, pledge).
export default async function Support() {
  const [s, supporters] = await Promise.all([getSections('sponsors'), getSupporters()])
  const tiers = ['tier-1', 'tier-2', 'tier-3'].flatMap((k) => s[k] ?? [])
  return (
    <>
      <PageHeader
        eyebrow="Individual support"
        title={s.support?.title}
        body={s.support?.body}
        aside={
          <StepPills
            items={[
              ...tiers.map((t) => ({ label: `From ${t.title}`, href: '#tiers' })),
              ...(s.pledge?.cta_href ? [{ label: s.pledge.cta_label ?? 'Support IRC', href: s.pledge.cta_href }] : []),
            ]}
          />
        }
      />

      <section id="tiers" className="py-20 md:py-28">
        <Container>
          <div className="cards grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <article key={t.key} className="flex flex-col rounded-2xl border border-navy-200/70 bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary-ink uppercase">Starting from</p>
                <p className="mt-2 font-mono text-3xl tracking-tight text-navy-900">{t.title}</p>
                <ul className="mt-6 divide-y divide-navy-200/70 border-t border-navy-200/70 text-sm text-navy-600">
                  {listItems(t.body).map((b) => <li key={b.text} className="py-3">{b.text}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">{s.pledge?.title}</h2>
              <Markdown text={s.pledge?.body} className="mt-3 leading-relaxed text-navy-600" />
            </div>
            {/* Google Form link, editable in Admin → Page text → Sponsors · pledge. */}
            {s.pledge?.cta_href && <div className="shrink-0"><ButtonLink href={s.pledge.cta_href}>{s.pledge.cta_label ?? 'Support IRC'}</ButtonLink></div>}
          </div>

          {supporters.length > 0 && (
            <div id="thanks" className="mt-20 text-center">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Special thanks to</h2>
              <ul className="mt-8 flex flex-wrap justify-center gap-3">
                {supporters.map((p) => (
                  <li key={p.id}>
                    {p.instagram ? (
                      <a href={`https://www.instagram.com/${p.instagram}/`} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl bg-secondary px-5 py-3 font-medium text-white hover:bg-navy-900">
                        @{p.instagram}
                      </a>
                    ) : (
                      <span className="inline-block rounded-xl bg-secondary px-5 py-3 font-medium text-white">{p.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
