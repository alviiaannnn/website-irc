import { createClient } from "@/lib/supabase/server"
import { Users, Building2, Wrench, Palette, DollarSign, UserCheck, ArrowRight, ShieldCheck, Plane, Bot, Target, Compass, Cpu } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "About Us | IPB Robotic Club",
  description: "Learn about IRC's vision, mission, organizational structure, and teams.",
}

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  return (
    <div className="bg-white">

      {/* ═══════ HERO ═══════ */}
      <section className="py-20 md:py-28 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-[#F04F2F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-96 h-96 bg-[#1C3B5E]/5 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="section-badge mb-6">
              <Building2 className="w-4 h-4" /> About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[#1C3B5E] tracking-tight mb-8 leading-tight">
              Advancing <span className="gradient-text-red">Robotics</span> at IPB University
            </h1>
            
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-gray-200/80 shadow-sm text-left space-y-5 mb-10">
              <p className="text-base md:text-xl text-[#64748B] leading-relaxed">
                <strong className="text-[#1C3B5E] font-extrabold">IPB Robotic Club (IRC)</strong> is a functional organization under the mentoring of Directorate of Student Affairs <strong className="text-[#1C3B5E] font-extrabold">(Ditmawa) IPB University</strong> through the Subdirectorate Development of Student Reputation and Achievement, also known as <strong className="text-[#1C3B5E] font-extrabold">IPB Prestasi</strong>.
              </p>
              <p className="text-base md:text-xl text-[#64748B] leading-relaxed">
                We gather students from <strong className="text-[#1C3B5E] font-extrabold">various academic backgrounds</strong> to collaborate and innovate in robotics. IRC annually represents IPB in both <strong className="text-[#1C3B5E] font-extrabold">National & International competitions</strong>, such as SAFMC, KRTI, and many other prestigious technology challenges.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {["Team Collaboration", "Technological Advancement", "Resilience and Adaptability"].map(tag => (
                <span key={tag} className="chip chip-outline text-sm px-5 py-2.5 bg-gray-50 border-gray-200 text-[#1C3B5E] font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ VISION & MISSION ═══════ */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200/80 shadow-sm hover-card">
              <div className="w-14 h-14 rounded-2xl bg-[#F04F2F]/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-[#F04F2F]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C3B5E] mb-4">Our Vision</h3>
              <p className="text-base text-[#64748B] leading-relaxed">
                To become a premier robotics research and competition hub in Indonesia, driving innovations in autonomous systems, agricultural automation, and aerospace engineering.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200/80 shadow-sm hover-card">
              <div className="w-14 h-14 rounded-2xl bg-[#1C3B5E]/10 flex items-center justify-center mb-6">
                <Compass className="w-7 h-7 text-[#1C3B5E]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C3B5E] mb-4">Our Mission</h3>
              <p className="text-base text-[#64748B] leading-relaxed">
                Fostering interdisciplinary collaboration, developing high-performance aerial and ground robots, and representing IPB University with honor in national and international arenas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ORG STRUCTURE ═══════ */}
      <section className="py-24 bg-white dot-bg">
        <div className="container mx-auto">
          
          {/* Section Title */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="section-badge mb-4">
              <Users className="w-4 h-4" /> Structure
            </span>
            <h2 className="section-title mb-4">Organizational <span className="gradient-text">Structure</span></h2>
            <p className="text-base md:text-lg text-[#64748B]">
              The leadership hierarchy and departmental breakdown of IPB Robotic Club 2026.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* LEVEL 1: TOP LEADERSHIP */}
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F04F2F] bg-[#F04F2F]/10 px-4 py-1.5 rounded-full">
                  Top Leadership & Governance
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Supervisor", sub: "IPB Prestasi (Ditmawa IPB)", badge: "Pembina", icon: ShieldCheck },
                  { title: "General Manager", sub: "IPB Robotic Club 2026", badge: "Ketua Umum", icon: Users },
                  { title: "Steering Committee", sub: "Alumnee & Senior Advisors", badge: "Pengarah", icon: Building2 },
                ].map((box) => (
                  <div key={box.title} className="bg-[#1C3B5E] text-white rounded-3xl p-8 text-center shadow-lg relative overflow-hidden border border-[#2A5580] hover-card">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <box.icon className="w-6 h-6 text-[#F04F2F]" />
                    </div>
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#F04F2F] bg-[#F04F2F]/20 px-3 py-1 rounded-full mb-3">
                      {box.badge}
                    </span>
                    <h3 className="text-xl font-black text-white">{box.title}</h3>
                    <p className="text-sm text-gray-300 mt-2">{box.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CONNECTING LINE */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="w-px h-8 bg-[#1C3B5E]/30" />
              <div className="w-4 h-4 rounded-full bg-[#F04F2F] shadow-md ring-4 ring-[#F04F2F]/20" />
              <div className="w-px h-8 bg-[#1C3B5E]/30" />
            </div>

            {/* LEVEL 2: OFFICIAL DEPARTMENT */}
            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                <div>
                  <span className="chip chip-primary font-bold text-xs uppercase tracking-wider mb-1">Department 01</span>
                  <h3 className="text-2xl font-black text-[#1C3B5E]">Official Department</h3>
                </div>
                <div className="bg-[#1C3B5E] text-white px-6 py-3 rounded-2xl text-center shadow-sm">
                  <span className="text-xs text-[#F04F2F] font-bold block uppercase tracking-wider">Official Manager</span>
                  <span className="text-sm font-extrabold">Sekretaris & Bendahara Umum</span>
                </div>
              </div>

              {/* 3 Division Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: UserCheck, label: "HRD", title: "Human Resource & Development", desc: "Member onboarding, internal affairs, talent development & organizational growth." },
                  { icon: DollarSign, label: "FUND", title: "Fundraising", desc: "Sponsorship acquisition, partner relations & financial resource management." },
                  { icon: Palette, label: "MnB", title: "Media & Branding", desc: "Public relations, social media, visual identity & event publication." },
                ].map(d => (
                  <div key={d.label} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover-card flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1C3B5E]/10 flex items-center justify-center flex-shrink-0">
                          <d.icon className="w-5 h-5 text-[#1C3B5E]" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#F04F2F] bg-[#F04F2F]/10 px-2.5 py-0.5 rounded-md inline-block mb-0.5">{d.label}</span>
                          <h4 className="text-base font-bold text-[#1C3B5E] leading-snug">{d.title}</h4>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LEVEL 3: TECHNICAL DEPARTMENT */}
            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                <div>
                  <span className="chip chip-secondary font-bold text-xs uppercase tracking-wider mb-1">Department 02</span>
                  <h3 className="text-2xl font-black text-[#1C3B5E]">Technical Department</h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#64748B] mr-2">Rekayasa Teknis:</span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-[#1C3B5E] text-xs font-bold shadow-2xs">⚙️ Mekanik</span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-[#1C3B5E] text-xs font-bold shadow-2xs">⚡ Elektro</span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-[#1C3B5E] text-xs font-bold shadow-2xs">💻 Software</span>
                </div>
              </div>

              {/* 3 Technical Aircraft/Robot Division Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Racing Plane */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F04F2F]/10 flex items-center justify-center flex-shrink-0">
                        <Plane className="w-5 h-5 text-[#F04F2F]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#F04F2F] bg-[#F04F2F]/10 px-2.5 py-0.5 rounded-md inline-block mb-0.5">RP</span>
                        <h4 className="text-base font-bold text-[#1C3B5E]">Racing Plane</h4>
                      </div>
                    </div>
                    <div className="space-y-2.5 mb-4">
                      <div className="bg-[#1C3B5E] text-white rounded-xl p-3 text-center">
                        <span className="text-xs text-gray-300 block">Leadership</span>
                        <span className="text-sm font-bold">Captain RP</span>
                      </div>
                      <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-xl p-2.5 text-center font-bold text-xs border border-[#F04F2F]/20">
                        Adjutant RP
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-[#F04F2F] block mb-1">R&D Team:</span>
                      <p className="text-xs text-[#64748B]"><strong>Agrisena</strong> (Aerial Robotics Research)</p>
                    </div>
                  </div>
                </div>

                {/* VTOL UAV */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1C3B5E]/10 flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-5 h-5 text-[#1C3B5E]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#1C3B5E] bg-[#1C3B5E]/10 px-2.5 py-0.5 rounded-md inline-block mb-0.5">VTOL</span>
                        <h4 className="text-base font-bold text-[#1C3B5E]">VTOL UAV</h4>
                      </div>
                    </div>
                    <div className="space-y-2.5 mb-4">
                      <div className="bg-[#1C3B5E] text-white rounded-xl p-3 text-center">
                        <span className="text-xs text-gray-300 block">Leadership</span>
                        <span className="text-sm font-bold">Captain VTOL</span>
                      </div>
                      <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-xl p-2.5 text-center font-bold text-xs border border-[#F04F2F]/20">
                        Adjutant VTOL
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-[#F04F2F] block mb-1">R&D Team:</span>
                      <p className="text-xs text-[#64748B]"><strong>Agrisena</strong> (Aerial Robotics Research)</p>
                    </div>
                  </div>
                </div>

                {/* Ground Robot */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F04F2F]/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-[#F04F2F]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#F04F2F] bg-[#F04F2F]/10 px-2.5 py-0.5 rounded-md inline-block mb-0.5">GR</span>
                        <h4 className="text-base font-bold text-[#1C3B5E]">Ground Robotics</h4>
                      </div>
                    </div>
                    <div className="space-y-2.5 mb-4">
                      <div className="bg-[#1C3B5E] text-white rounded-xl p-3 text-center">
                        <span className="text-xs text-gray-300 block">Leadership</span>
                        <span className="text-sm font-bold">Captain GR</span>
                      </div>
                      <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-xl p-2.5 text-center font-bold text-xs border border-[#F04F2F]/20">
                        Adjutant GR
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-[#1C3B5E] block mb-1">R&D Team:</span>
                      <p className="text-xs text-[#64748B]"><strong>Agrinaya</strong> (Ground Robotics Research)</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* LEGEND / KETERANGAN */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm">
              <h4 className="text-xs font-extrabold text-[#1C3B5E] uppercase tracking-wider mb-4">Keterangan Singkatan Organisasi:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs">
                {[
                  { key: "RP", val: "Racing Plane" },
                  { key: "VTOL", val: "Vertical Take-Off & Landing" },
                  { key: "GR", val: "Ground Robotic" },
                  { key: "HRD", val: "Human Resource & Dev" },
                  { key: "FUND", val: "Fundraising" },
                  { key: "MnB", val: "Media & Branding" },
                ].map(k => (
                  <div key={k.key} className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-200/80">
                    <span className="font-extrabold text-[#F04F2F] text-sm block mb-0.5">{k.key}</span>
                    <span className="text-xs text-[#64748B] font-medium leading-tight">{k.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto text-center">
          <Link href="/teams" className="group inline-flex items-center gap-3 bg-[#1C3B5E] text-white px-9 py-4.5 rounded-2xl font-bold text-base hover:bg-[#2A5580] transition-all shadow-lg shadow-[#1C3B5E]/20">
            Meet the Committee 2026
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}

