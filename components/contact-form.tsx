'use client'

import { useEffect, useRef, useState } from 'react'
import { labels } from '@/lib/text'

// Built-in texts; Admin → Contact → "Message form labels" / "Topic choices" replace them line by line.
const defaultLabels = [
  'Name', 'Email', 'Organization', '(optional)', 'Topic', 'Message', 'Send message', 'Sending…', 'Thank you!',
  'Your message has been sent. We will get back to you soon.', 'Send another message', 'Sorry, the message could not be sent.', 'Please email us at',
] as const
const topicValues = ['sponsorship', 'collaboration', 'media', 'general'] as const
const defaultTopics = ['Sponsorship', 'Research collaboration', 'Media/press', 'General'] as const

const field = 'mt-1.5 block w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-ink transition-colors focus:border-secondary'

export function ContactForm({ email, labels: labelText, topics: topicText }: { email: string | null; labels: string | null; topics: string | null }) {
  const [nameL, emailL, orgL, optionalL, topicL, messageL, sendL, sendingL, thanksL, sentL, againL, errorL, emailUsL] = labels(labelText, defaultLabels)
  const topicLabels = labels(topicText, defaultTopics)
  const topics = topicValues.map((value, i) => ({ value, label: topicLabels[i] }))
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const topicRef = useRef<HTMLSelectElement>(null)

  // "Become a Sponsor" links arrive as /contact?topic=sponsorship.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('topic')
    if (t && topicRef.current && topicValues.some((v) => v === t)) topicRef.current.value = t
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
        <p className="text-2xl font-semibold tracking-tight text-navy-900">{thanksL}</p>
        <p className="mt-2 text-navy-600">{sentL}</p>
        <button type="button" onClick={() => setState('idle')} className="mt-6 font-semibold text-secondary underline">{againL}</button>
      </div>
    )

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-navy-800">
        {nameL}
        <input name="name" required minLength={2} autoComplete="name" className={field} />
      </label>
      <label className="text-sm font-medium text-navy-800">
        {emailL}
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-sm font-medium text-navy-800">
        {orgL} <span className="font-normal text-navy-600">{optionalL}</span>
        <input name="organization" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm font-medium text-navy-800">
        {topicL}
        <select ref={topicRef} name="topic" defaultValue="general" className={field}>
          {topics.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-navy-800 sm:col-span-2">
        {messageL}
        <textarea name="message" required minLength={10} rows={6} className={field} />
      </label>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex min-h-12 items-center rounded-xl bg-secondary px-6 font-semibold text-white transition-colors hover:bg-navy-900 disabled:opacity-60"
        >
          {state === 'sending' ? sendingL : sendL}
        </button>
        {state === 'error' && (
          <p role="alert" className="text-primary-ink">
            {errorL}{email && <> {emailUsL} <a href={`mailto:${email}`} className="font-semibold underline">{email}</a>.</>}
          </p>
        )}
      </div>
    </form>
  )
}
