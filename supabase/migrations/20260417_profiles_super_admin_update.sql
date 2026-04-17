-- Allow super admins to update other users' profiles (ban/unban, moderation).
-- Without this, only "Users can update their own profile" applies, so banning
-- another user succeeds in the API layer (no PostgREST error) but updates 0 rows.

CREATE POLICY "Super admins can update profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));
