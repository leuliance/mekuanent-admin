/*
 * Migration: Create Functions
 * Description: Creates utility functions for the Mekuannent application
 * Author: System
 * Date: 2024-12-01
 * 
 * Functions created:
 * - handle_new_user: Auto-create profile on auth signup
 * - update_updated_at: Auto-update updated_at timestamp
 * - is_super_admin: Check if user is super admin
 * - is_church_admin: Check if user is church admin
 * - is_content_admin: Check if user is content admin or church admin
 * - is_content_creator: Check if user has creator role or higher
 * - user_has_role_in_church: Check if user has specific role in church
 * - update_donation_campaign_amount: Update campaign current_amount
 * - expire_old_stories: Mark expired stories as archived
 * - close_completed_events: Update event status after end_time
 * - expire_old_invitations: Mark expired invitations
 */

-- ============================================================================
-- FUNCTION: Auto-create profile on user signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
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
    new.email,
    new.phone,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    now(), 
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
comment on function public.handle_new_user is 'Automatically creates profile with phone (required), email, first_name, last_name, preferences, and wallet when user signs up via Supabase Auth';

-- ============================================================================
-- FUNCTION: Sync user data from auth.users to profiles
-- ============================================================================
create or replace function public.sync_user_data()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email,
      phone_number = new.phone,
      updated_at = now()
  where id = new.id;
  
  return new;
end;
$$;
comment on function public.sync_user_data is 'Syncs email and phone updates from auth.users to profiles table';

-- ============================================================================
-- FUNCTION: Update updated_at timestamp
-- ============================================================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
comment on function public.update_updated_at is 'Automatically updates updated_at column on row modification';

-- ============================================================================
-- FUNCTION: Check if user is super admin
-- ============================================================================
create or replace function public.is_super_admin(user_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_super_admin.user_id
    and user_roles.role = 'super_admin'
  );
$$;
comment on function public.is_super_admin is 'Returns true if user has super_admin role';

-- ============================================================================
-- FUNCTION: Check if user is church admin
-- ============================================================================
create or replace function public.is_church_admin(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_church_admin.user_id
    and user_roles.church_id = is_church_admin.church_id
    and user_roles.role = 'church_admin'
  );
$$;
comment on function public.is_church_admin is 'Returns true if user is church admin for specific church';

-- ============================================================================
-- FUNCTION: Check if user is content admin
-- ============================================================================
create or replace function public.is_content_admin(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_content_admin.user_id
    and user_roles.church_id = is_content_admin.church_id
    and user_roles.role in ('content_admin', 'church_admin')
  );
$$;
comment on function public.is_content_admin is 'Returns true if user is content admin or church admin for specific church';

-- ============================================================================
-- FUNCTION: Check if user is content creator
-- ============================================================================
create or replace function public.is_content_creator(user_id uuid, church_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = is_content_creator.user_id
    and user_roles.church_id = is_content_creator.church_id
    and user_roles.role in ('content_creator', 'content_admin', 'church_admin')
  );
$$;
comment on function public.is_content_creator is 'Returns true if user has content creation privileges for specific church';

-- ============================================================================
-- FUNCTION: Check if user has specific role in church
-- ============================================================================
create or replace function public.user_has_role_in_church(
  check_user_id uuid,
  check_church_id uuid,
  check_role public.user_role
)
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = check_user_id
    and user_roles.church_id = check_church_id
    and user_roles.role = check_role
  );
$$;
comment on function public.user_has_role_in_church is 'Returns true if user has specific role in church';

-- ============================================================================
-- FUNCTION: Update donation amounts (campaigns and events)
-- ============================================================================
create or replace function public.update_donation_amounts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Only update if donation is completed
  if new.status = 'completed' and (old is null or old.status != 'completed') then
    -- Update campaign if campaign donation
    if new.campaign_id is not null then
      update public.donation_campaigns
      set current_amount = current_amount + new.amount
      where id = new.campaign_id;
    end if;
    
    -- Update event if event donation
    if new.event_id is not null then
      update public.events
      set donation_current_amount = donation_current_amount + new.amount
      where id = new.event_id;
    end if;
  end if;
  
  -- Handle refunds
  if new.status = 'refunded' and old.status = 'completed' then
    if old.campaign_id is not null then
      update public.donation_campaigns
      set current_amount = greatest(0, current_amount - old.amount)
      where id = old.campaign_id;
    end if;
    
    if old.event_id is not null then
      update public.events
      set donation_current_amount = greatest(0, donation_current_amount - old.amount)
      where id = old.event_id;
    end if;
  end if;
  
  return new;
end;
$$;
comment on function public.update_donation_amounts is 'Automatically updates campaign or event current_amount when donation is completed or refunded';

-- ============================================================================
-- FUNCTION: Expire old stories
-- ============================================================================
create or replace function public.expire_old_stories()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.content_items
  set status = 'archived'
  where id in (
    select content_items.id
    from public.content_items
    join public.story_content on content_items.id = story_content.id
    where content_items.status = 'approved'
    and story_content.expires_at < now()
  );
$$;
comment on function public.expire_old_stories is 'Archives stories that have exceeded their 24-hour expiry time';

-- ============================================================================
-- FUNCTION: Close completed events
-- ============================================================================
create or replace function public.close_completed_events()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.events
  set status = 'completed'
  where status = 'published'
  and end_time < now();
$$;
comment on function public.close_completed_events is 'Automatically marks events as completed after their end_time';

-- ============================================================================
-- FUNCTION: Expire old invitations
-- ============================================================================
create or replace function public.expire_old_invitations()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.invitations
  set status = 'expired'
  where status = 'pending'
  and expires_at < now();
$$;
comment on function public.expire_old_invitations is 'Marks pending invitations as expired after their expiry time';

-- ============================================================================
-- FUNCTION: Get user churches (churches user has role in)
-- ============================================================================
create or replace function public.get_user_churches(check_user_id uuid)
returns table (
  church_id uuid,
  church_name text,
  church_logo_url text,
  user_role public.user_role
)
language sql
security invoker
set search_path = ''
stable
as $$
  select
    churches.id as church_id,
    churches.name as church_name,
    churches.logo_url as church_logo_url,
    user_roles.role as user_role
  from public.churches
  join public.user_roles on churches.id = user_roles.church_id
  where user_roles.user_id = check_user_id
  and churches.status = 'approved'
  order by churches.name;
$$;
comment on function public.get_user_churches is 'Returns all churches where user has a role';

-- ============================================================================
-- FUNCTION: Get followed churches
-- ============================================================================
create or replace function public.get_followed_churches(check_user_id uuid)
returns table (
  church_id uuid,
  church_name text,
  church_logo_url text,
  followed_at timestamptz
)
language sql
security invoker
set search_path = ''
stable
as $$
  select
    churches.id as church_id,
    churches.name as church_name,
    churches.logo_url as church_logo_url,
    user_follows.followed_at
  from public.churches
  join public.user_follows on churches.id = user_follows.church_id
  where user_follows.user_id = check_user_id
  and churches.status = 'approved'
  order by user_follows.followed_at desc;
$$;
comment on function public.get_followed_churches is 'Returns all churches followed by user';

-- ============================================================================
-- FUNCTION: Increment content view count
-- ============================================================================
create or replace function public.increment_content_view_count(content_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.content_items
  set view_count = view_count + 1
  where id = content_id;
$$;
comment on function public.increment_content_view_count is 'Increments view count for content item';

-- ============================================================================
-- FUNCTION: Update wallet balance
-- ============================================================================
create or replace function public.update_wallet_balance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'completed' and (old is null or old.status != 'completed') then
    -- Update wallet balance based on transaction type
    if new.transaction_type = 'deposit' or new.transaction_type = 'refund' then
      update public.user_wallets
      set balance = balance + new.amount
      where id = new.wallet_id;
    elsif new.transaction_type = 'withdrawal' or new.transaction_type = 'donation' then
      update public.user_wallets
      set balance = balance - new.amount
      where id = new.wallet_id;
    end if;
  end if;
  
  return new;
end;
$$;
comment on function public.update_wallet_balance is 'Automatically updates wallet balance when transaction is completed';

-- ============================================================================
-- FUNCTION: Get user wallet balance
-- ============================================================================
create or replace function public.get_user_wallet_balance(check_user_id uuid)
returns numeric
language sql
security invoker
set search_path = ''
stable
as $$
  select balance
  from public.user_wallets
  where user_id = check_user_id
  and is_active = true;
$$;
comment on function public.get_user_wallet_balance is 'Returns current wallet balance for user';

-- ============================================================================
-- FUNCTION: Process scheduled donation
-- ============================================================================
create or replace function public.process_scheduled_donation(scheduled_donation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  scheduled_record record;
  wallet_balance numeric;
  result jsonb;
begin
  -- Get scheduled donation details
  select * into scheduled_record
  from public.scheduled_donations
  where id = scheduled_donation_id
  and is_active = true
  and next_donation_date <= current_date;
  
  if not found then
    return jsonb_build_object(
      'success', false,
      'error', 'Invalid or inactive scheduled donation'
    );
  end if;
  
  -- Check wallet balance if using wallet
  if scheduled_record.use_wallet then
    wallet_balance := (select public.get_user_wallet_balance(scheduled_record.user_id));
    
    if wallet_balance is null or wallet_balance < scheduled_record.amount then
      return jsonb_build_object(
        'success', false,
        'error', 'Insufficient wallet balance'
      );
    end if;
  end if;
  
  -- Create donation
  insert into public.donations (
    campaign_id,
    event_id,
    user_id,
    amount,
    currency,
    payment_source,
    status,
    from_wallet
  ) values (
    scheduled_record.campaign_id,
    scheduled_record.event_id,
    scheduled_record.user_id,
    scheduled_record.amount,
    scheduled_record.currency,
    case when scheduled_record.use_wallet then 'wallet' else 'scheduled' end,
    case when scheduled_record.use_wallet then 'completed' else 'pending' end,
    scheduled_record.use_wallet
  );
  
  -- Update next donation date
  update public.scheduled_donations
  set next_donation_date = case
    when frequency = 'daily' then next_donation_date + interval '1 day'
    when frequency = 'weekly' then next_donation_date + interval '1 week'
    when frequency = 'monthly' then next_donation_date + interval '1 month'
    when frequency = 'yearly' then next_donation_date + interval '1 year'
    else next_donation_date
  end,
  is_active = case
    when frequency = 'once' then false
    when end_date is not null and next_donation_date >= end_date then false
    else true
  end
  where id = scheduled_donation_id;
  
  return jsonb_build_object(
    'success', true,
    'next_date', (select next_donation_date from public.scheduled_donations where id = scheduled_donation_id)
  );
end;
$$;
comment on function public.process_scheduled_donation is 'Processes a scheduled donation and updates next donation date';

-- ============================================================================
-- FUNCTION: Accept invitation
-- ============================================================================
create or replace function public.accept_invitation(invitation_token text, accepting_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation_record record;
  result jsonb;
begin
  -- Get invitation details
  select * into invitation_record
  from public.invitations
  where token = invitation_token
  and status = 'pending'
  and expires_at > now();
  
  if not found then
    return jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invitation'
    );
  end if;
  
  -- Check if phone numbers match (optional, depends on your flow)
  -- You might want to verify the accepting user's phone matches the invitation
  
  -- Update invitation
  update public.invitations
  set status = 'accepted',
      accepted_by = accepting_user_id,
      accepted_at = now()
  where id = invitation_record.id;
  
  -- Assign role to user
  insert into public.user_roles (user_id, church_id, role, assigned_by, assigned_at)
  values (
    accepting_user_id,
    invitation_record.church_id,
    invitation_record.role,
    invitation_record.invited_by,
    now()
  )
  on conflict (user_id, church_id, role) do nothing;
  
  return jsonb_build_object(
    'success', true,
    'church_id', invitation_record.church_id,
    'role', invitation_record.role
  );
end;
$$;
comment on function public.accept_invitation is 'Accepts an invitation and assigns role to user';

