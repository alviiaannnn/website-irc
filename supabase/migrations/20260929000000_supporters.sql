-- Individual supporters: pledges come from the public form, editors confirm and publish them.

create table public.supporters (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 80),
  instagram text check (instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  amount int not null check (amount between 100000 and 1000000000),
  contact text not null check (length(trim(contact)) between 5 and 120), -- email or WhatsApp, never public
  message text check (length(message) <= 500),
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create trigger touch before insert or update on public.supporters for each row execute function public.touch();
alter table public.supporters enable row level security;
create policy "editors write" on public.supporters for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "public read published" on public.supporters for select to anon, authenticated using (is_published or public.is_editor());

-- Visitors may see who to thank, not how to reach them or how much they gave.
revoke all on public.supporters from anon;
grant select (id, name, instagram, is_published, sort_order, created_at) on public.supporters to anon;
grant select, insert, update, delete on public.supporters to authenticated;
