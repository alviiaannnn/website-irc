# PRD — IPB Robotic Club (IRC) Portfolio Website

Sep 28, 2026 · @Alvian

## 1. Summary & goals

An AI agent builds the IPB Robotic Club (IRC) portfolio website with Next.js, Supabase, and Web3Forms. Every text and photo on the public site is editable from an admin panel without redeploying. The site is English-only and its structure follows [barunastra-its.com](https://www.barunastra-its.com/) (section 4). Primary audience: prospective sponsors, prospective members, campus partners, and media.

**Goals**

- Present the organization, its research (teams, projects, competitions), gallery and media coverage, team members, and sponsors.
- Let admins manage all content (text, photos, order, visibility) from `/admin`.
- Let sponsors and partners reach IRC through a Web3Forms contact form.

**Success metrics**

- Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices, and SEO on every public page.
- Admin changes appear on the public site ≤ 10 seconds after saving.
- The contact form delivers to the IRC inbox without errors.

**In scope (v1)**

- 7 public pages plus project and competition detail pages, admin panel with text and photo CRUD, admin auth, media library, photo gallery, contact form, basic SEO.

**Out of scope (v1)**

- Full blog or articles (news = links to external coverage).
- Online member registration, merchandise store, and member portal (planned separately as the IRC app).
- Indonesian translation or any multi-language support.

## 2. Users & roles

Two admin roles are enough for v1; visitors never log in.

| Role | Main need | Access |
| --- | --- | --- |
| Sponsor / partner | Proof of results, projects, past sponsors, a fast way to get in touch | Public |
| Prospective member (IPB student) | Organization profile, research teams, divisions, skills IRC looks for | Public |
| Media / campus | Short profile, team, advisors, photos, coverage links | Public |
| `editor` (e.g. Media & Branding) | Edit text, photos, order, and visibility of all content | `/admin` |
| `admin` (General Manager) | Everything `editor` can do + invite and remove admin accounts | `/admin` |

Admin accounts are invite-only. Public sign-up is disabled in Supabase Auth.

## 3. Tech stack & agent tooling

The stack is deliberately minimal: Next.js + Supabase + Web3Forms + Tailwind, with no extra UI library unless it is truly needed.

| Component | Choice | Notes |
| --- | --- | --- |
| Framework | Latest stable Next.js, App Router, TypeScript | Server Components for public pages, Server Actions for admin |
| Styling | Tailwind CSS | Color tokens in `@theme` (section 4) |
| Database | Supabase Postgres | SQL migrations in `supabase/migrations`, RLS on every table |
| Auth | Supabase Auth (email + password) | `@supabase/ssr`, public sign-up disabled |
| Storage | Supabase Storage, bucket `media` | All content photos; static brand assets stay in `/public` |
| Contact form | Web3Forms | Called from the browser (section 10) |
| Images | `next/image` | Remote pattern for the Supabase Storage domain |
| Deploy | Vercel | Env vars managed in the Vercel dashboard |

**Agent tooling (install first, before writing any code)**

1. **ponytail** — a Claude Code plugin that makes the agent pick the simplest solution that works (YAGNI, native features first) without cutting validation, security, or accessibility. Needs Node.js on PATH. Send these as two separate prompts in Claude Code ([repo](https://github.com/dietrichgebert/ponytail)):

```bash
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

2. **Agent skills** — installed at project scope with the `skills` CLI so they get committed with the repo ([skills CLI](https://github.com/vercel-labs/skills), [Supabase skills](https://supabase.com/docs/guides/ai-tools/ai-skills), [Next.js skills](https://github.com/vercel-labs/next-skills)):

```bash
npx skills add vercel-labs/agent-skills   # react best practices, web design guidelines
npx skills add vercel/next.js             # Next.js workflow skills
npx skills add supabase/agent-skills      # supabase + postgres best practices
```

3. **graphify** — a skill that builds a knowledge graph of the repo (`graphify-out/GRAPH_REPORT.md`, `graph.json`) so the agent reads project structure instead of grepping repeatedly. Needs Python 3.10+ ([repo](https://github.com/Graphify-Labs/graphify)):

```bash
pip install graphifyy
graphify install --project    # installs the skill into .claude/skills/graphify
# once the Next.js scaffold exists, inside Claude Code:
/graphify .
graphify claude install       # adds CLAUDE.md rules + a PreToolUse hook
```

Run `/graphify . --update` at the end of every phase (section 12). Add `graphify-out/cache/` to `.gitignore`; commit the rest.

4. **taste-skill** — an anti-slop design skill that raises layout, typography, spacing, and motion quality in AI-built frontends. Install only the main skill (install name `design-taste-frontend`, v2) at project scope ([repo](https://github.com/Leonxlnx/taste-skill)):

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Set the 1–10 dials at the top of its installed `SKILL.md` for a sponsor-facing organization site: `DESIGN_VARIANCE` 6, `MOTION_INTENSITY` 4, `VISUAL_DENSITY` 4. When skills disagree, brand colors, contrast rules, and the barunastra-its.com structure (section 4) win over taste-skill’s palette and layout picks. ponytail wins on code: no animation library unless CSS cannot produce the effect.

## 4. Reference site & design system

The site follows the structure of [barunastra-its.com](https://www.barunastra-its.com/), the autonomous surface vehicle team of ITS. It runs on the same stack (Next.js, images served from Supabase Storage) and is English-only, so its patterns transfer directly.

**Patterns to adopt from the reference**

- Navbar: logo on the left, short page links, a dropdown for grouped content (Barunastra groups its competition pages under “Past Competitions”; IRC groups Research Teams, Projects, and Competitions under “Research”), “Contact” as the last item.
- A dedicated page per competition (Barunastra has one per event) → `/research/competitions/[slug]`.
- Footer in four blocks: white team and university logos with a one-line description; an “Explore” link list; “Contact” (address, email, phone as a `wa.me` link); “Follow Us” social icons; then a copyright line.
- Per-page meta description, a generated OG image (1200 × 630), `og:locale` `en_US`, and a `summary_large_image` Twitter card.
- Avoid its bug: canonical and OG URLs point to `localhost:3000`. Set `metadataBase` from `NEXT_PUBLIC_SITE_URL`.

The reference renders its content client-side, so a plain fetch shows only the navbar and footer. In phase 3 the agent opens it in a browser, screenshots every page at 1440 px and 390 px, and writes layout notes to `docs/reference-notes.md`. Adopt structure and patterns only; never copy its text, images, or branding.

**Colors**

Two primary colors: **#FE4B3E** (red-orange, matching the Agrisena hawk) for accents and CTAs, **#31516B** (steel blue) for structure, navbar, footer, and dark sections. Visual tone: technical, clean, energetic, with drone and robot photos as the focal point.

| Token | Hex | Use | Contrast vs white |
| --- | --- | --- | --- |
| `primary` | #FE4B3E | CTA buttons, highlights, icons, accent lines, achievement badges | 3.34:1 |
| `primary-ink` | #D73F34 | Normal-size red text and links on white | 4.52:1 |
| `secondary` | #31516B | Navbar, footer, dark sections, headings | 8.33:1 |
| `ink` | #0F1B24 | Body text | — |
| `surface` | #FFFFFF / #F4F6F8 | Page background / card background | — |

**Contrast rules (WCAG 2.2 AA)**

- White text on #FE4B3E only at large sizes (≥ 24 px, or ≥ 18.66 px bold). Button labels ≥ 19 px bold.
- Never put #FE4B3E text on #31516B (2.5:1). On dark sections use white text; keep red for icons and decoration.

**Typography & components**

- Fonts: Plus Jakarta Sans via `next/font` for headings and body; JetBrains Mono for spec labels and stat numbers.
- Core components: `Navbar` (with `NavDropdown`), `Footer`, `Hero`, `SectionHeading`, `StatCounter`, `ResearchTeamCard`, `ProjectCard`, `CompetitionCard`, `AchievementBadge`, `Timeline`, `GalleryGrid` + `Lightbox`, `NewsCard`, `PersonCard`, `SponsorLogoGrid`, `ContactForm`.
- 12 px card radius, soft shadows, 12-column grid, 1200 px max width.
- Light motion (fade/slide ≤ 300 ms) that respects `prefers-reduced-motion`.
- Light theme only for v1.

## 5. Sitemap & page specs

The site has 7 public pages plus two detail templates under Research. All content comes from Supabase and is editable from admin.

&#91;embedded content: sitemap · 7 public pages, 2 detail templates, 5 admin areas\]

Every save in admin writes to Supabase and triggers `revalidatePath` for the affected routes, so public pages stay static and fast.

| Route | Sections & content | Data source |
| --- | --- | --- |
| `/` Home | Full-bleed hero (headline, subheadline, main photo, “Become a Sponsor” and “Contact Us” CTAs), key stats, research team preview, 3 featured projects, achievement highlights, 3 latest coverage links, sponsor logo strip, closing CTA | `page_sections`, `research_teams`, `projects`, `competition_entries`, `news_links`, `sponsors` |
| `/about` | About IRC, 3 core values, org chart, Official Department (HRD, MnB, FUND + programs), Technical Department (Mechanical, Electrical, Software + skills) | `page_sections` |
| `/research` | Three anchored sections. **Research Teams**: Agrisena Aerial, Agrisena Racing Plane, Agrinaya Transporter with philosophy, tagline, and target competitions. **Projects**: grid of 6 filtered by team. **Competitions**: one card per competition + a 2021–2026 participation timeline | `research_teams`, `projects`, `competitions`, `competition_entries` |
| `/research/projects/[slug]` | Name, subtitle, description, photo gallery, research team, related competitions | `projects`, `project_media` |
| `/research/competitions/[slug]` | Organizer, about the competition, Our Journey, achievements, photos | `competitions`, `competition_entries`, `gallery_items` |
| `/gallery-news` | **Gallery**: photo grid with album filter (competitions, workshops, activities) and a keyboard-accessible lightbox. **News & Coverage**: cards linking to external sources (title, outlet, date, thumbnail), opening in a new tab | `gallery_items`, `news_links` |
| `/teams` | Committee 2026 (General Manager + 3 team captains), Supervisors, Research Advisor, Persons in Charge: photo, role, study program, skill tags, highlights | `people` |
| `/sponsors` | Past sponsor logo grid, why support IRC (closing statement), sponsorship CTA | `sponsors`, `page_sections` |
| `/contact` | Web3Forms form, email, phone as a WhatsApp link, Robotics Lab ARL address on Dramaga Campus, LinkedIn, Instagram | `site_settings` |

Navbar: Home, About, Research (dropdown: Research Teams, Projects, Competitions), Gallery & News, Teams, Sponsors, then a “Contact” button in #FE4B3E. Footer: the four blocks from section 4.

## 6. Content & seed data

All initial content comes from `handbook_IRC.md`. The agent copies it to `docs/handbook_IRC.md`, then writes `supabase/seed.sql` (or `scripts/seed.ts`) that fills the tables in section 9. Text is stored as written, in English.

| Table | Seed content | Handbook source |
| --- | --- | --- |
| `site_settings` | Name, tagline, Robotics Lab ARL address (Dramaga, Bogor 16680), ipbrobotic@apps.ipb.ac.id, LinkedIn, Instagram @irc.ipb | Contact |
| `page_sections` | About Us, 3 core values, Official and Technical Department descriptions, HRD/MnB/FUND programs, Mechanical/Electrical/Software skills, closing statement | Sections 1, 3, 4, 18 |
| `research_teams` | Agrisena Aerial, Agrisena Racing Plane, Agrinaya Transporter (philosophy, tagline, target competitions) | Section 5 |
| `projects` | Sengon-X, Varshata, ARGO-X, Custom Controller, AETHER, ABEE | Sections 10–11 |
| `competitions` | SAFMC, KRTI, Ground Robotics (MBF, PRC, FIRA), KRI — organizer + Our Journey | Sections 6–9 |
| `competition_entries` | Every participation 2021–2026 plus the results below | Sections 6–9 |
| `people` | 3 supervisors, 1 research advisor, 3 persons in charge, 4 committee members 2026 | Sections 13–17 |
| `sponsors` | 10 past sponsors and supporting institutions | Section 12 |
| `gallery_items` | Photos from `public/` classified as `gallery` or `documentation` (section 7) | — |
| `news_links` | Empty — filled by admins (the handbook has no coverage links) | — |

**Results to seed (newest first)**

| Year | Competition | Category | Result |
| --- | --- | --- | --- |
| 2026 | SAFMC | Man-Machine (D1) | 3rd Place |
| 2025 | KRTI | Racing Plane | 16th Place (national top 16) |
| 2025 | MBF | Transporter | 2nd Place |
| 2025 | PRC | Transporter | 21st Place |
| 2024 | KRTI | VTOL | 8th Place (national top 8) |
| 2024 | KRTI | Racing Plane | 2nd Place, regional |
| 2024 | MBF | Transporter | 1st Place |
| 2024 | MBF | Transporter | 3rd Place |
| 2023 | KRTI | VTOL | National finalist |

**Data inconsistencies to fix before seeding**

- “KRI 2023” appears twice in the Past Competition list; keep one.
- KRTI 2023 and 2024 appear in Our Journey but not in the Past Competition list; add them.
- MBF is written as both “Mechanical Biosystem Fest” and “Mechanical Biosystem Fair”; use one name.
- The website URL reads `website-irc.versel.app`; it probably means `vercel.app`.
- “design and rafting frame” in the Mechanical description is probably a typo for “crafting”.

## 7. Image assets in `/public`

The images already live in `public/`. The agent must inventory and look at every file (vision) before using it; file names alone are not enough to map people and project photos.

1. List every file: `find public -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.svg' \)`, and record dimensions and file size.
2. Open each image and assign one category: `brand` (IRC, Agrisena, Agrinaya, and IPB logos, including white versions for the footer), `hero`, `project:<slug>`, `person:<name>`, `sponsor:<name>`, `competition:<slug>`, `gallery:<album>`, `unknown`.
3. Write the result to `docs/asset-manifest.md` with columns: path, dimensions, size, category, used on (route + section), proposed alt text, status (`ok` / `needs confirmation`).
4. Map a photo to a person only when the file name or the image makes it clear. Otherwise mark it `needs confirmation` and never guess identities.
5. Brand assets (logos, favicon, default OG) stay in `public/brand/`. Every content photo is uploaded to the Supabase `media` bucket during seeding so admins can replace it.
6. Pick the hero photo from `hero` or `gallery` with the largest resolution (width ≥ 1600 px). Files over 1 MB are kept as originals; `next/image` handles optimization.
7. Content without an image gets a #31516B → #FE4B3E gradient placeholder with initials, logged in the manifest.

A manifest summary (count per category + the `needs confirmation` list) goes to the user at the end of phase 2 before moving on.

## 8. Admin panel

Admins can change every text and photo shown on the public site, including order and visibility, without redeploying.

**Authentication & authorization**

- Email + password login at `/admin/login` via Supabase Auth; public sign-up is disabled, and new accounts are invited from `/admin/users` (`admin` only).
- Every `/admin/*` route is checked on the server (middleware/proxy + a second check in the layout and in every Server Action). The role is read from `profiles`.
- Logout button; sessions via `@supabase/ssr` cookies.

**Modules**

| Module | Editable fields | Actions |
| --- | --- | --- |
| Page text | Every section on every page: title, body (simple markdown), photo, CTA label and link | Edit, save |
| Research teams | Name, group, tagline, description, logo, target competitions | Edit, reorder |
| Projects | Name, slug, subtitle, description, research team, year, cover, gallery, featured | Create, edit, delete, reorder, publish/hide |
| Competitions & results | Competition (name, organizer, journey, logo) and yearly entries (event, category, result) | Create, edit, delete, reorder |
| Gallery | Photo, caption, album, date, linked competition | Upload in bulk, edit, delete, reorder, publish/hide |
| News & coverage | Title, outlet, date, URL, thumbnail, summary | Create, edit, delete, publish/hide |
| People | Name, group (supervisor, advisor, PIC, committee), role, study program, tags, highlights, photo | Create, edit, delete, reorder |
| Sponsors | Name, logo, URL, order | Create, edit, delete, reorder |
| Media | Every photo: upload, replace file, alt text, see where it is used | Upload, replace, delete (blocked while in use) |
| Settings | Contact details, social links, tagline, default OG image | Edit |

**Photo upload rules**

- JPG, PNG, WebP; max 5 MB per file. SVG is not accepted.
- Alt text is required before saving.
- Instant preview in the form; cropping is out of scope for v1.

**After saving**

- The Server Action validates input, writes to Supabase, calls `revalidatePath` for the affected routes, then shows a success toast or an error message.
- Every row stores `updated_at` and `updated_by`; the dashboard lists the last 10 changes.

## 9. Supabase schema

13 tables, one storage bucket, RLS on every table. Every content table has `id uuid`, `created_at`, `updated_at`, `updated_by`; orderable tables add `sort_order int`.

| Table | Key columns | Notes |
| --- | --- | --- |
| `profiles` | `id` (fk `auth.users`), `full_name`, `role` (`admin` / `editor`) | Created when an invite is accepted |
| `site_settings` | `org_name`, `tagline`, `email`, `phone`, `address`, `socials jsonb`, `og_media_id` | Single row |
| `media` | `path`, `alt`, `width`, `height`, `mime`, `size_bytes` | Metadata for files in the `media` bucket |
| `page_sections` | `page`, `key`, `title`, `body`, `cta_label`, `cta_href`, `media_id` | `unique(page, key)` |
| `research_teams` | `slug`, `group_name` (Agrisena / Agrinaya), `name`, `tagline`, `description`, `logo_media_id`, `target_competitions text[]` |  |
| `projects` | `slug`, `name`, `subtitle`, `description`, `team_id`, `year`, `cover_media_id`, `is_featured`, `is_published` | Unique `slug` |
| `project_media` | `project_id`, `media_id`, `sort_order` | Project gallery |
| `competitions` | `slug`, `name`, `short_name`, `organizer`, `description`, `journey`, `logo_media_id` | One detail page per row |
| `competition_entries` | `competition_id`, `event`, `year`, `category`, `result` (null = participation only), `is_published` | Feeds the timeline and results lists |
| `gallery_items` | `media_id`, `caption`, `album`, `taken_on`, `competition_id` (nullable), `is_published` | Gallery & News page and competition pages |
| `news_links` | `title`, `outlet`, `url`, `published_on`, `thumbnail_media_id`, `summary`, `is_published` |  |
| `people` | `name`, `group` (supervisor / advisor / pic / committee), `role_title`, `program`, `tags text[]`, `highlights text[]`, `photo_media_id`, `is_published` |  |
| `sponsors` | `name`, `url`, `logo_media_id`, `is_published` |  |

**RLS & storage**

- `anon` can only `select`; on tables with `is_published`, only rows where `is_published = true`.
- `insert`, `update`, `delete` only for `is_editor()`; managing `profiles` only for `is_admin()`.
- Bucket `media`: public read; write and delete only for `is_editor()`.
- `SUPABASE_SERVICE_ROLE_KEY` is used only by the server-side seed script and never gets a `NEXT_PUBLIC_` prefix.

```sql
create function public.is_editor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create policy "public read published" on public.projects
  for select to anon, authenticated using (is_published or public.is_editor());
create policy "editors write" on public.projects
  for all to authenticated using (public.is_editor()) with check (public.is_editor());
```

TypeScript types are generated with `supabase gen types typescript` into `src/lib/database.types.ts`.

## 10. Contact form (Web3Forms)

The form posts straight from the browser to `https://api.web3forms.com/submit`, not through a Server Action. Web3Forms recommends client-side use; server-side use needs a paid plan and IP whitelisting ([API reference](https://docs.web3forms.com/getting-started/api-reference)).

- Create the access key at web3forms.com with ipbrobotic@apps.ipb.ac.id as the recipient and store it in `NEXT_PUBLIC_WEB3FORMS_KEY`. This key is designed to be public.
- Fields: `name`, `email`, `organization` (optional), `topic` (Sponsorship, Research collaboration, Media/press, General), `message`; hidden `subject` = “\[IRC Website\] {topic} — {name}” and `from_name` = “IRC Website”.
- Spam protection: a hidden `botcheck` honeypot checkbox.
- Native HTML validation (`required`, `type="email"`, `minLength`) before sending.
- UI states: idle → sending (button disabled) → success (thank-you message, form reset) or failure (error message + the IRC email as a fallback).
- “Become a Sponsor” buttons elsewhere link to `/contact?topic=sponsorship` and preselect the topic.
- Messages are not stored in Supabase in v1.

## 11. Non-functional requirements

| Area | Target |
| --- | --- |
| Performance | LCP < 2.5 s and CLS < 0.1 on mobile 4G; public pages rendered statically with on-demand revalidation |
| SEO | `metadata` per page, `metadataBase` from `NEXT_PUBLIC_SITE_URL`, generated OG image, `sitemap.xml`, `robots.txt`, JSON-LD `Organization`; `/admin` set to `noindex` |
| Language | English only; `<html lang="en">`, `og:locale` `en_US` |
| Accessibility | WCAG 2.2 AA: required alt text, visible focus, full keyboard navigation (including the navbar dropdown and gallery lightbox), one `h1` per page, contrast per section 4 |
| Responsive | 360 px to 1440 px; the navbar collapses into a hamburger menu below 768 px |
| Security | RLS on every table, server-side role checks on every admin action, upload type and size validation, no secrets in client code |
| Browsers | Last 2 versions of Chrome, Edge, Firefox, Safari (desktop and iOS) |
| Code quality | TypeScript strict, clean ESLint, `next build` without errors |

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (seed only), `NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_SITE_URL`. All listed in `.env.example`.

## 12. Repo structure & agent execution phases

The agent works one phase at a time until its gate passes, then stops and reports before the next phase. The phase 2 gate needs an answer from the user.

&#91;embedded content: agent execution phases · 6 phases, 6 gates\]

Working rules: follow ponytail mode (no unrequested dependencies or abstractions), read `graphify-out/GRAPH_REPORT.md` before changing structure, and commit per phase as `feat(phase-N): …`.

```text
irc-website/
├── .claude/skills/          # graphify + agent skills (project scope)
├── docs/
│   ├── PRD.md               # this document (markdown export)
│   ├── handbook_IRC.md
│   ├── asset-manifest.md
│   └── reference-notes.md   # barunastra-its.com layout notes
├── graphify-out/
├── public/                  # original images + public/brand/
├── src/
│   ├── app/
│   │   ├── (site)/          # public pages + Navbar/Footer layout
│   │   │   ├── about/
│   │   │   ├── research/    # + projects/[slug], competitions/[slug]
│   │   │   ├── gallery-news/
│   │   │   ├── teams/
│   │   │   ├── sponsors/
│   │   │   └── contact/
│   │   ├── admin/           # login + CRUD modules
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   └── lib/                 # supabase clients, queries, database.types.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── CLAUDE.md
└── .env.example
```

## 13. Acceptance criteria & open questions

The project is done when every criterion below passes on the production Vercel URL.

**Acceptance criteria**

- [ ] ponytail is active in Claude Code; the Next.js, Vercel, Supabase, and taste-skill agent skills are installed at project scope and committed.
- [ ] `graphify-out/GRAPH_REPORT.md` exists and is current; `CLAUDE.md` contains the graphify rules.
- [ ] `docs/reference-notes.md` records the barunastra-its.com layout, and the navbar, dropdown, and footer follow it.
- [ ] 7 public pages plus project and competition detail pages render with seed data; no hardcoded content except UI labels.
- [ ] Every text and photo on the public site is editable from admin and appears publicly ≤ 10 seconds after saving.
- [ ] Gallery filters by album and its lightbox works with keyboard only; news cards open the external source in a new tab.
- [ ] Visitors without a login cannot open `/admin` or write to any table or bucket (tested with the anon key).
- [ ] The `editor` role cannot manage accounts; the `admin` role can.
- [ ] The contact form delivers email to the IRC address and shows both success and failure states.
- [ ] Colors use only the section 4 tokens; all text passes WCAG AA contrast.
- [ ] Lighthouse mobile ≥ 90 in all four categories on every public page.
- [ ] `docs/asset-manifest.md` is complete; no image lacks alt text.
- [ ] `next build` passes with no errors and the Vercel deploy is live.

**Open questions**

- Contact form recipient: ipbrobotic@apps.ipb.ac.id (this PRD’s default) or the General Manager’s email?
- May student IDs and personal phone numbers appear publicly? Default here: student IDs hidden, phone only on the contact page.
- The General Manager’s student ID ([student ID]) and phone (08967787475) in the handbook differ from other records; please double-check.
- Dr. Eng. Muhammad Adi Puspo Sjiwo is listed as both Research Advisor and Supervisor; show him in both groups or once?
- Who prepares the initial coverage links and gallery albums (Media & Branding)?
- Are white versions of the IRC and IPB logos available in `public/` for the dark footer?
- Final domain: keep the Vercel subdomain or use a custom domain?
- Do we have permission to show photos of the supervisors and advisors?

**Sources**

- [barunastra-its.com (reference site)](https://www.barunastra-its.com/)
- [ponytail — GitHub](https://github.com/dietrichgebert/ponytail)
- [graphify — GitHub](https://github.com/Graphify-Labs/graphify)
- [taste-skill — GitHub](https://github.com/Leonxlnx/taste-skill)
- [skills CLI — vercel-labs/skills](https://github.com/vercel-labs/skills)
- [Next.js agent skills — vercel-labs/next-skills](https://github.com/vercel-labs/next-skills)
- [Supabase Agent Skills](https://supabase.com/docs/guides/ai-tools/ai-skills)
- [Web3Forms API reference](https://docs.web3forms.com/getting-started/api-reference)
- [Web3Forms for Next.js](https://web3forms.com/platforms/nextjs-contact-form)
