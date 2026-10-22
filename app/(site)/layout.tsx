import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { getSections, getSettings } from '@/lib/data'
import { listItems, parseLink } from '@/lib/text'

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const [settings, s] = await Promise.all([getSettings(), getSections('site')])
  // Admin → Menu & footer → Top menu: "- Label | link", indented lines go in the dropdown.
  const links = listItems(s.nav?.body).map((n) => ({ ...parseLink(n.text), children: n.children.map((c) => parseLink(c.text)) }))
  const button = s['nav-button']?.buttons[0] ? parseLink(s['nav-button'].buttons[0]) : null
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.org_name,
    url: site,
    logo: `${site}/brand/logo.png`,
    email: settings.email,
    address: settings.address,
    parentOrganization: { '@type': 'CollegeOrUniversity', name: 'IPB University' },
    sameAs: Object.values(settings.socials).filter(Boolean),
  }
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold text-secondary focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <Navbar orgName={settings.org_name} links={links} button={button} />
      <main id="main" className="flex-1">{children}</main>
      <Footer settings={settings} s={s} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  )
}
