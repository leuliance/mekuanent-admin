-- ============================================================================
-- REVERT: restore the original table-only role helpers
-- (undoes 20260609000002_rbac_claims_helpers.sql)
-- ============================================================================
-- Safe to run any time — it simply puts the helpers back to querying the
-- user_roles table directly. No data is touched. Run this BEFORE the
-- rbac_custom_claims_revert.sql if you are tearing the whole feature down.
-- ============================================================================

create or replace function public.is_super_admin(user_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_super_admin.user_id
    and user_roles.role = 'super_admin'
  );
$$;
comment on function public.is_super_admin is 'Returns true if user has super_admin role';

create or replace function public.is_church_admin(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_church_admin.user_id
    and user_roles.church_id = is_church_admin.church_id
    and user_roles.role = 'church_admin'
  );
$$;
comment on function public.is_church_admin is 'Returns true if user is church admin for specific church';

create or replace function public.is_content_admin(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_content_admin.user_id
    and user_roles.church_id = is_content_admin.church_id
    and user_roles.role in ('content_admin', 'church_admin')
  );
$$;
comment on function public.is_content_admin is 'Returns true if user is content admin or church admin for specific church';

create or replace function public.is_content_creator(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_content_creator.user_id
    and user_roles.church_id = is_content_creator.church_id
    and user_roles.role in ('content_creator', 'content_admin', 'church_admin')
  );
$$;
comment on function public.is_content_creator is 'Returns true if user has content creation privileges for specific church';
