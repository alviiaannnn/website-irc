import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { icons } from '@/components/footer'
import { Container, PageHeader, Rows } from '@/components/ui'
import { getSections, getSettings } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact IPB Robotic Club about sponsorship, research collaboration, or media enquiries.',
}

const whatsapp = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z'

export default async function Contact() {
  const [s, settings] = await Promise.all([getSections('contact'), getSettings()])
  const wa = settings.phone?.replace(/\D/g, '').replace(/^0/, '62')
  const details = [
    settings.email && { label: 'Email', value: settings.email, href: `mailto:${settings.email}`, d: icons.mail },
    wa && { label: 'WhatsApp', value: settings.phone, href: `https://wa.me/${wa}`, d: whatsapp },
    settings.socials.instagram && { label: 'Instagram', value: '@' + settings.socials.instagram.replace(/\/$/, '').split('/').pop(), href: settings.socials.instagram, d: icons.instagram },
    settings.socials.linkedin && { label: 'LinkedIn', value: settings.org_name, href: settings.socials.linkedin, d: icons.linkedin },
  ].filter((x) => !!x)

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={s.intro?.title}
        body={s.intro?.body}
        aside={
          <div className="w-full">
            <Rows
              dark
              items={details.map((d) => ({
                key: d.label,
                title: (
                  <a href={d.href} target={d.label === 'Email' ? undefined : '_blank'} rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:underline">
                    <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-white"><path d={d.d} /></svg>
                    {d.label}
                  </a>
                ),
                detail: <span className="break-all">{d.value}</span>,
              }))}
            />
            {settings.address && <p className="mt-6 text-sm leading-relaxed text-navy-200">{settings.address}</p>}
          </div>
        }
      />
      <section className="py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Send us a message</h2>
            <p className="mt-3 text-navy-600">We read every message and usually reply within a few days.</p>
            {settings.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block font-medium text-navy-900 underline underline-offset-4"
              >
                Open the lab in Google Maps
              </a>
            )}
          </div>
          <ContactForm email={settings.email} />
        </Container>
      </section>
    </>
  )
}
