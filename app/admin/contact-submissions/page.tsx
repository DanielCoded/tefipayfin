"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Printer, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ContactSubmissionsPage() {
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([])
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

        // Fetch contact submissions
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          if (error.code === "42P01") {
            // Table doesn't exist
            if (isMounted.current) {
              setError("The contact_submissions table doesn't exist yet. You need to set up the database first.")
              setIsLoading(false)
            }
            return
          }

          throw error
        }

        if (isMounted.current) {
          setContactSubmissions(data || [])
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error fetching contact submissions:", err)
        if (isMounted.current) {
          setError("Failed to load contact submissions. Please try again.")
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
          <h1 className="text-2xl font-bold">Contact Form Submissions</h1>
          <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800">
            ← Back to dashboard
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        {error.includes("table doesn't exist") && (
          <div className="bg-gray-50 p-4 rounded-md overflow-x-auto mb-4">
            <pre className="text-sm text-gray-800">
              {`-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
email TEXT NOT NULL,
subject TEXT NOT NULL,
message TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting (anyone can insert)
CREATE POLICY "Allow anyone to insert to contact_submissions" 
ON public.contact_submissions 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Create policy for selecting (only authenticated users can view)
CREATE POLICY "Allow authenticated to select from contact_submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated 
USING (true);`}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Form Submissions</h1>
        <div className="flex gap-4">
          <Button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print Submissions
          </Button>
          <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800 print:hidden">
            ← Back to dashboard
          </Link>
        </div>
      </div>

      {contactSubmissions.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg print:shadow-none">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(submission.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:hidden">
                    <details className="cursor-pointer">
                      <summary className="text-indigo-600 hover:text-indigo-800">View Message</summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="whitespace-pre-wrap">{submission.message}</p>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Print-only message details */}
          <div className="hidden print:block mt-8">
            <h2 className="text-xl font-bold mb-4">Message Details</h2>
            {contactSubmissions.map((submission) => (
              <div key={`print-${submission.id}`} className="mb-8 pb-8 border-b">
                <h3 className="font-bold">{submission.subject}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  From: {submission.name} ({submission.email}) - {new Date(submission.created_at).toLocaleString()}
                </p>
                <p className="whitespace-pre-wrap">{submission.message}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500">No contact form submissions yet.</p>
        </div>
      )}
    </div>
  )
}

