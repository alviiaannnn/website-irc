import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'IPB Robotic Club', template: '%s · IPB Robotic Club' },
  description:
    'IPB Robotic Club (IRC) develops UAV and ground robots at IPB University and represents IPB at SAFMC, KRTI, and other national and international robotics competitions.',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'IPB Robotic Club' },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  )
}
