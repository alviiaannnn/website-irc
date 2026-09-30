'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useActionState, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react'
import { replaceMedia, revalidateSite, type ActionState } from '@/app/admin/actions'
import { btnCls, btnGhost, inputCls } from '@/lib/admin'
import type { Media } from '@/lib/data'
import { mediaUrl } from '@/lib/media'
import { browserDb } from '@/lib/supabase-browser'

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const path = usePathname()
  const active = href === '/admin' ? path === href : path.startsWith(href)
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`block rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${active ? 'bg-surface text-navy-900' : 'text-navy-600 hover:bg-surface hover:text-navy-900'}`}
    >
      {children}
    </Link>
  )
}

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
  const [, start] = useTransition()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        start(() => formAction(fd))
      }}
    >
      <div className="space-y-6">{children}</div>
      <div className="sticky bottom-0 -mx-6 mt-8 flex flex-wrap items-center gap-4 rounded-b-2xl border-t border-navy-200/70 bg-white/95 px-6 py-4 backdrop-blur">
        <button type="submit" disabled={pending} className={btnCls}>{pending ? 'Saving…' : submitLabel}</button>
        <Status state={state} />
      </div>
    </form>
  )
}

export function Status({ state }: { state: ActionState }) {
  if (state?.error) return <p role="alert" className="text-sm font-medium text-primary-ink">{state.error}</p>
  if (state?.ok) return <p role="status" className="text-sm font-medium text-navy-600">✓ {state.ok}</p>
  return null
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
          <button type="button" onClick={go} disabled={busy || !alt.trim()} className={btnCls}>{busy ? 'Uploading…' : 'Upload and use this photo'}</button>
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
      <button type="button" onClick={() => setOpen(true)} className={btnCls}>+ Upload photo</button>
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
      <button type="submit" className="rounded-lg bg-primary-ink px-3 py-1.5 font-semibold text-white hover:brightness-90">Yes, delete</button>
      <button type="button" onClick={() => setAsking(false)} className="font-medium text-navy-600 hover:text-navy-900">Cancel</button>
    </span>
  )
}
