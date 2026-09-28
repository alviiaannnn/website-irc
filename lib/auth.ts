import { redirect } from 'next/navigation'
import { sessionDb } from './supabase'

export async function requireEditor() {
  const db = await sessionDb()
  const {
    data: { user },
  } = await db.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await db.from('profiles').select('full_name, role').eq('id', user.id).maybeSingle()
  if (!profile) redirect(`/admin/login?error=${encodeURIComponent('This account has no admin access.')}`)
  return { db, user, profile: profile as { full_name: string | null; role: 'admin' | 'editor' } }
}

export async function requireAdmin() {
  const ctx = await requireEditor()
  if (ctx.profile.role !== 'admin') redirect('/admin')
  return ctx
}
