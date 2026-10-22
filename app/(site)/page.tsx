import {
  Block,
  Buttons,
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
  SectionHeading,
  SponsorLogoGrid,
  StepPills,
} from '@/components/ui'
import { getEntries, getNews, getProjects, getSections, getSponsors, getTeams, isPodium } from '@/lib/data'
import { fill, pairs } from '@/lib/text'

export default async function Home() {
  const [s, teams, projects, entries, news, sponsors] = await Promise.all([
    getSections('home'),
    getTeams(),
    getProjects(),
    getEntries(),
    getNews(),
    getSponsors(),
  ])
  const hero = s.hero
  const featured = projects.filter((p) => p.is_featured).slice(0, 3)
  // Podium finishes first, then other ranked results; newest first within each.
  const results = [...entries.filter((e) => isPodium(e.result)), ...entries.filter((e) => e.result && !isPodium(e.result))].slice(0, 6)
  // Admin → Home → "Numbers on the team photo": "- Label: value", where {since} etc. are counted here.
  const counts = {
    since: entries.length ? Math.min(...entries.map((e) => e.year)) : '—',
    competitions: new Set(entries.map((e) => e.event)).size,
    podiums: entries.filter((e) => isPodium(e.result)).length,
    projects: projects.length,
  }
  const stats = pairs(s.stats?.body).map((p) => ({ ...p, value: fill(p.value, counts) }))

  return (
    <>
      <section className="grid pt-16 md:pt-18 lg:min-h-svh lg:grid-cols-2">
        <div className="flex items-center">
          <div className="fade-up w-full px-4 py-16 md:px-6 lg:ml-auto lg:max-w-[600px] lg:py-24 lg:pr-12">
            <Eyebrow>{hero?.eyebrow}</Eyebrow>
            <h1 className="mt-5 text-5xl leading-[1.05] font-semibold tracking-[-0.05em] text-balance text-navy-900 md:text-6xl">{hero?.title}</h1>
            <Markdown text={hero?.body} className="mt-6 text-lg leading-relaxed text-navy-600" />
            <Buttons items={hero?.buttons} className="mt-10" />
            {s['hero-note']?.body && <p className="mt-14 text-xs text-navy-600">{s['hero-note'].body}</p>}
          </div>
        </div>
        {/* Team photo under a navy wash, with the ring, the teams and the numbers on top. */}
        <div className="relative min-h-[34rem] overflow-hidden bg-navy-900">
          {hero?.media && <Img media={hero.media} fallback="IPB Robotic Club" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-60" preload />}
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/70 to-secondary/40" />
          <div aria-hidden className="bg-grid-dark absolute inset-0" />
          <Ring className="-top-24 -right-24 w-[24rem] border-[44px] md:-top-32 md:-right-32 md:w-[34rem] md:border-[64px]" />
          <div className="relative flex h-full flex-col justify-end gap-10 px-4 py-16 md:px-6 lg:max-w-[600px] lg:py-24 lg:pl-12">
            <StepPills items={teams.map((t) => ({ label: t.name, href: `/research#${t.slug}` }))} />
            {stats.length > 0 && (
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 backdrop-blur-sm">
                {stats.map((st) => (
                  <div key={st.label} className="bg-navy-900/60 p-5">
                    <dt className="text-xs font-medium tracking-wide text-navy-200 uppercase">{st.label}</dt>
                    <dd className="mt-2 font-mono text-3xl font-semibold tracking-tight text-white md:text-4xl">{st.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {s['hero-caption']?.body && <p className="text-xs text-navy-200">{s['hero-caption'].body}</p>}
          </div>
        </div>
      </section>

      <Block section={s.research}>
        <div className="cards grid gap-6 md:grid-cols-3">
          {teams.map((t) => <ResearchTeamCard key={t.id} team={t} />)}
        </div>
      </Block>

      <Block section={s.projects} tone="surface">
        <div className="cards grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </Block>

      <section className="py-20 md:py-28">
        <Container>
          <NavyPanel>
            <SectionHeading section={s.achievements} dark />
            <div className="mt-10"><ResultRows entries={results} dark /></div>
            <Buttons items={s.achievements?.buttons} dark quiet className="mt-8" />
          </NavyPanel>
        </Container>
      </section>

      {news.length > 0 && (
        <Block section={s.news} tone="surface">
          <NewsList news={news.slice(0, 3)} />
        </Block>
      )}

      <Block section={s.sponsors}>
        <SponsorLogoGrid sponsors={sponsors} />
      </Block>

      <section className="pb-20 md:pb-28">
        <Container>
          <NavyPanel>
            <SectionHeading section={s.cta} dark />
            <Buttons items={s.cta?.buttons} dark className="mt-8" />
          </NavyPanel>
        </Container>
      </section>
    </>
  )
}
