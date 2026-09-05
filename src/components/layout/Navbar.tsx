"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/activities", label: "Activities" },
  { href: "/teams", label: "Teams" },
  { href: "/projects", label: "Projects" },
  { href: "/sponsorship", label: "Sponsorship" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#1C3B5E]">
            <span className="text-[#F04F2F]">IRC</span> IPB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#F04F2F]",
                pathname === link.href ? "text-[#F04F2F] font-semibold" : "text-[#1C3B5E]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5 text-[#1C3B5E]" /> : <Menu className="h-5 w-5 text-[#1C3B5E]" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#F04F2F]",
                  pathname === link.href ? "text-[#F04F2F] font-semibold" : "text-[#1C3B5E]"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
