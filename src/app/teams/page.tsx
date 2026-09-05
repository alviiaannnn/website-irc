import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Teams | IPB Robotic Club",
  description: "Meet the supervisors, committees, and team members of IPB Robotic Club.",
}

export default async function TeamsPage() {
  const supabase = await createClient()

  // Fetch team members
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("order_index")

  const supervisors = members?.filter(m => m.department.toLowerCase().includes("supervisor")) || []
  const committee = members?.filter(m => !m.department.toLowerCase().includes("supervisor")) || []

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Meet the Team
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            The dedicated individuals behind IPB Robotic Club's success.
          </p>
        </div>

        {/* Supervisors */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Supervisors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {supervisors.length > 0 ? supervisors.map((member) => (
              <TeamCard key={member.id} member={member} />
            )) : (
              <div className="col-span-full p-8 text-center rounded-xl">
                <p className="text-slate-500">No supervisors listed yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Committee */}
        <div>
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Committee 2026</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committee.length > 0 ? committee.map((member) => (
              <TeamCard key={member.id} member={member} />
            )) : (
              <div className="col-span-full p-8 text-center rounded-xl">
                <p className="text-slate-500">No committee members listed yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

function TeamCard({ member }: { member: any }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg text-center bg-white group transition-all duration-300 hover:-translate-y-2">
      <div className="pt-8 pb-4 flex justify-center relative">
        {/* Decorative background element */}
        <div className="absolute top-0 inset-x-0 h-32 bg-slate-100 rounded-b-[50%] -z-10" />
        
        <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
          {member.image_url ? (
            <Image
              src={member.image_url}
              alt={member.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}
        </div>
      </div>
      <CardHeader className="pt-2 pb-4">
        <span className="inline-block mx-auto bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          {member.role}
        </span>
        <CardTitle className="text-xl font-bold text-slate-900">{member.name}</CardTitle>
        <CardDescription className="text-sm font-medium text-secondary">
          {member.department}
        </CardDescription>
      </CardHeader>
      {member.description && (
        <CardContent>
          <p className="text-slate-600 text-sm">{member.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
