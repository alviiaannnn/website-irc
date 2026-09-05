import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">IPB Robotic Club</h3>
            <p className="text-sm">
              Satu Jiwa, Kita Bisa! Empowered by Innovation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/sponsorship" className="hover:text-primary transition-colors">Sponsorship</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li>Robotics Lab, Advanced Research Laboratory</li>
              <li>Jl. Palem, IPB Dramaga Campus</li>
              <li>Bogor 16680, Indonesia</li>
              <li className="pt-2"><a href="mailto:ipbrobotic@apps.ipb.ac.id" className="hover:text-primary transition-colors">ipbrobotic@apps.ipb.ac.id</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} IPB Robotic Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
