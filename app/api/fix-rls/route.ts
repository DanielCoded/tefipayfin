import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Missing Supabase environment variables for admin operations")
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    // SQL to fix RLS policies
    const fixRLSQuery = `
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Allow public inserts to waitlist" ON public.waitlist;
      DROP POLICY IF EXISTS "Allow authenticated to select from waitlist" ON public.waitlist;
      DROP POLICY IF EXISTS "Allow anyone to insert to waitlist" ON public.waitlist;
      DROP POLICY IF EXISTS "Allow anyone to select from waitlist" ON public.waitlist;
      
      -- Create new policies with correct permissions
      CREATE POLICY "Allow anyone to insert to waitlist" 
        ON public.waitlist 
        FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);
      
      CREATE POLICY "Allow authenticated to select from waitlist" 
        ON public.waitlist 
        FOR SELECT 
        TO authenticated 
        USING (true);
        
      -- Drop existing policies for contact_submissions if they exist
      DROP POLICY IF EXISTS "Allow anyone to insert to contact_submissions" ON public.contact_submissions;
      DROP POLICY IF EXISTS "Allow authenticated to select from contact_submissions" ON public.contact_submissions;
      
      -- Create new policies for contact_submissions
      CREATE POLICY "Allow anyone to insert to contact_submissions" 
        ON public.contact_submissions 
        FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);
      
      CREATE POLICY "Allow authenticated to select from contact_submissions" 
        ON public.contact_submissions 
        FOR SELECT 
        TO authenticated 
        USING (true);
        
      -- Drop existing policies for blog_posts if they exist
      DROP POLICY IF EXISTS "Allow anyone to view published blog posts" ON public.blog_posts;
      DROP POLICY IF EXISTS "Allow authenticated users to manage blog posts" ON public.blog_posts;
      
      -- Create new policies for blog_posts
      CREATE POLICY "Allow anyone to view published blog posts" 
        ON public.blog_posts 
        FOR SELECT 
        TO anon, authenticated 
        USING (published = true);
      
      CREATE POLICY "Allow authenticated users to manage blog posts" 
        ON public.blog_posts 
        FOR ALL 
        TO authenticated 
        USING (true);
    `

    // Execute the SQL directly if possible
    const { error } = await supabaseAdmin.rpc("exec_sql", { query: fixRLSQuery }).catch(() => {
      return { error: new Error("Failed to execute SQL directly") }
    })

    if (error) {
      // If direct execution fails, we'll provide instructions
      return NextResponse.json({
        success: false,
        message: "Could not automatically fix RLS policies. Please run the SQL manually in your Supabase SQL Editor.",
        sql: fixRLSQuery,
      })
    }

    return NextResponse.json({
      success: true,
      message:
        "RLS policies have been fixed successfully! All authenticated admins now have access to waitlist entries, contact submissions, and blog management.",
    })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please run the SQL manually in your Supabase SQL Editor.",
      },
      { status: 500 },
    )
  }
}

