import Image from 'next/image'
import Link from 'next/link'
import { signIn } from '../../actions'
import { SubmitButton } from '@/components/admin'
import { btnCls, inputCls } from '@/lib/admin'
import { Wordmark } from '@/components/navbar'
import { Ring } from '@/components/ui'

export const metadata = { title: 'Sign in' }

export default async function Login({ searchParams }: PageProps<'/admin/login'>) {
  const { error } = await searchParams
  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-2">
      <div className="flex flex-col px-4">
        <header className="mx-auto flex h-16 w-full max-w-sm items-center justify-between">
          <span className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={36} height={36} className="size-9" />
            <Wordmark />
          </span>
          <Link href="/" className="text-sm font-medium text-navy-600 hover:text-navy-900">Back to site</Link>
        </header>
        <form action={signIn} className="fade-up mx-auto my-auto w-full max-w-sm space-y-5 py-12">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Welcome back</h1>
            <p className="mt-1 text-sm text-navy-600">Sign in to edit the IRC website.</p>
          </div>
          {error && <p role="alert" className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary-ink">{String(error)}</p>}
          <label className="block text-sm font-medium text-navy-800">Email<input name="email" type="email" required autoComplete="username" className={inputCls} /></label>
          <label className="block text-sm font-medium text-navy-800">Password<input name="password" type="password" required autoComplete="current-password" className={inputCls} /></label>
          <SubmitButton className={`${btnCls} w-full justify-center`} pendingLabel="Signing in…">Sign in</SubmitButton>
          <p className="text-xs text-navy-600">Accounts are invite-only. Ask the General Manager for access.</p>
        </form>
      </div>
      <div aria-hidden className="bg-grid-dark relative hidden overflow-hidden bg-linear-to-br from-secondary to-navy-900 lg:block">
        <Ring className="-top-32 -right-32 w-[34rem] border-[64px]" />
        <div className="absolute bottom-16 left-16 max-w-sm text-white">
          <p className="text-sm font-semibold tracking-[0.18em] text-navy-200 uppercase">IRC Admin</p>
          <p className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.03em]">Edit every page of the website, in the order visitors see it.</p>
        </div>
      </div>
    </main>
  )
}
