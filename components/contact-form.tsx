'use client'

import { useEffect, useRef, useState } from 'react'

const topics = [
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'collaboration', label: 'Research collaboration' },
  { value: 'media', label: 'Media/press' },
  { value: 'general', label: 'General' },
]

const field = 'mt-1.5 block w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-ink transition-colors focus:border-secondary'

export function ContactForm({ email }: { email: string | null }) {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const topicRef = useRef<HTMLSelectElement>(null)

  // "Become a Sponsor" links arrive as /contact?topic=sponsorship.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('topic')
    if (t && topicRef.current && topics.some((x) => x.value === t)) topicRef.current.value = t
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const topic = topics.find((t) => t.value === data.get('topic'))?.label ?? 'General'
    data.set('topic', topic)
    data.set('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '')
    data.set('subject', `[IRC Website] ${topic} — ${data.get('name')}`)
    data.set('from_name', 'IRC Website')
    setState('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      form.reset()
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success')
    return (
      <div role="status" className="rounded-2xl border border-navy-200/70 p-8">
        <p className="text-2xl font-semibold tracking-tight text-navy-900">Thank you!</p>
        <p className="mt-2 text-navy-600">Your message has been sent. We will get back to you soon.</p>
        <button type="button" onClick={() => setState('idle')} className="mt-6 font-semibold text-secondary underline">Send another message</button>
      </div>
    )

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-navy-800">
        Name
        <input name="name" required minLength={2} autoComplete="name" className={field} />
      </label>
      <label className="text-sm font-medium text-navy-800">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-sm font-medium text-navy-800">
        Organization <span className="font-normal text-navy-600">(optional)</span>
        <input name="organization" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm font-medium text-navy-800">
        Topic
        <select ref={topicRef} name="topic" defaultValue="general" className={field}>
          {topics.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-navy-800 sm:col-span-2">
        Message
        <textarea name="message" required minLength={10} rows={6} className={field} />
      </label>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex min-h-12 items-center rounded-xl bg-secondary px-6 font-semibold text-white transition-colors hover:bg-navy-900 disabled:opacity-60"
        >
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {state === 'error' && (
          <p role="alert" className="text-primary-ink">
            Sorry, the message could not be sent.{email && <> Please email us at <a href={`mailto:${email}`} className="font-semibold underline">{email}</a>.</>}
          </p>
        )}
      </div>
    </form>
  )
}
