import { createClient } from "@/lib/supabase/server"
import { Camera } from "lucide-react"

export const metadata = {
  title: "Gallery | IPB Robotic Club",
  description: "Moments and activities captured at IPB Robotic Club.",
}

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: galleries } = await supabase
    .from("galleries")
    .select("*, gallery_images(id, image_url, caption)")
    .order("order_index")

  return (
    <div className="bg-white">

      <section className="py-24 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-[#F04F2F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-60 h-60 bg-[#1C3B5E]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Camera className="w-3.5 h-3.5" /> Media
            </span>
            <h1 className="section-title mb-4">Photo <span className="gradient-text-red">Gallery</span></h1>
            <p className="section-subtitle mx-auto">
              Moments, activities, and the manufacturing process at IRC.
            </p>
          </div>

          {/* Gallery Sections */}
          {galleries && galleries.length > 0 ? (
            <div className="space-y-16">
              {galleries.map((gallery: any) => (
                <div key={gallery.id}>
                  <h2 className="text-xl font-bold text-[#1C3B5E] mb-2">{gallery.title}</h2>
                  {gallery.description && (
                    <p className="text-sm text-[#64748B] mb-6">{gallery.description}</p>
                  )}
                  <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {gallery.gallery_images?.map((img: any) => (
                      <div key={img.id} className="break-inside-avoid group rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-card bg-white">
                        <img
                          src={img.image_url}
                          alt={img.caption || "Gallery Image"}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                        {img.caption && (
                          <div className="p-3">
                            <p className="text-xs text-[#64748B]">{img.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Empty state with placeholder grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl img-placeholder hover-card">
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-[#CBD5E1]" />
                      <span className="text-[10px]">Add via Admin</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-[#64748B] mt-8">No gallery images added yet. Add them from the Admin Panel.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
