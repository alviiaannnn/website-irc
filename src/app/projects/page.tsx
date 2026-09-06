import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Cpu, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Projects | IPB Robotic Club",
  description: "Explore IRC's innovative robotics projects and platforms.",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*, project_images(image_url, order_index)")
    .eq("is_active", true)
    .order("order_index")

  // Default projects from PDF
  const defaultProjects = [
    {
      id: "1", title: "SENGON-X", subtitle: "Autonomous Aerial Harvesting Platform",
      description: "SengonX is an aerial harvesting drone developed in collaboration with the Faculty of Forestry, IPB University. Equipped with a custom cutting mechanism, it enables safe and efficient harvesting of Sengon pods at heights of up to 40 meters, reducing operational risks and labor requirements.",
      features: ["Custom aerial cutting mechanism", "Faculty of Forestry collaboration", "Up to 40 meters harvesting height"],
      project_images: [],
    },
    {
      id: "2", title: "VARSHATA", subtitle: "High-Performance Fixed-Wing Aircraft",
      description: "VARSHATA is a high-speed fixed-wing aircraft designed for racing and advanced flight maneuvers. The platform serves as a development and testing vehicle for aerodynamic optimization, flight control, and autonomous aviation technologies.",
      features: ["High-speed racing design", "Advanced flight control", "Aerodynamic optimization platform"],
      project_images: [],
    },
    {
      id: "3", title: "ARGO-X", subtitle: "Hybrid Air-Ground Payload Delivery Drone",
      description: "ARGO-X is an innovative drone capable of both aerial flight and ground maneuvering for precise payload retrieval and delivery. Its integrated wheel system and magnetic attachment mechanism enable efficient payload handling in complex operational environments.",
      features: ["Hybrid air-ground capability", "Magnetic attachment mechanism", "Integrated wheel system"],
      project_images: [],
    },
  ]

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects

  return (
    <div className="bg-white">

      {/* ═══════ HEADER ═══════ */}
      <section className="py-24 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-[#F04F2F]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="section-badge mb-4">
              <Cpu className="w-3.5 h-3.5" /> Innovation
            </span>
            <h1 className="section-title mb-4">Latest <span className="gradient-text-red">Projects</span></h1>
            <p className="section-subtitle mx-auto">
              Showcasing IRC&apos;s innovative developments in robotics, autonomous systems, and aerospace technologies.
            </p>
          </div>

          {/* ═══════ PROJECTS ═══════ */}
          <div className="space-y-24 max-w-6xl mx-auto">
            {displayProjects.map((project: any, index: number) => {
              const isEven = index % 2 === 0
              const images = project.project_images || []

              return (
                <div key={project.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center`}>
                  {/* Images Section */}
                  <div className="w-full lg:w-1/2">
                    {/* Main image */}
                    <div className="aspect-4/3 relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-50 mb-4 hover-card">
                      {images.length > 0 ? (
                        <Image src={images[0].image_url} alt={project.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#94A3B8]">
                          <Cpu className="w-12 h-12" />
                          <span className="text-sm font-medium">Main Project Image</span>
                          <span className="text-xs">Add via Admin Panel</span>
                        </div>
                      )}
                    </div>
                    {/* Thumbnail row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-sm hover-card bg-gradient-to-br from-gray-100 to-gray-50">
                          {images[i + 1] ? (
                            <div className="relative w-full h-full">
                              <Image src={images[i + 1].image_url} alt={`${project.title} ${i + 2}`} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#CBD5E1]">
                              <Cpu className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <span className="chip chip-primary mb-4">
                      {index === 0 ? "Aerial Platform" : index === 1 ? "Fixed Wing" : "Hybrid System"}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#1C3B5E] uppercase tracking-tight mb-2">{project.title}</h2>
                    {project.subtitle && (
                      <p className="text-[#64748B] font-medium mb-6">{project.subtitle}</p>
                    )}
                    <p className="text-[#64748B] leading-relaxed mb-8">{project.description}</p>

                    {project.features && (
                      <div className="space-y-3">
                        {(Array.isArray(project.features) ? project.features : []).map((f: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className="w-6 h-6 rounded-lg bg-[#F04F2F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[#F04F2F] text-xs font-bold">{i + 1}</span>
                            </div>
                            <span className="text-[#1C3B5E]">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
