/*
 * Migration: Create Referrals/Points System
 * 
 * This migration adds:
 * 1. Points field to profiles table
 * 2. referred_by field to profiles table (tracks who referred this user)
 * 3. referral_code field for unique short shareable codes
 * 4. referrals table to track referral history and point transactions
 */

-- Add points, referred_by, and referral_code to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- Function to generate a unique referral code (8 chars, alphanumeric uppercase)
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Removed confusing chars (0,O,1,I)
    result text := '';
    i integer;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Function to get or create referral code for a user
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_code text;
    v_attempts integer := 0;
    v_max_attempts integer := 10;
BEGIN
    -- Check if user already has a code
    SELECT referral_code INTO v_code
    FROM public.profiles
    WHERE id = p_user_id;
    
    IF v_code IS NOT NULL THEN
        RETURN v_code;
    END IF;
    
    -- Generate a unique code
    LOOP
        v_code := public.generate_referral_code();
        v_attempts := v_attempts + 1;
        
        -- Try to update with the new code
        UPDATE public.profiles
        SET referral_code = v_code
        WHERE id = p_user_id AND referral_code IS NULL;
        
        -- Check if update succeeded (code was unique)
        IF FOUND THEN
            RETURN v_code;
        END IF;
        
        -- Check if another process set the code
        SELECT referral_code INTO v_code
        FROM public.profiles
        WHERE id = p_user_id;
        
        IF v_code IS NOT NULL THEN
            RETURN v_code;
        END IF;
        
        -- Prevent infinite loop
        IF v_attempts >= v_max_attempts THEN
            RAISE EXCEPTION 'Could not generate unique referral code after % attempts', v_max_attempts;
        END IF;
    END LOOP;
END;
$$;

-- Create referrals table for tracking referral history
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points_awarded integer NOT NULL DEFAULT 10,
    status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone DEFAULT now(),
    
    -- Ensure a user can only be referred once
    CONSTRAINT unique_referred_user UNIQUE (referred_id)
);

-- Create indexes for referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at);

-- Create point_transactions table for tracking all point changes
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    type text NOT NULL CHECK (type IN ('referral_bonus', 'signup_bonus', 'donation_reward', 'redemption', 'admin_adjustment')),
    description text,
    reference_id uuid, -- Can reference referral_id, donation_id, etc.
    created_at timestamp with time zone DEFAULT now()
);

-- Create index for point transactions
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON public.point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON public.point_transactions(type);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON public.point_transactions(created_at);

-- Function to award referral points
CREATE OR REPLACE FUNCTION public.process_referral(
    p_referrer_code text,
    p_referred_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referrer_id uuid;
    v_referral_id uuid;
    v_points_to_award integer := 10; -- Points for successful referral
BEGIN
    -- Find referrer by their referral_code (case-insensitive)
    SELECT id INTO v_referrer_id
    FROM public.profiles
    WHERE UPPER(referral_code) = UPPER(p_referrer_code)
    LIMIT 1;
    
    -- Validate referrer exists
    IF v_referrer_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid referral code'
        );
    END IF;
    
    -- Prevent self-referral
    IF v_referrer_id = p_referred_user_id THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Cannot refer yourself'
        );
    END IF;
    
    -- Check if user was already referred
    IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = p_referred_user_id) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User already referred'
        );
    END IF;
    
    -- Check if user already has a referred_by set
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_referred_user_id AND referred_by IS NOT NULL) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User already has a referrer'
        );
    END IF;
    
    -- Create referral record
    INSERT INTO public.referrals (referrer_id, referred_id, points_awarded, status)
    VALUES (v_referrer_id, p_referred_user_id, v_points_to_award, 'completed')
    RETURNING id INTO v_referral_id;
    
    -- Update referred user's profile with referrer
    UPDATE public.profiles
    SET referred_by = v_referrer_id
    WHERE id = p_referred_user_id;
    
    -- Award points to referrer
    UPDATE public.profiles
    SET points = COALESCE(points, 0) + v_points_to_award
    WHERE id = v_referrer_id;
    
    -- Record point transaction
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
        'referrer_id', v_referrer_id
    );
END;
$$;

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals as referrer"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view referrals where they were referred"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referred_id);

-- RLS Policies for point_transactions
CREATE POLICY "Users can view their own point transactions"
    ON public.point_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.generate_referral_code() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_referral_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_referral(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_referral(text, uuid) TO anon;
