"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"

export default function SettingsPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const keysToManage = [
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "about_description", label: "About Description", type: "textarea" },
    { key: "contact_address", label: "Contact Address", type: "textarea" },
    { key: "contact_email", label: "Contact Email", type: "email" },
    { key: "contact_instagram", label: "Instagram Handle", type: "text" },
    { key: "contact_tiktok", label: "TikTok Handle", type: "text" },
    { key: "contact_linkedin", label: "LinkedIn", type: "text" },
    { key: "sponsor_bank_account", label: "Sponsor Bank Account", type: "text" },
  ]

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from("site_settings").select("*")
      if (error) {
        toast.error("Failed to load settings")
      } else if (data) {
        const settingsMap = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
        setSettings(settingsMap)
      }
      setIsLoading(false)
    }
    fetchSettings()
  }, [])

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Upsert all settings one by one or in a batch
      const updates = keysToManage.map(({ key }) => ({
        key,
        value: settings[key] || "",
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase.from("site_settings").upsert(updates, { onConflict: "key" })
      
      if (error) throw error
      
      toast.success("Settings saved successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Site Settings</h1>
          <p className="text-slate-500">Manage global text content and configurations.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {keysToManage.map(({ key, label, type }) => (
              <div key={key} className="space-y-2">
                <label htmlFor={key} className="text-sm font-medium leading-none">{label}</label>
                {type === "textarea" ? (
                  <Textarea
                    id={key}
                    value={settings[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <Input
                    id={key}
                    type={type}
                    value={settings[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
