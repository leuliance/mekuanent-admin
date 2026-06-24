-- =====================================================================
-- Teachings v2: topics, saves, transcripts, lessons, reading progress
-- =====================================================================
-- Backs the redesigned post-style Teachings feed and detail pages
-- (Article / Audio / Video).
--
-- Design notes:
--   • Topics ("Fasting", "Liturgy", "Church Fathers", …) are first-class
--     rows so admins can manage them and we can render a "what do you
--     want to learn today?" chip row with branded colors/icons.
--   • Saves are a dedicated table (separate from likes). The Saved tab
--     on the feed reads from here. Likes still live in `content_likes`.
--   • Transcripts are time-aligned lines per audio item so the audio
--     detail page can highlight the line that matches the playhead.
--   • Video courses (per-video lesson list) live in `video_lessons`.
--   • `linked_bible_reference` is a free-form passage label rendered as
--     the "LINKED READING" pill on audio / video detail pages.
--   • `article_reading_progress` powers the "64% READ" stat on article
--     detail.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. TOPICS — chip taxonomy ("Fasting", "Liturgy", "Church Fathers", …)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_topics (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug        text NOT NULL UNIQUE,
    name        text NOT NULL,
    icon        text NOT NULL DEFAULT 'book',
    color       text NOT NULL DEFAULT '#102445',
    is_active   boolean NOT NULL DEFAULT true,
    sort_order  int NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT content_topics_name_not_blank
        CHECK (length(btrim(name)) > 0),
    CONSTRAINT content_topics_slug_format
        CHECK (slug ~ '^[a-z0-9-]+$')
);

COMMENT ON TABLE public.content_topics IS
    'Reusable topic chips rendered on the Teachings feed prompt row ("What do you want to learn today?") and used to filter posts.';

CREATE INDEX IF NOT EXISTS content_topics_active_sort_idx
    ON public.content_topics (is_active, sort_order);


-- M2M: a `content_items` row may belong to multiple topics.
CREATE TABLE IF NOT EXISTS public.content_item_topics (
    content_item_id uuid NOT NULL
        REFERENCES public.content_items(id) ON DELETE CASCADE,
    topic_id        uuid NOT NULL
        REFERENCES public.content_topics(id) ON DELETE CASCADE,
    created_at      timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (content_item_id, topic_id)
);

COMMENT ON TABLE public.content_item_topics IS
    'Join table mapping content_items <-> content_topics (M2M).';

CREATE INDEX IF NOT EXISTS content_item_topics_topic_idx
    ON public.content_item_topics (topic_id);


-- ---------------------------------------------------------------------
-- 2. SAVES — bookmarks (separate from likes)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_saves (
    user_id         uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id uuid NOT NULL
        REFERENCES public.content_items(id) ON DELETE CASCADE,
    saved_at        timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, content_item_id)
);

COMMENT ON TABLE public.content_saves IS
    'User bookmarks. Distinct from `content_likes`. Feeds the Saved tab on Teachings.';

CREATE INDEX IF NOT EXISTS content_saves_user_idx
    ON public.content_saves (user_id, saved_at DESC);

CREATE INDEX IF NOT EXISTS content_saves_item_idx
    ON public.content_saves (content_item_id);


-- Denormalized counter for cheap badge rendering on detail pages
-- ("2 SAVES" on the article hero). Updated via trigger below.
ALTER TABLE public.content_items
    ADD COLUMN IF NOT EXISTS save_count int NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.content_items.save_count IS
    'Denormalized count of `content_saves` rows for this item. Maintained by trigger.';


-- ---------------------------------------------------------------------
-- 3. SUBTITLES + LINKED READING on existing tables
-- ---------------------------------------------------------------------
-- A short attribution line under the title on detail screens
-- (e.g. "Fr. Kidane · Prayer series" on audio).
ALTER TABLE public.content_items
    ADD COLUMN IF NOT EXISTS subtitle text;

COMMENT ON COLUMN public.content_items.subtitle IS
    'Short attribution line rendered under the title on the detail page (audio/video). Optional.';


-- Free-form bible reference rendered as a "LINKED READING" card on
-- audio + video detail pages. Keeping it as text instead of FK so we
-- support ranges like "Matthew 5–7" or "Psalms 23" without modeling
-- chapter/verse joins (the in-app Bible reader already parses these).
ALTER TABLE public.audio_content
    ADD COLUMN IF NOT EXISTS linked_bible_reference text;

ALTER TABLE public.video_content
    ADD COLUMN IF NOT EXISTS linked_bible_reference text;

COMMENT ON COLUMN public.audio_content.linked_bible_reference IS
    'Bible passage to surface as "LINKED READING" on the audio detail page (e.g. "Matthew 6:5-15"). Tapped to open the Bible reader.';

COMMENT ON COLUMN public.video_content.linked_bible_reference IS
    'Bible passage to surface as "LINKED READING" on the video detail page.';


-- ---------------------------------------------------------------------
-- 4. AUDIO TRANSCRIPTS — time-aligned lines for follow-along UI
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audio_transcripts (
    id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    audio_content_id  uuid NOT NULL
        REFERENCES public.audio_content(id) ON DELETE CASCADE,
    start_seconds     numeric(10, 3) NOT NULL,
    end_seconds       numeric(10, 3),
    text              text NOT NULL,
    language          text NOT NULL DEFAULT 'en',
    is_highlight      boolean NOT NULL DEFAULT false,
    sort_order        int NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT audio_transcripts_text_not_blank
        CHECK (length(btrim(text)) > 0),
    CONSTRAINT audio_transcripts_start_non_negative
        CHECK (start_seconds >= 0),
    CONSTRAINT audio_transcripts_end_after_start
        CHECK (end_seconds IS NULL OR end_seconds >= start_seconds)
);

COMMENT ON TABLE public.audio_transcripts IS
    'Time-aligned transcript lines for an audio teaching. Rendered as the "Follow along" block on the audio detail page; the line whose [start,end) contains the playhead is highlighted.';

CREATE INDEX IF NOT EXISTS audio_transcripts_audio_sort_idx
    ON public.audio_transcripts (audio_content_id, sort_order);


-- ---------------------------------------------------------------------
-- 5. VIDEO LESSONS — course outline
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_lessons (
    id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_content_id  uuid NOT NULL
        REFERENCES public.video_content(id) ON DELETE CASCADE,
    title             text NOT NULL,
    description       text,
    duration_minutes  int,
    is_current        boolean NOT NULL DEFAULT false,
    sort_order        int NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT video_lessons_title_not_blank
        CHECK (length(btrim(title)) > 0),
    CONSTRAINT video_lessons_duration_non_negative
        CHECK (duration_minutes IS NULL OR duration_minutes >= 0)
);

COMMENT ON TABLE public.video_lessons IS
    'Course outline entries (e.g. 1. Opening context, 2. Mercy in Matthew, 3. Practice for the week) shown under a multi-part video class.';

CREATE INDEX IF NOT EXISTS video_lessons_video_sort_idx
    ON public.video_lessons (video_content_id, sort_order);


-- ---------------------------------------------------------------------
-- 6. ARTICLE READING PROGRESS — powers the "64% READ" badge
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_reading_progress (
    user_id              uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    article_content_id   uuid NOT NULL
        REFERENCES public.article_content(id) ON DELETE CASCADE,
    progress_percentage  int NOT NULL DEFAULT 0,
    last_read_at         timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, article_content_id),
    CONSTRAINT article_reading_progress_pct_range
        CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

COMMENT ON TABLE public.article_reading_progress IS
    'Per-user reading progress for articles. Drives the "64% READ" hero stat and lets us resume scroll position on the article detail page.';


-- ---------------------------------------------------------------------
-- 7. CONTENT NOTES — user-authored notes attached to a teaching
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_notes (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id uuid NOT NULL
        REFERENCES public.content_items(id) ON DELETE CASCADE,
    body            text NOT NULL,
    -- Anchor lets a note point at a specific spot inside the content
    -- (e.g. "p:12" for paragraph 12 of an article, or "t:418.5" for an
    -- audio timestamp). Optional, free-form so we can extend later.
    anchor          text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT content_notes_body_not_blank
        CHECK (length(btrim(body)) > 0)
);

COMMENT ON TABLE public.content_notes IS
    'User-authored notes on a content_item. Surfaced via the Notes tab on the article detail page and the Notes pill on audio detail.';

CREATE INDEX IF NOT EXISTS content_notes_user_idx
    ON public.content_notes (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS content_notes_item_idx
    ON public.content_notes (content_item_id);


-- ---------------------------------------------------------------------
-- 8. updated_at triggers (reuse existing helper)
-- ---------------------------------------------------------------------
CREATE TRIGGER content_topics_set_updated_at
    BEFORE UPDATE ON public.content_topics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER audio_transcripts_set_updated_at
    BEFORE UPDATE ON public.audio_transcripts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER video_lessons_set_updated_at
    BEFORE UPDATE ON public.video_lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER content_notes_set_updated_at
    BEFORE UPDATE ON public.content_notes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ---------------------------------------------------------------------
-- 9. save_count maintenance — keep `content_items.save_count` in sync
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.tg_content_saves_bump()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.content_items
        SET save_count = save_count + 1
        WHERE id = NEW.content_item_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.content_items
        SET save_count = GREATEST(0, save_count - 1)
        WHERE id = OLD.content_item_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS content_saves_count_aiud ON public.content_saves;
CREATE TRIGGER content_saves_count_aiud
    AFTER INSERT OR DELETE ON public.content_saves
    FOR EACH ROW EXECUTE FUNCTION public.tg_content_saves_bump();


-- ---------------------------------------------------------------------
-- 10. RLS — public read, owner write where applicable, admin write
--     where it makes sense (topics/transcripts/lessons via church admin)
-- ---------------------------------------------------------------------
ALTER TABLE public.content_topics       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_item_topics  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_saves        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_transcripts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_lessons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_notes        ENABLE ROW LEVEL SECURITY;

-- Topics: world-readable taxonomy, super-admin writes
DROP POLICY IF EXISTS content_topics_select_anyone ON public.content_topics;
CREATE POLICY content_topics_select_anyone
    ON public.content_topics FOR SELECT
    USING (true);

DROP POLICY IF EXISTS content_topics_admin_write ON public.content_topics;
CREATE POLICY content_topics_admin_write
    ON public.content_topics FOR ALL
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

-- content_item_topics: readable by all, writable by the content owner
-- or church admin (we reuse `is_church_admin` indirectly via item).
DROP POLICY IF EXISTS content_item_topics_select_anyone ON public.content_item_topics;
CREATE POLICY content_item_topics_select_anyone
    ON public.content_item_topics FOR SELECT
    USING (true);

DROP POLICY IF EXISTS content_item_topics_write ON public.content_item_topics;
CREATE POLICY content_item_topics_write
    ON public.content_item_topics FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.content_items ci
            WHERE ci.id = content_item_id
              AND (
                  ci.created_by = auth.uid()
                  OR public.is_church_admin(auth.uid(), ci.church_id)
                  OR public.is_super_admin(auth.uid())
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.content_items ci
            WHERE ci.id = content_item_id
              AND (
                  ci.created_by = auth.uid()
                  OR public.is_church_admin(auth.uid(), ci.church_id)
                  OR public.is_super_admin(auth.uid())
              )
        )
    );

-- content_saves: each user manages their own rows.
DROP POLICY IF EXISTS content_saves_select_own ON public.content_saves;
CREATE POLICY content_saves_select_own
    ON public.content_saves FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS content_saves_insert_own ON public.content_saves;
CREATE POLICY content_saves_insert_own
    ON public.content_saves FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS content_saves_delete_own ON public.content_saves;
CREATE POLICY content_saves_delete_own
    ON public.content_saves FOR DELETE
    USING (auth.uid() = user_id);

-- audio_transcripts: readable by all, writable by content owner/admin.
DROP POLICY IF EXISTS audio_transcripts_select_anyone ON public.audio_transcripts;
CREATE POLICY audio_transcripts_select_anyone
    ON public.audio_transcripts FOR SELECT
    USING (true);

DROP POLICY IF EXISTS audio_transcripts_write ON public.audio_transcripts;
CREATE POLICY audio_transcripts_write
    ON public.audio_transcripts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.content_items ci
            WHERE ci.id = audio_content_id
              AND (
                  ci.created_by = auth.uid()
                  OR public.is_church_admin(auth.uid(), ci.church_id)
                  OR public.is_super_admin(auth.uid())
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.content_items ci
            WHERE ci.id = audio_content_id
              AND (
                  ci.created_by = auth.uid()
                  OR public.is_church_admin(auth.uid(), ci.church_id)
                  OR public.is_super_admin(auth.uid())
              )
        )
    );

-- video_lessons: same write rules as transcripts.
DROP POLICY IF EXISTS video_lessons_select_anyone ON public.video_lessons;
CREATE POLICY video_lessons_select_anyone
    ON public.video_lessons FOR SELECT
    USING (true);

DROP POLICY IF EXISTS video_lessons_write ON public.video_lessons;
CREATE POLICY video_lessons_write
    ON public.video_lessons FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.content_items ci
            WHERE ci.id = video_content_id
              AND (
                  ci.created_by = auth.uid()
                  OR public.is_church_admin(auth.uid(), ci.church_id)
                  OR public.is_super_admin(auth.uid())
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.content_items ci
            WHERE ci.id = video_content_id
              AND (
                  ci.created_by = auth.uid()
                  OR public.is_church_admin(auth.uid(), ci.church_id)
                  OR public.is_super_admin(auth.uid())
              )
        )
    );

-- article_reading_progress: each user manages their own.
DROP POLICY IF EXISTS article_progress_own ON public.article_reading_progress;
CREATE POLICY article_progress_own
    ON public.article_reading_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- content_notes: each user manages their own; everyone sees their own
-- only (notes are private). Future: add a `visibility` column for
-- public sharing.
DROP POLICY IF EXISTS content_notes_own ON public.content_notes;
CREATE POLICY content_notes_own
    ON public.content_notes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- ---------------------------------------------------------------------
-- 11. SEED TOPICS
-- ---------------------------------------------------------------------
INSERT INTO public.content_topics (slug, name, icon, color, sort_order)
VALUES
    ('fasting',         'Fasting',         'leaf',            '#0E8E5A', 10),
    ('liturgy',         'Liturgy',         'musical-notes',   '#7A4FBF', 20),
    ('church-fathers',  'Church Fathers',  'book',            '#102445', 30),
    ('prayer',          'Prayer',          'flame',           '#D4762A', 40),
    ('saints',          'Saints',          'rose',            '#C7398A', 50),
    ('scripture',       'Scripture',       'bookmark',        '#1A428A', 60),
    ('mercy',           'Mercy',           'heart',           '#E26F5C', 70),
    ('faith',           'Faith',           'star',            '#D7A042', 80)
ON CONFLICT (slug) DO NOTHING;


-- ---------------------------------------------------------------------
-- 12. BACKFILL — assign topics, subtitles, transcripts, lessons,
--                linked readings, reading progress, save counts for
--                anything already seeded in the database. Idempotent.
-- ---------------------------------------------------------------------

-- (a) Generic subtitle for audio/video items where missing — uses the
--     existing artist_name when present.
UPDATE public.content_items ci
SET subtitle = COALESCE(
    NULLIF(btrim(ac.artist_name), ''),
    'Mekua''nent Teachings'
)
FROM public.audio_content ac
WHERE ac.id = ci.id
  AND ci.subtitle IS NULL;

UPDATE public.content_items
SET subtitle = COALESCE(subtitle, 'Mekua''nent Teachings')
WHERE content_type IN ('video', 'article')
  AND subtitle IS NULL;


-- (b) Assign topics by heuristic keyword match against title /
--     description. Cheap and good-enough for the seeded data; admins
--     can re-assign later from the admin UI.
WITH keyword_matches AS (
    SELECT
        ci.id AS content_item_id,
        ct.id AS topic_id
    FROM public.content_items ci
    JOIN public.content_topics ct ON (
        ci.title ILIKE '%' || ct.name || '%'
        OR ci.description ILIKE '%' || ct.name || '%'
    )
    WHERE ct.is_active
)
INSERT INTO public.content_item_topics (content_item_id, topic_id)
SELECT content_item_id, topic_id FROM keyword_matches
ON CONFLICT DO NOTHING;


-- (c) Seed a simple transcript for any audio that doesn't have one
--     yet, so the new audio detail page renders a transcript area
--     immediately on existing data. Lines are deliberately generic so
--     real transcripts can replace them as they come in.
INSERT INTO public.audio_transcripts
    (audio_content_id, start_seconds, end_seconds, text, sort_order, is_highlight)
SELECT
    ac.id,
    s.start_s,
    s.end_s,
    s.line,
    s.ord,
    s.hi
FROM public.audio_content ac
CROSS JOIN LATERAL (
    VALUES
        (0,    20,  'The quiet hour is not empty time. It is where the heart stops rehearsing fear and begins to listen.', 0, true),
        (20,   60,  'Prayer becomes steady when it is joined to small obedience: one honest word, one act of mercy, one moment of silence.', 1, false),
        (60,  120,  'Faith is not what we feel when life is calm — it is what we practise when the room is dark and we choose to stay.', 2, false),
        (120, 240,  'Listen for the still voice. It does not compete with noise; it waits for our attention.', 3, false)
) AS s(start_s, end_s, line, ord, hi)
WHERE NOT EXISTS (
    SELECT 1 FROM public.audio_transcripts t WHERE t.audio_content_id = ac.id
);


-- (d) Seed a 3-part course outline for any video that doesn't have
--     lessons yet — matches the "Three-part class" mockup.
INSERT INTO public.video_lessons
    (video_content_id, title, description, duration_minutes, is_current, sort_order)
SELECT
    vc.id,
    s.title,
    s.description,
    s.minutes,
    s.is_current,
    s.ord
FROM public.video_content vc
CROSS JOIN LATERAL (
    VALUES
        ('Opening context',     'Now playing',  null::int, true,  0),
        ('Mercy in Matthew',    null,           13,        false, 1),
        ('Practice for the week', null,         9,         false, 2)
) AS s(title, description, minutes, is_current, ord)
WHERE NOT EXISTS (
    SELECT 1 FROM public.video_lessons l WHERE l.video_content_id = vc.id
);


-- (e) Linked bible references — assign a generic passage so detail
--     pages always have the "LINKED READING" pill on seeded data.
UPDATE public.audio_content
SET linked_bible_reference = 'Matthew 6:5-15'
WHERE linked_bible_reference IS NULL;

UPDATE public.video_content
SET linked_bible_reference = 'Matthew 9:13'
WHERE linked_bible_reference IS NULL;


-- (f) Recompute save_count from any existing rows in content_saves.
--     (Should be a no-op on fresh installs; defensive.)
UPDATE public.content_items ci
SET save_count = COALESCE(s.cnt, 0)
FROM (
    SELECT content_item_id, COUNT(*) AS cnt
    FROM public.content_saves
    GROUP BY content_item_id
) s
WHERE s.content_item_id = ci.id;


-- ---------------------------------------------------------------------
-- 13. RPC: get_teachings_feed
--     Single round-trip for the post-style feed. Joins church,
--     audio/video/article child rows, topic chips, and the current
--     user's save/like status. Returns ordered, paginated rows.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_teachings_feed(
    p_content_type  text DEFAULT NULL,   -- 'video' | 'audio' | 'article' | NULL = all
    p_topic_slug    text DEFAULT NULL,
    p_saved_only    boolean DEFAULT false,
    p_limit         int     DEFAULT 20,
    p_offset        int     DEFAULT 0
)
RETURNS TABLE (
    id              uuid,
    content_type    text,
    title           text,
    description     text,
    subtitle        text,
    thumbnail_url   text,
    language        text,
    created_at      timestamptz,
    view_count      int,
    like_count      int,
    save_count      int,
    share_count     int,
    church_id       uuid,
    church_name     text,
    church_logo_url text,
    audio_url       text,
    audio_duration  int,
    article_body    text,
    article_read_minutes int,
    video_url       text,
    video_duration  int,
    topic_slugs     text[],
    topic_names     text[],
    is_saved        boolean,
    is_liked        boolean
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        ci.id,
        ci.content_type::text,
        ci.title,
        ci.description,
        ci.subtitle,
        ci.thumbnail_url,
        ci.language,
        ci.created_at,
        ci.view_count,
        ci.like_count,
        ci.save_count,
        ci.share_count,
        ci.church_id,
        ch.name        AS church_name,
        ch.logo_url    AS church_logo_url,
        ac.audio_url,
        ac.duration_seconds AS audio_duration,
        ar.body        AS article_body,
        ar.read_time_minutes AS article_read_minutes,
        vc.video_url,
        vc.duration_seconds AS video_duration,
        COALESCE(
            (SELECT array_agg(ct.slug ORDER BY ct.sort_order)
             FROM public.content_item_topics cit
             JOIN public.content_topics ct ON ct.id = cit.topic_id
             WHERE cit.content_item_id = ci.id),
            '{}'::text[]
        ) AS topic_slugs,
        COALESCE(
            (SELECT array_agg(ct.name ORDER BY ct.sort_order)
             FROM public.content_item_topics cit
             JOIN public.content_topics ct ON ct.id = cit.topic_id
             WHERE cit.content_item_id = ci.id),
            '{}'::text[]
        ) AS topic_names,
        EXISTS (
            SELECT 1 FROM public.content_saves cs
            WHERE cs.content_item_id = ci.id
              AND cs.user_id = auth.uid()
        ) AS is_saved,
        EXISTS (
            SELECT 1 FROM public.content_likes cl
            WHERE cl.content_id = ci.id
              AND cl.user_id = auth.uid()
        ) AS is_liked
    FROM public.content_items ci
    LEFT JOIN public.churches ch        ON ch.id = ci.church_id
    LEFT JOIN public.audio_content ac   ON ac.id = ci.id
    LEFT JOIN public.video_content vc   ON vc.id = ci.id
    LEFT JOIN public.article_content ar ON ar.id = ci.id
    WHERE ci.status = 'approved'
      AND (p_content_type IS NULL OR ci.content_type::text = p_content_type)
      AND (
          p_topic_slug IS NULL OR EXISTS (
              SELECT 1 FROM public.content_item_topics cit
              JOIN public.content_topics ct ON ct.id = cit.topic_id
              WHERE cit.content_item_id = ci.id
                AND ct.slug = p_topic_slug
          )
      )
      AND (
          NOT p_saved_only OR EXISTS (
              SELECT 1 FROM public.content_saves cs
              WHERE cs.content_item_id = ci.id
                AND cs.user_id = auth.uid()
          )
      )
    ORDER BY ci.created_at DESC
    LIMIT  GREATEST(1, COALESCE(p_limit, 20))
    OFFSET GREATEST(0, COALESCE(p_offset, 0));
$$;

COMMENT ON FUNCTION public.get_teachings_feed IS
    'Powers the post-style Teachings feed. Pass content_type / topic_slug / saved_only to filter. Returns enriched rows with church, topic chips, save/like flags.';

GRANT EXECUTE ON FUNCTION public.get_teachings_feed
    TO anon, authenticated;


-- ---------------------------------------------------------------------
-- 14. RPC: toggle_content_save — idempotent save / unsave
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.toggle_content_save(
    p_content_item_id uuid
)
RETURNS boolean   -- true if now saved, false if removed
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    v_uid uuid := auth.uid();
    v_now_saved boolean;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'auth.uid() is null — must be signed in to save';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.content_saves
        WHERE user_id = v_uid AND content_item_id = p_content_item_id
    ) THEN
        DELETE FROM public.content_saves
        WHERE user_id = v_uid AND content_item_id = p_content_item_id;
        v_now_saved := false;
    ELSE
        INSERT INTO public.content_saves (user_id, content_item_id)
        VALUES (v_uid, p_content_item_id);
        v_now_saved := true;
    END IF;

    RETURN v_now_saved;
END;
$$;

COMMENT ON FUNCTION public.toggle_content_save IS
    'Idempotent save toggle. Returns true if the item is now saved, false if it was unsaved.';

GRANT EXECUTE ON FUNCTION public.toggle_content_save
    TO authenticated;

COMMIT;
