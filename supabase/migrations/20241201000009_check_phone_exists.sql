/*
 * Migration: Check if Phone Number Exists
 * Description: 
 *   Creates an RPC function to check if a phone number is registered
 *   Checks both auth.users.phone and profiles.phone_number for security
 * Author: System
 * Date: 2024-12-01
 */

-- ============================================================================
-- Function: check_phone_exists
-- ============================================================================

create or replace function public.check_phone_exists(phone_number text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  phone_exists boolean := false;
  p_phone_number text;
begin
  -- Store parameter in local variable to avoid ambiguity
  p_phone_number := phone_number;
  
  -- Check if phone exists in auth.users (for verified phone numbers)
  -- or in profiles.phone_number (for unverified but registered numbers)
  select exists(
    select 1
    from auth.users
    where phone = p_phone_number
       or raw_user_meta_data->>'phone_number' = p_phone_number
  ) or exists(
    select 1
    from public.profiles
    where profiles.phone_number = p_phone_number
  ) into phone_exists;
  
  return phone_exists;
end;
$$;

comment on function public.check_phone_exists is 
  'Checks if a phone number is registered in the system. Returns true if phone exists in auth.users or profiles table, false otherwise.';

-- Grant execute permission to authenticated and anonymous users
grant execute on function public.check_phone_exists(text) to authenticated, anon;

