# Asset manifest

Every image in `public/` was opened and checked by eye. Content photos were uploaded to the Supabase `media` bucket by `npm run seed` (EXIF-rotated, max 2400 px, JPEG q82 so each file fits the bucket's 5 MB limit). Admins replace them from **Admin → Media library**. Brand assets stay in `public/brand/`.

**Summary:** 52 files · brand 1 · hero 1 · project 3 · person 9 · sponsor 7 · competition/gallery 27 · activity 3 · skipped (HEIC) 4.
**Needs confirmation:** 9 (see status column and the list at the bottom).

| Path | Size (px) | File | Category | Used on | Alt text | Status |
| --- | --- | --- | --- | --- | --- | --- |
| brand/logo.png | 768×768 | 0.06 MB | brand | Navbar, footer (white via CSS filter), favicon (`app/icon.png`), OG image | IPB Robotic Club | ok |
| images/Aktivitas/KRTI_2025_Nasional_2.JPG | 6000×4000 | 12.0 MB | hero, gallery:competitions | `/` hero; gallery; `/research/competitions/krti` | IRC team with the racing plane and the IPB Robotic Club banner on the runway at KRTI 2025 | ok |
| images/Aktivitas/KRTI_2024_Nasional_1.HEIC | 1024×768 | 0.30 MB | gallery | — | — | skipped: HEIC is not supported by browsers or `next/image`; convert to JPG and upload via admin |
| images/Aktivitas/KRTI_2024_Nasional_2.HEIC | 576×768 | 0.12 MB | gallery | — | — | skipped: HEIC |
| images/Aktivitas/KRTI_2024_Nasional_3.JPG | 1152×768 | 0.19 MB | gallery:competitions | gallery; KRTI page | Team member preparing the racing plane on the launch rail at the KRTI 2024 national round | ok |
| images/Aktivitas/KRTI_2024_Nasional_5.jpeg | 1280×853 | 0.12 MB | gallery:competitions | gallery; KRTI page | IRC members carrying the racing plane at KRTI 2024 | ok |
| images/Aktivitas/KRTI_2025_Nasional_1.jpg | 1200×800 | 0.91 MB | gallery:competitions | gallery; KRTI page | Three members checking the racing plane on its launch rail at the KRTI 2025 national round | ok |
| images/Aktivitas/KRTI_2025_Seleksi Wilayah_1.jpg | 1200×800 | 1.15 MB | gallery:competitions | gallery; KRTI page | IRC team with laptops and a drone during the KRTI 2025 regional selection | ok |
| images/Aktivitas/KRTI_2025_Seleksi Wilayah_2.JPG | 6000×4000 | 12.6 MB | gallery:competitions | gallery; KRTI page | Three members holding the racing plane at the KRTI 2025 regional selection | ok |
| images/Aktivitas/KRTI_2025_Seleksi Wilayah_3.JPG | 6000×4000 | 15.5 MB | gallery:competitions | gallery; KRTI page | IRC team with the racing plane on the runway at the KRTI 2025 regional selection | ok |
| images/Aktivitas/KRTI_2025_Seleksi Wilayah_4.JPG | 6000×4000 (EXIF rotated) | 13.0 MB | gallery:competitions | gallery; KRTI page | A pilot hand-launching the racing plane at the KRTI 2025 regional selection | ok |
| images/Aktivitas/KRTI_2026_Seleksi Wilayah_1.jpg | 1600×1200 | 0.36 MB | gallery:competitions | gallery; KRTI page | IRC team in competition jackets with their fixed-wing aircraft at the KRTI 2026 regional selection | ok |
| images/Aktivitas/KRTI_2026_Seleksi Wilayah_2.jpg | 899×1599 | 0.30 MB | gallery:competitions | gallery; KRTI page | Members assembling the aircraft on the field at the KRTI 2026 regional selection | ok |
| images/Aktivitas/KRTI_2026_Seleksi Wilayah_3.HEIC | 3212×2590 | 0.63 MB | gallery | — | — | skipped: HEIC |
| images/Aktivitas/KRTI_2026_Seleksi Wilayah_4.HEIC | 4032×3024 | 1.74 MB | gallery | — | — | skipped: HEIC |
| images/Commitee/Alvian Raihan Ramadan.jpg | 529×636 | 0.22 MB | person:Alvian Raihan Ramadan | `/teams` committee | Portrait of Alvian Raihan Ramadan | ok |
| images/Commitee/Ahmad Mumtaz.jpg | 529×636 | 0.11 MB | person:Ahmad Mumtaz | `/teams` committee | Portrait of Ahmad Mumtaz | ok |
| images/Commitee/Qois Firosi.jpg | 529×636 | 0.11 MB | unknown | media library only (not assigned) | Portrait of an IRC member (name to be confirmed) | needs confirmation: file says "Qois", handbook says "Rois Firosi", and the name tag on the shirt shows a different name |
| images/Commitee/Mask group.jpg | 529×636 | 0.12 MB | unknown | media library only (not assigned) | Portrait of an IRC member (name to be confirmed) | needs confirmation: no name; possibly Rofiq Akhdan F or Lusiana S. |
| images/Commitee/Restu Rahmana Putra.jpg | 529×636 | 0.25 MB | person:Restu Rahmana Putra | `/teams` persons in charge | Portrait of Restu Rahmana Putra | ok |
| images/Commitee/Rafli Dwiki.jpg | 529×636 | 0.14 MB | person:Rafli Dwiki | `/teams` persons in charge | Portrait of Rafli Dwiki | ok |
| images/Commitee/Dr. Akhmad Arifin Hadi, S.P., M.A..jpg | 529×636 | 0.19 MB | person:Dr. Ahmad Arifin Hadi | `/teams` supervisors | Portrait of Dr. Ahmad Arifin Hadi, S.P., M.A. | needs confirmation: spelling "Akhmad" (file) vs "Ahmad" (handbook); photo permission |
| images/Commitee/Dr. Eng. Muhammad Adi Puspo Sujiwo, M.Kom..jpg | 529×636 | 0.16 MB | person:Dr. Eng. Muhammad Adi Puspo Sjiwo | `/teams` supervisors + research advisor | Portrait of Dr. Eng. Muhammad Adi Puspo Sjiwo, M.Kom. | needs confirmation: spelling "Sujiwo" (file) vs "Sjiwo" (handbook); photo permission |
| images/Commitee/Dr. Syaefudin, S.Si., M.Si..jpg | 529×636 | 0.11 MB | unknown | media library only (not assigned) | Portrait of Dr. Syaefudin, S.Si., M.Si. | needs confirmation: handbook lists "Dr. Syaquifin E.S., S.Si., M.Si." as Assistant Director; same person? |
| images/Foto Drone Sengon.jpg | 831×831 | 0.83 MB | project:sengon-x | Sengon-X cover; gallery | Sengon-X harvesting drone with an orange frame on a workbench | ok |
| images/Foto Pesawat RP KRTI 2025.jpg | 825×591 | 0.90 MB | project:varshata, team cover | VARSHATA cover; Agrisena Racing Plane card; gallery | Fixed-wing racing plane on its launch rail at KRTI 2025 | needs confirmation: is this plane VARSHATA? |
| images/Foto Transporter MBF 2024.jpg | 831×589 | 0.55 MB | project:abee, team cover | ABEE cover; Agrinaya Transporter card; gallery | Transporter robot next to its first-place trophy at the Mechanical Biosystem Fair 2024 | needs confirmation: is this robot ABEE? |
| images/Foto Drone KRTI 2024.jpg | 831×831 | 0.66 MB | team cover, gallery:competitions | Agrisena Aerial card; gallery | VTOL hexacopter on its landing pad at sunset, KRTI 2024 | ok |
| images/Foto Drone KRTI 2026.jpg | 3024×4032 | 0.91 MB | gallery:competitions | gallery; KRTI page | Orange quadcopter drone built for KRTI 2026 | ok |
| images/Foto Kegiatan tim mekanik.jpg | 1199×799 | 0.88 MB | gallery:activities | `/about` Mechanical; gallery | Mechanical team member assembling an aircraft wing in the workshop | ok |
| images/Foto Kegiatan tim elektrikal.jpg | 1199×799 | 1.32 MB | gallery:activities | `/about` Electrical; gallery | Electrical team members wiring a drone | ok |
| images/Foto kegiatan tim software.jpg | 1201×801 | 1.14 MB | gallery:activities | `/about` Software; gallery | Software team member working on a laptop at the flying field | ok |
| images/Kompetisi/SAFMC 2026.jpg | 1200×683 | 0.51 MB | competition:safmc | `/about` intro; gallery; SAFMC page (header) | IRC team holding the IRC and IPB flags at SAFMC 2026 in Singapore | ok |
| images/Kompetisi/SAFMC 2025.jpg | 1200×664 | 0.77 MB | competition:safmc | gallery; SAFMC page | IRC team holding the IPB and IRC flags at SAFMC 2025 | ok |
| images/Kompetisi/SAFMC 2024.jpg | 1200×664 | 0.62 MB | competition:safmc | gallery; SAFMC page | IRC team with the IPB, Indonesian and IRC flags at SAFMC 2024 | ok |
| images/Kompetisi/KRTI 2025.jpg | 1200×664 | 0.78 MB | competition:krti | gallery; KRTI page | IRC team with the IRC flag and racing plane at KRTI 2025 | ok |
| images/Kompetisi/KRTI 2024.jpg | 1200×675 | 0.79 MB | competition:krti | gallery; KRTI page | IRC team waving with the IPB and IRC flags at the KRTI 2024 closing ceremony | ok |
| images/Kompetisi/KRTI 2023.jpg | 1200×676 | 0.63 MB | competition:krti | gallery; KRTI page | IRC team members posing together at KRTI 2023 | ok |
| images/Kompetisi/MBF 2025.jpg | 1200×664 | 0.95 MB | competition:ground-robotics | gallery; Ground Robotics page | IRC team holding the IPB Robotic Club flag at the Mechanical Biosystem Fair 2025 | ok |
| images/Kompetisi/MBF 2024.jpg | 1200×664 | 0.86 MB | competition:ground-robotics | gallery; Ground Robotics page | IRC team with their transporter robots at the Mechanical Biosystem Fair 2024 | ok |
| images/Kompetisi/PRC 2025.jpg | 1200×664 | 0.54 MB | competition:ground-robotics | gallery; Ground Robotics page | IRC team saluting behind the IPB and IRC flags at the Polines Robotic Contest 2025 | ok |
| images/Kompetisi/FIRA ROBOSPORT 2025.jpg | 1200×664 | 0.44 MB | competition:ground-robotics | gallery; Ground Robotics page | Three IRC members holding the IPB Robotic Club banner at FIRA RoboSport 2025 | ok |
| images/Kompetisi/KRI 2023.jpg | 1200×676 | 0.36 MB | competition:kri | gallery; KRI page (header) | Two robots in traditional dance costumes at Kontes Robot Indonesia 2023 | ok |
| images/Kompetisi/KRI 2022.jpg | 1200×663 | 0.57 MB | competition:kri | gallery; KRI page | IRC members preparing dancing robots on the competition field at KRI 2022 | ok |
| images/Kompetisi/KRI 2021.jpg | 1200×676 | 0.32 MB | competition:kri | gallery; KRI page | Two dancing robots in traditional costume at Kontes Robot Indonesia 2021 | ok |
| images/Sponsor/SV_IPB.png | 612×242 | 0.06 MB | sponsor:IPB University Sekolah Vokasi | sponsor grids | IPB University Sekolah Vokasi logo | ok |
| images/Sponsor/HA_IPB.png | 1012×288 | 0.06 MB | sponsor:Himpunan Alumni IPB DPC Singapura | sponsor grids | Himpunan Alumni IPB DPC Singapura logo | ok |
| images/Sponsor/FISIKA_IPB.png | 780×122 | 0.08 MB | sponsor:IPB University Department of Physics | sponsor grids | IPB University Department of Physics logo | ok |
| images/Sponsor/SSMI_IPB.png | 926×182 | 0.10 MB | sponsor:Sekolah Sains Data, Matematika, dan Informatika | sponsor grids | IPB University Sekolah Sains Data, Matematika, dan Informatika logo | ok |
| images/Sponsor/FTT_IPB.png | 956×254 | 0.12 MB | sponsor:Faculty of Engineering and Technology | sponsor grids | IPB University Fakultas Teknik dan Teknologi logo | ok |
| images/Sponsor/Solidworks.png | 660×294 | 0.06 MB | sponsor:SolidWorks | sponsor grids | SolidWorks logo | ok |
| images/Sponsor/Soyanara.png | 384×294 | 0.09 MB | sponsor:Soyanara | seeded **hidden** (`is_published = false`) | Soyanara soy milk logo | needs confirmation: not in the handbook sponsor list |

## Content without an image (gradient placeholder with initials)

- Projects: ARGO-X, Custom Controller, AETHER.
- People: Rois Firosi, Rofiq Akhdan F, Dr. Syaquifin E.S., Lusiana S.
- Sponsors (shown as name text): Directorate of Student Affairs, IPB Prestasi, IPB University FMIPA, Susi Air.
- Footer: no white IPB University logo in `public/`; only the IRC logo is shown (rendered white with a CSS filter).

## Needs confirmation

1. `Qois Firosi.jpg` — whose photo is it (name tag on the shirt shows a different name)? Correct spelling: Rois or Qois?
2. `Mask group.jpg` — who is this?
3. `Dr. Syaefudin, S.Si., M.Si..jpg` vs handbook "Dr. Syaquifin E.S., S.Si., M.Si." — same person? Which spelling is right?
4. "Akhmad" vs "Ahmad" Arifin Hadi.
5. "Sujiwo" vs "Sjiwo".
6. Is the KRTI 2025 racing plane VARSHATA?
7. Is the MBF 2024 transporter ABEE?
8. Soyanara — past sponsor? (hidden until confirmed)
9. Four HEIC photos (KRTI 2024 national, KRTI 2026 regional) — export as JPG and upload via Admin → Gallery.
