UPDATE public.audio_content
SET    audio_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/audios/'
                || id::text
                || '/Some%20Nights%20Ringtone.mp3';

UPDATE public.bible_audio
SET    audio_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/audios/'
                || id::text
                || '/Some%20Nights%20Ringtone.mp3';

UPDATE public.video_content
SET    video_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/videos/'
                || id::text
                || '/saas-video1.mp4';

UPDATE public.content_items
SET    thumbnail_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/'
    || CASE content_type
           WHEN 'article' THEN 'article-thumbnails'
           WHEN 'video'   THEN 'video-thumbnails'
           WHEN 'audio'   THEN 'audio-thumbnails'
           ELSE                'static'
       END
    || '/'
    || id::text
    || '/'
    || CASE WHEN substring(id::text from 1 for 1) IN ('0','2','4','6','8','a','c','e')
            THEN 'church-donation.jpeg'
            ELSE 'bole-medhanialem.jpeg'
       END;

UPDATE public.donation_campaigns
SET    cover_image_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/campaign-images/'
    || id::text
    || '/'
    || CASE WHEN substring(id::text from 1 for 1) IN ('0','2','4','6','8','a','c','e')
            THEN 'church-donation.jpeg'
            ELSE 'bole-medhanialem.jpeg'
       END;

UPDATE public.events
SET    cover_image_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/event-images/'
    || id::text
    || '/'
    || CASE WHEN substring(id::text from 1 for 1) IN ('0','2','4','6','8','a','c','e')
            THEN 'church-donation.jpeg'
            ELSE 'bole-medhanialem.jpeg'
       END;

UPDATE public.churches
SET    cover_image_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/'
        || id::text
        || '/cover-'
        || CASE WHEN substring(id::text from 1 for 1) IN ('0','2','4','6','8','a','c','e')
                THEN 'church-donation.jpeg'
                ELSE 'bole-medhanialem.jpeg'
           END,
       logo_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/'
        || id::text
        || '/logo-'
        || CASE WHEN substring(id::text from 2 for 1) IN ('0','2','4','6','8','a','c','e')
                THEN 'church-donation.jpeg'
                ELSE 'bole-medhanialem.jpeg'
           END;

UPDATE public.church_images
SET    image_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/'
    || id::text
    || '/'
    || CASE WHEN substring(id::text from 1 for 1) IN ('0','2','4','6','8','a','c','e')
            THEN 'church-donation.jpeg'
            ELSE 'bole-medhanialem.jpeg'
       END;

UPDATE public.story_content
SET    media_url = CASE
    WHEN media_type = 'video' THEN
        'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/videos/'
        || id::text
        || '/saas-video1.mp4'
    ELSE
        'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/'
        || id::text
        || '/'
        || CASE WHEN substring(id::text from 1 for 1) IN ('0','2','4','6','8','a','c','e')
                THEN 'church-donation.jpeg'
                ELSE 'bole-medhanialem.jpeg'
           END
END;

UPDATE public.payment_gateways
SET    icon_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/'
    || id::text
    || '/'
    || CASE WHEN substring(id::text from 1 for 1) IN ('0','2','4','6','8','a','c','e')
            THEN 'church-donation.jpeg'
            ELSE 'bole-medhanialem.jpeg'
       END
WHERE  icon_url IS NOT NULL;

UPDATE public.rooms
SET    recording_url = 'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/audios/'
                    || id::text
                    || '/Some%20Nights%20Ringtone.mp3'
WHERE  recording_url IS NOT NULL;
