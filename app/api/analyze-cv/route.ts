import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const analysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  sections: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
  ),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  atsCompatibility: z.number().min(0).max(100),
})

const getMockAnalysis = () => ({
  overallScore: 75,
  sections: [
    {
      name: "Informasi Kontak",
      score: 90,
      feedback: "Informasi kontak lengkap dan mudah dibaca. Email dan nomor telepon tersedia dengan jelas.",
      suggestions: ["Pertimbangkan menambahkan LinkedIn profile", "Pastikan format nomor telepon konsisten"],
    },
    {
      name: "Ringkasan Profesional",
      score: 70,
      feedback: "Ringkasan cukup baik namun bisa lebih spesifik tentang pencapaian dan nilai yang ditawarkan.",
      suggestions: [
        "Tambahkan angka atau metrik pencapaian",
        "Sebutkan keahlian teknis yang relevan",
        "Buat lebih ringkas dan impactful",
      ],
    },
    {
      name: "Pengalaman Kerja",
      score: 80,
      feedback: "Pengalaman kerja dijelaskan dengan baik, namun perlu lebih banyak detail tentang pencapaian spesifik.",
      suggestions: [
        "Gunakan action verbs yang kuat",
        "Tambahkan hasil kuantitatif",
        "Fokus pada kontribusi dan dampak",
      ],
    },
    {
      name: "Pendidikan",
      score: 85,
      feedback: "Bagian pendidikan sudah lengkap dengan informasi yang relevan.",
      suggestions: ["Tambahkan IPK jika di atas 3.5", "Sebutkan prestasi akademik yang relevan"],
    },
    {
      name: "Keterampilan",
      score: 65,
      feedback: "Daftar keterampilan perlu lebih terstruktur dan spesifik sesuai dengan posisi yang dilamar.",
      suggestions: [
        "Kategorikan keterampilan (teknis, soft skills)",
        "Tambahkan level kemahiran",
        "Sesuaikan dengan job requirements",
      ],
    },
  ],
  strengths: [
    "Format CV yang rapi dan mudah dibaca",
    "Pengalaman kerja yang relevan dengan posisi",
    "Pendidikan yang sesuai dengan bidang",
    "Informasi kontak yang lengkap",
  ],
  weaknesses: [
    "Kurang pencapaian yang terukur",
    "Ringkasan profesional bisa lebih kuat",
    "Keterampilan perlu lebih spesifik",
    "Tidak ada portfolio atau project showcase",
  ],
  recommendations: [
    "Tambahkan section untuk project atau portfolio",
    "Gunakan lebih banyak angka dan metrik dalam deskripsi pengalaman",
    "Sesuaikan CV dengan setiap posisi yang dilamar",
    "Pertimbangkan menambahkan sertifikasi yang relevan",
    "Buat ringkasan profesional yang lebih compelling",
  ],
  atsCompatibility: 78,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    const text = await file.text()

    if (!text.trim()) {
      return NextResponse.json({ error: "File kosong atau tidak dapat dibaca" }, { status: 400 })
    }

    const useMockData = !process.env.OPENAI_API_KEY || process.env.USE_MOCK_DATA === "true"

    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return NextResponse.json({
        ...getMockAnalysis(),
        _isMockData: true,
      })
    }

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: analysisSchema,
        prompt: `Analisis CV berikut ini secara mendalam dan berikan penilaian profesional dalam bahasa Indonesia:

CV Content:
${text}

Berikan analisis yang mencakup:
1. Skor keseluruhan (0-100)
2. Analisis per bagian (Informasi Kontak, Ringkasan Profesional, Pengalaman Kerja, Pendidikan, Keterampilan)
3. Kekuatan utama CV
4. Area yang perlu diperbaiki
5. Rekomendasi spesifik untuk peningkatan
6. Skor kompatibilitas ATS (0-100)

Berikan feedback yang konstruktif, spesifik, dan dapat ditindaklanjuti. Fokus pada standar industri Indonesia dan praktik terbaik rekrutmen modern.`,
      })

      return NextResponse.json(object)
    } catch (aiError: any) {
      console.error("AI API Error:", aiError)

      if (aiError.message?.includes("quota") || aiError.message?.includes("billing")) {
        console.log("Quota exceeded, using mock data as fallback")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        return NextResponse.json({
          ...getMockAnalysis(),
          _isMockData: true,
          _fallbackReason: "API quota exceeded",
        })
      }

      throw aiError
    }
  } catch (error) {
    console.error("Error analyzing CV:", error)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return NextResponse.json({
        ...getMockAnalysis(),
        _isMockData: true,
        _fallbackReason: "Service temporarily unavailable",
      })
    } catch (fallbackError) {
      return NextResponse.json(
        {
          error: "Terjadi kesalahan saat menganalisis CV. Silakan coba lagi.",
        },
        { status: 500 },
      )
    }
  }
}
