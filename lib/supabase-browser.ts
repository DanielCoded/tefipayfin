"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a custom Supabase client with session timeout configuration
export const createClient = () => {
  return createClientComponentClient({
    options: {
      auth: {
        // Set session timeout to 2 hours (7200 seconds)
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  })
}

