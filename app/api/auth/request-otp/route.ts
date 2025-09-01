import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { sendOtpEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    // Check environment variables first
    if (!process.env.MONGODB_URI) {
      console.error("Missing MONGODB_URI environment variable")
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Missing SMTP environment variables")
      return NextResponse.json({ error: "Email configuration error" }, { status: 500 })
    }

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Please provide an email address." }, { status: 400 })

    console.log("Connecting to database...")
    const db = await getDb()
    const Users = db.collection("users")
    const Otps = db.collection("otps")

    console.log("Looking up user:", email.toLowerCase())
    const user = await Users.findOne({ email: email.toLowerCase() })
    if (!user) return NextResponse.json({ error: "Email not found. Please sign up first to create an account." }, { status: 404 })

    const code = (crypto.randomInt(0, 1000000) + "").padStart(6, "0")
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    console.log("Storing OTP in database...")
    await Otps.deleteMany({ email: user.email })
    await Otps.insertOne({ email: user.email, code, expiresAt })

    console.log("Sending OTP email...")
    await sendOtpEmail(user.email, code)

    console.log("OTP request completed successfully")
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Request OTP error:", e)
    
    // Provide more specific error messages
    if (e instanceof Error) {
      if (e.message.includes("SMTP")) {
        return NextResponse.json({ error: "Email service unavailable" }, { status: 500 })
      }
      if (e.message.includes("MongoDB") || e.message.includes("connection")) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
