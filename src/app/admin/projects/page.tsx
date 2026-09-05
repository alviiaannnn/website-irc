"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { Trash2, Edit, Plus, Image as ImageIcon, X } from "lucide-react"

export default function ProjectsAdminPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const fetchProjects = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .order("order_index")
    
    if (error) {
      toast.error("Failed to load projects")
    } else {
      setProjects(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const resetForm = () => {
    setTitle("")
    setSubtitle("")
    setDescription("")
    setFeatures("")
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleEdit = (project: any) => {
    setTitle(project.title)
    setSubtitle(project.subtitle || "")
    setDescription(project.description || "")
    setFeatures(project.features ? project.features.join(", ") : "")
    setEditingId(project.id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This will also delete its images from the database.")) return
    
    // Deleting from DB. In a real app, you should also delete files from Storage.
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Project deleted")
      fetchProjects()
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const featuresArray = features.split(",").map(f => f.trim()).filter(f => f !== "")
    
    const payload = {
      title,
      subtitle,
      description,
      features: featuresArray,
    }

    try {
      if (editingId) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editingId)
        if (error) throw error
        toast.success("Project updated")
      } else {
        const { error } = await supabase.from("projects").insert([payload])
        if (error) throw error
        toast.success("Project created")
      }
      resetForm()
      fetchProjects()
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // A simple mockup for image upload logic (since true multi-file with bucket requires bucket creation)
  const handleImageUploadMock = (e: React.MouseEvent) => {
    e.preventDefault()
    toast("In a full implementation, this opens a file picker and uploads to Supabase Storage bucket 'images'.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-slate-500">Manage your robotics and engineering projects.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="border-primary shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
              <CardDescription>Fill in the details for the project.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle</label>
                  <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Autonomous Aerial Platform" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Features (comma separated)</label>
                <Input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Modular design, Fast, Carbon fiber" />
              </div>
              
              {editingId && (
                <div className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="text-sm font-medium flex items-center"><ImageIcon className="mr-2 h-4 w-4"/> Images</label>
                  <p className="text-xs text-slate-500 mb-2">Upload multiple images for this project. The first image will be used as the cover.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleImageUploadMock} type="button">Upload Image</Button>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Project"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading projects...</div>
      ) : projects.length === 0 && !isFormOpen ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
          <p className="text-slate-500 mb-4">Get started by creating a new project.</p>
          <Button onClick={() => setIsFormOpen(true)}>Add Project</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {!isFormOpen && projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-32 bg-slate-100 border-r border-slate-200 flex items-center justify-center text-slate-400">
                  {project.project_images && project.project_images.length > 0 ? (
                    <img src={project.project_images[0].image_url} className="w-full h-full object-cover" alt="Cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 opacity-50" />
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-primary">{project.subtitle}</p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{project.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
