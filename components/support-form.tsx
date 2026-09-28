'use client'

import { useActionState, useTransition } from 'react'
import { pledge } from '@/app/(site)/sponsors/actions'

const field = 'mt-1.5 block w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-ink transition-colors focus:border-secondary'
const label = 'text-sm font-medium text-navy-800'

export function SupportForm() {
  const [state, action, pending] = useActionState(pledge, null)
  const [, start] = useTransition()

  if (state?.ok)
    return (
      <div role="status" className="rounded-2xl border border-navy-200/70 p-8">
        <p className="text-2xl font-semibold tracking-tight text-navy-900">Thank you for supporting IRC!</p>
        <p className="mt-2 text-navy-600">{state.ok}</p>
      </div>
    )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        start(() => action(fd))
        // Email heads-up to IRC; the pledge itself is already stored by the action.
        const note = new FormData()
        note.set('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '')
        note.set('subject', `[IRC Website] New supporter pledge — ${fd.get('name')}`)
        note.set('from_name', 'IRC Website')
        for (const k of ['name', 'instagram', 'amount', 'contact', 'message', 'botcheck']) note.set(k, String(fd.get(k) ?? ''))
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: note }).catch(() => {})
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <label className={label}>
        Name
        <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
      </label>
      <label className={label}>
        Instagram username <span className="font-normal text-navy-600">(for the thank-you tag)</span>
        <input name="instagram" maxLength={60} placeholder="@yourname" autoComplete="off" className={field} />
      </label>
      <label className={label}>
        Amount (IDR)
        <input name="amount" type="number" required min={100000} step={1000} defaultValue={100000} className={`${field} font-mono`} />
      </label>
      <label className={label}>
        Email or WhatsApp
        <input name="contact" required minLength={5} maxLength={120} className={field} />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Message <span className="font-normal text-navy-600">(optional)</span>
        <textarea name="message" rows={3} maxLength={500} className={field} />
      </label>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center rounded-xl bg-primary-ink px-6 font-semibold text-white transition hover:brightness-90 disabled:opacity-60">
          {pending ? 'Sending…' : 'Support IRC'}
        </button>
        {state?.error && <p role="alert" className="text-primary-ink">{state.error}</p>}
      </div>
    </form>
  )
}
