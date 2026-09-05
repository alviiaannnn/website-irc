import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Trophy, Handshake, Image as ImageIcon } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard | IPB Robotic Club",
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch counts
  const [
    { count: projectsCount },
    { count: membersCount },
    { count: achievementsCount },
    { count: sponsorsCount },
    { count: galleriesCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: 'exact', head: true }),
    supabase.from("team_members").select("*", { count: 'exact', head: true }),
    supabase.from("achievements").select("*", { count: 'exact', head: true }),
    supabase.from("sponsors").select("*", { count: 'exact', head: true }),
    supabase.from("gallery_images").select("*", { count: 'exact', head: true }),
  ])

  const stats = [
    { title: "Total Projects", value: projectsCount || 0, icon: Briefcase },
    { title: "Team Members", value: membersCount || 0, icon: Users },
    { title: "Achievements", value: achievementsCount || 0, icon: Trophy },
    { title: "Sponsors", value: sponsorsCount || 0, icon: Handshake },
    { title: "Gallery Images", value: galleriesCount || 0, icon: ImageIcon },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome to the IRC Admin Portal.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Guide</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <p className="text-slate-600">Use the sidebar navigation to manage different sections of the website:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong>Site Settings:</strong> Change global text like Hero title, About description, and contact info.</li>
            <li><strong>Projects:</strong> Add new projects or edit existing ones. Upload multiple images per project.</li>
            <li><strong>Teams:</strong> Manage organizational structure, supervisors, and committee members.</li>
            <li><strong>Achievements:</strong> Add competition results and timelines.</li>
            <li><strong>Sponsors:</strong> Manage past sponsors and partners.</li>
            <li><strong>Gallery:</strong> Upload activity photos for the public gallery.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
