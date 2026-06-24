-- =============================================================================
--  20260526000001 — Favorite church + anonymous giving + app_settings
-- =============================================================================
--
--  Adds three product capabilities that previously had no backing schema:
--
--   1. **Favorite church** — a single church per user (enforced by a partial
--      unique index on `user_follows.is_favorite`). Replaces the
--      `followedChurches[0]` heuristic the app used as a stand-in.
--
--   2. **Default anonymous giving** — a per-profile preference that the
--      donation form pre-fills with. Users can still flip individual gifts
--      to anonymous in the form, but this is the default.
--
--   3. **app_settings** — a singleton key/value table for global admin
--      configuration (current app version, donation-platform fee %, etc.).
--      Readable by everyone (the app reads `donation_fee_percent` for
--      live pricing display) but only writable by super admins.
-- =============================================================================

-- 1. ── user_follows.is_favorite + one-favorite-per-user invariant ──────────

ALTER TABLE public.user_follows
    ADD COLUMN IF NOT EXISTS is_favorite boolean NOT NULL DEFAULT false;

-- Partial unique index so each user has at most ONE favorite at any time.
CREATE UNIQUE INDEX IF NOT EXISTS user_follows_one_favorite_per_user
    ON public.user_follows (user_id)
    WHERE is_favorite = true;

-- RPC: atomically move the favorite flag from any other follow row to the
-- target church for the calling user. Inserts a follow row if the user
-- isn't already following the church. Returns the new favorite church id.
CREATE OR REPLACE FUNCTION public.set_favorite_church(target_church_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_id uuid := auth.uid();
BEGIN
    IF caller_id IS NULL THEN
        RAISE EXCEPTION 'authentication required';
    END IF;

    -- Make sure the user follows the church (no-op if already following).
    INSERT INTO public.user_follows (user_id, church_id, followed_at, is_favorite)
    VALUES (caller_id, target_church_id, now(), true)
    ON CONFLICT (user_id, church_id) DO NOTHING;

    -- Clear any previous favorite.
    UPDATE public.user_follows
        SET is_favorite = false
        WHERE user_id = caller_id
          AND is_favorite = true
          AND church_id <> target_church_id;

    -- Set the new favorite (covers both the just-inserted row and an
    -- already-existing follow).
    UPDATE public.user_follows
        SET is_favorite = true
        WHERE user_id = caller_id
          AND church_id = target_church_id;

    RETURN target_church_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_favorite_church(uuid) TO authenticated;

-- RPC: clear the current favorite without unfollowing the church.
CREATE OR REPLACE FUNCTION public.clear_favorite_church()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_id uuid := auth.uid();
BEGIN
    IF caller_id IS NULL THEN
        RAISE EXCEPTION 'authentication required';
    END IF;

    UPDATE public.user_follows
        SET is_favorite = false
        WHERE user_id = caller_id
          AND is_favorite = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.clear_favorite_church() TO authenticated;


-- 2. ── profiles.anonymous_giving (donation default) ────────────────────────

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS anonymous_giving boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.anonymous_giving IS
    'Default anonymity setting applied to new donations. Users can override per-gift in the donate form.';


-- 3. ── app_settings (singleton key/value config for super admins) ──────────

CREATE TABLE IF NOT EXISTS public.app_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    description text,
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Everyone (signed-in or not) can READ — the app needs the donation fee
-- percentage and minimum app version on the splash screen.
DROP POLICY IF EXISTS "app_settings_read" ON public.app_settings;
CREATE POLICY "app_settings_read"
    ON public.app_settings
    FOR SELECT
    USING (true);

-- Only super_admin role members can write. Reuses the existing
-- public.user_roles table that's already managed by useUserRole.
-- NB: super_admin rows have church_id IS NULL by design (see the
-- `user_roles_church_required` check constraint).
DROP POLICY IF EXISTS "app_settings_write" ON public.app_settings;
CREATE POLICY "app_settings_write"
    ON public.app_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
              AND ur.role = 'super_admin'::public.user_role
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
              AND ur.role = 'super_admin'::public.user_role
        )
    );

-- Seed sensible defaults so the app never has to handle a missing row.
INSERT INTO public.app_settings (key, value, description) VALUES
    ('app_version',            '"1.0.0"'::jsonb, 'Current published app version (shown on About page).'),
    ('min_supported_version',  '"1.0.0"'::jsonb, 'Lowest version that can still talk to the API.'),
    ('donation_fee_percent',   '5'::jsonb,         'Platform fee percentage skimmed from each successful donation.'),
    ('min_donation_amount',    '50'::jsonb,        'Minimum ETB amount a single donation can be.'),
    ('max_donation_amount',    '500000'::jsonb,    'Maximum ETB amount a single donation can be.'),
    ('support_email',          '"support@mekuannent.com"'::jsonb, 'Email shown on the Help & Support screen.'),
    ('support_phone',          '"+251911000000"'::jsonb, 'Phone number shown on the Help & Support screen.')
ON CONFLICT (key) DO NOTHING;
