"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { Trash2, Plus, Image as ImageIcon, X } from "lucide-react"

export default function GalleryAdminPage() {
  const supabase = createClient()
  const [images, setImages] = useState<any[]>([])
  const [galleries, setGalleries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Form state
  const [galleryId, setGalleryId] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    const [{ data: galleriesData }, { data: imagesData }] = await Promise.all([
      supabase.from("galleries").select("*").order("order_index"),
      supabase.from("gallery_images").select("*, galleries(title)").order("created_at", { ascending: false })
    ])
    
    setGalleries(galleriesData || [])
    setImages(imagesData || [])
    
    if (galleriesData && galleriesData.length > 0) {
      setGalleryId(galleriesData[0].id)
    } else {
      // Create a default gallery if none exists
      const { data } = await supabase.from("galleries").insert([{ title: "General Activities" }]).select()
      if (data && data.length > 0) {
        setGalleries(data)
        setGalleryId(data[0].id)
      }
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const resetForm = () => {
    setImageUrl("")
    setCaption("")
    setIsFormOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    
    const { error } = await supabase.from("gallery_images").delete().eq("id", id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Image deleted")
      fetchData()
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const payload = {
      gallery_id: galleryId,
      image_url: imageUrl,
      caption,
    }

    try {
      const { error } = await supabase.from("gallery_images").insert([payload])
      if (error) throw error
      toast.success("Image added to gallery")
      resetForm()
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gallery Images</h1>
          <p className="text-slate-500">Manage photos for the public gallery.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Image
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="border-primary shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <CardTitle>Add New Image</CardTitle>
              <CardDescription>Upload a new image to the gallery.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL * (or Upload via Storage)</label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required placeholder="https://..." />
                <p className="text-xs text-slate-500">For full implementation, this should be a file uploader that saves to Supabase Storage and gets the public URL.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Caption</label>
                <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Assembling the drone" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gallery Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={galleryId}
                  onChange={(e) => setGalleryId(e.target.value)}
                  required
                >
                  {galleries.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Add Image"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading gallery...</div>
      ) : images.length === 0 && !isFormOpen ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No images found</h3>
          <p className="text-slate-500 mb-4">Start building your gallery.</p>
          <Button onClick={() => setIsFormOpen(true)}>Add Image</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!isFormOpen && images.map((image) => (
            <div key={image.id} className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img src={image.image_url} alt={image.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <p className="text-white text-sm font-medium text-center mb-4 line-clamp-2">{image.caption}</p>
                <Button variant="danger" size="sm" onClick={() => handleDelete(image.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
