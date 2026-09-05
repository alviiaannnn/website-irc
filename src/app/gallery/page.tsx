import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

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

  const allImages = galleries?.flatMap(g => g.gallery_images) || []

  return (
    <div className="bg-white">

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#F04F2F] rounded-full translate-x-1/2 translate-y-1/2 opacity-70" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="page-title mb-4">Gallery</h1>
          <p className="text-center text-[#1C3B5E]/70 text-lg max-w-3xl mx-auto mb-16">
            Moments, activities, and the manufacturing process at IRC.
          </p>

          {/* Masonry-like Grid */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {allImages.length > 0 ? allImages.map((img: any) => (
              <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-[#F3F5F8]">
                <img
                  src={img.image_url}
                  alt={img.caption || "Gallery Image"}
                  className="w-full h-auto object-cover rounded-xl"
                  loading="lazy"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1C3B5E]/90 to-transparent p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-full py-24 text-center">
                <p className="text-[#1C3B5E]/50 text-lg">No images added to the gallery yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
