/*
 * Migration: Sign-up enhancements + anonymous-user fix
 * Date: 2026-06-13
 *
 * 1. handle_new_user:
 *    - SKIP anonymous users entirely. Guests browsing the app don't need a
 *      profiles / user_roles / user_preferences / user_wallets row. Those
 *      rows are only created when a real (phone) account is created.
 *    - Persist avatar_url from raw_user_meta_data (uploaded during sign-up).
 *    - Persist language_preference ('en' | 'am') from raw_user_meta_data.
 *
 * 2. Cleanup: delete profile rows that were previously created for
 *    anonymous users. user_roles / user_preferences / user_wallets all
 *    reference profiles with ON DELETE CASCADE, so one delete is enough.
 *
 * Run this in the Supabase dashboard SQL editor, then regenerate types:
 *   bunx supabase gen types typescript --project-id <ref> > src/types/database.types.ts
 */

-- ============================================================================
-- 1. handle_new_user — skip anon, add avatar_url + language_preference
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
  v_language text;
begin
  -- Anonymous guests get no app-side rows. When they later create a real
  -- account, signInWithOtp inserts a brand-new (non-anonymous) auth user
  -- and this trigger runs again for that row.
  if new.is_anonymous then
    return new;
  end if;

  v_phone_number := coalesce(
    new.phone,
    new.raw_user_meta_data->>'phone_number'
  );

  v_email := coalesce(
    new.email,
    new.raw_user_meta_data->>'email'
  );

  -- Only accept supported locales; default to Amharic.
  v_language := lower(coalesce(nullif(new.raw_user_meta_data->>'language_preference', ''), 'am'));
  if v_language not in ('en', 'am') then
    v_language := 'am';
  end if;

  insert into public.profiles (
    id,
    email,
    phone_number,
    first_name,
    last_name,
    avatar_url,
    language_preference,
    created_at,
    updated_at
  )
  values (
    new.id,
    v_email,
    v_phone_number,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    v_language,
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

comment on function public.handle_new_user is
  'Creates profile, default viewer role, preferences and wallet for new NON-anonymous auth users. Reads first_name, last_name, avatar_url and language_preference from raw_user_meta_data.';

-- ============================================================================
-- 2. Cleanup: remove rows previously created for anonymous users
--    (user_roles, user_preferences, user_wallets cascade from profiles)
-- ============================================================================
delete from public.profiles p
using auth.users u
where p.id = u.id
  and u.is_anonymous = true;
