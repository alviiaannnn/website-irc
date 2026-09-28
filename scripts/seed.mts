// Seeds Supabase with the handbook content and uploads photos from public/images.
// Run once on an empty database: npm run seed
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
const db = createClient(url, key, { auth: { persistSession: false } })

async function run<T>(p: PromiseLike<{ data: T; error: unknown }>): Promise<NonNullable<T>> {
  const { data, error } = await p
  if (error) throw error
  return data as NonNullable<T>
}

const existing = await run(db.from('site_settings').select('id'))
if (existing.length) {
  console.log('Already seeded (site_settings has a row). Nothing to do.')
  process.exit(0)
}

// ---------- media ----------
const uploaded = new Map<string, string>()
async function media(file: string, alt: string): Promise<string> {
  if (uploaded.has(file)) return uploaded.get(file)!
  const src = readFileSync(`public/images/${file}`)
  const isPng = file.toLowerCase().endsWith('.png')
  // Photos are normalised (EXIF rotation, max 2400px) so they fit the bucket's 5 MB limit.
  const img = isPng ? sharp(src) : sharp(src).rotate().resize(2400, 2400, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82 })
  const { data: buf, info } = await img.toBuffer({ resolveWithObject: true })
  const mime = isPng ? 'image/png' : 'image/jpeg'
  const path = `seed/${randomUUID()}.${isPng ? 'png' : 'jpg'}`
  await run(db.storage.from('media').upload(path, buf, { contentType: mime }))
  const row = await run(
    db.from('media').insert({ path, alt, width: info.width, height: info.height, mime, size_bytes: buf.length }).select('id').single(),
  )
  uploaded.set(file, row.id)
  console.log('uploaded', file)
  return row.id
}

// ---------- settings & page text ----------
await run(
  db.from('site_settings').insert({
    org_name: 'IPB Robotic Club',
    tagline: 'Robotics, technology, and innovation at IPB University',
    description:
      'A functional organization under the Directorate of Student Affairs, IPB University, developing student competencies in robotics, technology, and innovation.',
    email: 'ipbrobotic@apps.ipb.ac.id',
    phone: '08967787475',
    address: 'Robotics Lab, Advanced Research Laboratory, IPB University, Dramaga Campus, Bogor 16680, Indonesia',
    socials: { instagram: 'https://www.instagram.com/irc.ipb/', linkedin: '' },
  }),
)

const hero = await media('Aktivitas/KRTI_2025_Nasional_2.JPG', 'IRC team with the racing plane and the IPB Robotic Club banner on the runway at KRTI 2025')
const aboutPhoto = await media('Kompetisi/SAFMC 2026.jpg', 'IRC team holding the IRC and IPB flags at SAFMC 2026 in Singapore')
const mech = await media('Foto Kegiatan tim mekanik.jpg', 'Mechanical team member assembling an aircraft wing in the workshop')
const elec = await media('Foto Kegiatan tim elektrikal.jpg', 'Electrical team members wiring a drone')
const soft = await media('Foto kegiatan tim software.jpg', 'Software team member working on a laptop at the flying field')

const sections = [
  { page: 'home', key: 'hero', title: 'Robotics, technology, and innovation at IPB University', media_id: hero,
    body: 'IPB Robotic Club gathers students from various academic backgrounds to collaborate and innovate in robotics, representing IPB in national and international competitions such as SAFMC and KRTI.',
    cta_label: 'Become a Sponsor', cta_href: '/contact?topic=sponsorship' },
  { page: 'home', key: 'research', title: 'Research teams',
    body: 'IPB Robotic Club has two specific core of research that focused on technology development and robotics national competition.' },
  { page: 'home', key: 'projects', title: 'Latest projects',
    body: "Showcasing IRC's innovative developments in robotics, autonomous systems, and aerospace technologies." },
  { page: 'home', key: 'achievements', title: 'Achievements' },
  { page: 'home', key: 'news', title: 'News & coverage' },
  { page: 'home', key: 'sponsors', title: 'Supported by' },
  { page: 'home', key: 'cta', title: 'Help us reach KRTI 2026',
    body: "IRC IPB is determined to achieve outstanding results at KRTI 2026 while advancing the development of autonomous aerial systems. To achieve this goal, we seek your invaluable support in making this vision a reality.",
    cta_label: 'Become a Sponsor', cta_href: '/contact?topic=sponsorship' },

  { page: 'about', key: 'intro', title: 'About IRC', media_id: aboutPhoto,
    body: 'IPB Robotic Club (IRC) is a functional organization under the mentoring of Directorate of Student Affairs (Ditmawa) IPB University, through student organization development program known as IPB Prestasi.\n\nIRC is a place for student competencies development in robotics, technology, and innovations, especially students with strong interests in supporting robotics research at IPB University.\n\nWe gather students from various academic backgrounds to collaborate and innovate in robotics. IRC annually represents IPB in both National & International competition, such as Singapore Amazing Flying Machine Competition (SAFMC), Kontes Robot Terbang Indonesia (KRTI), and many other competitions.' },
  { page: 'about', key: 'values', title: 'Core values', body: '- Team Collaboration\n- Technological Advancement\n- Resilience and Adaptability' },
  { page: 'about', key: 'structure', title: 'Organizational structure',
    body: '- **Supervisor** · IPB Prestasi\n  - **General Manager** · IPB Robotic Club\n    - **Steering Committee** · Advisor\n    - **Official Department** · Official Manager\n      - HRD · Human Resource & Development\n      - MnB · Media & Branding\n      - FUND · Fundraising\n    - **Technical Department**\n      - Captain RP · Racing Plane: Mechanical, Electrical, Software\n      - Captain VTOL · Vertical Take-Off and Landing: Mechanical, Electrical, Software\n      - Captain GR · Ground Robot: Mechanical, Electrical, Software' },
  { page: 'about', key: 'official', title: 'Official Department',
    body: 'Official Department fully responsible for arranging both managerial and operational of non-technical fields in IPB Robotic Club. Official is in charge of ensuring human resources availability, financial, stability, and organization reputation to support sustainability of research team and competition.' },
  { page: 'about', key: 'hrd', title: 'Human Resource and Development (HRD)',
    body: 'Supervising comprehensive human resources management.\n\n- Open Recruitment\n- Upgrading\n- Makrab\n- IRC Prestasi' },
  { page: 'about', key: 'mnb', title: 'Media and Branding (MnB)',
    body: "Supervising organization's communication strategic and visual identity.\n\n- Content Plan\n- Grand Launching\n- COPM\n- General Photo" },
  { page: 'about', key: 'fund', title: 'Fundraising (FUND)',
    body: 'Guarantee organization financial stability.\n\n- Merchandise IRC\n- 3D printing service\n- Sponsorship\n- IRC Workshop' },
  { page: 'about', key: 'technical', title: 'Technical Department',
    body: 'Technical Department is the main pillar of IPB Robotic Club that responsible for every engineering process, starting from planning, manufacture, until system integration vehicle. The department divided by three separated divisions.' },
  { page: 'about', key: 'mechanical', title: 'Mechanical', media_id: mech,
    body: 'Responsible for UAV/robot planning, design and crafting frame, that consist of structural analysis, aerodynamics, as well as mechanical components.\n\n- Computer-Aided Design (CAD)\n- Manufacture knowledge\n- Material handling' },
  { page: 'about', key: 'electrical', title: 'Electrical', media_id: elec,
    body: 'Handling all the wiring system, electrical distribution, Printed Circuit Board design, as well as sensory and actuator integration on the vehicle.\n\n- Electrical system manufacture (EasyEDA)\n- Wiring Management\n- Electric and battery system management' },
  { page: 'about', key: 'software', title: 'Software', media_id: soft,
    body: 'Developing main software for flight control, navigation, and vehicle automation. Implementing ROS2-based software architecture on Linux-powered computers (e.g. Raspberry Pi & Jetson Nano) and embedded programming systems on microcontrollers (e.g. Arduino & ESP32).\n\n- Programming language (Python, C++, Arduino)\n- ROS 2 Development & Integration\n- Computer Vision & Object Detection\n- Embedded Systems Programming\n- Ground Control Station (GCS) Development & Operation' },

  { page: 'research', key: 'intro', title: 'Research',
    body: 'IPB Robotic Club has two specific core of research that focused on technology development and robotics national competition.' },
  { page: 'research', key: 'agrisena', title: 'AGRISENA · UAV Research Team',
    body: 'Agrisena is a combination of word "Agri" (Agriculture) and "Sena" (Soldier). This philosophy imaging teams strong commitment in advancing unmanned Aerial Vehicle (UAV) technology for supporting agriculture development. Symbolized by red-orange hawk, depicting presented courage, strong ambition, and also high spirit as they are our movement greatest spirit.' },
  { page: 'research', key: 'agrinaya', title: 'AGRINAYA · UGV Research Team',
    body: 'Agrinaya is derived from "Agri", signifying the earth as a symbol of a strong foundation, and "Naya" meaning direction or principle. Together, Agrinaya reflects a journey rooted in solid ground, moving with measured precision, aligned with teams fundamental Ground Vehicle (UGV) spirit in developing autonomous Ground Vehicle.' },
  { page: 'research', key: 'coming-soon', title: 'Other research teams are coming soon…',
    body: "Some competition category still on the team. Let's join us and be part of IPB Robotic Club!" },
  { page: 'research', key: 'projects', title: 'Projects',
    body: "Showcasing IRC's innovative developments in robotics, autonomous systems, and aerospace technologies." },
  { page: 'research', key: 'competitions', title: 'Competitions', body: 'Some of the competitions we have participated in so far.' },

  { page: 'gallery-news', key: 'intro', title: 'Gallery & News' },
  { page: 'gallery-news', key: 'gallery', title: 'Gallery' },
  { page: 'gallery-news', key: 'news', title: 'News & coverage' },

  { page: 'teams', key: 'intro', title: 'Our team' },
  { page: 'teams', key: 'committee', title: 'Committee 2026' },
  { page: 'teams', key: 'supervisor', title: 'Supervisors' },
  { page: 'teams', key: 'advisor', title: 'Research advisor' },
  { page: 'teams', key: 'pic', title: 'Persons in charge' },

  { page: 'sponsors', key: 'intro', title: 'Sponsors', body: 'Previous sponsors and supporting institutions.' },
  { page: 'sponsors', key: 'why', title: 'Why support IRC',
    body: "Building upon our experience in national UAV competitions and our continuous commitment to technological innovation, IRC IPB is determined to achieve outstanding results at KRTI 2026 while advancing the development of autonomous aerial systems. Through our research and engineering efforts, we aim not only to excel in competition but also to contribute meaningful solutions for Indonesia's agricultural sector, particularly in precision farming, aerial monitoring, and smart agricultural automation." },
  { page: 'sponsors', key: 'cta', title: 'Become a sponsor',
    body: 'To achieve this goal, we seek your invaluable support in making this vision a reality.',
    cta_label: 'Become a Sponsor', cta_href: '/contact?topic=sponsorship' },
  { page: 'sponsors', key: 'support', title: 'Contribute your support',
    body: "IRC's journey is powered by people who believe in it. Support us as an individual and be part of our road to SAFMC 2027." },
  { page: 'sponsors', key: 'tier-1', title: 'IDR 100.000', body: '- Thank-you shoutout on our official Instagram Story' },
  { page: 'sponsors', key: 'tier-2', title: 'IDR 400.000',
    body: '- Thank-you mention on our Instagram\n- Your name featured on our official website\n- Your name in our after-movie credits' },
  { page: 'sponsors', key: 'tier-3', title: 'IDR 800.000',
    body: '- Your name on our robot\n- Credit in our after-movie\n- Shoutout on our website\n- Featured in our Instagram Story' },
  { page: 'sponsors', key: 'pledge', title: 'Support IRC', cta_label: 'Support IRC', cta_href: null, // Google Form link, set in admin
    body: 'Fill in our support form: it has the bank details and everything else you need. Once your contribution arrives, we thank you on Instagram, and from IDR 400.000 your Instagram username appears below in "Special thanks to".' },

  { page: 'contact', key: 'intro', title: 'Contact us',
    body: 'Reach IPB Robotic Club about sponsorship, research collaboration, media, or anything else.' },
]
await run(db.from('page_sections').insert(sections, { defaultToNull: false }))

// ---------- research teams & projects ----------
const teams = await run(
  db.from('research_teams').insert([
    { slug: 'agrisena-aerial', group_name: 'Agrisena', name: 'Agrisena Aerial', tagline: 'Fly higher than you ever dreamed', sort_order: 1,
      description: 'Focusing on the development of VTOL (Vertical Take-Off and Landing) drones, with an orientation toward agriculture application and autonomous competitions.',
      target_competitions: ['Singapore Amazing Flying Machine Competition', 'Kontes Robot Terbang Indonesia (KRTI) - VTOL'],
      cover_media_id: await media('Foto Drone KRTI 2024.jpg', 'VTOL hexacopter on its landing pad at sunset, KRTI 2024') },
    { slug: 'agrisena-racing-plane', group_name: 'Agrisena', name: 'Agrisena Racing Plane', tagline: 'Fly higher than you ever dreamed', sort_order: 2,
      description: 'Dedicated to the design and construction of fixed-wing racing aircraft, optimized to push the limits of speed and performance in order to complete fast, on-track flight missions.',
      target_competitions: ['Kontes Robot Terbang Indonesia (KRTI) - RP'],
      cover_media_id: await media('Foto Pesawat RP KRTI 2025.jpg', 'Fixed-wing racing plane on its launch rail at KRTI 2025') },
    { slug: 'agrinaya-transporter', group_name: 'Agrinaya', name: 'Agrinaya Transporter', tagline: 'Precision on the Ground, Vision for the Future', sort_order: 3,
      description: 'Focusing on the development of agile and adaptive Ground Robots (remote-controlled ground robots) for payload transportation missions, that time integrates mechanical design and reliable control systems to meet the technical specification of the competitions.',
      target_competitions: ['Mechanical Biosystem Fair', 'FIRA Indonesia'],
      cover_media_id: await media('Foto Transporter MBF 2024.jpg', 'Transporter robot next to its first-place trophy at the Mechanical Biosystem Fair 2024') },
  ], { defaultToNull: false }).select('id, slug'),
)
const team = (slug: string) => teams.find((t) => t.slug === slug)!.id

await run(
  db.from('projects').insert([
    { slug: 'sengon-x', name: 'Sengon-X', subtitle: 'Autonomous Aerial Harvesting Platform', team_id: team('agrisena-aerial'), year: 2025, is_featured: true, sort_order: 1,
      cover_media_id: await media('Foto Drone Sengon.jpg', 'Sengon-X harvesting drone with an orange frame on a workbench'),
      description: 'Sengon-X is an aerial harvesting drone developed in collaboration with the Faculty of Forestry, IPB University. Equipped with a custom cutting mechanism, it enables safe and efficient harvesting of Sengon pods at heights of up to 40 meters, reducing operational risks and labor requirements.' },
    { slug: 'varshata', name: 'VARSHATA', subtitle: 'High-Performance Fixed-Wing Aircraft', team_id: team('agrisena-racing-plane'), is_featured: true, sort_order: 2,
      cover_media_id: await media('Foto Pesawat RP KRTI 2025.jpg', 'Fixed-wing racing plane on its launch rail at KRTI 2025'),
      description: 'VARSHATA is a high-speed fixed-wing aircraft designed for rapid and demanding flight maneuvers. The platform serves as a development and testing vehicle for aerodynamic optimization, flight control, and autonomous aviation technologies.' },
    { slug: 'argo-x', name: 'ARGO-X', subtitle: 'Hybrid Air-Ground Payload Delivery Drone', team_id: team('agrisena-aerial'), sort_order: 3,
      description: 'ARGO-X is an innovative drone capable of both aerial flight and ground maneuvering for precise payload retrieval and delivery. Its integrated wheel system and magnetic attachment mechanism enable efficient payload handling in complex operational environments.' },
    { slug: 'custom-controller', name: 'Custom Controller', subtitle: 'Motion-Based Intelligent Control System', team_id: team('agrisena-aerial'), year: 2026, sort_order: 4,
      description: 'The Custom Controller utilizes IMU-based motion sensing to provide an intuitive and immersive piloting experience. Its modular design allows mission-specific customized through programmable control inputs and dedicated function buttons.' },
    { slug: 'aether', name: 'AETHER', subtitle: 'Autonomous Indoor/Outdoor Logistics Drone', team_id: team('agrisena-aerial'), sort_order: 5,
      description: 'AETHER is a compact FPV drone developed for autonomous payload transportation in confined indoor/outdoor environments. Its lightweight design and agile maneuverability make it suitable for navigating corridors, warehouses, and other restricted spaces.' },
    { slug: 'abee', name: 'ABEE', subtitle: 'Mobile Transport Robot', team_id: team('agrinaya-transporter'), is_featured: true, sort_order: 6,
      cover_media_id: await media('Foto Transporter MBF 2024.jpg', 'Transporter robot next to its first-place trophy at the Mechanical Biosystem Fair 2024'),
      description: 'ABEE is a compact transport robot equipped with a custom gripping mechanism for object handling and delivery tasks. The platform enables manual operation, making it suitable for intermediate robotics research and learning platform.' },
  ], { defaultToNull: false }),
)

// ---------- competitions ----------
const comps = await run(
  db.from('competitions').insert([
    { slug: 'safmc', name: 'Singapore Amazing Flying Machine Competition', short_name: 'SAFMC', sort_order: 1,
      organizer: 'DSO National Laboratories and Science Centre Singapore, with support from the Ministry of Defence Singapore',
      description: 'This competition is organized by DSO National Laboratories and Science Centre Singapore, with support from the Ministry of Defence Singapore. It is open to schools and universities interested in exploring the science behind flight, as well as designing and building their flying machines. Each year, the competition provides an engaging learning experience through various activities such as specialized seminars, workshops, and live demonstrations.',
      journey: 'IPB Robotic Club (IRC) has actively participated in the Singapore Amazing Flying Machine Competition (SAFMC) since 2024, competing in the Category Man-Machine. Following a process of continuous system development and refinement, the team successfully secured 3rd Place in that category in 2026.\n\nThe Man-Machine (D1) category emphasizes direct interaction between a human and a flying machine. In this category, participants can fly a drone or systems controlled by a human operator through specific control mechanisms to complete designated missions within the competition.' },
    { slug: 'krti', name: 'Kontes Robot Terbang Indonesia', short_name: 'KRTI', sort_order: 2,
      organizer: 'Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia',
      description: 'This competition is organized by the Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia as an annual event to foster creativity, innovation, and the development of student capabilities in aerial robotics and aviation technology. Through the Kontes Robot Terbang Indonesia (KRTI), students are challenged to design, build, and operate autonomous flight systems with various missions and categories that test aspects of design, flight control, and mission strategy.',
      journey: 'IPB Robotic Club (IRC) began participating in KRTI in 2023 by entering the Vertical Take-Off and Landing (VTOL) category and successfully reached the national final stage. In 2024, IRC expanded its participation by competing in two categories: VTOL and Racing Plane (RP), achieving a top 8 national position in VTOL and 2nd place at the regional level in RP. Participation continued in 2025, when IRC re-entered the Racing Plane category and secured a position in the national top 16. This series of achievements demonstrates the consistency, technical growth, and team collaboration of IRC in developing aerial robotic systems for national competitions.' },
    { slug: 'ground-robotics', name: 'Ground Robotics', short_name: 'MBF · PRC · FIRA', sort_order: 3,
      organizer: 'Mechanical Biosystem Fair (MBF), Polines Robotic Contest (PRC), and FIRA RoboSport',
      description: 'In addition to aerial robotics, IPB Robotic Club (IRC) actively participates in various ground robotics competitions. These events focus on developing land-based robots designed to complete specific tasks such as navigation, object transportation, and robotic system coordination. Some competitions serve as a platform for students to enhance their skills in mechanical design, control systems, programming, and sensor integration for ground-based robots.',
      journey: "IRC's journey in ground robotics competitions began with participation in several national and international events, including the Mechanical Biosystem Fair (MBF), the Polines Robotic Contest (PRC), and FIRA International Robosport. In these competitions, IRC developed transporter robots to meet specific task objectives with precision across various achievements, including 1st and 3rd place at MBF 2024, 2nd Place at MBF 2025, and 21st-place ranking at PRC 2025, demonstrating consistent progress and consistency in the field of ground robotics." },
    { slug: 'kri', name: 'Kontes Robot Indonesia', short_name: 'KRI', sort_order: 4,
      journey: 'IRC competed in Kontes Robot Indonesia (KRI) every year from 2021 to 2024.' },
  ], { defaultToNull: false }).select('id, slug'),
)
const comp = (slug: string) => comps.find((c) => c.slug === slug)!.id

await run(
  db.from('competition_entries').insert([
    { competition_id: comp('kri'), event: 'KRI 2021', year: 2021 },
    { competition_id: comp('kri'), event: 'KRI 2022', year: 2022 },
    { competition_id: comp('kri'), event: 'KRI 2023', year: 2023 },
    { competition_id: comp('krti'), event: 'KRTI 2023', year: 2023, category: 'VTOL', result: 'National finalist' },
    { competition_id: comp('kri'), event: 'KRI 2024', year: 2024 },
    { competition_id: comp('safmc'), event: 'SAFMC 2024', year: 2024, category: 'Man-Machine' },
    { competition_id: comp('krti'), event: 'KRTI 2024', year: 2024, category: 'VTOL', result: '8th Place (national top 8)' },
    { competition_id: comp('krti'), event: 'KRTI 2024', year: 2024, category: 'Racing Plane', result: '2nd Place, regional' },
    { competition_id: comp('ground-robotics'), event: 'MBF 2024', year: 2024, category: 'Transporter', result: '1st Place', sort_order: 1 },
    { competition_id: comp('ground-robotics'), event: 'MBF 2024', year: 2024, category: 'Transporter', result: '3rd Place', sort_order: 2 },
    { competition_id: comp('safmc'), event: 'SAFMC 2025', year: 2025, category: 'Man-Machine' },
    { competition_id: comp('krti'), event: 'KRTI 2025', year: 2025, category: 'Racing Plane', result: '16th Place (national top 16)' },
    { competition_id: comp('ground-robotics'), event: 'PRC 2025', year: 2025, category: 'Transporter', result: '21st Place' },
    { competition_id: comp('ground-robotics'), event: 'FIRA RoboSport 2025', year: 2025 },
    { competition_id: comp('ground-robotics'), event: 'MBF 2025', year: 2025, category: 'Transporter', result: '2nd Place' },
    { competition_id: comp('safmc'), event: 'SAFMC 2026', year: 2026, category: 'Man-Machine (D1)', result: '3rd Place' },
  ], { defaultToNull: false }),
)

// ---------- gallery ----------
const gallery: [file: string, alt: string, caption: string, album: string, competition: string | null][] = [
  ['Kompetisi/SAFMC 2026.jpg', 'IRC team holding the IRC and IPB flags at SAFMC 2026 in Singapore', 'SAFMC 2026', 'competitions', 'safmc'],
  ['Kompetisi/SAFMC 2025.jpg', 'IRC team holding the IPB and IRC flags at SAFMC 2025', 'SAFMC 2025', 'competitions', 'safmc'],
  ['Kompetisi/SAFMC 2024.jpg', 'IRC team with the IPB, Indonesian and IRC flags at SAFMC 2024', 'SAFMC 2024', 'competitions', 'safmc'],
  ['Aktivitas/KRTI_2026_Seleksi Wilayah_1.jpg', 'IRC team in competition jackets with their fixed-wing aircraft at the KRTI 2026 regional selection', 'KRTI 2026 · Regional selection', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2026_Seleksi Wilayah_2.jpg', 'Members assembling the aircraft on the field at the KRTI 2026 regional selection', 'KRTI 2026 · Regional selection', 'competitions', 'krti'],
  ['Foto Drone KRTI 2026.jpg', 'Orange quadcopter drone built for KRTI 2026', 'KRTI 2026 drone', 'competitions', 'krti'],
  ['Kompetisi/KRTI 2025.jpg', 'IRC team with the IRC flag and racing plane at KRTI 2025', 'KRTI 2025', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2025_Nasional_1.jpg', 'Three members checking the racing plane on its launch rail at the KRTI 2025 national round', 'KRTI 2025 · National round', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2025_Nasional_2.JPG', 'IRC team with the racing plane and the IPB Robotic Club banner on the runway at KRTI 2025', 'KRTI 2025 · National round', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2025_Seleksi Wilayah_1.jpg', 'IRC team with laptops and a drone during the KRTI 2025 regional selection', 'KRTI 2025 · Regional selection', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2025_Seleksi Wilayah_2.JPG', 'Three members holding the racing plane at the KRTI 2025 regional selection', 'KRTI 2025 · Regional selection', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2025_Seleksi Wilayah_3.JPG', 'IRC team with the racing plane on the runway at the KRTI 2025 regional selection', 'KRTI 2025 · Regional selection', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2025_Seleksi Wilayah_4.JPG', 'A pilot hand-launching the racing plane at the KRTI 2025 regional selection', 'KRTI 2025 · Regional selection', 'competitions', 'krti'],
  ['Foto Pesawat RP KRTI 2025.jpg', 'Fixed-wing racing plane on its launch rail at KRTI 2025', 'KRTI 2025 racing plane', 'competitions', 'krti'],
  ['Kompetisi/KRTI 2024.jpg', 'IRC team waving with the IPB and IRC flags at the KRTI 2024 closing ceremony', 'KRTI 2024', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2024_Nasional_3.JPG', 'Team member preparing the racing plane on the launch rail at the KRTI 2024 national round', 'KRTI 2024 · National round', 'competitions', 'krti'],
  ['Aktivitas/KRTI_2024_Nasional_5.jpeg', 'IRC members carrying the racing plane at KRTI 2024', 'KRTI 2024 · National round', 'competitions', 'krti'],
  ['Foto Drone KRTI 2024.jpg', 'VTOL hexacopter on its landing pad at sunset, KRTI 2024', 'KRTI 2024 VTOL drone', 'competitions', 'krti'],
  ['Kompetisi/KRTI 2023.jpg', 'IRC team members posing together at KRTI 2023', 'KRTI 2023', 'competitions', 'krti'],
  ['Kompetisi/MBF 2025.jpg', 'IRC team holding the IPB Robotic Club flag at the Mechanical Biosystem Fair 2025', 'MBF 2025', 'competitions', 'ground-robotics'],
  ['Kompetisi/PRC 2025.jpg', 'IRC team saluting behind the IPB and IRC flags at the Polines Robotic Contest 2025', 'PRC 2025', 'competitions', 'ground-robotics'],
  ['Kompetisi/FIRA ROBOSPORT 2025.jpg', 'Three IRC members holding the IPB Robotic Club banner at FIRA RoboSport 2025', 'FIRA RoboSport 2025', 'competitions', 'ground-robotics'],
  ['Kompetisi/MBF 2024.jpg', 'IRC team with their transporter robots at the Mechanical Biosystem Fair 2024', 'MBF 2024', 'competitions', 'ground-robotics'],
  ['Foto Transporter MBF 2024.jpg', 'Transporter robot next to its first-place trophy at the Mechanical Biosystem Fair 2024', 'MBF 2024 · 1st place transporter', 'competitions', 'ground-robotics'],
  ['Kompetisi/KRI 2023.jpg', 'Two robots in traditional dance costumes at Kontes Robot Indonesia 2023', 'KRI 2023', 'competitions', 'kri'],
  ['Kompetisi/KRI 2022.jpg', 'IRC members preparing dancing robots on the competition field at KRI 2022', 'KRI 2022', 'competitions', 'kri'],
  ['Kompetisi/KRI 2021.jpg', 'Two dancing robots in traditional costume at Kontes Robot Indonesia 2021', 'KRI 2021', 'competitions', 'kri'],
  ['Foto Drone Sengon.jpg', 'Sengon-X harvesting drone with an orange frame on a workbench', 'Sengon-X', 'activities', null],
  ['Foto Kegiatan tim mekanik.jpg', 'Mechanical team member assembling an aircraft wing in the workshop', 'Mechanical team', 'activities', null],
  ['Foto Kegiatan tim elektrikal.jpg', 'Electrical team members wiring a drone', 'Electrical team', 'activities', null],
  ['Foto kegiatan tim software.jpg', 'Software team member working on a laptop at the flying field', 'Software team', 'activities', null],
]
const galleryRows = []
for (const [i, [file, alt, caption, album, c]] of gallery.entries()) {
  galleryRows.push({ media_id: await media(file, alt), caption, album, competition_id: c ? comp(c) : null, sort_order: i })
}
await run(db.from('gallery_items').insert(galleryRows, { defaultToNull: false }))

// ---------- people ----------
const sujiwo = await media('Commitee/Dr. Eng. Muhammad Adi Puspo Sujiwo, M.Kom..jpg', 'Portrait of Dr. Eng. Muhammad Adi Puspo Sjiwo, M.Kom.')
await run(
  db.from('people').insert([
    { group: 'committee', sort_order: 1, name: 'Alvian Raihan Ramadan', role_title: 'General Manager', program: 'Physics',
      tags: ['3D Design', 'Mechatronics', 'Electrical', 'VTOL', 'RP'],
      highlights: [
        'Research Engineer — Developed a self-controlled drone prototype for Sengon fruit harvesting in collaboration with Faculty of Forestry, IPB University (2025).',
        'Lead Mechanical Designer — Designed AETHER, an autonomous VTOL platform for indoor/outdoor delivery.',
        'Product Manager — Developed a custom gesture-based controller for SAFMC 2026.',
        'Aircraft Designer — Designed and optimized a racing fixed-wing aircraft.',
      ],
      photo_media_id: await media('Commitee/Alvian Raihan Ramadan.jpg', 'Portrait of Alvian Raihan Ramadan') },
    { group: 'committee', sort_order: 2, name: 'Rois Firosi', role_title: 'Captain, Agrisena Aerial', program: 'Computer Science',
      tags: ['Software', 'Ardupilot', 'ROS2', 'VTOL'],
      highlights: [
        'Autonomous VTOL & GNC Developer for KRTI 2026',
        'ROS2 Researcher for Autonomous Route Development for KRTI 2026',
        'Raspberry Pi Systems Integrator',
      ] },
    { group: 'committee', sort_order: 3, name: 'Ahmad Mumtaz', role_title: 'Captain, Agrisena Racing Plane', program: 'Physics',
      tags: ['Mechanic', 'Ardupilot', 'Plane'],
      highlights: [
        'Lead Manufacturing Engineer — Led the fabrication and assembly of a high-performance racing aircraft for KRTI 2026.',
        'Flight Test Pilot — Conducted flight testing and performance evaluation to optimize aircraft stability and maneuverability.',
        'Autopilot Integration Engineer — Configured and calibrated Ardupilot systems for autonomous flight operations and mission execution.',
      ],
      photo_media_id: await media('Commitee/Ahmad Mumtaz.jpg', 'Portrait of Ahmad Mumtaz') },
    { group: 'committee', sort_order: 4, name: 'Rofiq Akhdan F', role_title: 'Captain, Agrinaya', program: 'Physics',
      tags: ['Mechanic', 'Electrical', 'Software', 'Transporter'],
      highlights: [
        "Electrical System Engineer — Designed and validated the robot's power distribution system.",
        'System Design Engineer — Developed robot operation concepts and movement strategies.',
        'Embedded Systems Engineer — Implemented control systems using Arduino and ESP32 platform.',
        'Competition Support Engineer — Conducted mechanical troubleshooting and system optimization during competition.',
      ] },
    { group: 'supervisor', sort_order: 1, name: 'Dr. Ahmad Arifin Hadi, S.P., M.A.', role_title: 'Director of Student Affairs',
      photo_media_id: await media('Commitee/Dr. Akhmad Arifin Hadi, S.P., M.A..jpg', 'Portrait of Dr. Ahmad Arifin Hadi, S.P., M.A.') },
    { group: 'supervisor', sort_order: 2, name: 'Dr. Eng. Muhammad Adi Puspo Sjiwo, M.Kom.', role_title: 'Robotics Research, Advanced Research Laboratory', photo_media_id: sujiwo },
    { group: 'supervisor', sort_order: 3, name: 'Dr. Syaquifin E.S., S.Si., M.Si.', role_title: 'Assistant Director of Student Reputation Affairs' },
    { group: 'advisor', sort_order: 1, name: 'Dr. Eng. Muhammad Adi Puspo Sjiwo, M.Kom.', role_title: 'Robotics Researcher', photo_media_id: sujiwo,
      tags: ['Robotics', 'ROS2', 'AI', 'Computer Vision', 'Autonomous Vehicle'],
      highlights: [
        'Robotics Researcher — Conducts research and development in robotics, autonomous systems, and intelligent control technologies.',
        'Computer Vision Engineer — Specializes in image processing, localization, and vision-based navigation for autonomous platforms.',
        'Autonomous Vehicle Researcher — Contributes to research on autonomous navigation, mapping, and vehicle localization systems published in international journals and conferences.',
        'HPC & AI Specialist — Supports research involving high-performance computing for robotics and artificial intelligence applications.',
      ] },
    { group: 'pic', sort_order: 1, name: 'Restu Rahmana Putra', photo_media_id: await media('Commitee/Restu Rahmana Putra.jpg', 'Portrait of Restu Rahmana Putra') },
    { group: 'pic', sort_order: 2, name: 'Rafli Dwiki', photo_media_id: await media('Commitee/Rafli Dwiki.jpg', 'Portrait of Rafli Dwiki') },
    { group: 'pic', sort_order: 3, name: 'Lusiana S.' },
  ], { defaultToNull: false }),
)
// Uploaded but not assigned: identity or name needs confirmation (see docs/asset-manifest.md).
await media('Commitee/Qois Firosi.jpg', 'Portrait of an IRC member (name to be confirmed)')
await media('Commitee/Mask group.jpg', 'Portrait of an IRC member (name to be confirmed)')
await media('Commitee/Dr. Syaefudin, S.Si., M.Si..jpg', 'Portrait of Dr. Syaefudin, S.Si., M.Si.')

// ---------- sponsors ----------
await run(
  db.from('sponsors').insert([
    { sort_order: 1, name: 'Directorate of Student Affairs, IPB University' },
    { sort_order: 2, name: 'IPB Prestasi' },
    { sort_order: 3, name: 'IPB University Sekolah Vokasi', logo_media_id: await media('Sponsor/SV_IPB.png', 'IPB University Sekolah Vokasi logo') },
    { sort_order: 4, name: 'Himpunan Alumni IPB DPC Singapura', logo_media_id: await media('Sponsor/HA_IPB.png', 'Himpunan Alumni IPB DPC Singapura logo') },
    { sort_order: 5, name: 'IPB University Department of Physics', logo_media_id: await media('Sponsor/FISIKA_IPB.png', 'IPB University Department of Physics logo') },
    { sort_order: 6, name: 'IPB University Sekolah Sains Data, Matematika, dan Informatika', logo_media_id: await media('Sponsor/SSMI_IPB.png', 'IPB University Sekolah Sains Data, Matematika, dan Informatika logo') },
    { sort_order: 7, name: 'IPB University FMIPA' },
    { sort_order: 8, name: 'IPB University Faculty of Engineering and Technology', logo_media_id: await media('Sponsor/FTT_IPB.png', 'IPB University Fakultas Teknik dan Teknologi logo') },
    { sort_order: 9, name: 'SolidWorks', logo_media_id: await media('Sponsor/Solidworks.png', 'SolidWorks logo') },
    { sort_order: 10, name: 'Susi Air' },
    // Not in the handbook sponsor list; hidden until confirmed.
    { sort_order: 11, name: 'Soyanara', is_published: false, logo_media_id: await media('Sponsor/Soyanara.png', 'Soyanara soy milk logo') },
  ], { defaultToNull: false }),
)

// ---------- news & coverage ----------
const safmcSummary = 'Coverage of Agrisena Aerial winning 3rd place in the Man-Machine category at SAFMC 2026 in Singapore.'
await run(
  db.from('news_links').insert([
    { outlet: 'IPB University', published_on: '2026-04-13', summary: safmcSummary,
      title: 'Tim Robot IPB University Finish di Peringkat Ketiga Kompetisi Singapore Amazing Flying Machine Competition (SAFMC)',
      url: 'https://kemahasiswaan.ipb.ac.id/tim-robot-ipb-university-raih-peringkat-ketiga-pada-singapore-amazing-flying-machine-competition-safmc/' },
    { outlet: 'IPB University', published_on: '2026-04-13', summary: safmcSummary,
      title: 'Tim Robot IPB University Raih Peringkat 3 Singapore Amazing Flying Machine Competition',
      url: 'https://www.ipb.ac.id/news/index/2026/04/tim-robot-ipb-university-raih-peringkat-3-singapore-amazing-flying-machine-competition/' },
    { outlet: 'Kampusiana', published_on: '2026-04-14', summary: safmcSummary,
      title: 'Tim Robot IPB Juara Ketiga Singapore Amazing Flying Machine Competition (SAFMC) 2026',
      url: 'https://kampusiana.id/posts/737388/tim-robot-ipb-juara-ketiga-singapore-amazing-flying-machine-competition-safmc-2026/' },
    { outlet: 'VisiNews', published_on: '2026-04-15', summary: safmcSummary,
      title: 'Tim Agrisena Aerial IPB Raih Juara 3 di SAFMC 2026 Singapura dengan Inovasi Drone Presisi',
      url: 'https://www.visinews.net/pendidikan/amp/2722518828/tim-agrisena-aerial-ipb-raih-juara-3-di-safmc-2026-singapura-dengan-inovasi-drone-presisi' },
    { outlet: 'Konteks', published_on: '2026-05-01', summary: safmcSummary,
      title: 'Singkirkan Puluhan Peserta, Mesin Terbang alias Drone Rancangan Tim Robot IPB University Juara di Singapura',
      url: 'https://www.konteks.co.id/kabar-baik/amp/1632608020/singkirkan-puluhan-peserta-mesin-terbang-alias-drone-rancangan-tim-robot-ipb-university-juara-di-singapura' },
  ]),
)

// ---------- first admin ----------
const adminEmail = process.env.SEED_ADMIN_EMAIL
if (adminEmail) {
  const { data, error } = await db.auth.admin.inviteUserByEmail(adminEmail, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/accept-invite`,
  })
  if (error) throw error
  await run(db.from('profiles').upsert({ id: data.user.id, full_name: 'Alvian Raihan Ramadan', role: 'admin' }))
  console.log('Invited admin', adminEmail)
}
console.log('Seed complete.')
