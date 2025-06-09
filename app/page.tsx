import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk mb-6">
              Pindai CV Anda dengan Kecerdasan AI
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Dapatkan umpan balik profesional instan untuk CV Anda. Pemindai AI canggih kami menganalisis CV sesuai
              standar industri dan memberikan wawasan yang dapat ditindaklanjuti untuk membantu Anda mendapatkan
              pekerjaan impian.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/ai-features">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="mr-2 h-5 w-5" />
                Pindai CV Saya
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-8 py-4 text-lg"
              >
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 font-space-grotesk mb-4">Fitur Unggulan Scandidate</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Platform pemindaian bertenaga AI yang memberikan analisis komprehensif dan wawasan yang dapat
              ditindaklanjuti untuk memaksimalkan dampak CV Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Pemindaian Cerdas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 font-medium">
                  Algoritma AI canggih memindai CV Anda sesuai standar industri dan praktik terbaik untuk
                  mengidentifikasi area yang perlu diperbaiki.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-cyan-50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Pencocokan Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 font-medium">
                  Cocokkan CV Anda dengan deskripsi pekerjaan untuk melihat tingkat kesesuaian dan area yang perlu
                  ditingkatkan.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-rose-50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Simulator ATS</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 font-medium">
                  Simulasikan bagaimana CV Anda akan diproses oleh sistem ATS untuk memastikan lolos tahap penyaringan
                  otomatis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Mode Privasi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 font-medium">
                  Lindungi data pribadi Anda dengan mode privasi yang memastikan informasi sensitif tetap aman dan
                  terlindungi.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white font-space-grotesk mb-4">Tim Pengembang</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-sm">
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="font-semibold text-purple-400">Athallah Pasha Ramadhan</p>
                <p className="text-slate-400">2702255874</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="font-semibold text-purple-400">Darren Winata</p>
                <p className="text-slate-400">2702256044</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="font-semibold text-purple-400">Felix Stevanus</p>
                <p className="text-slate-400">2702252090</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="font-semibold text-purple-400">Hugo Sachio Wijaya</p>
                <p className="text-slate-400">2702261151</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="font-semibold text-purple-400">Jeremy Emmanuel Putra</p>
                <p className="text-slate-400">2702250305</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
