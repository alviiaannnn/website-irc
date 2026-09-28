-- IRC website schema: content tables, roles, RLS, media bucket.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.is_editor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'));
$$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Stamps updated_at / updated_by on every write.
create function public.touch() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  alt text not null check (length(trim(alt)) > 0),
  width int,
  height int,
  mime text,
  size_bytes int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  org_name text not null,
  tagline text,
  description text,
  email text,
  phone text,
  address text,
  socials jsonb not null default '{}',
  og_media_id uuid references public.media,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  key text not null,
  title text,
  body text,
  cta_label text,
  cta_href text,
  media_id uuid references public.media,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null,
  unique (page, key)
);

create table public.research_teams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  group_name text not null,
  name text not null,
  tagline text,
  description text,
  logo_media_id uuid references public.media,
  cover_media_id uuid references public.media,
  target_competitions text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  subtitle text,
  description text,
  team_id uuid references public.research_teams on delete set null,
  year int,
  cover_media_id uuid references public.media,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  media_id uuid not null references public.media,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  short_name text,
  organizer text,
  description text,
  journey text,
  logo_media_id uuid references public.media,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.competition_entries (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions on delete cascade,
  event text not null,
  year int not null,
  category text,
  result text, -- null = participation only
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media,
  caption text,
  album text not null default 'activities' check (album in ('competitions', 'workshops', 'activities')),
  taken_on date,
  competition_id uuid references public.competitions on delete set null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.news_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  outlet text,
  url text not null check (url ~ '^https?://'),
  published_on date,
  thumbnail_media_id uuid references public.media,
  summary text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "group" text not null check ("group" in ('committee', 'supervisor', 'advisor', 'pic')),
  role_title text,
  program text,
  tags text[] not null default '{}',
  highlights text[] not null default '{}',
  photo_media_id uuid references public.media,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text check (url ~ '^https?://'),
  logo_media_id uuid references public.media,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

-- Triggers, grants and RLS for every content table.
do $$
declare t text;
begin
  foreach t in array array['media','site_settings','page_sections','research_teams','projects','project_media',
    'competitions','competition_entries','gallery_items','news_links','people','sponsors'] loop
    execute format('create trigger touch before insert or update on public.%I for each row execute function public.touch()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "editors write" on public.%I for all to authenticated using (public.is_editor()) with check (public.is_editor())', t);
    if t in ('projects','competition_entries','gallery_items','news_links','people','sponsors') then
      execute format('create policy "public read published" on public.%I for select to anon, authenticated using (is_published or public.is_editor())', t);
    else
      execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    end if;
  end loop;
end $$;

alter table public.profiles enable row level security;
create policy "read own or editors" on public.profiles for select to authenticated using (id = auth.uid() or public.is_editor());
create policy "admins manage" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;

-- Last changes across content tables for the admin dashboard.
create view public.recent_changes with (security_invoker = true) as
  select 'page-sections' as module, id, page || ' / ' || key as label, updated_at, updated_by from public.page_sections
  union all select 'research-teams', id, name, updated_at, updated_by from public.research_teams
  union all select 'projects', id, name, updated_at, updated_by from public.projects
  union all select 'competitions', id, name, updated_at, updated_by from public.competitions
  union all select 'entries', id, event || coalesce(' · ' || category, ''), updated_at, updated_by from public.competition_entries
  union all select 'gallery', id, coalesce(caption, 'Photo'), updated_at, updated_by from public.gallery_items
  union all select 'news', id, title, updated_at, updated_by from public.news_links
  union all select 'people', id, name, updated_at, updated_by from public.people
  union all select 'sponsors', id, name, updated_at, updated_by from public.sponsors
  union all select 'settings', id, 'Site settings', updated_at, updated_by from public.site_settings
  union all select 'media', id, alt, updated_at, updated_by from public.media;
revoke all on public.recent_changes from anon;
grant select on public.recent_changes to authenticated;

-- Media bucket: public read, editors write. Size and type limits enforced by Storage itself.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "editors read media" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_editor());
create policy "editors upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_editor());
create policy "editors update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_editor());
create policy "editors delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_editor());
