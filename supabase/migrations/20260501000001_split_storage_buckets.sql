/*
 * migration: split storage into per-asset buckets
 * description: Replace the single `mekuannent` storage bucket with per-asset
 *              buckets and re-create RLS policies for each one.
 *
 *              New buckets:
 *                - audios              (audio files; ~200 MB)
 *                - avatars             (user profile pictures; small images)
 *                - article-thumbnails  (article cover images)
 *                - audio-thumbnails    (audio cover images)
 *                - campaign-images     (donation campaign cover images)
 *                - event-images        (event cover images)
 *                - static              (system / seed assets, admin-managed)
 *                - video-thumbnails    (video cover images)
 *                - videos              (video files; ~1 GB)
 *
 *              Policy model:
 *                - All buckets are public-read (so the existing public URLs
 *                  keep working).
 *                - Authenticated users can INSERT / UPDATE / DELETE on every
 *                  bucket EXCEPT `static`, which is restricted to the
 *                  service_role (used by migrations / admin tooling).
 *
 * date: 2026-05-01
 */

-- ============================================================================
-- 1. Drop legacy single-bucket RLS policies (idempotent)
-- ============================================================================

DROP POLICY IF EXISTS "Allow authenticated users to upload to mekuannent bucket"
    ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read from mekuannent bucket"
    ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update in mekuannent bucket"
    ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from mekuannent bucket"
    ON storage.objects;

-- ============================================================================
-- 2. Create the new buckets (idempotent)
-- ============================================================================

-- 2.1 Image buckets (cover / thumbnail) -- 25 MB cap, common image mime types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    (
        'article-thumbnails', 'article-thumbnails', true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']
    ),
    (
        'audio-thumbnails', 'audio-thumbnails', true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']
    ),
    (
        'campaign-images', 'campaign-images', true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']
    ),
    (
        'event-images', 'event-images', true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']
    ),
    (
        'video-thumbnails', 'video-thumbnails', true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']
    )
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2.2 Avatars bucket -- 5 MB cap (small profile pictures)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars', 'avatars', true, 5242880,
    ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/heic','image/heif']
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2.3 Static bucket -- 50 MB cap, mixed mime types (admin / seed managed)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'static', 'static', true, 52428800,
    ARRAY[
        'image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif',
        'application/pdf','text/plain','application/json'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2.4 Audios bucket -- 200 MB cap
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'audios', 'audios', true, 209715200,
    ARRAY[
        'audio/mpeg','audio/mp3','audio/mp4','audio/aac','audio/wav','audio/x-wav',
        'audio/ogg','audio/webm','audio/m4a','audio/x-m4a','audio/flac'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2.5 Videos bucket -- 1 GB cap
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'videos', 'videos', true, 1073741824,
    ARRAY[
        'video/mp4','video/quicktime','video/x-matroska','video/webm',
        'video/3gpp','video/mpeg','video/x-msvideo'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- 3. RLS policies
-- ============================================================================
-- storage.objects already has RLS enabled by default in Supabase.

-- 3.1 Generic public-read for every bucket created above (one consolidated
--     policy per bucket so a future per-bucket revoke is straightforward).

DROP POLICY IF EXISTS "public_read_article_thumbnails" ON storage.objects;
CREATE POLICY "public_read_article_thumbnails"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'article-thumbnails');

DROP POLICY IF EXISTS "public_read_audio_thumbnails" ON storage.objects;
CREATE POLICY "public_read_audio_thumbnails"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'audio-thumbnails');

DROP POLICY IF EXISTS "public_read_campaign_images" ON storage.objects;
CREATE POLICY "public_read_campaign_images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'campaign-images');

DROP POLICY IF EXISTS "public_read_event_images" ON storage.objects;
CREATE POLICY "public_read_event_images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'event-images');

DROP POLICY IF EXISTS "public_read_video_thumbnails" ON storage.objects;
CREATE POLICY "public_read_video_thumbnails"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'video-thumbnails');

DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects;
CREATE POLICY "public_read_avatars"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "public_read_static" ON storage.objects;
CREATE POLICY "public_read_static"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'static');

DROP POLICY IF EXISTS "public_read_audios" ON storage.objects;
CREATE POLICY "public_read_audios"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'audios');

DROP POLICY IF EXISTS "public_read_videos" ON storage.objects;
CREATE POLICY "public_read_videos"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'videos');

-- 3.2 Authenticated write (insert / update / delete) on user-content buckets.

-- article-thumbnails
DROP POLICY IF EXISTS "auth_insert_article_thumbnails" ON storage.objects;
CREATE POLICY "auth_insert_article_thumbnails"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'article-thumbnails');

DROP POLICY IF EXISTS "auth_update_article_thumbnails" ON storage.objects;
CREATE POLICY "auth_update_article_thumbnails"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'article-thumbnails')
    WITH CHECK (bucket_id = 'article-thumbnails');

DROP POLICY IF EXISTS "auth_delete_article_thumbnails" ON storage.objects;
CREATE POLICY "auth_delete_article_thumbnails"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'article-thumbnails');

-- audio-thumbnails
DROP POLICY IF EXISTS "auth_insert_audio_thumbnails" ON storage.objects;
CREATE POLICY "auth_insert_audio_thumbnails"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'audio-thumbnails');

DROP POLICY IF EXISTS "auth_update_audio_thumbnails" ON storage.objects;
CREATE POLICY "auth_update_audio_thumbnails"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'audio-thumbnails')
    WITH CHECK (bucket_id = 'audio-thumbnails');

DROP POLICY IF EXISTS "auth_delete_audio_thumbnails" ON storage.objects;
CREATE POLICY "auth_delete_audio_thumbnails"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'audio-thumbnails');

-- campaign-images
DROP POLICY IF EXISTS "auth_insert_campaign_images" ON storage.objects;
CREATE POLICY "auth_insert_campaign_images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'campaign-images');

DROP POLICY IF EXISTS "auth_update_campaign_images" ON storage.objects;
CREATE POLICY "auth_update_campaign_images"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'campaign-images')
    WITH CHECK (bucket_id = 'campaign-images');

DROP POLICY IF EXISTS "auth_delete_campaign_images" ON storage.objects;
CREATE POLICY "auth_delete_campaign_images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'campaign-images');

-- event-images
DROP POLICY IF EXISTS "auth_insert_event_images" ON storage.objects;
CREATE POLICY "auth_insert_event_images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'event-images');

DROP POLICY IF EXISTS "auth_update_event_images" ON storage.objects;
CREATE POLICY "auth_update_event_images"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'event-images')
    WITH CHECK (bucket_id = 'event-images');

DROP POLICY IF EXISTS "auth_delete_event_images" ON storage.objects;
CREATE POLICY "auth_delete_event_images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'event-images');

-- video-thumbnails
DROP POLICY IF EXISTS "auth_insert_video_thumbnails" ON storage.objects;
CREATE POLICY "auth_insert_video_thumbnails"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'video-thumbnails');

DROP POLICY IF EXISTS "auth_update_video_thumbnails" ON storage.objects;
CREATE POLICY "auth_update_video_thumbnails"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'video-thumbnails')
    WITH CHECK (bucket_id = 'video-thumbnails');

DROP POLICY IF EXISTS "auth_delete_video_thumbnails" ON storage.objects;
CREATE POLICY "auth_delete_video_thumbnails"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'video-thumbnails');

-- avatars
-- (Loose policy: any authenticated user can write anything in this bucket.
--  If you later want per-user ownership, add a check that the object name
--  starts with `auth.uid()::text` or sits in a `<uid>/` folder.)
DROP POLICY IF EXISTS "auth_insert_avatars" ON storage.objects;
CREATE POLICY "auth_insert_avatars"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "auth_update_avatars" ON storage.objects;
CREATE POLICY "auth_update_avatars"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'avatars')
    WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "auth_delete_avatars" ON storage.objects;
CREATE POLICY "auth_delete_avatars"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'avatars');

-- audios
DROP POLICY IF EXISTS "auth_insert_audios" ON storage.objects;
CREATE POLICY "auth_insert_audios"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'audios');

DROP POLICY IF EXISTS "auth_update_audios" ON storage.objects;
CREATE POLICY "auth_update_audios"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'audios')
    WITH CHECK (bucket_id = 'audios');

DROP POLICY IF EXISTS "auth_delete_audios" ON storage.objects;
CREATE POLICY "auth_delete_audios"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'audios');

-- videos
DROP POLICY IF EXISTS "auth_insert_videos" ON storage.objects;
CREATE POLICY "auth_insert_videos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_update_videos" ON storage.objects;
CREATE POLICY "auth_update_videos"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'videos')
    WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "auth_delete_videos" ON storage.objects;
CREATE POLICY "auth_delete_videos"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'videos');

-- 3.3 `static` bucket: public-read only. Writes are restricted to the
--     service_role (no client-side write policy is created).
--     Migrations / dashboard uploads go through service_role automatically.
