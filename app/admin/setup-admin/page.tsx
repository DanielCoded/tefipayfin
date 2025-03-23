"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function SetupAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        setSuccess(true)
        setEmail("")
        setPassword("")
      }
    } catch (error: any) {
      console.error("Error creating admin user:", error)
      setError(error.message || "An error occurred during admin setup")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Setup Admin User</h2>
          <p className="mt-2 text-white/60">Create an admin account to manage your site</p>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-lg">{error}</div>}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-4 rounded-lg">
            <p>Admin user created successfully!</p>
            <p className="text-sm mt-2">Please check your email to confirm your account before logging in.</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.07] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.07] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="••••••••"
            />
            <p className="text-xs text-white/50 mt-1">Password must be at least 6 characters long</p>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating user...
                </span>
              ) : (
                "Create Admin User"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-indigo-400 hover:text-indigo-300 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

