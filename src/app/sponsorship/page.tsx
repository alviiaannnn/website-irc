import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export const metadata = {
  title: "Sponsorship | IPB Robotic Club",
  description: "Support IPB Robotic Club by becoming a sponsor.",
}

export default async function SponsorshipPage() {
  const supabase = await createClient()

  // Fetch sponsors
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("order_index")

  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Sponsorship
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Partner with us to advance technological innovation and empower the next generation of roboticists.
          </p>
        </div>

        {/* Why IRC Section */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="pt-6">
              <h3 className="text-3xl font-bold text-primary mb-2">34K+</h3>
              <p className="text-slate-600 font-medium">Total Followers IG (@irc.ipb + @ipbprestasi)</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-green-50">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-green-700 mb-2 uppercase tracking-wide">Rooted in Agriculture</h3>
              <p className="text-slate-600 font-medium">Inspired by IPB University's commitment to agricultural innovation</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-secondary/5">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-secondary mb-2">IPB</h3>
              <p className="text-slate-600 font-medium">TOP Agriculture University ASEAN</p>
            </CardContent>
          </Card>
        </div>

        {/* Sponsorship Packages */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Sponsorship Packages</h2>
          
          <div className="overflow-x-auto pb-8">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-left font-bold text-slate-900 border-b-2 border-slate-200">Benefit</th>
                  <th className="p-4 text-center border-b-2 border-blue-500 bg-blue-50">
                    <div className="font-bold text-blue-700">Platinum</div>
                    <div className="text-xs font-normal text-slate-500">Rp 15-20M</div>
                  </th>
                  <th className="p-4 text-center border-b-2 border-yellow-500 bg-yellow-50">
                    <div className="font-bold text-yellow-700">Gold</div>
                    <div className="text-xs font-normal text-slate-500">Rp 11-15M</div>
                  </th>
                  <th className="p-4 text-center border-b-2 border-slate-400 bg-slate-100">
                    <div className="font-bold text-slate-700">Silver</div>
                    <div className="text-xs font-normal text-slate-500">Rp 6-10M</div>
                  </th>
                  <th className="p-4 text-center border-b-2 border-orange-500 bg-orange-50">
                    <div className="font-bold text-orange-700">Bronze</div>
                    <div className="text-xs font-normal text-slate-500">Rp 2-5M</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">Logo placement on UAV, banners, T-shirts and partnership media</div>
                  </td>
                  <td className="p-4 text-center font-bold">XL</td>
                  <td className="p-4 text-center font-bold">XL</td>
                  <td className="p-4 text-center font-bold">L</td>
                  <td className="p-4 text-center font-bold">M</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">Sponsor name in news media publications</div>
                  </td>
                  <td className="p-4 text-center"><span className="bg-slate-200 px-3 py-1 rounded-full text-sm font-medium">3 Media</span></td>
                  <td className="p-4 text-center"><span className="bg-slate-200 px-3 py-1 rounded-full text-sm font-medium">2 Media</span></td>
                  <td className="p-4 text-center"><span className="bg-slate-200 px-3 py-1 rounded-full text-sm font-medium">1 Media</span></td>
                  <td className="p-4 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">Dedicated appreciation video</div>
                  </td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center text-slate-300">-</td>
                  <td className="p-4 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">Priority talent recruitment access</div>
                  </td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">Competition & technical report document</div>
                  </td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                  <td className="p-4 text-center"><Check className="mx-auto text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h4 className="font-bold text-green-800">In-Kind / Custom Packages</h4>
              <p className="text-sm text-green-700">Components, sensors, hardware, software licenses, and services are accepted as equivalent sponsorship value at all tiers.</p>
            </div>
          </div>
        </div>

        {/* Budgeting Plan */}
        <div className="mb-24">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Budgeting Plan (KRTI 2026)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <ul className="space-y-6">
                  <li className="flex justify-between items-start border-b border-slate-700 pb-4">
                    <div>
                      <h4 className="font-bold text-lg">Hardware VTOL</h4>
                      <p className="text-sm text-slate-400">Filament, Carbon tube, ESC, HAILO-8, micro SD</p>
                    </div>
                    <span className="font-mono font-medium">IDR 12.000.000</span>
                  </li>
                  <li className="flex justify-between items-start border-b border-slate-700 pb-4">
                    <div>
                      <h4 className="font-bold text-lg">Hardware RP</h4>
                      <p className="text-sm text-slate-400">Styrofoam, pixhawk, servo, esc & balsa</p>
                    </div>
                    <span className="font-mono font-medium">IDR 14.000.000</span>
                  </li>
                  <li className="flex justify-between items-start pb-4">
                    <div>
                      <h4 className="font-bold text-lg">Accommodation & Transport</h4>
                      <p className="text-sm text-slate-400">Flight Ticket, Hotel & Transport</p>
                    </div>
                    <span className="font-mono font-medium">IDR 29.000.000</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                <h3 className="text-xl text-slate-400 mb-2 uppercase tracking-widest">Grand Total</h3>
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-6">IDR 55.000.000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Condition */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Terms & Condition</h2>
          <Card className="border-0 shadow-md bg-slate-50">
            <CardContent className="p-8 md:p-12">
              <ul className="space-y-4 text-slate-700 list-disc list-outside ml-4">
                <li>All inputs and agreements proposed by the team will be implemented only after the <strong>signing</strong> of the official contract or <strong>Memorandum of Understanding (MoU)</strong>.</li>
                <li>Sponsors expressing interest are required to <strong>agree</strong> to and <strong>sign</strong> the official <strong>sponsorship agreement</strong> provided by the team.</li>
                <li>An initial payment (down payment) of <strong>no less than 50%</strong> of the total <strong>sponsorship value</strong> must be made within a maximum of <strong>seven (7) days</strong> following the signing of the agreement. The remaining balance shall be <strong>paid in full</strong> by a date mutually agreed upon by both parties.</li>
                <li>Cash sponsorships shall be transferred to the following official IPB University account:
                  <div className="mt-4 mb-2 p-4 bg-yellow-100 text-yellow-800 font-semibold rounded-md inline-block">
                    {settings?.sponsor_bank_account || "Bank BNI a/n Rektor IPB qc Kegiatan Kemahasiswaan IPB 138580960"}
                  </div>
                </li>
                <li>In addition to financial contributions, Agrisena also welcomes <strong>collaboration</strong> in the form of <strong>goods or services</strong> that support the team's needs and activities.</li>
                <li>Should there be any form of collaboration not explicitly stated within the available sponsorship packages, such cooperation may be accommodated through mutual negotiation.</li>
                <li>Organizations or individuals who have received a proposal but are unable to participate are respectfully requested to send a formal letter of declination.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Previous Sponsors */}
        {sponsors && sponsors.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Previous Sponsors & Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
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
    </div>
  )
}
