import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { getSettings } from '@/lib/data'

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const settings = await getSettings()
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
      <Navbar orgName={settings.org_name} />
      <main id="main" className="flex-1">{children}</main>
      <Footer settings={settings} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  )
}
