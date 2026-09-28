'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { btnCls, inputCls } from '@/lib/admin'
import { browserDb } from '@/lib/supabase-browser'

// Invite links land here with the session in the URL hash (#access_token=…&refresh_token=…).
export default function AcceptInvite() {
  const router = useRouter()
  const [ready, setReady] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const access_token = hash.get('access_token')
    const refresh_token = hash.get('refresh_token')
    const db = browserDb()
    const session = access_token && refresh_token ? db.auth.setSession({ access_token, refresh_token }) : db.auth.getSession()
    session.then(({ data }) => {
      history.replaceState(null, '', window.location.pathname)
      setReady(!!data.session)
    })
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const password = String(new FormData(e.currentTarget).get('password'))
    setBusy(true)
    const { error } = await browserDb().auth.updateUser({ password })
    setBusy(false)
    if (error) return setError(error.message)
    router.push('/admin')
  }

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 border border-navy-200/70">
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900">Set your password</h1>
        {ready === null && <p>Checking your invitation…</p>}
        {ready === false && <p role="alert" className="text-primary-ink">This invitation link is invalid or expired. Ask an admin to invite you again.</p>}
        {ready && (
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-navy-800">
              New password (min. 8 characters)
              <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
            </label>
            {error && <p role="alert" className="text-primary-ink">{error}</p>}
            <button disabled={busy} className={`${btnCls} w-full justify-center`}>{busy ? 'Saving…' : 'Save and continue'}</button>
          </form>
        )}
      </div>
    </main>
  )
}
