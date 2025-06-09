import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const jobMatchSchema = z.object({
  overallMatch: z.number().min(0).max(100),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  experienceMatch: z.object({
    score: z.number().min(0).max(100),
    feedback: z.string(),
  }),
  educationMatch: z.object({
    score: z.number().min(0).max(100),
    feedback: z.string(),
  }),
  keywordAnalysis: z.object({
    foundKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
    keywordDensity: z.number().min(0).max(100),
  }),
  recommendations: z.array(z.string()),
  improvementAreas: z.array(z.string()),
})

const getMockJobMatch = () => ({
  overallMatch: 78,
  matchingSkills: ["JavaScript", "React", "Node.js", "HTML/CSS", "Git", "Problem Solving", "Team Collaboration"],
  missingSkills: ["TypeScript", "Docker", "AWS", "GraphQL", "Testing Frameworks", "CI/CD"],
  experienceMatch: {
    score: 75,
    feedback:
      "Pengalaman kerja Anda menunjukkan kemampuan yang relevan dengan posisi ini. Namun, perlu lebih banyak pengalaman dengan teknologi cloud dan DevOps.",
  },
  educationMatch: {
    score: 85,
    feedback:
      "Latar belakang pendidikan Anda sangat sesuai dengan posisi ini. Gelar di bidang teknologi informasi memberikan fondasi yang kuat.",
  },
  keywordAnalysis: {
    foundKeywords: ["JavaScript", "React", "Frontend", "Backend", "Database", "API", "Agile"],
    missingKeywords: ["TypeScript", "Microservices", "Kubernetes", "DevOps", "Machine Learning"],
    keywordDensity: 65,
  },
  recommendations: [
    "Tambahkan pengalaman dengan TypeScript untuk meningkatkan kesesuaian",
    "Pelajari teknologi cloud seperti AWS atau Azure",
    "Dapatkan sertifikasi dalam teknologi yang disebutkan dalam job description",
    "Tambahkan project portfolio yang menunjukkan kemampuan full-stack development",
    "Tingkatkan pengalaman dengan testing frameworks dan CI/CD",
  ],
  improvementAreas: [
    "Kurangnya pengalaman dengan teknologi cloud",
    "Perlu lebih banyak exposure ke DevOps practices",
    "Skill testing dan quality assurance perlu ditingkatkan",
    "Pengalaman dengan microservices architecture masih terbatas",
  ],
})

export async function POST(request: NextRequest) {
  try {
    const { cvContent, jobDescription } = await request.json()

    if (!cvContent || !jobDescription) {
      return NextResponse.json({ error: "CV dan deskripsi pekerjaan harus diisi" }, { status: 400 })
    }

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: jobMatchSchema,
        prompt: `Analisis tingkat kesesuaian antara CV dan deskripsi pekerjaan berikut dalam bahasa Indonesia:

CV Content:
${cvContent}

Job Description:
${jobDescription}

Berikan analisis mendalam yang mencakup:
1. Skor kesesuaian keseluruhan (0-100)
2. Keterampilan yang cocok dan yang kurang
3. Analisis pengalaman dan pendidikan
4. Analisis kata kunci untuk ATS
5. Rekomendasi spesifik untuk meningkatkan kesesuaian
6. Area yang perlu diperbaiki

Fokus pada standar rekrutmen Indonesia dan berikan feedback yang actionable.`,
      })

      return NextResponse.json(object)
    } catch (aiError: any) {
      console.error("AI API Error:", aiError)

      if (aiError.message?.includes("quota") || aiError.message?.includes("billing")) {
        console.log("Quota exceeded, using mock data as fallback")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        return NextResponse.json({
          ...getMockJobMatch(),
          _isMockData: true,
          _fallbackReason: "API quota exceeded",
        })
      }

      throw aiError
    }
  } catch (error) {
    console.error("Error analyzing job match:", error)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return NextResponse.json({
        ...getMockJobMatch(),
        _isMockData: true,
        _fallbackReason: "Service temporarily unavailable",
      })
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Terjadi kesalahan saat menganalisis kesesuaian pekerjaan. Silakan coba lagi." },
        { status: 500 },
      )
    }
  }
}
