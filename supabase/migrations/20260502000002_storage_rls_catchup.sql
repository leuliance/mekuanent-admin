/*
 * migration: storage RLS catch-up
 * description: Idempotently re-apply storage RLS so every bucket the app uses
 *              accepts authenticated INSERT / UPDATE / DELETE. Drops the
 *              legacy `mekuannent` bucket policies, ensures every per-asset
 *              bucket exists with sane limits + mime types, and creates one
 *              consolidated public-read + authenticated-write policy per
 *              bucket. Safe to run multiple times.
 *
 *              Use this if you've previously seen
 *              `403 Unauthorized: new row violates row-level security policy`
 *              on a video-thumbnails / event-images / campaign-images upload.
 *
 * date: 2026-05-02
 */

-- ============================================================================
-- 1. Make sure every bucket the app references actually exists.
-- ============================================================================

-- Image-style buckets (25 MB cap, common image MIME types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('article-thumbnails', 'article-thumbnails', true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']),
    ('audio-thumbnails',   'audio-thumbnails',   true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']),
    ('campaign-images',    'campaign-images',    true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']),
    ('church-images',      'church-images',      true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']),
    ('event-images',       'event-images',       true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']),
    ('video-thumbnails',   'video-thumbnails',   true, 26214400,
        ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif'])
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars', 'avatars', true, 5242880,
    ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/heic','image/heif']
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'static', 'static', true, 52428800,
    ARRAY[
        'image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif',
        'application/pdf','text/plain','application/json',
        'audio/mpeg','audio/mp3','audio/mp4','audio/wav','audio/m4a',
        'video/mp4','video/quicktime','video/webm'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

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
-- 2. Drop legacy `mekuannent` policies so they don't shadow the new ones.
-- ============================================================================

DROP POLICY IF EXISTS "Allow authenticated users to upload to mekuannent bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read from mekuannent bucket"               ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update in mekuannent bucket"  ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from mekuannent bucket" ON storage.objects;

-- ============================================================================
-- 3. One consolidated set of policies per app bucket.
--
--    `static` is the only exception — it's read-only for clients; writes go
--    through the dashboard / migrations as service_role.
-- ============================================================================

DO $$
DECLARE
    b text;
    write_buckets text[] := ARRAY[
        'article-thumbnails',
        'audio-thumbnails',
        'audios',
        'avatars',
        'campaign-images',
        'church-images',
        'event-images',
        'video-thumbnails',
        'videos'
    ];
    read_buckets text[] := write_buckets || ARRAY['static'];
BEGIN
    -- 3.1 Public-read for every bucket (including `static`).
    FOREACH b IN ARRAY read_buckets LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON storage.objects',
            'public_read_' || replace(b, '-', '_')
        );
        EXECUTE format(
            $f$CREATE POLICY %I ON storage.objects FOR SELECT TO public USING (bucket_id = %L)$f$,
            'public_read_' || replace(b, '-', '_'),
            b
        );
    END LOOP;

    -- 3.2 Authenticated INSERT / UPDATE / DELETE for every writable bucket.
    FOREACH b IN ARRAY write_buckets LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON storage.objects',
            'auth_insert_' || replace(b, '-', '_')
        );
        EXECUTE format(
            $f$CREATE POLICY %I ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = %L)$f$,
            'auth_insert_' || replace(b, '-', '_'),
            b
        );

        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON storage.objects',
            'auth_update_' || replace(b, '-', '_')
        );
        EXECUTE format(
            $f$CREATE POLICY %I ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = %L) WITH CHECK (bucket_id = %L)$f$,
            'auth_update_' || replace(b, '-', '_'),
            b,
            b
        );

        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON storage.objects',
            'auth_delete_' || replace(b, '-', '_')
        );
        EXECUTE format(
            $f$CREATE POLICY %I ON storage.objects FOR DELETE TO authenticated USING (bucket_id = %L)$f$,
            'auth_delete_' || replace(b, '-', '_'),
            b
        );
    END LOOP;
END
$$;

-- ============================================================================
-- 4. Sanity check (no-op on hosted Supabase)
--
--    On Supabase Cloud, `storage.objects` is owned by the
--    `supabase_storage_admin` role, so a regular SQL editor session can't
--    `ALTER TABLE … ENABLE ROW LEVEL SECURITY` on it (Postgres rejects with
--    `42501 must be owner of table objects`). RLS is *already* enabled on
--    `storage.objects` for every Supabase project — there is nothing to do
--    here. Self-hosted users with a superuser role can run the line below
--    manually if their fork doesn't have RLS enabled by default.
--
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
