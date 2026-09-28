import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { mediaUrl } from '@/lib/media'
import type { Competition, Entry, Media, News, Person, Project, Section, Sponsor, Team } from '@/lib/data'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 md:px-6 ${className}`}>{children}</div>
}

/** The big red ring from irc-mobile. Position and size it with className. */
export function Ring({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute aspect-square rounded-full border-primary ${className}`} />
}

const initials = (s: string) =>
  s.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('')

/** Fills its (relative, sized) parent. No media → navy panel with ring and initials. */
export function Img({
  media,
  fallback,
  sizes,
  className = 'object-cover',
  preload,
}: {
  media: Media | null
  fallback: string
  sizes: string
  className?: string
  preload?: boolean
}) {
  if (!media)
    return (
      <div role="img" aria-label={fallback} className="absolute inset-0 grid place-items-center overflow-hidden bg-secondary">
        <Ring className="-top-[25%] -right-[20%] w-[70%] border-[14px]" />
        <span aria-hidden className="relative text-4xl font-semibold tracking-tight text-white">{initials(fallback)}</span>
      </div>
    )
  return <Image src={mediaUrl(media.path)} alt={media.alt} fill sizes={sizes} className={className} preload={preload} />
}

// ---------- tiny markdown: paragraphs, "- " lists (nested by indent), **bold**, [text](url) ----------
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/)
    if (bold) return <strong key={i}>{bold[1]}</strong>
    const link = part.match(/^\[(.+)\]\((.+)\)$/)
    if (link) return <a key={i} href={link[2]}>{link[1]}</a>
    return part
  })
}
type Node = { text: string; children: Node[] }
export function listItems(text: string | null | undefined): Node[] {
  const root: Node[] = []
  const stack = [{ depth: -1, list: root }]
  for (const line of (text ?? '').split('\n')) {
    const m = line.match(/^(\s*)- (.*)$/)
    if (!m) continue
    while (stack[stack.length - 1].depth >= m[1].length) stack.pop()
    const node = { text: m[2], children: [] }
    stack[stack.length - 1].list.push(node)
    stack.push({ depth: m[1].length, list: node.children })
  }
  return root
}
/** Body text without its lists (the lists are rendered separately, e.g. as pills). */
export const leadText = (text: string | null | undefined) =>
  (text ?? '').split(/\n\s*\n/).filter((b) => !/^\s*- /.test(b)).join('\n\n')

const List = ({ items }: { items: Node[] }) => (
  <ul>
    {items.map((n, i) => (
      <li key={i}>
        {inline(n.text)}
        {n.children.length > 0 && <List items={n.children} />}
      </li>
    ))}
  </ul>
)
export function Markdown({ text, className = '' }: { text: string | null | undefined; className?: string }) {
  if (!text) return null
  return (
    <div className={`md ${className}`}>
      {text.trim().split(/\n\s*\n/).map((block, i) =>
        /^\s*- /.test(block) ? <List key={i} items={listItems(block)} /> : <p key={i}>{inline(block)}</p>,
      )}
    </div>
  )
}

// ---------- building blocks ----------
export function ButtonLink({ href, children, variant = 'primary' }: { href: string; children: ReactNode; variant?: 'primary' | 'navy' | 'outline' | 'light' }) {
  const styles = {
    // primary-ink keeps white 16px labels above WCAG AA (4.5:1).
    primary: 'bg-primary-ink text-white hover:brightness-90',
    navy: 'bg-secondary text-white hover:bg-navy-900',
    outline: 'border border-navy-200 text-navy-900 hover:border-navy-600',
    light: 'border border-white/30 text-white hover:bg-white/10',
  }
  return (
    <Link href={href} className={`inline-flex min-h-12 items-center justify-center rounded-xl px-6 font-semibold transition-colors duration-200 ${styles[variant]}`}>
      {children}
    </Link>
  )
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  // Red text never sits on navy (2.5:1); dark sections use the light navy tint.
  return <p className={`text-sm font-semibold tracking-[0.18em] uppercase ${dark ? 'text-navy-200' : 'text-primary-ink'}`}>{children}</p>
}

export function Tag({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${dark ? 'border-white/20 bg-white/10 text-white' : 'border-navy-200 bg-surface text-navy-800'}`}>
      {children}
    </span>
  )
}

export function Tags({ items, dark }: { items: string[]; dark?: boolean }) {
  if (!items.length) return null
  return <ul className="flex flex-wrap gap-2">{items.map((t) => <li key={t}><Tag dark={dark}>{t}</Tag></li>)}</ul>
}

/** Numbered pills stepping to the right, like the irc-mobile level ladder. */
export function StepPills({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <ol className="space-y-3">
      {items.map((it, i) => {
        const pill = <span className="relative rounded-full border border-white/20 bg-navy-600 px-4 py-1.5 text-sm font-medium text-white transition-colors">{it.label}</span>
        return (
          <li key={it.label} className="flex items-center gap-4" style={{ paddingLeft: `${i * 1.5}rem` }}>
            <span className="font-mono text-xs text-navy-200">{String(i + 1).padStart(2, '0')}</span>
            {it.href ? <Link href={it.href} className="[&>span]:hover:border-white/60">{pill}</Link> : pill}
          </li>
        )
      })}
    </ol>
  )
}

/** Divider rows: title left, detail right. */
export function Rows({ items, dark }: { items: { key: string; title: ReactNode; detail?: ReactNode }[]; dark?: boolean }) {
  return (
    <ul className={`divide-y border-y ${dark ? 'relative divide-white/15 border-white/15 bg-secondary' : 'divide-navy-200/70 border-navy-200/70'}`}>
      {items.map((r) => (
        <li key={r.key} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
          <span className={`text-lg font-semibold tracking-tight ${dark ? 'text-white' : 'text-navy-900'}`}>{r.title}</span>
          {r.detail && <span className={`text-sm sm:text-right ${dark ? 'text-navy-200' : 'text-navy-600'}`}>{r.detail}</span>}
        </li>
      ))}
    </ul>
  )
}

const h1Cls = 'text-[2.75rem] leading-[1.05] font-semibold tracking-[-0.05em] text-balance text-navy-900 md:text-6xl'

export function SectionHeading({ section, eyebrow, dark, as: H = 'h2' }: { section?: Section; eyebrow?: string; dark?: boolean; as?: 'h1' | 'h2' }) {
  if (!section?.title) return null
  return (
    <div className="max-w-2xl">
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <H className={`mt-4 text-3xl leading-[1.1] font-semibold tracking-[-0.04em] text-balance md:text-[2.75rem] ${dark ? 'text-white' : 'text-navy-900'}`}>{section.title}</H>
      <Markdown text={section.body} className={`mt-4 text-lg leading-relaxed ${dark ? 'text-navy-200' : 'text-navy-600'}`} />
    </div>
  )
}

/**
 * Split header from irc-mobile: white text column left, navy panel with the red ring right
 * (or a photo when `media` is given). Both halves bleed to the viewport edge.
 */
export function PageHeader({
  eyebrow,
  title,
  body,
  back,
  aside,
  media,
}: {
  eyebrow: string
  title: ReactNode
  body?: string | null
  back?: { href: string; label: string }
  aside?: ReactNode
  media?: { value: Media | null; fallback: string }
}) {
  return (
    <header className="grid pt-16 md:pt-18 lg:min-h-[34rem] lg:grid-cols-2">
      <div className="flex items-center">
        <div className="fade-up w-full px-4 py-14 md:px-6 lg:ml-auto lg:max-w-[600px] lg:py-20 lg:pr-12">
          {back && <Link href={back.href} className="mb-8 inline-block text-sm font-medium text-navy-600 hover:text-navy-900">← {back.label}</Link>}
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={`mt-5 ${h1Cls}`}>{title}</h1>
          <Markdown text={body} className="mt-6 text-lg leading-relaxed text-navy-600" />
        </div>
      </div>
      {media ? (
        <div className="relative min-h-72 bg-surface">
          <Img media={media.value} fallback={media.fallback} sizes="(min-width: 1024px) 50vw, 100vw" preload />
        </div>
      ) : (
        <div className="relative min-h-60 overflow-hidden bg-secondary">
          <Ring className="-top-28 -right-28 w-[22rem] border-[40px] md:w-[30rem] md:border-[56px]" />
          <div className="relative flex h-full items-end px-4 py-12 md:px-6 lg:max-w-[600px] lg:py-20 lg:pl-12">{aside}</div>
        </div>
      )}
    </header>
  )
}

/** Navy block with the ring, for achievements and calls to action. */
export function NavyPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-secondary px-6 py-12 md:px-12 md:py-16 ${className}`}>
      <Ring className="-top-56 -right-40 hidden w-[26rem] border-[48px] lg:block" />
      <div className="relative">{children}</div>
    </div>
  )
}

const card = 'group relative flex flex-col overflow-hidden rounded-2xl border border-navy-200/70 bg-white transition-colors duration-300 hover:border-navy-400'
const cardEyebrow = 'text-xs font-semibold tracking-[0.18em] text-primary-ink uppercase'
const cardTitle = 'mt-2 text-xl font-semibold tracking-tight text-navy-900'
const arrow = <span aria-hidden className="text-navy-400 transition-transform duration-200 motion-safe:group-hover:translate-x-1">→</span>

export function ResearchTeamCard({ team }: { team: Team }) {
  return (
    <article className={card}>
      <div className="relative aspect-[4/3] bg-surface">
        <Img media={team.cover} fallback={team.name} sizes="(min-width: 768px) 33vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className={cardEyebrow}>{team.group_name}</p>
        <h3 className={`${cardTitle} flex items-center justify-between gap-3`}>
          <Link href={`/research#${team.slug}`} className="after:absolute after:inset-0">{team.name}</Link>
          {arrow}
        </h3>
        {team.tagline && <p className="mt-2 text-navy-600">{team.tagline}</p>}
      </div>
    </article>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={card}>
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Img media={project.cover} fallback={project.name} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-300 motion-safe:group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        {project.team && <p className={cardEyebrow}>{project.team.name}</p>}
        <h3 className={`${cardTitle} flex items-center justify-between gap-3`}>
          <Link href={`/research/projects/${project.slug}`} className="after:absolute after:inset-0">{project.name}</Link>
          {arrow}
        </h3>
        {project.subtitle && <p className="mt-2 text-navy-600">{project.subtitle}</p>}
      </div>
    </article>
  )
}

export function CompetitionCard({ competition, entries, cover }: { competition: Competition; entries: Entry[]; cover: Media | null }) {
  const years = [...new Set(entries.map((e) => e.year))].sort()
  const best = entries.filter((e) => e.result)
  return (
    <article className={card}>
      <div className="relative aspect-[16/9] bg-surface">
        <Img media={cover} fallback={competition.short_name ?? competition.name} sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className={cardEyebrow}>{competition.short_name}</p>
        <h3 className={`${cardTitle} flex items-center justify-between gap-3`}>
          <Link href={`/research/competitions/${competition.slug}`} className="after:absolute after:inset-0">{competition.name}</Link>
          {arrow}
        </h3>
        {years.length > 0 && <p className="mt-2 font-mono text-sm text-navy-600">{years.join(' · ')}</p>}
        {best.length > 0 && (
          <div className="mt-4"><Tags items={best.slice(0, 3).map((e) => `${e.result} · ${e.event}`)} /></div>
        )}
      </div>
    </article>
  )
}

/** Results as divider rows (used on navy). */
export function ResultRows({ entries, dark }: { entries: Entry[]; dark?: boolean }) {
  return (
    <Rows
      dark={dark}
      items={entries.map((e) => ({ key: e.id, title: e.result, detail: [e.category, e.event].filter(Boolean).join(' · ') }))}
    />
  )
}

export function Timeline({ entries }: { entries: Entry[] }) {
  const years = [...new Set(entries.map((e) => e.year))].sort((a, b) => b - a)
  return (
    <ol className="border-t border-navy-200/70">
      {years.map((y) => (
        <li key={y} className="grid gap-3 border-b border-navy-200/70 py-6 md:grid-cols-[140px_1fr]">
          <p className="font-mono text-2xl text-navy-900">{y}</p>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {entries.filter((e) => e.year === y).map((e) => (
              <li key={e.id}>
                <Link href={`/research/competitions/${e.competition.slug}`} className="font-semibold tracking-tight text-navy-900 hover:underline">{e.event}</Link>
                <p className="text-sm text-navy-600">{[e.category, e.result ?? 'Participant'].filter(Boolean).join(' · ')}</p>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

export function NewsList({ news }: { news: News[] }) {
  return (
    <ul className="border-t border-navy-200/70">
      {news.map((n) => (
        <li key={n.id} className="border-b border-navy-200/70">
          <a href={n.url} target="_blank" rel="noopener noreferrer" className="group grid gap-x-8 gap-y-1 py-5 md:grid-cols-[220px_1fr_auto] md:items-baseline">
            <span className="font-mono text-sm text-navy-600">
              {[n.outlet, n.published_on && new Date(n.published_on).toLocaleDateString('en-GB', { dateStyle: 'medium' })].filter(Boolean).join(' · ')}
            </span>
            <span>
              <span className="text-lg font-semibold tracking-tight text-navy-900 group-hover:underline">{n.title}</span>
              {n.summary && <span className="mt-1 block text-sm text-navy-600">{n.summary}</span>}
            </span>
            <span aria-hidden className="hidden text-navy-400 md:block">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function PersonCard({ person }: { person: Person }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-navy-200/70 bg-white">
      <div className="relative aspect-[5/6] bg-surface">
        <Img media={person.photo} fallback={person.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {person.role_title && <p className={cardEyebrow}>{person.role_title}</p>}
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-navy-900">{person.name}</h3>
        {person.program && <p className="text-sm text-navy-600">{person.program}</p>}
        {person.tags.length > 0 && <div className="mt-4"><Tags items={person.tags} /></div>}
        {person.highlights.length > 0 && (
          <ul className="mt-4 divide-y divide-navy-200/70 border-t border-navy-200/70 text-sm text-navy-600">
            {person.highlights.map((h) => <li key={h} className="py-2.5">{h}</li>)}
          </ul>
        )}
      </div>
    </article>
  )
}

export function SponsorLogoGrid({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <ul className="grid grid-cols-2 border-t border-l border-navy-200/70 sm:grid-cols-3 lg:grid-cols-5">
      {sponsors.map((s) => {
        const inner = s.logo ? (
          <div className="relative h-14 w-full">
            <Img media={s.logo} fallback={s.name} sizes="200px" className="object-contain" />
          </div>
        ) : (
          <span className="text-center text-sm font-semibold tracking-tight text-navy-800">{s.name}</span>
        )
        return (
          <li key={s.id} className="grid min-h-32 place-items-center border-r border-b border-navy-200/70 p-6" title={s.name}>
            {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="grid w-full place-items-center">{inner}</a> : inner}
          </li>
        )
      })}
    </ul>
  )
}

/** Section wrapper with a heading row and an optional "see all" link. */
export function Block({ id, section, eyebrow, link, children, className = '' }: { id?: string; section?: Section; eyebrow?: string; link?: { href: string; label: string }; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading section={section} eyebrow={eyebrow} />
          {link && <Link href={link.href} className="font-medium text-navy-600 hover:text-navy-900">{link.label} →</Link>}
        </div>
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  )
}
