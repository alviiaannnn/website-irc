import type { Metadata } from 'next'
import { Block, Container, Img, Markdown, NavyPanel, PageHeader, SectionHeading, StepPills, Tags, leadText, listItems } from '@/components/ui'
import { getSections } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About',
  description: 'About IPB Robotic Club: core values, organizational structure, and the Official and Technical Departments.',
}

const index = [
  { label: 'About IRC', href: '#story' },
  { label: 'Core values', href: '#values' },
  { label: 'Structure', href: '#structure' },
  { label: 'Official Department', href: '#official' },
  { label: 'Technical Department', href: '#technical' },
]

export default async function About() {
  const s = await getSections('about')
  const items = (key: string) => listItems(s[key]?.body).map((n) => n.text)
  return (
    <>
      <PageHeader eyebrow="About" title={s.intro?.title} aside={<StepPills items={index} />} />

      <section id="story" className="py-20 md:py-28">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <Markdown text={s.intro?.body} className="text-lg leading-relaxed text-navy-600" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
            <Img media={s.intro?.media ?? null} fallback="IPB Robotic Club" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Container>
      </section>

      <section id="values" className="pb-20 md:pb-28">
        <Container>
          <NavyPanel>
            <SectionHeading section={{ ...s.values!, body: null }} eyebrow="Values" dark />
            <div className="mt-10"><StepPills items={items('values').map((label) => ({ label }))} /></div>
          </NavyPanel>
        </Container>
      </section>

      <Block id="structure" section={{ ...s.structure!, body: null }} eyebrow="Structure" className="pt-0 md:pt-0">
        <Markdown text={s.structure?.body} className="md-tree rounded-2xl border border-navy-200/70 p-6 text-navy-600 md:p-10" />
      </Block>

      <Block id="official" section={s.official} eyebrow="Department" className="pt-0 md:pt-0">
        <ul className="border-t border-navy-200/70">
          {(['hrd', 'mnb', 'fund'] as const).map((k) => (
            <li key={k} className="grid gap-4 border-b border-navy-200/70 py-6 md:grid-cols-[1fr_1.3fr] md:items-center">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-navy-900">{s[k]?.title}</h3>
                <Markdown text={leadText(s[k]?.body)} className="mt-1 text-navy-600" />
              </div>
              <Tags items={items(k)} />
            </li>
          ))}
        </ul>
      </Block>

      <Block id="technical" section={s.technical} eyebrow="Department" className="pt-0 md:pt-0">
        <div className="space-y-16">
          {(['mechanical', 'electrical', 'software'] as const).map((k, i) => (
            <article key={k} className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className={`relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface ${i % 2 ? 'md:order-2' : ''}`}>
                <Img media={s[k]?.media ?? null} fallback={s[k]?.title ?? k} sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <div>
                <p className="font-mono text-xs text-navy-600">Division 0{i + 1}</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-navy-900">{s[k]?.title}</h3>
                <Markdown text={leadText(s[k]?.body)} className="mt-4 leading-relaxed text-navy-600" />
                <div className="mt-6"><Tags items={items(k)} /></div>
              </div>
            </article>
          ))}
        </div>
      </Block>
    </>
  )
}
