'use client'

import Image from 'next/image'
import Link, { useLinkStatus } from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useActionState, useEffect, useMemo, useRef, useState, useTransition, type ComponentProps, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { reorder, replaceMedia, revalidateSite, searchIndex, type ActionState, type SearchEntry } from '@/app/admin/actions'
import { btnCls, btnGhost, inputCls } from '@/lib/admin'
import type { Media } from '@/lib/data'
import { mediaUrl } from '@/lib/media'
import { browserDb } from '@/lib/supabase-browser'

// ---------- icons (24px stroke icons, drawn inline so nothing extra is loaded) ----------
const paths = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  pages: 'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 13h6M9 17h6',
  photo: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3 16l5-5 4 4 3-3 6 6M15.5 9.5h.01',
  settings: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  grip: 'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  up: 'M12 19V5M5 12l7-7 7 7',
  down: 'M12 5v14M19 12l-7 7-7-7',
  left: 'M19 12H5M12 19l-7-7 7-7',
  right: 'M5 12h14M12 5l7 7-7 7',
  chevron: 'M9 18l6-6-6-6',
  external: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6 9 17l-5-5',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  text: 'M4 7V4h16v3M9 20h6M12 4v16',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
}
export type IconName = keyof typeof paths
export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={name === 'grip' ? 3 : 1.8} strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d={paths[name]} />
    </svg>
  )
}

export function Spinner({ className = 'size-4' }: { className?: string }) {
  return <span aria-hidden className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} />
}

// ---------- navigation feedback ----------
/** Thin bar at the top of the screen while a clicked link is still loading. */
function PendingBar() {
  const { pending } = useLinkStatus()
  return <span aria-hidden className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary ${pending ? 'nav-progress' : 'scale-x-0 opacity-0'}`} />
}

/** Link with loading feedback. Use it for every link inside the admin. */
export function AdminLink({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      {children}
      <PendingBar />
    </Link>
  )
}

export function NavLink({ href, icon, children, sub }: { href: string; icon?: IconName; children: ReactNode; sub?: boolean }) {
  const path = usePathname()
  const active = href === '/admin' ? path === href : path === href || path.startsWith(`${href}/`)
  return (
    <AdminLink
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 font-medium whitespace-nowrap transition-colors ${sub ? 'py-1.5 text-[13px]' : 'py-2.5 text-sm'} ${
        active ? 'bg-white/12 text-white' : 'text-navy-200 hover:bg-white/6 hover:text-white'
      }`}
    >
      {icon && <Icon name={icon} />}
      {sub && <span aria-hidden className={`ml-2 size-1.5 rounded-full ${active ? 'bg-primary' : 'bg-navy-400'}`} />}
      {children}
    </AdminLink>
  )
}

/** Submit button that shows a spinner while its form's Server Action runs. */
export function SubmitButton({ children, className = btnCls, pendingLabel }: { children: ReactNode; className?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending && <Spinner />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  )
}

// ---------- search ----------
/** Search box for every page section and content item. The index loads on first focus. */
export function Finder() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')
      if ((e.key === '/' && !typing) || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  async function load() {
    setOpen(true)
    if (index || loading) return
    setLoading(true)
    setIndex(await searchIndex())
    setLoading(false)
  }
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const results = words.length ? (index ?? []).filter((e) => words.every((w) => `${e.title} ${e.where} ${e.text ?? ''}`.toLowerCase().includes(w))).slice(0, 8) : []
  const go = (e: SearchEntry) => {
    setOpen(false)
    setQ('')
    input.current?.blur()
    router.push(e.href)
  }

  return (
    <div className="relative w-full max-w-md">
      <label className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-3 shadow-xs transition focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/10">
        <Icon name="search" className="size-4 text-navy-400" />
        <span className="sr-only">Search the website content</span>
        <input
          ref={input}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={load}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(a - 1, 0))
            } else if (e.key === 'Enter' && results[active]) {
              e.preventDefault()
              go(results[active])
            } else if (e.key === 'Escape') input.current?.blur()
          }}
          placeholder="Find a heading, person, project…"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="finder-results"
          className="min-h-10 w-full bg-transparent text-sm text-ink placeholder:text-navy-400 focus:outline-none"
        />
        {loading ? <Spinner className="size-4 text-navy-400" /> : <kbd className="hidden rounded-md border border-navy-200 px-1.5 font-mono text-[11px] text-navy-400 sm:block">/</kbd>}
      </label>
      {open && words.length > 0 && (
        <ul id="finder-results" role="listbox" className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-navy-200/70 bg-white p-1.5 shadow-xl shadow-navy-900/10">
          {results.map((r, i) => (
            <li key={r.href + r.title} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(r)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left ${i === active ? 'bg-surface' : ''}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-navy-900">{r.title}</span>
                  <span className="block truncate text-xs text-navy-600">{r.where}</span>
                </span>
                <Icon name="chevron" className="size-4 text-navy-400" />
              </button>
            </li>
          ))}
          {loading && <li className="flex items-center gap-2 px-3 py-3 text-sm text-navy-600"><Spinner /> Loading…</li>}
          {!loading && results.length === 0 && <li className="px-3 py-3 text-sm text-navy-600">Nothing found for “{q}”.</li>}
        </ul>
      )}
    </div>
  )
}

// ---------- forms ----------
/** Form bound to a Server Action; submitted manually so inputs are not reset on error. */
export function AdminForm({
  action,
  children,
  submitLabel = 'Save changes',
  initialOk,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>
  children: ReactNode
  submitLabel?: string
  initialOk?: string
}) {
  const [state, formAction, pending] = useActionState(action, initialOk ? { ok: initialOk } : null)
  const [dirty, setDirty] = useState(false)
  const [, start] = useTransition()
  return (
    <form
      onChange={() => setDirty(true)}
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        setDirty(false)
        start(() => formAction(fd))
      }}
    >
      <div className="space-y-6">{children}</div>
      <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-b-2xl border-t border-navy-200/70 bg-white/95 px-6 py-4 backdrop-blur">
        <button type="submit" disabled={pending} className={btnCls}>
          {pending ? <Spinner /> : <Icon name="check" className="size-4" />}
          {pending ? 'Saving…' : submitLabel}
        </button>
        {dirty && !pending ? <p className="text-sm text-navy-600">Unsaved changes</p> : <Status state={state} />}
      </div>
    </form>
  )
}

export function Status({ state }: { state: ActionState }) {
  if (state?.error) return <p role="alert" className="text-sm font-medium text-primary-ink">{state.error}</p>
  if (state?.ok) return <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-tier-green"><Icon name="check" className="size-4" />{state.ok}</p>
  return null
}

/** ok / error banner after a redirect (?ok=… or ?error=…). */
export function Flash({ ok, error }: { ok?: unknown; error?: unknown }) {
  if (!ok && !error) return null
  return (
    <p
      role={error ? 'alert' : 'status'}
      className={`fade-up flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${error ? 'border-primary/30 bg-primary/5 text-primary-ink' : 'border-tier-green/30 bg-tier-green/5 text-tier-green'}`}
    >
      {!error && <Icon name="check" className="size-4" />}
      {String(error ?? ok)}
    </p>
  )
}

// ---------- ordered lists ----------
export type ListItem = { id: string; href: string; title: string; meta: string; thumb?: { path: string; alt: string } | null; badges: string[] }

/**
 * Content list with drag-and-drop ordering (plus arrow buttons for keyboard and touch).
 * Every move is saved right away, so the order is visible without opening an item.
 */
export function SortableList({ module, items: initial, layout = 'list', sortable = true, thumbs = true }: { module: string; items: ListItem[]; layout?: 'list' | 'grid'; sortable?: boolean; thumbs?: boolean }) {
  const [items, setItems] = useState(initial)
  const [prev, setPrev] = useState(initial)
  if (prev !== initial) {
    setPrev(initial)
    setItems(initial)
  }
  const [dragging, setDragging] = useState<string | null>(null)
  const before = useRef<string[]>([])
  const [state, setState] = useState<ActionState>(null)
  const [saving, start] = useTransition()

  const save = (next: ListItem[]) => {
    setItems(next)
    start(async () => setState(await reorder(module, next.map((i) => i.id))))
  }
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return
    const next = [...items]
    next.splice(to, 0, ...next.splice(from, 1))
    save(next)
  }
  const dragOver = (overId: string) => {
    if (!dragging || dragging === overId) return
    setItems((list) => {
      const from = list.findIndex((i) => i.id === dragging)
      const to = list.findIndex((i) => i.id === overId)
      const next = [...list]
      next.splice(to, 0, ...next.splice(from, 1))
      return next
    })
  }
  const drop = () => {
    setDragging(null)
    if (items.map((i) => i.id).join() !== before.current.join()) save(items)
  }

  const grid = layout === 'grid'
  const arrow = 'grid size-8 place-items-center rounded-lg text-navy-600 transition hover:bg-surface hover:text-navy-900 disabled:opacity-30'
  return (
    <div>
      {sortable && items.length > 1 && (
        <div className="mb-3 flex min-h-5 items-center gap-2 text-xs text-navy-600" aria-live="polite">
          {saving ? (
            <><Spinner className="size-3.5" /> Saving order…</>
          ) : state ? (
            <Status state={state} />
          ) : (
            <><Icon name="grip" className="size-4 text-navy-400" /> Drag items (or use the arrows) to change their order on the website. Saved automatically.</>
          )}
        </div>
      )}
      <ul className={grid ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4' : 'divide-y divide-navy-200/70 overflow-hidden rounded-2xl border border-navy-200/70 bg-white'}>
        {items.map((it, i) => (
          <li
            key={it.id}
            draggable={sortable}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move'
              before.current = items.map((x) => x.id)
              setDragging(it.id)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              dragOver(it.id)
            }}
            onDrop={(e) => e.preventDefault()}
            onDragEnd={drop}
            className={`group relative transition ${dragging === it.id ? 'opacity-40' : ''} ${grid ? 'overflow-hidden rounded-2xl border border-navy-200/70 bg-white hover:border-navy-400 hover:shadow-md' : 'flex items-center gap-1 bg-white pr-2 hover:bg-surface/60'}`}
          >
            {grid ? (
              <>
                <AdminLink href={it.href} draggable={false} className="block">
                  <span className="relative block aspect-square bg-surface">
                    {it.thumb && <Image src={mediaUrl(it.thumb.path)} alt={it.thumb.alt} fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" draggable={false} />}
                  </span>
                  <span className="block p-3">
                    <span className="block truncate text-sm font-medium text-navy-900">{it.title}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-navy-600">
                      <span className="truncate">{it.meta}</span>
                      {it.badges.map((b) => <Badge key={b}>{b}</Badge>)}
                    </span>
                  </span>
                </AdminLink>
                {sortable && (
                  <span className="absolute top-2 right-2 flex gap-0.5 rounded-lg bg-white/95 p-0.5 shadow-sm transition sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                    <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${it.title} earlier`} className={arrow}><Icon name="left" className="size-4" /></button>
                    <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${it.title} later`} className={arrow}><Icon name="right" className="size-4" /></button>
                  </span>
                )}
              </>
            ) : (
              <>
                {sortable && <span aria-hidden className="hidden cursor-grab pl-3 text-navy-400 active:cursor-grabbing sm:block"><Icon name="grip" className="size-4" /></span>}
                <AdminLink href={it.href} draggable={false} className={`flex min-w-0 flex-1 items-center gap-4 py-3 ${sortable ? 'pl-4 sm:pl-2' : 'pl-4'}`}>
                  {thumbs && (
                    <span className="relative block size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                      {it.thumb && <Image src={mediaUrl(it.thumb.path)} alt={it.thumb.alt} fill sizes="48px" className="object-cover" draggable={false} />}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                      <span className="truncate">{it.title}</span>
                      {it.badges.map((b) => <Badge key={b}>{b}</Badge>)}
                    </span>
                    {it.meta && <span className="block truncate text-sm text-navy-600">{it.meta}</span>}
                  </span>
                </AdminLink>
                {sortable && (
                  <span className="flex shrink-0">
                    <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${it.title} up`} className={arrow}><Icon name="up" className="size-4" /></button>
                    <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${it.title} down`} className={arrow}><Icon name="down" className="size-4" /></button>
                  </span>
                )}
                <Icon name="chevron" className="hidden size-4 text-navy-400 sm:block" />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Badge({ children }: { children: ReactNode }) {
  const tone = children === 'Hidden' ? 'bg-navy-200/60 text-navy-800' : children === 'Featured' ? 'bg-primary/10 text-primary-ink' : 'bg-surface text-navy-600'
  return <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{children}</span>
}

// ---------- uploads (browser → Supabase Storage; bucket enforces type and 5 MB) ----------
const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX = 5 * 1024 * 1024

async function uploadFile(file: File) {
  if (!TYPES.includes(file.type)) throw new Error(`${file.name}: only JPG, PNG or WebP.`)
  if (file.size > MAX) throw new Error(`${file.name}: larger than 5 MB.`)
  const bmp = await createImageBitmap(file)
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const path = `uploads/${crypto.randomUUID()}.${ext}`
  const { error } = await browserDb().storage.from('media').upload(path, file, { contentType: file.type })
  if (error) throw new Error(error.message)
  return { path, width: bmp.width, height: bmp.height, mime: file.type, size_bytes: file.size }
}

/** Uploads a photo and saves it in the media library, so it can be reused anywhere. */
export async function uploadImage(file: File, alt: string): Promise<Media> {
  if (!alt.trim()) throw new Error('Describe the photo (alt text) first.')
  const meta = await uploadFile(file)
  const { data, error } = await browserDb().from('media').insert({ ...meta, alt: alt.trim() }).select('id,path,alt,width,height').single()
  if (error) throw new Error(error.message)
  return data
}

function Thumb({ m, className = 'size-16' }: { m: Media; className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-lg bg-surface ${className}`}>
      <Image src={mediaUrl(m.path)} alt={m.alt} fill sizes="200px" className="object-cover" />
    </span>
  )
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open) ref.current?.showModal()
    else ref.current?.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      // The dialog sits inside the edit form: Enter in its search/alt inputs must not save that form.
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && e.preventDefault()}
      aria-label={title}
      className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-2xl p-0 backdrop:bg-navy-900/60"
    >
      <div className="flex items-center justify-between border-b border-navy-200/70 px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-navy-900">{title}</h2>
        <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-lg text-navy-600 hover:bg-surface" aria-label="Close">✕</button>
      </div>
      <div className="max-h-[75dvh] overflow-y-auto p-6">{open && children}</div>
    </dialog>
  )
}

function UploadPanel({ onUploaded }: { onUploaded: (m: Media) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [alt, setAlt] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const preview = useMemo(() => file && URL.createObjectURL(file), [file])
  async function go() {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      onUploaded(await uploadImage(file, alt))
      setFile(null)
      setAlt('')
    } catch (e) {
      setErr((e as Error).message)
    }
    setBusy(false)
  }
  return (
    <div className="space-y-4">
      <label className="relative grid min-h-48 cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-navy-200 bg-surface text-center hover:border-navy-400">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="max-h-64 object-contain" />
        ) : (
          <span className="px-6 text-sm text-navy-600">
            <span className="block text-base font-semibold text-navy-900">Click to choose a photo</span>
            or drag it here · JPG, PNG or WebP, max 5 MB
          </span>
        )}
        <input type="file" accept={TYPES.join(',')} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Choose a photo" />
      </label>
      {file && (
        <>
          <label className="block text-sm font-medium text-navy-800">
            Describe the photo <span className="font-normal text-navy-600">(alt text, required)</span>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} className={inputCls} placeholder="e.g. IRC team with the racing plane at KRTI 2025" autoFocus />
          </label>
          <button type="button" onClick={go} disabled={busy || !alt.trim()} className={btnCls}>{busy && <Spinner />}{busy ? 'Uploading…' : 'Upload and use this photo'}</button>
        </>
      )}
      {err && <p role="alert" className="text-sm text-primary-ink">{err}</p>}
    </div>
  )
}

/** Dialog with every saved photo (with previews) plus an upload tab. */
function MediaPicker({ open, onClose, library, onPick }: { open: boolean; onClose: () => void; library: Media[]; onPick: (m: Media) => void }) {
  const router = useRouter()
  const [tab, setTab] = useState<'library' | 'upload'>('library')
  const [q, setQ] = useState('')
  const shown = library.filter((m) => m.alt.toLowerCase().includes(q.toLowerCase()))
  const pick = (m: Media) => {
    onPick(m)
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose} title="Choose a photo">
      <div className="mb-5 inline-flex gap-1 rounded-xl bg-surface p-1">
        {(['library', 'upload'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t} className={`min-h-9 rounded-lg px-4 text-sm font-medium ${tab === t ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-600'}`}>
            {t === 'library' ? `Saved photos (${library.length})` : 'Upload new'}
          </button>
        ))}
      </div>
      {tab === 'library' ? (
        <>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by description…" aria-label="Search photos" className={`${inputCls} mt-0 mb-4`} />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {shown.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => pick(m)} className="group block w-full text-left">
                  <Thumb m={m} className="aspect-square w-full ring-secondary group-hover:ring-2" />
                  <span className="mt-1.5 line-clamp-2 text-xs text-navy-600">{m.alt}</span>
                </button>
              </li>
            ))}
          </ul>
          {shown.length === 0 && <p className="text-sm text-navy-600">No photos match.</p>}
        </>
      ) : (
        <UploadPanel
          onUploaded={(m) => {
            pick(m)
            setTab('library')
            router.refresh() // other photo fields on the page see the new photo too
          }}
        />
      )}
    </Modal>
  )
}

/** Single photo field: preview + choose from saved photos or upload. */
export function MediaField({ name, label, required, initial, library }: { name: string; label: string; required?: boolean; initial: Media | null; library: Media[] }) {
  const [media, setMedia] = useState(initial)
  const [open, setOpen] = useState(false)
  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy-800">{label}{required && ' *'}</legend>
      <input type="hidden" name={name} value={media?.id ?? ''} />
      <div className="mt-1.5 flex flex-wrap items-center gap-4">
        {media ? (
          <Thumb m={media} className="aspect-[4/3] w-48" />
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="grid aspect-[4/3] w-48 place-items-center rounded-lg border-2 border-dashed border-navy-200 text-sm text-navy-600 hover:border-navy-400">
            + Add photo
          </button>
        )}
        <div className="flex flex-col items-start gap-2">
          <button type="button" onClick={() => setOpen(true)} className={btnGhost}>{media ? 'Change photo' : 'Choose photo'}</button>
          {media && <button type="button" onClick={() => setMedia(null)} className="px-1 text-sm text-navy-600 hover:text-primary-ink">Remove</button>}
          {media && <p className="max-w-xs text-xs text-navy-600">{media.alt}</p>}
        </div>
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} library={library} onPick={setMedia} />
    </fieldset>
  )
}

/** Ordered list of photos (project gallery). */
export function GalleryField({ name, label, initial, library }: { name: string; label: string; initial: Media[]; library: Media[] }) {
  const [items, setItems] = useState(initial)
  const [open, setOpen] = useState(false)
  const move = (i: number, d: number) =>
    setItems((list) => {
      const j = i + d
      if (j < 0 || j >= list.length) return list
      const next = [...list]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy-800">{label}</legend>
      {items.map((m) => <input key={m.id} type="hidden" name={name} value={m.id} />)}
      <ul className="mt-1.5 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((m, i) => (
          <li key={m.id} className="group relative">
            <Thumb m={m} className="aspect-square w-full" />
            <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 text-xs">
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="Move earlier" className="rounded-md bg-white/90 px-2 py-1">←</button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Move later" className="rounded-md bg-white/90 px-2 py-1">→</button>
              </span>
              <button type="button" onClick={() => setItems((l) => l.filter((x) => x.id !== m.id))} aria-label="Remove photo" className="rounded-md bg-white/90 px-2 py-1 text-primary-ink">✕</button>
            </div>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => setOpen(true)} className="grid aspect-square w-full place-items-center rounded-lg border-2 border-dashed border-navy-200 text-sm text-navy-600 hover:border-navy-400">
            + Add photo
          </button>
        </li>
      </ul>
      <MediaPicker open={open} onClose={() => setOpen(false)} library={library} onPick={(m) => setItems((l) => (l.some((x) => x.id === m.id) ? l : [...l, m]))} />
    </fieldset>
  )
}

/** "Upload photo" button for the media library page. */
export function LibraryUpload() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnCls}><Icon name="plus" className="size-4" /> Upload photo</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Upload a photo">
        <UploadPanel
          onUploaded={async () => {
            setOpen(false)
            await revalidateSite()
            router.refresh()
          }}
        />
      </Modal>
    </>
  )
}

/** Swap the file behind a saved photo; every page using it updates. */
export function ReplaceMedia({ id }: { id: string }) {
  const router = useRouter()
  const [state, setState] = useState<ActionState>(null)
  const [busy, setBusy] = useState(false)
  return (
    <div>
      <label className="cursor-pointer text-sm font-medium text-navy-900 underline underline-offset-4">
        {busy ? 'Replacing…' : 'Replace file'}
        <input
          type="file"
          accept={TYPES.join(',')}
          className="sr-only"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setBusy(true)
            try {
              setState(await replaceMedia(id, await uploadFile(file)))
              router.refresh()
            } catch (err) {
              setState({ error: (err as Error).message })
            }
            setBusy(false)
          }}
        />
      </label>
      <Status state={state} />
    </div>
  )
}

/** Many photos at once into the gallery; each still needs alt text. */
export function BulkUpload({ competitions }: { competitions: { id: string; name: string }[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<{ file: File; alt: string; caption: string }[]>([])
  const [album, setAlbum] = useState('activities')
  const [competition, setCompetition] = useState('')
  const [busy, setBusy] = useState(false)
  const [state, setState] = useState<ActionState>(null)
  const set = (i: number, k: 'alt' | 'caption', v: string) => setFiles((f) => f.map((x, j) => (j === i ? { ...x, [k]: v } : x)))

  async function go() {
    setBusy(true)
    setState(null)
    const db = browserDb()
    let done = 0
    try {
      for (const f of files) {
        const m = await uploadImage(f.file, f.alt)
        const { error } = await db.from('gallery_items').insert({ media_id: m.id, caption: f.caption || null, album, competition_id: competition || null })
        if (error) throw new Error(error.message)
        done++
      }
      setFiles([])
      setState({ ok: `${done} photos added to the gallery.` })
    } catch (e) {
      setFiles((f) => f.slice(done))
      setState({ error: `${done} uploaded, then: ${(e as Error).message}` })
    }
    await revalidateSite()
    router.refresh()
    setBusy(false)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnGhost}>Upload many photos</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Upload photos to the gallery">
        <div className="space-y-5">
          <label className="relative grid min-h-32 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-navy-200 bg-surface text-center text-sm text-navy-600 hover:border-navy-400">
            <span><span className="block text-base font-semibold text-navy-900">Click to choose photos</span>or drag them here</span>
            <input type="file" multiple accept={TYPES.join(',')} aria-label="Choose photos" className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => setFiles([...(e.target.files ?? [])].map((file) => ({ file, alt: '', caption: '' })))} />
          </label>
          {files.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-navy-800">
                  Album
                  <select value={album} onChange={(e) => setAlbum(e.target.value)} className={inputCls}>
                    {['competitions', 'workshops', 'activities'].map((a) => <option key={a}>{a}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium text-navy-800">
                  Competition (optional)
                  <select value={competition} onChange={(e) => setCompetition(e.target.value)} className={inputCls}>
                    <option value="">None</option>
                    {competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <ul className="divide-y divide-navy-200/70 border-y border-navy-200/70">
                {files.map((f, i) => (
                  <li key={f.file.name + i} className="grid gap-3 py-3 sm:grid-cols-[4rem_1fr_1fr] sm:items-end">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(f.file)} alt="" className="size-16 rounded-lg object-cover" />
                    <label className="text-sm font-medium text-navy-800">Describe the photo *<input value={f.alt} onChange={(e) => set(i, 'alt', e.target.value)} className={inputCls} /></label>
                    <label className="text-sm font-medium text-navy-800">Caption<input value={f.caption} onChange={(e) => set(i, 'caption', e.target.value)} className={inputCls} /></label>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={go} disabled={busy || files.some((f) => !f.alt.trim())} className={btnCls}>
                {busy && <Spinner />}
                {busy ? 'Uploading…' : `Upload ${files.length} photos`}
              </button>
            </>
          )}
          <Status state={state} />
        </div>
      </Modal>
    </>
  )
}

/** Two-step delete button. Confirms inside the page, so it works where window.confirm() is blocked. */
export function ConfirmButton({ children, message }: { children: ReactNode; message: string }) {
  const [asking, setAsking] = useState(false)
  if (!asking)
    return (
      <button type="button" onClick={() => setAsking(true)} className="text-sm font-medium text-primary-ink hover:underline">
        {children}
      </button>
    )
  return (
    <span role="alert" className="inline-flex flex-wrap items-center gap-3 text-sm">
      <span className="text-navy-900">{message}</span>
      <SubmitButton className="inline-flex items-center gap-2 rounded-lg bg-primary-ink px-3 py-1.5 font-semibold text-white hover:brightness-90" pendingLabel="Deleting…">Yes, delete</SubmitButton>
      <button type="button" onClick={() => setAsking(false)} className="font-medium text-navy-600 hover:text-navy-900">Cancel</button>
    </span>
  )
}
