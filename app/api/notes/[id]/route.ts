import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

interface Params {
  id: string
}

// PUT - Update a note
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()
    const { id } = params

    if (!title || !content) {
      return NextResponse.json({ 
        error: "Title and content are required" 
      }, { status: 400 })
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("notes").updateOne(
      { 
        _id: new ObjectId(id),
        userId: session.userId 
      },
      { 
        $set: { 
          title,
          content,
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Note updated successfully" })
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

// DELETE - Delete a note
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("notes").deleteOne({
      _id: new ObjectId(id),
      userId: session.userId
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}
