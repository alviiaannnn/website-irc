import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Projects | IPB Robotic Club",
  description: "Explore the latest innovative developments in robotics by IRC.",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  // Fetch projects with their images
  const { data: projects } = await supabase
    .from("projects")
    .select("*, project_images(image_url)")
    .eq("is_active", true)
    .order("order_index")

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Latest Projects
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Showcasing IRC's innovative developments in robotics, autonomous systems, and aerospace technologies.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-16">
          {projects && projects.length > 0 ? projects.map((project, index) => {
            const isEven = index % 2 === 0
            
            return (
              <div 
                key={project.id} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                {/* Images Gallery per Project (showing first image prominently) */}
                <div className="w-full lg:w-1/2">
                  <div className="aspect-4/3 relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
                    {project.project_images && project.project_images.length > 0 ? (
                      <Image
                        src={project.project_images[0].image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image Available
                      </div>
                    )}
                  </div>
                  {/* Miniature gallery if multiple images */}
                  {project.project_images && project.project_images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {project.project_images.slice(1, 5).map((img: any, idx: number) => (
                        <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                          <Image src={img.image_url} alt={`Detail ${idx}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{project.title}</h2>
                    {project.subtitle && (
                      <p className="text-lg font-medium text-primary mt-2">{project.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 text-lg leading-relaxed">{project.description}</p>
                  </div>

                  {project.features && Array.isArray(project.features) && project.features.length > 0 && (
                    <div className="pt-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Features</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start text-slate-700 text-sm">
                            <span className="text-primary mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-lg">No projects added yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
