"use client"

import * as React from "react"
import { useState } from "react"
import { MapPin, Mail, Camera, Globe, Link2, Phone, Send, ArrowRight, MessageSquare } from "lucide-react"

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

      {/* ═══════ CLOSING STATEMENT ═══════ */}
      <section className="py-24 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-[#F04F2F]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-badge mb-6">
              <MessageSquare className="w-3.5 h-3.5" /> Closing Statement
            </span>
            <h1 className="section-title mb-8">Get in <span className="gradient-text-red">Touch</span></h1>
            <div className="bg-[#F8FAFC] rounded-2xl p-8 md:p-10 border border-gray-100 text-left">
              <p className="text-[#1C3B5E] leading-relaxed text-justify">
                Building upon our experience in <strong>national UAV competitions</strong> and our continuous commitment to <strong>technological innovation</strong>, IRC IPB is determined to <strong>achieve outstanding results</strong> at KRTI 2026 while advancing the development of <strong>autonomous aerial systems</strong>. Through our research and engineering efforts, we aim not only to excel in competition but also to <strong>contribute meaningful solutions</strong> for Indonesia&apos;s agricultural sector, particularly in precision farming, aerial monitoring, and smart agricultural automation. To achieve this goal, we seek your invaluable support in making this <strong>vision a reality</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT GRID ═══════ */}
      <section className="py-20 bg-[#F8FAFC] dot-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">

            {/* Contact Info - 2 cols */}
            <div className="lg:col-span-2 space-y-8">
              {/* GM Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xs font-bold text-[#F04F2F] uppercase tracking-widest mb-4">General Manager</h3>
                <h4 className="text-xl font-black text-[#1C3B5E] mb-1">Alvian Raihan Ramadan</h4>
                <p className="text-sm text-[#64748B] mb-4">089677878475</p>
                <p className="text-sm text-[#64748B]">alvianraihan@apps.ipb.ac.id</p>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F04F2F]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#F04F2F]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C3B5E]">Robotics Lab</h4>
                    <p className="text-xs text-[#64748B] mt-1">Advanced Research Laboratory<br/>Jl. Palem, IPB Dramaga Campus<br/>Bogor 16680, Indonesia</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                {[
                  { icon: Link2, label: "LINKEDIN", value: "IPB Robotic Club", color: "1C3B5E" },
                  { icon: Camera, label: "INSTAGRAM", value: "@irc.ipb", color: "F04F2F" },
                  { icon: Mail, label: "EMAIL", value: "ipbrobotic@apps.ipb.ac.id", color: "1C3B5E" },
                  { icon: Globe, label: "WEBSITE", value: "website-irc.vercel.app", color: "F04F2F" },
                ].map((social) => (
                  <div key={social.label} className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl bg-[#${social.color}]/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <social.icon className={`w-5 h-5 text-[#${social.color}]`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#64748B] tracking-widest">{social.label}</p>
                      <p className="text-sm font-medium text-[#1C3B5E]">{social.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form - 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#1C3B5E]/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-[#1C3B5E]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1C3B5E]">Send a Message</h2>
                    <p className="text-xs text-[#64748B]">We&apos;ll get back to you shortly.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="subject" value="New Contact Message from IRC Website" />
                  <input type="checkbox" name="botcheck" className="hidden" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-[#1C3B5E] mb-2">Full Name</label>
                      <input
                        id="name" name="name" required
                        placeholder="John Doe"
                        disabled={status === "loading"}
                        className="w-full h-12 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 text-sm text-[#1C3B5E] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F04F2F]/30 focus:border-[#F04F2F] transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-[#1C3B5E] mb-2">Email Address</label>
                      <input
                        id="email" name="email" type="email" required
                        placeholder="john@example.com"
                        disabled={status === "loading"}
                        className="w-full h-12 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 text-sm text-[#1C3B5E] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F04F2F]/30 focus:border-[#F04F2F] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject_field" className="block text-xs font-bold text-[#1C3B5E] mb-2">Subject</label>
                    <input
                      id="subject_field" name="subject_field"
                      placeholder="How can we help?"
                      disabled={status === "loading"}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 text-sm text-[#1C3B5E] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F04F2F]/30 focus:border-[#F04F2F] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-[#1C3B5E] mb-2">Message</label>
                    <textarea
                      id="message" name="message" required
                      placeholder="Tell us about your inquiry..."
                      disabled={status === "loading"}
                      className="w-full min-h-[160px] rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#1C3B5E] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F04F2F]/30 focus:border-[#F04F2F] transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-[#F04F2F] text-white font-bold rounded-xl hover:bg-[#d4432a] transition-all shadow-md shadow-[#F04F2F]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>

                  {status === "success" && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm text-center font-medium border border-green-200">
                      ✓ Message sent successfully! We&apos;ll get back to you soon.
                    </div>
                  )}
                  {status === "error" && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm text-center font-medium border border-red-200">
                      ✕ Something went wrong. Please try again later.
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
