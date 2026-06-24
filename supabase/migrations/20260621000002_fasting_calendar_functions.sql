/*
 * Migration: Fasting calendar query RPCs (public read, STABLE)
 * ============================================================================
 *   • _fasting_is_weekly_excluded(d, rules, eth_year) -> boolean   (internal)
 *   • get_active_fasts(d date)        -> rows of fasts active on d
 *   • is_fasting_day(d date)          -> boolean
 *   • get_fasts_in_range(start, end)  -> per-date status for the month grid
 *
 * WED/FRI "DEFAULT FAST WITH EXCLUSION WINDOWS" MODEL
 * --------------------------------------------------------------------------
 * In the Ethiopian Orthodox tradition, *every* Wednesday & Friday is a
 * fasting day BY DEFAULT, with seasonal exceptions — rather than enumerating
 * each Wed/Fri, we model a single weekly fast template plus exclusion windows
 * stored in its `rules`:
 *   • exclude_after_easter_days: Wed/Fri fasting is LIFTED for ~50 days after
 *     Tinsae (Easter) through Pentecost. Easter for a given Ethiopian year is
 *     derived from that year's Great Lent (abiy_tsome) occurrence:
 *         Easter Sunday = abiy_tsome.end_gregorian_date + 1 day.
 *   • exclude_fixed_windows: recurring Ethiopian windows (e.g. Gena -> Timket)
 *     where Wed/Fri fasting is also lifted.
 * A Wed/Fri that falls inside any active window is NOT returned as fasting.
 *
 * Author: System
 * Date: 2026-06-21
 */

-- ============================================================================
-- 1. INTERNAL: is a weekly (Wed/Fri) fast lifted on date d?
-- ============================================================================

CREATE OR REPLACE FUNCTION public._fasting_is_weekly_excluded(
  d          date,
  p_rules    jsonb,
  p_eth_year int
) RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  v_after   int;
  v_easter  date;
  v_win     jsonb;
  v_sm      int;
  v_sd      int;
  v_em      int;
  v_ed      int;
  v_start   date;
  v_end     date;
  v_cand    int;
BEGIN
  IF p_rules IS NULL THEN
    RETURN false;
  END IF;

  -- (a) Eastertide window: N days after Tinsae/Easter are NOT fasting.
  v_after := NULLIF(p_rules ->> 'exclude_after_easter_days', '')::int;
  IF v_after IS NOT NULL THEN
    -- Easter Sunday = the day AFTER Great Lent ends, for the Ethiopian year d
    -- belongs to. abiy_tsome's spring Easter sits inside the same Ethiopian
    -- year that owns d (the year runs ~Sep..Sep), so we match on eth_year.
    SELECT fo.end_gregorian_date + 1
      INTO v_easter
      FROM public.fasting_occurrences fo
      JOIN public.fasting_periods fp ON fp.id = fo.fasting_id
     WHERE fp.fasting_key = 'abiy_tsome'
       AND fo.ethiopian_year = p_eth_year
     LIMIT 1;

    IF v_easter IS NOT NULL AND d > v_easter AND d <= (v_easter + v_after) THEN
      RETURN true;
    END IF;
  END IF;

  -- (b) Fixed recurring windows (Ethiopian month/day), e.g. Gena -> Timket.
  IF p_rules ? 'exclude_fixed_windows' THEN
    FOR v_win IN SELECT * FROM jsonb_array_elements(p_rules -> 'exclude_fixed_windows')
    LOOP
      v_sm := (v_win ->> 'start_month')::int;
      v_sd := (v_win ->> 'start_day')::int;
      v_em := (v_win ->> 'end_month')::int;
      v_ed := (v_win ->> 'end_day')::int;

      -- Check the window materialized for both the previous and current
      -- Ethiopian year so dates near the New-Year boundary are covered.
      FOREACH v_cand IN ARRAY ARRAY[p_eth_year - 1, p_eth_year]
      LOOP
        v_start := public.ethiopian_to_gregorian(v_cand, v_sm, v_sd);
        -- If the window wraps past the Ethiopian New Year, end is next year.
        v_end := public.ethiopian_to_gregorian(
          v_cand + CASE WHEN (v_em * 100 + v_ed) < (v_sm * 100 + v_sd) THEN 1 ELSE 0 END,
          v_em, v_ed
        );
        IF d BETWEEN v_start AND v_end THEN
          RETURN true;
        END IF;
      END LOOP;
    END LOOP;
  END IF;

  RETURN false;
END;
$$;

COMMENT ON FUNCTION public._fasting_is_weekly_excluded(date, jsonb, int) IS
  'Internal: TRUE when a weekly (Wed/Fri) fast is lifted on date d by an Eastertide or fixed exclusion window.';


-- ============================================================================
-- 2. get_active_fasts(d) — every fast active on a given Gregorian date
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_active_fasts(d date)
RETURNS TABLE(
  fasting_id        uuid,
  fasting_key       text,
  name              jsonb,
  description       jsonb,
  type              text,
  severity          text,
  is_weekly         boolean,
  rules             jsonb,
  occurrence_start  date,
  occurrence_end    date
)
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  WITH eth AS (
    SELECT public.ethiopian_year_of(d) AS ey
  ),

  -- FIXED fasts: recur on the same Ethiopian month/day. Materialize for the
  -- previous & current Ethiopian year (covers windows spanning the New Year),
  -- then keep the ones whose [start,end] contains d.
  fixed AS (
    SELECT fp.id, fp.fasting_key, fp.name, fp.description, fp.type, fp.severity,
           fp.is_weekly, fp.rules, gen.start_g AS occ_start, gen.end_g AS occ_end
    FROM public.fasting_periods fp
    CROSS JOIN eth
    CROSS JOIN LATERAL (
      SELECT
        public.ethiopian_to_gregorian(cy.cand, fp.start_eth_month, fp.start_eth_day) AS start_g,
        public.ethiopian_to_gregorian(
          cy.cand + CASE
            WHEN (fp.end_eth_month * 100 + fp.end_eth_day)
               < (fp.start_eth_month * 100 + fp.start_eth_day) THEN 1 ELSE 0 END,
          fp.end_eth_month, fp.end_eth_day
        ) AS end_g
      FROM (SELECT unnest(ARRAY[eth.ey - 1, eth.ey]) AS cand) cy
    ) gen
    WHERE fp.type = 'fixed'
      AND d BETWEEN gen.start_g AND gen.end_g
  ),

  -- MOVABLE fasts: read the admin-entered dated instance directly.
  movable AS (
    SELECT fp.id, fp.fasting_key, fp.name, fp.description, fp.type, fp.severity,
           fp.is_weekly, fp.rules,
           fo.start_gregorian_date AS occ_start, fo.end_gregorian_date AS occ_end
    FROM public.fasting_periods fp
    JOIN public.fasting_occurrences fo ON fo.fasting_id = fp.id
    WHERE fp.type = 'movable'
      AND d BETWEEN fo.start_gregorian_date AND fo.end_gregorian_date
  ),

  -- WEEKLY fasts: weekday match minus exclusion windows.
  weekly AS (
    SELECT fp.id, fp.fasting_key, fp.name, fp.description, fp.type, fp.severity,
           fp.is_weekly, fp.rules, NULL::date AS occ_start, NULL::date AS occ_end
    FROM public.fasting_periods fp
    CROSS JOIN eth
    WHERE fp.type = 'weekly'
      AND fp.weekly_days IS NOT NULL
      AND trim(to_char(d, 'Day')) = ANY (fp.weekly_days)
      AND NOT public._fasting_is_weekly_excluded(d, fp.rules, eth.ey)
  )

  SELECT id, fasting_key, name, description, type, severity, is_weekly, rules, occ_start, occ_end
  FROM fixed
  UNION ALL
  SELECT id, fasting_key, name, description, type, severity, is_weekly, rules, occ_start, occ_end
  FROM movable
  UNION ALL
  SELECT id, fasting_key, name, description, type, severity, is_weekly, rules, occ_start, occ_end
  FROM weekly;
$$;

COMMENT ON FUNCTION public.get_active_fasts(date) IS
  'All fasts active on a Gregorian date: fixed (resolved via Ethiopian month/day), movable (via fasting_occurrences), and weekly Wed/Fri minus exclusion windows.';


-- ============================================================================
-- 3. is_fasting_day(d) — true if ANY fast (incl. weekly) is active on d
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_fasting_day(d date)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.get_active_fasts(d));
$$;

COMMENT ON FUNCTION public.is_fasting_day(date) IS
  'TRUE if the date is a fasting day (any major/minor/weekly fast), honoring Wed/Fri exclusion windows.';


-- ============================================================================
-- 4. get_fasts_in_range(start, end) — one row per date for the month grid
--    Calls get_active_fasts once per day via a LATERAL aggregate. `tier` is
--    the highest severity among that day's fasts (major > minor > weekly).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_fasts_in_range(p_start date, p_end date)
RETURNS TABLE(
  d            date,
  is_fasting   boolean,
  tier         text,
  fasting_keys text[],
  names        jsonb
)
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT
    gs.day::date AS d,
    (agg.cnt > 0) AS is_fasting,
    agg.tier,
    agg.fasting_keys,
    COALESCE(agg.names, '[]'::jsonb) AS names
  FROM generate_series(p_start, p_end, interval '1 day') AS gs(day)
  LEFT JOIN LATERAL (
    SELECT
      count(*) AS cnt,
      array_agg(af.fasting_key) AS fasting_keys,
      jsonb_agg(af.name) AS names,
      (array_agg(
        af.severity
        ORDER BY CASE af.severity
          WHEN 'major'  THEN 3
          WHEN 'minor'  THEN 2
          WHEN 'weekly' THEN 1
          ELSE 0
        END DESC
      ))[1] AS tier
    FROM public.get_active_fasts(gs.day::date) af
  ) agg ON true
  ORDER BY gs.day;
$$;

COMMENT ON FUNCTION public.get_fasts_in_range(date, date) IS
  'Per-date fasting status across a range (for the month grid): is_fasting, highest tier, all fast keys, and localized names.';


-- ============================================================================
-- 5. GRANTS — public read access for the calendar UI.
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.get_active_fasts(date)            TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_fasting_day(date)              TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_fasts_in_range(date, date)    TO anon, authenticated;
-- _fasting_is_weekly_excluded is internal; no explicit client grant.
