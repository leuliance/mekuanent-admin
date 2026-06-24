/*
 * Migration: Create Core Tables
 * Description: Creates all tables for the Mekuannent multi-tenant church platform
 * Author: System
 * Date: 2024-12-01
 * 
 * Tables created:
 * - churches: Multi-tenant church data
 * - profiles: User profiles extending auth.users
 * - user_roles: Junction table for church-specific roles
 * - event_categories: Dynamic event categories per church
 * - donation_categories: Dynamic donation categories per church
 * - events: Church events with RSVP capability
 * - event_co_hosts: Co-hosting relationships between churches
 * - event_rsvps: User RSVPs to events
 * - donation_campaigns: GoFundMe-style campaigns
 * - donations: Individual donation transactions
 * - content_items: Polymorphic base for all content types
 * - audio_content: Audio-specific metadata
 * - video_content: Video-specific metadata
 * - article_content: Article-specific metadata
 * - story_content: Story-specific metadata with expiry
 * - room_content: Live audio room metadata
 * - room_participants: Participants in audio rooms
 * - bible_books: Bible book structure
 * - bible_chapters: Bible chapter structure
 * - bible_verses: Individual verses
 * - verse_of_the_day: Daily verse scheduling
 * - user_follows: User following churches
 * - user_preferences: User notification and team preferences
 * - invitations: Role invitation system
 * - feature_flags: Platform and church feature toggles
 * - notifications: User notifications
 */

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable PostGIS extension for geography/geometry types
create extension if not exists postgis with schema extensions;

-- ============================================================================
-- CHURCHES TABLE
-- ============================================================================
create table public.churches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description jsonb not null default '{"am": "", "en": ""}'::jsonb,
  phone_number text not null,
  email text,
  website text,
  location jsonb,
  address text,
  city text,
  state text,
  country text default 'Ethiopia',
  coordinates extensions.geography(POINT) not null,
  logo_url text,
  cover_image_url text,
  status public.church_status not null default 'pending',
  rejected_reason text,
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint churches_email_format check (email is null or email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  constraint churches_phone_format check (phone_number ~ '^\+?[0-9]{10,15}$'),
  constraint churches_description_has_amharic check (description ? 'am' and description->>'am' is not null)
);
comment on table public.churches is 'Multi-tenant church data with registration workflow';
comment on column public.churches.status is 'Current status in registration workflow';
comment on column public.churches.verified_by is 'Super admin who approved the church';
comment on column public.churches.description is 'Multilingual description with required Amharic translation';
comment on column public.churches.phone_number is 'Required contact phone number';
comment on column public.churches.location is 'Additional location metadata as JSON';
comment on column public.churches.coordinates is 'Geographic coordinates as PostGIS POINT (longitude latitude)';

-- ============================================================================
-- BANK_ACCOUNTS TABLE
-- ============================================================================
create table public.bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references public.churches(id) on delete cascade,
  bank_name jsonb not null default '{"am": "", "en": ""}'::jsonb,
  account_number text not null,
  account_holder_name text not null,
  swift_code text,
  branch_name text,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint bank_accounts_unique unique (church_id, account_number),
  constraint bank_accounts_bank_name_has_amharic check (bank_name ? 'am' and bank_name->>'am' is not null)
);
comment on table public.bank_accounts is 'Church bank accounts for receiving donations';
comment on column public.bank_accounts.is_primary is 'Primary account for donations';
comment on column public.bank_accounts.bank_name is 'Multilingual bank name with required Amharic translation';

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  first_name text,
  last_name text,
  phone_number text unique,
  avatar_url text,
  bio text,
  date_of_birth date,
  gender text,
  city text,
  country text default 'Ethiopia',
  language_preference text default 'am',
  notification_enabled boolean not null default true,
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint profiles_phone_format check (phone_number is null or phone_number ~ '^\+?[0-9]{10,15}$'),
  constraint profiles_email_format check (email is null or email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  constraint profiles_gender_valid check (gender is null or gender in ('male', 'female', 'other'))
);
comment on table public.profiles is 'User profiles extending Supabase auth.users';
comment on column public.profiles.email is 'User email (optional, synced from auth.users)';
comment on column public.profiles.phone_number is 'Phone number (optional during signup, enforce at app level)';
comment on column public.profiles.language_preference is 'User preferred language code (am=Amharic, en=English)';
comment on column public.profiles.first_name is 'User first name';
comment on column public.profiles.last_name is 'User last name';

-- ============================================================================
-- USER ROLES TABLE
-- ============================================================================
create table public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  church_id uuid references public.churches(id) on delete cascade,
  role public.user_role not null,
  assigned_by uuid references public.profiles(id),
  assigned_at timestamptz not null default now(),
  
  constraint user_roles_unique unique (user_id, church_id, role),
  constraint user_roles_church_required check (
    (role = 'super_admin' and church_id is null) or
    (role != 'super_admin' and church_id is not null)
  )
);
comment on table public.user_roles is 'Junction table for church-specific user roles';
comment on column public.user_roles.church_id is 'Null for super_admin, required for other roles';

-- ============================================================================
-- EVENT CATEGORIES TABLE
-- ============================================================================
create table public.event_categories (
  id uuid primary key default uuid_generate_v4(),
  name jsonb not null default '{"am": "", "en": ""}'::jsonb,
  description jsonb not null default '{"am": "", "en": ""}'::jsonb,
  color text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint event_categories_name_has_amharic check (name ? 'am' and name->>'am' is not null),
  constraint event_categories_description_has_amharic check (description ? 'am' and description->>'am' is not null)
);
comment on table public.event_categories is 'Global event categories available to all churches';
comment on column public.event_categories.name is 'Multilingual category name with required Amharic translation';

-- ============================================================================
-- DONATION CATEGORIES TABLE
-- ============================================================================
create table public.donation_categories (
  id uuid primary key default uuid_generate_v4(),
  name jsonb not null default '{"am": "", "en": ""}'::jsonb,
  description jsonb not null default '{"am": "", "en": ""}'::jsonb,
  color text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint donation_categories_name_has_amharic check (name ? 'am' and name->>'am' is not null),
  constraint donation_categories_description_has_amharic check (description ? 'am' and description->>'am' is not null)
);
comment on table public.donation_categories is 'Global donation categories available to all churches';
comment on column public.donation_categories.name is 'Multilingual category name with required Amharic translation';

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references public.churches(id) on delete cascade,
  category_id uuid references public.event_categories(id) on delete set null,
  title jsonb not null default '{"am": "", "en": ""}'::jsonb,
  description jsonb not null default '{"am": "", "en": ""}'::jsonb,
  location jsonb,
  address text,
  coordinates extensions.geography(POINT),
  start_time timestamptz not null,
  end_time timestamptz not null,
  cover_image_url text,
  is_online boolean not null default false,
  meeting_url text,
  max_attendees integer,
  rsvp_deadline timestamptz,
  has_donation boolean not null default false,
  donation_goal_amount numeric(12, 2),
  donation_current_amount numeric(12, 2) not null default 0,
  donation_currency text default 'ETB',
  bank_account_id uuid references public.bank_accounts(id) on delete set null,
  status public.event_status not null default 'draft',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint events_end_after_start check (end_time > start_time),
  constraint events_rsvp_before_start check (rsvp_deadline is null or rsvp_deadline < start_time),
  constraint events_meeting_url_required check (
    (is_online = false) or (is_online = true and meeting_url is not null)
  ),
  constraint events_title_has_amharic check (title ? 'am' and title->>'am' is not null),
  constraint events_description_has_amharic check (description ? 'am' and description->>'am' is not null),
  constraint events_donation_goal_positive check (donation_goal_amount is null or donation_goal_amount > 0),
  constraint events_donation_current_non_negative check (donation_current_amount >= 0),
  constraint events_donation_bank_required check (
    (has_donation = false) or (has_donation = true and bank_account_id is not null)
  )
);
comment on table public.events is 'Church events with RSVP, co-hosting, and optional donation capability';
comment on column public.events.rsvp_deadline is 'Auto-close RSVPs after this time';
comment on column public.events.has_donation is 'Whether event accepts donations';
comment on column public.events.bank_account_id is 'Bank account to receive event donations - specifies which church account receives event donations';
comment on column public.events.location is 'Additional location metadata as JSON';
comment on column public.events.coordinates is 'Geographic coordinates as PostGIS POINT (longitude latitude)';

-- ============================================================================
-- EVENT CO-HOSTS TABLE
-- ============================================================================
create table public.event_co_hosts (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  church_id uuid not null references public.churches(id) on delete cascade,
  invited_by uuid not null references public.profiles(id),
  status public.event_co_host_status not null default 'pending',
  responded_by uuid references public.profiles(id),
  responded_at timestamptz,
  invited_at timestamptz not null default now(),
  
  constraint event_co_hosts_unique unique (event_id, church_id)
);
comment on table public.event_co_hosts is 'Churches co-hosting events together with acceptance workflow';
comment on column public.event_co_hosts.status is 'Co-host invitation status (pending/accepted/declined)';
comment on column public.event_co_hosts.responded_by is 'Church admin who responded to invitation';

-- ============================================================================
-- EVENT RSVPS TABLE
-- ============================================================================
create table public.event_rsvps (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.rsvp_status not null default 'going',
  guest_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint event_rsvps_unique unique (event_id, user_id),
  constraint event_rsvps_guest_count_positive check (guest_count >= 0)
);
comment on table public.event_rsvps is 'User RSVPs to events';
comment on column public.event_rsvps.guest_count is 'Number of additional guests';

-- ============================================================================
-- DONATION CAMPAIGNS TABLE
-- ============================================================================
create table public.donation_campaigns (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references public.churches(id) on delete cascade,
  category_id uuid references public.donation_categories(id) on delete set null,
  title jsonb not null default '{"am": "", "en": ""}'::jsonb,
  description jsonb not null default '{"am": "", "en": ""}'::jsonb,
  goal_amount numeric(12, 2) not null,
  current_amount numeric(12, 2) not null default 0,
  currency text not null default 'ETB',
  cover_image_url text,
  bank_account_id uuid not null references public.bank_accounts(id) on delete restrict,
  start_date timestamptz not null default now(),
  end_date timestamptz,
  status public.campaign_status not null default 'draft',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint donation_campaigns_goal_positive check (goal_amount > 0),
  constraint donation_campaigns_current_non_negative check (current_amount >= 0),
  constraint donation_campaigns_end_after_start check (end_date is null or end_date > start_date),
  constraint donation_campaigns_title_has_amharic check (title ? 'am' and title->>'am' is not null),
  constraint donation_campaigns_description_has_amharic check (description ? 'am' and description->>'am' is not null)
);
comment on table public.donation_campaigns is 'GoFundMe-style donation campaigns per church';
comment on column public.donation_campaigns.current_amount is 'Auto-updated from donations table';
comment on column public.donation_campaigns.bank_account_id is 'Bank account to receive campaign donations';

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12, 2) not null,
  currency text not null default 'ETB',
  payment_method text not null,
  payment_gateway text,
  gateway_transaction_id text,
  gateway_reference text,
  gateway_response jsonb,
  status public.donation_status not null default 'pending',
  payment_details jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  failed_at timestamptz,
  
  constraint payments_amount_positive check (amount > 0)
);
comment on table public.payments is 'Payment transaction details for all donations';
comment on column public.payments.payment_method is 'Payment method: card, bank_transfer, mobile_money, wallet, etc';
comment on column public.payments.payment_gateway is 'Payment gateway used: stripe, chapa, telebirr, etc';
comment on column public.payments.gateway_transaction_id is 'Transaction ID from payment gateway';
comment on column public.payments.gateway_response is 'Full response from payment gateway';
comment on column public.payments.payment_details is 'Additional payment metadata (card last 4 digits, bank name, etc)';

-- ============================================================================
-- DONATIONS TABLE
-- ============================================================================
create table public.donations (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.donation_campaigns(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  amount numeric(12, 2) not null,
  currency text not null default 'ETB',
  status public.donation_status not null default 'pending',
  is_anonymous boolean not null default false,
  message jsonb default '{"am": "", "en": ""}'::jsonb,
  from_wallet boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  
  constraint donations_amount_positive check (amount > 0),
  constraint donations_target_required check (
    (campaign_id is not null and event_id is null) or
    (campaign_id is null and event_id is not null)
  )
);
comment on table public.donations is 'Individual donation transactions - signed-in users only';
comment on column public.donations.is_anonymous is 'Hide donor name from public display';
comment on column public.donations.campaign_id is 'Campaign donation (mutually exclusive with event_id)';
comment on column public.donations.event_id is 'Event donation (mutually exclusive with campaign_id)';
comment on column public.donations.from_wallet is 'Whether donation was made from user wallet';
comment on column public.donations.payment_id is 'Reference to payment transaction details';
comment on column public.donations.message is 'Optional multilingual message from donor';

-- ============================================================================
-- CONTENT ITEMS TABLE
-- ============================================================================
create table public.content_items (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references public.churches(id) on delete cascade,
  content_type public.content_type not null,
  title jsonb not null default '{"am": "", "en": ""}'::jsonb,
  description jsonb not null default '{"am": "", "en": ""}'::jsonb,
  thumbnail_url text,
  status public.content_status not null default 'draft',
  view_count integer not null default 0,
  like_count integer not null default 0,
  share_count integer not null default 0,
  created_by uuid not null references public.profiles(id),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  rejected_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint content_items_view_count_non_negative check (view_count >= 0),
  constraint content_items_like_count_non_negative check (like_count >= 0),
  constraint content_items_share_count_non_negative check (share_count >= 0),
  constraint content_items_title_has_amharic check (title ? 'am' and title->>'am' is not null),
  constraint content_items_description_has_amharic check (description ? 'am' and description->>'am' is not null)
);
comment on table public.content_items is 'Polymorphic base table for all content types';
comment on column public.content_items.content_type is 'Determines which child table to join';

-- ============================================================================
-- AUDIO CONTENT TABLE
-- ============================================================================
create table public.audio_content (
  id uuid primary key references public.content_items(id) on delete cascade,
  audio_url text not null,
  duration_seconds integer,
  file_size_bytes bigint,
  album_name jsonb default '{"am": "", "en": ""}'::jsonb,
  artist_name jsonb default '{"am": "", "en": ""}'::jsonb,
  genre text,
  is_playlist boolean not null default false,
  
  constraint audio_content_duration_positive check (duration_seconds is null or duration_seconds > 0),
  constraint audio_content_file_size_positive check (file_size_bytes is null or file_size_bytes > 0)
);
comment on table public.audio_content is 'Audio-specific metadata for sermons, music, podcasts';
comment on column public.audio_content.album_name is 'Multilingual album name';
comment on column public.audio_content.artist_name is 'Multilingual artist/performer name';

-- ============================================================================
-- VIDEO CONTENT TABLE
-- ============================================================================
create table public.video_content (
  id uuid primary key references public.content_items(id) on delete cascade,
  video_url text not null,
  duration_seconds integer,
  file_size_bytes bigint,
  resolution text,
  aspect_ratio text,
  
  constraint video_content_duration_positive check (duration_seconds is null or duration_seconds > 0),
  constraint video_content_file_size_positive check (file_size_bytes is null or file_size_bytes > 0)
);
comment on table public.video_content is 'Video-specific metadata for TikTok-style feed';

-- ============================================================================
-- ARTICLE CONTENT TABLE
-- ============================================================================
create table public.article_content (
  id uuid primary key references public.content_items(id) on delete cascade,
  body jsonb not null default '{"am": "", "en": ""}'::jsonb,
  read_time_minutes integer,
  author_name jsonb default '{"am": "", "en": ""}'::jsonb,
  
  constraint article_content_read_time_positive check (read_time_minutes is null or read_time_minutes > 0),
  constraint article_content_body_has_amharic check (body ? 'am' and body->>'am' is not null)
);
comment on table public.article_content is 'Article-specific metadata for blog posts and teachings';
comment on column public.article_content.body is 'Multilingual article body with required Amharic translation';
comment on column public.article_content.author_name is 'Multilingual author name';

-- ============================================================================
-- STORY CONTENT TABLE
-- ============================================================================
create table public.story_content (
  id uuid primary key references public.content_items(id) on delete cascade,
  media_url text not null,
  media_type text not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  
  constraint story_content_media_type_valid check (media_type in ('image', 'video'))
);
comment on table public.story_content is 'Instagram-style stories with 24-hour expiry';
comment on column public.story_content.expires_at is 'Story automatically hidden after this time';

-- ============================================================================
-- ROOM CONTENT TABLE
-- ============================================================================
create table public.room_content (
  id uuid primary key references public.content_items(id) on delete cascade,
  scheduled_start_time timestamptz,
  actual_start_time timestamptz,
  end_time timestamptz,
  room_status public.room_status not null default 'scheduled',
  max_speakers integer default 10,
  stream_key text,
  recording_url text,
  
  constraint room_content_max_speakers_positive check (max_speakers > 0),
  constraint room_content_end_after_start check (end_time is null or end_time > actual_start_time)
);
comment on table public.room_content is 'Clubhouse-style live audio room metadata';

-- ============================================================================
-- ROOM PARTICIPANTS TABLE
-- ============================================================================
create table public.room_participants (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.room_content(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.room_participant_role not null default 'listener',
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  
  constraint room_participants_unique unique (room_id, user_id),
  constraint room_participants_left_after_joined check (left_at is null or left_at > joined_at)
);
comment on table public.room_participants is 'Users participating in audio rooms';

-- ============================================================================
-- BIBLE BOOKS TABLE
-- ============================================================================
create table public.bible_books (
  id uuid primary key default uuid_generate_v4(),
  name jsonb not null default '{"am": ""}'::jsonb,
  testament jsonb not null default '{"am": ""}'::jsonb,
  book_number integer not null unique,
  chapter_count integer not null,
  
  constraint bible_books_book_number_positive check (book_number > 0),
  constraint bible_books_chapter_count_positive check (chapter_count > 0),
  constraint bible_books_name_has_amharic check (name ? 'am' and name->>'am' is not null),
  constraint bible_books_testament_has_amharic check (testament ? 'am' and testament->>'am' is not null)
);
comment on table public.bible_books is 'Bible book structure for Ethiopian Orthodox Bible';
comment on column public.bible_books.name is 'Multilingual book name with required Amharic';
comment on column public.bible_books.testament is 'Multilingual testament name with required Amharic';

-- ============================================================================
-- BIBLE CHAPTERS TABLE
-- ============================================================================
create table public.bible_chapters (
  id uuid primary key default uuid_generate_v4(),
  book_id uuid not null references public.bible_books(id) on delete cascade,
  chapter_number integer not null,
  verse_count integer not null,
  
  constraint bible_chapters_unique unique (book_id, chapter_number),
  constraint bible_chapters_chapter_number_positive check (chapter_number > 0),
  constraint bible_chapters_verse_count_positive check (verse_count > 0)
);
comment on table public.bible_chapters is 'Bible chapter structure';

-- ============================================================================
-- BIBLE VERSES TABLE
-- ============================================================================
create table public.bible_verses (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid not null references public.bible_chapters(id) on delete cascade,
  verse_number integer not null,
  text jsonb not null default '{"am": ""}'::jsonb,
  
  constraint bible_verses_unique unique (chapter_id, verse_number),
  constraint bible_verses_verse_number_positive check (verse_number > 0),
  constraint bible_verses_text_has_amharic check (text ? 'am' and text->>'am' is not null)
);
comment on table public.bible_verses is 'Individual Bible verses with multilingual support';
comment on column public.bible_verses.text is 'Multilingual verse text with required Amharic';

-- ============================================================================
-- VERSE OF THE DAY TABLE
-- ============================================================================
create table public.verse_of_the_day (
  id uuid primary key default uuid_generate_v4(),
  verse_id uuid not null references public.bible_verses(id) on delete cascade,
  scheduled_date date not null unique,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
comment on table public.verse_of_the_day is 'Daily verse scheduling managed by Super Admin';

-- ============================================================================
-- USER FOLLOWS TABLE
-- ============================================================================
create table public.user_follows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  church_id uuid not null references public.churches(id) on delete cascade,
  followed_at timestamptz not null default now(),
  
  constraint user_follows_unique unique (user_id, church_id)
);
comment on table public.user_follows is 'User following system for churches';

-- ============================================================================
-- USER PREFERENCES TABLE
-- ============================================================================
create table public.user_preferences (
  id uuid primary key references public.profiles(id) on delete cascade,
  notify_verse_of_day boolean not null default true,
  notify_new_content boolean not null default true,
  notify_events boolean not null default true,
  notify_donations boolean not null default false,
  theme_preference jsonb not null default '{"light_theme": {}, "dark_theme": {}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.user_preferences is 'User notification settings and theme preferences';
comment on column public.user_preferences.theme_preference is 'User theme settings with light and dark mode configurations';

-- ============================================================================
-- INVITATIONS TABLE
-- ============================================================================
create table public.invitations (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid references public.churches(id) on delete cascade,
  role public.user_role not null,
  phone_number text not null,
  token text not null unique,
  invited_by uuid not null references public.profiles(id),
  expires_at timestamptz not null default (now() + interval '7 days'),
  status public.invitation_status not null default 'pending',
  accepted_by uuid references public.profiles(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  
  constraint invitations_phone_format check (phone_number ~ '^\+?[0-9]{10,15}$'),
  constraint invitations_church_required check (
    (role = 'super_admin' and church_id is null) or
    (role != 'super_admin' and church_id is not null)
  )
);
comment on table public.invitations is 'Role invitation system via phone number and unique token';
comment on column public.invitations.token is 'Unique token for invitation link';

-- ============================================================================
-- FEATURE FLAGS TABLE
-- ============================================================================
create table public.feature_flags (
  id uuid primary key default uuid_generate_v4(),
  key text not null,
  name jsonb not null default '{"am": "", "en": ""}'::jsonb,
  description jsonb default '{"am": "", "en": ""}'::jsonb,
  scope public.feature_flag_scope not null default 'global',
  church_id uuid references public.churches(id) on delete cascade,
  is_enabled boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint feature_flags_unique unique (key, church_id),
  constraint feature_flags_scope_church_consistency check (
    (scope = 'global' and church_id is null) or
    (scope = 'church' and church_id is not null)
  ),
  constraint feature_flags_name_has_amharic check (name ? 'am' and name->>'am' is not null)
);
comment on table public.feature_flags is 'Platform and church-level feature toggles controlled by Super Admin';
comment on column public.feature_flags.name is 'Multilingual feature flag name with required Amharic';
comment on column public.feature_flags.description is 'Multilingual feature flag description';

-- ============================================================================
-- USER WALLETS TABLE
-- ============================================================================
create table public.user_wallets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  balance numeric(12, 2) not null default 0,
  currency text not null default 'ETB',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint user_wallets_balance_non_negative check (balance >= 0)
);
comment on table public.user_wallets is 'User wallet for donation management and refunds';
comment on column public.user_wallets.balance is 'Current wallet balance';

-- ============================================================================
-- WALLET TRANSACTIONS TABLE
-- ============================================================================
create table public.wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  wallet_id uuid not null references public.user_wallets(id) on delete cascade,
  transaction_type public.wallet_transaction_type not null,
  amount numeric(12, 2) not null,
  currency text not null default 'ETB',
  status public.wallet_transaction_status not null default 'pending',
  reference_type text,
  reference_id uuid,
  description text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  
  constraint wallet_transactions_amount_positive check (amount > 0)
);
comment on table public.wallet_transactions is 'Transaction history for user wallets';
comment on column public.wallet_transactions.transaction_type is 'deposit, withdrawal, refund, or donation';
comment on column public.wallet_transactions.reference_type is 'Type of related entity (donation, campaign, event)';
comment on column public.wallet_transactions.reference_id is 'ID of related entity';

-- ============================================================================
-- SCHEDULED DONATIONS TABLE
-- ============================================================================
create table public.scheduled_donations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  campaign_id uuid references public.donation_campaigns(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  amount numeric(12, 2) not null,
  currency text not null default 'ETB',
  frequency text not null,
  next_donation_date date not null,
  end_date date,
  is_active boolean not null default true,
  use_wallet boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint scheduled_donations_amount_positive check (amount > 0),
  constraint scheduled_donations_frequency_valid check (frequency in ('once', 'daily', 'weekly', 'monthly', 'yearly')),
  constraint scheduled_donations_target_required check (
    (campaign_id is not null and event_id is null) or
    (campaign_id is null and event_id is not null)
  ),
  constraint scheduled_donations_end_after_next check (end_date is null or end_date >= next_donation_date)
);
comment on table public.scheduled_donations is 'Scheduled recurring donations for users';
comment on column public.scheduled_donations.use_wallet is 'Whether to use wallet balance for scheduled donations';

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title jsonb not null default '{"am": "", "en": ""}'::jsonb,
  body jsonb not null default '{"am": "", "en": ""}'::jsonb,
  data jsonb,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  
  constraint notifications_read_consistency check (
    (is_read = false and read_at is null) or
    (is_read = true and read_at is not null)
  ),
  constraint notifications_title_has_amharic check (title ? 'am' and title->>'am' is not null),
  constraint notifications_body_has_amharic check (body ? 'am' and body->>'am' is not null)
);
comment on table public.notifications is 'User notifications for various events';
comment on column public.notifications.data is 'JSON payload with notification-specific data';
comment on column public.notifications.title is 'Multilingual notification title with required Amharic';
comment on column public.notifications.body is 'Multilingual notification body with required Amharic';

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================
alter table public.churches enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.event_categories enable row level security;
alter table public.donation_categories enable row level security;
alter table public.events enable row level security;
alter table public.event_co_hosts enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.donation_campaigns enable row level security;
alter table public.payments enable row level security;
alter table public.donations enable row level security;
alter table public.content_items enable row level security;
alter table public.audio_content enable row level security;
alter table public.video_content enable row level security;
alter table public.article_content enable row level security;
alter table public.story_content enable row level security;
alter table public.room_content enable row level security;
alter table public.room_participants enable row level security;
alter table public.bible_books enable row level security;
alter table public.bible_chapters enable row level security;
alter table public.bible_verses enable row level security;
alter table public.verse_of_the_day enable row level security;
alter table public.user_follows enable row level security;
alter table public.user_preferences enable row level security;
alter table public.invitations enable row level security;
alter table public.feature_flags enable row level security;
alter table public.user_wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.scheduled_donations enable row level security;
alter table public.notifications enable row level security;

