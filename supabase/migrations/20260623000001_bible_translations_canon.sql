-- ============================================================================
-- BIBLE TRANSLATIONS + ETHIOPIAN ORTHODOX CANON CLEANUP
-- ============================================================================
-- Context: the Ethiopian Orthodox Tewahedo Church does NOT use the KJV English
-- translation, and its canon is 81 books (not the Protestant 66). The app
-- previously surfaced a hard-coded "KJV / AMH" version picker. This migration:
--
--   1. (Re)introduces a `bible_translations` table — it was dropped by
--      20260609000005_bible_reader_redesign.sql when the app hard-coded am/en.
--      The reader stores text/content as JSONB keyed by a short language code
--      (e.g. {"am": …, "en": …}); each translation row's `code` IS that key.
--   2. Seeds exactly THREE active versions and removes/deactivates KJV:
--        • am  — Amharic        (አማርኛ)           — default, Ethiopic script
--        • gez — Ge'ez          (ግዕዝ)            — liturgical, Ethiopic script
--        • en  — English        (translated, NOT KJV) — Latin script
--   3. Ensures the full 81-book Ethiopian Orthodox canon exists and enriches
--      every book name with a Ge'ez (`gez`) title alongside the existing
--      Amharic (`am`) + English (`en`) names — without clobbering any
--      already-present am/en values.
--
-- Idempotent: safe to run multiple times (CREATE TABLE IF NOT EXISTS, guarded
-- inserts via ON CONFLICT, JSONB-merge that preserves existing book names).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TRANSLATIONS TABLE (recreated; dropped in the reader redesign migration)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bible_translations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- `code` doubles as the JSONB language key used in bible_verses.text,
    -- bible_chapters.content and bible_books.name (am / gez / en / …).
    code        TEXT NOT NULL UNIQUE,
    -- Localized display name, e.g. {"am":"አማርኛ","en":"Amharic"}.
    name        JSONB NOT NULL DEFAULT '{}',
    -- Writing system — drives font / shaping decisions on the client.
    script      TEXT NOT NULL DEFAULT 'ethiopic',
    -- Short pill label shown in the version switcher (e.g. AMH / GEZ / ENG).
    short_label TEXT,
    is_default  BOOLEAN NOT NULL DEFAULT false,
    -- Soft on/off switch so a version can be hidden without losing its row.
    is_active   BOOLEAN NOT NULL DEFAULT true,
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public read; writes happen via the service role only.
ALTER TABLE public.bible_translations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'bible_translations'
          AND policyname = 'Public read translations'
    ) THEN
        CREATE POLICY "Public read translations"
            ON public.bible_translations
            FOR SELECT USING (true);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. REMOVE KJV + SEED THE THREE CANONICAL VERSIONS
-- ----------------------------------------------------------------------------
-- Drop any legacy KJV / English-KJV rows. The church does not use the KJV; the
-- English text we ship is an Ethiopian-Orthodox-appropriate modern translation
-- surfaced under the neutral `en` code below.
DELETE FROM public.bible_translations
WHERE code IN ('kjv', 'en-kjv', 'enkjv');

INSERT INTO public.bible_translations
    (code, name, script, short_label, is_default, is_active, sort_order)
VALUES
    ('am',  '{"am":"አማርኛ","en":"Amharic","gez":"አማርኛ"}',                'ethiopic', 'አማ',  true,  true, 1),
    ('gez', '{"am":"ግዕዝ","en":"Ge''ez","gez":"ግዕዝ"}',                    'ethiopic', 'ግዕዝ', false, true, 2),
    ('en',  '{"am":"እንግሊዝኛ","en":"English","gez":"እንግሊዝኛ"}',           'latin',    'ENG', false, true, 3)
ON CONFLICT (code) DO UPDATE SET
    name        = EXCLUDED.name,
    script      = EXCLUDED.script,
    short_label = EXCLUDED.short_label,
    is_default  = EXCLUDED.is_default,
    is_active   = EXCLUDED.is_active,
    sort_order  = EXCLUDED.sort_order;

-- Guarantee a single default (Amharic) even if older rows lingered.
UPDATE public.bible_translations SET is_default = (code = 'am');

-- ----------------------------------------------------------------------------
-- 3. ENSURE THE 81-BOOK ETHIOPIAN ORTHODOX CANON + GE'EZ NAMES
-- ----------------------------------------------------------------------------
-- Full upsert of all 81 books (broad/narrow Ethiopian enumeration: 46 OT +
-- 35 NT). On conflict we MERGE names as `EXCLUDED.name || bible_books.name`
-- so any existing am/en values WIN (verses/content reference them) while the
-- new `gez` title is added. New installs get all three names from scratch.

INSERT INTO public.bible_books
    (book_number, paratext_code, name, testament, category, chapter_count)
VALUES
-- ── OT · Law / Orit (Pentateuch) ─────────────────────────────────────────
(1,  'GEN', '{"am":"ዘፍጥረት","en":"Genesis","gez":"ኦሪት ዘፍጥረት"}',            'OT', 'law', 50),
(2,  'EXO', '{"am":"ዘጸአት","en":"Exodus","gez":"ኦሪት ዘፀአት"}',                'OT', 'law', 40),
(3,  'LEV', '{"am":"ዘሌዋውያን","en":"Leviticus","gez":"ኦሪት ዘሌዋውያን"}',        'OT', 'law', 27),
(4,  'NUM', '{"am":"ዘኍልቊ","en":"Numbers","gez":"ኦሪት ዘኍልቍ"}',               'OT', 'law', 36),
(5,  'DEU', '{"am":"ዘዳግም","en":"Deuteronomy","gez":"ኦሪት ዘዳግም"}',           'OT', 'law', 34),
-- ── OT · History ─────────────────────────────────────────────────────────
(6,  'JOS', '{"am":"ኢያሱ","en":"Joshua","gez":"መጽሐፈ ኢያሱ"}',                 'OT', 'history', 24),
(7,  'JDG', '{"am":"መሳፍንት","en":"Judges","gez":"መጽሐፈ መሣፍንት"}',            'OT', 'history', 21),
(8,  'RUT', '{"am":"ሩት","en":"Ruth","gez":"መጽሐፈ ሩት"}',                     'OT', 'history', 4),
(9,  '1SA', '{"am":"1ኛ ሳሙኤል","en":"1 Samuel","gez":"ቀዳማዊ ሳሙኤል"}',          'OT', 'history', 31),
(10, '2SA', '{"am":"2ኛ ሳሙኤል","en":"2 Samuel","gez":"ካልዕ ሳሙኤል"}',           'OT', 'history', 24),
(11, '1KI', '{"am":"1ኛ ነገሥት","en":"1 Kings","gez":"ቀዳማዊ ነገሥት"}',           'OT', 'history', 22),
(12, '2KI', '{"am":"2ኛ ነገሥት","en":"2 Kings","gez":"ካልዕ ነገሥት"}',            'OT', 'history', 25),
(13, '1CH', '{"am":"1ኛ ዜና መዋዕል","en":"1 Chronicles","gez":"ቀዳማዊ ዜና መዋዕል"}', 'OT', 'history', 29),
(14, '2CH', '{"am":"2ኛ ዜና መዋዕል","en":"2 Chronicles","gez":"ካልዕ ዜና መዋዕል"}',  'OT', 'history', 36),
-- ── OT · Ethiopic-unique (placed per Ethiopian order) ─────────────────────
(15, 'JUB', '{"am":"ኩፋሌ","en":"Jubilees","gez":"መጽሐፈ ኩፋሌ"}',              'OT', 'ethiopic_unique', 50),
(16, 'ENO', '{"am":"ሄኖክ","en":"1 Enoch","gez":"መጽሐፈ ሄኖክ"}',                'OT', 'ethiopic_unique', 108),
-- ── OT · History (Ezra–Nehemiah) ─────────────────────────────────────────
(17, 'EZR', '{"am":"ዕዝራ","en":"Ezra","gez":"መጽሐፈ ዕዝራ"}',                  'OT', 'history', 10),
(18, 'NEH', '{"am":"ነህምያ","en":"Nehemiah","gez":"መጽሐፈ ነህምያ"}',             'OT', 'history', 13),
-- ── OT · Deuterocanon / Ethiopic-unique ──────────────────────────────────
(19, 'EZA', '{"am":"ዕዝራ ሱቱኤል","en":"Ezra Sutuel","gez":"ዕዝራ ሱቱኤል"}',     'OT', 'ethiopic_unique', 16),
(20, '1ES', '{"am":"1ኛ ዕዝራ","en":"1 Esdras","gez":"ቀዳማዊ ዕዝራ"}',           'OT', 'deuterocanon', 9),
(21, 'TOB', '{"am":"ጦቢት","en":"Tobit","gez":"መጽሐፈ ጦቢት"}',                  'OT', 'deuterocanon', 14),
(22, 'JDT', '{"am":"ዮዲት","en":"Judith","gez":"መጽሐፈ ዮዲት"}',                 'OT', 'deuterocanon', 16),
(23, 'ESG', '{"am":"አስቴር","en":"Esther","gez":"መጽሐፈ አስቴር"}',               'OT', 'deuterocanon', 10),
-- ── OT · Meqabyan (Ethiopic-unique, NOT the Maccabees) ────────────────────
(24, '1MQ', '{"am":"1ኛ መቃብያን","en":"1 Meqabyan","gez":"ቀዳማዊ መቃብያን"}',      'OT', 'ethiopic_unique', 36),
(25, '2MQ', '{"am":"2ኛ መቃብያን","en":"2 Meqabyan","gez":"ካልዕ መቃብያን"}',       'OT', 'ethiopic_unique', 20),
(26, '3MQ', '{"am":"3ኛ መቃብያን","en":"3 Meqabyan","gez":"ሣልሳዊ መቃብያን"}',      'OT', 'ethiopic_unique', 10),
-- ── OT · Poetry / Wisdom ─────────────────────────────────────────────────
(27, 'JOB', '{"am":"ኢዮብ","en":"Job","gez":"መጽሐፈ ኢዮብ"}',                    'OT', 'poetry', 42),
(28, 'PSA', '{"am":"መዝሙረ ዳዊት","en":"Psalms","gez":"መዝሙረ ዳዊት"}',           'OT', 'poetry', 151),
(29, 'PRO', '{"am":"ምሳሌ","en":"Proverbs","gez":"መጽሐፈ ምሳሌ"}',               'OT', 'poetry', 24),
(30, 'REP', '{"am":"ተግሣጽ","en":"Reproof","gez":"መጽሐፈ ተግሣጽ"}',             'OT', 'ethiopic_unique', 7),
(31, 'WIS', '{"am":"ጥበበ ሰሎሞን","en":"Wisdom of Solomon","gez":"ጥበበ ሰሎሞን"}', 'OT', 'deuterocanon', 19),
(32, 'ECC', '{"am":"መክብብ","en":"Ecclesiastes","gez":"መጽሐፈ መክብብ"}',         'OT', 'poetry', 12),
(33, 'SNG', '{"am":"መኃልየ ሰሎሞን","en":"Song of Solomon","gez":"መኃልየ መኃልይ"}', 'OT', 'poetry', 8),
(34, 'SIR', '{"am":"ሲራክ","en":"Sirach","gez":"መጽሐፈ ሲራክ"}',                 'OT', 'deuterocanon', 51),
-- ── OT · Major Prophets ──────────────────────────────────────────────────
(35, 'ISA', '{"am":"ኢሳይያስ","en":"Isaiah","gez":"ትንቢተ ኢሳይያስ"}',            'OT', 'prophecy', 66),
(36, 'JER', '{"am":"ኤርምያስ","en":"Jeremiah","gez":"ትንቢተ ኤርምያስ"}',          'OT', 'prophecy', 52),
(37, 'BAR', '{"am":"ባሩክ","en":"Baruch","gez":"መጽሐፈ ባሮክ"}',                 'OT', 'deuterocanon', 5),
(38, 'LAM', '{"am":"ሰቆቃወ ኤርምያስ","en":"Lamentations","gez":"ሰቆቃወ ኤርምያስ"}', 'OT', 'prophecy', 5),
(39, 'LJE', '{"am":"መልእክተ ኤርምያስ","en":"Letter of Jeremiah","gez":"መልእክተ ኤርምያስ"}', 'OT', 'deuterocanon', 1),
(40, '4BA', '{"am":"4ኛ ባሩክ","en":"4 Baruch","gez":"ራብዕ ባሮክ"}',             'OT', 'ethiopic_unique', 9),
(41, 'EZK', '{"am":"ሕዝቅኤል","en":"Ezekiel","gez":"ትንቢተ ሕዝቅኤል"}',           'OT', 'prophecy', 48),
(42, 'DAG', '{"am":"ዳንኤል","en":"Daniel","gez":"ትንቢተ ዳንኤል"}',               'OT', 'prophecy', 14),
-- ── OT · Minor Prophets (Septuagint / Ethiopian order) ────────────────────
(43, 'HOS', '{"am":"ሆሴዕ","en":"Hosea","gez":"ትንቢተ ሆሴዕ"}',                  'OT', 'prophecy', 14),
(44, 'AMO', '{"am":"አሞጽ","en":"Amos","gez":"ትንቢተ አሞጽ"}',                   'OT', 'prophecy', 9),
(45, 'MIC', '{"am":"ሚክያስ","en":"Micah","gez":"ትንቢተ ሚክያስ"}',                'OT', 'prophecy', 7),
(46, 'JOL', '{"am":"ኢዮኤል","en":"Joel","gez":"ትንቢተ ኢዮኤል"}',                'OT', 'prophecy', 3),
(47, 'OBA', '{"am":"አብድዩ","en":"Obadiah","gez":"ትንቢተ አብድዩ"}',              'OT', 'prophecy', 1),
(48, 'JON', '{"am":"ዮናስ","en":"Jonah","gez":"ትንቢተ ዮናስ"}',                 'OT', 'prophecy', 4),
(49, 'NAM', '{"am":"ናሆም","en":"Nahum","gez":"ትንቢተ ናሆም"}',                 'OT', 'prophecy', 3),
(50, 'HAB', '{"am":"ዕንባቆም","en":"Habakkuk","gez":"ትንቢተ ዕንባቆም"}',          'OT', 'prophecy', 3),
(51, 'ZEP', '{"am":"ሶፎንያስ","en":"Zephaniah","gez":"ትንቢተ ሶፎንያስ"}',         'OT', 'prophecy', 3),
(52, 'HAG', '{"am":"ሐጌ","en":"Haggai","gez":"ትንቢተ ሐጌ"}',                   'OT', 'prophecy', 2),
(53, 'ZEC', '{"am":"ዘካርያስ","en":"Zechariah","gez":"ትንቢተ ዘካርያስ"}',         'OT', 'prophecy', 14),
(54, 'MAL', '{"am":"ሚልክያስ","en":"Malachi","gez":"ትንቢተ ሚልክያስ"}',           'OT', 'prophecy', 4),
-- ── NT · Gospels ─────────────────────────────────────────────────────────
(55, 'MAT', '{"am":"ማቴዎስ","en":"Matthew","gez":"ወንጌል ዘማቴዎስ"}',           'NT', 'gospel', 28),
(56, 'MRK', '{"am":"ማርቆስ","en":"Mark","gez":"ወንጌል ዘማርቆስ"}',               'NT', 'gospel', 16),
(57, 'LUK', '{"am":"ሉቃስ","en":"Luke","gez":"ወንጌል ዘሉቃስ"}',                 'NT', 'gospel', 24),
(58, 'JHN', '{"am":"ዮሐንስ","en":"John","gez":"ወንጌል ዘዮሐንስ"}',               'NT', 'gospel', 21),
-- ── NT · History ─────────────────────────────────────────────────────────
(59, 'ACT', '{"am":"የሐዋርያት ሥራ","en":"Acts","gez":"ግብረ ሐዋርያት"}',          'NT', 'history', 28),
-- ── NT · Pauline Epistles ────────────────────────────────────────────────
(60, 'ROM', '{"am":"ሮሜ","en":"Romans","gez":"መልእክተ ጳውሎስ ኀበ ሮሜ"}',         'NT', 'epistle', 16),
(61, '1CO', '{"am":"1ኛ ቆሮንቶስ","en":"1 Corinthians","gez":"ቀዳሚት ቆሮንቶስ"}',   'NT', 'epistle', 16),
(62, '2CO', '{"am":"2ኛ ቆሮንቶስ","en":"2 Corinthians","gez":"ካልዕት ቆሮንቶስ"}',   'NT', 'epistle', 13),
(63, 'GAL', '{"am":"ገላትያ","en":"Galatians","gez":"መልእክተ ገላትያ"}',           'NT', 'epistle', 6),
(64, 'EPH', '{"am":"ኤፌሶን","en":"Ephesians","gez":"መልእክተ ኤፌሶን"}',          'NT', 'epistle', 6),
(65, 'PHP', '{"am":"ፊልጵስዩስ","en":"Philippians","gez":"መልእክተ ፊልጵስዩስ"}',    'NT', 'epistle', 4),
(66, 'COL', '{"am":"ቆላስይስ","en":"Colossians","gez":"መልእክተ ቆላስይስ"}',        'NT', 'epistle', 4),
(67, '1TH', '{"am":"1ኛ ተሰሎንቄ","en":"1 Thessalonians","gez":"ቀዳሚት ተሰሎንቄ"}', 'NT', 'epistle', 5),
(68, '2TH', '{"am":"2ኛ ተሰሎንቄ","en":"2 Thessalonians","gez":"ካልዕት ተሰሎንቄ"}', 'NT', 'epistle', 3),
(69, '1TI', '{"am":"1ኛ ጢሞቴዎስ","en":"1 Timothy","gez":"ቀዳሚት ጢሞቴዎስ"}',      'NT', 'epistle', 6),
(70, '2TI', '{"am":"2ኛ ጢሞቴዎስ","en":"2 Timothy","gez":"ካልዕት ጢሞቴዎስ"}',      'NT', 'epistle', 4),
(71, 'TIT', '{"am":"ቲቶ","en":"Titus","gez":"መልእክተ ቲቶ"}',                    'NT', 'epistle', 3),
(72, 'PHM', '{"am":"ፊልሞና","en":"Philemon","gez":"መልእክተ ፊልሞና"}',           'NT', 'epistle', 1),
(73, 'HEB', '{"am":"ዕብራውያን","en":"Hebrews","gez":"መልእክተ ዕብራውያን"}',       'NT', 'epistle', 13),
-- ── NT · General Epistles ────────────────────────────────────────────────
(74, 'JAS', '{"am":"ያዕቆብ","en":"James","gez":"መልእክተ ያዕቆብ"}',              'NT', 'epistle', 5),
(75, '1PE', '{"am":"1ኛ ጴጥሮስ","en":"1 Peter","gez":"ቀዳሚት ጴጥሮስ"}',          'NT', 'epistle', 5),
(76, '2PE', '{"am":"2ኛ ጴጥሮስ","en":"2 Peter","gez":"ካልዕት ጴጥሮስ"}',          'NT', 'epistle', 3),
(77, '1JN', '{"am":"1ኛ ዮሐንስ","en":"1 John","gez":"ቀዳሚት ዮሐንስ"}',           'NT', 'epistle', 5),
(78, '2JN', '{"am":"2ኛ ዮሐንስ","en":"2 John","gez":"ካልዕት ዮሐንስ"}',           'NT', 'epistle', 1),
(79, '3JN', '{"am":"3ኛ ዮሐንስ","en":"3 John","gez":"ሣልሲት ዮሐንስ"}',           'NT', 'epistle', 1),
(80, 'JUD', '{"am":"ይሁዳ","en":"Jude","gez":"መልእክተ ይሁዳ"}',                  'NT', 'epistle', 1),
-- ── NT · Apocalypse ──────────────────────────────────────────────────────
(81, 'REV', '{"am":"ራእይ ዮሐንስ","en":"Revelation","gez":"ራእየ ዮሐንስ"}',       'NT', 'apocalypse', 22)
ON CONFLICT (book_number) DO UPDATE SET
    -- Preserve any already-stored am/en (verses reference them); add `gez`.
    name          = EXCLUDED.name || public.bible_books.name,
    paratext_code = EXCLUDED.paratext_code,
    testament     = EXCLUDED.testament,
    category      = EXCLUDED.category,
    chapter_count = GREATEST(public.bible_books.chapter_count, EXCLUDED.chapter_count);
