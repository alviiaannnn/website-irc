'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { Media } from '@/lib/data'
import { mediaUrl } from '@/lib/media'
import { Segmented } from './project-grid'

type Item = { id: string; caption: string | null; album: string; media: Media }

/** Photo grid with album filter and a keyboard-accessible lightbox (native <dialog>). */
export function GalleryGrid({ items, filter = true }: { items: Item[]; filter?: boolean }) {
  const [album, setAlbum] = useState('all')
  const [index, setIndex] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const shown = album === 'all' ? items : items.filter((i) => i.album === album)
  const albums = ['all', ...new Set(items.map((i) => i.album))]
  const current = shown[index]

  const open = (i: number) => {
    setIndex(i)
    dialog.current?.showModal()
  }
  const step = (d: number) => setIndex((i) => (i + d + shown.length) % shown.length)

  return (
    <>
      {filter && albums.length > 2 && (
        <Segmented label="Filter photos by album" options={albums.map((a) => ({ id: a, name: a }))} value={album} onChange={setAlbum} />
      )}
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((item, i) => (
          <li key={item.id}>
            <button type="button" onClick={() => open(i)} className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-surface">
              <Image
                src={mediaUrl(item.media.path)}
                alt={item.media.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-300 motion-safe:group-hover:scale-[1.03]"
              />
              {item.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-900/90 to-transparent p-3 pt-10 text-left text-sm font-medium text-white">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Photo viewer"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto h-dvh max-h-none w-dvw max-w-none bg-navy-900/95 p-0 text-white backdrop:bg-navy-900/80"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="font-mono text-sm">{index + 1} / {shown.length}</p>
              <button type="button" onClick={() => dialog.current?.close()} className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" autoFocus>
                <span className="sr-only">Close</span>
                <svg aria-hidden viewBox="0 0 24 24" className="size-6 stroke-white" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="relative flex-1">
              <Image src={mediaUrl(current.media.path)} alt={current.media.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <button type="button" onClick={() => step(-1)} className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <span className="sr-only">Previous photo</span>
                <svg aria-hidden viewBox="0 0 24 24" className="size-6 stroke-white" strokeWidth="2" fill="none"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <p className="text-center" aria-live="polite">{current.caption ?? current.media.alt}</p>
              <button type="button" onClick={() => step(1)} className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <span className="sr-only">Next photo</span>
                <svg aria-hidden viewBox="0 0 24 24" className="size-6 stroke-white" strokeWidth="2" fill="none"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
