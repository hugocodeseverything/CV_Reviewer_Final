import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const careerSuggestionSchema = z.object({
  currentLevel: z.string(),
  careerPaths: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      timeframe: z.string(),
      requiredSkills: z.array(z.string()),
      salaryRange: z.string(),
      growthPotential: z.number().min(1).max(5),
    }),
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      importance: z.enum(["Tinggi", "Sedang", "Rendah"]),
      learningResources: z.array(z.string()),
    }),
  ),
  industryTrends: z.array(z.string()),
  nextSteps: z.array(z.string()),
  certifications: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const { cvContent, currentRole, targetIndustry, experienceLevel } = await request.json()

    if (!cvContent) {
      return NextResponse.json({ error: "Konten CV harus diisi" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: careerSuggestionSchema,
      prompt: `Berikan saran karir yang komprehensif berdasarkan profil berikut dalam bahasa Indonesia:

CV Content: ${cvContent}
Current Role: ${currentRole || "Tidak disebutkan"}
Target Industry: ${targetIndustry || "Tidak disebutkan"}
Experience Level: ${experienceLevel || "Tidak disebutkan"}

Berikan analisis yang mencakup:
1. Penilaian level karir saat ini
2. 3-5 jalur karir yang realistis dengan detail lengkap
3. Analisis skill gap dan cara mengatasinya
4. Tren industri yang relevan
5. Langkah-langkah konkret untuk pengembangan karir
6. Sertifikasi yang direkomendasikan

Fokus pada pasar kerja Indonesia dan berikan saran yang praktis dan dapat ditindaklanjuti.`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error generating career suggestions:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghasilkan saran karir. Silakan coba lagi." },
      { status: 500 },
    )
  }
}
