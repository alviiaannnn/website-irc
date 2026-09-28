import { inviteUser, removeUser, setRole } from '../../actions'
import { AdminForm, ConfirmButton } from '@/components/admin'
import { btnCls, inputCls } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { serviceDb } from '@/lib/supabase'

export const metadata = { title: 'Accounts' }

export default async function Users({ searchParams }: PageProps<'/admin/users'>) {
  const { ok, error } = await searchParams
  const { db, user } = await requireAdmin()
  const [{ data: profiles }, { data: auth }] = await Promise.all([
    db.from('profiles').select('id, full_name, role').order('created_at'),
    serviceDb().auth.admin.listUsers(),
  ])
  const email = (id: string) => auth?.users.find((u) => u.id === id)?.email

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-navy-900">Accounts</h1>
      {ok && <p role="status" className="rounded-lg bg-white p-3 font-semibold text-secondary">{String(ok)}</p>}
      {error && <p role="alert" className="rounded-lg bg-white p-3 font-semibold text-primary-ink">{String(error)}</p>}

      <ul className="divide-y divide-navy-200/70 rounded-2xl bg-white border border-navy-200/70">
        {profiles?.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{p.full_name ?? '—'}{p.id === user.id && ' (you)'}</p>
              <p className="text-sm text-navy-600">{email(p.id)}</p>
            </div>
            {p.id === user.id ? (
              <span className="font-mono text-sm">{p.role}</span>
            ) : (
              <div className="flex items-center gap-4">
                <form action={setRole.bind(null, p.id)} className="flex items-center gap-2">
                  <select name="role" defaultValue={p.role} aria-label={`Role for ${p.full_name ?? email(p.id)}`} className={`${inputCls} mt-0 w-auto`}>
                    <option value="editor">editor</option>
                    <option value="admin">admin</option>
                  </select>
                  <button className={btnCls}>Update</button>
                </form>
                <form action={removeUser.bind(null, p.id)}>
                  <ConfirmButton message="Remove this account? They will lose admin access.">Remove</ConfirmButton>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>

      <section className="rounded-2xl bg-white p-6 border border-navy-200/70">
        <h2 className="text-xl font-semibold tracking-tight text-navy-900">Invite someone</h2>
        <p className="mt-1 text-sm text-navy-600">They get an email link to set their password.</p>
        <div className="mt-4">
          <AdminForm action={inviteUser} submitLabel="Send invitation">
            <label className="block text-sm font-medium text-navy-800">Email *<input name="email" type="email" required className={inputCls} /></label>
            <label className="block text-sm font-medium text-navy-800">Full name<input name="full_name" className={inputCls} /></label>
            <label className="block text-sm font-medium text-navy-800">
              Role
              <select name="role" defaultValue="editor" className={inputCls}>
                <option value="editor">editor — edit all content</option>
                <option value="admin">admin — content + accounts</option>
              </select>
            </label>
          </AdminForm>
        </div>
      </section>
    </div>
  )
}
