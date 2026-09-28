import type { Metadata } from 'next'
import { Block, ButtonLink, Container, Markdown, NavyPanel, PageHeader, SectionHeading, StepPills, SponsorLogoGrid, listItems } from '@/components/ui'
import { getSections, getSponsors, getSupporters } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Sponsors',
  description: 'Past sponsors and supporting institutions of IPB Robotic Club, and how to support our next competitions.',
}

export default async function Sponsors() {
  const [s, sponsors, supporters] = await Promise.all([getSections('sponsors'), getSponsors(), getSupporters()])
  const tiers = ['tier-1', 'tier-2', 'tier-3'].flatMap((k) => s[k] ?? [])
  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title={s.intro?.title}
        body={s.intro?.body}
        aside={
          <StepPills
            items={[
              { label: `${sponsors.length} partners`, href: '#logos' },
              { label: 'Why support IRC', href: '#why' },
              { label: 'Become a sponsor', href: '/contact?topic=sponsorship' },
              { label: 'Support as an individual', href: '#support' },
            ]}
          />
        }
      />
      <Block id="logos">
        <SponsorLogoGrid sponsors={sponsors} />
      </Block>
      <section id="why" className="pb-20 md:pb-28">
        <Container>
          <NavyPanel>
            <SectionHeading section={s.why} eyebrow="Why support us" dark />
          </NavyPanel>
        </Container>
      </section>
      <section className="pb-20 md:pb-28">
        <Container className="flex flex-col gap-8 border-t border-navy-200/70 pt-16 md:flex-row md:items-end md:justify-between">
          <SectionHeading section={s.cta} />
          {s.cta?.cta_href && <div className="shrink-0"><ButtonLink href={s.cta.cta_href}>{s.cta.cta_label}</ButtonLink></div>}
        </Container>
      </section>

      <section id="support" className="pb-20 md:pb-28">
        <Container className="border-t border-navy-200/70 pt-16">
          <SectionHeading section={s.support} eyebrow="Individual support" />
          <div className="cards mt-12 grid gap-6 md:grid-cols-3">
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
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">{s.pledge?.title}</h3>
              <Markdown text={s.pledge?.body} className="mt-3 leading-relaxed text-navy-600" />
            </div>
            {/* Google Form link, editable in Admin → Page text → Sponsors · pledge. */}
            {s.pledge?.cta_href && <div className="shrink-0"><ButtonLink href={s.pledge.cta_href}>{s.pledge.cta_label ?? 'Support IRC'}</ButtonLink></div>}
          </div>

          {supporters.length > 0 && (
            <div className="mt-20 text-center">
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Special thanks to</h3>
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
