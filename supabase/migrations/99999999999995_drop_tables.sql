/*
 * Migration: Drop All Tables
 * Description: Drops all tables in the correct order (respecting foreign keys)
 * Author: System
 * Date: 2024-12-01
 * 
 * WARNING: This will delete all data and tables. Use only for cleanup/reset.
 */

-- Disable RLS first
alter table if exists public.notifications disable row level security;
alter table if exists public.scheduled_donations disable row level security;
alter table if exists public.wallet_transactions disable row level security;
alter table if exists public.user_wallets disable row level security;
alter table if exists public.feature_flags disable row level security;
alter table if exists public.invitations disable row level security;
alter table if exists public.user_preferences disable row level security;
alter table if exists public.user_follows disable row level security;
alter table if exists public.verse_of_the_day disable row level security;
alter table if exists public.bible_verses disable row level security;
alter table if exists public.bible_chapters disable row level security;
alter table if exists public.bible_books disable row level security;
alter table if exists public.room_participants disable row level security;
alter table if exists public.room_content disable row level security;
alter table if exists public.story_content disable row level security;
alter table if exists public.article_content disable row level security;
alter table if exists public.video_content disable row level security;
alter table if exists public.audio_content disable row level security;
alter table if exists public.content_items disable row level security;
alter table if exists public.donations disable row level security;
alter table if exists public.payments disable row level security;
alter table if exists public.donation_campaigns disable row level security;
alter table if exists public.event_rsvps disable row level security;
alter table if exists public.event_co_hosts disable row level security;
alter table if exists public.events disable row level security;
alter table if exists public.donation_categories disable row level security;
alter table if exists public.event_categories disable row level security;
alter table if exists public.user_roles disable row level security;
alter table if exists public.profiles disable row level security;
alter table if exists public.bank_accounts disable row level security;
alter table if exists public.churches disable row level security;

-- Drop tables in reverse order of creation (respecting foreign keys)
drop table if exists public.notifications cascade;
drop table if exists public.scheduled_donations cascade;
drop table if exists public.wallet_transactions cascade;
drop table if exists public.user_wallets cascade;
drop table if exists public.feature_flags cascade;
drop table if exists public.invitations cascade;
drop table if exists public.user_preferences cascade;
drop table if exists public.user_follows cascade;
drop table if exists public.verse_of_the_day cascade;
drop table if exists public.bible_verses cascade;
drop table if exists public.bible_chapters cascade;
drop table if exists public.bible_books cascade;
drop table if exists public.room_participants cascade;
drop table if exists public.room_content cascade;
drop table if exists public.story_content cascade;
drop table if exists public.article_content cascade;
drop table if exists public.video_content cascade;
drop table if exists public.audio_content cascade;
drop table if exists public.content_items cascade;
drop table if exists public.donations cascade;
drop table if exists public.payments cascade;
drop table if exists public.donation_campaigns cascade;
drop table if exists public.event_rsvps cascade;
drop table if exists public.event_co_hosts cascade;
drop table if exists public.events cascade;
drop table if exists public.donation_categories cascade;
drop table if exists public.event_categories cascade;
drop table if exists public.user_roles cascade;
drop table if exists public.profiles cascade;
drop table if exists public.bank_accounts cascade;
drop table if exists public.churches cascade;

