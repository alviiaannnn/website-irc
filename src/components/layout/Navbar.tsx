"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown } from "lucide-react"

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
  const [scrolled, setScrolled] = React.useState(false)

  if (pathname.startsWith("/admin")) return null

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled
        ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/80"
        : "bg-white/70 backdrop-blur-md border-b border-gray-100/50"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F04F2F] to-[#FF6B4A] flex items-center justify-center shadow-md shadow-[#F04F2F]/20 group-hover:shadow-lg group-hover:shadow-[#F04F2F]/30 transition-shadow">
            <span className="text-white font-black text-sm tracking-wider">IRC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-[#1C3B5E] leading-none tracking-tight">IPB Robotic</span>
            <span className="text-xs font-semibold text-[#64748B] leading-none mt-1">Club</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                  isActive
                    ? "text-[#F04F2F] bg-[#F04F2F]/5"
                    : "text-[#64748B] hover:text-[#1C3B5E] hover:bg-gray-100/80"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#F04F2F] rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold bg-[#1C3B5E] text-white rounded-xl hover:bg-[#2A5580] transition-colors shadow-sm"
          >
            Admin Panel
          </Link>
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-[#1C3B5E]" /> : <Menu className="h-6 w-6 text-[#1C3B5E]" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={cn(
        "lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100",
        isMobileMenuOpen ? "max-h-96 py-4" : "max-h-0"
      )}>
        <nav className="container mx-auto px-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                pathname === link.href
                  ? "text-[#F04F2F] bg-[#F04F2F]/5"
                  : "text-[#64748B] hover:text-[#1C3B5E] hover:bg-gray-50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="mt-2 px-4 py-2.5 text-sm font-bold bg-[#1C3B5E] text-white rounded-lg text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin Panel
          </Link>
        </nav>
      </div>
    </header>
  )
}
