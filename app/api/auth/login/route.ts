import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database-connection"
import User from "@/models/user-model"

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called")

    await connectDB()
    console.log("Database connected")

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const token = `demo-token-${user._id}`

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: userResponse,
        token,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
