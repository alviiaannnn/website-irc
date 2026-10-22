-- Every visible text becomes editable. Sections get a small label above the heading (eyebrow) and a list of
-- buttons/links ("Label | link" per line). Texts that were hard-coded get their own rows, filled with exactly
-- what the site showed before, so nothing changes until an editor changes it. Safe to run twice.
-- cta_label/cta_href stay in the table but are no longer read: their values are copied into buttons.

alter table public.page_sections
  add column if not exists eyebrow text,
  add column if not exists buttons text[] not null default '{}';

-- Section labels and links that used to live in the page code.
update public.page_sections p set eyebrow = v.eyebrow, buttons = v.buttons
from (values
  ('home', 'hero', 'IPB Robotic Club', array['Individual Support | /support',
     coalesce((select cta_label from public.page_sections where page = 'home' and key = 'hero'), 'Become a Sponsor') || ' | ' ||
     coalesce((select cta_href from public.page_sections where page = 'home' and key = 'hero'), '/contact?topic=sponsorship')]),
  ('home', 'research', 'Research', array['All research teams | /research#teams']),
  ('home', 'projects', 'Projects', array['All projects | /research#projects']),
  ('home', 'achievements', 'Results', array['All competitions | /research#competitions']),
  ('home', 'news', 'Coverage', array['All coverage | /gallery-news#news']),
  ('home', 'sponsors', 'Sponsors', array['Become a sponsor | /sponsors']),
  ('about', 'intro', 'About', array['About IRC | #story', 'Core values | #values', 'Structure | #structure', 'Official Department | #official', 'Technical Department | #technical']),
  ('about', 'values', 'Values', '{}'),
  ('about', 'structure', 'Structure', '{}'),
  ('about', 'official', 'Department', '{}'),
  ('about', 'technical', 'Department', '{}'),
  ('about', 'mechanical', 'Division 01', '{}'),
  ('about', 'electrical', 'Division 02', '{}'),
  ('about', 'software', 'Division 03', '{}'),
  ('research', 'intro', 'Research', array['Research Teams | #teams', 'Projects | #projects', 'Competitions | #competitions']),
  ('research', 'agrisena', 'Research team', '{}'),
  ('research', 'agrinaya', 'Research team', '{}'),
  ('research', 'projects', 'Projects', '{}'),
  ('research', 'competitions', 'Competitions', '{}'),
  ('gallery-news', 'intro', 'Media', array['Gallery · {photos} photos | #gallery', 'News · {news} stories | #news']),
  ('gallery-news', 'gallery', 'Photos', '{}'),
  ('gallery-news', 'news', 'Coverage', '{}'),
  ('teams', 'intro', 'People', '{}'),
  ('teams', 'committee', '01', '{}'),
  ('teams', 'supervisor', '02', '{}'),
  ('teams', 'advisor', '03', '{}'),
  ('teams', 'pic', '04', '{}'),
  ('sponsors', 'intro', 'Partners', array['{sponsors} partners | #logos', 'Why support IRC | #why', 'Become a sponsor | /contact?topic=sponsorship', 'Support as an individual | /support']),
  ('sponsors', 'why', 'Why support us', '{}'),
  ('support', 'support', 'Individual support', '{}'),
  ('support', 'tier-1', 'Starting from', '{}'),
  ('support', 'tier-2', 'Starting from', '{}'),
  ('support', 'tier-3', 'Starting from', '{}'),
  ('contact', 'intro', 'Contact', '{}')
) as v(page, key, eyebrow, buttons)
where p.page = v.page and p.key = v.key and p.eyebrow is null and p.buttons = '{}';

-- Single buttons that already existed move into the list.
update public.page_sections set buttons = array[cta_label || ' | ' || cta_href]
where buttons = '{}' and cta_label is not null and cta_href is not null and not (page = 'home' and key = 'hero');

-- Individual Support side links: one per tier, then the pledge button.
update public.page_sections p set buttons = coalesce((
  select array_agg('From ' || t.title || ' | #tiers' order by t.key) from public.page_sections t
  where t.page = 'support' and t.key in ('tier-1', 'tier-2', 'tier-3') and t.title is not null), '{}')
  || coalesce((select array[x.cta_label || ' | ' || x.cta_href] from public.page_sections x
     where x.page = 'support' and x.key = 'pledge' and x.cta_label is not null and x.cta_href is not null), '{}')
where p.page = 'support' and p.key = 'support' and p.buttons = '{}';

-- Texts that had no row yet.
insert into public.page_sections (page, key, eyebrow, title, body, buttons) values
  ('home', 'hero-note', null, null,
    'Competing at ' || coalesce((select string_agg(coalesce(short_name, name), ' · ' order by sort_order) from public.competitions), ''), '{}'),
  ('home', 'stats', null, null,
    E'- Competing since: {since}\n- Competitions entered: {competitions}\n- Podium finishes: {podiums}\n- Robotics projects: {projects}', '{}'),
  ('home', 'hero-caption', null, null,
    (select m.alt from public.page_sections s join public.media m on m.id = s.media_id where s.page = 'home' and s.key = 'hero'), '{}'),
  ('research', 'team-label', null, 'Target competitions', null, '{}'),
  ('research', 'timeline', null, 'Participation timeline', 'Participant', '{}'),
  ('teams', 'highlights-label', null, 'Highlights', null, '{}'),
  ('gallery-news', 'news-empty', null, null, 'Coverage links will appear here soon.', '{}'),
  ('support', 'badges', null, 'Your name on our website', E'- Green · M\n- Gold · L\n- Platinum · XL', '{}'),
  ('support', 'badge-sample', null, '@yourname', null, '{}'),
  ('support', 'thanks', null, 'Special thanks to', null, '{}'),
  ('contact', 'form', null, 'Send us a message', 'We read every message and usually reply within a few days.', '{}'),
  ('contact', 'map-link', null, 'Open the lab in Google Maps', null, '{}'),
  ('contact', 'form-labels', null, null,
    E'- Name\n- Email\n- Organization\n- (optional)\n- Topic\n- Message\n- Send message\n- Sending…\n- Thank you!\n- Your message has been sent. We will get back to you soon.\n- Send another message\n- Sorry, the message could not be sent.\n- Please email us at', '{}'),
  ('contact', 'form-topics', null, null, E'- Sponsorship\n- Research collaboration\n- Media/press\n- General', '{}'),
  ('site', 'nav', null, null,
    E'- Home | /\n- About | /about\n- Research | /research\n  - Research Teams | /research#teams\n  - Projects | /research#projects\n  - Competitions | /research#competitions\n- Gallery & News | /gallery-news\n- Teams | /teams\n- Support | /sponsors\n  - Sponsors | /sponsors\n  - Individual Support | /support', '{}'),
  ('site', 'nav-button', null, null, null, array['Contact | /contact']),
  ('site', 'footer-explore', null, 'Explore', null,
    array['About | /about', 'Research | /research', 'Gallery & News | /gallery-news', 'Teams | /teams', 'Sponsors | /sponsors', 'Contact | /contact']),
  ('site', 'footer-contact', null, 'Contact', null, '{}'),
  ('site', 'footer-follow', null, 'Follow us', null, '{}'),
  ('site', 'footer-bottom', null, null, '© {year} {org}. All rights reserved.', array['Admin login | /admin']),
  ('site', 'project-page', null, null, E'- All projects\n- Research team\n- Year\n- Related competitions\n- Photos\n- Project', array['Collaborate with us | /contact?topic=collaboration']),
  ('site', 'competition-page', null, null, E'- All competitions\n- Achievements\n- About the competition\n- Our journey\n- Participation\n- Photos\n- Organized by', '{}'),
  ('site', 'not-found', 'Error 404', 'Page not found.', 'This page has flown off course.', array['Back to home | /'])
on conflict (page, key) do nothing;
