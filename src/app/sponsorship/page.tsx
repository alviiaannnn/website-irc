import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Check, X, Handshake, ArrowRight, CreditCard, FileText, DollarSign } from "lucide-react"

export const metadata = {
  title: "Sponsorship | IPB Robotic Club",
  description: "Partner with IRC to advance technological innovation.",
}

export default async function SponsorshipPage() {
  const supabase = await createClient()

  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("order_index")

  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  const tiers = [
    { name: "Bronze", price: "Rp 2-5M", color: "orange", colorHex: "#D97706" },
    { name: "Silver", price: "Rp 6-10M", color: "gray", colorHex: "#6B7280" },
    { name: "Gold", price: "Rp 11-15M", color: "yellow", colorHex: "#CA8A04" },
    { name: "Platinum", price: "Rp 15-20M", color: "blue", colorHex: "#1C3B5E", featured: true },
  ]

  const benefits = [
    { name: "Logo on UAV, banners, T-shirts", platinum: "XL", gold: "XL", silver: "L", bronze: "M" },
    { name: "News media publications", platinum: "3 Media", gold: "2 Media", silver: "1 Media", bronze: null },
    { name: "Dedicated appreciation video", platinum: true, gold: true, silver: false, bronze: false },
    { name: "Priority talent recruitment", platinum: true, gold: true, silver: true, bronze: false },
    { name: "Competition & technical report", platinum: true, gold: true, silver: true, bronze: true },
  ]

  return (
    <div className="bg-white">

      {/* ═══════ HEADER ═══════ */}
      <section className="py-24 bg-white grid-bg relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-[#F04F2F]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">
              <Handshake className="w-3.5 h-3.5" /> Partnership
            </span>
            <h1 className="section-title mb-4">Sponsorship <span className="gradient-text-red">Packages</span></h1>
            <p className="section-subtitle mx-auto">
              Partner with us to advance technological innovation and empower the next generation of roboticists.
            </p>
          </div>

          {/* ═══════ TIER CARDS ═══════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
            {tiers.map((tier) => (
              <div key={tier.name} className={`relative rounded-2xl p-6 shadow-sm border hover-card ${tier.featured ? 'bg-[#1C3B5E] text-white border-[#1C3B5E] shadow-xl shadow-[#1C3B5E]/20' : 'bg-white border-gray-100'}`}>
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F04F2F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Recommended</span>
                )}
                <div className="text-center mb-6 pt-2">
                  <h3 className={`text-lg font-bold mb-1 ${tier.featured ? 'text-white' : 'text-[#1C3B5E]'}`}>{tier.name}</h3>
                  <p className={`text-2xl font-black ${tier.featured ? 'text-[#F04F2F]' : 'text-[#F04F2F]'}`}>{tier.price}</p>
                </div>
                <ul className="space-y-3">
                  {benefits.map((b) => {
                    const val = b[tier.name.toLowerCase() as keyof typeof b]
                    return (
                      <li key={b.name} className="flex items-start gap-2 text-xs">
                        {val ? (
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.featured ? 'text-green-400' : 'text-green-500'}`} />
                        ) : (
                          <X className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.featured ? 'text-gray-500' : 'text-gray-300'}`} />
                        )}
                        <span className={val ? '' : `${tier.featured ? 'text-gray-500' : 'text-gray-300'}`}>
                          {b.name}
                          {typeof val === 'string' && <span className="font-bold ml-1">({val})</span>}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <Link href="/contact" className={`mt-6 w-full h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  tier.featured
                    ? 'bg-[#F04F2F] text-white hover:bg-[#d4432a]'
                    : 'border-2 border-gray-200 text-[#1C3B5E] hover:border-[#1C3B5E] hover:bg-[#1C3B5E] hover:text-white'
                }`}>
                  Contact Us
                </Link>
              </div>
            ))}
          </div>

          {/* ═══════ BUDGETING ═══════ */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-[#1C3B5E] rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/2" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase">Budgeting Plan</h2>
                    <p className="text-xs text-gray-400">KRTI 2026</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4">
                    {[
                      { item: "Hardware VTOL", detail: "Filament, Carbon tube, ESC, HAILO-8, micro SD", amount: "IDR 12.000.000" },
                      { item: "Hardware RP", detail: "Styrofoam, pixhawk, servo, esc & balsa", amount: "IDR 14.000.000" },
                      { item: "Accommodation", detail: "Flight Ticket, Hotel & Transport", amount: "IDR 29.000.000" },
                    ].map((b) => (
                      <div key={b.item} className="flex justify-between items-start gap-4 pb-4 border-b border-white/10">
                        <div>
                          <h4 className="font-bold text-white text-sm">{b.item}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{b.detail}</p>
                        </div>
                        <span className="text-sm font-mono font-medium text-white whitespace-nowrap">{b.amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Grand Total</p>
                    <div className="text-4xl md:text-5xl font-black text-[#F04F2F] mb-2">IDR 55.000.000</div>
                    <p className="text-xs text-gray-400">Estimated budget for KRTI 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════ TERMS ═══════ */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1C3B5E]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#1C3B5E]" />
              </div>
              <h2 className="text-xl font-bold text-[#1C3B5E]">Terms & Conditions</h2>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100 space-y-4">
              {[
                "All inputs and agreements will be implemented only after the signing of the official contract or Memorandum of Understanding (MoU).",
                "Sponsors are required to agree to and sign the official sponsorship agreement.",
                "An initial payment of no less than 50% of the total sponsorship value must be made within 7 days following the signing.",
                `Cash sponsorships shall be transferred to: ${settings?.sponsor_bank_account || "Bank BNI a/n Rektor IPB qc Kegiatan Kemahasiswaan IPB 138580960"}`,
                "In addition to financial contributions, Agrisena also welcomes collaboration in the form of goods or services.",
                "Cooperation not stated within available packages may be accommodated through mutual negotiation.",
                "Organizations unable to participate are requested to send a formal letter of declination.",
              ].map((term, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#64748B]">
                  <span className="w-6 h-6 rounded-lg bg-[#F04F2F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#F04F2F] text-xs font-bold">{i + 1}</span>
                  </span>
                  <span>{term}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════ PREVIOUS SPONSORS ═══════ */}
          {sponsors && sponsors.length > 0 && (
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#1C3B5E] mb-10">Previous Sponsors & Partners</h2>
              <div className="flex flex-wrap justify-center items-center gap-10 opacity-50 hover:opacity-80 transition-opacity">
                {sponsors.map((s) => (
                  <div key={s.id} className="relative w-32 h-20 md:w-40 md:h-24">
                    {s.logo_url && <Image src={s.logo_url} alt={s.name} fill className="object-contain" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
