"use client"

import * as React from "react"
import { useState } from "react"
import { MapPin, Mail, Camera, Globe, Linkedin, Phone } from "lucide-react"

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")

    const formData = new FormData(e.currentTarget)
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
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="bg-white">

      {/* Closing Statement - matching PDF page 24 */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="page-title mb-10">Closing Statement</h1>

          <div className="max-w-3xl mx-auto">
            <div className="content-card mb-12">
              <p className="text-[#1C3B5E] leading-relaxed text-justify">
                Building upon our experience in <strong>national UAV competitions</strong> and our continuous commitment to <strong>technological innovation</strong>, IRC IPB is determined to <strong>achieve outstanding results</strong> at KRTI 2026 while advancing the development of <strong>autonomous aerial systems</strong>. Through our research and engineering efforts, we aim not only to excel in competition but also to <strong>contribute meaningful solutions</strong> for Indonesia&apos;s agricultural sector, particularly in precision farming, aerial monitoring, and smart agricultural automation. To achieve this goal, we seek your invaluable support in making this <strong>vision a reality</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info - matching PDF contact section */}
      <section className="py-16 bg-[#F3F5F8]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

            {/* GM Info + Contact Details */}
            <div className="space-y-8">
              {/* General Manager */}
              <div>
                <h2 className="text-xl font-black text-[#1C3B5E] italic mb-4">General Manager</h2>
                <div className="space-y-1">
                  <p className="text-[#1C3B5E] font-bold text-lg">Alvian Raihan Ramadan</p>
                  <p className="text-[#1C3B5E]/70 text-sm">089677878475</p>
                  <p className="text-[#1C3B5E]/70 text-sm">alvianraihan@apps.ipb.ac.id</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F04F2F] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#1C3B5E] font-semibold italic text-sm">Robotics Lab,</p>
                  <p className="text-[#1C3B5E]/70 text-sm">Advanced Research Laboratory</p>
                  <p className="text-[#1C3B5E]/70 text-sm">Jl. Palem, IPB Dramaga Campus</p>
                  <p className="text-[#1C3B5E]/70 text-sm">Bogor 16680, Indonesia</p>
                </div>
              </div>

              {/* Social Links - PDF style */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1C3B5E] flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1C3B5E] font-bold text-sm">LINKEDIN</p>
                    <p className="text-[#1C3B5E]/70 text-sm">IPB Robotic Club</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1C3B5E] flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1C3B5E] font-bold text-sm">INSTAGRAM</p>
                    <p className="text-[#1C3B5E]/70 text-sm">@irc.ipb</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1C3B5E] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1C3B5E] font-bold text-sm">EMAIL</p>
                    <p className="text-[#1C3B5E]/70 text-sm">ipbrobotic@apps.ipb.ac.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1C3B5E] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1C3B5E] font-bold text-sm">WEBSITE</p>
                    <p className="text-[#1C3B5E]/70 text-sm">website-irc.vercel.app</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#1C3B5E] mb-2">Send us a Message</h2>
              <p className="text-[#1C3B5E]/60 text-sm mb-6">Fill out the form below and we&apos;ll get back to you.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="subject" value="New Contact Message from IPB Robotic Club Website" />
                <input type="checkbox" name="botcheck" className="hidden" />

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-[#1C3B5E]">Name</label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    disabled={status === "loading"}
                    className="w-full h-11 rounded-lg border border-gray-200 bg-[#F3F5F8] px-4 text-sm text-[#1C3B5E] placeholder:text-[#1C3B5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F04F2F] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#1C3B5E]">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    disabled={status === "loading"}
                    className="w-full h-11 rounded-lg border border-gray-200 bg-[#F3F5F8] px-4 text-sm text-[#1C3B5E] placeholder:text-[#1C3B5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F04F2F] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-[#1C3B5E]">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Your message here..."
                    disabled={status === "loading"}
                    className="w-full min-h-[150px] rounded-lg border border-gray-200 bg-[#F3F5F8] px-4 py-3 text-sm text-[#1C3B5E] placeholder:text-[#1C3B5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F04F2F] transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#F04F2F] text-white font-bold rounded-lg hover:bg-[#d4432a] transition-colors shadow-md shadow-[#F04F2F]/20 disabled:opacity-50"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>

                {status === "success" && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium border border-green-200">
                    Message sent successfully! We will get back to you soon.
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm text-center font-medium border border-red-200">
                    Oops! Something went wrong. Please try again later.
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
