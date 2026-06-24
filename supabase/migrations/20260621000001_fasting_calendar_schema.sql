/*
 * Migration: Ethiopian Orthodox Tewahedo Fasting Calendar — schema + calendar math
 * ============================================================================
 * PHASE 1 (backend only). Delivers:
 *   • Pure-PL/pgSQL Ethiopian <-> Gregorian date conversion (NO dependency on
 *     the pg_ethiopian_calendar extension, which is NOT available on Supabase).
 *   • `fasting_periods`     — one row per fast TEMPLATE (the recurring rule).
 *   • `fasting_occurrences` — concrete dated instances per Ethiopian year for
 *     MOVABLE fasts (Great Lent, Nineveh, Apostles). This is the table admins
 *     fill in each year ("we input the fasting calendar of the year").
 *   • Indexes, RLS (public read, super-admin write) and a `notify_fasting`
 *     user-preference column for the day-before reminder pipeline.
 *
 * The query RPCs (get_active_fasts / is_fasting_day / get_fasts_in_range) live
 * in 20260621000002. Seed data lives in 20260621000003. The reminder cron job
 * lives in 20260621000004.
 *
 * Multi-language convention (matches the rest of the app): localized strings
 * are jsonb {"am": "...", "en": "...", ...}. Amharic ("am") is REQUIRED on
 * names via a CHECK constraint.
 *
 * Author: System
 * Date: 2026-06-21
 */

-- ============================================================================
-- 0. EXTENSIONS
--    gen_random_uuid() ships with pgcrypto (enabled by default on Supabase).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================================
-- 1. ETHIOPIAN <-> GREGORIAN CONVERSION (pure PL/pgSQL, Amete Mihret era)
-- ----------------------------------------------------------------------------
-- Algorithm: convert through the Julian Day Number (JDN). This is exact for
-- all modern dates and self-corrects the "New Year is Sep 11, or Sep 12 in the
-- year before a Gregorian leap year" rule — we never special-case it.
--
-- Constants:
--   JDN_EPOCH_AMETE_MIHRET = 1723856  (the offset for 1 Meskerem 1 EC). With
--   the formula below, Ethiopian (1,1,1) -> JDN 1724221 -> Aug 27, 8 CE
--   (proleptic Gregorian) == Aug 29, 8 CE Julian, the canonical EOC epoch.
--
-- The Ethiopian year has 13 months: 12 x 30 days + Pagume (month 13) of 5
-- days, or 6 days when (year mod 4 = 3). The JDN math handles Pagume + leap
-- years automatically; no branching required.
--
-- AUDITABLE SAMPLE MAPPINGS (verified by hand against this implementation):
--   ethiopian_to_gregorian(1,    1,  1)  = 0008-08-27  (proleptic, EOC epoch)
--   ethiopian_to_gregorian(2018, 1,  1)  = 2025-09-11  (Meskerem 1, 2018 EC -> New Year)
--   ethiopian_to_gregorian(2019, 1,  1)  = 2026-09-11  (Meskerem 1, 2019 EC)
--   ethiopian_to_gregorian(2018, 4, 29)  = 2026-01-07  (Tahsas 29 = Gena / Christmas)
--   ethiopian_to_gregorian(2018, 5, 11)  = 2026-01-19  (Tir 11 = Timket / Epiphany)
--   ethiopian_to_gregorian(2018, 12, 1)  = 2026-08-07  (Nehase 1 = Filseta start)
--   gregorian_to_ethiopian('2026-01-01') = (2018, 4, 23)  (Tahsas 23, 2018 EC)
-- ============================================================================

-- Ethiopian (year, month, day) -> Gregorian date.
CREATE OR REPLACE FUNCTION public.ethiopian_to_gregorian(
  eth_year  int,
  eth_month int,
  eth_day   int
) RETURNS date
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  jdn int;
  a   int;
  b   int;
  c   int;
  dd  int;
  e   int;
  m   int;
  gy  int;
  gm  int;
  gd  int;
BEGIN
  IF eth_year IS NULL OR eth_month IS NULL OR eth_day IS NULL THEN
    RETURN NULL;
  END IF;

  -- Ethiopian date -> JDN (Amete Mihret). Integer division == floor here
  -- because every operand is positive for any real-world Ethiopian year.
  jdn := 1723856 + 365
       + 365 * (eth_year - 1)
       + (eth_year / 4)
       + 30 * (eth_month - 1)
       + (eth_day - 1);

  -- JDN -> Gregorian (standard Fliegel & Van Flandern algorithm).
  a  := jdn + 32044;
  b  := (4 * a + 3) / 146097;
  c  := a - (146097 * b) / 4;
  dd := (4 * c + 3) / 1461;
  e  := c - (1461 * dd) / 4;
  m  := (5 * e + 2) / 153;
  gd := e - (153 * m + 2) / 5 + 1;
  gm := m + 3 - 12 * (m / 10);
  gy := 100 * b + dd - 4800 + (m / 10);

  RETURN make_date(gy, gm, gd);
END;
$$;

COMMENT ON FUNCTION public.ethiopian_to_gregorian(int, int, int) IS
  'Convert an Ethiopian (Amete Mihret) year/month/day to a Gregorian date via JDN. Pure PL/pgSQL, no extension required.';


-- Gregorian date -> Ethiopian (year, month, day).
CREATE OR REPLACE FUNCTION public.gregorian_to_ethiopian(d date)
RETURNS TABLE(year int, month int, day int)
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  gy     int;
  gm     int;
  gd     int;
  a      int;
  y      int;
  m      int;
  jdn    int;
  ofs    int;  -- offset from the Ethiopian epoch in days
  r      int;
  n      int;
BEGIN
  IF d IS NULL THEN
    RETURN;
  END IF;

  gy := extract(year  FROM d)::int;
  gm := extract(month FROM d)::int;
  gd := extract(day   FROM d)::int;

  -- Gregorian -> JDN.
  a   := (14 - gm) / 12;
  y   := gy + 4800 - a;
  m   := gm + 12 * a - 3;
  jdn := gd + (153 * m + 2) / 5 + 365 * y + (y / 4) - (y / 100) + (y / 400) - 32045;

  -- JDN -> Ethiopian (inverse of the forward formula above).
  ofs   := jdn - 1723856;
  r     := ofs % 1461;
  n     := (r % 365) + 365 * (r / 1460);
  year  := 4 * (ofs / 1461) + (r / 365) - (r / 1460);
  month := (n / 30) + 1;
  day   := (n % 30) + 1;

  RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION public.gregorian_to_ethiopian(date) IS
  'Convert a Gregorian date to Ethiopian (Amete Mihret) year/month/day via JDN. Returns a single row.';


-- Scalar convenience: the Ethiopian YEAR a Gregorian date falls in. Used by
-- the query/exclusion logic so callers do not have to unpack the table fn.
CREATE OR REPLACE FUNCTION public.ethiopian_year_of(d date)
RETURNS int
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT year FROM public.gregorian_to_ethiopian(d);
$$;

COMMENT ON FUNCTION public.ethiopian_year_of(date) IS
  'The Ethiopian (Amete Mihret) year that a given Gregorian date belongs to.';


-- ============================================================================
-- 2. updated_at touch trigger
--    Reuse the project-wide helper if it exists; otherwise create a private
--    one so this migration is self-contained on a fresh database.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fasting_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;


-- ============================================================================
-- 3. TABLE: fasting_periods  (one row per fast TEMPLATE / recurring rule)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.fasting_periods (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stable machine key the app & seeds reference, e.g. 'abiy_tsome',
  -- 'filseta', 'nineveh', 'nativity', 'apostles', 'timket_eve', 'gena_eve',
  -- 'wednesday_friday'.
  fasting_key     text NOT NULL UNIQUE,

  -- Localized name. Amharic ("am") is REQUIRED. May also carry en/ti/or.
  name            jsonb NOT NULL,
  description     jsonb,

  -- How the dates are derived:
  --   'movable' -> dates change yearly, materialized in fasting_occurrences
  --   'fixed'   -> recurs on the same Ethiopian month/day every year
  --   'weekly'  -> recurs on weekday(s), minus seasonal exclusion windows
  type            text NOT NULL,

  -- Drives the calendar legend / day coloring:
  --   'major'  -> "Major fast"
  --   'minor'  -> lesser/eve fasts (still a fast day)
  --   'weekly' -> "Weekly fast" (Wed/Fri)
  -- (Event days come from a separate events table — the "Event day" legend.)
  severity        text NOT NULL,

  is_weekly       boolean NOT NULL DEFAULT false,

  -- English weekday names for weekly fasts, e.g. '{Wednesday,Friday}'.
  -- Matched against trim(to_char(date,'Day')) which yields English in the
  -- 'C' lc_time locale Supabase runs under.
  weekly_days     text[],

  -- Free-form rule bag. Recognized keys (consumed by the query RPCs):
  --   exclude_after_easter_days int   -- Wed/Fri NOT fasting for N days after
  --                                       Tinsae/Easter (the ~50-day Eastertide
  --                                       up to Pentecost).
  --   exclude_fixed_windows jsonb[]   -- [{start_month,start_day,end_month,end_day}]
  --                                       recurring Ethiopian windows where the
  --                                       weekly fast is lifted (e.g. Gena->Timket).
  rules           jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- FIXED fasts: Ethiopian month/day of the (recurring) start & end. Year is
  -- intentionally NOT stored — it is supplied per query year by the RPCs via
  -- ethiopian_to_gregorian(). NULL for movable/weekly fasts.
  start_eth_month int,
  start_eth_day   int,
  end_eth_month   int,
  end_eth_day     int,

  -- Informational nominal length (e.g. 55 for Great Lent). Not used for math.
  duration_days   int,

  -- Display ordering in admin/legend lists.
  sort_order      int NOT NULL DEFAULT 0,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  -- Amharic name is mandatory.
  CONSTRAINT fasting_periods_name_has_am CHECK (name ? 'am'),
  CONSTRAINT fasting_periods_type_chk     CHECK (type IN ('movable', 'fixed', 'weekly')),
  CONSTRAINT fasting_periods_severity_chk CHECK (severity IN ('major', 'minor', 'weekly')),
  CONSTRAINT fasting_periods_eth_month_chk CHECK (
    (start_eth_month IS NULL OR start_eth_month BETWEEN 1 AND 13) AND
    (end_eth_month   IS NULL OR end_eth_month   BETWEEN 1 AND 13)
  ),
  CONSTRAINT fasting_periods_eth_day_chk CHECK (
    (start_eth_day IS NULL OR start_eth_day BETWEEN 1 AND 30) AND
    (end_eth_day   IS NULL OR end_eth_day   BETWEEN 1 AND 30)
  ),
  -- A fixed fast must carry its Ethiopian start/end month+day.
  CONSTRAINT fasting_periods_fixed_dates_chk CHECK (
    type <> 'fixed' OR (
      start_eth_month IS NOT NULL AND start_eth_day IS NOT NULL AND
      end_eth_month   IS NOT NULL AND end_eth_day   IS NOT NULL
    )
  )
);

COMMENT ON TABLE public.fasting_periods IS
  'Ethiopian Orthodox fast TEMPLATES (recurring rules). Movable fasts are dated per year in fasting_occurrences.';
COMMENT ON COLUMN public.fasting_periods.name IS
  'Localized jsonb name; "am" (Amharic) is required (enforced by CHECK).';
COMMENT ON COLUMN public.fasting_periods.rules IS
  'Rule bag. Weekly fasts use exclude_after_easter_days and exclude_fixed_windows to lift Wed/Fri fasting during Eastertide and other non-fasting seasons.';


-- ============================================================================
-- 4. TABLE: fasting_occurrences (admin-entered dated instances per Eth year)
-- ----------------------------------------------------------------------------
-- This is the table that materializes the year's calendar for MOVABLE fasts
-- whose Gregorian dates shift annually. Admins add one row per (fast, year).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.fasting_occurrences (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fasting_id            uuid NOT NULL REFERENCES public.fasting_periods(id) ON DELETE CASCADE,

  -- The Ethiopian year this instance belongs to (e.g. 2018).
  ethiopian_year        int NOT NULL,

  -- Concrete Gregorian span (inclusive) — what the calendar/query uses.
  start_gregorian_date  date NOT NULL,
  end_gregorian_date    date NOT NULL,

  -- Optional Ethiopian breakdown for admin display / auditing.
  start_eth_year        int,
  start_eth_month       int,
  start_eth_day         int,
  end_eth_year          int,
  end_eth_month         int,
  end_eth_day           int,

  -- Localized free-form note jsonb {"am": "...", "en": "..."}; same multi-lang
  -- convention as name/description. Optional.
  notes                 jsonb,

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fasting_occurrences_unique UNIQUE (fasting_id, ethiopian_year),
  CONSTRAINT fasting_occurrences_date_order CHECK (end_gregorian_date >= start_gregorian_date)
);

COMMENT ON TABLE public.fasting_occurrences IS
  'Concrete per-Ethiopian-year dated instances of movable fasts. Admins populate this each year.';
COMMENT ON COLUMN public.fasting_occurrences.ethiopian_year IS
  'Ethiopian (Amete Mihret) year the occurrence belongs to, e.g. 2018.';
COMMENT ON COLUMN public.fasting_occurrences.notes IS
  'Optional localized jsonb note {"am": "...", "en": "..."}; same convention as fasting_periods.name.';


-- updated_at triggers
DROP TRIGGER IF EXISTS trg_fasting_periods_set_updated_at ON public.fasting_periods;
CREATE TRIGGER trg_fasting_periods_set_updated_at
  BEFORE UPDATE ON public.fasting_periods
  FOR EACH ROW EXECUTE FUNCTION public.fasting_set_updated_at();

DROP TRIGGER IF EXISTS trg_fasting_occurrences_set_updated_at ON public.fasting_occurrences;
CREATE TRIGGER trg_fasting_occurrences_set_updated_at
  BEFORE UPDATE ON public.fasting_occurrences
  FOR EACH ROW EXECUTE FUNCTION public.fasting_set_updated_at();


-- ============================================================================
-- 5. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_fasting_periods_type
  ON public.fasting_periods (type);
CREATE INDEX IF NOT EXISTS idx_fasting_periods_severity
  ON public.fasting_periods (severity);

CREATE INDEX IF NOT EXISTS idx_fasting_occurrences_eth_year
  ON public.fasting_occurrences (ethiopian_year);
CREATE INDEX IF NOT EXISTS idx_fasting_occurrences_fasting_id
  ON public.fasting_occurrences (fasting_id);
-- Range lookups for "is date d inside [start,end]" (month-grid queries).
CREATE INDEX IF NOT EXISTS idx_fasting_occurrences_gregorian
  ON public.fasting_occurrences (start_gregorian_date, end_gregorian_date);


-- ============================================================================
-- 6. ROW-LEVEL SECURITY
--    Public (anon + authenticated) may SELECT. Only super admins may write.
--    Mirrors the event_categories / donation_categories policy pattern.
-- ============================================================================

ALTER TABLE public.fasting_periods     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasting_occurrences ENABLE ROW LEVEL SECURITY;

-- fasting_periods --------------------------------------------------------
DROP POLICY IF EXISTS "Fasting periods are viewable by everyone" ON public.fasting_periods;
CREATE POLICY "Fasting periods are viewable by everyone"
  ON public.fasting_periods FOR SELECT
  TO anon, authenticated
  USING ( true );

DROP POLICY IF EXISTS "Super admins can insert fasting periods" ON public.fasting_periods;
CREATE POLICY "Super admins can insert fasting periods"
  ON public.fasting_periods FOR INSERT
  TO authenticated
  WITH CHECK ( (select public.is_super_admin((select auth.uid()))) );

DROP POLICY IF EXISTS "Super admins can update fasting periods" ON public.fasting_periods;
CREATE POLICY "Super admins can update fasting periods"
  ON public.fasting_periods FOR UPDATE
  TO authenticated
  USING ( (select public.is_super_admin((select auth.uid()))) )
  WITH CHECK ( (select public.is_super_admin((select auth.uid()))) );

DROP POLICY IF EXISTS "Super admins can delete fasting periods" ON public.fasting_periods;
CREATE POLICY "Super admins can delete fasting periods"
  ON public.fasting_periods FOR DELETE
  TO authenticated
  USING ( (select public.is_super_admin((select auth.uid()))) );

-- fasting_occurrences ----------------------------------------------------
DROP POLICY IF EXISTS "Fasting occurrences are viewable by everyone" ON public.fasting_occurrences;
CREATE POLICY "Fasting occurrences are viewable by everyone"
  ON public.fasting_occurrences FOR SELECT
  TO anon, authenticated
  USING ( true );

DROP POLICY IF EXISTS "Super admins can insert fasting occurrences" ON public.fasting_occurrences;
CREATE POLICY "Super admins can insert fasting occurrences"
  ON public.fasting_occurrences FOR INSERT
  TO authenticated
  WITH CHECK ( (select public.is_super_admin((select auth.uid()))) );

DROP POLICY IF EXISTS "Super admins can update fasting occurrences" ON public.fasting_occurrences;
CREATE POLICY "Super admins can update fasting occurrences"
  ON public.fasting_occurrences FOR UPDATE
  TO authenticated
  USING ( (select public.is_super_admin((select auth.uid()))) )
  WITH CHECK ( (select public.is_super_admin((select auth.uid()))) );

DROP POLICY IF EXISTS "Super admins can delete fasting occurrences" ON public.fasting_occurrences;
CREATE POLICY "Super admins can delete fasting occurrences"
  ON public.fasting_occurrences FOR DELETE
  TO authenticated
  USING ( (select public.is_super_admin((select auth.uid()))) );


-- ============================================================================
-- 7. PER-USER PREFERENCE: notify_fasting
--    Used by should_send_push('notify_fasting') in the reminder pipeline.
-- ============================================================================

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS notify_fasting boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.user_preferences.notify_fasting IS
  'Opt-in for the day-before fasting reminder push (default on).';


-- ============================================================================
-- 8. GRANTS for the conversion helpers (read-only, safe for clients).
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.ethiopian_to_gregorian(int, int, int) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gregorian_to_ethiopian(date)          TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ethiopian_year_of(date)               TO anon, authenticated;
