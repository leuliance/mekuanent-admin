-- ============================================================================
-- Drop `has_seen_home_tour` from profiles
-- ----------------------------------------------------------------------------
-- The home-screen onboarding tour is now tracked purely client-side via MMKV.
-- Anonymous users see the tour on first launch; once they log in we no longer
-- need to sync anything server-side, so this column is unused.
--
-- Idempotent: safe to run whether or not the previous "add" migration ever
-- made it to this database.
-- ============================================================================

alter table public.profiles
  drop column if exists has_seen_home_tour;
