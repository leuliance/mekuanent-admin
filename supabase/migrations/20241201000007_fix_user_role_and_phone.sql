/*
 * Migration: Fix User Role Assignment and Phone Number Registration
 * Description: 
 *   1. Updates user_roles constraint to allow 'user' role without church_id
 *   2. Updates handle_new_user function to create default 'user' role
 *   3. Ensures phone number is properly saved from registration
 * Author: System
 * Date: 2024-12-01
 */

-- ============================================================================
-- STEP 1: Update user_roles constraint to allow 'user' role without church_id
-- ============================================================================

-- Drop the existing constraint
alter table public.user_roles
drop constraint if exists user_roles_church_required;

-- Add updated constraint that allows 'user' role without church association
alter table public.user_roles
add constraint user_roles_church_required check (
  (role = 'super_admin' and church_id is null) or
  (role = 'user' and church_id is null) or
  (role not in ('super_admin', 'user') and church_id is not null)
);

comment on constraint user_roles_church_required on public.user_roles is 
  'Ensures super_admin and user roles have no church_id, while church-specific roles require church_id';

-- ============================================================================
-- STEP 2: Update handle_new_user function to create default 'user' role
-- ============================================================================

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
  -- Get phone number from auth.users.phone or metadata
  v_phone_number := coalesce(
    new.phone,
    new.raw_user_meta_data->>'phone_number'
  );
  
  -- Get email from auth.users.email or metadata
  v_email := coalesce(
    new.email,
    new.raw_user_meta_data->>'email'
  );
  
  -- Insert into profiles table
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
  
  -- Create default user role (no church association)
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
  
  -- Create default user preferences
  insert into public.user_preferences (id, created_at, updated_at)
  values (new.id, now(), now());
  
  -- Create user wallet
  insert into public.user_wallets (user_id, created_at, updated_at)
  values (new.id, now(), now());
  
  return new;
end;
$$;

comment on function public.handle_new_user is 
  'Automatically creates profile (with phone, email, first_name, last_name), assigns default user role, creates preferences, and wallet when user signs up via Supabase Auth';

-- ============================================================================
-- STEP 3: Add helper function to check if user has a specific role
-- ============================================================================

create or replace function public.user_has_role(
  p_user_id uuid,
  p_role public.user_role
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.user_roles
    where user_id = p_user_id
      and role = p_role
  );
end;
$$;

comment on function public.user_has_role is 
  'Helper function to check if a user has a specific role (church-agnostic)';

-- ============================================================================
-- STEP 4: Add helper function to check if user has role in a specific church
-- ============================================================================

create or replace function public.user_has_church_role(
  p_user_id uuid,
  p_church_id uuid,
  p_role public.user_role
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.user_roles
    where user_id = p_user_id
      and church_id = p_church_id
      and role = p_role
  );
end;
$$;

comment on function public.user_has_church_role is 
  'Helper function to check if a user has a specific role in a specific church';

