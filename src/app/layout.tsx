import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "IPB Robotic Club",
  description: "IPB Robotic Club (IRC) is a place for student competencies development in robotics, technology, and innovation fields.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`${inter.variable} min-h-screen bg-white text-[#1C3B5E] font-sans antialiased flex flex-col`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
