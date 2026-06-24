-- ============================================================================
-- RBAC: move the last client-side `user_roles` table access behind RPCs
-- ============================================================================
-- The app no longer reads/writes the user_roles table directly. The two
-- remaining operations are inherently CROSS-user (they act on *other* members,
-- so claims can't express them) and are wrapped here as SECURITY DEFINER RPCs
-- with authorization checked inside:
--
--   * get_church_members(church_id)         -> list a church's members + profile
--   * assign_member_role(user_id, church_id, role) -> grant a role to a member
--
-- Both rely on the claims-powered is_* helpers for authorization. The
-- user_roles table remains the source of truth (admins write it; the
-- custom_access_token_hook projects it into each user's JWT).
-- ============================================================================

-- 1. List church members -----------------------------------------------------
create or replace function public.get_church_members(p_church_id uuid)
returns table (
    id uuid,
    user_id uuid,
    role public.user_role,
    assigned_at timestamptz,
    first_name text,
    last_name text,
    email text,
    avatar_url text,
    phone_number text
)
language plpgsql
security definer
set search_path = ''
stable
as $$
begin
    if not (
        public.is_super_admin((select auth.uid()))
        or public.is_church_admin((select auth.uid()), p_church_id)
        or public.is_content_admin((select auth.uid()), p_church_id)
    ) then
        raise exception 'Not authorized';
    end if;

    return query
    select
        ur.id,
        ur.user_id,
        ur.role,
        ur.assigned_at,
        p.first_name,
        p.last_name,
        p.email,
        p.avatar_url,
        p.phone_number
    from public.user_roles ur
    left join public.profiles p on p.id = ur.user_id
    where ur.church_id = p_church_id
    order by ur.assigned_at desc;
end;
$$;
comment on function public.get_church_members is
    'Lists a church''s members (+ profile). Authorized for super_admin / church_admin / content_admin of the church.';

grant execute on function public.get_church_members(uuid) to authenticated;

-- 2. Assign a role to a member ----------------------------------------------
-- Returns 'already_has_role' or 'role_assigned'. Enforces the role hierarchy:
--   super_admin            -> only a super_admin can grant it
--   church_admin / content_admin -> only church_admin or super_admin can grant
create or replace function public.assign_member_role(
    p_user_id uuid,
    p_church_id uuid,
    p_role public.user_role
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_is_super   boolean := public.is_super_admin((select auth.uid()));
    v_is_church  boolean := public.is_church_admin((select auth.uid()), p_church_id);
    v_is_content boolean := public.is_content_admin((select auth.uid()), p_church_id);
    v_exists     boolean;
begin
    if not (v_is_super or v_is_church or v_is_content) then
        raise exception 'Not authorized';
    end if;

    if p_role = 'super_admin' and not v_is_super then
        raise exception 'Only super admins can assign super_admin';
    end if;

    if p_role in ('church_admin', 'content_admin') and not (v_is_super or v_is_church) then
        raise exception 'Only church admins can assign admin roles';
    end if;

    select exists (
        select 1 from public.user_roles
        where user_id = p_user_id
          and church_id = p_church_id
          and role = p_role
    ) into v_exists;

    if v_exists then
        return 'already_has_role';
    end if;

    insert into public.user_roles (user_id, church_id, role, assigned_by)
    values (p_user_id, p_church_id, p_role, (select auth.uid()));

    return 'role_assigned';
end;
$$;
comment on function public.assign_member_role is
    'Grants a role to a member (server-side, authorized). Returns already_has_role | role_assigned.';

grant execute on function public.assign_member_role(uuid, uuid, public.user_role) to authenticated;
