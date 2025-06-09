"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, XCircle, AlertTriangle, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ParsingResult {
  extracted: boolean
  issues: string[]
}

interface ATSSimulationResult {
  overallAtsScore: number
  parsingResults: {
    contactInfo: ParsingResult
    workExperience: ParsingResult
    education: ParsingResult
    skills: ParsingResult
  }
  keywordMatching: {
    score: number
    matchedKeywords: string[]
    missedKeywords: string[]
  }
  formatIssues: string[]
  recommendations: string[]
  atsCompatibilityTips: string[]
}

export default function ATSSimulatorPage() {
  const [cvContent, setCvContent] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<ATSSimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
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

  const simulateATS = async () => {
    if (!cvContent.trim()) {
      setError("Silakan isi konten CV")
      return
    }

    setIsSimulating(true)
    setError("")

    try {
      const response = await fetch("/api/ats-simulator", {
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
        throw new Error(errorData.error || "Gagal mensimulasikan ATS")
      }

      const simulation = await response.json()
      setResult(simulation)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui")
    } finally {
      setIsSimulating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-rose-600"
  }

  const getParsingIcon = (extracted: boolean) => {
    return extracted ? (
      <CheckCircle className="h-5 w-5 text-emerald-600" />
    ) : (
      <XCircle className="h-5 w-5 text-rose-600" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 font-inter">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk mb-4">
            Simulator ATS
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Simulasikan bagaimana sistem ATS akan memproses CV Anda. Dapatkan insight tentang kompatibilitas dan
            optimasi untuk lolos penyaringan otomatis.
          </p>
        </div>

        {!result && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">CV untuk Simulasi</CardTitle>
                <CardDescription>Upload atau paste konten CV yang akan disimulasikan</CardDescription>
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
                  rows={15}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Job Description (Opsional)</CardTitle>
                <CardDescription>Untuk simulasi yang lebih akurat dengan keyword matching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste deskripsi pekerjaan untuk analisis keyword yang lebih akurat..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={12}
                  className="resize-none"
                />

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <p className="text-sm text-rose-600 font-medium">{error}</p>
                  </div>
                )}

                <Button
                  onClick={simulateATS}
                  disabled={isSimulating || !cvContent.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSimulating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Mensimulasikan ATS...
                    </>
                  ) : (
                    "Simulasikan dengan ATS"
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
                  <Shield className="h-6 w-6 text-purple-600" />
                  Skor ATS Keseluruhan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <Progress value={result.overallAtsScore} className="h-6 bg-slate-200" />
                  </div>
                  <div className={`text-4xl font-bold ${getScoreColor(result.overallAtsScore)} font-space-grotesk`}>
                    {result.overallAtsScore}%
                  </div>
                </div>
                <p className="text-slate-600 mt-3 font-medium">
                  {result.overallAtsScore >= 80
                    ? "Excellent! CV Anda sangat kompatibel dengan sistem ATS."
                    : result.overallAtsScore >= 60
                      ? "Good! Beberapa optimasi dapat meningkatkan kompatibilitas ATS."
                      : "Perlu perbaikan signifikan untuk meningkatkan kompatibilitas ATS."}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-cyan-50">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Hasil Parsing ATS</CardTitle>
                <CardDescription>Bagaimana ATS memproses setiap bagian CV Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.parsingResults).map(([section, data]) => (
                  <div key={section} className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50 border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-800 capitalize">
                        {section.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      <div className="flex items-center gap-2">
                        {getParsingIcon(data.extracted)}
                        <span className={`font-semibold ${data.extracted ? "text-emerald-600" : "text-rose-600"}`}>
                          {data.extracted ? "Berhasil Diparsing" : "Gagal Diparsing"}
                        </span>
                      </div>
                    </div>
                    {data.issues.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-slate-700 mb-1">Issues:</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {data.issues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-700 font-space-grotesk">Analisis Keyword Matching</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-600">Keyword Match Score:</span>
                  <Progress value={result.keywordMatching.score} className="flex-1 h-3" />
                  <span className={`font-bold ${getScoreColor(result.keywordMatching.score)}`}>
                    {result.keywordMatching.score}%
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Keywords Ditemukan:</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.keywordMatching.matchedKeywords.map((keyword, index) => (
                        <Badge key={index} className="bg-emerald-100 text-emerald-700 text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Keywords yang Terlewat:</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.keywordMatching.missedKeywords.map((keyword, index) => (
                        <Badge key={index} className="bg-rose-100 text-rose-700 text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {result.formatIssues.length > 0 && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-rose-50">
                <CardHeader>
                  <CardTitle className="text-rose-700 font-space-grotesk">Masalah Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.formatIssues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Rekomendasi Optimasi ATS</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-cyan-50"
                    >
                      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-700 font-space-grotesk">Tips Kompatibilitas ATS</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.atsCompatibilityTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

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
                Simulasi Baru
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Unduh Laporan ATS
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
