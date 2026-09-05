import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Teams | IPB Robotic Club",
  description: "Meet the supervisors, committees, and team members of IPB Robotic Club.",
}

export default async function TeamsPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("order_index")

  const supervisors = members?.filter(m => m.department?.toLowerCase().includes("supervisor")) || []
  const committee = members?.filter(m => !m.department?.toLowerCase().includes("supervisor")) || []

  return (
    <div className="bg-white">

      {/* Header */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute top-10 right-0 w-20 h-20 bg-[#1C3B5E] rounded-full translate-x-1/2 opacity-60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="page-title mb-16">Commitee 2026</h1>

          {/* Committee Members - PDF style cards */}
          <div className="space-y-12 max-w-4xl mx-auto">
            {committee.length > 0 ? committee.map((member) => (
              <div key={member.id} className="flex flex-col md:flex-row gap-6 items-start">
                {/* Photo */}
                <div className="w-full md:w-48 flex-shrink-0">
                  <div className="aspect-square relative rounded-2xl overflow-hidden bg-[#F3F5F8] shadow-md">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#1C3B5E]/30">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1">
                  {/* Team badge */}
                  <span className="tag-chip mb-3">{member.department || "Team"}</span>
                  <h3 className="text-2xl font-black text-[#1C3B5E] uppercase mt-2">{member.name}</h3>
                  <p className="text-[#1C3B5E]/60 text-sm font-medium mt-1">{member.role}</p>
                  {member.description && (
                    <div className="mt-4 text-sm text-[#1C3B5E]/80 leading-relaxed">
                      <p>{member.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-[#1C3B5E]/50">
                <p className="text-lg">No committee members listed yet.</p>
                <p className="text-sm mt-2">Add members via the admin dashboard.</p>
              </div>
            )}
          </div>

          {/* Supervisors */}
          {supervisors.length > 0 && (
            <div className="mt-20">
              <h2 className="page-title mb-12">Supervisors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {supervisors.map((member) => (
                  <div key={member.id} className="text-center">
                    <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden bg-[#F3F5F8] shadow-md mb-4">
                      {member.image_url ? (
                        <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#1C3B5E]/30 text-xs">No Photo</div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#1C3B5E]">{member.name}</h3>
                    <p className="text-sm text-[#1C3B5E]/60">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
