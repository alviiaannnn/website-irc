import * as React from "react"
import Link from "next/link"
import { Mail, MapPin } from "lucide-react"

const footerLinks = {
  explore: [
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/activities", label: "Activities" },
    { href: "/teams", label: "Teams" },
  ],
  connect: [
    { href: "/sponsorship", label: "Sponsorship" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact Us" },
    { href: "/admin", label: "Admin Panel" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#1C3B5E] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F04F2F]/5 rounded-full translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F04F2F] to-[#FF6B4A] flex items-center justify-center">
                <span className="text-white font-black text-sm">IRC</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">IPB Robotic Club</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-6">
              A functional organization under IPB University fostering student excellence in robotics, technology, and innovation through national and international competitions.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> ipbrobotic@apps.ipb.ac.id</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Bogor, Indonesia</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Connect</h4>
            <ul className="space-y-3">
              {footerLinks.connect.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} IPB Robotic Club. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>@ircipb</span>
            <span>@irc.ipb</span>
            <span className="bg-[#F04F2F] text-white px-3 py-1 rounded-md text-[10px] italic font-bold tracking-wide">Empowered by Innovation</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
