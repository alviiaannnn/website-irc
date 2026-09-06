import { createClient } from "@/lib/supabase/server"
import { Users, Building2, Wrench, Palette, DollarSign, UserCheck, ArrowRight, ShieldCheck, Cpu, Plane, Bot, Target, Compass } from "lucide-react"
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
        <div className="absolute top-20 -right-20 w-80 h-80 bg-[#F04F2F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#1C3B5E]/5 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="section-badge mb-6">
              <Building2 className="w-3.5 h-3.5" /> About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[#1C3B5E] tracking-tight mb-8 leading-tight">
              Advancing <span className="gradient-text-red">Robotics</span> at IPB University
            </h1>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm text-left space-y-4 mb-10">
              <p className="text-base md:text-lg text-[#64748B] leading-relaxed">
                <strong className="text-[#1C3B5E] font-bold">IPB Robotic Club (IRC)</strong> is a functional organization under the mentoring of Directorate of Student Affairs <strong className="text-[#1C3B5E] font-bold">(Ditmawa) IPB University</strong> through the Subdirectorate Development of Student Reputation and Achievement, also known as <strong className="text-[#1C3B5E] font-bold">IPB Prestasi</strong>.
              </p>
              <p className="text-base md:text-lg text-[#64748B] leading-relaxed">
                We gather students from <strong className="text-[#1C3B5E] font-bold">various academic backgrounds</strong> to collaborate and innovate in robotics. IRC annually represents IPB in both <strong className="text-[#1C3B5E] font-bold">National & International competitions</strong>, such as SAFMC, KRTI, and many other prestigious technology challenges.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {["Team Collaboration", "Technological Advancement", "Resilience and Adaptability"].map(tag => (
                <span key={tag} className="chip chip-outline text-xs px-4 py-2 bg-gray-50/80 border-gray-200 text-[#1C3B5E] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ VISION & MISSION ═══════ */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover-card">
              <div className="w-12 h-12 rounded-2xl bg-[#F04F2F]/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#F04F2F]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C3B5E] mb-3">Our Vision</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                To become a premier robotics research and competition hub in Indonesia, driving innovations in autonomous systems, agricultural automation, and aerospace engineering.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover-card">
              <div className="w-12 h-12 rounded-2xl bg-[#1C3B5E]/10 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-[#1C3B5E]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C3B5E] mb-3">Our Mission</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
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
              <Users className="w-3.5 h-3.5" /> Structure
            </span>
            <h2 className="section-title mb-4">Organizational <span className="gradient-text">Structure</span></h2>
            <p className="text-sm md:text-base text-[#64748B]">
              The leadership hierarchy and departmental breakdown of IPB Robotic Club 2026.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* LEVEL 1: TOP GOVERNANCE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: "Supervisor", sub: "IPB Prestasi (Ditmawa IPB)", badge: "Pembina", icon: ShieldCheck },
                { title: "General Manager", sub: "IPB Robotic Club", badge: "Ketua Umum", icon: Users },
                { title: "Steering Committee", sub: "Alumnee & Advisors", badge: "Pengarah", icon: Building2 },
              ].map((box) => (
                <div key={box.title} className="bg-[#1C3B5E] text-white rounded-2xl p-6 text-center shadow-md relative overflow-hidden border border-[#2A5580] hover-card">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#F04F2F] bg-[#F04F2F]/20 px-3 py-1 rounded-full mb-3">
                    {box.badge}
                  </span>
                  <h3 className="text-lg font-black text-white">{box.title}</h3>
                  <p className="text-xs text-gray-300 mt-1">{box.sub}</p>
                </div>
              ))}
            </div>

            {/* CONNECTING LINE */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="w-px h-8 bg-[#1C3B5E]/30" />
              <div className="w-3 h-3 rounded-full bg-[#F04F2F] shadow-sm" />
              <div className="w-px h-8 bg-[#1C3B5E]/30" />
            </div>

            {/* LEVEL 2: EXECUTIVE DEPARTMENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* OFFICIAL DEPARTMENT */}
              <div className="bg-[#F8FAFC] rounded-3xl p-7 border border-gray-200/80 shadow-sm flex flex-col justify-between hover-card">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <span className="chip chip-primary font-bold text-xs">Official Department</span>
                    <span className="text-xs font-semibold text-[#64748B]">Departemen Resmi</span>
                  </div>

                  {/* Leader */}
                  <div className="bg-[#1C3B5E] text-white rounded-xl p-4 text-center mb-4 shadow-sm">
                    <h4 className="font-extrabold text-sm uppercase tracking-wide">Official Manager</h4>
                    <p className="text-xs text-[#F04F2F] font-medium mt-0.5">Sekretaris & Bendahara Umum</p>
                  </div>

                  {/* Sub-divisions */}
                  <div className="space-y-3">
                    {[
                      { icon: UserCheck, label: "HRD", title: "Human Resource & Development", desc: "Member development & internal management" },
                      { icon: DollarSign, label: "FUND", title: "Fundraising", desc: "Sponsorship & financial operations" },
                      { icon: Palette, label: "MnB", title: "Media & Branding", desc: "Public relations, design & publication" },
                    ].map(d => (
                      <div key={d.label} className="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-3.5 shadow-2xs">
                        <div className="w-9 h-9 rounded-lg bg-[#1C3B5E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <d.icon className="w-4 h-4 text-[#1C3B5E]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#F04F2F] bg-[#F04F2F]/10 px-2 py-0.5 rounded-md">{d.label}</span>
                            <span className="text-xs font-bold text-[#1C3B5E]">{d.title}</span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-1">{d.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TECHNICAL DEPARTMENT */}
              <div className="bg-[#F8FAFC] rounded-3xl p-7 border border-gray-200/80 shadow-sm flex flex-col justify-between hover-card">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <span className="chip chip-secondary font-bold text-xs">Technical Department</span>
                    <span className="text-xs font-semibold text-[#64748B]">Departemen Teknis</span>
                  </div>

                  {/* Captains Row */}
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    {[
                      { title: "Captain RP", sub: "Racing Plane" },
                      { title: "Captain VTOL", sub: "VTOL UAV" },
                      { title: "Captain GR", sub: "Ground Robot" },
                    ].map(c => (
                      <div key={c.title} className="bg-[#1C3B5E] text-white rounded-xl p-3 text-center shadow-2xs">
                        <h5 className="font-extrabold text-xs">{c.title}</h5>
                        <p className="text-[10px] text-gray-300 mt-0.5">{c.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Adjutants Row */}
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-[#F04F2F]/10 border border-[#F04F2F]/20 text-[#F04F2F] rounded-xl py-2 text-center text-xs font-bold">
                        Adjutant
                      </div>
                    ))}
                  </div>

                  {/* Technical Divisions Bar */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5 text-center">
                    <span className="text-xs font-bold text-[#1C3B5E] block mb-2">Divisi Rekayasa Teknis:</span>
                    <div className="flex justify-center items-center gap-2 flex-wrap text-xs">
                      <span className="px-3 py-1 rounded-lg bg-gray-100 text-[#1C3B5E] font-semibold">⚙️ Mekanik</span>
                      <span className="px-3 py-1 rounded-lg bg-gray-100 text-[#1C3B5E] font-semibold">⚡ Elektro</span>
                      <span className="px-3 py-1 rounded-lg bg-gray-100 text-[#1C3B5E] font-semibold">💻 Software</span>
                    </div>
                  </div>

                  {/* Research Teams Sub-card */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3.5 border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Plane className="w-4 h-4 text-[#F04F2F]" />
                        <span className="text-xs font-black text-[#F04F2F]">Agrisena</span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">Tim Riset Aerial (Racing Plane & VTOL UAV)</p>
                    </div>
                    <div className="bg-white rounded-xl p-3.5 border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Bot className="w-4 h-4 text-[#1C3B5E]" />
                        <span className="text-xs font-black text-[#1C3B5E]">Agrinaya</span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">Tim Riset Ground (Ground Robot & Transporter)</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* LEGEND / KETERANGAN */}
            <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold text-[#1C3B5E] uppercase tracking-wider mb-4">Keterangan Singkatan:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                {[
                  { key: "RP", val: "Racing Plane" },
                  { key: "VTOL", val: "Vertical Take-Off & Landing" },
                  { key: "GR", val: "Ground Robotic" },
                  { key: "HRD", val: "Human Resource & Dev" },
                  { key: "FUND", val: "Fundraising" },
                  { key: "MnB", val: "Media & Branding" },
                ].map(k => (
                  <div key={k.key} className="bg-[#F8FAFC] rounded-lg p-2.5 border border-gray-100">
                    <span className="font-bold text-[#F04F2F] block">{k.key}</span>
                    <span className="text-[11px] text-[#64748B]">{k.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="container mx-auto text-center">
          <Link href="/teams" className="group inline-flex items-center gap-2.5 bg-[#1C3B5E] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#2A5580] transition-all shadow-md shadow-[#1C3B5E]/20">
            Meet the Committee 2026
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}

