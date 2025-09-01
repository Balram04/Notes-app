"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface EditNoteFormProps {
  note: Note
  onNoteUpdated: () => void
  onCancel: () => void
}

export function EditNoteForm({ note, onNoteUpdated, onCancel }: EditNoteFormProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Note updated successfully!",
        })
        onNoteUpdated()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update note",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          placeholder="Write your note content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[120px] resize-none"
        />
      </div>
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#367aff] hover:bg-[#2f6ae0] text-white"
        >
          {isLoading ? "Updating..." : "Update Note"}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
