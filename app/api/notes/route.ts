import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

// GET - Fetch all notes for the authenticated user
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const notes = await db.collection("notes").find({ 
      userId: session.userId 
    }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ 
        error: "Title and content are required" 
      }, { status: 400 })
    }

    const db = await getDb()
    const note = {
      title,
      content,
      userId: session.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("notes").insertOne(note)

    return NextResponse.json({ 
      message: "Note created successfully",
      noteId: result.insertedId 
    })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
