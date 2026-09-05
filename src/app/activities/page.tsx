import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Activities | IPB Robotic Club",
  description: "Past competitions and achievements of IPB Robotic Club.",
}

export default async function ActivitiesPage() {
  const supabase = await createClient()

  // Fetch achievements/competitions
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("year", { ascending: false })
    .order("order_index")

  // Group by category manually for display
  const safmc = achievements?.filter(a => a.category.toLowerCase().includes("safmc")) || []
  const krti = achievements?.filter(a => a.category.toLowerCase().includes("krti")) || []
  const ground = achievements?.filter(a => a.category.toLowerCase().includes("ground") || a.category.toLowerCase().includes("transporter")) || []
  const others = achievements?.filter(a => 
    !a.category.toLowerCase().includes("safmc") && 
    !a.category.toLowerCase().includes("krti") && 
    !a.category.toLowerCase().includes("ground") &&
    !a.category.toLowerCase().includes("transporter")
  ) || []

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Past Competition & Achievements
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Some of the competitions we have participated in so far. We continuously push boundaries in aerial and ground robotics.
          </p>
        </div>

        {/* SAFMC */}
        <div className="mb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900">SAFMC</h2>
            <p className="text-slate-600 mt-4 max-w-3xl">
              Organized by DSO National Laboratories and Science Centre Singapore. A platform for exploring the science behind flight and building flying machines.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safmc.length > 0 ? safmc.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            )) : (
              <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">No SAFMC achievements added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* KRTI */}
        <div className="mb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900">KRTI</h2>
            <p className="text-slate-600 mt-4 max-w-3xl">
              Kontes Robot Terbang Indonesia organized by the Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {krti.length > 0 ? krti.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            )) : (
              <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">No KRTI achievements added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ground Robotics */}
        <div className="mb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Ground Robotics</h2>
            <p className="text-slate-600 mt-4 max-w-3xl">
              Developing land-based robots designed to complete specific tasks such as navigation, object transportation, and robotic system coordination.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ground.length > 0 ? ground.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            )) : (
              <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">No Ground Robotics achievements added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Other Competitions */}
        {others.length > 0 && (
          <div className="mb-20">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Other Competitions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: any }) {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      {achievement.image_url && (
        <div className="aspect-video relative bg-slate-200 overflow-hidden">
          <Image
            src={achievement.image_url}
            alt={achievement.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {achievement.year}
          </span>
          <span className="inline-block text-slate-500 text-xs font-medium uppercase tracking-wider">
            {achievement.category}
          </span>
        </div>
        <CardTitle className="text-xl leading-snug">{achievement.title}</CardTitle>
      </CardHeader>
      {achievement.description && (
        <CardContent>
          <p className="text-slate-600 text-sm">{achievement.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
