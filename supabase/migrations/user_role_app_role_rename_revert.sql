-- ============================================================================
-- REVERT: 20260609000004_user_role_app_role_rename.sql
-- ============================================================================
-- Restores the pre-rename state:
--   * user_role enum values: manager/editor/contributor/viewer -> back to
--     church_admin/content_admin/content_creator/user
--   * re-creates the app_role enum + map_user_role_to_app_role()
--   * role_permissions.role back to app_role
--   * custom_access_token_hook() back to the map-based version
--   * rbac_test table + policies
--   * function bodies back to the old literals
--
-- Order is deliberate: convert role_permissions back to app_role WHILE the
-- user_role enum still carries the new labels, THEN rename the values back.
-- ============================================================================

-- 1. Re-create the app_role enum --------------------------------------------
do $$ begin
    create type public.app_role as enum (
        'super_admin', 'admin', 'manager', 'editor', 'contributor', 'viewer'
    );
exception when duplicate_object then null; end $$;

-- 2. role_permissions.role: user_role -> app_role (labels still match) -------
alter table public.role_permissions
    alter column role type public.app_role using role::text::public.app_role;

-- 3. Rename user_role values back to the originals ---------------------------
alter type public.user_role rename value 'manager'     to 'church_admin';
alter type public.user_role rename value 'editor'      to 'content_admin';
alter type public.user_role rename value 'contributor' to 'content_creator';
alter type public.user_role rename value 'viewer'      to 'user';

-- 4. Re-create the bridge function ------------------------------------------
create or replace function public.map_user_role_to_app_role(p_role public.user_role)
returns public.app_role
language sql
immutable
set search_path = ''
as $$
    select case p_role
        when 'super_admin'     then 'super_admin'::public.app_role
        when 'admin'           then 'admin'::public.app_role
        when 'church_admin'    then 'manager'::public.app_role
        when 'content_admin'   then 'editor'::public.app_role
        when 'content_creator' then 'contributor'::public.app_role
        else 'viewer'::public.app_role
    end;
$$;
grant execute on function public.map_user_role_to_app_role(public.user_role) to supabase_auth_admin;

-- 5. Restore the map-based access-token hook ---------------------------------
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

    select coalesce(
               jsonb_agg(jsonb_build_object(
                   'role', public.map_user_role_to_app_role(ur.role),
                   'churchId', ur.church_id
               )),
               '[]'::jsonb
           )
      into roles_arr
      from public.user_roles ur
     where ur.user_id = uid;

    select coalesce(jsonb_agg(distinct rp.permission), '[]'::jsonb)
      into perms_arr
      from public.user_roles ur
      join public.role_permissions rp
        on rp.role = public.map_user_role_to_app_role(ur.role)
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

-- 6. Restore function bodies to the old literals ----------------------------
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

create or replace function public.get_church_admin_ids(p_church_id uuid)
returns setof uuid
language sql stable security definer
set search_path = ''
as $$
  select distinct user_id
    from public.user_roles
   where church_id = p_church_id
     and role in ('church_admin', 'content_admin');
$$;

create or replace function public.get_church_admin_only_ids(p_church_id uuid)
returns setof uuid
language sql stable security definer
set search_path = ''
as $$
  select distinct user_id
    from public.user_roles
   where church_id = p_church_id
     and role = 'church_admin';
$$;

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

  select role::text into target_max_role
  from public.user_roles
  where user_id = target_user_id and church_id = target_church_id
  order by
    case role
      when 'super_admin' then 5
      when 'church_admin' then 4
      when 'content_admin' then 3
      when 'content_creator' then 2
      else 1
    end desc
  limit 1;

  if target_max_role = 'super_admin' then
    return json_build_object('success', false, 'error', 'Cannot remove a super admin');
  end if;

  if target_max_role = 'church_admin' and not requester_is_super then
    return json_build_object('success', false, 'error', 'Only super admins can remove church admins');
  end if;

  if target_max_role = 'content_admin' and not (requester_is_super or requester_is_church) then
    return json_build_object('success', false, 'error', 'Only church admins can remove content admins');
  end if;

  delete from public.user_roles
  where user_id = target_user_id
    and church_id = target_church_id;

  select count(*) into remaining_roles
  from public.user_roles
  where user_id = target_user_id
    and role != 'user';

  if remaining_roles = 0 then
    if not exists(
      select 1 from public.user_roles
      where user_id = target_user_id and role = 'user'
    ) then
      insert into public.user_roles (user_id, role, assigned_by)
      values (target_user_id, 'user', requester_id);
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

  if old_role = 'super_admin' or new_role = 'super_admin' then
    if not requester_is_super then
      return json_build_object('success', false, 'error', 'Only super admins can manage super admin roles');
    end if;
  end if;

  if old_role = 'church_admin' or new_role = 'church_admin' then
    if not requester_is_super then
      return json_build_object('success', false, 'error', 'Only super admins can manage church admin roles');
    end if;
  end if;

  if old_role = 'content_admin' or new_role = 'content_admin' then
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

  insert into public.user_roles (
    user_id,
    church_id,
    role,
    assigned_at
  )
  values (
    new.id,
    null,
    'user'::public.user_role,
    now()
  );

  insert into public.user_preferences (id, created_at, updated_at)
  values (new.id, now(), now());

  insert into public.user_wallets (user_id, created_at, updated_at)
  values (new.id, now(), now());

  return new;
end;
$$;

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
     when 'church_admin' then 1
     when 'content_admin' then 2
     when 'content_creator' then 3
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

  if v_creator_role = 'content_admin' then
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

-- 7. Re-create the throwaway RLS probe table --------------------------------
create table if not exists public.rbac_test (
    id          uuid primary key default gen_random_uuid(),
    label       text,
    created_by  uuid default auth.uid(),
    created_at  timestamptz not null default now()
);
alter table public.rbac_test enable row level security;

drop policy if exists "rbac_test select" on public.rbac_test;
create policy "rbac_test select"
    on public.rbac_test for select to authenticated
    using (public.authorize('content.create'));

drop policy if exists "rbac_test insert" on public.rbac_test;
create policy "rbac_test insert"
    on public.rbac_test for insert to authenticated
    with check (public.authorize('content.create'));

drop policy if exists "rbac_test delete" on public.rbac_test;
create policy "rbac_test delete"
    on public.rbac_test for delete to authenticated
    using (public.authorize('content.delete'));
