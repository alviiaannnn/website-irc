import { createClient } from "@/lib/supabase/server"
import { Users, GraduationCap, Plane, Bot, Wrench, Palette, DollarSign, UserCheck, ArrowRight, Building2 } from "lucide-react"
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
      <section className="py-24 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-[#F04F2F]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-badge mb-6">
              <Building2 className="w-3.5 h-3.5" /> About Us
            </span>
            <h1 className="section-title mb-6">
              Advancing <span className="gradient-text-red">Robotics</span> at IPB University
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed mb-8">
              <strong className="text-[#1C3B5E]">IPB Robotic Club (IRC)</strong> is a functional organization under the mentoring of Directorate of Student Affairs <strong className="text-[#1C3B5E]">(Ditmawa) IPB University</strong> through the Subdirectorate Development of Student Reputation and Achievement, also known as <strong className="text-[#1C3B5E]">IPB Prestasi</strong>.
            </p>
            <p className="text-lg text-[#64748B] leading-relaxed mb-10">
              We gather students from <strong className="text-[#1C3B5E]">various academic backgrounds</strong> to collaborate and innovate in robotics. IRC annually represents IPB in both <strong className="text-[#1C3B5E]">National & International</strong> competitions, such as SAFMC, KRTI, and many other competitions.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {["Team Collaboration", "Technological Advancement", "Resilience and Adaptability"].map(tag => (
                <span key={tag} className="chip chip-outline">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ORG STRUCTURE ═══════ */}
      <section className="py-24 bg-[#F8FAFC] dot-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Users className="w-3.5 h-3.5" /> Structure
            </span>
            <h2 className="section-title">Organizational <span className="gradient-text">Structure</span></h2>
          </div>

          {/* Top Level Hierarchy */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { title: "Supervisor", sub: "IPB Prestasi", color: "1C3B5E" },
              { title: "General Manager", sub: "", color: "1C3B5E" },
              { title: "Steering Committee", sub: "Alumnee", color: "1C3B5E" },
            ].map((box) => (
              <div key={box.title} className="bg-[#1C3B5E] text-white rounded-2xl px-8 py-6 text-center shadow-lg min-w-[180px] hover-card">
                <h3 className="text-lg font-bold">{box.title}</h3>
                {box.sub && <p className="text-sm text-gray-300 mt-1">{box.sub}</p>}
              </div>
            ))}
          </div>

          {/* Connecting line */}
          <div className="flex justify-center mb-12">
            <div className="w-px h-12 bg-[#1C3B5E]/20" />
          </div>

          {/* Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Official */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover-card">
              <span className="chip chip-primary mb-4">Official Department</span>
              <div className="bg-[#1C3B5E] text-white rounded-xl px-4 py-3 text-center font-bold mb-4">Official Manager</div>
              <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-xl px-4 py-2.5 text-center text-sm font-semibold mb-6">Sekretaris & Bendahara Umum</div>
              <div className="space-y-3">
                {[
                  { icon: UserCheck, label: "HRD", desc: "Human Resource & Development" },
                  { icon: DollarSign, label: "FUND", desc: "Fundraising" },
                  { icon: Palette, label: "MnB", desc: "Media & Branding" },
                ].map(d => (
                  <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#1C3B5E]/10 flex items-center justify-center">
                      <d.icon className="w-4 h-4 text-[#1C3B5E]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1C3B5E]">{d.label}</span>
                      <span className="text-xs text-[#64748B] ml-2">{d.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover-card">
              <span className="chip chip-secondary mb-4">Technical Department</span>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["Captain RP", "Captain VTOL", "Captain GR"].map(c => (
                  <div key={c} className="bg-[#1C3B5E] text-white rounded-xl px-3 py-3 text-center text-xs font-bold">{c}</div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-xl px-3 py-2 text-center text-xs font-semibold">Adjutant</div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 rounded-xl bg-gray-50">
                    <p className="text-[10px] font-bold text-[#1C3B5E] mb-1.5">Divisi:</p>
                    <ul className="text-[10px] text-[#64748B] space-y-0.5">
                      <li className="flex items-center gap-1"><Wrench className="w-2.5 h-2.5" /> Mekanik</li>
                      <li className="flex items-center gap-1"><Wrench className="w-2.5 h-2.5" /> Elektro</li>
                      <li className="flex items-center gap-1"><Wrench className="w-2.5 h-2.5" /> Software</li>
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 px-2">
                <span className="text-xs font-bold text-[#F04F2F]">← Agrisena</span>
                <span className="text-xs font-bold text-[#1C3B5E]">Agrinaya →</span>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#1C3B5E] mb-3">Keterangan:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                { key: "RP", val: "Racing Plane" },
                { key: "VTOL", val: "Vertical Take-Off & Landing" },
                { key: "GR", val: "Ground Robotic" },
                { key: "MnB", val: "Media & Branding" },
                { key: "FUND", val: "Fundraising" },
                { key: "HRD", val: "Human Resource & Dev" },
              ].map(k => (
                <div key={k.key} className="flex items-center gap-2">
                  <span className="font-bold text-[#F04F2F]">{k.key}</span>
                  <span className="text-[#64748B]">{k.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Link href="/teams" className="group inline-flex items-center gap-2 bg-[#1C3B5E] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#2A5580] transition-all shadow-lg shadow-[#1C3B5E]/20">
            Meet the Committee 2026
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
