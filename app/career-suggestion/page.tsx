"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CareerPath {
  title: string
  description: string
  timeframe: string
  requiredSkills: string[]
  salaryRange: string
  growthPotential: number
}

interface SkillGap {
  skill: string
  importance: "Tinggi" | "Sedang" | "Rendah"
  learningResources: string[]
}

interface CareerSuggestionResult {
  currentLevel: string
  careerPaths: CareerPath[]
  skillGaps: SkillGap[]
  industryTrends: string[]
  nextSteps: string[]
  certifications: string[]
}

export default function CareerSuggestionPage() {
  const [cvContent, setCvContent] = useState("")
  const [currentRole, setCurrentRole] = useState("")
  const [targetIndustry, setTargetIndustry] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [result, setResult] = useState<CareerSuggestionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const generateSuggestions = async () => {
    if (!cvContent.trim()) {
      setError("Silakan isi konten CV")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/career-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvContent,
          currentRole,
          targetIndustry,
          experienceLevel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menghasilkan saran karir")
      }

      const suggestions = await response.json()
      setResult(suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Tinggi":
        return "bg-rose-100 text-rose-700"
      case "Sedang":
        return "bg-amber-100 text-amber-700"
      case "Rendah":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-yellow-400" : "text-slate-300"}`}>
        ★
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 font-inter">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk mb-4">
            Saran Karir
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Dapatkan panduan karir yang dipersonalisasi. Temukan jalur karir terbaik dan langkah konkret untuk mencapai
            tujuan Anda.
          </p>
        </div>

        {!result && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 font-space-grotesk">Profil Karir Anda</CardTitle>
              <CardDescription>Isi informasi untuk mendapatkan saran karir yang tepat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cvContent">Konten CV / Resume</Label>
                <Textarea
                  id="cvContent"
                  placeholder="Paste konten CV lengkap Anda di sini..."
                  value={cvContent}
                  onChange={(e) => setCvContent(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Posisi Saat Ini</Label>
                  <Input
                    id="currentRole"
                    placeholder="e.g. Software Engineer"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetIndustry">Industri Target</Label>
                  <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih industri" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teknologi">Teknologi</SelectItem>
                      <SelectItem value="keuangan">Keuangan</SelectItem>
                      <SelectItem value="kesehatan">Kesehatan</SelectItem>
                      <SelectItem value="pendidikan">Pendidikan</SelectItem>
                      <SelectItem value="manufaktur">Manufaktur</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="konsultan">Konsultan</SelectItem>
                      <SelectItem value="media">Media & Komunikasi</SelectItem>
                      <SelectItem value="pemerintahan">Pemerintahan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Level Pengalaman</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresh-graduate">Fresh Graduate</SelectItem>
                      <SelectItem value="junior">Junior (1-3 tahun)</SelectItem>
                      <SelectItem value="mid-level">Mid-Level (3-7 tahun)</SelectItem>
                      <SelectItem value="senior">Senior (7-12 tahun)</SelectItem>
                      <SelectItem value="lead">Lead/Manager (12+ tahun)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <p className="text-sm text-rose-600 font-medium">{error}</p>
                </div>
              )}

              <Button
                onClick={generateSuggestions}
                disabled={isAnalyzing || !cvContent.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Menganalisis...
                  </>
                ) : (
                  "Dapatkan Saran"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 font-space-grotesk">
                  <Target className="h-6 w-6 text-purple-600" />
                  Level Karir Saat Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-slate-700">{result.currentLevel}</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-cyan-50">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Jalur Karir yang Direkomendasikan</CardTitle>
                <CardDescription>Pilihan karir berdasarkan profil dan pengalaman Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.careerPaths.map((path, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50 border">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-800 font-space-grotesk">{path.title}</h3>
                      <div className="flex items-center gap-1">{renderStars(path.growthPotential)}</div>
                    </div>
                    <p className="text-slate-600 mb-3">{path.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">Timeframe:</span>
                        <p className="text-slate-600">{path.timeframe}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Salary Range:</span>
                        <p className="text-slate-600">{path.salaryRange}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="font-semibold text-slate-700 text-sm">Required Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {path.requiredSkills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} className="bg-purple-100 text-purple-700 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 font-space-grotesk">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                  Analisis Skill Gap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.skillGaps.map((gap, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-800">{gap.skill}</h4>
                      <Badge className={getImportanceColor(gap.importance)}>{gap.importance}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center pt-6">
              <Button
                onClick={() => {
                  setResult(null)
                  setCvContent("")
                  setCurrentRole("")
                  setTargetIndustry("")
                  setExperienceLevel("")
                }}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-6 py-2"
              >
                Analisis Baru
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Unduh Panduan Karir
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
