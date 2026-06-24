-- ============================================================================
-- MIGRATION: Allow users to update their own donations' is_anonymous field
-- ============================================================================
-- This migration replaces the blanket "Users cannot update donations" policy
-- with a policy that allows users to update their own donations.
-- Note: While RLS cannot restrict which columns can be updated, the application
-- layer (API) should only allow updating the is_anonymous field.

-- Drop the old restrictive policy
drop policy if exists "Users cannot update donations" on public.donations;

-- Create a new policy that allows users to update their own donations
-- The application layer should restrict updates to only is_anonymous field
create policy "Users can update their own donations"
  on public.donations
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

comment on policy "Users can update their own donations" on public.donations is 
  'Allows users to update their own donations. Application should restrict to is_anonymous field only.';

