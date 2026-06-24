INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'church-images', 'church-images', true, 26214400,
    ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif']
)
ON CONFLICT (id) DO UPDATE SET
    public             = EXCLUDED.public,
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public_read_church_images" ON storage.objects;
CREATE POLICY "public_read_church_images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'church-images');

DROP POLICY IF EXISTS "auth_insert_church_images" ON storage.objects;
CREATE POLICY "auth_insert_church_images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'church-images');

DROP POLICY IF EXISTS "auth_update_church_images" ON storage.objects;
CREATE POLICY "auth_update_church_images"
    ON storage.objects FOR UPDATE TO authenticated
    USING      (bucket_id = 'church-images')
    WITH CHECK (bucket_id = 'church-images');

DROP POLICY IF EXISTS "auth_delete_church_images" ON storage.objects;
CREATE POLICY "auth_delete_church_images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'church-images');
