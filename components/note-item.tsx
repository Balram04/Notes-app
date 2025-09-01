"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { EditNoteForm } from "./edit-note-form"

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NoteItemProps {
  note: Note
  onNoteUpdated: () => void
  onNoteDeleted: () => void
}

export function NoteItem({ note, onNoteUpdated, onNoteDeleted }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Note deleted successfully!",
        })
        onNoteDeleted()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete note",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditComplete = () => {
    setIsEditing(false)
    onNoteUpdated()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border border-[#d9d9d9] bg-[#ffffff] p-4">
        <EditNoteForm
          note={note}
          onNoteUpdated={handleEditComplete}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#d9d9d9] bg-[#ffffff] p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-[#111827] truncate flex-1 mr-2">
          {note.title}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-[#367aff] hover:underline px-1"
            aria-label={`Edit ${note.title}`}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-red-500 hover:underline px-1 disabled:opacity-50"
            aria-label={`Delete ${note.title}`}
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        <p className="text-xs text-[#6c6c6c] whitespace-pre-wrap">
          {showFullContent ? note.content : truncateContent(note.content)}
        </p>
        {note.content.length > 100 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-xs text-[#367aff] hover:underline mt-1"
          >
            {showFullContent ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      
      <div className="text-xs text-[#6c6c6c]">
        Created: {formatDate(note.createdAt)}
        {note.updatedAt !== note.createdAt && (
          <span className="ml-2">• Updated: {formatDate(note.updatedAt)}</span>
        )}
      </div>
    </div>
  )
}
