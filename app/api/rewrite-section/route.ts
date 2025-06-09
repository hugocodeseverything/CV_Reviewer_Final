import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { section, content, jobTitle, industry } = await request.json()

    if (!section || !content) {
      return NextResponse.json({ error: "Bagian dan konten harus diisi" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Tulis ulang bagian CV berikut agar lebih profesional, menarik, dan sesuai standar industri Indonesia:

Bagian: ${section}
Konten Asli: ${content}
${jobTitle ? `Posisi Target: ${jobTitle}` : ""}
${industry ? `Industri: ${industry}` : ""}

Instruksi:
1. Gunakan bahasa Indonesia yang profesional dan formal
2. Buat konten lebih menarik dan berdampak
3. Tambahkan kata kunci yang relevan untuk ATS
4. Pastikan sesuai dengan standar CV Indonesia
5. Fokus pada pencapaian dan hasil yang terukur
6. Gunakan action verbs yang kuat

Berikan hasil yang siap digunakan langsung di CV.`,
    })

    return NextResponse.json({ rewrittenContent: text })
  } catch (error) {
    console.error("Error rewriting section:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menulis ulang bagian. Silakan coba lagi." },
      { status: 500 },
    )
  }
}
