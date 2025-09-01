import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { createSession } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) return NextResponse.json({ error: "Please provide both email and verification code." }, { status: 400 })

    const db = await getDb()
    const Users = db.collection("users")
    const Otps = db.collection("otps")

    const otp = await Otps.findOne({ email: email.toLowerCase(), code })
    if (!otp) return NextResponse.json({ error: "Invalid verification code. Please check the code and try again." }, { status: 401 })
    if (new Date(otp.expiresAt).getTime() < Date.now()) {
      await Otps.deleteOne({ _id: otp._id })
      return NextResponse.json({ error: "Verification code has expired. Please request a new code." }, { status: 401 })
    }

    const user = await Users.findOne({ email: email.toLowerCase() })
    if (!user) return NextResponse.json({ error: "Email not found. Please sign up first to create an account." }, { status: 404 })

    await Otps.deleteOne({ _id: otp._id })

    await createSession({ 
      sub: user._id.toString(), 
      userId: user._id.toString(),
      email: user.email, 
      name: user.name 
    })

    return NextResponse.json({ 
      ok: true,
      user: {
        name: user.name,
        email: user.email
      }
    })
  } catch (e) {
    console.error("[v0] verify-otp error", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
