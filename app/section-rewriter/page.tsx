"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileEdit, Zap, Copy, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SectionRewriterPage() {
  const [section, setSection] = useState("")
  const [content, setContent] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [industry, setIndustry] = useState("")
  const [rewrittenContent, setRewrittenContent] = useState("")
  const [isRewriting, setIsRewriting] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleRewrite = async () => {
    if (!section || !content.trim()) {
      setError("Silakan pilih bagian dan masukkan konten")
      return
    }

    setIsRewriting(true)
    setError("")

    try {
      const response = await fetch("/api/rewrite-section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section,
          content,
          jobTitle,
          industry,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menulis ulang bagian")
      }

      const result = await response.json()
      setRewrittenContent(result.rewrittenContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui")
    } finally {
      setIsRewriting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Gagal menyalin:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 font-inter">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl">
              <FileEdit className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk">
              Penulis Ulang Bagian CV
            </h1>
            <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">Powered by AI</Badge>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Tingkatkan bagian CV Anda dengan bantuan AI. Dapatkan konten yang lebih profesional, menarik, dan optimized
            untuk ATS.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 font-space-grotesk">Input Konten</CardTitle>
              <CardDescription>Masukkan bagian CV yang ingin ditulis ulang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section">Bagian CV</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bagian CV" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ringkasan-profesional">Ringkasan Profesional</SelectItem>
                    <SelectItem value="pengalaman-kerja">Pengalaman Kerja</SelectItem>
                    <SelectItem value="keterampilan">Keterampilan</SelectItem>
                    <SelectItem value="pendidikan">Pendidikan</SelectItem>
                    <SelectItem value="pencapaian">Pencapaian</SelectItem>
                    <SelectItem value="objektif-karir">Objektif Karir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Konten Asli</Label>
                <Textarea
                  id="content"
                  placeholder="Masukkan konten bagian CV yang ingin ditulis ulang..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Posisi Target (Opsional)</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industri (Opsional)</Label>
                  <Input
                    id="industry"
                    placeholder="e.g. Teknologi"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <p className="text-sm text-rose-600 font-medium">{error}</p>
                </div>
              )}

              <Button
                onClick={handleRewrite}
                disabled={isRewriting || !section || !content.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isRewriting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    AI Menulis Ulang...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Tulis Ulang dengan AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 font-space-grotesk">Hasil AI</CardTitle>
              <CardDescription>Konten yang telah ditulis ulang oleh AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rewrittenContent ? (
                <>
                  <div className="relative">
                    <Textarea
                      value={rewrittenContent}
                      readOnly
                      rows={12}
                      className="resize-none bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-200"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-700 font-medium">
                       Konten telah dioptimalkan dengan AI untuk meningkatkan daya tarik dan kompatibilitas ATS
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <FileEdit className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Hasil AI akan muncul di sini</p>
                    <p className="text-sm text-slate-400">Masukkan konten dan klik "Tulis Ulang dengan AI"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-800">Tips Menggunakan Penulis Ulang AI</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Berikan konteks yang jelas dengan mengisi posisi target dan industri</li>
              <li>• Semakin detail konten asli, semakin baik hasil yang dihasilkan AI</li>
              <li>• Review dan sesuaikan hasil AI dengan pengalaman pribadi Anda</li>
              <li>• Gunakan hasil sebagai inspirasi, bukan pengganti total</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
