import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Trophy, Plane, Rocket, Bot, Calendar } from "lucide-react"

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

  const categories = [
    { key: "krti", label: "KRTI", full: "Kontes Robot Terbang Indonesia", desc: "Annual national UAV competition organized by the Ministry of Education, Culture, Research, and Technology.", icon: Plane, color: "F04F2F" },
    { key: "safmc", label: "SAFMC", full: "Singapore Amazing Flying Machine Competition", desc: "International competition organized by DSO National Laboratories and Science Centre Singapore.", icon: Rocket, color: "1C3B5E" },
    { key: "ground", label: "Ground Robotics", full: "FIRA & Other Ground Competitions", desc: "Developing land-based robots for navigation, object transportation, and robotic coordination.", icon: Bot, color: "F04F2F" },
  ]

  function getAchievementsByCategory(key: string) {
    if (!achievements || achievements.length === 0) return []
    return achievements.filter(a =>
      a.category?.toLowerCase().includes(key === "ground" ? "ground" : key) ||
      (key === "ground" && a.category?.toLowerCase().includes("transporter"))
    )
  }

  return (
    <div className="bg-white">

      {/* ═══════ HEADER ═══════ */}
      <section className="py-24 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-[#F04F2F]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="section-badge mb-4">
              <Trophy className="w-3.5 h-3.5" /> Achievements
            </span>
            <h1 className="section-title mb-4">Past Competition & <span className="gradient-text-red">Achievements</span></h1>
            <p className="section-subtitle mx-auto">
              Some of the competitions we have participated in so far. We continuously push boundaries in aerial and ground robotics.
            </p>
          </div>

          {/* ═══════ CATEGORY SECTIONS ═══════ */}
          <div className="space-y-24 max-w-6xl mx-auto">
            {categories.map((cat) => {
              const items = getAchievementsByCategory(cat.key)
              const Icon = cat.icon

              return (
                <div key={cat.key}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-[#${cat.color}]/10 flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 text-[#${cat.color}]`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-[#1C3B5E] uppercase">{cat.label}</h2>
                      <p className="text-xs text-[#64748B]">{cat.full}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B] mb-8 max-w-3xl">{cat.desc}</p>

                  {/* Achievement Cards */}
                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((a) => (
                        <div key={a.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-card">
                          {a.image_url ? (
                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                              <Image src={a.image_url} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          ) : (
                            <div className="aspect-video img-placeholder">
                              <div className="flex flex-col items-center gap-2">
                                <Trophy className="w-8 h-8 text-[#CBD5E1]" />
                                <span className="text-xs">Achievement Image</span>
                              </div>
                            </div>
                          )}
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="chip chip-primary text-[10px]">
                                <Calendar className="w-3 h-3 mr-1" /> {a.year}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-[#1C3B5E] group-hover:text-[#F04F2F] transition-colors">{a.title}</h3>
                            {a.description && (
                              <p className="text-xs text-[#64748B] mt-2 line-clamp-3">{a.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#F8FAFC] rounded-2xl p-10 text-center border border-gray-100">
                      <Icon className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
                      <p className="text-sm text-[#64748B]">No achievements added yet for this category.</p>
                      <p className="text-xs text-[#94A3B8] mt-1">Add them via the Admin Panel.</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </div>
  )
}
