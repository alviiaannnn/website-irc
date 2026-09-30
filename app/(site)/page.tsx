import {
  Block,
  ButtonLink,
  Container,
  Eyebrow,
  Img,
  Markdown,
  NavyPanel,
  NewsList,
  ProjectCard,
  ResearchTeamCard,
  ResultRows,
  Ring,
  Rows,
  SectionHeading,
  SponsorLogoGrid,
  StepPills,
} from '@/components/ui'
import { getCompetitions, getEntries, getNews, getProjects, getSections, getSponsors, getTeams, isPodium } from '@/lib/data'

export default async function Home() {
  const [s, teams, projects, entries, competitions, news, sponsors] = await Promise.all([
    getSections('home'),
    getTeams(),
    getProjects(),
    getEntries(),
    getCompetitions(),
    getNews(),
    getSponsors(),
  ])
  const hero = s.hero
  const featured = projects.filter((p) => p.is_featured).slice(0, 3)
  // Podium finishes first, then other ranked results; newest first within each.
  const results = [...entries.filter((e) => isPodium(e.result)), ...entries.filter((e) => e.result && !isPodium(e.result))].slice(0, 6)
  const stats = [
    { title: 'Competing since', value: entries.length ? Math.min(...entries.map((e) => e.year)) : '—' },
    { title: 'Competitions entered', value: new Set(entries.map((e) => e.event)).size },
    { title: 'Podium finishes', value: entries.filter((e) => isPodium(e.result)).length },
    { title: 'Robotics projects', value: projects.length },
  ]

  return (
    <>
      <section className="grid pt-16 md:pt-18 lg:min-h-svh lg:grid-cols-2">
        <div className="flex items-center">
          <div className="fade-up w-full px-4 py-16 md:px-6 lg:ml-auto lg:max-w-[600px] lg:py-24 lg:pr-12">
            <Eyebrow>IPB Robotic Club</Eyebrow>
            <h1 className="mt-5 text-5xl leading-[1.05] font-semibold tracking-[-0.05em] text-balance text-navy-900 md:text-6xl">{hero?.title}</h1>
            <Markdown text={hero?.body} className="mt-6 text-lg leading-relaxed text-navy-600" />
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/support">Individual Support</ButtonLink>
              <ButtonLink href={hero?.cta_href ?? '/contact?topic=sponsorship'} variant="outline">{hero?.cta_label ?? 'Become a Sponsor'}</ButtonLink>
            </div>
            <p className="mt-14 text-xs text-navy-600">Competing at {competitions.map((c) => c.short_name ?? c.name).join(' · ')}</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-secondary">
          <Ring className="-top-24 -right-24 w-[24rem] border-[44px] md:-top-32 md:-right-32 md:w-[34rem] md:border-[64px]" />
          <div className="relative flex h-full flex-col justify-end gap-12 px-4 py-16 md:px-6 lg:max-w-[600px] lg:py-24 lg:pl-12">
            <StepPills items={teams.map((t) => ({ label: t.name, href: `/research#${t.slug}` }))} />
            <Rows dark items={stats.map((st) => ({ key: st.title, title: st.title, detail: <span className="font-mono text-base text-white">{st.value}</span> }))} />
          </div>
        </div>
      </section>

      <section aria-label="Team photo" className="pt-20 md:pt-28">
        <Container>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface md:aspect-[21/9]">
            <Img media={hero?.media ?? null} fallback="IPB Robotic Club" sizes="(min-width: 1200px) 1152px, 100vw" />
          </div>
          {hero?.media && <p className="mt-3 text-sm text-navy-600">{hero.media.alt}</p>}
        </Container>
      </section>

      <Block section={s.research} eyebrow="Research" link={{ href: '/research#teams', label: 'All research teams' }}>
        <div className="cards grid gap-6 md:grid-cols-3">
          {teams.map((t) => <ResearchTeamCard key={t.id} team={t} />)}
        </div>
      </Block>

      <Block section={s.projects} eyebrow="Projects" link={{ href: '/research#projects', label: 'All projects' }} className="pt-0 md:pt-0">
        <div className="cards grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </Block>

      <section className="pb-20 md:pb-28">
        <Container>
          <NavyPanel>
            <SectionHeading section={s.achievements} eyebrow="Results" dark />
            <div className="mt-10"><ResultRows entries={results} dark /></div>
            <div className="mt-8"><ButtonLink href="/research#competitions" variant="light">All competitions</ButtonLink></div>
          </NavyPanel>
        </Container>
      </section>

      {news.length > 0 && (
        <Block section={s.news} eyebrow="Coverage" link={{ href: '/gallery-news#news', label: 'All coverage' }} className="pt-0 md:pt-0">
          <NewsList news={news.slice(0, 3)} />
        </Block>
      )}

      <Block section={s.sponsors} eyebrow="Sponsors" link={{ href: '/sponsors', label: 'Become a sponsor' }} className="pt-0 md:pt-0">
        <SponsorLogoGrid sponsors={sponsors} />
      </Block>

      <section className="pb-20 md:pb-28">
        <Container>
          <NavyPanel>
            <SectionHeading section={s.cta} dark />
            {s.cta?.cta_href && <div className="mt-8"><ButtonLink href={s.cta.cta_href}>{s.cta.cta_label}</ButtonLink></div>}
          </NavyPanel>
        </Container>
      </section>
    </>
  )
}
