"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, Users, MessageSquare, FileText, Database, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    waitlistCount: 0,
    contactCount: 0,
    blogCount: 0,
  })
  const router = useRouter()
  const isMounted = useRef(true)
  const supabase = createClient()

  useEffect(() => {
    // Set up the cleanup function first
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // If not authenticated, redirect to login
          if (isMounted.current) {
            router.push("/admin/login")
          }
          return
        }

        // User is authenticated, fetch dashboard data
        if (isMounted.current) {
          await fetchDashboardData()
        }
      } catch (err) {
        console.error("Error checking session:", err)
        if (isMounted.current) {
          setError("Failed to verify authentication. Please try logging in again.")
          setIsLoading(false)
        }
      }
    }

    checkSessionAndFetchData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch counts for various tables
      const [waitlistResult, contactResult, blogResult] = await Promise.all([
        supabase.from("waitlist").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      ])

      if (isMounted.current) {
        setStats({
          waitlistCount: waitlistResult.count || 0,
          contactCount: contactResult.count || 0,
          blogCount: blogResult.count || 0,
        })
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      if (isMounted.current) {
        setError("Failed to load dashboard data. Please try again.")
        setIsLoading(false)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error signing out:", error)
      alert("Failed to sign out. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <div className="mt-4 flex gap-4">
            <button onClick={fetchDashboardData} className="text-sm font-medium text-red-700 underline">
              Try again
            </button>
            <button onClick={handleSignOut} className="text-sm font-medium text-red-700 underline">
              Sign out and log in again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/waitlist"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col"
        >
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Waitlist Entries</h2>
          </div>
          <p className="text-3xl font-bold text-indigo-600 my-4">{stats.waitlistCount}</p>
          <p className="text-gray-600 mt-auto">View and manage waitlist sign-ups</p>
        </Link>

        <Link
          href="/admin/contact-submissions"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Contact Submissions</h2>
          </div>
          <p className="text-3xl font-bold text-indigo-600 my-4">{stats.contactCount}</p>
          <p className="text-gray-600 mt-auto">View and manage contact form submissions</p>
        </Link>

        <Link
          href="/admin/blog"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col"
        >
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Blog Posts</h2>
          </div>
          <p className="text-3xl font-bold text-indigo-600 my-4">{stats.blogCount}</p>
          <p className="text-gray-600 mt-auto">Manage blog posts and articles</p>
        </Link>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-indigo-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/blog/new"
            className="bg-white border border-indigo-200 rounded-md p-4 hover:bg-indigo-50 transition-colors flex items-center"
          >
            <FileText className="w-5 h-5 text-indigo-600 mr-3" />
            <div>
              <h3 className="font-medium text-indigo-700">Create New Blog Post</h3>
              <p className="text-sm text-gray-600 mt-1">Write and publish a new article</p>
            </div>
          </Link>

          <Link
            href="/admin/setup"
            className="bg-white border border-indigo-200 rounded-md p-4 hover:bg-indigo-50 transition-colors flex items-center"
          >
            <Database className="w-5 h-5 text-indigo-600 mr-3" />
            <div>
              <h3 className="font-medium text-indigo-700">Database Setup</h3>
              <p className="text-sm text-gray-600 mt-1">Set up or reset database tables</p>
            </div>
          </Link>

          <Link
            href="/admin/fix-rls"
            className="bg-white border border-indigo-200 rounded-md p-4 hover:bg-indigo-50 transition-colors flex items-center"
          >
            <Shield className="w-5 h-5 text-indigo-600 mr-3" />
            <div>
              <h3 className="font-medium text-indigo-700">Fix RLS Policies</h3>
              <p className="text-sm text-gray-600 mt-1">Repair Row Level Security settings</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Information</h2>
        <p className="text-gray-600 mb-4">
          Welcome to the TefiPay admin dashboard. From here, you can manage waitlist entries, contact form submissions,
          and blog posts. Use the cards above to navigate to different sections.
        </p>
        <p className="text-gray-600">
          If you encounter any issues with database access, use the "Fix RLS Policies" option to repair Row Level
          Security settings.
        </p>
      </div>
    </div>
  )
}

