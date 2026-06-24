/*
 * Migration: Drop All Triggers
 * Description: Drops all triggers from public schema and auth.users
 * Author: System
 * Date: 2024-12-01
 * 
 * WARNING: This will remove all automated triggers. Use only for cleanup/reset.
 */

-- Drop triggers on auth.users
drop trigger if exists on_auth_user_created on auth.users cascade;
drop trigger if exists on_auth_user_data_updated on auth.users cascade;

-- Drop triggers on public tables
drop trigger if exists update_churches_updated_at on public.churches cascade;
drop trigger if exists update_profiles_updated_at on public.profiles cascade;
drop trigger if exists update_event_categories_updated_at on public.event_categories cascade;
drop trigger if exists update_donation_categories_updated_at on public.donation_categories cascade;
drop trigger if exists update_bank_accounts_updated_at on public.bank_accounts cascade;
drop trigger if exists update_events_updated_at on public.events cascade;
drop trigger if exists update_event_rsvps_updated_at on public.event_rsvps cascade;
drop trigger if exists update_donation_campaigns_updated_at on public.donation_campaigns cascade;
drop trigger if exists update_content_items_updated_at on public.content_items cascade;
drop trigger if exists update_user_preferences_updated_at on public.user_preferences cascade;
drop trigger if exists update_feature_flags_updated_at on public.feature_flags cascade;
drop trigger if exists update_donation_amounts_trigger on public.donations cascade;
drop trigger if exists update_user_wallets_updated_at on public.user_wallets cascade;
drop trigger if exists update_wallet_balance_trigger on public.wallet_transactions cascade;
drop trigger if exists update_scheduled_donations_updated_at on public.scheduled_donations cascade;

