/*
 * Migration: Create Triggers
 * Description: Creates triggers for automated database operations
 * Author: System
 * Date: 2024-12-01
 * 
 * Triggers created:
 * - on_auth_user_created: Auto-create profile when user signs up
 * - update_*_updated_at: Auto-update updated_at timestamps
 * - update_donation_campaign_on_donation: Update campaign amounts
 * 
 * Note: Triggers on auth.users require superuser privileges
 */

-- ============================================================================
-- TRIGGER: Auto-create profile on auth signup
-- ============================================================================
-- Note: This trigger is created on auth.users which requires elevated privileges
-- Run this migration with: supabase db reset (for local) or via Supabase Dashboard
begin;
  -- Grant necessary permissions
  grant usage on schema auth to postgres, anon, authenticated, service_role;
  grant all on auth.users to postgres, service_role;
  
  -- Create trigger
  create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();
commit;

-- ============================================================================
-- TRIGGER: Sync user data from auth.users to profiles
-- ============================================================================
begin;
  create trigger on_auth_user_data_updated
    after update on auth.users
    for each row
    when (old.email is distinct from new.email or old.phone is distinct from new.phone)
    execute function public.sync_user_data();
commit;

-- ============================================================================
-- TRIGGER: Update updated_at on churches
-- ============================================================================
create trigger update_churches_updated_at
  before update on public.churches
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on profiles
-- ============================================================================
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on event_categories
-- ============================================================================
create trigger update_event_categories_updated_at
  before update on public.event_categories
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on donation_categories
-- ============================================================================
create trigger update_donation_categories_updated_at
  before update on public.donation_categories
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on bank_accounts
-- ============================================================================
create trigger update_bank_accounts_updated_at
  before update on public.bank_accounts
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on events
-- ============================================================================
create trigger update_events_updated_at
  before update on public.events
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on event_rsvps
-- ============================================================================
create trigger update_event_rsvps_updated_at
  before update on public.event_rsvps
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on donation_campaigns
-- ============================================================================
create trigger update_donation_campaigns_updated_at
  before update on public.donation_campaigns
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on content_items
-- ============================================================================
create trigger update_content_items_updated_at
  before update on public.content_items
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on user_preferences
-- ============================================================================
create trigger update_user_preferences_updated_at
  before update on public.user_preferences
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on feature_flags
-- ============================================================================
create trigger update_feature_flags_updated_at
  before update on public.feature_flags
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update donation amounts on donation insert/update
-- ============================================================================
create trigger update_donation_amounts_trigger
  after insert or update on public.donations
  for each row
  execute function public.update_donation_amounts();
comment on trigger update_donation_amounts_trigger on public.donations is 'Automatically updates campaign or event current_amount when donation status changes';

-- ============================================================================
-- TRIGGER: Update updated_at on user_wallets
-- ============================================================================
create trigger update_user_wallets_updated_at
  before update on public.user_wallets
  for each row
  execute function public.update_updated_at();

-- ============================================================================
-- TRIGGER: Update wallet balance on transaction completion
-- ============================================================================
create trigger update_wallet_balance_trigger
  after insert or update on public.wallet_transactions
  for each row
  execute function public.update_wallet_balance();
comment on trigger update_wallet_balance_trigger on public.wallet_transactions is 'Automatically updates wallet balance when transaction is completed';

-- ============================================================================
-- TRIGGER: Update updated_at on scheduled_donations
-- ============================================================================
create trigger update_scheduled_donations_updated_at
  before update on public.scheduled_donations
  for each row
  execute function public.update_updated_at();

