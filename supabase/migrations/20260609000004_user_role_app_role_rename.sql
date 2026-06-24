-- ============================================================================
-- RBAC: collapse the role taxonomy onto a single `user_role` enum
-- ============================================================================
-- The app wants ONE role taxonomy with these names (no more "content_admin" /
-- "church_admin" / "content_creator" / "user"):
--     super_admin · admin · manager · editor · contributor · viewer
--
-- We get there by RENAMING the existing `user_role` enum values in place:
--     church_admin    -> manager
--     content_admin   -> editor
--     content_creator -> contributor
--     user            -> viewer
-- (super_admin / admin keep their names.)
--
-- Why rename instead of converting columns?
--   `ALTER TYPE ... RENAME VALUE` keeps each member's internal OID, so EVERY
--   row, column default, CHECK constraint and RLS policy that references a value
--   keeps working automatically — no data migration, no policy rewrites. Only
--   function BODIES (stored as source text) that mention the old literals must
--   be re-created; that's done below.
--
-- It also collapses the temporary `app_role` enum (added while prototyping the
-- JWT claims) back into `user_role`:
--   * `role_permissions.role` moves from app_role -> user_role
--   * `map_user_role_to_app_role()` is dropped (no longer needed)
--   * `custom_access_token_hook()` reads `user_roles.role` directly
--   * `app_role` is dropped
--   * `rbac_test` (the throwaway RLS probe) is dropped
--
-- Reversible via `user_role_app_role_rename_revert.sql`.
-- ============================================================================

-- 1. Rename the enum values in place ----------------------------------------
alter type public.user_role rename value 'church_admin'    to 'manager';
alter type public.user_role rename value 'content_admin'   to 'editor';
alter type public.user_role rename value 'content_creator' to 'contributor';
alter type public.user_role rename value 'user'            to 'viewer';

-- 2. Re-create the function bodies that referenced the old literals ----------
-- 2a. RLS helpers (table-fallback branch used the old names) -----------------
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
                  and user_roles.role = 'manager'
            )
    end;
$$;

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
                  and user_roles.role in ('editor', 'manager')
            )
    end;
$$;

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
                  and user_roles.role in ('contributor', 'editor', 'manager')
            )
    end;
$$;

-- 2b. Notification recipient helpers ----------------------------------------
create or replace function public.get_church_admin_ids(p_church_id uuid)
returns setof uuid
language sql stable security definer
set search_path = ''
as $$
  select distinct user_id
    from public.user_roles
   where church_id = p_church_id
     and role in ('manager', 'editor');
$$;

create or replace function public.get_church_admin_only_ids(p_church_id uuid)
returns setof uuid
language sql stable security definer
set search_path = ''
as $$
  select distinct user_id
    from public.user_roles
   where church_id = p_church_id
     and role = 'manager';
$$;

-- 2c. Role-hierarchy RPCs ----------------------------------------------------
create or replace function public.remove_church_member(
  target_user_id uuid,
  target_church_id uuid,
  requester_id uuid
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_authorized boolean;
  remaining_roles int;
  requester_is_super boolean;
  requester_is_church boolean;
  requester_is_content boolean;
  target_max_role text;
begin
  select public.is_super_admin(requester_id) into requester_is_super;
  select public.is_church_admin(requester_id, target_church_id) into requester_is_church;
  select public.is_content_admin(requester_id, target_church_id) into requester_is_content;

  is_authorized := requester_is_super or requester_is_church or requester_is_content;

  if not is_authorized then
    return json_build_object('success', false, 'error', 'Not authorized');
  end if;

  if target_user_id = requester_id then
    return json_build_object('success', false, 'error', 'Cannot remove yourself');
  end if;

  -- Get the highest role of the target user in this church
  select role::text into target_max_role
  from public.user_roles
  where user_id = target_user_id and church_id = target_church_id
  order by
    case role
      when 'super_admin' then 5
      when 'manager' then 4
      when 'editor' then 3
      when 'contributor' then 2
      else 1
    end desc
  limit 1;

  -- Enforce hierarchy: can only remove users with strictly lower roles
  if target_max_role = 'super_admin' then
    return json_build_object('success', false, 'error', 'Cannot remove a super admin');
  end if;

  if target_max_role = 'manager' and not requester_is_super then
    return json_build_object('success', false, 'error', 'Only super admins can remove church admins');
  end if;

  if target_max_role = 'editor' and not (requester_is_super or requester_is_church) then
    return json_build_object('success', false, 'error', 'Only church admins can remove content admins');
  end if;

  -- Delete all roles for this user in this church
  delete from public.user_roles
  where user_id = target_user_id
    and church_id = target_church_id;

  -- Check if user has roles in any other church
  select count(*) into remaining_roles
  from public.user_roles
  where user_id = target_user_id
    and role != 'viewer';

  if remaining_roles = 0 then
    if not exists(
      select 1 from public.user_roles
      where user_id = target_user_id and role = 'viewer'
    ) then
      insert into public.user_roles (user_id, role, assigned_by)
      values (target_user_id, 'viewer', requester_id);
    end if;
  end if;

  return json_build_object('success', true);
end;
$$;

create or replace function public.change_member_role(
  target_user_id uuid,
  target_church_id uuid,
  old_role text,
  new_role text,
  requester_id uuid
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  requester_is_super boolean;
  requester_is_church boolean;
  requester_is_content boolean;
  is_authorized boolean;
begin
  select public.is_super_admin(requester_id) into requester_is_super;
  select public.is_church_admin(requester_id, target_church_id) into requester_is_church;
  select public.is_content_admin(requester_id, target_church_id) into requester_is_content;

  is_authorized := requester_is_super or requester_is_church or requester_is_content;

  if not is_authorized then
    return json_build_object('success', false, 'error', 'Not authorized');
  end if;

  if target_user_id = requester_id then
    return json_build_object('success', false, 'error', 'Cannot change your own role');
  end if;

  -- super_admin roles: only super_admin can touch
  if old_role = 'super_admin' or new_role = 'super_admin' then
    if not requester_is_super then
      return json_build_object('success', false, 'error', 'Only super admins can manage super admin roles');
    end if;
  end if;

  -- manager roles: only super_admin can touch
  if old_role = 'manager' or new_role = 'manager' then
    if not requester_is_super then
      return json_build_object('success', false, 'error', 'Only super admins can manage church admin roles');
    end if;
  end if;

  -- editor roles: only manager or super_admin can touch
  if old_role = 'editor' or new_role = 'editor' then
    if not (requester_is_super or requester_is_church) then
      return json_build_object('success', false, 'error', 'Only church admins can manage content admin roles');
    end if;
  end if;

  delete from public.user_roles
  where user_id = target_user_id
    and church_id = target_church_id
    and role = old_role::public.user_role;

  insert into public.user_roles (user_id, church_id, role, assigned_by)
  values (target_user_id, target_church_id, new_role::public.user_role, requester_id);

  return json_build_object('success', true);
end;
$$;

-- 2d. Default role on signup -------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone_number text;
  v_email text;
begin
  v_phone_number := coalesce(
    new.phone,
    new.raw_user_meta_data->>'phone_number'
  );

  v_email := coalesce(
    new.email,
    new.raw_user_meta_data->>'email'
  );

  insert into public.profiles (
    id,
    email,
    phone_number,
    first_name,
    last_name,
    created_at,
    updated_at
  )
  values (
    new.id,
    v_email,
    v_phone_number,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    now(),
    now()
  );

  -- Default role (no church association)
  insert into public.user_roles (
    user_id,
    church_id,
    role,
    assigned_at
  )
  values (
    new.id,
    null,
    'viewer'::public.user_role,
    now()
  );

  insert into public.user_preferences (id, created_at, updated_at)
  values (new.id, now(), now());

  insert into public.user_wallets (user_id, created_at, updated_at)
  values (new.id, now(), now());

  return new;
end;
$$;

-- 2e. Content-pending notification trigger -----------------------------------
create or replace function public.trg_notify_content_pending()
returns trigger language plpgsql security definer
set search_path = ''
as $$
declare
  v_admin       uuid;
  v_creator_role text;
  v_title       jsonb;
  v_body        jsonb;
  v_data        jsonb;
  v_creator     record;
begin
  if new.status <> 'pending_approval' then return new; end if;
  if tg_op = 'UPDATE' and old.status = 'pending_approval' then return new; end if;

  select first_name into v_creator from public.profiles where id = new.created_by;

  select role into v_creator_role
    from public.user_roles
   where user_id = new.created_by and church_id = new.church_id
   order by case role
     when 'manager' then 1
     when 'editor' then 2
     when 'contributor' then 3
     else 4
   end
   limit 1;

  v_title := jsonb_build_object('en', 'Content for Review', 'am', 'ይዘት ለግምገማ');
  v_body  := jsonb_build_object(
    'en',
      coalesce(v_creator.first_name, '') || ' submitted "' ||
      coalesce(public._notif_en_am_plain(new.title, new.language)->>'en', '') || '"',
    'am',
      coalesce(v_creator.first_name, '') || ' "' ||
      coalesce(public._notif_en_am_plain(new.title, new.language)->>'am', '') || '" አቅርቧል'
  );
  v_data := jsonb_build_object(
    'type', 'content_pending',
    'content_id', new.id,
    'church_id', new.church_id,
    'content_type', new.content_type::text
  );

  if v_creator_role = 'editor' then
    for v_admin in select * from public.get_church_admin_only_ids(new.church_id)
    loop
      if v_admin <> new.created_by then
        perform public.create_notification(v_admin, 'content_pending', v_title, v_body, v_data, 'notify_content_review');
      end if;
    end loop;
  else
    for v_admin in select * from public.get_church_admin_ids(new.church_id)
    loop
      if v_admin <> new.created_by then
        perform public.create_notification(v_admin, 'content_pending', v_title, v_body, v_data, 'notify_content_review');
      end if;
    end loop;
  end if;

  return new;
end;
$$;

-- 2f. assign_member_role: admin-grant guard ----------------------------------
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

    if p_role in ('manager', 'editor') and not (v_is_super or v_is_church) then
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

-- 3. Move role_permissions.role from app_role -> user_role -------------------
alter table public.role_permissions
    alter column role type public.user_role using role::text::public.user_role;

-- 4. Hook reads user_roles.role directly (no app_role bridge) ----------------
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
    claims    jsonb;
    uid       uuid;
    roles_arr jsonb;
    perms_arr jsonb;
begin
    uid := (event->>'user_id')::uuid;
    claims := coalesce(event->'claims', '{}'::jsonb);

    -- Per-church roles.
    select coalesce(
               jsonb_agg(jsonb_build_object(
                   'role', ur.role,
                   'churchId', ur.church_id
               )),
               '[]'::jsonb
           )
      into roles_arr
      from public.user_roles ur
     where ur.user_id = uid;

    -- Flat, de-duplicated permission set across all of the user's roles.
    select coalesce(jsonb_agg(distinct rp.permission), '[]'::jsonb)
      into perms_arr
      from public.user_roles ur
      join public.role_permissions rp
        on rp.role = ur.role
     where ur.user_id = uid;

    claims := jsonb_set(claims, '{user_roles}', roles_arr);
    claims := jsonb_set(claims, '{permissions}', perms_arr);

    event := jsonb_set(event, '{claims}', claims);
    return event;
exception
    when others then
        return event;
end;
$$;

-- 5. Drop the now-unused bridge function ------------------------------------
drop function if exists public.map_user_role_to_app_role(public.app_role);
drop function if exists public.map_user_role_to_app_role(public.user_role);

-- 6. Drop the redundant app_role enum ---------------------------------------
drop type if exists public.app_role;

-- 7. Drop the throwaway RLS probe table -------------------------------------
drop table if exists public.rbac_test cascade;
