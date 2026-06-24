/*
 * Migration: Drop All Enums
 * Description: Drops all custom enum types
 * Author: System
 * Date: 2024-12-01
 * 
 * WARNING: This will remove all enum types. Use only for cleanup/reset.
 */

-- Drop all custom enum types
drop type if exists public.wallet_transaction_status cascade;
drop type if exists public.wallet_transaction_type cascade;
drop type if exists public.event_co_host_status cascade;
drop type if exists public.feature_flag_scope cascade;
drop type if exists public.notification_type cascade;
drop type if exists public.room_participant_role cascade;
drop type if exists public.room_status cascade;
drop type if exists public.invitation_status cascade;
drop type if exists public.donation_status cascade;
drop type if exists public.campaign_status cascade;
drop type if exists public.rsvp_status cascade;
drop type if exists public.event_status cascade;
drop type if exists public.content_status cascade;
drop type if exists public.content_type cascade;
drop type if exists public.user_role cascade;
drop type if exists public.church_status cascade;

