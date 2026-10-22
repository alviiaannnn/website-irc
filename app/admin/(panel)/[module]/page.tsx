import { notFound, redirect } from 'next/navigation'
import { homeOf, modules } from '@/lib/admin'
import { requireEditor } from '@/lib/auth'

// Lists live on their website page (/admin/pages/…); this address only forwards there, keeping ?ok / ?error banners.
export default async function ModuleList({ params, searchParams }: PageProps<'/admin/[module]'>) {
  const { module: key } = await params
  const mod = modules[key]
  if (!mod) notFound()
  const { db } = await requireEditor()

  if (mod.singleton) {
    const { data } = await db.from(mod.table).select('id').limit(1).single()
    if (!data) notFound()
    redirect(`/admin/${key}/${data.id}`)
  }

  const [path, hash] = homeOf(key).split('#')
  const qs = new URLSearchParams(Object.entries(await searchParams).filter((e): e is [string, string] => typeof e[1] === 'string')).toString()
  redirect(`${path}${qs ? `?${qs}` : ''}${hash ? `#${hash}` : ''}`)
}
