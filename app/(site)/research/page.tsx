import type { Metadata } from 'next'
import { ProjectGrid } from '@/components/project-grid'
import { Block, CompetitionCard, Img, Markdown, PageHeader, pillsFrom, SectionHeading, StepPills, Tags, Timeline } from '@/components/ui'
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

  return (
    <>
      <PageHeader eyebrow={s.intro?.eyebrow} title={s.intro?.title} body={s.intro?.body} aside={<StepPills items={pillsFrom(s.intro)} />} />

      <section id="teams" className="py-20 md:py-28">
        <div className="space-y-24">
          {groups.map((g) => (
            <div key={g} className="mx-auto max-w-[1200px] px-4 md:px-6">
              <SectionHeading section={s[g.toLowerCase()]} />
              <div className="cards mt-12 grid gap-6 lg:grid-cols-2">
                {teams.filter((t) => t.group_name === g).map((t) => (
                  <article key={t.id} id={t.slug} className="reveal group scroll-mt-24 overflow-hidden rounded-2xl border border-navy-200/70 bg-white shadow-sm shadow-navy-900/5 transition duration-300 hover:shadow-xl hover:shadow-navy-900/10">
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                      <Img media={t.cover} fallback={t.name} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.04]" />
                      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-navy-900/70 via-transparent to-transparent" />
                      <h3 className="absolute inset-x-6 bottom-5 text-2xl font-semibold tracking-[-0.03em] text-white md:inset-x-8">{t.name}</h3>
                    </div>
                    <div className="p-6 md:p-8">
                      {t.tagline && <p className="font-medium text-primary-ink italic">{t.tagline}</p>}
                      <Markdown text={t.description} className="mt-3 leading-relaxed text-navy-600" />
                      {t.target_competitions.length > 0 && (
                        <div className="mt-6 border-t border-navy-200/70 pt-5">
                          {s['team-label']?.title && <p className="font-mono text-xs text-navy-600">{s['team-label'].title}</p>}
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
              <div className="bg-grid rounded-2xl border border-dashed border-navy-400 bg-surface p-8 text-center md:p-12">
                <p className="text-xl font-semibold tracking-tight text-navy-900">{s['coming-soon'].title}</p>
                <Markdown text={s['coming-soon'].body} className="mt-2 text-navy-600" />
              </div>
            </div>
          )}
        </div>
      </section>

      <Block id="projects" section={s.projects} tone="surface">
        <ProjectGrid projects={projects} teams={teams.map(({ id, name }) => ({ id, name }))} />
      </Block>

      <Block id="competitions" section={s.competitions}>
        <div className="cards grid gap-6 md:grid-cols-2">
          {competitions.map((c) => (
            <CompetitionCard
              key={c.id}
              competition={c}
              entries={entries.filter((e) => e.competition.slug === c.slug)}
              cover={gallery.find((g) => g.competition?.slug === c.slug)?.media ?? null}
            />
          ))}
        </div>
        <h3 className="mt-20 mb-6 text-2xl font-semibold tracking-[-0.03em] text-navy-900">{s.timeline?.title}</h3>
        <Timeline entries={entries} participant={s.timeline?.body ?? undefined} />
      </Block>
    </>
  )
}
