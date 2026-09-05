import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#1C3B5E] text-white py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-[#F04F2F]">IRC</span> IPB
            </h3>
            <p className="text-sm text-gray-300">
              Satu Jiwa, Kita Bisa! Empowered by Innovation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-[#F04F2F] transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-[#F04F2F] transition-colors">Projects</Link></li>
              <li><Link href="/sponsorship" className="hover:text-[#F04F2F] transition-colors">Sponsorship</Link></li>
              <li><Link href="/contact" className="hover:text-[#F04F2F] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Robotics Lab, Advanced Research Laboratory</li>
              <li>Jl. Palem, IPB Dramaga Campus</li>
              <li>Bogor 16680, Indonesia</li>
              <li className="pt-2"><a href="mailto:ipbrobotic@apps.ipb.ac.id" className="hover:text-[#F04F2F] transition-colors">ipbrobotic@apps.ipb.ac.id</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar matching PDF footer style */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>@ircipb</span>
            <span>@irc.ipb</span>
            <span>ipbrobotic@apps.ipb.ac.id</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#F04F2F] text-white px-3 py-1 rounded text-xs italic font-semibold">Empowered by Innovation</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} IPB Robotic Club. All rights reserved.</p>
          <Link href="/admin" className="hover:text-white transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  )
}
