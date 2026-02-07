-- ============================================================
-- User Account Status on profiles + audit log
-- No new 1:1 table needed — just one column on profiles
-- DEFAULT 'active' covers existing rows & new signups automatically
-- ============================================================

-- 1. Create the status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_account_status') THEN
    CREATE TYPE public.user_account_status AS ENUM ('active', 'inactive', 'suspended', 'banned');
  END IF;
END$$;

-- 2. Add status column to profiles (existing rows get 'active' automatically)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status public.user_account_status NOT NULL DEFAULT 'active';

-- 3. Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- 4. Audit trail: track who changed status and why
CREATE TABLE IF NOT EXISTS public.user_status_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  old_status public.user_account_status,
  new_status public.user_account_status NOT NULL,
  reason text DEFAULT NULL,
  changed_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_status_log_user_id ON public.user_status_log(user_id);

ALTER TABLE public.user_status_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view status logs"
  ON public.user_status_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()) OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert status logs"
  ON public.user_status_log
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()));
