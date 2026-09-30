// Admin modules: one generic list/edit screen per content table, driven by this config.

// Shared admin class names. Kept here, not in the 'use client' file: server pages import them as strings.
export const inputCls = 'mt-1.5 block w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-normal text-ink focus:border-secondary'
export const btnCls = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-semibold text-white hover:bg-navy-900 disabled:opacity-50'
export const btnGhost = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-4 text-sm font-medium text-navy-900 hover:border-navy-600'

export type FieldType =
  | 'text' | 'textarea' | 'url' | 'email' | 'slug' | 'date' | 'number' | 'bool'
  | 'tags' | 'lines' | 'select' | 'ref' | 'media' | 'gallery'

export type Field = {
  name: string // column; "socials.instagram" writes into a jsonb column
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  ref?: { table: string; label: string }
  help?: string
}

type Row = Record<string, unknown>

export type Module = {
  table: string
  title: string
  hint: string
  label: string // column shown as the row title in lists
  meta?: string[] // columns shown under the title in lists (ref columns show the linked name)
  order: string[] // list order, "-col" = descending
  fields: Field[]
  view: (row: Row) => string // public page that shows this row
  create?: boolean
  singleton?: boolean
}

const md = 'Blank line = new paragraph. Start a line with "- " for a list. **bold**, [text](url).'
const order: Field = { name: 'sort_order', label: 'Order', type: 'number', help: 'Lower numbers show first.' }
const published: Field = { name: 'is_published', label: 'Show on the website', type: 'bool' }

export const modules: Record<string, Module> = {
  'page-sections': {
    table: 'page_sections', title: 'Page text', hint: 'Headings, paragraphs, buttons and photos on every public page.',
    label: 'title', order: ['page', 'key'], view: (r) => (r.page === 'home' ? '/' : `/${r.page}`),
    fields: [
      { name: 'title', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Text', type: 'textarea', help: md },
      { name: 'media_id', label: 'Photo', type: 'media' },
      { name: 'cta_label', label: 'Button label', type: 'text' },
      { name: 'cta_href', label: 'Button link', type: 'url', help: 'e.g. /contact?topic=sponsorship' },
    ],
  },
  'research-teams': {
    table: 'research_teams', title: 'Research teams', hint: 'Agrisena and Agrinaya teams on Home and Research.',
    label: 'name', meta: ['group_name', 'tagline'], order: ['sort_order'], create: true, view: (r) => `/research#${r.slug}`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'URL name', type: 'slug', required: true, help: 'Lowercase letters, numbers and dashes.' },
      { name: 'group_name', label: 'Group', type: 'text', required: true, help: 'Agrisena or Agrinaya. The group story lives in Page text → research.' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', help: md },
      { name: 'target_competitions', label: 'Target competitions', type: 'lines', help: 'One per line.' },
      { name: 'cover_media_id', label: 'Cover photo', type: 'media' },
      { name: 'logo_media_id', label: 'Logo', type: 'media' },
      order,
    ],
  },
  projects: {
    table: 'projects', title: 'Projects', hint: 'Robotics projects. Featured ones appear on Home.',
    label: 'name', meta: ['team_id', 'year'], order: ['sort_order'], create: true, view: (r) => `/research/projects/${r.slug}`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'URL name', type: 'slug', required: true, help: 'Lowercase letters, numbers and dashes. Used in the page address.' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'cover_media_id', label: 'Cover photo', type: 'media' },
      { name: 'description', label: 'Description', type: 'textarea', help: md },
      { name: 'team_id', label: 'Research team', type: 'ref', ref: { table: 'research_teams', label: 'name' } },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'gallery', label: 'Photo gallery', type: 'gallery' },
      { name: 'is_featured', label: 'Feature on the home page', type: 'bool' },
      published,
      order,
    ],
  },
  competitions: {
    table: 'competitions', title: 'Competitions', hint: 'One page per competition with its story.',
    label: 'name', meta: ['short_name', 'organizer'], order: ['sort_order'], create: true, view: (r) => `/research/competitions/${r.slug}`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'URL name', type: 'slug', required: true, help: 'Lowercase letters, numbers and dashes.' },
      { name: 'short_name', label: 'Short name', type: 'text' },
      { name: 'organizer', label: 'Organizer', type: 'text' },
      { name: 'description', label: 'About the competition', type: 'textarea', help: md },
      { name: 'journey', label: 'Our journey', type: 'textarea', help: md },
      { name: 'logo_media_id', label: 'Logo', type: 'media' },
      order,
    ],
  },
  entries: {
    table: 'competition_entries', title: 'Results', hint: 'Yearly participation and results for the timeline and achievements.',
    label: 'event', meta: ['competition_id', 'category', 'result'], order: ['-year', 'sort_order'], create: true, view: () => '/research#competitions',
    fields: [
      { name: 'competition_id', label: 'Competition', type: 'ref', required: true, ref: { table: 'competitions', label: 'name' } },
      { name: 'event', label: 'Event', type: 'text', required: true, help: 'e.g. KRTI 2026' },
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'result', label: 'Result', type: 'text', help: 'Leave empty for participation only. 1st/2nd/3rd count as podium finishes.' },
      published,
      order,
    ],
  },
  gallery: {
    table: 'gallery_items', title: 'Gallery', hint: 'Photos on Gallery & News and on competition pages.',
    label: 'caption', meta: ['album', 'competition_id'], order: ['sort_order'], create: true, view: () => '/gallery-news',
    fields: [
      { name: 'media_id', label: 'Photo', type: 'media', required: true },
      { name: 'caption', label: 'Caption', type: 'text' },
      { name: 'album', label: 'Album', type: 'select', required: true, options: ['competitions', 'workshops', 'activities'] },
      { name: 'competition_id', label: 'Competition', type: 'ref', ref: { table: 'competitions', label: 'name' }, help: 'Also shows the photo on that competition page.' },
      { name: 'taken_on', label: 'Date taken', type: 'date' },
      published,
      order,
    ],
  },
  news: {
    table: 'news_links', title: 'News & coverage', hint: 'Links to articles about IRC.',
    label: 'title', meta: ['outlet', 'published_on'], order: ['-published_on'], create: true, view: () => '/gallery-news#news',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'url', label: 'Article link', type: 'url', required: true },
      { name: 'outlet', label: 'Outlet', type: 'text' },
      { name: 'published_on', label: 'Date', type: 'date' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'thumbnail_media_id', label: 'Thumbnail', type: 'media' },
      published,
    ],
  },
  people: {
    table: 'people', title: 'People', hint: 'Committee, supervisors, advisor and persons in charge.',
    label: 'name', meta: ['group', 'role_title'], order: ['group', 'sort_order'], create: true, view: () => '/teams',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'photo_media_id', label: 'Photo', type: 'media' },
      { name: 'group', label: 'Group', type: 'select', required: true, options: ['committee', 'supervisor', 'advisor', 'pic'] },
      { name: 'role_title', label: 'Role', type: 'text' },
      { name: 'program', label: 'Study program', type: 'text' },
      { name: 'tags', label: 'Skill tags', type: 'tags', help: 'Separate with commas.' },
      { name: 'highlights', label: 'Highlights', type: 'lines', help: 'One per line.' },
      published,
      order,
    ],
  },
  sponsors: {
    table: 'sponsors', title: 'Sponsors', hint: 'Logos on Home and Sponsors.',
    label: 'name', meta: ['url'], order: ['sort_order'], create: true, view: () => '/sponsors',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'logo_media_id', label: 'Logo', type: 'media' },
      { name: 'url', label: 'Website', type: 'url' },
      published,
      order,
    ],
  },
  supporters: {
    table: 'supporters', title: 'Supporters', hint: 'Individual supporters from the Google Form. Add them once the payment arrives.',
    label: 'name', meta: ['instagram', 'amount'], order: ['sort_order', '-created_at'], create: true, view: () => '/support',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'instagram', label: 'Instagram username', type: 'text', help: 'Without @. Shown on the website and used for the Instagram thank-you tag.' },
      { name: 'amount', label: 'Amount (IDR)', type: 'number', required: true },
      { name: 'contact', label: 'Email or WhatsApp', type: 'text', help: 'Optional. Private, never shown on the website.' },
      { name: 'message', label: 'Message', type: 'textarea' },
      { name: 'is_published', label: 'Show in "Special thanks to" on the website (IDR 400.000+ tier)', type: 'bool' },
      order,
    ],
  },
  settings: {
    table: 'site_settings', title: 'Settings', hint: 'Contact details, social links and the share image.',
    label: 'org_name', order: [], singleton: true, view: () => '/contact',
    fields: [
      { name: 'org_name', label: 'Organization name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'description', label: 'Footer description', type: 'textarea' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone (WhatsApp)', type: 'text', help: 'Shown only on the Contact page.' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'socials.instagram', label: 'Instagram link', type: 'url' },
      { name: 'socials.linkedin', label: 'LinkedIn link', type: 'url' },
      { name: 'og_media_id', label: 'Share image (link previews)', type: 'media' },
    ],
  },
}

export const pageNames: Record<string, string> = {
  home: 'Home', about: 'About', research: 'Research', 'gallery-news': 'Gallery & News',
  teams: 'Teams', sponsors: 'Sponsors', support: 'Individual Support', contact: 'Contact',
}

export const nav: { title: string; items: string[] }[] = [
  { title: 'Pages', items: ['page-sections'] },
  { title: 'Content', items: ['research-teams', 'projects', 'competitions', 'entries', 'gallery', 'news', 'people', 'sponsors', 'supporters'] },
]

// Columns that reference media, for "where is this photo used" and delete checks.
export const mediaRefs: [table: string, column: string, module: string][] = [
  ['site_settings', 'og_media_id', 'settings'],
  ['page_sections', 'media_id', 'page-sections'],
  ['research_teams', 'cover_media_id', 'research-teams'],
  ['research_teams', 'logo_media_id', 'research-teams'],
  ['projects', 'cover_media_id', 'projects'],
  ['project_media', 'media_id', 'projects'],
  ['competitions', 'logo_media_id', 'competitions'],
  ['gallery_items', 'media_id', 'gallery'],
  ['news_links', 'thumbnail_media_id', 'news'],
  ['people', 'photo_media_id', 'people'],
  ['sponsors', 'logo_media_id', 'sponsors'],
]
