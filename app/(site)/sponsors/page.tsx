import type { Metadata } from 'next'
import { Block, Buttons, Container, NavyPanel, PageHeader, pillsFrom, SectionHeading, StepPills, SponsorLogoGrid } from '@/components/ui'
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
        eyebrow={s.intro?.eyebrow}
        title={s.intro?.title}
        body={s.intro?.body}
        aside={<StepPills items={pillsFrom(s.intro, { sponsors: sponsors.length })} />}
      />
      <Block id="logos">
        <SponsorLogoGrid sponsors={sponsors} />
      </Block>
      <section id="why" className="pb-20 md:pb-28">
        <Container>
          <NavyPanel>
            <SectionHeading section={s.why} dark />
          </NavyPanel>
        </Container>
      </section>
      <section className="pb-20 md:pb-28">
        <Container className="flex flex-col gap-8 border-t border-navy-200/70 pt-16 md:flex-row md:items-end md:justify-between">
          <SectionHeading section={s.cta} />
          <Buttons items={s.cta?.buttons} className="shrink-0" />
        </Container>
      </section>
    </>
  )
}
