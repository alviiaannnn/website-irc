import type { Metadata } from 'next'
import { Block, PageHeader, PersonCard, StepPills } from '@/components/ui'
import { getPeople, getSections } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Teams',
  description: 'The IPB Robotic Club committee 2026, supervisors, research advisor, and persons in charge.',
}

const groups = ['committee', 'supervisor', 'advisor', 'pic'] as const

export default async function Teams() {
  const [s, people] = await Promise.all([getSections('teams'), getPeople()])
  const present = groups.filter((g) => people.some((p) => p.group === g))
  return (
    <>
      <PageHeader
        eyebrow={s.intro?.eyebrow}
        title={s.intro?.title}
        body={s.intro?.body}
        aside={<StepPills items={present.map((g) => ({ label: s[g]?.title ?? g, href: `#${g}` }))} />}
      />
      {present.map((g, i) => (
        <Block key={g} id={g} section={s[g]} tone={i % 2 ? 'surface' : undefined}>
          <div className="cards grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {people.filter((p) => p.group === g).map((p) => <PersonCard key={p.id} person={p} highlights={s['highlights-label']?.title ?? undefined} />)}
          </div>
        </Block>
      ))}
    </>
  )
}
