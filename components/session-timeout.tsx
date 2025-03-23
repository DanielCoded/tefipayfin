"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SessionTimeout() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMounted = useRef(true)
  const supabase = createClient()

  useEffect(() => {
    return () => {
      isMounted.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Check authentication status once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (isMounted.current) {
          setIsAuthenticated(!!session)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        if (isMounted.current) {
          setIsAuthenticated(false)
        }
      }
    }

    checkAuth()
  }, [])

  // Only set up the session expiry check if authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    const checkSessionExpiry = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          if (isMounted.current) {
            setShowWarning(false)
          }
          return
        }

        const expiresAt = session.expires_at
        if (expiresAt) {
          const now = Math.floor(Date.now() / 1000)
          const timeRemaining = expiresAt - now

          if (timeRemaining < 300 && isMounted.current) {
            setTimeLeft(timeRemaining)
            setShowWarning(true)
          } else if (isMounted.current) {
            setShowWarning(false)
          }
        }
      } catch (error) {
        console.error("Error checking session expiry:", error)
        if (isMounted.current) {
          setShowWarning(false)
        }
      }
    }

    // Initial check
    checkSessionExpiry()

    // Set up interval
    intervalRef.current = setInterval(checkSessionExpiry, 60000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAuthenticated])

  const extendSession = async () => {
    try {
      await supabase.auth.refreshSession()
      if (isMounted.current) {
        setShowWarning(false)
      }
    } catch (error) {
      console.error("Error extending session:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!showWarning || !timeLeft || !isAuthenticated) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-lg z-50 max-w-md">
      <h3 className="font-medium text-yellow-800 mb-2">Session Expiring Soon</h3>
      <p className="text-yellow-700 mb-3">
        Your session will expire in approximately {Math.floor(timeLeft / 60)} minutes. You will be logged out
        automatically.
      </p>
      <div className="flex gap-3">
        <Button onClick={extendSession} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Extend Session
        </Button>
        <Button onClick={handleLogout} className="bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-50">
          Log Out Now
        </Button>
      </div>
    </div>
  )
}

