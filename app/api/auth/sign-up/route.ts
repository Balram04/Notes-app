import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please fill in all required fields (name, email, and password)." }, { status: 400 })
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 })
    }
    const db = await getDb()
    const Users = db.collection("users")

    const existing = await Users.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const now = new Date()
    const { insertedId } = await Users.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({ ok: true, userId: insertedId.toString() })
  } catch (e) {
    console.error("[v0] sign-up error", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
