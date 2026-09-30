import type { MetadataRoute } from 'next'
import { getCompetitions, getProjects } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const [projects, competitions] = await Promise.all([getProjects(), getCompetitions()])
  return [
    ...['', '/about', '/research', '/gallery-news', '/teams', '/sponsors', '/support', '/contact'].map((p) => ({ url: `${site}${p}` })),
    ...projects.map((p) => ({ url: `${site}/research/projects/${p.slug}` })),
    ...competitions.map((c) => ({ url: `${site}/research/competitions/${c.slug}` })),
  ]
}
