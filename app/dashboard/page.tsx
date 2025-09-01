"use client"

import { useState, useEffect } from "react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CreateNoteForm } from "@/components/create-note-form"
import { NoteItem } from "@/components/note-item"
import { useRouter } from "next/navigation"

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface User {
  name?: string
  email: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchUserAndNotes()
  }, [])

  const fetchUserAndNotes = async () => {
    try {
      // Check if user is authenticated by trying to fetch notes
      const notesResponse = await fetch("/api/notes")
      
      if (notesResponse.status === 401) {
        router.push("/sign-in")
        return
      }
      
      if (notesResponse.ok) {
        const notesData = await notesResponse.json()
        setNotes(notesData.notes || [])
        
        // Get user info from localStorage or create a mock user
        const userInfo = {
          name: localStorage.getItem("userName") || "User",
          email: localStorage.getItem("userEmail") || "user@example.com"
        }
        setUser(userInfo)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      router.push("/sign-in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNoteCreated = () => {
    setShowCreateForm(false)
    fetchUserAndNotes()
  }

  const handleNoteUpdated = () => {
    fetchUserAndNotes()
  }

  const handleNoteDeleted = () => {
    fetchUserAndNotes()
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
      })
      
      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("userName")
        localStorage.removeItem("userEmail")
        
        toast({
          title: "Success",
          description: "Signed out successfully!",
        })
        
        router.push("/sign-in")
      } else {
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
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
      setIsSigningOut(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-[#6c6c6c]">Loading...</div>
        </div>
      </main>
    )
  }

  if (!user) {
    return null // Will redirect to sign-in
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Compact mobile-like top bar */}
      <header className="h-12 md:h-14 px-4 flex items-center justify-between border-b border-[#d9d9d9] bg-[#ffffff]">
        <Brand label="Dashboard" />
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="ghost"
          className="text-xs text-[#6c6c6c] hover:text-[#111827] p-2"
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
      </header>

      {/* Mobile-focused column layout, matching the mock */}
      <section className="max-w-md mx-auto p-4 space-y-4">
        <div className="rounded-lg border border-[#d9d9d9] bg-[#ffffff] p-4">
          <p className="text-sm text-[#6c6c6c]">Welcome,</p>
          <h2 className="text-base font-semibold text-[#111827]">{user.name}</h2>
          <p className="text-sm text-[#6c6c6c]">{user.email}</p>

          {!showCreateForm ? (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="mt-4 w-full bg-[#367aff] hover:bg-[#2f6ae0] text-[#ffffff]"
            >
              Create Note
            </Button>
          ) : (
            <div className="mt-4">
              <CreateNoteForm
                onNoteCreated={handleNoteCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[#111827]">
            My Notes {notes.length > 0 && `(${notes.length})`}
          </h3>
          
          {notes.length === 0 ? (
            <div className="rounded-lg border border-[#d9d9d9] bg-[#ffffff] p-4 text-center">
              <p className="text-sm text-[#6c6c6c]">
                No notes yet. Create your first note above!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  onNoteUpdated={handleNoteUpdated}
                  onNoteDeleted={handleNoteDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
