/*
 * Migration: Configurable referral reward points
 *
 * 1. Adds an `app_settings` key (`referral_points_per_signup`) so super-admins
 *    can configure the wallet points awarded for each successful referral from
 *    the in-app Admin → App settings screen.
 * 2. Rewrites `process_referral` to read the award amount from that setting
 *    (instead of the previous hard-coded 10) and hardens the de-dup checks so
 *    a given person can only ever be counted as a referral once.
 * 3. Adds `lookup_referral_code` so the invite landing screen can safely show
 *    "<name> invited you" without exposing the whole profiles table.
 *
 * After running this on Supabase, regenerate types:
 *   bunx supabase gen types typescript --project-id <ref> > src/types/database.types.ts
 */

-- 1. Seed the configurable points-per-referral setting (idempotent) ──────────
INSERT INTO public.app_settings (key, value, description)
VALUES (
    'referral_points_per_signup',
    '10'::jsonb,
    'Wallet points awarded to the referrer when a new user joins via their referral code or invite link.'
)
ON CONFLICT (key) DO NOTHING;

-- 2. Hardened, settings-driven referral processor ───────────────────────────
CREATE OR REPLACE FUNCTION public.process_referral(
    p_referrer_code text,
    p_referred_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_referrer_id uuid;
    v_referrer_name text;
    v_referral_id uuid;
    v_points_to_award integer;
BEGIN
    -- Resolve the configurable award amount (fallback 10 if unset/invalid).
    BEGIN
        SELECT (value #>> '{}')::integer
        INTO v_points_to_award
        FROM public.app_settings
        WHERE key = 'referral_points_per_signup';
    EXCEPTION WHEN others THEN
        v_points_to_award := NULL;
    END;

    IF v_points_to_award IS NULL OR v_points_to_award < 0 THEN
        v_points_to_award := 10;
    END IF;

    -- The referred user must already have a real profile. Anonymous guest
    -- sessions have no profiles row, so this naturally defers awarding until
    -- the user actually signs up.
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_referred_user_id) THEN
        RETURN json_build_object('success', false, 'error', 'Referred user has no profile yet');
    END IF;

    -- Find referrer by their referral_code (case-insensitive) + display name.
    SELECT
        id,
        COALESCE(
            NULLIF(TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')), ''),
            'A friend'
        )
    INTO v_referrer_id, v_referrer_name
    FROM public.profiles
    WHERE UPPER(referral_code) = UPPER(p_referrer_code)
    LIMIT 1;

    IF v_referrer_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Invalid referral code');
    END IF;

    -- Guard: no self-referral.
    IF v_referrer_id = p_referred_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Cannot refer yourself');
    END IF;

    -- Guard: the same person can only ever be referred once.
    IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = p_referred_user_id) THEN
        RETURN json_build_object('success', false, 'error', 'User already referred');
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = p_referred_user_id AND referred_by IS NOT NULL
    ) THEN
        RETURN json_build_object('success', false, 'error', 'User already has a referrer');
    END IF;

    -- Record the referral.
    INSERT INTO public.referrals (referrer_id, referred_id, points_awarded, status)
    VALUES (v_referrer_id, p_referred_user_id, v_points_to_award, 'completed')
    RETURNING id INTO v_referral_id;

    -- Link the referred user to their referrer.
    UPDATE public.profiles
    SET referred_by = v_referrer_id
    WHERE id = p_referred_user_id;

    -- Award the configured points to the referrer.
    UPDATE public.profiles
    SET points = COALESCE(points, 0) + v_points_to_award
    WHERE id = v_referrer_id;

    -- Ledger entry.
    INSERT INTO public.point_transactions (user_id, amount, type, description, reference_id)
    VALUES (
        v_referrer_id,
        v_points_to_award,
        'referral_bonus',
        'Points for referring a new user',
        v_referral_id
    );

    RETURN json_build_object(
        'success', true,
        'referral_id', v_referral_id,
        'points_awarded', v_points_to_award,
        'referrer_id', v_referrer_id,
        'referrer_name', v_referrer_name
    );
END;
$$;

-- 3. Public, RLS-safe inviter lookup for the invite landing screen ───────────
CREATE OR REPLACE FUNCTION public.lookup_referral_code(p_code text)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT CASE
        WHEN p.id IS NULL THEN json_build_object('valid', false)
        ELSE json_build_object(
            'valid', true,
            'referrer_id', p.id,
            'referrer_name', COALESCE(
                NULLIF(TRIM(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')), ''),
                'A friend'
            ),
            'referrer_avatar', p.avatar_url
        )
    END
    FROM (SELECT 1) AS dummy
    LEFT JOIN public.profiles p
        ON UPPER(p.referral_code) = UPPER(p_code);
$$;

GRANT EXECUTE ON FUNCTION public.process_referral(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_referral(text, uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.lookup_referral_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.lookup_referral_code(text) TO anon;
