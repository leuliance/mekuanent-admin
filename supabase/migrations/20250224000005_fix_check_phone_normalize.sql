-- Fix check_phone_exists to normalize phone format before comparing.
-- Handles cases where auth.users.phone may be stored with or without '+' prefix.

create or replace function public.check_phone_exists(phone_number text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  phone_exists boolean := false;
  p_raw text;
  p_with_plus text;
  p_without_plus text;
begin
  p_raw := phone_number;
  p_without_plus := ltrim(p_raw, '+');
  p_with_plus := '+' || p_without_plus;

  select exists(
    select 1
    from auth.users
    where phone in (p_raw, p_with_plus, p_without_plus)
       or raw_user_meta_data->>'phone_number' in (p_raw, p_with_plus, p_without_plus)
  ) or exists(
    select 1
    from public.profiles
    where profiles.phone_number in (p_raw, p_with_plus, p_without_plus)
  ) into phone_exists;

  return phone_exists;
end;
$$;
