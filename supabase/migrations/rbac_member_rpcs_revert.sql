-- ============================================================================
-- REVERT: drop the member RPCs (undoes 20260609000003_rbac_member_rpcs.sql)
-- ============================================================================
-- After running this, the client would need to go back to direct user_roles
-- table access for listing members / assigning roles.
-- ============================================================================

drop function if exists public.get_church_members(uuid);
drop function if exists public.assign_member_role(uuid, uuid, public.user_role);
