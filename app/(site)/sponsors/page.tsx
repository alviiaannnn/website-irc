import type { Metadata } from 'next'
import { Block, ButtonLink, Container, NavyPanel, PageHeader, SectionHeading, StepPills, SponsorLogoGrid } from '@/components/ui'
import { getSections, getSponsors } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Sponsors',
  description: 'Past sponsors and supporting institutions of IPB Robotic Club, and how to support our next competitions.',
}

export default async function Sponsors() {
  const [s, sponsors] = await Promise.all([getSections('sponsors'), getSponsors()])
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
              { label: 'Support as an individual', href: '/support' },
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
    </>
  )
}
