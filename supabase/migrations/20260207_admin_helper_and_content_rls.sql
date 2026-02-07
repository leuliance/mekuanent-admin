-- ============================================================
-- Migration 2: Create is_admin helper and content_items RLS
-- Must run AFTER the 'admin' enum value has been committed.
-- ============================================================

-- 1. Create helper function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = check_user_id
      AND role = 'admin'
  );
$$;

-- 2. Super admins can do everything on content_items
CREATE POLICY "Super admins have full access to content"
  ON public.content_items
  FOR ALL
  TO authenticated
  USING (
    public.is_super_admin(auth.uid())
  )
  WITH CHECK (
    public.is_super_admin(auth.uid())
  );

-- 3. Admins can do everything on content_items
CREATE POLICY "Admins have full access to content"
  ON public.content_items
  FOR ALL
  TO authenticated
  USING (
    public.is_admin(auth.uid())
  )
  WITH CHECK (
    public.is_admin(auth.uid())
  );
