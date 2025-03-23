"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { SessionTimeout } from "@/components/session-timeout"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"
import { LogOut, Home, Users, MessageSquare, FileText } from "lucide-react"
import Image from "next/image"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/setup-admin"
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const isMounted = useRef(true)
  const supabase = createClient()

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (isLoginPage) return

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user && isMounted.current) {
        setUserEmail(session.user.email)
      }
    }

    checkAuth()
  }, [isLoginPage])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <Image src="/favicon.png" alt="TefiPay Logo" width={32} height={32} className="rounded-md mr-2" />
                <span className="font-semibold text-gray-900">TefiPay Admin</span>
              </Link>

              <nav className="ml-8 hidden md:flex space-x-4">
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/dashboard"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Home className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/waitlist"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/waitlist"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-4 h-4 mr-1" />
                  Waitlist
                </Link>
                <Link
                  href="/admin/contact-submissions"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/contact-submissions"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact
                </Link>
                <Link
                  href="/admin/blog"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith("/admin/blog")
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Blog
                </Link>
              </nav>
            </div>

            <div className="flex items-center">
              {userEmail && <span className="text-sm text-gray-600 mr-4 hidden md:inline">{userEmail}</span>}
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <SessionTimeout />
    </div>
  )
}

