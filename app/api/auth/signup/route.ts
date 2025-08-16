import { NextResponse } from "next/server"
import { connectDB } from "../../../../backend/db"
import User from "../../../../backend/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ ok: false, error: "User already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, phone, passwordHash })

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 })
  }
}
