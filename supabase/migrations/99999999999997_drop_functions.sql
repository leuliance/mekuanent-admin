/*
 * Migration: Drop All Functions
 * Description: Drops all custom functions
 * Author: System
 * Date: 2024-12-01
 * 
 * WARNING: This will remove all utility functions. Use only for cleanup/reset.
 */

-- Drop all custom functions
drop function if exists public.handle_new_user() cascade;
drop function if exists public.sync_user_data() cascade;
drop function if exists public.update_updated_at() cascade;
drop function if exists public.is_super_admin(uuid) cascade;
drop function if exists public.is_church_admin(uuid, uuid) cascade;
drop function if exists public.is_content_admin(uuid, uuid) cascade;
drop function if exists public.is_content_creator(uuid, uuid) cascade;
drop function if exists public.user_has_role_in_church(uuid, uuid, public.user_role) cascade;
drop function if exists public.update_donation_amounts() cascade;
drop function if exists public.expire_old_stories() cascade;
drop function if exists public.close_completed_events() cascade;
drop function if exists public.expire_old_invitations() cascade;
drop function if exists public.get_user_churches(uuid) cascade;
drop function if exists public.get_followed_churches(uuid) cascade;
drop function if exists public.increment_content_view_count(uuid) cascade;
drop function if exists public.update_wallet_balance() cascade;
drop function if exists public.get_user_wallet_balance(uuid) cascade;
drop function if exists public.process_scheduled_donation(uuid) cascade;
drop function if exists public.accept_invitation(text, uuid) cascade;
drop function if exists public.user_has_role(uuid, public.user_role) cascade;
drop function if exists public.user_has_church_role(uuid, uuid, public.user_role) cascade;

