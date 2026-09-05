import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Projects | IPB Robotic Club",
  description: "Explore the latest innovative developments in robotics by IRC.",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*, project_images(image_url)")
    .eq("is_active", true)
    .order("order_index")

  return (
    <div className="bg-white">

      {/* Header */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute top-10 right-0 w-20 h-20 bg-[#1C3B5E] rounded-full translate-x-1/2 opacity-60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="page-title mb-4">Latest Projects</h1>
          <p className="text-center text-[#1C3B5E]/70 text-lg max-w-3xl mx-auto mb-16">
            Showcasing IRC&apos;s innovative developments in robotics, autonomous systems, and aerospace technologies.
          </p>

          {/* Projects - alternating layout matching PDF */}
          <div className="space-y-16 max-w-5xl mx-auto">
            {projects && projects.length > 0 ? projects.map((project, index) => {
              const isEven = index % 2 === 0

              return (
                <div key={project.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="aspect-4/3 relative rounded-2xl overflow-hidden bg-[#F3F5F8] shadow-lg">
                      {project.project_images && project.project_images.length > 0 ? (
                        <Image
                          src={project.project_images[0].image_url}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#1C3B5E]/30 text-lg">
                          No Image Available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content card matching PDF */}
                  <div className="w-full lg:w-1/2">
                    <div className="content-card">
                      <h2 className="text-2xl font-black text-[#1C3B5E] uppercase mb-2">{project.title}</h2>
                      {project.subtitle && (
                        <p className="text-[#1C3B5E]/60 font-medium mb-4">{project.subtitle}</p>
                      )}
                      <p className="text-[#1C3B5E]/80 leading-relaxed text-justify">{project.description}</p>

                      {project.features && Array.isArray(project.features) && project.features.length > 0 && (
                        <div className="mt-6">
                          <ul className="space-y-2">
                            {project.features.map((feature: string, i: number) => (
                              <li key={i} className="flex items-start text-sm text-[#1C3B5E]/80">
                                <span className="text-[#F04F2F] mr-2 font-bold">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="text-center py-24 text-[#1C3B5E]/50">
                <p className="text-lg">No projects added yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
