-- ============================================================================
-- REVERT: RBAC custom claims test (undoes 20260609000001_rbac_custom_claims.sql)
-- ============================================================================
-- IMPORTANT: Disable the hook FIRST, otherwise dropping the function fails
-- because it is still referenced by Auth:
--   Dashboard > Authentication > Hooks > Custom Access Token  -> disable / clear
--
-- This filename has no migration timestamp on purpose, so `supabase migration
-- up` will not auto-apply it. Run it manually in the SQL editor when needed.
-- Nothing in the original migration touched existing tables/enums, so reverting
-- leaves the prior schema exactly as it was.
-- ============================================================================

-- Test table + its policies (cascade drops the policies that use authorize()).
drop table if exists public.rbac_test cascade;

-- Functions (drop authorize before app_permission type it depends on).
drop function if exists public.authorize(public.app_permission);
drop function if exists public.custom_access_token_hook(jsonb);
drop function if exists public.map_user_role_to_app_role(public.user_role);

-- Policies added to existing / new tables.
drop policy if exists "authenticated can read role_permissions" on public.role_permissions;
drop policy if exists "auth admin can read role_permissions" on public.role_permissions;
drop policy if exists "auth admin can read user_roles" on public.user_roles;

-- role_permissions table (drop before the enums it references).
drop table if exists public.role_permissions cascade;

-- Enums.
drop type if exists public.app_permission;
drop type if exists public.app_role;

-- Grants added to the auth admin (harmless to leave, removed for completeness).
revoke select on public.user_roles from supabase_auth_admin;
