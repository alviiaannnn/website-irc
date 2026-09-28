'use server'

import { serviceDb } from '@/lib/supabase'

export type PledgeState = { ok?: string; error?: string } | null

/** Public support form. Saves an unpublished pledge; an editor publishes it after the payment arrives. */
export async function pledge(_prev: PledgeState, fd: FormData): Promise<PledgeState> {
  if (fd.get('botcheck')) return { ok: 'Thank you!' } // honeypot: bots get a fake success
  // ponytail: honeypot only; add Cloudflare Turnstile if spam pledges show up in the admin.
  const s = (k: string) => String(fd.get(k) ?? '').trim()
  const name = s('name')
  const instagram = s('instagram').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').split(/[/?#]/)[0].replace(/^@/, '')
  const amount = Number(s('amount'))
  const contact = s('contact')
  const message = s('message')
  if (name.length < 2 || name.length > 80) return { error: 'Please enter your name.' }
  if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) return { error: 'That Instagram username does not look right.' }
  if (!Number.isInteger(amount) || amount < 100000 || amount > 1000000000) return { error: 'The minimum contribution is IDR 100.000.' }
  if (contact.length < 5 || contact.length > 120) return { error: 'Add an email or WhatsApp number so we can reach you.' }
  if (message.length > 500) return { error: 'Please keep the message under 500 characters.' }

  // Service role: visitors get no insert rights on the table itself.
  const { error } = await serviceDb().from('supporters').insert({ name, instagram: instagram || null, amount, contact, message: message || null })
  if (error) return { error: 'Your pledge could not be saved. Please try again or contact us.' }
  return { ok: `Thank you, ${name}! We will reach you at ${contact} with the payment details.` }
}
