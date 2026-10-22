import { publicDb } from '@/lib/supabase'

// Vercel Cron hits this daily (see vercel.json) so the free Supabase project never looks idle enough to be paused.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Unauthorized', { status: 401 })
  const { error } = await publicDb.from('site_settings').select('id').limit(1)
  return error ? new Response(error.message, { status: 500 }) : new Response('ok')
}
