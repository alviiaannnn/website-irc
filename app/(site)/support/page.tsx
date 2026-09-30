import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { ButtonLink, Container, Markdown, PageHeader, StepPills } from '@/components/ui'
import { getSections, getSupporters, type Tier } from '@/lib/data'
import { listItems } from '@/lib/text'

export const metadata: Metadata = {
  title: 'Individual Support',
  description: 'Support IPB Robotic Club as an individual on our road to SAFMC 2027: contribution tiers, benefits, and our supporters.',
}

// Name badges in "Special thanks to": the tier (from the pledged amount) sets colour and size.
const badge: Record<Tier, { label: string; cls: string }> = {
  green: { label: 'Green · M', cls: 'bg-tier-green px-4 py-2 text-base text-white' },
  gold: { label: 'Gold · L', cls: 'bg-linear-to-br from-tier-gold-light to-tier-gold px-5 py-2.5 text-lg text-navy-900' },
  platinum: { label: 'Platinum · XL', cls: 'bg-linear-to-br from-white to-tier-platinum px-7 py-4 text-2xl text-navy-900 ring-1 ring-navy-200' },
}
const cardTier: Record<string, Tier> = { 'tier-1': 'green', 'tier-2': 'gold', 'tier-3': 'platinum' }
const Badge = ({ tier, children }: { tier: Tier; children: ReactNode }) => (
  <span className={`inline-block rounded-xl font-semibold tracking-tight shadow-sm ${badge[tier].cls}`}>{children}</span>
)

// Content lives in Admin → Page text → Individual Support (support, tier-1..3, pledge).
export default async function Support() {
  const [s, supporters] = await Promise.all([getSections('support'), getSupporters()])
  const tiers = ['tier-1', 'tier-2', 'tier-3'].flatMap((k) => s[k] ?? [])
  return (
    <>
      <PageHeader
        eyebrow="Individual support"
        title={s.support?.title}
        body={s.support?.body}
        aside={
          <StepPills
            items={[
              ...tiers.map((t) => ({ label: `From ${t.title}`, href: '#tiers' })),
              ...(s.pledge?.cta_href ? [{ label: s.pledge.cta_label ?? 'Support IRC', href: s.pledge.cta_href }] : []),
            ]}
          />
        }
      />

      <section id="tiers" className="py-20 md:py-28">
        <Container>
          <div className="cards grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <article key={t.key} className="flex flex-col rounded-2xl border border-navy-200/70 bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary-ink uppercase">Starting from</p>
                <p className="mt-2 font-mono text-3xl tracking-tight text-navy-900">{t.title}</p>
                <ul className="mt-6 divide-y divide-navy-200/70 border-t border-navy-200/70 text-sm text-navy-600">
                  {listItems(t.body).map((b) => <li key={b.text} className="py-3">{b.text}</li>)}
                </ul>
                {cardTier[t.key] && (
                  <div className="mt-auto pt-6">
                    <p className="font-mono text-xs text-navy-600">Your name on our website · {badge[cardTier[t.key]].label}</p>
                    <div className="mt-3"><Badge tier={cardTier[t.key]}>@yourname</Badge></div>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">{s.pledge?.title}</h2>
              <Markdown text={s.pledge?.body} className="mt-3 leading-relaxed text-navy-600" />
            </div>
            {/* Google Form link, editable in Admin → Page text → Individual Support · pledge. */}
            {s.pledge?.cta_href && <div className="shrink-0"><ButtonLink href={s.pledge.cta_href}>{s.pledge.cta_label ?? 'Support IRC'}</ButtonLink></div>}
          </div>

          {supporters.length > 0 && (
            <div id="thanks" className="mt-20 text-center">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Special thanks to</h2>
              {(['platinum', 'gold', 'green'] as const).map((tier) => {
                const list = supporters.filter((p) => p.tier === tier)
                if (!list.length) return null
                return (
                  <ul key={tier} aria-label={`${badge[tier].label} supporters`} className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {list.map((p) => (
                      <li key={p.id}>
                        {p.instagram ? (
                          <a href={`https://www.instagram.com/${p.instagram}/`} target="_blank" rel="noopener noreferrer" className="inline-block transition hover:-translate-y-0.5">
                            <Badge tier={tier}>@{p.instagram}</Badge>
                          </a>
                        ) : (
                          <Badge tier={tier}>{p.name}</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                )
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
