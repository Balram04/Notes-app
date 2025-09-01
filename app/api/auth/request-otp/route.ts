import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { sendOtpEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Please provide an email address." }, { status: 400 })

    const db = await getDb()
    const Users = db.collection("users")
    const Otps = db.collection("otps")

    const user = await Users.findOne({ email: email.toLowerCase() })
    if (!user) return NextResponse.json({ error: "Email not found. Please sign up first to create an account." }, { status: 404 })

    const code = (crypto.randomInt(0, 1000000) + "").padStart(6, "0")
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await Otps.deleteMany({ email: user.email })
    await Otps.insertOne({ email: user.email, code, expiresAt })

    await sendOtpEmail(user.email, code)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[v0] request-otp error", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
