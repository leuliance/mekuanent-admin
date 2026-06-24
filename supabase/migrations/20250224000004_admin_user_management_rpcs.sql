-- RPC: Lookup a phone number and return profile details if found
-- (check_phone_exists already exists and returns boolean — this is a richer version for admin)
create or replace function public.lookup_phone_profile(phone_number text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  result json;
begin
  select json_build_object(
    'exists', true,
    'user_id', p.id,
    'first_name', p.first_name,
    'last_name', p.last_name,
    'avatar_url', p.avatar_url
  ) into result
  from public.profiles p
  where p.phone_number = lookup_phone_profile.phone_number
  limit 1;

  if result is null then
    return json_build_object('exists', false);
  end if;

  return result;
end;
$$;

-- RPC: Change a user's role in a church
-- Only church_admin/content_admin/super_admin can call this
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
  is_authorized boolean;
begin
  -- Check authorization
  select (
    public.is_church_admin(requester_id, target_church_id)
    or public.is_content_admin(requester_id, target_church_id)
    or public.is_super_admin(requester_id)
  ) into is_authorized;

  if not is_authorized then
    return json_build_object('success', false, 'error', 'Not authorized');
  end if;

  -- Prevent changing super_admin or church_admin roles unless you're a church_admin/super_admin
  if old_role in ('super_admin', 'church_admin') or new_role in ('super_admin', 'church_admin') then
    if not (public.is_church_admin(requester_id, target_church_id) or public.is_super_admin(requester_id)) then
      return json_build_object('success', false, 'error', 'Only church admins can manage admin roles');
    end if;
  end if;

  -- Cannot change your own role
  if target_user_id = requester_id then
    return json_build_object('success', false, 'error', 'Cannot change your own role');
  end if;

  -- Delete old role
  delete from public.user_roles
  where user_id = target_user_id
    and church_id = target_church_id
    and role = old_role::public.user_role;

  -- Insert new role
  insert into public.user_roles (user_id, church_id, role, assigned_by)
  values (target_user_id, target_church_id, new_role::public.user_role, requester_id);

  return json_build_object('success', true);
end;
$$;

-- RPC: Remove a member from a church
-- Deletes all their roles in that church. If they have no roles in any church, sets role to 'user'.
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
  has_protected_role boolean;
begin
  -- Check authorization
  select (
    public.is_church_admin(requester_id, target_church_id)
    or public.is_content_admin(requester_id, target_church_id)
    or public.is_super_admin(requester_id)
  ) into is_authorized;

  if not is_authorized then
    return json_build_object('success', false, 'error', 'Not authorized');
  end if;

  -- Cannot remove yourself
  if target_user_id = requester_id then
    return json_build_object('success', false, 'error', 'Cannot remove yourself');
  end if;

  -- Check if user has church_admin/super_admin role (only church_admin/super_admin can remove those)
  select exists(
    select 1 from public.user_roles
    where user_id = target_user_id
      and church_id = target_church_id
      and role in ('church_admin', 'super_admin')
  ) into has_protected_role;

  if has_protected_role then
    if not (public.is_church_admin(requester_id, target_church_id) or public.is_super_admin(requester_id)) then
      return json_build_object('success', false, 'error', 'Only church admins can remove admin members');
    end if;
  end if;

  -- Delete all roles for this user in this church
  delete from public.user_roles
  where user_id = target_user_id
    and church_id = target_church_id;

  -- Check if user has roles in any other church
  select count(*) into remaining_roles
  from public.user_roles
  where user_id = target_user_id
    and role != 'user';

  -- If no remaining roles, ensure they have a basic 'user' role
  if remaining_roles = 0 then
    -- Check if they already have a 'user' role entry
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
