import Image from 'next/image'
import Link from 'next/link'
import type { Settings } from '@/lib/data'
import { Wordmark } from './navbar'
import { Container, Ring } from './ui'

const explore = [
  ['/about', 'About'],
  ['/research', 'Research'],
  ['/gallery-news', 'Gallery & News'],
  ['/teams', 'Teams'],
  ['/sponsors', 'Sponsors'],
  ['/contact', 'Contact'],
]

export const icons = {
  instagram: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
  linkedin: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z',
  mail: 'M2 5h20v14H2zm2 2v.5l8 5 8-5V7zm16 10V9.8l-8 5-8-5V17z',
}

const heading = 'text-xs font-semibold tracking-[0.18em] text-navy-200 uppercase'

export function Footer({ settings }: { settings: Settings }) {
  const socials = [
    { href: settings.socials.instagram, label: 'Instagram', d: icons.instagram },
    { href: settings.socials.linkedin, label: 'LinkedIn', d: icons.linkedin },
    { href: settings.email && `mailto:${settings.email}`, label: 'Email', d: icons.mail },
  ].filter((i) => i.href)
  return (
    <footer className="relative overflow-hidden bg-secondary text-white">
      <Ring className="-right-44 -bottom-64 w-[24rem] border-[44px] md:-right-56 md:-bottom-72 md:w-[30rem] md:border-[56px]" />
      <Container className="relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={40} height={40} className="size-10 brightness-0 invert" />
            <Wordmark light />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-200">{settings.description}</p>
        </div>
        <nav aria-label="Footer">
          <h2 className={heading}>Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {explore.map(([href, label]) => (
              <li key={href}><Link href={href} className="text-sm font-medium text-white hover:underline">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className={heading}>Contact</h2>
          <address className="mt-4 space-y-2.5 text-sm leading-relaxed text-white not-italic">
            <p>{settings.address}</p>
            {settings.email && <p><a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a></p>}
          </address>
        </div>
        <div>
          <h2 className={heading}>Follow us</h2>
          <ul className="mt-4 flex gap-2">
            {socials.map((i) => (
              <li key={i.label}>
                <a href={i.href!} target={i.label === 'Email' ? undefined : '_blank'} rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 transition-colors hover:bg-white/20">
                  <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-white"><path d={i.d} /></svg>
                  <span className="sr-only">{i.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="relative border-t border-white/15">
        <Container className="py-6 text-xs text-navy-200">© {new Date().getFullYear()} {settings.org_name}. All rights reserved.</Container>
      </div>
    </footer>
  )
}
