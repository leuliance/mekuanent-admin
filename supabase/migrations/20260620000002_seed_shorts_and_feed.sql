/*
 * Migration: seed shorts + feed support
 * Description: Reclassifies a subset of existing short-duration videos as
 *              `short` content, and documents that get_teachings_feed already
 *              supports p_content_type = 'short' (it filters on
 *              content_items.content_type::text, so no body change is needed).
 *
 *              Heuristic for the data move: any approved video whose
 *              video_content.duration_seconds is <= 60s becomes a short.
 *              Adjust the threshold / id list below before running if you want
 *              a different selection.
 *
 *              Rollback (manual):
 *                UPDATE public.content_items ci
 *                SET content_type = 'video'
 *                FROM public.video_content vc
 *                WHERE vc.id = ci.id
 *                  AND ci.content_type = 'short';
 *
 * date: 2026-06-20
 */

-- ---------------------------------------------------------------------
-- 1. Reclassify short-duration videos as shorts.
--    Only touches rows currently typed 'video' that have a video_content
--    child with a known, short duration. Idempotent (re-running is a no-op
--    because matched rows are no longer 'video').
-- ---------------------------------------------------------------------
UPDATE public.content_items AS ci
SET content_type = 'short'
FROM public.video_content AS vc
WHERE vc.id = ci.id
  AND ci.content_type = 'video'
  AND vc.duration_seconds IS NOT NULL
  AND vc.duration_seconds <= 60;

-- ---------------------------------------------------------------------
-- 2. get_teachings_feed already accepts arbitrary content_type strings via
--    `ci.content_type::text = p_content_type`, so passing 'short' works with
--    no body change. Refresh the doc comment to reflect the new value.
-- ---------------------------------------------------------------------
COMMENT ON FUNCTION public.get_teachings_feed IS
    'Powers the post-style Teachings feed. Pass content_type (audio | video | short | article | story) / topic_slug / saved_only to filter. Returns enriched rows with church, topic chips, save/like flags. Shorts reuse the video_* columns.';

-- ---------------------------------------------------------------------
-- 3. RLS: nothing to add for shorts.
--    Shorts are ordinary rows in public.content_items (content_type =
--    'short') with a child row in public.video_content. Every existing
--    policy on those tables (see 20241201000006_create_rls_policies.sql)
--    is content_type-AGNOSTIC — they gate on status = 'approved',
--    created_by = auth.uid(), and is_content_admin/is_content_creator per
--    church. So shorts automatically inherit the exact same read/write
--    rules as videos; no new policies are required.
-- ---------------------------------------------------------------------
