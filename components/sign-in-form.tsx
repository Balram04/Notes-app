"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"


export function SignInForm() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [staySignedIn, setStaySignedIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Debounced OTP request function
  const requestOtp = useCallback(async (emailAddress: string) => {
    if (!emailAddress.trim() || !isValidEmail(emailAddress) || sendingOtp) return
    
    try {
      setSendingOtp(true)
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddress }),
      })
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 404) {
          // User not found - suggest signup
          toast({ 
            title: "Account not found", 
            description: "This email is not registered. Redirecting to sign up...", 
            variant: "destructive" 
          })
          setTimeout(() => router.push("/sign-up"), 2000)
          return
        }
        throw new Error(data.error || "Could not send code")
      }
      
      setOtpSent(true)
      toast({ 
        title: "Code sent!", 
        description: "Check your inbox for the verification code.",
        variant: "default"
      })
    } catch (err) {
      const error = err as Error
      toast({ title: "Failed to send code", description: error.message, variant: "destructive" })
      setOtpSent(false)
    } finally {
      setSendingOtp(false)
    }
  }, [sendingOtp, toast, router])

  // Auto-send OTP when email becomes valid
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email && isValidEmail(email) && !otpSent && !sendingOtp) {
        setEmailValid(true)
        requestOtp(email)
      } else if (!email || !isValidEmail(email)) {
        setEmailValid(false)
        setOtpSent(false)
        setOtp("")
      }
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [email, otpSent, sendingOtp, requestOtp])

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        if (loading) return
        
        // Validation
        if (!email.trim()) {
          toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" })
          return
        }
        if (!isValidEmail(email)) {
          toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" })
          return
        }
        if (!otpSent) {
          toast({ title: "Waiting for code", description: "Please wait for the verification code to be sent.", variant: "destructive" })
          return
        }
        if (!otp.trim()) {
          toast({ title: "OTP required", description: "Please enter the verification code.", variant: "destructive" })
          return
        }
        if (otp.length !== 6) {
          toast({ title: "Invalid OTP", description: "Please enter the complete 6-digit code.", variant: "destructive" })
          return
        }
        
        try {
          setLoading(true)
          const res = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code: otp, staySignedIn }),
          })
          const data = await res.json()
          if (!res.ok) {
            if (res.status === 404) {
              // User not found - redirect to signup
              toast({ 
                title: "Account not found", 
                description: "This email is not registered. Redirecting to sign up...", 
                variant: "destructive" 
              })
              setTimeout(() => router.push("/sign-up"), 2000)
              return
            }
            throw new Error(data.error || "Sign in failed")
          }
          
          // Store user info in localStorage for the dashboard
          if (data.user) {
            localStorage.setItem("userName", data.user.name || "User")
            localStorage.setItem("userEmail", data.user.email || email)
          }
          
          router.push("/dashboard")
        } catch (err) {
          const error = err as Error
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" })
        } finally {
          setLoading(false)
        }
      }}
    >
            <div className="space-y-2">
        <Label htmlFor="email" className="text-[#111827]">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#ffffff] border-[#d9d9d9] text-[#111827] placeholder:text-[#6c6c6c]"
          />
          {sendingOtp && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#367aff]"></div>
            </div>
          )}
        </div>
        {emailValid && !otpSent && !sendingOtp && (
          <p className="text-xs text-[#6c6c6c]">✓ Valid email - sending verification code...</p>
        )}
        {otpSent && (
          <p className="text-xs text-green-600">✓ Verification code sent to your email!</p>
        )}
      </div>

      {/* Only show OTP field when code has been sent or is being sent */}
      {(otpSent || sendingOtp) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="otp" className="text-[#111827]">
              OTP
            </Label>
            <button
              type="button"
              className="text-xs text-[#367aff] hover:underline disabled:opacity-50"
              aria-label="Resend OTP"
              disabled={sendingOtp}
              onClick={() => {
                if (!email.trim()) {
                  toast({ title: "Email required", description: "Please enter your email address first.", variant: "destructive" })
                  return
                }
                setOtp("")
                setOtpSent(false)
                requestOtp(email)
              }}
            >
              {sendingOtp ? "Sending..." : "Resend Code"}
            </button>
          </div>
          <Input
            id="otp"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="bg-[#ffffff] border-[#d9d9d9] text-[#111827] placeholder:text-[#6c6c6c] text-center text-lg tracking-widest"
            maxLength={6}
          />
          <p className="text-xs text-[#6c6c6c]">Code expires in 10 minutes</p>
          <p className="text-xs text-[#6c6c6c]">
            Don&apos;t see the code? Check your spam folder or{" "}
            <Link href="/sign-up" className="text-[#367aff] hover:underline">
              sign up
            </Link>{" "}
            if you don&apos;t have an account.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox id="stay" checked={staySignedIn} onCheckedChange={(v) => setStaySignedIn(Boolean(v))} />
        <Label htmlFor="stay" className="text-sm text-[#6c6c6c]">
          Keep me signed in?
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#367aff] hover:bg-[#2f6ae0] text-[#ffffff]" 
        disabled={loading || !otpSent || otp.length !== 6}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-sm text-[#6c6c6c]">
        Need an account?{" "}
        <Link href="/sign-up" className="text-[#367aff] hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
