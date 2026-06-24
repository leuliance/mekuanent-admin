/*
 * migration: fix storage bucket RLS policies
 * description: Add RLS policies for mekuannent storage bucket to allow authenticated users to upload images
 * author: system
 * date: 2025-01-06
 * 
 * Note: This migration should be run with appropriate permissions.
 * If running locally: Make sure you have supabase started with proper permissions
 * If running on hosted Supabase: This will work automatically
 */

-- ============================================================================
-- Storage bucket RLS policies
-- ============================================================================

-- Ensure the mekuannent bucket exists and is public first
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('mekuannent', 'mekuannent', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload to mekuannent bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read from mekuannent bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update in mekuannent bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from mekuannent bucket" ON storage.objects;

-- Allow authenticated users to upload files to any folder in mekuannent bucket
-- Supports: campaign-images, church-images, event-images, profile-images, etc.
CREATE POLICY "Allow authenticated users to upload to mekuannent bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mekuannent');

-- Allow everyone (public and authenticated) to read files from mekuannent bucket
CREATE POLICY "Allow public to read from mekuannent bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'mekuannent');

-- Allow authenticated users to update their files in mekuannent bucket
CREATE POLICY "Allow authenticated users to update in mekuannent bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'mekuannent')
WITH CHECK (bucket_id = 'mekuannent');

-- Allow authenticated users to delete files from mekuannent bucket
CREATE POLICY "Allow authenticated users to delete from mekuannent bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'mekuannent');

