-- ============================================================================
-- RBAC: move the role-check helpers from `user_roles` table reads to JWT claims
-- ============================================================================
-- Every RLS policy in the app calls these four helpers for the CURRENT user:
--     is_super_admin((select auth.uid()))
--     is_church_admin((select auth.uid()), church_id)
--     is_content_admin((select auth.uid()), church_id)
--     is_content_creator((select auth.uid()), church_id)
--
-- Rewriting the helpers therefore flips EVERY table's RLS onto the JWT claims
-- minted by `custom_access_token_hook` — no policy needs to change.
--
-- Each helper is "claims-first with a table fallback":
--   * If we're checking the current user AND their token already carries the
--     `user_roles` claim  -> read the claim (fast, no table hit).
--   * Otherwise (old token minted before the hook, or checking a DIFFERENT
--     user, e.g. inside admin RPCs) -> fall back to the user_roles table.
--
-- This makes the rollout safe: existing sessions keep working via the fallback
-- and silently switch to the claims path the moment their token refreshes.
--
-- The `user_roles` table remains the source of truth for assignments. It is
-- still queried server-side where a CROSS-user lookup is required (notification
-- recipient triggers, admin role management of *other* users, member lists) —
-- claims only describe the caller, so those cases cannot use them.
--
-- Claim shape (per the hook):
--   "user_roles": [{ "role": "manager", "churchId": "<uuid>" }, ...]
-- app_role -> legacy user_role mapping used below:
--   super_admin->super_admin, manager->church_admin,
--   editor->content_admin, contributor->content_creator, viewer->user
-- ============================================================================

-- 1. is_super_admin ----------------------------------------------------------
create or replace function public.is_super_admin(user_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
    select case
        when user_id = (select auth.uid()) and (auth.jwt() ? 'user_roles') then
            exists (
                select 1
                from jsonb_array_elements(auth.jwt() -> 'user_roles') as r
                where r->>'role' = 'super_admin'
            )
        else
            exists (
                select 1
                from public.user_roles
                where user_roles.user_id = is_super_admin.user_id
                  and user_roles.role = 'super_admin'
            )
    end;
$$;
comment on function public.is_super_admin is
    'True if user has super_admin. Claims-first (current user) with user_roles table fallback.';

-- 2. is_church_admin ---------------------------------------------------------
create or replace function public.is_church_admin(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
    select case
        when user_id = (select auth.uid()) and (auth.jwt() ? 'user_roles') then
            exists (
                select 1
                from jsonb_array_elements(auth.jwt() -> 'user_roles') as r
                where r->>'role' = 'manager'
                  and (r->>'churchId')::uuid = is_church_admin.church_id
            )
        else
            exists (
                select 1
                from public.user_roles
                where user_roles.user_id = is_church_admin.user_id
                  and user_roles.church_id = is_church_admin.church_id
                  and user_roles.role = 'church_admin'
            )
    end;
$$;
comment on function public.is_church_admin is
    'True if user is church admin (app_role manager) for the church. Claims-first with table fallback.';

-- 3. is_content_admin --------------------------------------------------------
create or replace function public.is_content_admin(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
    select case
        when user_id = (select auth.uid()) and (auth.jwt() ? 'user_roles') then
            exists (
                select 1
                from jsonb_array_elements(auth.jwt() -> 'user_roles') as r
                where r->>'role' in ('manager', 'editor')
                  and (r->>'churchId')::uuid = is_content_admin.church_id
            )
        else
            exists (
                select 1
                from public.user_roles
                where user_roles.user_id = is_content_admin.user_id
                  and user_roles.church_id = is_content_admin.church_id
                  and user_roles.role in ('content_admin', 'church_admin')
            )
    end;
$$;
comment on function public.is_content_admin is
    'True if user is content/church admin (app_role editor/manager) for the church. Claims-first with table fallback.';

-- 4. is_content_creator ------------------------------------------------------
create or replace function public.is_content_creator(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
    select case
        when user_id = (select auth.uid()) and (auth.jwt() ? 'user_roles') then
            exists (
                select 1
                from jsonb_array_elements(auth.jwt() -> 'user_roles') as r
                where r->>'role' in ('manager', 'editor', 'contributor')
                  and (r->>'churchId')::uuid = is_content_creator.church_id
            )
        else
            exists (
                select 1
                from public.user_roles
                where user_roles.user_id = is_content_creator.user_id
                  and user_roles.church_id = is_content_creator.church_id
                  and user_roles.role in ('content_creator', 'content_admin', 'church_admin')
            )
    end;
$$;
comment on function public.is_content_creator is
    'True if user has content-creation rights (app_role contributor/editor/manager) for the church. Claims-first with table fallback.';
