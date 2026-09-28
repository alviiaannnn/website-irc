import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GalleryGrid } from '@/components/gallery'
import { Block, ButtonLink, Container, Markdown, PageHeader, Tags } from '@/components/ui'
import { getProject, getProjects } from '@/lib/data'

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/research/projects/[slug]'>): Promise<Metadata> {
  const p = await getProject((await params).slug)
  return p ? { title: p.name, description: p.subtitle ?? undefined } : {}
}

export default async function ProjectPage({ params }: PageProps<'/research/projects/[slug]'>) {
  const p = await getProject((await params).slug)
  if (!p) notFound()
  return (
    <>
      <PageHeader
        back={{ href: '/research#projects', label: 'All projects' }}
        eyebrow={[p.team?.name ?? 'Project', p.year].filter(Boolean).join(' · ')}
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
                  <dt className="text-navy-600">Research team</dt>
                  <dd><Link href={`/research#${p.team.slug}`} className="font-semibold text-navy-900 hover:underline">{p.team.name}</Link></dd>
                </div>
              )}
              {p.year && (
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-navy-600">Year</dt>
                  <dd className="font-mono text-navy-900">{p.year}</dd>
                </div>
              )}
            </dl>
            {p.team && p.team.target_competitions.length > 0 && (
              <div>
                <p className="font-mono text-xs text-navy-600">Related competitions</p>
                <div className="mt-3"><Tags items={p.team.target_competitions} /></div>
              </div>
            )}
            <ButtonLink href="/contact?topic=collaboration" variant="navy">Collaborate with us</ButtonLink>
          </aside>
        </Container>
      </section>

      {p.gallery.length > 0 && (
        <Block section={{ key: 'photos', title: 'Photos', body: null, cta_label: null, cta_href: null, media: null }} className="pt-0 md:pt-0">
          <GalleryGrid filter={false} items={p.gallery.map((g) => ({ id: g.media.id, caption: null, album: 'project', media: g.media }))} />
        </Block>
      )}
    </>
  )
}
