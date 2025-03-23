"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Printer, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminWaitlistPage() {
  const [waitlistEntries, setWaitlistEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isMounted = useRef(true)

  // Use a single supabase instance
  const supabase = createClient()

  useEffect(() => {
    // Set up the cleanup function first
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch waitlist entries
        const { data, error } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false })

        if (error) {
          if (error.code === "42P01") {
            // Table doesn't exist
            if (isMounted.current) {
              setError("The waitlist table doesn't exist yet. You need to set up the database first.")
              setIsLoading(false)
            }
            return
          }

          throw error
        }

        if (isMounted.current) {
          setWaitlistEntries(data || [])
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error fetching waitlist entries:", err)
        if (isMounted.current) {
          setError("Failed to load waitlist entries. Please try again.")
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [router])

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Waitlist Entries</h1>
          <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800">
            ← Back to dashboard
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <Link href="/admin/setup">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Go to Setup Page</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Waitlist Entries</h1>
        <div className="flex gap-4">
          <Button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print Waitlist
          </Button>
          <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800 print:hidden">
            ← Back to dashboard
          </Link>
        </div>
      </div>

      {waitlistEntries.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg print:shadow-none">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {waitlistEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500">No waitlist entries yet.</p>
        </div>
      )}
    </div>
  )
}

