import { redirect } from 'next/navigation'
import { cache } from 'react'
import { sessionDb } from './supabase'

// cache(): the layout and the page of one request share a single auth round trip.
export const requireEditor = cache(async () => {
  const db = await sessionDb()
  const {
    data: { user },
  } = await db.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await db.from('profiles').select('full_name, role').eq('id', user.id).maybeSingle()
  if (!profile) redirect(`/admin/login?error=${encodeURIComponent('This account has no admin access.')}`)
  return { db, user, profile: profile as { full_name: string | null; role: 'admin' | 'editor' } }
})

export async function requireAdmin() {
  const ctx = await requireEditor()
  if (ctx.profile.role !== 'admin') redirect('/admin')
  return ctx
}
