import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Users, ArrowRight, Cpu, Wrench, Code2 } from "lucide-react"

export const metadata = {
  title: "Teams | IPB Robotic Club",
  description: "Meet the Committee 2026 of IPB Robotic Club.",
}

export default async function TeamsPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("order_index")

  // Pre-fill with PDF data if DB is empty
  const defaultMembers = [
    { id: "1", name: "Qois Firosi", role: "G6401231031 | Computer Science", department: "Agrisena Aerial", description: "Software • Ardupilot • ROS2 • VTOL. Autonomous VTOL & GNC Developer for KRTI 2024. ROS2 Researcher for Autonomous VTOL Development for KRTI 2026. Raspberry Pi Systems Integrator.", image_url: null },
    { id: "2", name: "Ahmad Mumtaz", role: "G7401231098 | Physics", department: "Agrisena Racing Plane", description: "Mechanic • Pilot • Ardupilot • Plane. Lead Manufacturing Engineer – Led fabrication and assembly. Flight Test Pilot. Autopilot Integration Engineer.", image_url: null },
    { id: "3", name: "Rofif Akhdan F", role: "G7401241067 | Physics", department: "Agrinaya", description: "Mechanic • Electrical • Software • Transporter. Electrical System Engineer. System Design Engineer. Embedded Systems Engineer. Technical Lead, FIRA Indonesia 2025.", image_url: null },
  ]

  const displayMembers = members && members.length > 0 ? members : defaultMembers

  return (
    <div className="bg-white">

      {/* ═══════ HEADER ═══════ */}
      <section className="py-24 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-[#1C3B5E]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Users className="w-3.5 h-3.5" /> Our Team
            </span>
            <h1 className="section-title mb-4">Committee <span className="gradient-text-red">2026</span></h1>
            <p className="section-subtitle mx-auto">
              Meet the talented individuals driving IRC&apos;s mission to excel in robotics innovation and competition.
            </p>
          </div>

          {/* ═══════ MEMBER CARDS ═══════ */}
          <div className="space-y-8 max-w-4xl mx-auto">
            {displayMembers.map((member: any, idx: number) => (
              <div key={member.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover-card">
                <div className="flex flex-col md:flex-row">
                  {/* Photo */}
                  <div className="md:w-56 flex-shrink-0">
                    <div className="aspect-square md:aspect-auto md:h-full relative bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                      {member.image_url ? (
                        <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center gap-2 text-[#94A3B8]">
                          <Users className="w-10 h-10" />
                          <span className="text-xs">Add photo via Admin</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="chip chip-primary text-[10px]">{member.department || "Team"}</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#1C3B5E] uppercase tracking-tight">{member.name}</h3>
                    <p className="text-sm text-[#64748B] mt-1 mb-4">{member.role}</p>

                    {member.description && (
                      <div className="space-y-2">
                        {member.description.split('. ').filter(Boolean).map((line: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-[#64748B]">
                            <span className="text-[#F04F2F] mt-0.5 font-bold">•</span>
                            <span>{line.endsWith('.') ? line : line + '.'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Placeholder images for this member */}
                    <div className="flex gap-2 mt-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-16 h-16 rounded-xl img-placeholder text-[8px] flex-shrink-0">
                          <Cpu className="w-4 h-4 text-[#CBD5E1]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
