/*
 * Migration: Create Indexes
 * Description: Creates indexes for optimal query performance
 * Author: System
 * Date: 2024-12-01
 * 
 * Indexes are created for:
 * - Foreign key relationships
 * - Frequently queried columns
 * - Multi-tenant isolation (church_id)
 * - User-specific queries
 * - Status-based queries
 * - Time-based queries
 */

-- ============================================================================
-- CHURCHES INDEXES
-- ============================================================================
create index idx_churches_status on public.churches(status);
create index idx_churches_created_at on public.churches(created_at desc);
create index idx_churches_coordinates on public.churches using gist(coordinates);

-- ============================================================================
-- BANK ACCOUNTS INDEXES
-- ============================================================================
create index idx_bank_accounts_church_id on public.bank_accounts(church_id);
create index idx_bank_accounts_is_primary on public.bank_accounts(church_id, is_primary) where is_primary = true;
create index idx_bank_accounts_is_active on public.bank_accounts(is_active);

-- ============================================================================
-- PROFILES INDEXES
-- ============================================================================
create index idx_profiles_email on public.profiles(email);
create index idx_profiles_phone_number on public.profiles(phone_number);
create index idx_profiles_created_at on public.profiles(created_at desc);

-- ============================================================================
-- USER ROLES INDEXES
-- ============================================================================
create index idx_user_roles_user_id on public.user_roles(user_id);
create index idx_user_roles_church_id on public.user_roles(church_id);
create index idx_user_roles_role on public.user_roles(role);
create index idx_user_roles_user_church on public.user_roles(user_id, church_id);

-- ============================================================================
-- EVENT CATEGORIES INDEXES
-- ============================================================================
create index idx_event_categories_created_at on public.event_categories(created_at desc);

-- ============================================================================
-- DONATION CATEGORIES INDEXES
-- ============================================================================
create index idx_donation_categories_created_at on public.donation_categories(created_at desc);

-- ============================================================================
-- EVENTS INDEXES
-- ============================================================================
create index idx_events_church_id on public.events(church_id);
create index idx_events_category_id on public.events(category_id);
create index idx_events_status on public.events(status);
create index idx_events_start_time on public.events(start_time);
create index idx_events_end_time on public.events(end_time);
create index idx_events_created_by on public.events(created_by);
create index idx_events_church_status on public.events(church_id, status);
create index idx_events_upcoming on public.events(start_time) where status = 'published';
create index idx_events_coordinates on public.events using gist(coordinates) where coordinates is not null;

-- ============================================================================
-- EVENT CO-HOSTS INDEXES
-- ============================================================================
create index idx_event_co_hosts_event_id on public.event_co_hosts(event_id);
create index idx_event_co_hosts_church_id on public.event_co_hosts(church_id);

-- ============================================================================
-- EVENT RSVPS INDEXES
-- ============================================================================
create index idx_event_rsvps_event_id on public.event_rsvps(event_id);
create index idx_event_rsvps_user_id on public.event_rsvps(user_id);
create index idx_event_rsvps_status on public.event_rsvps(status);

-- ============================================================================
-- DONATION CAMPAIGNS INDEXES
-- ============================================================================
create index idx_donation_campaigns_church_id on public.donation_campaigns(church_id);
create index idx_donation_campaigns_category_id on public.donation_campaigns(category_id);
create index idx_donation_campaigns_status on public.donation_campaigns(status);
create index idx_donation_campaigns_created_by on public.donation_campaigns(created_by);
create index idx_donation_campaigns_active on public.donation_campaigns(church_id, status) where status = 'active';

-- ============================================================================
-- PAYMENTS INDEXES
-- ============================================================================
create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_payment_method on public.payments(payment_method);
create index idx_payments_payment_gateway on public.payments(payment_gateway);
create index idx_payments_gateway_transaction_id on public.payments(gateway_transaction_id);
create index idx_payments_created_at on public.payments(created_at desc);

-- ============================================================================
-- DONATIONS INDEXES
-- ============================================================================
create index idx_donations_campaign_id on public.donations(campaign_id);
create index idx_donations_event_id on public.donations(event_id);
create index idx_donations_user_id on public.donations(user_id);
create index idx_donations_payment_id on public.donations(payment_id);
create index idx_donations_status on public.donations(status);
create index idx_donations_created_at on public.donations(created_at desc);

-- ============================================================================
-- CONTENT ITEMS INDEXES
-- ============================================================================
create index idx_content_items_church_id on public.content_items(church_id);
create index idx_content_items_content_type on public.content_items(content_type);
create index idx_content_items_status on public.content_items(status);
create index idx_content_items_created_by on public.content_items(created_by);
create index idx_content_items_published_at on public.content_items(published_at desc) where published_at is not null;
create index idx_content_items_church_type on public.content_items(church_id, content_type);
create index idx_content_items_church_type_status on public.content_items(church_id, content_type, status);
create index idx_content_items_approved on public.content_items(church_id, status) where status = 'approved';

-- ============================================================================
-- AUDIO CONTENT INDEXES
-- ============================================================================
create index idx_audio_content_album on public.audio_content(album_name);
create index idx_audio_content_artist on public.audio_content(artist_name);
create index idx_audio_content_genre on public.audio_content(genre);

-- ============================================================================
-- STORY CONTENT INDEXES
-- ============================================================================
create index idx_story_content_expires_at on public.story_content(expires_at);

-- ============================================================================
-- ROOM CONTENT INDEXES
-- ============================================================================
create index idx_room_content_room_status on public.room_content(room_status);
create index idx_room_content_scheduled_start on public.room_content(scheduled_start_time);
create index idx_room_content_live on public.room_content(id) where room_status = 'live';

-- ============================================================================
-- ROOM PARTICIPANTS INDEXES
-- ============================================================================
create index idx_room_participants_room_id on public.room_participants(room_id);
create index idx_room_participants_user_id on public.room_participants(user_id);
create index idx_room_participants_role on public.room_participants(role);
create index idx_room_participants_active on public.room_participants(room_id, user_id) where left_at is null;

-- ============================================================================
-- BIBLE BOOKS INDEXES
-- ============================================================================
create index idx_bible_books_testament on public.bible_books(testament);
create index idx_bible_books_book_number on public.bible_books(book_number);

-- ============================================================================
-- BIBLE CHAPTERS INDEXES
-- ============================================================================
create index idx_bible_chapters_book_id on public.bible_chapters(book_id);
create index idx_bible_chapters_book_chapter on public.bible_chapters(book_id, chapter_number);

-- ============================================================================
-- BIBLE VERSES INDEXES
-- ============================================================================
create index idx_bible_verses_chapter_id on public.bible_verses(chapter_id);
create index idx_bible_verses_chapter_verse on public.bible_verses(chapter_id, verse_number);
-- Full-text search indexes for Bible verses (jsonb)
create index idx_bible_verses_text_en_search on public.bible_verses using gin(to_tsvector('english', text->>'en')) where text ? 'en';
create index idx_bible_verses_text_am_search on public.bible_verses using gin(to_tsvector('simple', text->>'am'));

-- ============================================================================
-- VERSE OF THE DAY INDEXES
-- ============================================================================
create index idx_verse_of_the_day_scheduled_date on public.verse_of_the_day(scheduled_date);
create index idx_verse_of_the_day_verse_id on public.verse_of_the_day(verse_id);

-- ============================================================================
-- USER FOLLOWS INDEXES
-- ============================================================================
create index idx_user_follows_user_id on public.user_follows(user_id);
create index idx_user_follows_church_id on public.user_follows(church_id);
create index idx_user_follows_followed_at on public.user_follows(followed_at desc);

-- ============================================================================
-- INVITATIONS INDEXES
-- ============================================================================
create index idx_invitations_token on public.invitations(token);
create index idx_invitations_phone_number on public.invitations(phone_number);
create index idx_invitations_church_id on public.invitations(church_id);
create index idx_invitations_status on public.invitations(status);
create index idx_invitations_expires_at on public.invitations(expires_at);
create index idx_invitations_pending on public.invitations(token, status) where status = 'pending';

-- ============================================================================
-- FEATURE FLAGS INDEXES
-- ============================================================================
create index idx_feature_flags_key on public.feature_flags(key);
create index idx_feature_flags_church_id on public.feature_flags(church_id);
create index idx_feature_flags_scope on public.feature_flags(scope);
create index idx_feature_flags_enabled on public.feature_flags(key, church_id) where is_enabled = true;

-- ============================================================================
-- USER WALLETS INDEXES
-- ============================================================================
create index idx_user_wallets_user_id on public.user_wallets(user_id);
create index idx_user_wallets_is_active on public.user_wallets(is_active);

-- ============================================================================
-- WALLET TRANSACTIONS INDEXES
-- ============================================================================
create index idx_wallet_transactions_wallet_id on public.wallet_transactions(wallet_id);
create index idx_wallet_transactions_type on public.wallet_transactions(transaction_type);
create index idx_wallet_transactions_status on public.wallet_transactions(status);
create index idx_wallet_transactions_reference on public.wallet_transactions(reference_type, reference_id);
create index idx_wallet_transactions_created_at on public.wallet_transactions(created_at desc);

-- ============================================================================
-- SCHEDULED DONATIONS INDEXES
-- ============================================================================
create index idx_scheduled_donations_user_id on public.scheduled_donations(user_id);
create index idx_scheduled_donations_campaign_id on public.scheduled_donations(campaign_id);
create index idx_scheduled_donations_event_id on public.scheduled_donations(event_id);
create index idx_scheduled_donations_next_date on public.scheduled_donations(next_donation_date);
create index idx_scheduled_donations_active on public.scheduled_donations(user_id, is_active) where is_active = true;

-- ============================================================================
-- NOTIFICATIONS INDEXES
-- ============================================================================
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_type on public.notifications(type);
create index idx_notifications_is_read on public.notifications(is_read);
create index idx_notifications_created_at on public.notifications(created_at desc);
create index idx_notifications_user_unread on public.notifications(user_id, created_at desc) where is_read = false;

