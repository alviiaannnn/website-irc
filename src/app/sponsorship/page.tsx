import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Check } from "lucide-react"

export const metadata = {
  title: "Sponsorship | IPB Robotic Club",
  description: "Support IPB Robotic Club by becoming a sponsor.",
}

export default async function SponsorshipPage() {
  const supabase = await createClient()

  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("order_index")

  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  return (
    <div className="bg-white">

      {/* Header */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F04F2F] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute top-10 right-0 w-20 h-20 bg-[#1C3B5E] rounded-full translate-x-1/2 opacity-60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="page-title mb-4">Sponsorship</h1>
          <p className="text-center text-[#1C3B5E]/70 text-lg max-w-3xl mx-auto mb-16">
            Partner with us to advance technological innovation and empower the next generation of roboticists.
          </p>

          {/* Sponsorship Packages Table */}
          <div className="mb-20 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left font-bold text-[#1C3B5E] border-b-2 border-gray-200 bg-[#F3F5F8]">Benefit</th>
                  <th className="p-4 text-center border-b-2 border-blue-500 bg-blue-50">
                    <div className="font-bold text-blue-700">Platinum</div>
                    <div className="text-xs font-normal text-[#1C3B5E]/50">Rp 15-20M</div>
                  </th>
                  <th className="p-4 text-center border-b-2 border-yellow-500 bg-yellow-50">
                    <div className="font-bold text-yellow-700">Gold</div>
                    <div className="text-xs font-normal text-[#1C3B5E]/50">Rp 11-15M</div>
                  </th>
                  <th className="p-4 text-center border-b-2 border-gray-400 bg-gray-100">
                    <div className="font-bold text-gray-700">Silver</div>
                    <div className="text-xs font-normal text-[#1C3B5E]/50">Rp 6-10M</div>
                  </th>
                  <th className="p-4 text-center border-b-2 border-orange-500 bg-orange-50">
                    <div className="font-bold text-orange-700">Bronze</div>
                    <div className="text-xs font-normal text-[#1C3B5E]/50">Rp 2-5M</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-[#F3F5F8]/50">
                  <td className="p-4 font-semibold text-[#1C3B5E]">Logo placement on UAV, banners, T-shirts and partnership media</td>
                  <td className="p-4 text-center font-bold text-[#1C3B5E]">XL</td>
                  <td className="p-4 text-center font-bold text-[#1C3B5E]">XL</td>
                  <td className="p-4 text-center font-bold text-[#1C3B5E]">L</td>
                  <td className="p-4 text-center font-bold text-[#1C3B5E]">M</td>
                </tr>
                <tr className="hover:bg-[#F3F5F8]/50">
                  <td className="p-4 font-semibold text-[#1C3B5E]">Sponsor name in news media publications</td>
                  <td className="p-4 text-center"><span className="bg-[#F3F5F8] px-3 py-1 rounded-full text-sm font-medium text-[#1C3B5E]">3 Media</span></td>
                  <td className="p-4 text-center"><span className="bg-[#F3F5F8] px-3 py-1 rounded-full text-sm font-medium text-[#1C3B5E]">2 Media</span></td>
                  <td className="p-4 text-center"><span className="bg-[#F3F5F8] px-3 py-1 rounded-full text-sm font-medium text-[#1C3B5E]">1 Media</span></td>
                  <td className="p-4 text-center text-gray-300">-</td>
                </tr>
                <tr className="hover:bg-[#F3F5F8]/50">
                  <td className="p-4 font-semibold text-[#1C3B5E]">Dedicated appreciation video</td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center text-gray-300">-</td>
                  <td className="p-4 text-center text-gray-300">-</td>
                </tr>
                <tr className="hover:bg-[#F3F5F8]/50">
                  <td className="p-4 font-semibold text-[#1C3B5E]">Priority talent recruitment access</td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center text-gray-300">-</td>
                </tr>
                <tr className="hover:bg-[#F3F5F8]/50">
                  <td className="p-4 font-semibold text-[#1C3B5E]">Competition & technical report document</td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Budgeting Plan */}
          <div className="mb-20">
            <div className="bg-[#1C3B5E] rounded-3xl p-8 md:p-12 text-white shadow-xl">
              <h2 className="text-3xl font-black mb-8 text-center uppercase">Budgeting Plan (KRTI 2026)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <ul className="space-y-6">
                    <li className="flex justify-between items-start border-b border-white/20 pb-4">
                      <div>
                        <h4 className="font-bold text-lg">Hardware VTOL</h4>
                        <p className="text-sm text-gray-400">Filament, Carbon tube, ESC, HAILO-8, micro SD</p>
                      </div>
                      <span className="font-mono font-medium">IDR 12.000.000</span>
                    </li>
                    <li className="flex justify-between items-start border-b border-white/20 pb-4">
                      <div>
                        <h4 className="font-bold text-lg">Hardware RP</h4>
                        <p className="text-sm text-gray-400">Styrofoam, pixhawk, servo, esc & balsa</p>
                      </div>
                      <span className="font-mono font-medium">IDR 14.000.000</span>
                    </li>
                    <li className="flex justify-between items-start pb-4">
                      <div>
                        <h4 className="font-bold text-lg">Accommodation & Transport</h4>
                        <p className="text-sm text-gray-400">Flight Ticket, Hotel & Transport</p>
                      </div>
                      <span className="font-mono font-medium">IDR 29.000.000</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
                  <h3 className="text-xl text-gray-400 mb-2 uppercase tracking-widest">Grand Total</h3>
                  <div className="text-4xl md:text-5xl font-black text-[#F04F2F] mb-2">IDR 55.000.000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-20">
            <h2 className="text-2xl font-black text-[#1C3B5E] uppercase text-center mb-8">Terms & Condition</h2>
            <div className="content-card max-w-4xl mx-auto">
              <ul className="space-y-4 text-[#1C3B5E]/80 list-disc list-outside ml-4">
                <li>All inputs and agreements proposed by the team will be implemented only after the <strong>signing</strong> of the official contract or <strong>Memorandum of Understanding (MoU)</strong>.</li>
                <li>Sponsors expressing interest are required to <strong>agree</strong> to and <strong>sign</strong> the official <strong>sponsorship agreement</strong> provided by the team.</li>
                <li>An initial payment (down payment) of <strong>no less than 50%</strong> of the total <strong>sponsorship value</strong> must be made within a maximum of <strong>seven (7) days</strong> following the signing of the agreement.</li>
                <li>Cash sponsorships shall be transferred to:
                  <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 font-semibold rounded-lg text-sm border border-yellow-200">
                    {settings?.sponsor_bank_account || "Bank BNI a/n Rektor IPB qc Kegiatan Kemahasiswaan IPB 138580960"}
                  </div>
                </li>
                <li>In addition to financial contributions, Agrisena also welcomes <strong>collaboration</strong> in the form of <strong>goods or services</strong>.</li>
                <li>Should there be any form of collaboration not explicitly stated within the available sponsorship packages, such cooperation may be accommodated through mutual negotiation.</li>
                <li>Organizations or individuals who have received a proposal but are unable to participate are respectfully requested to send a formal letter of declination.</li>
              </ul>
            </div>
          </div>

          {/* Previous Sponsors */}
          {sponsors && sponsors.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-[#1C3B5E] uppercase text-center mb-12">Previous Sponsors & Partners</h2>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="relative w-32 h-20 md:w-48 md:h-24">
                    {sponsor.logo_url && (
                      <Image
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    )}
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
