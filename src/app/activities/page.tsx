import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Activities | IPB Robotic Club",
  description: "Past competitions and achievements of IPB Robotic Club.",
}

export default async function ActivitiesPage() {
  const supabase = await createClient()

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("year", { ascending: false })
    .order("order_index")

  const safmc = achievements?.filter(a => a.category?.toLowerCase().includes("safmc")) || []
  const krti = achievements?.filter(a => a.category?.toLowerCase().includes("krti")) || []
  const ground = achievements?.filter(a => a.category?.toLowerCase().includes("ground") || a.category?.toLowerCase().includes("transporter")) || []
  const others = achievements?.filter(a =>
    !a.category?.toLowerCase().includes("safmc") &&
    !a.category?.toLowerCase().includes("krti") &&
    !a.category?.toLowerCase().includes("ground") &&
    !a.category?.toLowerCase().includes("transporter")
  ) || []

  return (
    <div className="bg-white">

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute top-10 right-0 w-20 h-20 bg-[#1C3B5E] rounded-full translate-x-1/2 opacity-60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="page-title mb-4">Past Competition & Achievements</h1>
          <p className="text-center text-[#1C3B5E]/70 text-lg max-w-3xl mx-auto mb-16">
            Some of the competitions we have participated in so far. We continuously push boundaries in aerial and ground robotics.
          </p>

          {/* SAFMC */}
          <div className="mb-20">
            <h2 className="text-2xl font-black text-[#1C3B5E] uppercase mb-2">SAFMC</h2>
            <p className="text-[#1C3B5E]/60 mb-8 max-w-3xl">
              Organized by DSO National Laboratories and Science Centre Singapore. A platform for exploring the science behind flight and building flying machines.
            </p>
            <AchievementGrid achievements={safmc} />
          </div>

          {/* KRTI */}
          <div className="mb-20">
            <h2 className="text-2xl font-black text-[#1C3B5E] uppercase mb-2">KRTI</h2>
            <p className="text-[#1C3B5E]/60 mb-8 max-w-3xl">
              Kontes Robot Terbang Indonesia organized by the Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia.
            </p>
            <AchievementGrid achievements={krti} />
          </div>

          {/* Ground Robotics */}
          <div className="mb-20">
            <h2 className="text-2xl font-black text-[#1C3B5E] uppercase mb-2">Ground Robotics</h2>
            <p className="text-[#1C3B5E]/60 mb-8 max-w-3xl">
              Developing land-based robots designed to complete specific tasks such as navigation, object transportation, and robotic system coordination.
            </p>
            <AchievementGrid achievements={ground} />
          </div>

          {/* Others */}
          {others.length > 0 && (
            <div className="mb-20">
              <h2 className="text-2xl font-black text-[#1C3B5E] uppercase mb-8">Other Competitions</h2>
              <AchievementGrid achievements={others} />
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

function AchievementGrid({ achievements }: { achievements: any[] }) {
  if (achievements.length === 0) {
    return (
      <div className="p-8 text-center bg-[#F3F5F8] rounded-xl">
        <p className="text-[#1C3B5E]/50">No achievements added yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="bg-[#F3F5F8] rounded-xl overflow-hidden">
          {achievement.image_url && (
            <div className="aspect-video relative bg-gray-200 overflow-hidden">
              <Image
                src={achievement.image_url}
                alt={achievement.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="tag-chip">{achievement.year}</span>
              <span className="text-xs font-semibold text-[#1C3B5E]/50 uppercase tracking-wider">{achievement.category}</span>
            </div>
            <h3 className="text-lg font-bold text-[#1C3B5E] mt-2">{achievement.title}</h3>
            {achievement.description && (
              <p className="text-sm text-[#1C3B5E]/70 mt-2">{achievement.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
