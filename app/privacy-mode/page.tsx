"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Shield, Eye, EyeOff, Trash2, Download, AlertTriangle } from "lucide-react"

export default function PrivacyModePage() {
  const [privacyMode, setPrivacyMode] = useState(false)
  const [autoDelete, setAutoDelete] = useState(true)
  const [cvContent, setCvContent] = useState("")
  const [maskedContent, setMaskedContent] = useState("")
  const [showOriginal, setShowOriginal] = useState(false)
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  const sensitivePatterns = [
    {
      name: "Email",
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      mask: "***@email.com",
    },
    {
      name: "Phone Indonesia",
      pattern: /(\+62|62|0)[\s-]?8[1-9][0-9]{1,2}[\s-]?[0-9]{3,4}[\s-]?[0-9]{3,4}/g,
      mask: "+62-***-***-***",
    },
    {
      name: "Phone General",
      pattern: /\b\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g,
      mask: "***-***-***",
    },
    {
      name: "Address",
      pattern:
        /\b\d+\s+[A-Za-z\s]+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr|Way|Jalan|Jl|Gang|Gg)\b/gi,
      mask: "*** [ALAMAT DISEMBUNYIKAN] ***",
    },
    {
      name: "ID Number KTP",
      pattern: /\b\d{16}\b/g,
      mask: "****************",
    },
    {
      name: "NPWP",
      pattern: /\b\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}\b/g,
      mask: "**.***.***.***-***.***",
    },
    {
      name: "Bank Account",
      pattern: /\b\d{10,16}\b/g,
      mask: "***REKENING***",
    },
    {
      name: "Postal Code",
      pattern: /\b\d{5}\b/g,
      mask: "*****",
    },
  ]

  const maskSensitiveData = (text: string) => {
    let masked = text
    const foundPatterns: string[] = []

    sensitivePatterns.forEach((pattern) => {
      const matches = text.match(pattern.pattern)
      if (matches && matches.length > 0) {
        foundPatterns.push(`${pattern.name}: ${matches.length} item(s)`)
        masked = masked.replace(pattern.pattern, pattern.mask)
      }
    })

    return { maskedText: masked, detectedPatterns: foundPatterns }
  }

  const handlePrivacyToggle = () => {
    const newPrivacyMode = !privacyMode
    setPrivacyMode(newPrivacyMode)

    if (newPrivacyMode && cvContent) {
      const { maskedText } = maskSensitiveData(cvContent)
      setMaskedContent(maskedText)
    }

    if (newPrivacyMode) {
      localStorage.setItem("scandidate_privacy_mode", "true")
    } else {
      localStorage.removeItem("scandidate_privacy_mode")
      setShowOriginal(false)
    }
  }

  const handleContentChange = (content: string) => {
    setCvContent(content)
    if (privacyMode) {
      const { maskedText } = maskSensitiveData(content)
      setMaskedContent(maskedText)
    }

    if (autoDelete && content.trim()) {
      startAutoDeleteTimer()
    }

    localStorage.setItem("scandidate_cv_temp", content)
  }

  const startAutoDeleteTimer = () => {
    if (deleteTimer) {
      clearTimeout(deleteTimer)
    }

    const deleteTime = Date.now() + 24 * 60 * 60 * 1000
    localStorage.setItem("scandidate_delete_time", deleteTime.toString())

    const timer = setTimeout(
      () => {
        clearAllData()
      },
      24 * 60 * 60 * 1000,
    )

    setDeleteTimer(timer)
    setTimeRemaining(24 * 60 * 60)

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((deleteTime - Date.now()) / 1000))
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  const clearAllData = () => {
    setCvContent("")
    setMaskedContent("")
    setShowOriginal(false)
    localStorage.removeItem("scandidate_cv_temp")
    localStorage.removeItem("scandidate_delete_time")
    localStorage.removeItem("scandidate_privacy_mode")

    if (deleteTimer) {
      clearTimeout(deleteTimer)
      setDeleteTimer(null)
    }
    setTimeRemaining(null)
  }

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}j ${minutes}m ${secs}d`
  }

  const downloadMaskedCV = () => {
    const content = privacyMode ? maskedContent : cvContent
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `CV_${privacyMode ? "Protected" : "Original"}_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const savedContent = localStorage.getItem("scandidate_cv_temp")
    const savedPrivacyMode = localStorage.getItem("scandidate_privacy_mode")
    const savedDeleteTime = localStorage.getItem("scandidate_delete_time")

    if (savedContent) {
      setCvContent(savedContent)
    }

    if (savedPrivacyMode === "true") {
      setPrivacyMode(true)
      if (savedContent) {
        const { maskedText } = maskSensitiveData(savedContent)
        setMaskedContent(maskedText)
      }
    }

    if (savedDeleteTime) {
      const deleteTime = Number.parseInt(savedDeleteTime)
      const remaining = Math.max(0, Math.floor((deleteTime - Date.now()) / 1000))

      if (remaining > 0) {
        setTimeRemaining(remaining)
        const timer = setTimeout(() => {
          clearAllData()
        }, remaining * 1000)
        setDeleteTimer(timer)

        const interval = setInterval(() => {
          const newRemaining = Math.max(0, Math.floor((deleteTime - Date.now()) / 1000))
          setTimeRemaining(newRemaining)

          if (newRemaining <= 0) {
            clearInterval(interval)
            clearAllData()
          }
        }, 1000)
      } else {
        clearAllData()
      }
    }

    return () => {
      if (deleteTimer) {
        clearTimeout(deleteTimer)
      }
    }
  }, [])

  const { detectedPatterns } = cvContent ? maskSensitiveData(cvContent) : { detectedPatterns: [] }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 p-4 font-inter">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk mb-4">
            Mode Privasi
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Lindungi data pribadi Anda dengan fitur privasi canggih. Otomatis menyembunyikan informasi sensitif dan
            menghapus data secara otomatis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 font-space-grotesk">Pengaturan Privasi</CardTitle>
              <CardDescription>Konfigurasi perlindungan data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Mode Privasi</Label>
                  <p className="text-xs text-slate-500">Aktifkan perlindungan data otomatis</p>
                </div>
                <Switch checked={privacyMode} onCheckedChange={handlePrivacyToggle} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Auto Delete</Label>
                  <p className="text-xs text-slate-500">Hapus data setelah 24 jam</p>
                </div>
                <Switch checked={autoDelete} onCheckedChange={setAutoDelete} />
              </div>

              {timeRemaining && autoDelete && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Auto Delete Aktif</span>
                  </div>
                  <p className="text-xs text-amber-600">
                    Data akan dihapus dalam: {formatTimeRemaining(timeRemaining)}
                  </p>
                </div>
              )}

              {detectedPatterns.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-700 mb-2">Data Sensitif Terdeteksi:</h4>
                  <ul className="text-xs text-blue-600 space-y-1">
                    {detectedPatterns.map((pattern, index) => (
                      <li key={index}>• {pattern}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t space-y-3">
                <Button
                  onClick={downloadMaskedCV}
                  disabled={!cvContent}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CV {privacyMode ? "Terproteksi" : "Original"}
                </Button>

                <Button
                  onClick={clearAllData}
                  variant="outline"
                  className="w-full border-rose-300 text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Semua Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 font-space-grotesk">
                  <Shield className="h-5 w-5 text-purple-600" />
                  CV dengan Perlindungan Privasi
                </CardTitle>
                <CardDescription>
                  {privacyMode
                    ? "Data sensitif otomatis disembunyikan untuk melindungi privasi Anda"
                    : "Masukkan CV Anda - aktifkan mode privasi untuk perlindungan otomatis"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste konten CV Anda di sini..."
                  value={privacyMode ? maskedContent : cvContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={12}
                  className="resize-none"
                />

                {privacyMode && cvContent && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">
                        {detectedPatterns.length} jenis data sensitif telah disembunyikan
                      </span>
                    </div>
                    <Button
                      onClick={() => setShowOriginal(!showOriginal)}
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      {showOriginal ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Sembunyikan
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Tampilkan Asli
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {showOriginal && privacyMode && (
                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-amber-700 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Data Asli (Tidak Dilindungi)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea value={cvContent} readOnly rows={8} className="resize-none bg-white/50" />
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-blue-800">Fitur Perlindungan Privasi</h3>
                </div>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Deteksi otomatis email, nomor telepon, dan alamat</li>
                  <li>• Penyembunyian nomor KTP, NPWP, dan rekening bank</li>
                  <li>• Auto-delete data setelah 24 jam</li>
                  <li>• Download CV dalam mode terproteksi</li>
                  <li>• Penyimpanan lokal yang aman</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
