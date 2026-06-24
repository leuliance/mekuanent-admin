-- Fix remove_church_member: enforce strict role hierarchy
-- content_admin can only remove content_creator and user
-- church_admin can remove content_admin, content_creator, user but NOT other church_admin
-- super_admin can remove anyone except other super_admin

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
      when 'church_admin' then 4
      when 'content_admin' then 3
      when 'content_creator' then 2
      else 1
    end desc
  limit 1;

  -- Enforce hierarchy: can only remove users with strictly lower roles
  if target_max_role = 'super_admin' then
    return json_build_object('success', false, 'error', 'Cannot remove a super admin');
  end if;

  if target_max_role = 'church_admin' and not requester_is_super then
    return json_build_object('success', false, 'error', 'Only super admins can remove church admins');
  end if;

  if target_max_role = 'content_admin' and not (requester_is_super or requester_is_church) then
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


-- Fix change_member_role: enforce same hierarchy
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

  -- church_admin roles: only super_admin can touch
  if old_role = 'church_admin' or new_role = 'church_admin' then
    if not requester_is_super then
      return json_build_object('success', false, 'error', 'Only super admins can manage church admin roles');
    end if;
  end if;

  -- content_admin roles: only church_admin or super_admin can touch
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
