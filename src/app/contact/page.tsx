"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Mail, Instagram, Globe } from "lucide-react"

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    
    const formData = new FormData(e.currentTarget)
    // Add Web3Forms access key from environment variable
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "")
    
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
      
      const data = await res.json()
      
      if (data.success) {
        setStatus("success")
        ;(e.target as HTMLFormElement).reset()
      } else {
        setStatus("error")
      }
    } catch (err) {
      setStatus("error")
    }
  }

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Building upon our experience in national UAV competitions and our continuous commitment to technological innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Closing Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-6">
                  IRC IPB is determined to <strong>achieve outstanding results</strong> at KRTI 2026 while advancing the development of <strong>autonomous aerial systems</strong>. Through our research and engineering efforts, we aim not only to excel in competition but also to <strong>contribute meaningful solutions</strong> for Indonesia's agricultural sector, particularly in precision farming, aerial monitoring, and smart agricultural automation. To achieve this goal, we seek your invaluable support in making this <strong>vision a reality</strong>.
                </p>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                    {/* GM Image placeholder */}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Alvian Raihan Ramadan</h4>
                    <p className="text-primary text-sm font-medium">General Manager</p>
                    <p className="text-slate-500 text-sm">089677878475</p>
                    <p className="text-slate-500 text-sm">alvianraihan@apps.ipb.ac.id</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Location</h4>
                    <p className="text-slate-500 text-sm mt-1">Robotics Lab, Advanced Research Laboratory<br/>Jl. Palem, IPB Dramaga Campus<br/>Bogor 16680, Indonesia</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-secondary flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Email</h4>
                      <p className="text-slate-500 text-sm mt-1">ipbrobotic@apps.ipb.ac.id</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Instagram className="w-6 h-6 text-secondary flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Instagram</h4>
                      <p className="text-slate-500 text-sm mt-1">@irc.ipb</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-xl lg:sticky lg:top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-slate-900">Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="subject" value="New Contact Message from IPB Robotic Club Website" />
                <input type="checkbox" name="botcheck" className="hidden" />

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-900">Name</label>
                  <Input id="name" name="name" required placeholder="John Doe" disabled={status === "loading"} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-900">Email Address</label>
                  <Input id="email" name="email" type="email" required placeholder="john@example.com" disabled={status === "loading"} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-900">Message</label>
                  <Textarea id="message" name="message" required placeholder="Your message here..." className="min-h-[150px]" disabled={status === "loading"} />
                </div>
                
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>

                {status === "success" && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm text-center">
                    Message sent successfully! We will get back to you soon.
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm text-center">
                    Oops! Something went wrong. Please try again later.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
