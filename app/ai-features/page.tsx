"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle, AlertCircle, XCircle, Zap, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface CVAnalysis {
  overallScore: number
  sections: {
    name: string
    score: number
    feedback: string
    suggestions: string[]
  }[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  atsCompatibility: number
  _isMockData?: boolean
  _fallbackReason?: string
}

export default function AIFeaturesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "text/plain" ||
        selectedFile.name.endsWith(".docx") ||
        selectedFile.name.endsWith(".doc")
      ) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Silakan unggah file PDF, DOC, DOCX, atau TXT")
      }
    }
  }

  const analyzeCV = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menganalisis CV")
      }

      const result = await response.json()
      setAnalysis(result)
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

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-emerald-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-amber-600" />
    return <XCircle className="h-5 w-5 text-rose-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 font-inter">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk mb-4">
            Pemindai CV AI
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Unggah CV Anda dan dapatkan analisis mendalam dengan teknologi AI terdepan. Analisis real-time dengan
            wawasan profesional yang dapat ditindaklanjuti.
          </p>
        </div>

        {!analysis && (
          <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-slate-800 font-space-grotesk">
                <Upload className="h-6 w-6 text-purple-600" />
                Unggah CV untuk Analisis AI
              </CardTitle>
              <CardDescription className="text-slate-600">
                Unggah CV dalam format PDF, DOC, DOCX, atau TXT untuk analisis cerdas dengan AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-purple-50 to-cyan-50 hover:from-purple-100 hover:to-cyan-100 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-4 text-purple-500" />
                    <p className="mb-2 text-sm text-slate-600 font-medium">
                      <span className="font-semibold">Klik untuk unggah</span> atau seret dan lepas
                    </p>
                    <p className="text-xs text-slate-500">PDF, DOC, DOCX atau TXT (MAKS. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">{file.name}</span>
                      <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={analyzeCV}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        AI Menganalisis...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Analisis dengan AI
                      </>
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-sm text-rose-600 font-medium">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {analysis && (
          <div className="space-y-6">
            {analysis._isMockData && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-amber-600" />
                    <p className="text-sm text-amber-700 font-medium">
                      {analysis._fallbackReason === "API quota exceeded"
                        ? "Demo Mode: Menampilkan contoh analisis karena quota API habis"
                        : "Demo Mode: Menampilkan contoh analisis untuk demonstrasi"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 font-space-grotesk">
                  {getScoreIcon(analysis.overallScore)}
                  Skor CV Keseluruhan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <Progress value={analysis.overallScore} className="h-4 bg-slate-200" />
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)} font-space-grotesk`}>
                    {analysis.overallScore}/100
                  </div>
                </div>
                <p className="text-slate-600 mt-3 font-medium">
                  {analysis.overallScore >= 80
                    ? "CV luar biasa! Anda siap mengesankan pemberi kerja."
                    : analysis.overallScore >= 60
                      ? "Fondasi yang solid dengan peluang untuk peningkatan."
                      : "Diperlukan perbaikan signifikan untuk memaksimalkan dampak."}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-cyan-50">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Analisis Bagian Terperinci</CardTitle>
                <CardDescription className="text-slate-600">Evaluasi mendalam setiap komponen CV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysis.sections.map((section, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 font-space-grotesk">{section.name}</h4>
                      <div className="flex items-center gap-2">
                        {getScoreIcon(section.score)}
                        <span className={`font-bold text-lg ${getScoreColor(section.score)} font-space-grotesk`}>
                          {section.score}/100
                        </span>
                      </div>
                    </div>
                    <Progress value={section.score} className="h-3 bg-slate-200" />
                    <p className="text-slate-600 font-medium">{section.feedback}</p>
                    {section.suggestions.length > 0 && (
                      <div className="ml-4 p-3 bg-white rounded-lg border border-purple-100">
                        <p className="text-sm font-bold text-slate-700 mb-2">Saran Perbaikan:</p>
                        <ul className="text-sm text-slate-600 space-y-2">
                          {section.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600 mt-1 font-bold">•</span>
                              <span className="font-medium">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {index < analysis.sections.length - 1 && <Separator className="bg-purple-200" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 font-space-grotesk">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  Skor Kompatibilitas ATS
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Seberapa baik CV Anda berkinerja dengan sistem penyaringan otomatis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <Progress value={analysis.atsCompatibility} className="h-4 bg-slate-200" />
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.atsCompatibility)} font-space-grotesk`}>
                    {analysis.atsCompatibility}/100
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-emerald-700 font-space-grotesk">Kekuatan Utama</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3 p-2 rounded-lg bg-emerald-50">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-rose-50">
                <CardHeader>
                  <CardTitle className="text-rose-700 font-space-grotesk">Area untuk Peningkatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-3 p-2 rounded-lg bg-rose-50">
                        <XCircle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="text-slate-800 font-space-grotesk">Rekomendasi Perbaikan</CardTitle>
                <CardDescription className="text-slate-600">
                  Saran strategis untuk memaksimalkan dampak CV Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-100"
                    >
                      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center pt-6">
              <Button
                onClick={() => {
                  setAnalysis(null)
                  setFile(null)
                }}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-6 py-2"
              >
                Analisis CV Lain
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
