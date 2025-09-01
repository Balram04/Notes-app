"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!agree || loading) return
        
        // Validation
        if (!name.trim()) {
          toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" })
          return
        }
        if (!email.trim()) {
          toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" })
          return
        }
        if (!password.trim()) {
          toast({ title: "Password required", description: "Please enter a password.", variant: "destructive" })
          return
        }
        if (password.length < 6) {
          toast({ title: "Password too short", description: "Password must be at least 6 characters long.", variant: "destructive" })
          return
        }
        
        try {
          setLoading(true)
          const res = await fetch("/api/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          })
          const data = await res.json()
          if (!res.ok) {
            if (res.status === 409) {
              // Email already exists - redirect to signin
              toast({ 
                title: "Account already exists", 
                description: "This email is already registered. Redirecting to sign in...", 
                variant: "destructive" 
              })
              setTimeout(() => router.push("/sign-in"), 2000)
              return
            }
            throw new Error(data.error || "Sign up failed")
          }
          toast({ title: "Account created", description: "Check your email to sign in with an OTP." })
          router.push("/sign-in")
        } catch (err) {
          const error = err as Error
          toast({ title: "Sign up failed", description: error.message, variant: "destructive" })
        } finally {
          setLoading(false)
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#111827]">
          Name
        </Label>
        <Input
          id="name"
          placeholder="jems Bond"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#ffffff] border-[#d9d9d9] text-[#111827] placeholder:text-[#6c6c6c]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#111827]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#ffffff] border-[#d9d9d9] text-[#111827] placeholder:text-[#6c6c6c]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#111827]">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#ffffff] border-[#d9d9d9] text-[#111827] placeholder:text-[#6c6c6c]"
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="terms" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
        <Label htmlFor="terms" className="text-sm text-[#6c6c6c] leading-6">
          I have read the terms &amp; privacy policy
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#367aff] hover:bg-[#2f6ae0] text-[#ffffff]"
        disabled={!agree || loading}
      >
        {loading ? "Creating..." : "Sign up"}
      </Button>

      <p className="text-sm text-[#6c6c6c]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#367aff] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
