-- =====================================================================
-- Donation paths & expanded categories
-- =====================================================================
-- Adds the "Education" and "Community" donation categories that the new
-- Give-tab UI references, then introduces a lightweight `donation_paths`
-- view that surfaces each category alongside the count of active
-- campaigns routed through it. The view powers the "All / Education /
-- Church / Community" tabs in the redesigned donate landing page.
--
-- NOTE: `donation_categories.name` + `description` and
-- `donation_campaigns.title` + `description` are plain `text` columns
-- (see migration 20260428000001_drop_jsonb_localization.sql which
-- collapsed the old JSONB localization). Comparisons therefore use
-- direct text equality / ILIKE rather than the JSONB `->>` operator.
--
-- Backfill rules:
--   • Existing campaigns whose title/description hints at education
--     (school, tuition, learning, books, classroom) are bound to the new
--     Education category.
--   • Campaigns hinting at community (poor, family, orphan, shelter,
--     widow) are bound to the new Community category.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. Add the two new categories.
-- ---------------------------------------------------------------------
INSERT INTO public.donation_categories (name, description, icon, color)
SELECT
    'Education',
    'Support schooling, learning kits, and tuition for students',
    'school',
    '#0EA5E9'
WHERE NOT EXISTS (
    SELECT 1 FROM public.donation_categories WHERE name = 'Education'
);

INSERT INTO public.donation_categories (name, description, icon, color)
SELECT
    'Community',
    'Support widows, orphans, and community outreach',
    'people-circle',
    '#10B981'
WHERE NOT EXISTS (
    SELECT 1 FROM public.donation_categories WHERE name = 'Community'
);

-- ---------------------------------------------------------------------
-- 2. Backfill: assign existing campaigns lacking a category to the new
--    ones based on title/description keyword hints.
-- ---------------------------------------------------------------------
DO $$
DECLARE
    education_cat_id uuid;
    community_cat_id uuid;
BEGIN
    SELECT id INTO education_cat_id
    FROM public.donation_categories WHERE name = 'Education' LIMIT 1;
    SELECT id INTO community_cat_id
    FROM public.donation_categories WHERE name = 'Community' LIMIT 1;

    -- Education matches first (more specific). \m / \M are word
    -- boundaries; Postgres regex flavor.
    UPDATE public.donation_campaigns
    SET category_id = education_cat_id
    WHERE category_id IS NULL
      AND education_cat_id IS NOT NULL
      AND (
        lower(coalesce(title, ''))       ~ '\m(school|tuition|learning|education|book|classroom|student)\M'
        OR lower(coalesce(description, '')) ~ '\m(school|tuition|learning|education|book|classroom|student)\M'
      );

    -- Community matches next (catches everything outreach-related)
    UPDATE public.donation_campaigns
    SET category_id = community_cat_id
    WHERE category_id IS NULL
      AND community_cat_id IS NOT NULL
      AND (
        lower(coalesce(title, ''))       ~ '\m(poor|widow|orphan|family|shelter|community|outreach|needy)\M'
        OR lower(coalesce(description, '')) ~ '\m(poor|widow|orphan|family|shelter|community|outreach|needy)\M'
      );
END;
$$;

-- ---------------------------------------------------------------------
-- 3. donation_paths view — UI grouping for the explore-funds section.
--    A "path" is just a category exposed alongside the count of active
--    campaigns currently routed through it. The view is read-only and
--    sorted by name so the tab list is stable across renders.
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.donation_paths
WITH (security_invoker = true)
AS
SELECT
    c.id,
    c.name,
    c.description,
    c.icon,
    c.color,
    COALESCE(stats.active_campaign_count, 0)::int AS active_campaign_count,
    COALESCE(stats.total_raised, 0)::numeric    AS total_raised,
    COALESCE(stats.total_goal, 0)::numeric      AS total_goal
FROM public.donation_categories c
LEFT JOIN LATERAL (
    SELECT
        COUNT(*)                       AS active_campaign_count,
        SUM(dc.current_amount)         AS total_raised,
        SUM(dc.goal_amount)            AS total_goal
    FROM public.donation_campaigns dc
    WHERE dc.category_id = c.id
      AND dc.status = 'active'
) stats ON true
ORDER BY c.name;

COMMENT ON VIEW public.donation_paths IS
    'Aggregated category view powering the redesigned donate landing page. Each row = one path (category) + a count of campaigns routed through it.';

GRANT SELECT ON public.donation_paths TO authenticated, anon;

-- ---------------------------------------------------------------------
-- 4. RPC: get_donation_paths_with_campaigns(limit_per_path int)
--    Returns each path along with its top campaigns, in one round-trip.
--    Avoids the client doing N+1 queries to populate every tab.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_donation_paths_with_campaigns(
    limit_per_path int DEFAULT 5
)
RETURNS TABLE (
    path_id uuid,
    path_name text,
    path_description text,
    path_icon text,
    path_color text,
    active_campaign_count int,
    campaigns jsonb
)
LANGUAGE sql STABLE
SECURITY INVOKER
AS $$
    SELECT
        p.id,
        p.name,
        p.description,
        p.icon,
        p.color,
        p.active_campaign_count,
        COALESCE(
            (
                SELECT jsonb_agg(camp ORDER BY (camp->>'created_at') DESC)
                FROM (
                    SELECT to_jsonb(dc.*) AS camp
                    FROM public.donation_campaigns dc
                    WHERE dc.category_id = p.id
                      AND dc.status = 'active'
                    ORDER BY dc.created_at DESC
                    LIMIT limit_per_path
                ) sub
            ),
            '[]'::jsonb
        ) AS campaigns
    FROM public.donation_paths p
    ORDER BY p.name;
$$;

COMMENT ON FUNCTION public.get_donation_paths_with_campaigns(int) IS
    'Returns donation paths (categories) with their top N active campaigns embedded as JSONB. Used by the Give landing page.';

GRANT EXECUTE ON FUNCTION public.get_donation_paths_with_campaigns(int) TO authenticated, anon;

COMMIT;
