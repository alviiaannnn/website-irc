import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GalleryGrid } from '@/components/gallery'
import { Block, Buttons, Container, heading, Markdown, PageHeader, Tags } from '@/components/ui'
import { getProject, getProjects, getSections } from '@/lib/data'
import { labels } from '@/lib/text'

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/research/projects/[slug]'>): Promise<Metadata> {
  const p = await getProject((await params).slug)
  return p ? { title: p.name, description: p.subtitle ?? undefined } : {}
}

export default async function ProjectPage({ params }: PageProps<'/research/projects/[slug]'>) {
  const [p, site] = await Promise.all([getProject((await params).slug), getSections('site')])
  if (!p) notFound()
  // Admin → Menu & footer → "Labels on every project page".
  const [back, teamLabel, yearLabel, related, photos, noTeam] = labels(site['project-page']?.body, ['All projects', 'Research team', 'Year', 'Related competitions', 'Photos', 'Project'] as const)
  return (
    <>
      <PageHeader
        back={{ href: '/research#projects', label: back }}
        eyebrow={[p.team?.name ?? noTeam, p.year].filter(Boolean).join(' · ')}
        title={p.name}
        body={p.subtitle}
        media={{ value: p.cover, fallback: p.name }}
      />

      <section className="py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Markdown text={p.description} className="text-lg leading-relaxed text-navy-600" />
          <aside className="space-y-6">
            <dl className="divide-y divide-navy-200/70 border-y border-navy-200/70">
              {p.team && (
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-navy-600">{teamLabel}</dt>
                  <dd><Link href={`/research#${p.team.slug}`} className="font-semibold text-navy-900 hover:underline">{p.team.name}</Link></dd>
                </div>
              )}
              {p.year && (
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-navy-600">{yearLabel}</dt>
                  <dd className="font-mono text-navy-900">{p.year}</dd>
                </div>
              )}
            </dl>
            {p.team && p.team.target_competitions.length > 0 && (
              <div>
                <p className="font-mono text-xs text-navy-600">{related}</p>
                <div className="mt-3"><Tags items={p.team.target_competitions} /></div>
              </div>
            )}
            <Buttons items={site['project-page']?.buttons} />
          </aside>
        </Container>
      </section>

      {p.gallery.length > 0 && (
        <Block section={heading(photos)} className="pt-0 md:pt-0">
          <GalleryGrid filter={false} items={p.gallery.map((g) => ({ id: g.media.id, caption: null, album: 'project', media: g.media }))} />
        </Block>
      )}
    </>
  )
}
