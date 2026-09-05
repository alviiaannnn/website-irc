import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()

  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  const { data: projects } = await supabase
    .from("projects")
    .select("*, project_images(image_url)")
    .eq("is_active", true)
    .order("order_index")
    .limit(3)

  return (
    <div className="bg-white">

      {/* Hero Section - matching PDF cover page style */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#1C3B5E]">
        {/* Decorative blobs like PDF */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute bottom-20 left-8 w-24 h-24 bg-[#F04F2F] rounded-full opacity-80" />
        <div className="absolute top-1/4 right-0 w-32 h-32 bg-[#1C3B5E] border-4 border-white/20 rounded-full translate-x-1/2 opacity-60" />

        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#F04F2F] mr-2"></span>
            Advanced Research Laboratory
          </div>
          <h1 className="mb-6 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl uppercase">
            {settings?.hero_title || "Satu Jiwa, Kita Bisa!"}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300 md:text-2xl font-medium">
            {settings?.hero_subtitle || "Empowered by Innovation"}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/about" className="inline-flex items-center justify-center rounded-lg bg-[#F04F2F] text-white h-12 px-8 text-base font-bold hover:bg-[#d4432a] transition-colors shadow-lg shadow-[#F04F2F]/30">
              Discover Our Story
            </Link>
            <Link href="/projects" className="inline-flex items-center justify-center rounded-lg border-2 border-white text-white h-12 px-8 text-base font-bold hover:bg-white hover:text-[#1C3B5E] transition-colors">
              View Projects
            </Link>
          </div>
        </div>

        {/* Bottom bar like PDF */}
        <div className="absolute bottom-0 inset-x-0 bg-[#1C3B5E]/80 backdrop-blur-sm border-t border-white/10 py-3 px-6 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>@ircipb</span>
            <span>@irc.ipb</span>
            <span>ipbrobotic@apps.ipb.ac.id</span>
          </div>
          <span className="bg-[#F04F2F] text-white px-3 py-1 rounded text-xs italic font-semibold">Empowered by Innovation</span>
        </div>
      </section>

      {/* About Overview - matching PDF About Us page */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#F04F2F] rounded-full -translate-x-1/2 translate-y-1/2 opacity-80" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="page-title mb-10">About Us</h2>

          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-lg text-[#1C3B5E] leading-relaxed">
              {settings?.about_description || "IPB Robotic Club (IRC) is a functional organization under the mentoring of Directorate of Student Affairs (Ditmawa) IPB University through the Subdirectorate Development of Student Reputation and Achievement, also known as IPB Prestasi. IRC is a place for student competencies development in robotics, technology, and innovation fields, as well as strategic steps in supporting robotics research at IPB University."}
            </p>
          </div>

          {/* Tags like in PDF */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="tag-chip-outline">Team Collaboration</span>
            <span className="tag-chip-outline">Technological Advancement</span>
            <span className="tag-chip-outline">Resilience and Adaptability</span>
          </div>

          <div className="text-center">
            <Link href="/about" className="group inline-flex items-center text-lg font-semibold text-[#F04F2F] hover:text-[#d4432a] transition-colors">
              Learn more about our departments
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#F3F5F8]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-4xl font-black text-[#F04F2F] mb-2">50+</h3>
              <p className="text-[#1C3B5E] font-medium">Active Members</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-4xl font-black text-[#F04F2F] mb-2">15+</h3>
              <p className="text-[#1C3B5E] font-medium">National & International Awards</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-4xl font-black text-[#F04F2F] mb-2">34K+</h3>
              <p className="text-[#1C3B5E] font-medium">Total Social Media Followers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Projects - matching PDF project page style */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#1C3B5E] rounded-full translate-x-1/2 -translate-y-1/2 opacity-60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
            <div>
              <h2 className="page-title text-left">Latest Projects</h2>
              <p className="text-[#1C3B5E]/70 mt-2 text-lg">Showcasing IRC&apos;s innovative developments in robotics, autonomous systems, and aerospace technologies.</p>
            </div>
            <Link href="/projects" className="inline-flex items-center justify-center rounded-lg border-2 border-[#1C3B5E] text-[#1C3B5E] px-6 py-2.5 text-sm font-bold hover:bg-[#1C3B5E] hover:text-white transition-colors whitespace-nowrap">
              View All Projects
            </Link>
          </div>

          <div className="space-y-12">
            {projects && projects.length > 0 ? (
              projects.map((project, index) => {
                const isEven = index % 2 === 0
                return (
                  <div key={project.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                    {/* Image */}
                    <div className="w-full lg:w-1/2">
                      <div className="aspect-4/3 relative rounded-2xl overflow-hidden bg-[#F3F5F8] shadow-lg">
                        {project.project_images && project.project_images[0] ? (
                          <Image
                            src={project.project_images[0].image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#1C3B5E]/30 text-lg">No Image</div>
                        )}
                      </div>
                    </div>
                    {/* Details */}
                    <div className="w-full lg:w-1/2">
                      <div className="content-card">
                        <h3 className="text-2xl font-black text-[#1C3B5E] uppercase mb-2">{project.title}</h3>
                        {project.subtitle && (
                          <p className="text-[#1C3B5E]/70 font-medium mb-4">{project.subtitle}</p>
                        )}
                        <p className="text-[#1C3B5E]/80 leading-relaxed">{project.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 text-[#1C3B5E]/50">
                <p>No projects to display yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
