-- ==========================================================================
-- ETHIOPIAN ORTHODOX TEWAHEDO BIBLE — FULL SCHEMA REBUILD
-- 81-book canon with USFM support, multilingual JSONB fields
-- ==========================================================================

-- -------------------------------------------------------------------------
-- 1. DROP OLD RPCs
-- -------------------------------------------------------------------------
DROP FUNCTION IF EXISTS search_bible_books(text) CASCADE;
DROP FUNCTION IF EXISTS search_bible_verses_text(text) CASCADE;
DROP FUNCTION IF EXISTS get_random_verse_of_day() CASCADE;

-- -------------------------------------------------------------------------
-- 2. DROP OLD TABLES (cascade removes indexes, RLS, triggers)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS bible_bookmarks CASCADE;
DROP TABLE IF EXISTS bible_cross_references CASCADE;
DROP TABLE IF EXISTS bible_footnotes CASCADE;
DROP TABLE IF EXISTS verse_of_the_day CASCADE;
DROP TABLE IF EXISTS bible_verses CASCADE;
DROP TABLE IF EXISTS bible_chapters CASCADE;
DROP TABLE IF EXISTS bible_books CASCADE;

-- -------------------------------------------------------------------------
-- 3. CREATE NEW TABLES
-- -------------------------------------------------------------------------

-- Translations metadata
CREATE TABLE bible_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name JSONB NOT NULL DEFAULT '{}',
    script TEXT NOT NULL DEFAULT 'ethiopic',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 81 books of the Ethiopian Orthodox canon
CREATE TABLE bible_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_number INT NOT NULL UNIQUE,
    paratext_code TEXT NOT NULL UNIQUE,
    name JSONB NOT NULL DEFAULT '{}',
    testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
    category TEXT NOT NULL CHECK (category IN (
        'law', 'history', 'poetry', 'prophecy',
        'gospel', 'epistle', 'apocalypse',
        'deuterocanon', 'ethiopic_unique'
    )),
    chapter_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chapters per book
CREATE TABLE bible_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    verse_count INT NOT NULL DEFAULT 0,
    usfm_content JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (book_id, chapter_number)
);

-- Verses per chapter (multilingual plain text)
CREATE TABLE bible_verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    verse_number INT NOT NULL,
    text JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (chapter_id, verse_number)
);

-- Footnotes attached to verses
CREATE TABLE bible_footnotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verse_id UUID NOT NULL REFERENCES bible_verses(id) ON DELETE CASCADE,
    marker JSONB NOT NULL DEFAULT '{}',
    note JSONB NOT NULL DEFAULT '{}',
    type TEXT NOT NULL DEFAULT 'footnote' CHECK (type IN ('footnote', 'cross_ref')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cross-references between verses
CREATE TABLE bible_cross_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verse_id UUID NOT NULL REFERENCES bible_verses(id) ON DELETE CASCADE,
    ref_book_id UUID REFERENCES bible_books(id) ON DELETE SET NULL,
    ref_chapter INT,
    ref_verse_start INT,
    ref_verse_end INT,
    description JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookmark collections per user
CREATE TABLE bible_bookmark_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#F59E0B',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User bookmarks on verses
CREATE TABLE bible_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_id UUID NOT NULL REFERENCES bible_verses(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES bible_bookmark_collections(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, verse_id)
);

-- User highlights on verses
CREATE TABLE bible_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_id UUID NOT NULL REFERENCES bible_verses(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    color TEXT NOT NULL DEFAULT '#FDE047',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, verse_id)
);

-- User notes on verses
CREATE TABLE bible_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_id UUID NOT NULL REFERENCES bible_verses(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, verse_id)
);

-- Scheduled verse of the day
CREATE TABLE verse_of_the_day (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verse_id UUID NOT NULL REFERENCES bible_verses(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL UNIQUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin-created reading plans
CREATE TABLE bible_reading_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL DEFAULT '{}',
    description JSONB NOT NULL DEFAULT '{}',
    cover_image TEXT,
    duration_days INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Days within a reading plan
CREATE TABLE bible_reading_plan_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES bible_reading_plans(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (plan_id, day_number)
);

-- Scripture readings per day
CREATE TABLE bible_reading_plan_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID NOT NULL REFERENCES bible_reading_plan_days(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_start INT NOT NULL,
    verse_start INT,
    chapter_end INT,
    verse_end INT,
    sort_order INT NOT NULL DEFAULT 0
);

-- User enrollment in reading plans
CREATE TABLE bible_user_reading_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES bible_reading_plans(id) ON DELETE CASCADE,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_day INT NOT NULL DEFAULT 1,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, plan_id)
);

-- Daily reading progress per user plan
CREATE TABLE bible_user_reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_plan_id UUID NOT NULL REFERENCES bible_user_reading_plans(id) ON DELETE CASCADE,
    day_id UUID NOT NULL REFERENCES bible_reading_plan_days(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    UNIQUE (user_plan_id, day_id)
);

-- Audio per chapter per language
CREATE TABLE bible_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'am',
    audio_url TEXT NOT NULL,
    duration_seconds INT,
    narrator TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (chapter_id, language)
);

-- -------------------------------------------------------------------------
-- 4. INDEXES
-- -------------------------------------------------------------------------
CREATE INDEX idx_bible_books_number ON bible_books(book_number);
CREATE INDEX idx_bible_books_testament ON bible_books(testament);
CREATE INDEX idx_bible_books_category ON bible_books(category);

CREATE INDEX idx_bible_chapters_book ON bible_chapters(book_id, chapter_number);

CREATE INDEX idx_bible_verses_chapter ON bible_verses(chapter_id, verse_number);
CREATE INDEX idx_bible_verses_text_gin ON bible_verses USING gin(text jsonb_path_ops);

CREATE INDEX idx_bible_footnotes_verse ON bible_footnotes(verse_id);
CREATE INDEX idx_bible_cross_refs_verse ON bible_cross_references(verse_id);

CREATE INDEX idx_bible_bookmarks_user ON bible_bookmarks(user_id);
CREATE INDEX idx_bible_bookmarks_verse ON bible_bookmarks(user_id, verse_id);
CREATE INDEX idx_bible_bookmarks_chapter ON bible_bookmarks(user_id, chapter_id);

CREATE INDEX idx_bible_highlights_user ON bible_highlights(user_id);
CREATE INDEX idx_bible_highlights_chapter ON bible_highlights(user_id, chapter_id);

CREATE INDEX idx_bible_notes_user ON bible_notes(user_id);
CREATE INDEX idx_bible_notes_chapter ON bible_notes(user_id, chapter_id);

CREATE INDEX idx_votd_date ON verse_of_the_day(scheduled_date);

CREATE INDEX idx_reading_plan_days ON bible_reading_plan_days(plan_id, day_number);
CREATE INDEX idx_user_reading_plans ON bible_user_reading_plans(user_id);
CREATE INDEX idx_user_reading_progress ON bible_user_reading_progress(user_plan_id);

CREATE INDEX idx_bible_audio_chapter ON bible_audio(chapter_id, language);

-- -------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- -------------------------------------------------------------------------

-- Public-read tables (admin writes via service key)
ALTER TABLE bible_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read translations" ON bible_translations FOR SELECT USING (true);

ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read books" ON bible_books FOR SELECT USING (true);

ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chapters" ON bible_chapters FOR SELECT USING (true);

ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read verses" ON bible_verses FOR SELECT USING (true);

ALTER TABLE bible_footnotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read footnotes" ON bible_footnotes FOR SELECT USING (true);

ALTER TABLE bible_cross_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cross_references" ON bible_cross_references FOR SELECT USING (true);

ALTER TABLE verse_of_the_day ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read votd" ON verse_of_the_day FOR SELECT USING (true);

ALTER TABLE bible_reading_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plans" ON bible_reading_plans FOR SELECT USING (true);

ALTER TABLE bible_reading_plan_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plan days" ON bible_reading_plan_days FOR SELECT USING (true);

ALTER TABLE bible_reading_plan_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plan readings" ON bible_reading_plan_readings FOR SELECT USING (true);

ALTER TABLE bible_audio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read audio" ON bible_audio FOR SELECT USING (true);

-- User-owned tables
ALTER TABLE bible_bookmark_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own collections" ON bible_bookmark_collections
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE bible_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON bible_bookmarks
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE bible_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own highlights" ON bible_highlights
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE bible_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notes" ON bible_notes
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE bible_user_reading_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reading plans" ON bible_user_reading_plans
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE bible_user_reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON bible_user_reading_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM bible_user_reading_plans
            WHERE id = bible_user_reading_progress.user_plan_id
            AND user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM bible_user_reading_plans
            WHERE id = bible_user_reading_progress.user_plan_id
            AND user_id = auth.uid()
        )
    );

-- -------------------------------------------------------------------------
-- 6. RPCs / FUNCTIONS
-- -------------------------------------------------------------------------

-- Search book names across all JSONB language keys
CREATE OR REPLACE FUNCTION search_bible_books(search_query TEXT)
RETURNS SETOF bible_books
LANGUAGE sql STABLE
AS $$
    SELECT DISTINCT b.*
    FROM bible_books b,
         jsonb_each_text(b.name) AS kv
    WHERE lower(kv.value) LIKE '%' || lower(search_query) || '%'
    ORDER BY b.book_number;
$$;

-- Full-text search on verse text across all languages
CREATE OR REPLACE FUNCTION search_bible_verses_text(search_query TEXT, lang TEXT DEFAULT 'am', lim INT DEFAULT 20, off_set INT DEFAULT 0)
RETURNS TABLE (
    verse_id UUID,
    chapter_id UUID,
    verse_number INT,
    text JSONB,
    book_id UUID,
    book_name JSONB,
    book_number INT,
    chapter_number INT,
    chapter_count INT,
    verse_count INT,
    testament TEXT
)
LANGUAGE sql STABLE
AS $$
    SELECT
        v.id AS verse_id,
        v.chapter_id,
        v.verse_number,
        v.text,
        b.id AS book_id,
        b.name AS book_name,
        b.book_number,
        c.chapter_number,
        b.chapter_count,
        c.verse_count,
        b.testament
    FROM bible_verses v
    JOIN bible_chapters c ON c.id = v.chapter_id
    JOIN bible_books b ON b.id = c.book_id
    WHERE lower(v.text ->> lang) LIKE '%' || lower(search_query) || '%'
    ORDER BY b.book_number, c.chapter_number, v.verse_number
    LIMIT lim OFFSET off_set;
$$;

-- Verse of the day: scheduled or random fallback
CREATE OR REPLACE FUNCTION get_verse_of_day()
RETURNS TABLE (
    verse_id UUID,
    chapter_id UUID,
    verse_number INT,
    verse_text JSONB,
    book_id UUID,
    book_name JSONB,
    book_number INT,
    chapter_number INT,
    testament TEXT
)
LANGUAGE plpgsql STABLE
AS $$
DECLARE
    v_record RECORD;
BEGIN
    -- Try scheduled verse first
    SELECT votd.verse_id INTO v_record
    FROM verse_of_the_day votd
    WHERE votd.scheduled_date = CURRENT_DATE
    LIMIT 1;

    IF v_record IS NOT NULL THEN
        RETURN QUERY
        SELECT
            v.id, v.chapter_id, v.verse_number, v.text,
            b.id, b.name, b.book_number, c.chapter_number, b.testament
        FROM bible_verses v
        JOIN bible_chapters c ON c.id = v.chapter_id
        JOIN bible_books b ON b.id = c.book_id
        WHERE v.id = v_record.verse_id;
        RETURN;
    END IF;

    -- Fallback: deterministic "random" based on day-of-year
    RETURN QUERY
    SELECT
        v.id, v.chapter_id, v.verse_number, v.text,
        b.id, b.name, b.book_number, c.chapter_number, b.testament
    FROM bible_verses v
    JOIN bible_chapters c ON c.id = v.chapter_id
    JOIN bible_books b ON b.id = c.book_id
    ORDER BY hashtext(v.id::text || CURRENT_DATE::text)
    LIMIT 1;
END;
$$;

-- -------------------------------------------------------------------------
-- 7. SEED TRANSLATIONS
-- -------------------------------------------------------------------------
INSERT INTO bible_translations (code, name, script, is_default) VALUES
    ('am', '{"am":"አማርኛ","en":"Amharic"}', 'ethiopic', true),
    ('gez', '{"am":"ግዕዝ","en":"Ge''ez"}', 'ethiopic', false),
    ('en', '{"am":"እንግሊዝኛ","en":"English"}', 'latin', false),
    ('ti', '{"am":"ትግርኛ","en":"Tigrinya"}', 'ethiopic', false),
    ('or', '{"am":"ኦሮምኛ","en":"Oromo"}', 'latin', false);

-- -------------------------------------------------------------------------
-- 8. SEED 81 BOOKS (Ethiopian Orthodox canon order)
-- -------------------------------------------------------------------------

-- OT: Law (Torah)
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(1,  'GEN', '{"am":"ዘፍጥረት","en":"Genesis"}',          'OT', 'law', 50),
(2,  'EXO', '{"am":"ዘጸአት","en":"Exodus"}',             'OT', 'law', 40),
(3,  'LEV', '{"am":"ዘሌዋውያን","en":"Leviticus"}',        'OT', 'law', 27),
(4,  'NUM', '{"am":"ዘኍልቊ","en":"Numbers"}',             'OT', 'law', 36),
(5,  'DEU', '{"am":"ዘዳግም","en":"Deuteronomy"}',         'OT', 'law', 34);

-- OT: History
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(6,  'JOS', '{"am":"ኢያሱ","en":"Joshua"}',              'OT', 'history', 24),
(7,  'JDG', '{"am":"መሳፍንት","en":"Judges"}',             'OT', 'history', 21),
(8,  'RUT', '{"am":"ሩት","en":"Ruth"}',                  'OT', 'history', 4),
(9,  '1SA', '{"am":"1ኛ ሳሙኤል","en":"1 Samuel"}',        'OT', 'history', 31),
(10, '2SA', '{"am":"2ኛ ሳሙኤል","en":"2 Samuel"}',        'OT', 'history', 24),
(11, '1KI', '{"am":"1ኛ ነገሥት","en":"1 Kings"}',         'OT', 'history', 22),
(12, '2KI', '{"am":"2ኛ ነገሥት","en":"2 Kings"}',         'OT', 'history', 25),
(13, '1CH', '{"am":"1ኛ ዜና መዋዕል","en":"1 Chronicles"}', 'OT', 'history', 29),
(14, '2CH', '{"am":"2ኛ ዜና መዋዕል","en":"2 Chronicles"}', 'OT', 'history', 36);

-- OT: Ethiopian Unique (placed per Ethiopian order)
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(15, 'JUB', '{"am":"ኩፋሌ","en":"Jubilees"}',            'OT', 'ethiopic_unique', 50),
(16, 'ENO', '{"am":"ሄኖክ","en":"1 Enoch"}',              'OT', 'ethiopic_unique', 108);

-- OT: History continued
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(17, 'EZR', '{"am":"ዕዝራ","en":"Ezra"}',                'OT', 'history', 10),
(18, 'NEH', '{"am":"ነህምያ","en":"Nehemiah"}',            'OT', 'history', 13);

-- OT: Ethiopian Unique / Deuterocanon continued
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(19, 'EZA', '{"am":"ዕዝራ ሱቱኤል","en":"Ezra Sutuel"}',   'OT', 'ethiopic_unique', 16),
(20, '1ES', '{"am":"1ኛ ዕዝራ","en":"1 Esdras"}',         'OT', 'deuterocanon', 9),
(21, 'TOB', '{"am":"ጦቢት","en":"Tobit"}',               'OT', 'deuterocanon', 14),
(22, 'JDT', '{"am":"ዮዲት","en":"Judith"}',              'OT', 'deuterocanon', 16),
(23, 'ESG', '{"am":"አስቴር","en":"Esther"}',              'OT', 'deuterocanon', 10);

-- OT: Ethiopian Unique — Meqabyan
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(24, '1MQ', '{"am":"1ኛ መቃብያን","en":"1 Meqabyan"}',    'OT', 'ethiopic_unique', 36),
(25, '2MQ', '{"am":"2ኛ መቃብያን","en":"2 Meqabyan"}',    'OT', 'ethiopic_unique', 20),
(26, '3MQ', '{"am":"3ኛ መቃብያን","en":"3 Meqabyan"}',    'OT', 'ethiopic_unique', 10);

-- OT: Poetry / Wisdom
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(27, 'JOB', '{"am":"ኢዮብ","en":"Job"}',                 'OT', 'poetry', 42),
(28, 'PSA', '{"am":"መዝሙረ ዳዊት","en":"Psalms"}',        'OT', 'poetry', 151),
(29, 'PRO', '{"am":"ምሳሌ","en":"Proverbs"}',             'OT', 'poetry', 24),
(30, 'REP', '{"am":"ተግሣጽ","en":"Reproof"}',             'OT', 'ethiopic_unique', 7),
(31, 'WIS', '{"am":"ጥበበ ሰሎሞን","en":"Wisdom of Solomon"}', 'OT', 'deuterocanon', 19),
(32, 'ECC', '{"am":"መክብብ","en":"Ecclesiastes"}',        'OT', 'poetry', 12),
(33, 'SNG', '{"am":"መኃልየ ሰሎሞን","en":"Song of Solomon"}', 'OT', 'poetry', 8),
(34, 'SIR', '{"am":"ሲራክ","en":"Sirach"}',               'OT', 'deuterocanon', 51);

-- OT: Major Prophets
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(35, 'ISA', '{"am":"ኢሳይያስ","en":"Isaiah"}',            'OT', 'prophecy', 66),
(36, 'JER', '{"am":"ኤርምያስ","en":"Jeremiah"}',          'OT', 'prophecy', 52),
(37, 'BAR', '{"am":"ባሩክ","en":"Baruch"}',               'OT', 'deuterocanon', 5),
(38, 'LAM', '{"am":"ሰቆቃወ ኤርምያስ","en":"Lamentations"}', 'OT', 'prophecy', 5),
(39, 'LJE', '{"am":"መልእክተ ኤርምያስ","en":"Letter of Jeremiah"}', 'OT', 'deuterocanon', 1),
(40, '4BA', '{"am":"4ኛ ባሩክ","en":"4 Baruch"}',          'OT', 'ethiopic_unique', 9),
(41, 'EZK', '{"am":"ሕዝቅኤል","en":"Ezekiel"}',           'OT', 'prophecy', 48),
(42, 'DAG', '{"am":"ዳንኤል","en":"Daniel"}',              'OT', 'prophecy', 14);

-- OT: Minor Prophets (Ethiopian / Septuagint order)
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(43, 'HOS', '{"am":"ሆሴዕ","en":"Hosea"}',               'OT', 'prophecy', 14),
(44, 'AMO', '{"am":"አሞጽ","en":"Amos"}',                 'OT', 'prophecy', 9),
(45, 'MIC', '{"am":"ሚክያስ","en":"Micah"}',              'OT', 'prophecy', 7),
(46, 'JOL', '{"am":"ኢዮኤል","en":"Joel"}',               'OT', 'prophecy', 3),
(47, 'OBA', '{"am":"አብድዩ","en":"Obadiah"}',             'OT', 'prophecy', 1),
(48, 'JON', '{"am":"ዮናስ","en":"Jonah"}',               'OT', 'prophecy', 4),
(49, 'NAM', '{"am":"ናሆም","en":"Nahum"}',               'OT', 'prophecy', 3),
(50, 'HAB', '{"am":"ዕንባቆም","en":"Habakkuk"}',           'OT', 'prophecy', 3),
(51, 'ZEP', '{"am":"ሶፎንያስ","en":"Zephaniah"}',         'OT', 'prophecy', 3),
(52, 'HAG', '{"am":"ሐጌ","en":"Haggai"}',                'OT', 'prophecy', 2),
(53, 'ZEC', '{"am":"ዘካርያስ","en":"Zechariah"}',         'OT', 'prophecy', 14),
(54, 'MAL', '{"am":"ሚልክያስ","en":"Malachi"}',           'OT', 'prophecy', 4);

-- NT: Gospels
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(55, 'MAT', '{"am":"ማቴዎስ","en":"Matthew"}',            'NT', 'gospel', 28),
(56, 'MRK', '{"am":"ማርቆስ","en":"Mark"}',               'NT', 'gospel', 16),
(57, 'LUK', '{"am":"ሉቃስ","en":"Luke"}',                'NT', 'gospel', 24),
(58, 'JHN', '{"am":"ዮሐንስ","en":"John"}',               'NT', 'gospel', 21);

-- NT: History
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(59, 'ACT', '{"am":"የሐዋርያት ሥራ","en":"Acts"}',         'NT', 'history', 28);

-- NT: Pauline Epistles
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(60, 'ROM', '{"am":"ሮሜ","en":"Romans"}',                'NT', 'epistle', 16),
(61, '1CO', '{"am":"1ኛ ቆሮንቶስ","en":"1 Corinthians"}',  'NT', 'epistle', 16),
(62, '2CO', '{"am":"2ኛ ቆሮንቶስ","en":"2 Corinthians"}',  'NT', 'epistle', 13),
(63, 'GAL', '{"am":"ገላትያ","en":"Galatians"}',           'NT', 'epistle', 6),
(64, 'EPH', '{"am":"ኤፌሶን","en":"Ephesians"}',           'NT', 'epistle', 6),
(65, 'PHP', '{"am":"ፊልጵስዩስ","en":"Philippians"}',      'NT', 'epistle', 4),
(66, 'COL', '{"am":"ቆላስይስ","en":"Colossians"}',        'NT', 'epistle', 4),
(67, '1TH', '{"am":"1ኛ ተሰሎንቄ","en":"1 Thessalonians"}','NT', 'epistle', 5),
(68, '2TH', '{"am":"2ኛ ተሰሎንቄ","en":"2 Thessalonians"}','NT', 'epistle', 3),
(69, '1TI', '{"am":"1ኛ ጢሞቴዎስ","en":"1 Timothy"}',      'NT', 'epistle', 6),
(70, '2TI', '{"am":"2ኛ ጢሞቴዎስ","en":"2 Timothy"}',      'NT', 'epistle', 4),
(71, 'TIT', '{"am":"ቲቶ","en":"Titus"}',                 'NT', 'epistle', 3),
(72, 'PHM', '{"am":"ፊልሞና","en":"Philemon"}',           'NT', 'epistle', 1),
(73, 'HEB', '{"am":"ዕብራውያን","en":"Hebrews"}',          'NT', 'epistle', 13);

-- NT: General Epistles
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(74, 'JAS', '{"am":"ያዕቆብ","en":"James"}',              'NT', 'epistle', 5),
(75, '1PE', '{"am":"1ኛ ጴጥሮስ","en":"1 Peter"}',         'NT', 'epistle', 5),
(76, '2PE', '{"am":"2ኛ ጴጥሮስ","en":"2 Peter"}',         'NT', 'epistle', 3),
(77, '1JN', '{"am":"1ኛ ዮሐንስ","en":"1 John"}',          'NT', 'epistle', 5),
(78, '2JN', '{"am":"2ኛ ዮሐንስ","en":"2 John"}',          'NT', 'epistle', 1),
(79, '3JN', '{"am":"3ኛ ዮሐንስ","en":"3 John"}',          'NT', 'epistle', 1),
(80, 'JUD', '{"am":"ይሁዳ","en":"Jude"}',                'NT', 'epistle', 1);

-- NT: Apocalypse
INSERT INTO bible_books (book_number, paratext_code, name, testament, category, chapter_count) VALUES
(81, 'REV', '{"am":"ራእይ ዮሐንስ","en":"Revelation"}',    'NT', 'apocalypse', 22);
