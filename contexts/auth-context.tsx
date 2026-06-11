"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

// Shape of the user object consumed around the app (checkout, navbar, etc.)
export interface User {
  id?: string
  email: string
  name: string
  picture?: string
  isAuthenticated: boolean
  isVerified: boolean
}

// Shape the account page expects (firstName / lastName / phone)
export interface Customer {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  customer: Customer | null
  isLoading: boolean
  loading: boolean // alias used by some pages
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone?: string,
  ) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>
  logout: () => void
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  resendVerificationCode: (email: string) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Build our app-facing User object from a Supabase user/session.
function mapUser(supabaseUser: SupabaseUser | null | undefined): User | null {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata || {}
  const fullName =
    meta.full_name ||
    [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
    supabaseUser.email ||
    ""
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: fullName,
    picture: meta.avatar_url || meta.picture,
    isAuthenticated: true,
    // Supabase sets email_confirmed_at once the email is verified.
    isVerified: Boolean(supabaseUser.email_confirmed_at || supabaseUser.confirmed_at),
  }
}

function mapCustomer(supabaseUser: SupabaseUser | null | undefined): Customer | null {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata || {}
  let firstName = meta.first_name || ""
  let lastName = meta.last_name || ""
  if (!firstName && meta.full_name) {
    const parts = String(meta.full_name).trim().split(" ")
    firstName = parts[0] || ""
    lastName = parts.slice(1).join(" ")
  }
  return {
    id: supabaseUser.id,
    firstName,
    lastName,
    email: supabaseUser.email || "",
    phone: meta.phone || "",
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load the current session on mount and subscribe to auth changes.
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const supabaseUser = session?.user ?? null
  // A verified, signed-in user has both a session and a confirmed email.
  const isVerified = Boolean(supabaseUser?.email_confirmed_at || supabaseUser?.confirmed_at)
  const user = isVerified ? mapUser(supabaseUser) : null
  const customer = isVerified ? mapCustomer(supabaseUser) : null

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      const message =
        signInError.message === "Email not confirmed"
          ? "Please verify your email address before logging in."
          : signInError.message || "Failed to login"
      setError(message)
      return { success: false, error: message }
    }

    return { success: true }
  }

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone?: string,
  ): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    setError(null)

    // Create the account server-side, already confirmed (no email verification).
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email: email.trim(), password, phone }),
    })
    const result = await res.json().catch(() => ({}))

    if (!res.ok || !result.success) {
      const message = result.error || "Failed to sign up"
      setError(message)
      return { success: false, error: message }
    }

    // Log them straight in — the account is ready to use immediately.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      const message = "Account created — please log in."
      setError(message)
      return { success: false, error: message }
    }

    return { success: true, needsVerification: false }
  }

  const verifyEmail = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "signup",
    })

    if (verifyError) {
      const message = verifyError.message || "Failed to verify email"
      setError(message)
      return { success: false, error: message }
    }

    // onAuthStateChange will pick up the new session automatically.
    return { success: true }
  }

  const resendVerificationCode = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    })

    if (resendError) {
      const message = resendError.message || "Failed to resend verification code"
      setError(message)
      return { success: false, error: message }
    }

    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.push("/")
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo:
        typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    })

    if (resetError) {
      const message = resetError.message || "Failed to process password reset"
      setError(message)
      return { success: false, error: message }
    }

    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        isLoading,
        loading: isLoading,
        error,
        login,
        signup,
        logout,
        forgotPassword,
        verifyEmail,
        resendVerificationCode,
        isAuthenticated: isVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
