# Reference: barunastra-its.com

Looked at on 2026-09-28 in a browser at 1440 px and ~390 px (the site renders client-side). Only structure and patterns were adopted; no text, images or branding.

## Layout notes

- **Navbar**: dark, fixed; logo left; short links (Home, About Us, Past Competitions ▾, Our Boat, IRC 2026, RobotX 2026 ▾, Our Partners, Contact Us). Grouped content sits in dropdowns. Collapses to a hamburger on narrow screens.
- **Home hero**: full-bleed team photo with a dark gradient; very large headline (~72 px) bottom-left, a paragraph under it.
- **Sections** alternate dark (navy) and light; each opens with a small uppercase eyebrow ("SINCE 2018") and a big heading ("Where we've competed").
- **Competition history**: map + year-by-year list (year — event — place — result). One page per competition.
- **Content carousel** of recent posts/videos; **Research → Testing → Review** process strip.
- **Sponsors**: long logo marquee.
- **Footer** (4 blocks): one-line team description; "Explore" link list; "Contact" (address, email, phone); "Follow Us" social icons; then a copyright line.

## How IRC adapts it

| Barunastra | IRC |
| --- | --- |
| Past Competitions ▾ | Research ▾ (Research Teams, Projects, Competitions) |
| Page per competition | `/research/competitions/[slug]` (SAFMC, KRTI, Ground Robotics, KRI) |
| Year list of results | `Timeline` component on `/research` and each competition page |
| Eyebrow + big heading | `Eyebrow` + `SectionHeading` |
| Sponsor marquee | Static `SponsorLogoGrid` (no animation library) |
| Footer 4 blocks | Same 4 blocks; phone kept to the Contact page (PRD default) |
| Canonical/OG pointing at localhost (bug) | `metadataBase` from `NEXT_PUBLIC_SITE_URL` |
