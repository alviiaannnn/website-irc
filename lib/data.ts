import { publicDb as db, serviceDb } from './supabase'

export type Media = { id: string; path: string; alt: string; width: number | null; height: number | null }
const M = 'id,path,alt,width,height'

async function q<T>(p: PromiseLike<{ data: unknown; error: unknown }>): Promise<T> {
  const { data, error } = await p
  if (error) throw error
  return data as T
}

export type Settings = {
  org_name: string
  tagline: string | null
  description: string | null
  email: string | null
  phone: string | null
  address: string | null
  socials: { instagram?: string; linkedin?: string }
  og: Media | null
}
export const getSettings = () =>
  q<Settings>(db.from('site_settings').select(`*, og:media!og_media_id(${M})`).limit(1).single())

export type Section = {
  key: string
  title: string | null
  body: string | null
  cta_label: string | null
  cta_href: string | null
  media: Media | null
}
export async function getSections(page: string): Promise<Partial<Record<string, Section>>> {
  const rows = await q<Section[]>(
    db.from('page_sections').select(`key,title,body,cta_label,cta_href,media:media!media_id(${M})`).eq('page', page),
  )
  return Object.fromEntries(rows.map((r) => [r.key, r]))
}

export type Team = {
  id: string
  slug: string
  group_name: string
  name: string
  tagline: string | null
  description: string | null
  target_competitions: string[]
  cover: Media | null
  logo: Media | null
}
export const getTeams = () =>
  q<Team[]>(
    db.from('research_teams').select(`*, cover:media!cover_media_id(${M}), logo:media!logo_media_id(${M})`).order('sort_order'),
  )

export type Project = {
  id: string
  slug: string
  name: string
  subtitle: string | null
  description: string | null
  year: number | null
  is_featured: boolean
  cover: Media | null
  team: Pick<Team, 'id' | 'slug' | 'name' | 'target_competitions'> | null
}
const P = `*, cover:media!cover_media_id(${M}), team:research_teams(id,slug,name,target_competitions)`
export const getProjects = () => q<Project[]>(db.from('projects').select(P).order('sort_order'))

export async function getProject(slug: string) {
  const p = await q<(Project & { gallery: { sort_order: number; media: Media }[] }) | null>(
    db.from('projects').select(`${P}, gallery:project_media(sort_order, media(${M}))`).eq('slug', slug).maybeSingle(),
  )
  p?.gallery.sort((a, b) => a.sort_order - b.sort_order)
  return p
}

export type Entry = {
  id: string
  event: string
  year: number
  category: string | null
  result: string | null
  sort_order: number
  competition: { slug: string; name: string; short_name: string | null }
}
export const getEntries = () =>
  q<Entry[]>(
    db
      .from('competition_entries')
      .select('*, competition:competitions(slug,name,short_name)')
      .order('year', { ascending: false })
      .order('sort_order'),
  )

export type Competition = {
  id: string
  slug: string
  name: string
  short_name: string | null
  organizer: string | null
  description: string | null
  journey: string | null
  logo: Media | null
}
const C = `*, logo:media!logo_media_id(${M})`
export const getCompetitions = () => q<Competition[]>(db.from('competitions').select(C).order('sort_order'))
export const getCompetition = (slug: string) =>
  q<Competition | null>(db.from('competitions').select(C).eq('slug', slug).maybeSingle())

export type GalleryItem = {
  id: string
  caption: string | null
  album: string
  taken_on: string | null
  media: Media
  competition: { slug: string; short_name: string | null } | null
}
export const getGallery = () =>
  q<GalleryItem[]>(
    db.from('gallery_items').select(`*, media(${M}), competition:competitions(slug,short_name)`).order('sort_order'),
  )

export type News = {
  id: string
  title: string
  outlet: string | null
  url: string
  published_on: string | null
  summary: string | null
  thumbnail: Media | null
}
export const getNews = () =>
  q<News[]>(
    db
      .from('news_links')
      .select(`*, thumbnail:media!thumbnail_media_id(${M})`)
      .order('published_on', { ascending: false, nullsFirst: false }),
  )

export type Person = {
  id: string
  name: string
  group: 'committee' | 'supervisor' | 'advisor' | 'pic'
  role_title: string | null
  program: string | null
  tags: string[]
  highlights: string[]
  photo: Media | null
}
export const getPeople = () =>
  q<Person[]>(db.from('people').select(`*, photo:media!photo_media_id(${M})`).order('sort_order'))

export type Sponsor = { id: string; name: string; url: string | null; logo: Media | null }
export const getSponsors = () =>
  q<Sponsor[]>(db.from('sponsors').select(`*, logo:media!logo_media_id(${M})`).order('sort_order'))

export const isPodium = (result: string | null) => !!result && /^(1st|2nd|3rd)\b/i.test(result)

export type Tier = 'green' | 'gold' | 'platinum'
export const tierFor = (amount: number): Tier => (amount >= 800000 ? 'platinum' : amount >= 400000 ? 'gold' : 'green')
export type Supporter = { id: string; name: string; instagram: string | null; tier: Tier }
// Amounts are private (visitors are not granted the column), so read them server-side and hand out only the tier.
export async function getSupporters(): Promise<Supporter[]> {
  const rows = await q<{ id: string; name: string; instagram: string | null; amount: number }[]>(
    serviceDb().from('supporters').select('id,name,instagram,amount').eq('is_published', true).order('sort_order').order('created_at'),
  )
  return rows.map(({ amount, ...r }) => ({ ...r, tier: tierFor(amount) }))
}
