// Admin modules: one generic list/edit screen per content table, driven by this config.

// Shared admin class names. Kept here, not in the 'use client' file: server pages import them as strings.
export const inputCls = 'mt-1.5 block w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-normal text-ink shadow-xs transition focus:border-secondary focus:ring-4 focus:ring-secondary/10 focus:outline-none'
export const btnCls = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-900 active:scale-[0.98] disabled:opacity-50'
export const btnGhost = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-4 text-sm font-medium text-navy-900 transition hover:border-navy-400 hover:bg-surface active:scale-[0.98]'
export const cardCls = 'rounded-2xl border border-navy-200/70 bg-white shadow-xs'

export type FieldType =
  | 'text' | 'textarea' | 'url' | 'email' | 'slug' | 'date' | 'number' | 'bool'
  | 'tags' | 'lines' | 'buttons' | 'select' | 'ref' | 'media' | 'gallery'

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
  sortable?: boolean // has sort_order: lists get drag-and-drop ordering
  group?: string // column the list is split by; items are ordered within their group
}

const md = 'Blank line = new paragraph. Start a line with "- " for a list. **bold**, [text](url).'
const published: Field = { name: 'is_published', label: 'Show on the website', type: 'bool' }

// Columns that exist but no public page shows (team/competition logos, news thumbnails, photo dates)
// are left out of the forms on purpose: editing them changed nothing on the site.
export const modules: Record<string, Module> = {
  'page-sections': {
    table: 'page_sections', title: 'Page text', hint: 'Headings, paragraphs, buttons and photos on every public page.',
    label: 'title', order: ['page', 'key'], view: (r) => sitePages.find((p) => p.slug === r.page)?.path ?? '/',
    fields: [
      { name: 'eyebrow', label: 'Small label above the heading', type: 'text', help: 'Leave empty to hide it.' },
      { name: 'title', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Text', type: 'textarea', help: md },
      { name: 'media_id', label: 'Photo', type: 'media' },
      { name: 'buttons', label: 'Buttons / links', type: 'buttons', help: 'One per line: Label | link. Add a line to add a button, delete a line to remove it.' },
    ],
  },
  'research-teams': {
    table: 'research_teams', title: 'Research teams', hint: 'Agrisena and Agrinaya teams on Home and Research.',
    label: 'name', meta: ['group_name', 'tagline'], order: ['sort_order'], create: true, sortable: true, view: (r) => `/research#${r.slug}`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'URL name', type: 'slug', required: true, help: 'Lowercase letters, numbers and dashes.' },
      { name: 'group_name', label: 'Group', type: 'text', required: true, help: 'Agrisena or Agrinaya. The group story is in Research → Text on this page.' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', help: md },
      { name: 'target_competitions', label: 'Target competitions', type: 'lines', help: 'One per line.' },
      { name: 'cover_media_id', label: 'Cover photo', type: 'media' },
    ],
  },
  projects: {
    table: 'projects', title: 'Projects', hint: 'Robotics projects. Featured ones appear on Home.',
    label: 'name', meta: ['team_id', 'year'], order: ['sort_order'], create: true, sortable: true, view: (r) => `/research/projects/${r.slug}`,
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
    ],
  },
  competitions: {
    table: 'competitions', title: 'Competitions', hint: 'One page per competition with its story.',
    label: 'name', meta: ['short_name', 'organizer'], order: ['sort_order'], create: true, sortable: true, view: (r) => `/research/competitions/${r.slug}`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'URL name', type: 'slug', required: true, help: 'Lowercase letters, numbers and dashes.' },
      { name: 'short_name', label: 'Short name', type: 'text' },
      { name: 'organizer', label: 'Organizer', type: 'text' },
      { name: 'description', label: 'About the competition', type: 'textarea', help: md },
      { name: 'journey', label: 'Our journey', type: 'textarea', help: md },
    ],
  },
  entries: {
    table: 'competition_entries', title: 'Results', hint: 'Yearly participation and results for the timeline and achievements.',
    label: 'event', meta: ['competition_id', 'category', 'result'], order: ['-year', 'sort_order'], create: true, sortable: true, group: 'year', view: () => '/research#competitions',
    fields: [
      { name: 'competition_id', label: 'Competition', type: 'ref', required: true, ref: { table: 'competitions', label: 'name' } },
      { name: 'event', label: 'Event', type: 'text', required: true, help: 'e.g. KRTI 2026' },
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'result', label: 'Result', type: 'text', help: 'Leave empty for participation only. 1st/2nd/3rd count as podium finishes.' },
      published,
    ],
  },
  gallery: {
    table: 'gallery_items', title: 'Gallery', hint: 'Photos on Gallery & News and on competition pages.',
    label: 'caption', meta: ['album', 'competition_id'], order: ['sort_order'], create: true, sortable: true, view: () => '/gallery-news',
    fields: [
      { name: 'media_id', label: 'Photo', type: 'media', required: true },
      { name: 'caption', label: 'Caption', type: 'text' },
      { name: 'album', label: 'Album', type: 'select', required: true, options: ['competitions', 'workshops', 'activities'] },
      { name: 'competition_id', label: 'Competition', type: 'ref', ref: { table: 'competitions', label: 'name' }, help: 'Also shows the photo on that competition page.' },
      published,
    ],
  },
  news: {
    table: 'news_links', title: 'News & coverage', hint: 'Links to articles about IRC. Newest date shows first.',
    label: 'title', meta: ['outlet', 'published_on'], order: ['-published_on'], create: true, view: () => '/gallery-news#news',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'url', label: 'Article link', type: 'url', required: true },
      { name: 'outlet', label: 'Outlet', type: 'text' },
      { name: 'published_on', label: 'Date', type: 'date' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      published,
    ],
  },
  people: {
    table: 'people', title: 'People', hint: 'Committee, supervisors, advisor and persons in charge.',
    label: 'name', meta: ['role_title', 'program'], order: ['group', 'sort_order'], create: true, sortable: true, group: 'group', view: () => '/teams',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'photo_media_id', label: 'Photo', type: 'media' },
      { name: 'group', label: 'Group', type: 'select', required: true, options: ['committee', 'supervisor', 'advisor', 'pic'] },
      { name: 'role_title', label: 'Role', type: 'text' },
      { name: 'program', label: 'Study program', type: 'text' },
      { name: 'tags', label: 'Skill tags', type: 'tags', help: 'Separate with commas.' },
      { name: 'highlights', label: 'Highlights', type: 'lines', help: 'One per line. Visitors open them with "Show highlights" on the card.' },
      published,
    ],
  },
  sponsors: {
    table: 'sponsors', title: 'Sponsors', hint: 'Logos on Home and Sponsors.',
    label: 'name', meta: ['url'], order: ['sort_order'], create: true, sortable: true, view: () => '/sponsors',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'logo_media_id', label: 'Logo', type: 'media' },
      { name: 'url', label: 'Website', type: 'url' },
      published,
    ],
  },
  supporters: {
    table: 'supporters', title: 'Supporters', hint: 'Individual supporters from the Google Form. Add them once the payment arrives.',
    label: 'name', meta: ['instagram', 'amount'], order: ['sort_order', '-created_at'], create: true, sortable: true, view: () => '/support',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'instagram', label: 'Instagram username', type: 'text', help: 'Without @. Shown on the website and used for the Instagram thank-you tag.' },
      { name: 'amount', label: 'Amount (IDR)', type: 'number', required: true, help: 'Sets the name badge: 100.000+ green (M), 400.000+ gold (L), 800.000+ platinum (XL).' },
      { name: 'contact', label: 'Email or WhatsApp', type: 'text', help: 'Optional. Private, never shown on the website.' },
      { name: 'message', label: 'Message', type: 'textarea', help: 'Private note for the team, never shown on the website.' },
      { name: 'is_published', label: 'Payment received: show in "Special thanks to" on the website', type: 'bool' },
    ],
  },
  settings: {
    table: 'site_settings', title: 'Settings', hint: 'Contact details, social links and the share image.',
    label: 'org_name', order: [], singleton: true, view: () => '/contact',
    fields: [
      { name: 'org_name', label: 'Organization name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text', help: 'Shown on the link-preview image.' },
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

// ---------- the website, page by page ----------
// Sections are listed in the order they appear on the page, so the admin reads top to bottom like the site.
// `fields` says which inputs the section really uses (the form shows only those); `help` adds per-field hints.
type SectionField = 'eyebrow' | 'title' | 'body' | 'media' | 'buttons'
export type SectionInfo = { key: string; label: string; fields: SectionField[]; help?: Partial<Record<SectionField, string>> }
const sec = (key: string, label: string, fields: string, help?: SectionInfo['help']): SectionInfo => ({ key, label, fields: fields.split(' ') as SectionField[], help })

const list = 'Each line starting with "- " becomes one item.'
const heading = 'eyebrow title body'
const pills = { buttons: 'Shown as the numbered links in the navy panel at the top.' }
const tags = { body: `First paragraph = description. ${list} (shown as tags)` }
const fixed = (names: string) => `One line per text, in this order: ${names}. An empty line keeps the built-in text.`

export type SitePage = {
  slug: string
  name: string
  path: string
  hint: string
  sections: SectionInfo[]
  modules: string[] // content lists edited on this page
  alsoShows?: { module: string; note: string }[] // content shown here but edited on another page
}

export const sitePages: SitePage[] = [
  {
    slug: 'home', name: 'Home', path: '/', hint: 'The first page visitors see.',
    sections: [
      sec('hero', 'Top banner: label, headline, intro, buttons and the team photo', 'eyebrow title body media buttons', { buttons: 'The first button is red, the others are outlined.' }),
      sec('hero-note', 'Small line under the top banner buttons', 'body'),
      sec('stats', 'Numbers on the team photo', 'body', {
        body: 'One "- Label: value" per line. The value can be any text, or a count kept up to date automatically: {since} first competition year, {competitions} competitions entered, {podiums} podium finishes, {projects} projects.',
      }),
      sec('hero-caption', 'Caption on the team photo', 'body'),
      sec('research', 'Research teams heading', `${heading} buttons`),
      sec('projects', 'Featured projects heading', `${heading} buttons`),
      sec('achievements', 'Achievements panel heading', `${heading} buttons`),
      sec('news', 'News & coverage heading', `${heading} buttons`),
      sec('sponsors', 'Sponsor logos heading', `${heading} buttons`),
      sec('cta', 'Closing call to action (navy box at the bottom)', `${heading} buttons`),
    ],
    modules: [],
    alsoShows: [
      { module: 'research-teams', note: 'Research team cards' },
      { module: 'projects', note: 'Up to 3 projects ticked "Feature on the home page"' },
      { module: 'entries', note: 'Best results in the Achievements panel' },
      { module: 'news', note: 'The 3 newest news links' },
      { module: 'sponsors', note: 'Sponsor logos' },
    ],
  },
  {
    slug: 'about', name: 'About', path: '/about', hint: 'Story, values and the organization.',
    sections: [
      sec('intro', 'Page title, the "About IRC" story and its photo', 'eyebrow title body media buttons', pills),
      sec('values', 'Core values (navy box)', heading, { body: list }),
      sec('structure', 'Organizational structure tree', heading, { body: `${list} Indent 2 spaces to nest.` }),
      sec('official', 'Official Department heading', heading),
      sec('hrd', 'HRD row', 'title body', tags),
      sec('mnb', 'Media and Branding row', 'title body', tags),
      sec('fund', 'Fundraising row', 'title body', tags),
      sec('technical', 'Technical Department heading', heading),
      sec('mechanical', 'Mechanical division (with photo)', `${heading} media`, tags),
      sec('electrical', 'Electrical division (with photo)', `${heading} media`, tags),
      sec('software', 'Software division (with photo)', `${heading} media`, tags),
    ],
    modules: [],
  },
  {
    slug: 'research', name: 'Research', path: '/research', hint: 'Research teams, projects and competitions.',
    sections: [
      sec('intro', 'Page title and intro', `${heading} buttons`, pills),
      sec('agrisena', 'Agrisena group story (above its team cards)', heading),
      sec('agrinaya', 'Agrinaya group story (above its team cards)', heading),
      sec('team-label', 'Label above each team’s target competitions', 'title'),
      sec('coming-soon', '"Coming soon" box under the teams', 'title body'),
      sec('projects', 'Projects heading', heading),
      sec('competitions', 'Competitions heading', heading),
      sec('timeline', 'Participation timeline heading (also used on competition pages)', 'title body', { body: 'Shown for an entry without a result, e.g. Participant.' }),
    ],
    modules: ['research-teams', 'projects', 'competitions', 'entries'],
  },
  {
    slug: 'gallery-news', name: 'Gallery & News', path: '/gallery-news', hint: 'Photo gallery and press coverage.',
    sections: [
      sec('intro', 'Page title and intro', `${heading} buttons`, { buttons: `${pills.buttons} {photos} and {news} show the current counts.` }),
      sec('gallery', 'Gallery heading', heading),
      sec('news', 'News & coverage heading', heading),
      sec('news-empty', 'Shown when there are no news links', 'body'),
    ],
    modules: ['gallery', 'news'],
  },
  {
    slug: 'teams', name: 'Teams', path: '/teams', hint: 'Committee, supervisors and advisors.',
    sections: [
      sec('intro', 'Page title and intro (the navy panel lists the group headings below)', heading),
      sec('committee', 'Committee heading', heading),
      sec('supervisor', 'Supervisors heading', heading),
      sec('advisor', 'Research advisor heading', heading),
      sec('pic', 'Persons in charge heading', heading),
      sec('highlights-label', 'Button that opens a person’s highlights', 'title'),
    ],
    modules: ['people'],
  },
  {
    slug: 'sponsors', name: 'Sponsors', path: '/sponsors', hint: 'Partner logos and why to sponsor.',
    sections: [
      sec('intro', 'Page title and intro', `${heading} buttons`, { buttons: `${pills.buttons} {sponsors} shows the number of sponsors.` }),
      sec('why', 'Why support IRC (navy box)', heading),
      sec('cta', 'Become a sponsor (bottom, with button)', `${heading} buttons`),
    ],
    modules: ['sponsors'],
  },
  {
    slug: 'support', name: 'Individual Support', path: '/support', hint: 'Tiers, the pledge form and supporters.',
    sections: [
      sec('support', 'Page title and intro', `${heading} buttons`, pills),
      sec('tier-1', 'Green tier card (heading = amount)', heading, { body: `${list} Each item is one benefit.` }),
      sec('tier-2', 'Gold tier card (heading = amount)', heading, { body: `${list} Each item is one benefit.` }),
      sec('tier-3', 'Platinum tier card (heading = amount)', heading, { body: `${list} Each item is one benefit.` }),
      sec('badges', 'Name badge preview at the bottom of each tier card', 'title body', { body: fixed('green tier name, gold tier name, platinum tier name') }),
      sec('badge-sample', 'Sample name inside the badge preview', 'title'),
      sec('pledge', 'Pledge text and the Google Form button', 'title body buttons'),
      sec('thanks', '"Special thanks to" heading above the supporters', 'title'),
    ],
    modules: ['supporters'],
  },
  {
    slug: 'contact', name: 'Contact', path: '/contact', hint: 'Contact details and the message form.',
    sections: [
      sec('intro', 'Page title and intro', heading),
      sec('form', 'Heading and text next to the message form', 'title body'),
      sec('map-link', 'Google Maps link text', 'title'),
      sec('form-labels', 'Message form labels and messages', 'body', {
        body: fixed('Name, Email, Organization, (optional), Topic, Message, Send button, "Sending…", thank-you heading, thank-you text, "Send another message", error text, "Please email us at"'),
      }),
      sec('form-topics', 'Topic choices in the form', 'body', { body: fixed('sponsorship, research collaboration, media, general') }),
    ],
    modules: [],
    alsoShows: [{ module: 'settings', note: 'Email, WhatsApp, address and social links' }],
  },
  {
    slug: 'site', name: 'Menu & footer', path: '/', hint: 'Top menu, footer, project/competition page labels and the 404 page.',
    sections: [
      sec('nav', 'Top menu', 'body', { body: 'One "- Label | link" per line. Indent 2 spaces to put a link in the dropdown of the line above.' }),
      sec('nav-button', 'Red button at the right of the menu', 'buttons'),
      sec('footer-explore', 'Footer: links column', 'title buttons'),
      sec('footer-contact', 'Footer: contact column heading', 'title'),
      sec('footer-follow', 'Footer: social icons heading', 'title'),
      sec('footer-bottom', 'Footer: bottom line and the admin link', 'body buttons', { body: '{year} = this year, {org} = organization name (Settings).' }),
      sec('project-page', 'Labels on every project page', 'body buttons', { body: fixed('back link, "Research team", "Year", "Related competitions", "Photos", "Project" (shown when a project has no team)') }),
      sec('competition-page', 'Labels on every competition page', 'body', {
        body: fixed('back link, "Achievements", "About the competition", "Our journey", "Participation", "Photos", "Organized by"'),
      }),
      sec('not-found', 'Page not found (404)', `${heading} buttons`),
    ],
    modules: [],
  },
]

export const pageNames: Record<string, string> = Object.fromEntries(sitePages.map((p) => [p.slug, p.name]))

/** The admin page that holds a module's list. */
export const homeOf = (module: string) => {
  if (module === 'settings') return '/admin/settings'
  if (module === 'page-sections') return '/admin/pages'
  const p = sitePages.find((p) => p.modules.includes(module))
  return p ? `/admin/pages/${p.slug}#${module}` : '/admin'
}

export const sectionInfo = (page: string, key: string) => sitePages.find((p) => p.slug === page)?.sections.find((s) => s.key === key)

/** Whether a page section shows this field on the site (unknown sections show everything). */
export const sectionUses = (row: Row, field: SectionField) => sectionInfo(String(row.page), String(row.key))?.fields.includes(field) ?? true

/** Fields to show when editing this row. */
export function fieldsFor(key: string, row: Row): Field[] {
  const fields = modules[key].fields
  if (key !== 'page-sections') return fields
  const info = sectionInfo(String(row.page), String(row.key))
  if (!info) return fields
  const field = (f: Field) => (f.name === 'media_id' ? 'media' : f.name) as SectionField
  return fields
    .filter((f) => info.fields.includes(field(f)))
    .map((f) => {
      const help = info.help?.[field(f)]
      return help ? { ...f, help: f.name === 'body' ? `${help} ${md}` : help } : f
    })
}

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
