import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ChevronRight } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()

  // Fetch site settings
  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  // Fetch featured projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*, project_images(image_url)")
    .eq("is_active", true)
    .order("order_index")
    .limit(3)

  // Fetch latest achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("year", { ascending: false })
    .order("order_index")
    .limit(3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Advanced Research Laboratory
          </div>
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            {settings?.hero_title || "Satu Jiwa, Kita Bisa!"}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-300 md:text-2xl">
            {settings?.hero_subtitle || "Empowered by Innovation"}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/about" className="inline-flex items-center justify-center rounded-md bg-primary text-white h-12 px-8 text-base font-semibold hover:bg-primary/90 transition-colors">
              Discover Our Story
            </Link>
            <Link href="/projects" className="inline-flex items-center justify-center rounded-md border border-white bg-transparent text-white h-12 px-8 text-base font-semibold hover:bg-white hover:text-slate-900 transition-colors">
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* About Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">About IPB Robotic Club</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {settings?.about_description || "IPB Robotic Club (IRC) is a functional organization under the mentoring of Directorate of Student Affairs (Ditmawa) IPB University. IRC is a place for student competencies development in robotics, technology, and innovation fields, as well as strategic steps in supporting robotics research at IPB University."}
              </p>
              <Link href="/about" className="group inline-flex items-center text-lg font-medium text-primary hover:text-primary/80 transition-colors">
                Learn more about our departments
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="h-48 rounded-2xl bg-slate-100 p-6 flex flex-col justify-end relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                  <div className="relative z-20">
                    <h3 className="text-xl font-bold text-white mb-1">Agrisena</h3>
                    <p className="text-slate-200 text-sm">UAV Research Team</p>
                  </div>
                </div>
                <div className="h-64 rounded-2xl bg-primary p-6 flex flex-col justify-end text-white shadow-xl shadow-primary/20">
                  <h3 className="text-3xl font-bold mb-2">50+</h3>
                  <p className="text-white/90">Active Members in Technical & Official Departments</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="h-64 rounded-2xl bg-secondary p-6 flex flex-col justify-end text-white shadow-xl shadow-secondary/20">
                  <h3 className="text-3xl font-bold mb-2">15+</h3>
                  <p className="text-white/90">National & International Awards</p>
                </div>
                <div className="h-48 rounded-2xl bg-slate-100 p-6 flex flex-col justify-end relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                  <div className="relative z-20">
                    <h3 className="text-xl font-bold text-white mb-1">Agrinaya</h3>
                    <p className="text-slate-200 text-sm">UGV Research Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Projects */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Latest Projects</h2>
              <p className="text-slate-500 mt-2 text-lg">Showcasing IRC's innovative developments in robotics.</p>
            </div>
            <Link href="/projects" className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors">
              View All Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <Card key={project.id} className="overflow-hidden border-0 shadow-lg group">
                  <div className="aspect-video relative bg-slate-200 overflow-hidden">
                    {project.project_images && project.project_images[0] ? (
                      <Image
                        src={project.project_images[0].image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <CardDescription className="text-primary font-medium">{project.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 line-clamp-3">{project.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-500">
                <p>No projects to display.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
