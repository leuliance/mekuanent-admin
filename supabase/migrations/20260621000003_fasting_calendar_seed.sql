/*
 * Migration: Seed the Ethiopian Orthodox fasting calendar
 * ============================================================================
 * Inserts the eight core fast TEMPLATES (idempotent via ON CONFLICT on
 * fasting_key) and concrete MOVABLE occurrences for Ethiopian years 2018 EC
 * (Gregorian ~Sep 2025 - Sep 2026) and 2019 EC (so forward dates also work).
 *
 * Date anchors used (Orthodox/Ethiopian liturgical reality):
 *   • Fasika / Tinsae (Easter):  2026-04-12,  2027-05-02
 *   • Pentecost (Easter + 49d):  2026-05-31,  2027-06-20
 *   • Great Lent (Abiy Tsome):   55 days ending Easter eve.
 *   • Nineveh (Tsome Nenewe):    3 days, 2 weeks before Lent (Mon-Wed).
 *   • Apostles (Tsome Hawaryat): Monday after Pentecost -> Hamle 4 (eve of
 *                                Peter & Paul, Hamle 5 = Jul 12).
 *
 * Fixed fasts store only the recurring Ethiopian month/day; the query RPCs
 * resolve the Gregorian dates per requested year. Verified mappings:
 *   Hidar 15  -> Nov 24   Tahsas 28 -> Jan 06   Tahsas 29 (Gena) -> Jan 07
 *   Tir 10    -> Jan 18   Tir 11 (Timket) -> Jan 19   Nehase 1 -> Aug 07
 *
 * Author: System
 * Date: 2026-06-21
 */

-- ============================================================================
-- 0. RESET — drop everything we currently have so re-running this seed always
--    yields a clean, deterministic dataset. fasting_occurrences is removed via
--    the ON DELETE CASCADE from fasting_periods, but we truncate both
--    explicitly for clarity.
-- ============================================================================

TRUNCATE TABLE public.fasting_occurrences, public.fasting_periods CASCADE;

-- Defensive: if an earlier version of the schema created notes as text, widen
-- it to jsonb. Safe no-op when already jsonb; runs against zero rows here.
ALTER TABLE public.fasting_occurrences
  ALTER COLUMN notes TYPE jsonb USING notes::jsonb;


-- ============================================================================
-- 1. FAST TEMPLATES
-- ============================================================================

INSERT INTO public.fasting_periods
  (fasting_key, name, description, type, severity, is_weekly, weekly_days,
   rules, start_eth_month, start_eth_day, end_eth_month, end_eth_day,
   duration_days, sort_order)
VALUES
  -- ── Great Lent / Abiy Tsome (Hudade) — 55 days, MOVABLE, major ──────────
  ('abiy_tsome',
   jsonb_build_object('am', 'ዐቢይ ጾም', 'en', 'Great Lent'),
   jsonb_build_object(
     'am', 'የጌታችን ጾም፤ ለ55 ቀናት የሚቆይ ታላቅ ጾም በትንሣኤ የሚጠናቀቅ።',
     'en', 'The 55-day Great Fast (Hudade) of Our Lord, ending at the Resurrection (Fasika).'),
   'movable', 'major', false, NULL,
   '{}'::jsonb, NULL, NULL, NULL, NULL, 55, 10),

  -- ── Fast of Nineveh / Tsome Nenewe — 3 days, MOVABLE, minor ─────────────
  ('nineveh',
   jsonb_build_object('am', 'ጾመ ነነዌ', 'en', 'Fast of Nineveh'),
   jsonb_build_object(
     'am', 'የነነዌ ሰዎች ንስሐ የሚታሰብበት የሦስት ቀን ጾም፤ ከዐቢይ ጾም ሁለት ሳምንት በፊት።',
     'en', 'A three-day fast recalling the repentance of Nineveh, two weeks before Great Lent.'),
   'movable', 'minor', false, NULL,
   '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 20),

  -- ── Fast of the Apostles / Tsome Hawaryat — MOVABLE, major ──────────────
  ('apostles',
   jsonb_build_object('am', 'ጾመ ሐዋርያት', 'en', 'Fast of the Apostles'),
   jsonb_build_object(
     'am', 'ከጰራቅሊጦስ (በዓለ ሃምሳ) ማግሥት ጀምሮ እስከ ጴጥሮስ ወጳውሎስ የሚጾም ጾም።',
     'en', 'Begins the day after Pentecost and runs until the feast of Peter & Paul.'),
   'movable', 'major', false, NULL,
   '{}'::jsonb, NULL, NULL, NULL, NULL, NULL, 30),

  -- ── Fast of the Prophets / Nativity (Tsome Nebiyat) — FIXED, major ──────
  --    Hidar 15 (~Nov 24) -> Tahsas 28 (Jan 6, Christmas eve).
  ('nativity',
   jsonb_build_object('am', 'ጾመ ነቢያት', 'en', 'Fast of the Prophets (Nativity Fast)'),
   jsonb_build_object(
     'am', 'ለልደተ ክርስቶስ (ገና) ዝግጅት የሚደረግበት ጾም፤ ከኅዳር 15 እስከ ታኅሣሥ 28።',
     'en', 'The Advent fast preparing for the Nativity (Gena), Hidar 15 to Tahsas 28.'),
   'fixed', 'major', false, NULL,
   '{}'::jsonb, 3, 15, 4, 28, 43, 40),

  -- ── Filseta / Assumption — FIXED, major — Nehase 1..15 (~Aug 7..21) ─────
  ('filseta',
   jsonb_build_object('am', 'ጾመ ፍልሰታ', 'en', 'Fast of the Assumption (Filseta)'),
   jsonb_build_object(
     'am', 'የእመቤታችን ቅድስት ድንግል ማርያም ዕረፍት የሚታሰብበት የ15 ቀን ጾም፤ ነሐሴ 1 እስከ 15።',
     'en', 'The 15-day fast for the Dormition of the Theotokos, Nehase 1 to 15.'),
   'fixed', 'major', false, NULL,
   '{}'::jsonb, 12, 1, 12, 15, 15, 50),

  -- ── Gena eve (Gahad of the Nativity) — FIXED, minor — Tahsas 28 (Jan 6) ─
  --    The strict Christmas-Eve fast (gahad), eve of Gena (Tahsas 29 = Jan 7).
  --    The draft listed "Jan 5"; the canonical eve fast is Jan 6 (Tahsas 28).
  ('gena_eve',
   jsonb_build_object('am', 'ገሐደ ገና', 'en', 'Christmas Eve Fast (Gena)'),
   jsonb_build_object(
     'am', 'የልደተ ክርስቶስ ዋዜማ ጾም (ገሐድ)፤ ታኅሣሥ 28።',
     'en', 'The strict eve fast (gahad) before Christmas, Tahsas 28.'),
   'fixed', 'minor', false, NULL,
   '{}'::jsonb, 4, 28, 4, 28, 1, 60),

  -- ── Timket eve (Ketera) — FIXED, minor — Tir 10 (Jan 18) ────────────────
  ('timket_eve',
   jsonb_build_object('am', 'ገሐደ ጥምቀት', 'en', 'Epiphany Eve Fast (Ketera)'),
   jsonb_build_object(
     'am', 'የጥምቀት ዋዜማ (ከተራ) ጾም፤ ጥር 10።',
     'en', 'The eve fast before Timket (Epiphany), Tir 10.'),
   'fixed', 'minor', false, NULL,
   '{}'::jsonb, 5, 10, 5, 10, 1, 70),

  -- ── Weekly Wednesday & Friday — WEEKLY, weekly ──────────────────────────
  --    Default fast all year EXCEPT: 50 days after Easter (Eastertide up to
  --    Pentecost) and the Gena -> Timket window (Tahsas 29 .. Tir 11).
  ('wednesday_friday',
   jsonb_build_object('am', 'ረቡዕ እና ዓርብ', 'en', 'Wednesday & Friday'),
   jsonb_build_object(
     'am', 'በዓመቱ ውስጥ የሚጾሙ የረቡዕና የዓርብ ጾም፤ ከትንሣኤ በኋላ ላሉ 50 ቀናትና ከገና እስከ ጥምቀት ባለው ጊዜ በስተቀር።',
     'en', 'The default weekly fast on Wednesdays and Fridays, except the 50 days of Eastertide and the Gena-to-Timket period.'),
   'weekly', 'weekly', true, ARRAY['Wednesday', 'Friday'],
   jsonb_build_object(
     'exclude_after_easter_days', 50,
     'exclude_fixed_windows', jsonb_build_array(
       jsonb_build_object('name', 'gena_to_timket',
                          'start_month', 4, 'start_day', 29,
                          'end_month',   5, 'end_day',   11)
     )
   ),
   NULL, NULL, NULL, NULL, NULL, 100)
ON CONFLICT (fasting_key) DO UPDATE SET
  name            = EXCLUDED.name,
  description     = EXCLUDED.description,
  type            = EXCLUDED.type,
  severity        = EXCLUDED.severity,
  is_weekly       = EXCLUDED.is_weekly,
  weekly_days     = EXCLUDED.weekly_days,
  rules           = EXCLUDED.rules,
  start_eth_month = EXCLUDED.start_eth_month,
  start_eth_day   = EXCLUDED.start_eth_day,
  end_eth_month   = EXCLUDED.end_eth_month,
  end_eth_day     = EXCLUDED.end_eth_day,
  duration_days   = EXCLUDED.duration_days,
  sort_order      = EXCLUDED.sort_order,
  updated_at      = now();


-- ============================================================================
-- 2. MOVABLE OCCURRENCES — admin-entered dated instances
-- ----------------------------------------------------------------------------
-- We only author the Gregorian span + a localized note. The Ethiopian
-- year/month/day columns are DERIVED from the Gregorian dates via
-- public.gregorian_to_ethiopian() (LATERAL joins below), so the two calendars
-- can never drift out of sync. Idempotent via ON CONFLICT (fasting_id, year).
--
-- Date anchors (weekday-verified):
--   2018 EC: Fasika 2026-04-12 (Sat eve 04-11), Pentecost 2026-05-31
--            Lent Mon 2026-02-16; Nineveh Mon-Wed 2026-02-02..04
--   2019 EC: Fasika 2027-05-02 (Sat eve 05-01), Pentecost 2027-06-20
--            Lent Mon 2027-03-08; Nineveh Mon-Wed 2027-02-22..24
--   Apostles ends Hamle 4 (eve of Peter & Paul, Hamle 5) = Jul 11 both years.
-- ============================================================================

-- Ethiopian year 2018 EC (Easter 2026-04-12, Pentecost 2026-05-31)
INSERT INTO public.fasting_occurrences
  (fasting_id, ethiopian_year, start_gregorian_date, end_gregorian_date,
   start_eth_year, start_eth_month, start_eth_day,
   end_eth_year, end_eth_month, end_eth_day, notes)
SELECT fp.id, 2018, v.start_g, v.end_g,
       s.year, s.month, s.day,
       e.year, e.month, e.day,
       v.notes
FROM (VALUES
  ('nineveh',    DATE '2026-02-02', DATE '2026-02-04',
     jsonb_build_object(
       'am', 'ጾመ ነነዌ (ሰኞ–ረቡዕ)፤ ከዐቢይ ጾም ሁለት ሳምንት በፊት።',
       'en', 'Nineveh fast (Mon-Wed), two weeks before Great Lent.')),
  ('abiy_tsome', DATE '2026-02-16', DATE '2026-04-11',
     jsonb_build_object(
       'am', 'የ55 ቀን ዐቢይ ጾም፤ በትንሣኤ ዋዜማ (ፋሲካ 2026-04-12) ይጠናቀቃል።',
       'en', '55-day Great Lent; ends Easter eve (Fasika 2026-04-12).')),
  ('apostles',   DATE '2026-06-01', DATE '2026-07-11',
     jsonb_build_object(
       'am', 'ከጰራቅሊጦስ (2026-05-31) ማግሥት እስከ ሐምሌ 4 (የጴጥሮስ ወጳውሎስ ዋዜማ)።',
       'en', 'Day after Pentecost (2026-05-31) to Hamle 4 (eve of Peter & Paul).'))
) AS v(key, start_g, end_g, notes)
JOIN public.fasting_periods fp ON fp.fasting_key = v.key
CROSS JOIN LATERAL public.gregorian_to_ethiopian(v.start_g) AS s
CROSS JOIN LATERAL public.gregorian_to_ethiopian(v.end_g)   AS e
ON CONFLICT (fasting_id, ethiopian_year) DO UPDATE SET
  start_gregorian_date = EXCLUDED.start_gregorian_date,
  end_gregorian_date   = EXCLUDED.end_gregorian_date,
  start_eth_year       = EXCLUDED.start_eth_year,
  start_eth_month      = EXCLUDED.start_eth_month,
  start_eth_day        = EXCLUDED.start_eth_day,
  end_eth_year         = EXCLUDED.end_eth_year,
  end_eth_month        = EXCLUDED.end_eth_month,
  end_eth_day          = EXCLUDED.end_eth_day,
  notes                = EXCLUDED.notes,
  updated_at           = now();

-- Ethiopian year 2019 EC (Easter 2027-05-02, Pentecost 2027-06-20)
INSERT INTO public.fasting_occurrences
  (fasting_id, ethiopian_year, start_gregorian_date, end_gregorian_date,
   start_eth_year, start_eth_month, start_eth_day,
   end_eth_year, end_eth_month, end_eth_day, notes)
SELECT fp.id, 2019, v.start_g, v.end_g,
       s.year, s.month, s.day,
       e.year, e.month, e.day,
       v.notes
FROM (VALUES
  ('nineveh',    DATE '2027-02-22', DATE '2027-02-24',
     jsonb_build_object(
       'am', 'ጾመ ነነዌ (ሰኞ–ረቡዕ)፤ ከዐቢይ ጾም ሁለት ሳምንት በፊት።',
       'en', 'Nineveh fast (Mon-Wed), two weeks before Great Lent.')),
  ('abiy_tsome', DATE '2027-03-08', DATE '2027-05-01',
     jsonb_build_object(
       'am', 'የ55 ቀን ዐቢይ ጾም፤ በትንሣኤ ዋዜማ (ፋሲካ 2027-05-02) ይጠናቀቃል።',
       'en', '55-day Great Lent; ends Easter eve (Fasika 2027-05-02).')),
  ('apostles',   DATE '2027-06-21', DATE '2027-07-11',
     jsonb_build_object(
       'am', 'ከጰራቅሊጦስ (2027-06-20) ማግሥት እስከ ሐምሌ 4 (የጴጥሮስ ወጳውሎስ ዋዜማ)።',
       'en', 'Day after Pentecost (2027-06-20) to Hamle 4 (eve of Peter & Paul).'))
) AS v(key, start_g, end_g, notes)
JOIN public.fasting_periods fp ON fp.fasting_key = v.key
CROSS JOIN LATERAL public.gregorian_to_ethiopian(v.start_g) AS s
CROSS JOIN LATERAL public.gregorian_to_ethiopian(v.end_g)   AS e
ON CONFLICT (fasting_id, ethiopian_year) DO UPDATE SET
  start_gregorian_date = EXCLUDED.start_gregorian_date,
  end_gregorian_date   = EXCLUDED.end_gregorian_date,
  start_eth_year       = EXCLUDED.start_eth_year,
  start_eth_month      = EXCLUDED.start_eth_month,
  start_eth_day        = EXCLUDED.start_eth_day,
  end_eth_year         = EXCLUDED.end_eth_year,
  end_eth_month        = EXCLUDED.end_eth_month,
  end_eth_day          = EXCLUDED.end_eth_day,
  notes                = EXCLUDED.notes,
  updated_at           = now();


-- ============================================================================
-- 3. SAMPLE QUERIES (run these after `supabase gen types`)
-- ----------------------------------------------------------------------------
-- -- Conversion sanity checks (expect the commented results):
-- SELECT public.ethiopian_to_gregorian(2018, 1, 1);    -- 2025-09-11
-- SELECT public.ethiopian_to_gregorian(2018, 4, 29);   -- 2026-01-07 (Gena)
-- SELECT * FROM public.gregorian_to_ethiopian(DATE '2026-01-01'); -- (2018,4,23)
--
-- -- What fasts are active today?
-- SELECT fasting_key, name->>'am' AS am, severity, occurrence_start, occurrence_end
--   FROM public.get_active_fasts(current_date);
--   -- On 2026-06-20 (within the Apostles' Fast) -> returns 'apostles'.
--
-- -- Is today a fasting day?
-- SELECT public.is_fasting_day(current_date);
--
-- -- A Wednesday in Eastertide is NOT a fasting day (exclusion window):
-- SELECT public.is_fasting_day(DATE '2026-05-13');  -- false (Wed, post-Easter)
-- -- A Wednesday outside any exclusion IS a fasting day:
-- SELECT public.is_fasting_day(DATE '2026-10-07');  -- true  (ordinary Wed)
--
-- -- Month grid for the current month (color days by tier in the UI):
-- SELECT d, is_fasting, tier, fasting_keys
--   FROM public.get_fasts_in_range(date_trunc('month', current_date)::date,
--                                  (date_trunc('month', current_date)
--                                    + interval '1 month - 1 day')::date);
-- ============================================================================
