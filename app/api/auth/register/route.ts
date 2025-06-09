import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database-connection"
import User from "@/models/user-model"

export async function POST(request: NextRequest) {
  try {
    console.log("Register API called")

    await connectDB()
    console.log("Database connected")

    const body = await request.json()
    console.log("Request body:", body)

    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password harus minimal 6 karakter" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    })

    await user.save()
    console.log("User created successfully")

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        message: "User berhasil dibuat",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Register error:", error)

    if (error.code === 11000) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
