import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Gallery | IPB Robotic Club",
  description: "Moments and activities captured at IPB Robotic Club.",
}

export default async function GalleryPage() {
  const supabase = await createClient()

  // Fetch galleries with their images
  const { data: galleries } = await supabase
    .from("galleries")
    .select("*, gallery_images(id, image_url, caption)")
    .order("order_index")

  // For simplicity, we just display all images in a masonary-like grid
  // In a more complex app, we might want tabs to filter by gallery category.
  const allImages = galleries?.flatMap(g => g.gallery_images) || []

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Gallery
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Moments, activities, and the manufacturing process at IRC.
          </p>
        </div>

        {/* Masonry-like Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {allImages.length > 0 ? allImages.map((img: any) => (
            <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-full h-auto">
                {/* We use standard img for dynamic aspect ratio or next/image with layout="responsive" 
                    Actually next/image in Next 14 handles aspect ratio differently. We can just use an aspect ratio placeholder or let it determine height.
                    For masonry, usually we need known dimensions or use an unoptimized img tag for fluid height if dimensions aren't stored. */}
                <img
                  src={img.image_url}
                  alt={img.caption || "Gallery Image"}
                  className="w-full h-auto object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              )}
            </div>
          )) : (
            <div className="col-span-full py-24 text-center">
              <p className="text-slate-500">No images added to the gallery yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
