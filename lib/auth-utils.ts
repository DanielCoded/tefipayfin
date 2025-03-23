"use client"

import { createClient } from "@/lib/supabase-browser"
import { redirect } from "next/navigation"

// Check if user is authenticated and redirect if not
export async function requireAuth() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}

// Check if user is authenticated and redirect to dashboard if they are
export async function redirectIfAuthenticated() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/admin/dashboard")
  }
}

