-- =====================================================================
-- Donation category colors
-- =====================================================================
-- Sets the `color` column on each donation category so the donate UI can
-- tint cause cards / CTAs by type straight from the DB (the client falls
-- back to a name-keyed palette only when `color` is absent).
--
-- `donation_categories.name` is a plain `text` column (see migration
-- 20260428000001_drop_jsonb_localization.sql). Matching is case-insensitive
-- via ILIKE so it is robust to casing / wording variations, and every
-- statement is a plain UPDATE, so this migration is idempotent and safe to
-- re-run.
--
-- Core mapping:
--   • Education -> #D89432 (amber/orange)
--   • Church    -> #1a428a (navy/blue)
--   • Community -> #1F9D55 (green)
-- Other existing categories get distinct, accessible accents (white CTA
-- text stays legible):
--   • Food   -> #C2410C (burnt orange)
--   • Health -> #0E7C86 (teal)
-- =====================================================================

BEGIN;

UPDATE public.donation_categories
SET color = '#D89432'
WHERE name ILIKE '%educat%' OR name ILIKE '%school%';

UPDATE public.donation_categories
SET color = '#1a428a'
WHERE name ILIKE '%church%';

UPDATE public.donation_categories
SET color = '#1F9D55'
WHERE name ILIKE '%communit%';

UPDATE public.donation_categories
SET color = '#C2410C'
WHERE name ILIKE '%food%';

UPDATE public.donation_categories
SET color = '#0E7C86'
WHERE name ILIKE '%health%';

COMMIT;
