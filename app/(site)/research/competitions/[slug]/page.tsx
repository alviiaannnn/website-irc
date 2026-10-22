import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GalleryGrid } from '@/components/gallery'
import { Block, Container, heading, Markdown, PageHeader, ResultRows, Timeline } from '@/components/ui'
import { getCompetition, getCompetitions, getEntries, getGallery, getSections } from '@/lib/data'
import { labels } from '@/lib/text'

export async function generateStaticParams() {
  return (await getCompetitions()).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<'/research/competitions/[slug]'>): Promise<Metadata> {
  const c = await getCompetition((await params).slug)
  return c ? { title: c.short_name ?? c.name, description: `IPB Robotic Club at ${c.name}: our journey and results.` } : {}
}

export default async function CompetitionPage({ params }: PageProps<'/research/competitions/[slug]'>) {
  const { slug } = await params
  const [c, allEntries, gallery, site, research] = await Promise.all([getCompetition(slug), getEntries(), getGallery(), getSections('site'), getSections('research')])
  if (!c) notFound()
  // Admin → Menu & footer → "Labels on every competition page".
  const [back, achievements, about, journey, participation, photosLabel, organizedBy] = labels(site['competition-page']?.body, [
    'All competitions', 'Achievements', 'About the competition', 'Our journey', 'Participation', 'Photos', 'Organized by',
  ] as const)
  const entries = allEntries.filter((e) => e.competition.slug === slug)
  const photos = gallery.filter((g) => g.competition?.slug === slug)
  const results = entries.filter((e) => e.result)

  return (
    <>
      <PageHeader
        back={{ href: '/research#competitions', label: back }}
        eyebrow={c.short_name ?? 'Competition'}
        title={c.name}
        body={c.organizer && `${organizedBy} ${c.organizer}.`}
        aside={
          results.length > 0 ? (
            <div className="w-full">
              <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-navy-200 uppercase">{achievements}</p>
              <ResultRows entries={results} dark />
            </div>
          ) : (
            <p className="font-mono text-sm text-navy-200">{[...new Set(entries.map((e) => e.year))].sort().join(' · ')}</p>
          )
        }
      />

      {(c.description || c.journey) && (
        <section className="py-20 md:py-28">
          <Container className="grid gap-12 lg:grid-cols-2">
            {c.description && (
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">{about}</h2>
                <Markdown text={c.description} className="mt-5 leading-relaxed text-navy-600" />
              </div>
            )}
            {c.journey && (
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">{journey}</h2>
                <Markdown text={c.journey} className="mt-5 leading-relaxed text-navy-600" />
              </div>
            )}
          </Container>
        </section>
      )}

      {entries.length > 0 && (
        <Block section={heading(participation)} className="pt-0 md:pt-0">
          <Timeline entries={entries} participant={research.timeline?.body ?? undefined} />
        </Block>
      )}

      {photos.length > 0 && (
        <Block section={heading(photosLabel)} className="pt-0 md:pt-0">
          <GalleryGrid filter={false} items={photos} />
        </Block>
      )}
    </>
  )
}
