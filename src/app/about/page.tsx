import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "About Us | IPB Robotic Club",
  description: "Learn about IPB Robotic Club's vision, mission, and organizational structure.",
}

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  return (
    <div className="bg-white">

      {/* About Header */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute top-10 right-0 w-20 h-20 bg-[#1C3B5E] rounded-full translate-x-1/2 opacity-60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="page-title mb-10">About Us</h1>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-[#1C3B5E] leading-relaxed mb-6 text-justify">
              <strong>IPB Robotic Club (IRC)</strong> is a functional organization under the mentoring of Directorate of Student Affairs <strong>(Ditmawa) IPB University</strong> through the Subdirectorate Development of Student Reputation and Achievement, also known as <strong>IPB Prestasi</strong>. IRC is a place for student competencies development in robotics, technology, and innovation fields, as well as strategic steps in supporting robotics research at IPB University.
            </p>
            <p className="text-lg text-[#1C3B5E] leading-relaxed mb-8 text-justify">
              We gather students from <strong>various academic backgrounds</strong> to collaborate and innovate in robotics. IRC annually represents IPB in both <strong>National & International</strong> competition, such as Singapore Amazing Flying Machine Competition <strong>(SAFMC)</strong>, Kontes Robot Terbang Indonesia <strong>(KRTI)</strong>, and many other <strong>competitions</strong>.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-12">
              <span className="tag-chip-outline">Team Collaboration</span>
              <span className="tag-chip-outline">Technological Advancement</span>
              <span className="tag-chip-outline">Resilience and Adaptability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure - matching PDF page 3 */}
      <section className="py-20 bg-[#F3F5F8] relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="page-title mb-16">Organizational Structure</h2>

          {/* Top Level */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-[#1C3B5E] text-white rounded-xl px-8 py-5 text-center shadow-lg min-w-[180px]">
                <h3 className="text-lg font-bold">Supervisor</h3>
                <p className="text-sm text-gray-300 mt-1">IPB Prestasi</p>
              </div>
              <div className="bg-[#1C3B5E] text-white rounded-xl px-8 py-5 text-center shadow-lg min-w-[180px]">
                <h3 className="text-lg font-bold">General Manager</h3>
              </div>
              <div className="bg-[#1C3B5E] text-white rounded-xl px-8 py-5 text-center shadow-lg min-w-[180px]">
                <h3 className="text-lg font-bold">Steering Committee</h3>
                <p className="text-sm text-gray-300 mt-1">Alumnee</p>
              </div>
            </div>

            {/* Departments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              {/* Official Department */}
              <div className="border-2 border-[#1C3B5E]/20 rounded-xl p-6 bg-white">
                <p className="text-xs font-semibold text-[#1C3B5E]/60 uppercase tracking-wider mb-4">Official Department</p>
                <div className="bg-[#1C3B5E] text-white rounded-lg px-4 py-3 text-center font-bold mb-4">Official Manager</div>
                <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-lg px-4 py-2 text-center text-sm font-semibold mb-4">Sekretaris & Bendahara Umum</div>
                <div className="bg-[#F3F5F8] rounded-lg p-4">
                  <p className="text-sm font-bold text-[#1C3B5E] mb-2">Divisi :</p>
                  <ul className="text-sm text-[#1C3B5E]/80 space-y-1 list-disc list-inside">
                    <li>HRD</li>
                    <li>FUND</li>
                    <li>MnB</li>
                  </ul>
                </div>
              </div>

              {/* Technical Department */}
              <div className="border-2 border-[#1C3B5E]/20 rounded-xl p-6 bg-white">
                <p className="text-xs font-semibold text-[#1C3B5E]/60 uppercase tracking-wider mb-4">Technical Department</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#1C3B5E] text-white rounded-lg px-3 py-3 text-center text-sm font-bold">Captain RP</div>
                  <div className="bg-[#1C3B5E] text-white rounded-lg px-3 py-3 text-center text-sm font-bold">Captain VTOL</div>
                  <div className="bg-[#1C3B5E] text-white rounded-lg px-3 py-3 text-center text-sm font-bold">Captain GR</div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-lg px-3 py-2 text-center text-xs font-semibold">Adjutant</div>
                  <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-lg px-3 py-2 text-center text-xs font-semibold">Adjutant</div>
                  <div className="bg-[#F04F2F]/10 text-[#F04F2F] rounded-lg px-3 py-2 text-center text-xs font-semibold">Adjutant</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-[#F3F5F8] rounded-lg p-3">
                      <p className="text-xs font-bold text-[#1C3B5E] mb-1">Divisi :</p>
                      <ul className="text-xs text-[#1C3B5E]/80 space-y-0.5 list-disc list-inside">
                        <li>Mekanik</li>
                        <li>Elektro</li>
                        <li>Software</li>
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-semibold text-[#1C3B5E]/60 uppercase tracking-wider px-2">
                  <span>Agrisena</span>
                  <span>Agrinaya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="max-w-4xl mx-auto mt-8">
            <h3 className="text-lg font-bold text-[#1C3B5E] mb-4">Keterangan :</h3>
            <ul className="text-[#1C3B5E]/80 space-y-1 text-sm">
              <li><strong>RP :</strong> Racing Plane</li>
              <li><strong>VTOL :</strong> Vertical Take-Off and Landing</li>
              <li><strong>GR :</strong> Ground Robotic</li>
              <li><strong>MnB :</strong> Media & Branding</li>
              <li><strong>FUND :</strong> Fundraising</li>
              <li><strong>HRD :</strong> Human Resource & Development</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
