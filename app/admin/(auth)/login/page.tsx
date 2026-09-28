import Image from 'next/image'
import Link from 'next/link'
import { signIn } from '../../actions'
import { btnCls, inputCls } from '@/lib/admin'
import { Wordmark } from '@/components/navbar'

export const metadata = { title: 'Sign in' }

export default async function Login({ searchParams }: PageProps<'/admin/login'>) {
  const { error } = await searchParams
  return (
    <main className="flex min-h-dvh flex-col bg-white px-4">
      <header className="mx-auto flex h-16 w-full max-w-sm items-center justify-between">
        <span className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="" width={36} height={36} className="size-9" />
          <Wordmark />
        </span>
        <Link href="/" className="text-sm font-medium text-navy-600 hover:text-navy-900">Back to site</Link>
      </header>
      <form action={signIn} className="mx-auto my-auto w-full max-w-sm space-y-5 py-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Welcome back</h1>
          <p className="mt-1 text-sm text-navy-600">Sign in to edit the IRC website.</p>
        </div>
        {error && <p role="alert" className="text-sm font-medium text-primary-ink">{String(error)}</p>}
        <label className="block text-sm font-medium text-navy-800">Email<input name="email" type="email" required autoComplete="username" className={inputCls} /></label>
        <label className="block text-sm font-medium text-navy-800">Password<input name="password" type="password" required autoComplete="current-password" className={inputCls} /></label>
        <button className={`${btnCls} w-full justify-center`}>Sign in</button>
        <p className="text-xs text-navy-600">Accounts are invite-only. Ask the General Manager for access.</p>
      </form>
    </main>
  )
}
