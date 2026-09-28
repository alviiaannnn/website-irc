import type { Metadata } from 'next'
import { ProjectGrid } from '@/components/project-grid'
import { Block, CompetitionCard, Img, Markdown, PageHeader, SectionHeading, StepPills, Tags, Timeline } from '@/components/ui'
import { getCompetitions, getEntries, getGallery, getProjects, getSections, getTeams } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Research',
  description: 'IRC research teams Agrisena (UAV) and Agrinaya (UGV), our robotics projects, and the competitions we have entered since 2021.',
}

export default async function Research() {
  const [s, teams, projects, competitions, entries, gallery] = await Promise.all([
    getSections('research'),
    getTeams(),
    getProjects(),
    getCompetitions(),
    getEntries(),
    getGallery(),
  ])
  const groups = [...new Set(teams.map((t) => t.group_name))]
  const index = [
    { label: 'Research Teams', href: '#teams' },
    { label: 'Projects', href: '#projects' },
    { label: 'Competitions', href: '#competitions' },
  ]

  return (
    <>
      <PageHeader eyebrow="Research" title={s.intro?.title} body={s.intro?.body} aside={<StepPills items={index} />} />

      <section id="teams" className="py-20 md:py-28">
        <div className="space-y-24">
          {groups.map((g) => (
            <div key={g} className="mx-auto max-w-[1200px] px-4 md:px-6">
              <SectionHeading section={s[g.toLowerCase()]} eyebrow="Research team" />
              <div className="mt-12 grid gap-6 lg:grid-cols-2">
                {teams.filter((t) => t.group_name === g).map((t) => (
                  <article key={t.id} id={t.slug} className="overflow-hidden rounded-2xl border border-navy-200/70 bg-white">
                    <div className="relative aspect-[16/9] bg-surface">
                      <Img media={t.cover} fallback={t.name} sizes="(min-width: 1024px) 50vw, 100vw" />
                    </div>
                    <div className="p-6 md:p-8">
                      {t.tagline && <p className="text-xs font-semibold tracking-[0.18em] text-primary-ink uppercase">{t.tagline}</p>}
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-navy-900">{t.name}</h3>
                      <Markdown text={t.description} className="mt-3 leading-relaxed text-navy-600" />
                      {t.target_competitions.length > 0 && (
                        <div className="mt-6 border-t border-navy-200/70 pt-5">
                          <p className="font-mono text-xs text-navy-600">Target competitions</p>
                          <div className="mt-3"><Tags items={t.target_competitions} /></div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
          {s['coming-soon'] && (
            <div className="mx-auto max-w-[1200px] px-4 md:px-6">
              <div className="rounded-2xl border border-dashed border-navy-400 p-8 text-center md:p-12">
                <p className="text-xl font-semibold tracking-tight text-navy-900">{s['coming-soon'].title}</p>
                <Markdown text={s['coming-soon'].body} className="mt-2 text-navy-600" />
              </div>
            </div>
          )}
        </div>
      </section>

      <Block id="projects" section={s.projects} eyebrow="Projects" className="pt-0 md:pt-0">
        <ProjectGrid projects={projects} teams={teams.map(({ id, name }) => ({ id, name }))} />
      </Block>

      <Block id="competitions" section={s.competitions} eyebrow="Competitions" className="pt-0 md:pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {competitions.map((c) => (
            <CompetitionCard
              key={c.id}
              competition={c}
              entries={entries.filter((e) => e.competition.slug === c.slug)}
              cover={gallery.find((g) => g.competition?.slug === c.slug)?.media ?? null}
            />
          ))}
        </div>
        <h3 className="mt-20 mb-6 text-2xl font-semibold tracking-[-0.03em] text-navy-900">Participation timeline</h3>
        <Timeline entries={entries} />
      </Block>
    </>
  )
}
