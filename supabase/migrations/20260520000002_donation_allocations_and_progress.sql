-- =====================================================================
-- Donation allocations & progress updates
-- =====================================================================
-- Powers the "How gifts are used" allocation card and the
-- "Recent progress" timeline on the redesigned donation detail page.
--
-- Design choices:
--   • Two separate, simple tables instead of stuffing everything into a
--     jsonb column on `donation_campaigns`. Lets a campaign admin add /
--     remove allocations & progress entries individually, and lets us
--     RLS-secure them per church via the existing `is_church_admin`
--     helper used by the donation_campaigns policies.
--   • `donation_allocations` rows do NOT have to sum to 100 — we render
--     the percentages straight as bars. The UI shows whatever the
--     church owner enters. We add a sanity check that each row stays in
--     0–100.
--   • `donation_progress.icon` is a free-text Ionicons name (e.g.
--     "trending-up", "shield-checkmark") so the form on the admin side
--     can let the church pick from a curated list.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donation_allocations (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id     uuid NOT NULL REFERENCES public.donation_campaigns(id)
                       ON DELETE CASCADE,
    title           text NOT NULL,
    percentage      numeric(5, 2) NOT NULL,
    color           text NOT NULL DEFAULT '#1A428A',
    sort_order      int  NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT donation_allocations_pct_range
        CHECK (percentage >= 0 AND percentage <= 100),
    CONSTRAINT donation_allocations_title_not_blank
        CHECK (length(btrim(title)) > 0)
);

COMMENT ON TABLE public.donation_allocations IS
    'How a campaign''s funds will be allocated. Rendered as a stacked breakdown on the donation detail page.';

CREATE INDEX IF NOT EXISTS donation_allocations_campaign_idx
    ON public.donation_allocations (campaign_id, sort_order);


CREATE TABLE IF NOT EXISTS public.donation_progress (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id     uuid NOT NULL REFERENCES public.donation_campaigns(id)
                       ON DELETE CASCADE,
    title           text NOT NULL,
    description     text,
    icon            text NOT NULL DEFAULT 'shield-checkmark',
    icon_color      text,
    is_highlight    boolean NOT NULL DEFAULT false,
    happened_at     timestamptz NOT NULL DEFAULT now(),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT donation_progress_title_not_blank
        CHECK (length(btrim(title)) > 0)
);

COMMENT ON TABLE public.donation_progress IS
    'Per-campaign progress updates shown in the "Recent progress" timeline on the donation detail page.';

CREATE INDEX IF NOT EXISTS donation_progress_campaign_recent_idx
    ON public.donation_progress (campaign_id, happened_at DESC);

-- ---------------------------------------------------------------------
-- 2. updated_at triggers (reuse the existing helper).
-- ---------------------------------------------------------------------
DROP TRIGGER IF EXISTS donation_allocations_updated_at ON public.donation_allocations;
CREATE TRIGGER donation_allocations_updated_at
    BEFORE UPDATE ON public.donation_allocations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS donation_progress_updated_at ON public.donation_progress;
CREATE TRIGGER donation_progress_updated_at
    BEFORE UPDATE ON public.donation_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------
-- 3. RLS — public read, church admins write.
-- ---------------------------------------------------------------------
ALTER TABLE public.donation_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_progress    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "donation_allocations_public_read" ON public.donation_allocations;
CREATE POLICY "donation_allocations_public_read"
    ON public.donation_allocations FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "donation_progress_public_read" ON public.donation_progress;
CREATE POLICY "donation_progress_public_read"
    ON public.donation_progress FOR SELECT
    USING (true);

-- Church admins / owners can manage allocations & progress for their
-- own campaigns. We piggy-back on the existing `is_church_admin` helper
-- that the donation_campaigns policies already use.
DROP POLICY IF EXISTS "donation_allocations_admin_write" ON public.donation_allocations;
CREATE POLICY "donation_allocations_admin_write"
    ON public.donation_allocations FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.donation_campaigns dc
            WHERE dc.id = donation_allocations.campaign_id
              AND public.is_church_admin(auth.uid(), dc.church_id)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.donation_campaigns dc
            WHERE dc.id = donation_allocations.campaign_id
              AND public.is_church_admin(auth.uid(), dc.church_id)
        )
    );

DROP POLICY IF EXISTS "donation_progress_admin_write" ON public.donation_progress;
CREATE POLICY "donation_progress_admin_write"
    ON public.donation_progress FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.donation_campaigns dc
            WHERE dc.id = donation_progress.campaign_id
              AND public.is_church_admin(auth.uid(), dc.church_id)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.donation_campaigns dc
            WHERE dc.id = donation_progress.campaign_id
              AND public.is_church_admin(auth.uid(), dc.church_id)
        )
    );

GRANT SELECT ON public.donation_allocations TO authenticated, anon;
GRANT SELECT ON public.donation_progress    TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.donation_allocations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.donation_progress    TO authenticated;

-- ---------------------------------------------------------------------
-- 4. Seed sample data for already-seeded active campaigns so the
--    redesigned detail page has something to render in dev.
-- ---------------------------------------------------------------------
DO $$
DECLARE
    camp RECORD;
    palette text[] := ARRAY[
        '#102445',  -- brand navy
        '#F0892A',  -- orange
        '#0E8E5A',  -- green
        '#9CA3AF'   -- neutral
    ];
    allocations text[][] := ARRAY[
        ARRAY['Student scholarships',        '60'],
        ARRAY['Books and classroom materials','25'],
        ARRAY['Teacher support',             '10'],
        ARRAY['Admin and reporting',          '5']
    ];
    i int;
BEGIN
    FOR camp IN
        SELECT id FROM public.donation_campaigns
        WHERE status = 'active'
    LOOP
        -- Only seed if this campaign has nothing yet.
        IF NOT EXISTS (
            SELECT 1 FROM public.donation_allocations
            WHERE campaign_id = camp.id
        ) THEN
            FOR i IN 1..array_length(allocations, 1) LOOP
                INSERT INTO public.donation_allocations
                    (campaign_id, title, percentage, color, sort_order)
                VALUES (
                    camp.id,
                    allocations[i][1],
                    allocations[i][2]::numeric,
                    palette[i],
                    i
                );
            END LOOP;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM public.donation_progress
            WHERE campaign_id = camp.id
        ) THEN
            INSERT INTO public.donation_progress
                (campaign_id, title, description, icon, is_highlight, happened_at)
            VALUES
                (
                    camp.id,
                    'School kits prepared',
                    '120 learning kits have been priced and reserved with local suppliers.',
                    'trending-up',
                    true,
                    now()
                ),
                (
                    camp.id,
                    'Church review complete',
                    'Holy Trinity Development Fund approved the campaign receiver details.',
                    'shield-checkmark',
                    false,
                    now() - interval '2 days'
                ),
                (
                    camp.id,
                    'Teacher list verified',
                    'Partner educators submitted the first classroom support plan.',
                    'checkmark-circle',
                    false,
                    now() - interval '5 days'
                );
        END IF;
    END LOOP;
END;
$$;

COMMIT;
