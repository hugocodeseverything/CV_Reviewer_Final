"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface JobMatchResult {
  overallMatch: number
  matchingSkills: string[]
  missingSkills: string[]
  experienceMatch: {
    score: number
    feedback: string
  }
  educationMatch: {
    score: number
    feedback: string
  }
  keywordAnalysis: {
    foundKeywords: string[]
    missingKeywords: string[]
    keywordDensity: number
  }
  recommendations: string[]
  improvementAreas: string[]
}

export default function JobMatchPage() {
  const [cvContent, setCvContent] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<JobMatchResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCvContent(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const analyzeMatch = async () => {
    if (!cvContent.trim() || !jobDescription.trim()) {
      setError("Silakan isi CV dan deskripsi pekerjaan")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvContent,
          jobDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menganalisis kesesuaian")
      }

      const matchResult = await response.json()
      setResult(matchResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-rose-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 font-inter">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk mb-4">
            Pencocokan Pekerjaan
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Analisis tingkat kesesuaian CV Anda dengan deskripsi pekerjaan. Dapatkan insight mendalam untuk meningkatkan
            peluang Anda.
          </p>
        </div>

        {!result && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">CV Anda</CardTitle>
                <CardDescription>Upload file CV atau paste konten CV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="cv-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                      <Upload className="h-4 w-4" />
                      Upload CV
                    </div>
                  </Label>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-slate-500">atau paste konten di bawah</span>
                </div>

                <Textarea
                  placeholder="Paste konten CV Anda di sini..."
                  value={cvContent}
                  onChange={(e) => setCvContent(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Deskripsi Pekerjaan</CardTitle>
                <CardDescription>Paste deskripsi pekerjaan yang ingin dilamar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste deskripsi pekerjaan lengkap di sini..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={15}
                  className="resize-none"
                />

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <p className="text-sm text-rose-600 font-medium">{error}</p>
                  </div>
                )}

                <Button
                  onClick={analyzeMatch}
                  disabled={isAnalyzing || !cvContent.trim() || !jobDescription.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Menganalisis...
                    </>
                  ) : (
                    "Analisis Kesesuaian"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 font-space-grotesk">
                  <Target className="h-6 w-6 text-purple-600" />
                  Skor Kesesuaian Keseluruhan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <Progress value={result.overallMatch} className="h-6 bg-slate-200" />
                  </div>
                  <div className={`text-4xl font-bold ${getScoreColor(result.overallMatch)} font-space-grotesk`}>
                    {result.overallMatch}%
                  </div>
                </div>
                <p className="text-slate-600 mt-3 font-medium">
                  {result.overallMatch >= 80
                    ? "Kesesuaian sangat tinggi! CV Anda sangat cocok dengan posisi ini."
                    : result.overallMatch >= 60
                      ? "Kesesuaian baik dengan beberapa area yang bisa ditingkatkan."
                      : "Perlu penyesuaian signifikan untuk meningkatkan kesesuaian."}
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-emerald-700 font-space-grotesk">Keterampilan yang Cocok</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.matchingSkills.map((skill, index) => (
                      <Badge key={index} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-rose-50">
                <CardHeader>
                  <CardTitle className="text-rose-700 font-space-grotesk">Keterampilan yang Kurang</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill, index) => (
                      <Badge key={index} className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 justify-center pt-6">
              <Button
                onClick={() => {
                  setResult(null)
                  setCvContent("")
                  setJobDescription("")
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
                Unduh Laporan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
