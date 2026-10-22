'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { homeOf, modules, pageNames, sectionInfo, sitePages, type Field } from '@/lib/admin'
import { requireAdmin, requireEditor } from '@/lib/auth'
import { isLinkLine } from '@/lib/text'
import { serviceDb, sessionDb } from '@/lib/supabase'

export type ActionState = { error?: string; ok?: string } | null

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const revalidateAll = () => revalidatePath('/', 'layout')
// Redirect back to a list page with a banner message.
const back = (path: string, msg: { ok: string } | { error: string }): never => redirect(`${path}?${new URLSearchParams(msg)}`)

function dbError(e: { code?: string; message: string }) {
  if (e.code === '23505') return 'That value is already used by another item (slugs must be unique).'
  if (e.code === '23503') return 'This item is still in use elsewhere.'
  if (e.code === '23514') return `A value is not allowed: ${e.message}`
  if (e.code === 'PGRST116') return 'Not found, or you do not have permission to change it.'
  return e.message
}

function parse(f: Field, fd: FormData): { value?: unknown; error?: string } {
  const raw = fd.get(f.name)
  const s = typeof raw === 'string' ? raw.trim() : ''
  if (f.type === 'bool') return { value: raw === 'on' }
  if (f.type === 'tags') return { value: s.split(',').map((t) => t.trim()).filter(Boolean) }
  if (f.type === 'lines') return { value: s.split('\n').map((t) => t.trim()).filter(Boolean) }
  if (f.type === 'buttons') {
    const lines = s.split('\n').map((t) => t.trim()).filter(Boolean)
    const bad = lines.find((l) => !isLinkLine(l))
    return bad ? { error: `${f.label}: "${bad}" needs the form Label | link (a link starts with /, #, https://, mailto: or tel:).` } : { value: lines }
  }
  if (f.type === 'gallery') return { value: fd.getAll(f.name).filter((v) => typeof v === 'string' && uuid.test(v)) }
  if (!s) return f.required ? { error: `${f.label} is required.` } : { value: null }
  const ok = {
    number: () => Number.isInteger(Number(s)),
    slug: () => /^[a-z0-9-]+$/.test(s),
    url: () => /^(https?:\/\/|\/)\S*$/.test(s),
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),
    date: () => /^\d{4}-\d{2}-\d{2}$/.test(s),
    select: () => !!f.options?.includes(s),
    ref: () => uuid.test(s),
    media: () => uuid.test(s),
  }[f.type as string]
  if (ok && !ok()) {
    const hint = { slug: 'use lowercase letters, numbers and dashes', url: 'start it with https:// or /' }[f.type as string]
    return { error: `${f.label} is not valid${hint ? ` (${hint})` : ''}.` }
  }
  return { value: f.type === 'number' ? Number(s) : s }
}

export async function saveRow(key: string, id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const mod = modules[key]
  if (!mod) return { error: 'Unknown module.' }
  const { db } = await requireEditor()
  const isNew = id === 'new'
  if (isNew && !mod.create) return { error: 'New items cannot be added here.' }

  const row: Record<string, unknown> = {}
  let gallery: string[] | null = null
  for (const f of mod.fields) {
    // Fields hidden from this form keep their stored value. (Unchecked boxes and an emptied gallery also send nothing, so those still count.)
    if (!fd.has(f.name) && f.type !== 'bool' && f.type !== 'gallery') continue
    const { value, error } = parse(f, fd)
    if (error) return { error }
    if (f.type === 'gallery') gallery = value as string[]
    else if (f.name.includes('.')) {
      const [col, k] = f.name.split('.')
      row[col] = { ...(row[col] as object), [k]: value ?? '' }
    } else row[f.name] = value
  }

  if (isNew && mod.sortable) {
    // New items go to the end of the list; drag them elsewhere afterwards.
    const { data: last } = await db.from(mod.table).select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
    row.sort_order = (last?.sort_order ?? -1) + 1
  }
  const res = isNew
    ? await db.from(mod.table).insert(row).select('id').single()
    : await db.from(mod.table).update(row).eq('id', id).select('id').single()
  if (res.error) return { error: dbError(res.error) }
  const rowId: string = res.data.id

  if (gallery) {
    const del = await db.from('project_media').delete().eq('project_id', rowId)
    if (del.error) return { error: dbError(del.error) }
    if (gallery.length) {
      const ins = await db.from('project_media').insert(gallery.map((media_id, i) => ({ project_id: rowId, media_id, sort_order: i })))
      if (ins.error) return { error: dbError(ins.error) }
    }
  }
  revalidateAll()
  if (isNew) redirect(`/admin/${key}/${rowId}?saved=1`)
  return { ok: 'Saved. The public site shows the change on the next page load.' }
}

/** Drag-and-drop ordering: sort_order follows the given id order. */
export async function reorder(key: string, ids: string[]): Promise<ActionState> {
  const mod = modules[key]
  if (!mod?.sortable) return { error: 'This list cannot be reordered.' }
  const { db } = await requireEditor()
  if (!ids.every((id) => uuid.test(id))) return { error: 'Unknown item.' }
  const results = await Promise.all(ids.map((id, i) => db.from(mod.table).update({ sort_order: i + 1 }).eq('id', id)))
  const failed = results.find((r) => r.error)
  if (failed?.error) return { error: dbError(failed.error) }
  revalidateAll()
  return { ok: 'Order saved.' }
}

export async function deleteRow(key: string, id: string) {
  const mod = modules[key]
  const { db } = await requireEditor()
  const list = `/admin/${key}`
  if (!mod?.create) back(list, { error: 'Items here cannot be deleted.' })
  // RLS turns a forbidden delete into "0 rows" without an error, so check what was removed.
  const { data, error } = await db.from(mod.table).delete().eq('id', id).select('id')
  if (error) back(list, { error: dbError(error) })
  if (!data?.length) back(list, { error: 'Nothing was deleted: the item is gone or your account may not edit it.' })
  revalidateAll()
  back(list, { ok: 'Deleted.' })
}

/** After uploads done from the browser (bulk gallery, media library). */
export async function revalidateSite() {
  await requireEditor()
  revalidateAll()
}

// ---------- search ----------
export type SearchEntry = { title: string; where: string; href: string; text?: string }

/** Everything an editor might look for, with where it shows on the site. Loaded once when the search box is focused. */
export async function searchIndex(): Promise<SearchEntry[]> {
  const { db } = await requireEditor()
  const out: SearchEntry[] = sitePages.map((p) => ({ title: `${p.name} page`, where: `Website page · ${p.path}`, href: `/admin/pages/${p.slug}` }))
  out.push({ title: 'Settings', where: 'Contact details, social links, share image', href: '/admin/settings' }, { title: 'Photos', where: 'Photo library', href: '/admin/media' })
  const { data: sections } = await db.from('page_sections').select('id,page,key,title,body')
  for (const r of sections ?? [])
    out.push({
      title: r.title || r.body?.split('\n')[0].replace(/^- /, '').slice(0, 80) || r.key,
      where: `${pageNames[r.page] ?? r.page} page · ${sectionInfo(r.page, r.key)?.label ?? r.key}`,
      href: `/admin/page-sections/${r.id}`,
      text: r.body?.slice(0, 400),
    })
  await Promise.all(
    Object.entries(modules)
      .filter(([k, m]) => k !== 'page-sections' && !m.singleton)
      .map(async ([k, m]) => {
        const { data } = await db.from(m.table).select(`id, ${m.label}`)
        const page = sitePages.find((p) => homeOf(k).startsWith(`/admin/pages/${p.slug}#`))?.name
        for (const r of (data ?? []) as unknown as Record<string, string>[])
          out.push({ title: r[m.label] || 'Untitled', where: [m.title, page && `${page} page`].filter(Boolean).join(' · '), href: `/admin/${k}/${r.id}` })
      }),
  )
  return out
}

// ---------- media ----------
export async function updateMediaAlt(id: string, fd: FormData) {
  const { db } = await requireEditor()
  const alt = String(fd.get('alt') ?? '').trim()
  if (!alt) back('/admin/media', { error: 'Alt text is required.' })
  const { error } = await db.from('media').update({ alt }).eq('id', id)
  if (error) back(`/admin/media`, { error: dbError(error) })
  revalidateAll()
  back('/admin/media', { ok: 'Alt text saved.' })
}

export async function replaceMedia(id: string, file: { path: string; width: number; height: number; mime: string; size_bytes: number }) {
  const { db } = await requireEditor()
  const { data: old } = await db.from('media').select('path').eq('id', id).single()
  const { error } = await db.from('media').update(file).eq('id', id)
  if (error) return { error: dbError(error) }
  if (old && old.path !== file.path) await db.storage.from('media').remove([old.path])
  revalidateAll()
  return { ok: 'Photo replaced everywhere it is used.' }
}

export async function deleteMedia(id: string) {
  const { db } = await requireEditor()
  const { data: m } = await db.from('media').select('path').eq('id', id).single()
  // Foreign keys block this while the photo is used anywhere.
  const { data: gone, error } = await db.from('media').delete().eq('id', id).select('id')
  if (!error && !gone?.length) back('/admin/media', { error: 'Nothing was deleted: the photo is gone or your account may not edit it.' })
  if (error) back(`/admin/media`, { error: error.code === '23503' ? 'This photo is in use. Remove it from those items first.' : dbError(error) })
  if (m) await db.storage.from('media').remove([m.path])
  revalidateAll()
  back('/admin/media', { ok: 'Photo deleted.' })
}

// ---------- accounts ----------
export async function inviteUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { db } = await requireAdmin()
  const email = String(fd.get('email') ?? '').trim()
  const full_name = String(fd.get('full_name') ?? '').trim() || null
  const role = fd.get('role') === 'admin' ? 'admin' : 'editor'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' }
  const { data, error } = await serviceDb().auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/accept-invite`,
  })
  if (error) return { error: error.message }
  const res = await db.from('profiles').upsert({ id: data.user.id, full_name, role })
  if (res.error) return { error: dbError(res.error) }
  revalidatePath('/admin/users')
  return { ok: `Invitation sent to ${email}.` }
}

export async function setRole(userId: string, fd: FormData) {
  const { db, user } = await requireAdmin()
  if (userId === user.id) back('/admin/users', { error: 'You cannot change your own role.' })
  const role = fd.get('role') === 'admin' ? 'admin' : 'editor'
  const { error } = await db.from('profiles').update({ role }).eq('id', userId)
  if (error) back(`/admin/users`, { error: dbError(error) })
  back('/admin/users', { ok: 'Role updated.' })
}

export async function removeUser(userId: string) {
  const { user } = await requireAdmin()
  if (userId === user.id) back('/admin/users', { error: 'You cannot remove your own account.' })
  const { error } = await serviceDb().auth.admin.deleteUser(userId)
  if (error) back(`/admin/users`, { error: error.message })
  back('/admin/users', { ok: 'Account removed.' })
}

// ---------- session ----------
export async function signIn(fd: FormData) {
  const db = await sessionDb()
  const { error } = await db.auth.signInWithPassword({
    email: String(fd.get('email') ?? ''),
    password: String(fd.get('password') ?? ''),
  })
  if (error) back(`/admin/login`, { error: error.message })
  redirect('/admin')
}

export async function signOut() {
  const db = await sessionDb()
  await db.auth.signOut()
  redirect('/admin/login')
}
