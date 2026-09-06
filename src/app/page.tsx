import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Zap, Users, Trophy, Plane, Cpu, Bot, Rocket, GraduationCap, FlaskConical, Target } from "lucide-react"

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

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 grid-bg" />
        {/* Gradient orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#F04F2F]/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#1C3B5E]/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#F04F2F]/3 to-[#1C3B5E]/3 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#F04F2F] animate-pulse" />
              <span className="text-xs font-semibold text-[#64748B]">Advanced Research Laboratory • IPB University</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95]">
              <span className="text-[#1C3B5E]">Satu Jiwa,</span>
              <br />
              <span className="gradient-text-red">Kita Bisa!</span>
            </h1>

            <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed">
              {settings?.hero_subtitle || "Empowered by Innovation"} — Building the future of autonomous systems through robotics research, engineering, and national competition excellence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/about" className="group inline-flex items-center gap-2 bg-[#1C3B5E] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#2A5580] transition-all shadow-lg shadow-[#1C3B5E]/20 hover:shadow-xl hover:shadow-[#1C3B5E]/30">
                Discover Our Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 bg-white text-[#1C3B5E] px-7 py-3.5 rounded-xl font-bold text-sm border-2 border-gray-200 hover:border-[#F04F2F] hover:text-[#F04F2F] transition-all">
                View Projects
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-14 mt-16 pt-10 border-t border-gray-100">
              {[
                { value: "50+", label: "Active Members", icon: Users },
                { value: "15+", label: "Awards Won", icon: Trophy },
                { value: "5+", label: "Robot Platforms", icon: Bot },
                { value: "34K+", label: "Social Followers", icon: Zap },
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <stat.icon className="w-5 h-5 text-[#F04F2F] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl md:text-3xl font-black text-[#1C3B5E]">{stat.value}</div>
                  <div className="text-xs font-medium text-[#64748B] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT OVERVIEW ═══════ */}
      <section className="py-24 bg-[#F8FAFC] dot-bg relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <span className="section-badge mb-6">
                <Rocket className="w-3.5 h-3.5" /> About IRC
              </span>
              <h2 className="section-title mb-6">Empowering the Next Generation of <span className="gradient-text-red">Roboticists</span></h2>
              <p className="section-subtitle mb-8">
                IPB Robotic Club (IRC) is a functional organization under the mentoring of Directorate of Student Affairs (Ditmawa) IPB University. We gather students from various academic backgrounds to collaborate and innovate in robotics.
              </p>

              {/* Feature list */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Plane, title: "Aerial Robotics", desc: "UAV, VTOL, and Racing Plane development" },
                  { icon: Bot, title: "Ground Robotics", desc: "Autonomous ground vehicles and transporter robots" },
                  { icon: FlaskConical, title: "R&D Focus", desc: "Precision farming, aerial monitoring, and smart agriculture" },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-4 group">
                    <div className="feature-icon-box bg-[#F04F2F]/10 group-hover:bg-[#F04F2F]/20 transition-colors">
                      <f.icon className="w-5 h-5 text-[#F04F2F]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1C3B5E]">{f.title}</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/about" className="animated-link text-sm">
                Learn more about our structure <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Image grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl img-placeholder overflow-hidden shadow-md hover-card">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                    <Cpu className="w-8 h-8 text-[#94A3B8]" />
                    <span className="text-xs text-center">Agrisena Aerial Team</span>
                  </div>
                </div>
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#F04F2F] to-[#FF6B4A] p-6 flex flex-col justify-end shadow-xl shadow-[#F04F2F]/15 hover-card">
                  <h3 className="text-3xl font-black text-white mb-1">50+</h3>
                  <p className="text-white/90 text-sm">Active Members across Technical & Official Departments</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#1C3B5E] to-[#2A5580] p-6 flex flex-col justify-end shadow-xl shadow-[#1C3B5E]/15 hover-card">
                  <h3 className="text-3xl font-black text-white mb-1">15+</h3>
                  <p className="text-white/90 text-sm">National & International Awards Won</p>
                </div>
                <div className="aspect-square rounded-2xl img-placeholder overflow-hidden shadow-md hover-card">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                    <Bot className="w-8 h-8 text-[#94A3B8]" />
                    <span className="text-xs text-center">Agrinaya Ground Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TEAMS PREVIEW ═══════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Users className="w-3.5 h-3.5" /> Our Teams
            </span>
            <h2 className="section-title mb-4">Two Research Teams,<br/><span className="gradient-text">One Vision</span></h2>
            <p className="section-subtitle mx-auto">
              IRC operates through two specialized technical teams, each focused on different domains of robotics excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Agrisena */}
            <div className="group bg-white rounded-2xl border border-gray-100 p-8 hover-card shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#F04F2F]/10 flex items-center justify-center group-hover:bg-[#F04F2F]/20 transition-colors">
                  <Plane className="w-7 h-7 text-[#F04F2F]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1C3B5E]">Agrisena</h3>
                  <p className="text-xs text-[#64748B]">Aerial Robotics Division</p>
                </div>
              </div>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                Develops UAVs including Racing Planes and VTOL aircraft for competitions like KRTI and SAFMC. Focus areas include autonomous flight, GNC systems, and aerial harvesting technology.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="chip chip-primary">Racing Plane</span>
                <span className="chip chip-primary">VTOL</span>
                <span className="chip chip-primary">Sengon-X</span>
              </div>
              {/* Image placeholders */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-xl img-placeholder text-[10px]">
                    <Plane className="w-5 h-5 text-[#CBD5E1]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Agrinaya */}
            <div className="group bg-white rounded-2xl border border-gray-100 p-8 hover-card shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1C3B5E]/10 flex items-center justify-center group-hover:bg-[#1C3B5E]/20 transition-colors">
                  <Bot className="w-7 h-7 text-[#1C3B5E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1C3B5E]">Agrinaya</h3>
                  <p className="text-xs text-[#64748B]">Ground Robotics Division</p>
                </div>
              </div>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                Develops ground-based robotic systems including transporter robots. Focus on embedded systems, mechanical design, and autonomous navigation for real-world applications.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="chip chip-secondary">Transporter</span>
                <span className="chip chip-secondary">Ground Robot</span>
                <span className="chip chip-secondary">ARGO-X</span>
              </div>
              {/* Image placeholders */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-xl img-placeholder text-[10px]">
                    <Bot className="w-5 h-5 text-[#CBD5E1]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/teams" className="animated-link text-sm">
              Meet all committee members <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ PROJECTS ═══════ */}
      <section className="py-24 bg-[#F8FAFC] grid-bg relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="section-badge mb-4">
                <Cpu className="w-3.5 h-3.5" /> Projects
              </span>
              <h2 className="section-title">Latest <span className="gradient-text-red">Projects</span></h2>
              <p className="section-subtitle mt-4">
                Showcasing IRC&apos;s innovative developments in robotics, autonomous systems, and aerospace technologies.
              </p>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-[#1C3B5E] hover:border-[#1C3B5E] hover:bg-[#1C3B5E] hover:text-white transition-all whitespace-nowrap">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects && projects.length > 0 ? projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-card">
                {/* Image carousel placeholder */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    {project.project_images && project.project_images[0] ? (
                      <Image
                        src={project.project_images[0].image_url}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#94A3B8]">
                        <Cpu className="w-10 h-10" />
                        <span className="text-xs">Project Image</span>
                      </div>
                    )}
                  </div>
                  {/* Image dots indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1C3B5E] mb-1 group-hover:text-[#F04F2F] transition-colors">{project.title}</h3>
                  {project.subtitle && (
                    <p className="text-xs font-medium text-[#F04F2F] mb-3">{project.subtitle}</p>
                  )}
                  <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">{project.description}</p>
                </div>
              </div>
            )) : (
              /* Default projects from PDF when DB is empty */
              [
                { title: "SENGON-X", subtitle: "Autonomous Aerial Harvesting Platform", desc: "An aerial harvesting drone developed in collaboration with the Faculty of Forestry. Equipped with a custom cutting mechanism for harvesting Sengon pods at heights up to 40 meters." },
                { title: "VARSHATA", subtitle: "High-Performance Fixed-Wing Aircraft", desc: "A high-speed fixed-wing aircraft designed for racing and advanced flight maneuvers. Serves as a development platform for aerodynamic optimization and flight control." },
                { title: "ARGO-X", subtitle: "Hybrid Air-Ground Payload Delivery Drone", desc: "An innovative drone capable of both aerial flight and ground maneuvering for precise payload retrieval and delivery with magnetic attachment mechanism." },
              ].map((p) => (
                <div key={p.title} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-card">
                  <div className="aspect-video img-placeholder">
                    <div className="flex flex-col items-center gap-2">
                      <Cpu className="w-10 h-10 text-[#CBD5E1]" />
                      <span className="text-xs">Add image via Admin</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#1C3B5E] mb-1 group-hover:text-[#F04F2F] transition-colors">{p.title}</h3>
                    <p className="text-xs font-medium text-[#F04F2F] mb-3">{p.subtitle}</p>
                    <p className="text-sm text-[#64748B] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════ COMPETITIONS ═══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Trophy className="w-3.5 h-3.5" /> Competitions
            </span>
            <h2 className="section-title">Competition <span className="gradient-text">Track Record</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "KRTI",
                full: "Kontes Robot Terbang Indonesia",
                desc: "Annual national UAV competition organized by the Ministry of Education, representing Indonesia's premier aerial robotics challenge.",
                color: "F04F2F",
                icon: Plane,
              },
              {
                name: "SAFMC",
                full: "Singapore Amazing Flying Machine Competition",
                desc: "International competition organized by DSO National Laboratories and Science Centre Singapore, exploring the science of flight.",
                color: "1C3B5E",
                icon: Rocket,
              },
              {
                name: "FIRA",
                full: "FIRA Indonesia",
                desc: "Ground robotics competition featuring autonomous navigation, object transportation, and robotic system coordination challenges.",
                color: "F04F2F",
                icon: Bot,
              },
            ].map((comp) => (
              <div key={comp.name} className="text-center group">
                <div className={`w-20 h-20 mx-auto rounded-3xl bg-[#${comp.color}]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <comp.icon className={`w-9 h-9 text-[#${comp.color}]`} />
                </div>
                <h3 className="text-xl font-bold text-[#1C3B5E] mb-1">{comp.name}</h3>
                <p className="text-xs font-medium text-[#F04F2F] mb-4">{comp.full}</p>
                <p className="text-sm text-[#64748B] leading-relaxed">{comp.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/activities" className="animated-link text-sm">
              See all achievements <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 bg-gradient-to-r from-[#1C3B5E] to-[#2A5580] relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F04F2F]/10 rounded-full translate-x-1/3 -translate-y-1/2 blur-2xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Support Innovation?</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Partner with IRC to advance technological innovation and empower the next generation of engineers and roboticists.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sponsorship" className="inline-flex items-center gap-2 bg-[#F04F2F] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#d4432a] transition-colors shadow-lg shadow-[#F04F2F]/30">
              Become a Sponsor
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
