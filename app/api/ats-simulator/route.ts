import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const atsSimulationSchema = z.object({
  overallAtsScore: z.number().min(0).max(100),
  parsingResults: z.object({
    contactInfo: z.object({
      extracted: z.boolean(),
      issues: z.array(z.string()),
    }),
    workExperience: z.object({
      extracted: z.boolean(),
      issues: z.array(z.string()),
    }),
    education: z.object({
      extracted: z.boolean(),
      issues: z.array(z.string()),
    }),
    skills: z.object({
      extracted: z.boolean(),
      issues: z.array(z.string()),
    }),
  }),
  keywordMatching: z.object({
    score: z.number().min(0).max(100),
    matchedKeywords: z.array(z.string()),
    missedKeywords: z.array(z.string()),
  }),
  formatIssues: z.array(z.string()),
  recommendations: z.array(z.string()),
  atsCompatibilityTips: z.array(z.string()),
})

const getMockATSSimulation = () => ({
  overallAtsScore: 82,
  parsingResults: {
    contactInfo: {
      extracted: true,
      issues: [],
    },
    workExperience: {
      extracted: true,
      issues: ["Tanggal tidak konsisten dalam format", "Beberapa deskripsi pekerjaan terlalu panjang"],
    },
    education: {
      extracted: true,
      issues: [],
    },
    skills: {
      extracted: false,
      issues: ["Skills tidak dikelompokkan dengan jelas", "Format bullet points tidak standar"],
    },
  },
  keywordMatching: {
    score: 75,
    matchedKeywords: ["JavaScript", "React", "Node.js", "Database", "API", "Git"],
    missedKeywords: ["TypeScript", "Docker", "AWS", "Testing", "Agile"],
  },
  formatIssues: [
    "Penggunaan font yang tidak standar dapat menyulitkan parsing",
    "Tabel kompleks mungkin tidak terbaca dengan baik oleh ATS",
    "Beberapa section tidak memiliki header yang jelas",
  ],
  recommendations: [
    "Gunakan format tanggal yang konsisten (MM/YYYY)",
    "Kelompokkan skills dalam kategori yang jelas",
    "Gunakan bullet points standar untuk deskripsi pekerjaan",
    "Pastikan semua section memiliki header yang jelas",
    "Hindari penggunaan tabel kompleks",
    "Gunakan font standar seperti Arial atau Calibri",
  ],
  atsCompatibilityTips: [
    "Simpan CV dalam format .docx atau .pdf",
    "Gunakan template CV yang ATS-friendly",
    "Pastikan nama file CV mengandung nama Anda",
    "Hindari penggunaan header/footer yang kompleks",
    "Gunakan keyword yang relevan dengan posisi yang dilamar",
    "Pastikan informasi kontak mudah dibaca",
  ],
})

export async function POST(request: NextRequest) {
  try {
    const { cvContent, jobDescription } = await request.json()

    if (!cvContent) {
      return NextResponse.json({ error: "Konten CV harus diisi" }, { status: 400 })
    }

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: atsSimulationSchema,
        prompt: `Simulasikan bagaimana sistem ATS (Applicant Tracking System) akan memproses CV berikut dalam bahasa Indonesia:

CV Content:
${cvContent}

${jobDescription ? `Job Description: ${jobDescription}` : ""}

Berikan analisis simulasi ATS yang mencakup:
1. Skor ATS keseluruhan (0-100)
2. Hasil parsing untuk setiap bagian CV (kontak, pengalaman, pendidikan, skills)
3. Analisis pencocokan kata kunci
4. Masalah format yang dapat mengganggu ATS
5. Rekomendasi untuk meningkatkan kompatibilitas ATS
6. Tips khusus untuk optimasi ATS

Fokus pada sistem ATS yang umum digunakan di Indonesia dan berikan feedback yang praktis.`,
      })

      return NextResponse.json(object)
    } catch (aiError: any) {
      console.error("AI API Error:", aiError)

      if (aiError.message?.includes("quota") || aiError.message?.includes("billing")) {
        console.log("Quota exceeded, using mock data as fallback")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        return NextResponse.json({
          ...getMockATSSimulation(),
          _isMockData: true,
          _fallbackReason: "API quota exceeded",
        })
      }

      throw aiError
    }
  } catch (error) {
    console.error("Error simulating ATS:", error)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return NextResponse.json({
        ...getMockATSSimulation(),
        _isMockData: true,
        _fallbackReason: "Service temporarily unavailable",
      })
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Terjadi kesalahan saat mensimulasikan ATS. Silakan coba lagi." },
        { status: 500 },
      )
    }
  }
}
