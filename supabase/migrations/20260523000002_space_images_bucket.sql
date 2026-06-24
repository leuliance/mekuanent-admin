/*
 * migration: add `space-images` storage bucket
 * description: Spaces (live audio rooms) need their own bucket for cover
 *              images so we can apply per-asset RLS, file-size caps, and
 *              cleanup policies independently from event-images and the
 *              other content-thumbnail buckets.
 *
 *              Mirrors the policy model used by every other image bucket
 *              created in 20260501000001_split_storage_buckets.sql:
 *                - public-read (so the cover URL works without auth)
 *                - authenticated-write (insert / update / delete)
 *                - 25 MB cap, common image mime types
 *
 * date: 2026-05-23
 */

-- ============================================================================
-- 1. Create the bucket (idempotent)
-- ============================================================================
INSERT INTO storage.buckets (
    id, name, public, file_size_limit, allowed_mime_types
)
VALUES (
    'space-images',
    'space-images',
    true,
    26214400,
    ARRAY[
        'image/png','image/jpeg','image/jpg','image/webp',
        'image/gif','image/heic','image/heif'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- 2. RLS policies
-- ============================================================================

-- 2.1 Public read — cover URLs render in feeds without an auth token.
DROP POLICY IF EXISTS "public_read_space_images" ON storage.objects;
CREATE POLICY "public_read_space_images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'space-images');

-- 2.2 Authenticated write — any signed-in user can upload a cover; the
--     `hms-spaces` edge function enforces who is actually allowed to
--     CREATE a space (church_admin / content_admin / content_creator).
--     If a user uploads a cover but never finishes creating the space,
--     `useFocusEffect` in `create-space.tsx` deletes the orphaned file
--     on unmount.
DROP POLICY IF EXISTS "auth_insert_space_images" ON storage.objects;
CREATE POLICY "auth_insert_space_images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'space-images');

DROP POLICY IF EXISTS "auth_update_space_images" ON storage.objects;
CREATE POLICY "auth_update_space_images"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'space-images')
    WITH CHECK (bucket_id = 'space-images');

DROP POLICY IF EXISTS "auth_delete_space_images" ON storage.objects;
CREATE POLICY "auth_delete_space_images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'space-images');
