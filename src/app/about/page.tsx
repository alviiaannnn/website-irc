import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "About Us | IPB Robotic Club",
  description: "Learn more about IPB Robotic Club, its departments, and research teams.",
}

export default async function AboutPage() {
  const supabase = await createClient()

  // We can fetch static-like settings
  const { data: settingsData } = await supabase.from("site_settings").select("*")
  const settings = settingsData?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) as Record<string, string>

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            About Us
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {settings?.about_description || 
              "IPB Robotic Club (IRC) is a functional organization under the mentoring of Directorate of Student Affairs (Ditmawa) IPB University through the Subdirectorate Development of Student Reputation and Achievement, also known as IPB Prestasi. IRC is a place for student competencies development in robotics, technology, and innovation fields, as well as strategic steps in supporting robotics research at IPB University."
            }
          </p>
        </div>

        {/* Departments Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Official Department</h2>
            <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
              Fully responsible for arranging both managerial and operational of non-technical fields in IPB Robotic Club to support sustainability of research team and competition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Human Resource and Development (HRD)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Supervising comprehensive human resources management</p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <span className="font-semibold text-slate-900 block mb-2">Program:</span>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Open Recruitment</li>
                    <li>Upgrading</li>
                    <li>Makrab</li>
                    <li>IRC Prestasi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Media and Branding (MnB)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Supervising organization's communication strategic and visual identity</p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <span className="font-semibold text-slate-900 block mb-2">Program:</span>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Content Plan</li>
                    <li>Grand launching</li>
                    <li>COPM</li>
                    <li>General Photo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Fundraising (FUND)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Guarantee organization financial stability</p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <span className="font-semibold text-slate-900 block mb-2">Program:</span>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Merchandise IRC</li>
                    <li>Sponsorship</li>
                    <li>3D printing service</li>
                    <li>IRC Workshop</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Department Section */}
        <div className="mb-20 bg-slate-50 -mx-4 px-4 py-16 md:-mx-6 md:px-6 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Technical Department</h2>
            <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
              The main pillar of IPB Robotic Club that responsible for every engineering process, starting from planning, manufacture, until system integration vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-secondary">Mechanical</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm">
                  Responsible for UAV/robot planning design and rafting frame, that consist of structural analysis, aerodynamics, as well as mechanical components.
                </p>
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <span className="font-semibold text-primary block mb-2">Skills:</span>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    <li>Computer-Aided Design (CAD)</li>
                    <li>Manufacture knowledge</li>
                    <li>Material handling</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-secondary">Electrical</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm">
                  Handling all the wiring system, electrical distribution, Printed Circuit Board design, as well as sensory and actuator integration.
                </p>
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <span className="font-semibold text-primary block mb-2">Skills:</span>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    <li>Electrical system manufacture (EasyEDA)</li>
                    <li>Wiring Management</li>
                    <li>Electric and battery system management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-secondary">Software</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm">
                  Developing main software for flight control, navigation, architecture on Linux-powered computers, and embedded programming on microcontrollers.
                </p>
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <span className="font-semibold text-primary block mb-2">Skills:</span>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    <li>Programming Languages (Python, C++, Arduino)</li>
                    <li>ROS 2 Development & Integration</li>
                    <li>Computer Vision & Object Detection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Research Team Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Research Team</h2>
            <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
              IPB Robotic Club has two specific cope of research that focused on technology development and robotics national competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="overflow-hidden border-2 border-primary/20">
              <CardHeader className="bg-primary/5 pb-8">
                <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                  AGRISENA 
                  <span className="text-base font-normal text-slate-500">(UAV Research Team)</span>
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  "Fly higher than you ever dreamed"
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-6">
                  <strong>Agrisena</strong> is a combination of word 'Agri' (Agriculture) and 'Sena' (Soldier). This philosophy imaging teams strong commitment in advancing <strong>Unmanned Aerial Vehicle (UAV)</strong> technology for supporting agriculture development. Symbolyzed by red-orange hawk, our identity presentated our courage, strong ambition, as well as high dream that being our movement greatest spirit.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">AGRISENA AERIAL</h4>
                    <p className="text-sm text-slate-600">Focusing on the development of VTOL (Vertical Take-Off and Landing) drones, with an orientation toward achieving flight precision and autonomous capabilities.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">AGRISENA RACING PLANE</h4>
                    <p className="text-sm text-slate-600">Dedicated to the design and construction of fixed-wing racing aircraft, engineered to push the limits of speed and performance in order to complete fast, on-track flight missions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-secondary/20">
              <CardHeader className="bg-secondary/5 pb-8">
                <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                  AGRINAYA 
                  <span className="text-base font-normal text-slate-500">(UGV Research Team)</span>
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  "Precision on the Ground, Vision for the Future"
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-6">
                  <strong>Agrinaya</strong> is derived from <strong>"Agri"</strong>, signifying the earth as a symbol of a strong foundation, and <strong>"Naya"</strong> meaning direction or principle. Together, Agrinaya reflects a journey rooted in solid ground and moving with measured direction, align with teams <strong>Unmanned Ground Vehicle (UGV)</strong> spirit in developing a precision autonomous ground vehicle.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">TRANSPORTER</h4>
                    <p className="text-sm text-slate-600">Focusing on the development of agile and adaptive Ground Robots (remote-controlled ground robots) for payload transportation missions. This team integrates mechanical design and reliable control systems to meet the technical specifications of the competition.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
