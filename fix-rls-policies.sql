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

