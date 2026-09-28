# IPB Robotic Club website

Portfolio site for IPB Robotic Club (IRC). Next.js 16 (App Router) + Supabase + Web3Forms + Tailwind 4. Spec: [docs/PRD.md](docs/PRD.md), content source: [docs/handbook_IRC.md](docs/handbook_IRC.md).

- Public pages: `/`, `/about`, `/research` (+ `/research/projects/[slug]`, `/research/competitions/[slug]`), `/gallery-news`, `/teams`, `/sponsors`, `/contact`. All static; every admin save calls `revalidatePath('/', 'layout')`.
- Admin: `/admin` — invite-only Supabase Auth. Roles in `profiles`: `editor` (all content) and `admin` (+ accounts).

## Setup

1. Create a Supabase project and fill `.env.local` from `.env.example`.
2. Run `supabase/migrations/20260928000000_init.sql` in the Supabase SQL editor (tables, RLS, `media` bucket).
3. Supabase → Authentication:
   - Sign In / Providers: turn **off** "Allow new users to sign up".
   - URL Configuration: Site URL = your site URL; add `http://localhost:3000/**` and `https://<your-domain>/**` to Redirect URLs (invite links land on `/admin/accept-invite`).
4. `npm install`
5. `npm run seed` — uploads the photos from `public/images` and fills every table from the handbook. With `SEED_ADMIN_EMAIL` set it also invites the first admin. Runs once on an empty database.
6. `npm run dev`

## Deploy (Vercel)

Add the env vars from `.env.example` in the Vercel dashboard (`SUPABASE_SERVICE_ROLE_KEY` is server-only; it is needed for inviting/removing admin accounts). Set `NEXT_PUBLIC_SITE_URL` to the production URL and add it to Supabase Redirect URLs.

## Where things are

| Path | What |
| --- | --- |
| `app/(site)/` | Public pages with Navbar/Footer layout |
| `app/admin/` | Login, invite acceptance, generic CRUD, media library, accounts; `actions.ts` holds all Server Actions |
| `lib/admin.ts` | Admin module config: one entry per table decides the fields and list columns |
| `lib/data.ts` | Public read queries (anon key, no cookies → static pages) |
| `components/ui.tsx` | Shared server components (cards, timeline, markdown, placeholders) |
| `proxy.ts` | Session refresh + redirect signed-out users away from `/admin` |
| `supabase/migrations/` | Schema, RLS, storage policies |
| `scripts/seed.mts` | Seed from the handbook |
| `docs/asset-manifest.md` | Every image, where it is used, and what still needs confirmation |

Page text supports a tiny markdown: blank line = paragraph, `- ` = list (indent 2 spaces to nest), `**bold**`, `[text](url)`.
