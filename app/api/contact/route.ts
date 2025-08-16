import { NextResponse } from "next/server"
import { connectDB } from "../../../backend/db"
import ContactMessage from "../../../backend/models/ContactMessage"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, email, phone, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 })
    }

    const doc = await ContactMessage.create({ name, email, phone, subject, message })
    return NextResponse.json({ ok: true, data: { id: doc._id } })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 })
  }
}
