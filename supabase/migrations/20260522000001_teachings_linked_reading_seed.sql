-- =====================================================================
-- Seed: Linked Reading + Transcripts + Lessons + Subtitles
-- =====================================================================
-- Purpose:
--   • Populates the `linked_bible_reference` column on every approved
--     audio + video teaching so the navy "LINKED READING" card on the
--     audio / video detail pages always has a passage to deep-link into
--     the in-app Bible reader.
--   • Sprinkles in an example transcript for any audio teaching that
--     has none — so the "Follow along" block isn't permanently empty.
--   • Sprinkles in a 3-part course outline for any video teaching that
--     has none — so the "COURSE OUTLINE" card always has something to
--     render.
--   • Fills in `content_items.subtitle` for audio teachings that have
--     an artist or album so the hero shows "Artist · Album" out of the
--     box.
--
-- Re-run safety:
--   The script is idempotent. It only writes to rows whose target
--   column is NULL/empty or whose child tables are empty for that
--   parent. Re-running won't duplicate or overwrite curated content.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. LINKED BIBLE REFERENCES
-- ---------------------------------------------------------------------
-- Heuristic: match keywords in the teaching's title to a sensible
-- default passage. Anything that doesn't match falls back to
-- "Matthew 5:1-12" (the Beatitudes) which is broadly applicable.
--
-- This UPDATE only touches rows where `linked_bible_reference` is
-- currently NULL so curated values stay intact.
WITH guesses AS (
    SELECT
        ci.id,
        CASE
            WHEN ci.title ILIKE '%fasting%'        THEN 'Matthew 6:16-18'
            WHEN ci.title ILIKE '%prayer%'         THEN 'Matthew 6:5-15'
            WHEN ci.title ILIKE '%psalm%'          THEN 'Psalms 23:1-6'
            WHEN ci.title ILIKE '%mercy%'          THEN 'Matthew 5:7'
            WHEN ci.title ILIKE '%forgive%'        THEN 'Matthew 18:21-22'
            WHEN ci.title ILIKE '%love%'           THEN '1 Corinthians 13:4-7'
            WHEN ci.title ILIKE '%hope%'           THEN 'Romans 12:12'
            WHEN ci.title ILIKE '%faith%'          THEN 'Hebrews 11:1'
            WHEN ci.title ILIKE '%samaritan%'      THEN 'Luke 10:25-37'
            WHEN ci.title ILIKE '%shepherd%'       THEN 'John 10:11-16'
            WHEN ci.title ILIKE '%baptism%'        THEN 'Matthew 3:13-17'
            WHEN ci.title ILIKE '%communion%'      THEN '1 Corinthians 11:23-26'
            WHEN ci.title ILIKE '%liturgy%'        THEN 'Romans 12:1'
            WHEN ci.title ILIKE '%trinity%'        THEN 'Matthew 28:19'
            WHEN ci.title ILIKE '%cross%'          THEN 'Galatians 2:20'
            WHEN ci.title ILIKE '%resurrection%'   THEN '1 Corinthians 15:20-22'
            WHEN ci.title ILIKE '%peace%'          THEN 'Philippians 4:6-7'
            WHEN ci.title ILIKE '%joy%'            THEN 'Nehemiah 8:10'
            WHEN ci.title ILIKE '%humility%'       THEN 'Philippians 2:3-8'
            WHEN ci.title ILIKE '%wisdom%'         THEN 'Proverbs 9:10'
            ELSE 'Matthew 5:1-12'
        END AS reference
    FROM public.content_items ci
    WHERE ci.status = 'approved'
)
UPDATE public.audio_content ac
   SET linked_bible_reference = g.reference
  FROM guesses g
 WHERE g.id = ac.id
   AND (ac.linked_bible_reference IS NULL
        OR length(btrim(ac.linked_bible_reference)) = 0);

WITH guesses AS (
    SELECT
        ci.id,
        CASE
            WHEN ci.title ILIKE '%fasting%'        THEN 'Matthew 6:16-18'
            WHEN ci.title ILIKE '%prayer%'         THEN 'Matthew 6:5-15'
            WHEN ci.title ILIKE '%psalm%'          THEN 'Psalms 23:1-6'
            WHEN ci.title ILIKE '%mercy%'          THEN 'Matthew 9:13'
            WHEN ci.title ILIKE '%forgive%'        THEN 'Matthew 18:21-22'
            WHEN ci.title ILIKE '%love%'           THEN '1 Corinthians 13:4-7'
            WHEN ci.title ILIKE '%hope%'           THEN 'Romans 12:12'
            WHEN ci.title ILIKE '%faith%'          THEN 'Hebrews 11:1'
            WHEN ci.title ILIKE '%samaritan%'      THEN 'Luke 10:25-37'
            WHEN ci.title ILIKE '%shepherd%'       THEN 'John 10:11-16'
            WHEN ci.title ILIKE '%baptism%'        THEN 'Matthew 3:13-17'
            WHEN ci.title ILIKE '%communion%'      THEN '1 Corinthians 11:23-26'
            WHEN ci.title ILIKE '%liturgy%'        THEN 'Romans 12:1'
            WHEN ci.title ILIKE '%trinity%'        THEN 'Matthew 28:19'
            WHEN ci.title ILIKE '%cross%'          THEN 'Galatians 2:20'
            WHEN ci.title ILIKE '%resurrection%'   THEN '1 Corinthians 15:20-22'
            WHEN ci.title ILIKE '%peace%'          THEN 'Philippians 4:6-7'
            WHEN ci.title ILIKE '%joy%'            THEN 'Nehemiah 8:10'
            WHEN ci.title ILIKE '%humility%'       THEN 'Philippians 2:3-8'
            WHEN ci.title ILIKE '%wisdom%'         THEN 'Proverbs 9:10'
            ELSE 'Matthew 5:1-12'
        END AS reference
    FROM public.content_items ci
    WHERE ci.status = 'approved'
)
UPDATE public.video_content vc
   SET linked_bible_reference = g.reference
  FROM guesses g
 WHERE g.id = vc.id
   AND (vc.linked_bible_reference IS NULL
        OR length(btrim(vc.linked_bible_reference)) = 0);


-- ---------------------------------------------------------------------
-- 2. SUBTITLE FOR AUDIO ("Artist · Album")
-- ---------------------------------------------------------------------
-- The audio detail hero shows "Fr. Kidane · Sunday Worship" under the
-- title. If `content_items.subtitle` is empty we synthesise one from
-- the audio_content's artist + album.
UPDATE public.content_items ci
   SET subtitle = trim(both ' · ' from concat_ws(
           ' · ',
           NULLIF(btrim(ac.artist_name), ''),
           NULLIF(btrim(ac.album_name),  '')
       ))
  FROM public.audio_content ac
 WHERE ac.id = ci.id
   AND ci.content_type = 'audio'
   AND (ci.subtitle IS NULL OR length(btrim(ci.subtitle)) = 0)
   AND (
       COALESCE(btrim(ac.artist_name), '') <> '' OR
       COALESCE(btrim(ac.album_name),  '') <> ''
   );


-- ---------------------------------------------------------------------
-- 3. SAMPLE AUDIO TRANSCRIPTS (for any audio with none)
-- ---------------------------------------------------------------------
-- Inserts a tiny 4-line follow-along block so the audio detail page
-- never feels empty. Only fires for audio_content rows that have no
-- transcript at all.
INSERT INTO public.audio_transcripts
    (audio_content_id, start_seconds, end_seconds, text, language, sort_order)
SELECT  ac.id,                0,    18,
        'The quiet hour is not empty time. It is where the heart stops rehearsing fear and begins to listen.',
        'en', 0
  FROM public.audio_content ac
 WHERE NOT EXISTS (
    SELECT 1 FROM public.audio_transcripts t WHERE t.audio_content_id = ac.id
 );

INSERT INTO public.audio_transcripts
    (audio_content_id, start_seconds, end_seconds, text, language, sort_order)
SELECT  ac.id,               18,    38,
        'Prayer becomes steady when it is joined to small obedience — one honest word, one act of mercy, one moment of silence.',
        'en', 1
  FROM public.audio_content ac
 WHERE EXISTS (
    SELECT 1 FROM public.audio_transcripts t
    WHERE t.audio_content_id = ac.id
      AND t.sort_order = 0
      AND t.text LIKE 'The quiet hour is not empty time%'
 )
   AND NOT EXISTS (
    SELECT 1 FROM public.audio_transcripts t
    WHERE t.audio_content_id = ac.id
      AND t.sort_order = 1
 );

INSERT INTO public.audio_transcripts
    (audio_content_id, start_seconds, end_seconds, text, language, sort_order)
SELECT  ac.id,               38,    62,
        'Open your scripture slowly. Let one verse press on you the way water presses a stone — until you give shape to its meaning.',
        'en', 2
  FROM public.audio_content ac
 WHERE EXISTS (
    SELECT 1 FROM public.audio_transcripts t
    WHERE t.audio_content_id = ac.id
      AND t.sort_order = 1
 )
   AND NOT EXISTS (
    SELECT 1 FROM public.audio_transcripts t
    WHERE t.audio_content_id = ac.id
      AND t.sort_order = 2
 );

INSERT INTO public.audio_transcripts
    (audio_content_id, start_seconds, end_seconds, text, language, sort_order)
SELECT  ac.id,               62,    88,
        'End with thanksgiving — a single sentence will do. The Spirit honors brevity that is honest more than length that is anxious.',
        'en', 3
  FROM public.audio_content ac
 WHERE EXISTS (
    SELECT 1 FROM public.audio_transcripts t
    WHERE t.audio_content_id = ac.id
      AND t.sort_order = 2
 )
   AND NOT EXISTS (
    SELECT 1 FROM public.audio_transcripts t
    WHERE t.audio_content_id = ac.id
      AND t.sort_order = 3
 );


-- ---------------------------------------------------------------------
-- 4. SAMPLE VIDEO LESSONS (3-part class for any video with none)
-- ---------------------------------------------------------------------
INSERT INTO public.video_lessons
    (video_content_id, title, description, duration_minutes, is_current, sort_order)
SELECT  vc.id, 'Opening context', 'Now playing', 6, true,  0
  FROM public.video_content vc
 WHERE NOT EXISTS (
    SELECT 1 FROM public.video_lessons l WHERE l.video_content_id = vc.id
 );

INSERT INTO public.video_lessons
    (video_content_id, title, description, duration_minutes, is_current, sort_order)
SELECT  vc.id, 'Mercy in Matthew', '13 min', 13, false, 1
  FROM public.video_content vc
 WHERE EXISTS (
    SELECT 1 FROM public.video_lessons l
    WHERE l.video_content_id = vc.id
      AND l.sort_order = 0
      AND l.title = 'Opening context'
 )
   AND NOT EXISTS (
    SELECT 1 FROM public.video_lessons l
    WHERE l.video_content_id = vc.id
      AND l.sort_order = 1
 );

INSERT INTO public.video_lessons
    (video_content_id, title, description, duration_minutes, is_current, sort_order)
SELECT  vc.id, 'Practice for the week', '9 min', 9, false, 2
  FROM public.video_content vc
 WHERE EXISTS (
    SELECT 1 FROM public.video_lessons l
    WHERE l.video_content_id = vc.id
      AND l.sort_order = 1
 )
   AND NOT EXISTS (
    SELECT 1 FROM public.video_lessons l
    WHERE l.video_content_id = vc.id
      AND l.sort_order = 2
 );


-- ---------------------------------------------------------------------
-- 5. RPC: get_linked_bible_reference
-- ---------------------------------------------------------------------
-- Convenience accessor used by the LinkedReadingCard. Returns the
-- passage string for either an audio or video content_id (whichever
-- exists). Keeps the client from having to know about the dual table
-- layout.
CREATE OR REPLACE FUNCTION public.get_linked_bible_reference(
    p_content_item_id uuid
)
RETURNS text
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(
        (SELECT linked_bible_reference FROM public.audio_content WHERE id = p_content_item_id),
        (SELECT linked_bible_reference FROM public.video_content WHERE id = p_content_item_id)
    );
$$;

COMMENT ON FUNCTION public.get_linked_bible_reference IS
    'Returns the linked bible passage attached to either an audio or video teaching. Used by the "LINKED READING" card on detail pages.';

GRANT EXECUTE ON FUNCTION public.get_linked_bible_reference
    TO anon, authenticated;

COMMIT;
