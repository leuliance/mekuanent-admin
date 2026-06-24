/*
 * Migration: Create RLS Policies
 * Description: Row Level Security policies for multi-tenant isolation and access control
 * Author: System
 * Date: 2024-12-01
 * 
 * Security Model:
 * - Anonymous users: Can view approved churches and public content
 * - Authenticated users: Can follow churches, RSVP, donate, view their data
 * - Content creators: Can create content for their church
 * - Content admins: Can approve content and invite creators
 * - Church admins: Full church management
 * - Super admins: Platform-wide access
 */

-- ============================================================================
-- CHURCHES POLICIES
-- All users can view approved churches, admins can manage
-- ============================================================================

create policy "Churches are viewable by everyone"
  on public.churches
  for select
  to anon, authenticated
  using ( status = 'approved' );

create policy "Authenticated users can create churches"
  on public.churches
  for insert
  to authenticated
  with check ( true );

create policy "Church admins can update their church"
  on public.churches
  for update
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), id))
  )
  with check (
    (select public.is_church_admin((select auth.uid()), id))
  );

create policy "Super admins can view all churches"
  on public.churches
  for select
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update any church"
  on public.churches
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete churches"
  on public.churches
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- PROFILES POLICIES
-- Users can view all profiles, manage their own
-- ============================================================================

create policy "Profiles are viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using ( true );

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ( id = (select auth.uid()) )
  with check ( id = (select auth.uid()) );

create policy "Users can delete their own profile"
  on public.profiles
  for delete
  to authenticated
  using ( id = (select auth.uid()) );

-- ============================================================================
-- USER ROLES POLICIES
-- Users can view their roles, admins can manage roles
-- ============================================================================

create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using ( user_id = (select auth.uid()) );

create policy "Church admins can view roles in their church"
  on public.user_roles
  for select
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Super admins can view all roles"
  on public.user_roles
  for select
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Church admins can assign roles in their church"
  on public.user_roles
  for insert
  to authenticated
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
    and role != 'super_admin'
  );

create policy "Super admins can assign any role"
  on public.user_roles
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Church admins can update roles in their church"
  on public.user_roles
  for update
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  )
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
    and role != 'super_admin'
  );

create policy "Church admins can delete roles in their church"
  on public.user_roles
  for delete
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
    and role != 'super_admin'
  );

-- ============================================================================
-- BANK ACCOUNTS POLICIES
-- Church admins can manage their church bank accounts
-- ============================================================================

create policy "Authenticated users can view active bank accounts"
  on public.bank_accounts
  for select
  to authenticated
  using ( is_active = true );

create policy "Church admins can view their church bank accounts"
  on public.bank_accounts
  for select
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Church admins can create bank accounts"
  on public.bank_accounts
  for insert
  to authenticated
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Church admins can update bank accounts"
  on public.bank_accounts
  for update
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  )
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Church admins can delete bank accounts"
  on public.bank_accounts
  for delete
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

-- ============================================================================
-- EVENT CATEGORIES POLICIES
-- Public viewing, super admins can manage
-- ============================================================================

create policy "Event categories are viewable by everyone"
  on public.event_categories
  for select
  to anon, authenticated
  using ( true );

create policy "Super admins can create categories"
  on public.event_categories
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update categories"
  on public.event_categories
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete categories"
  on public.event_categories
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- DONATION CATEGORIES POLICIES
-- Public viewing, super admins can manage
-- ============================================================================

create policy "Donation categories are viewable by everyone"
  on public.donation_categories
  for select
  to anon, authenticated
  using ( true );

create policy "Super admins can create donation categories"
  on public.donation_categories
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update donation categories"
  on public.donation_categories
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete donation categories"
  on public.donation_categories
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- EVENTS POLICIES
-- Published events viewable by all, creators can manage
-- ============================================================================

create policy "Published events are viewable by everyone"
  on public.events
  for select
  to anon, authenticated
  using ( status = 'published' );

create policy "Event creators can view their drafts"
  on public.events
  for select
  to authenticated
  using (
    created_by = (select auth.uid())
  );

create policy "Church admins can view all church events"
  on public.events
  for select
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Content creators can create events"
  on public.events
  for insert
  to authenticated
  with check (
    (select public.is_content_creator((select auth.uid()), church_id))
  );

create policy "Event creators can update their events"
  on public.events
  for update
  to authenticated
  using (
    created_by = (select auth.uid())
  )
  with check (
    created_by = (select auth.uid())
  );

create policy "Church admins can update church events"
  on public.events
  for update
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  )
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Event creators can delete their events"
  on public.events
  for delete
  to authenticated
  using (
    created_by = (select auth.uid())
    or (select public.is_church_admin((select auth.uid()), church_id))
  );

-- ============================================================================
-- EVENT CO-HOSTS POLICIES
-- ============================================================================

create policy "Event co-hosts are viewable with event"
  on public.event_co_hosts
  for select
  to anon, authenticated
  using ( true );

create policy "Church admins can add co-hosts"
  on public.event_co_hosts
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where events.id = event_id
      and (
        events.created_by = (select auth.uid())
        or (select public.is_church_admin((select auth.uid()), events.church_id))
      )
    )
  );

create policy "Event creators can remove co-hosts"
  on public.event_co_hosts
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = event_id
      and (
        events.created_by = (select auth.uid())
        or (select public.is_church_admin((select auth.uid()), events.church_id))
      )
    )
  );

-- ============================================================================
-- EVENT RSVPS POLICIES
-- Users can manage their own RSVPs
-- ============================================================================

create policy "Event RSVPs are viewable by authenticated users"
  on public.event_rsvps
  for select
  to authenticated
  using ( true );

create policy "Authenticated users can create RSVPs"
  on public.event_rsvps
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
  );

create policy "Users can update their own RSVPs"
  on public.event_rsvps
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "Users can delete their own RSVPs"
  on public.event_rsvps
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- ============================================================================
-- DONATION CAMPAIGNS POLICIES
-- Active campaigns viewable by all, creators can manage
-- ============================================================================

create policy "Active campaigns are viewable by everyone"
  on public.donation_campaigns
  for select
  to anon, authenticated
  using ( status = 'active' );

create policy "Campaign creators can view their campaigns"
  on public.donation_campaigns
  for select
  to authenticated
  using (
    created_by = (select auth.uid())
  );

create policy "Church admins can view all church campaigns"
  on public.donation_campaigns
  for select
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Content creators can create campaigns"
  on public.donation_campaigns
  for insert
  to authenticated
  with check (
    (select public.is_content_creator((select auth.uid()), church_id))
  );

create policy "Campaign creators can update their campaigns"
  on public.donation_campaigns
  for update
  to authenticated
  using (
    created_by = (select auth.uid())
  )
  with check (
    created_by = (select auth.uid())
  );

create policy "Church admins can update church campaigns"
  on public.donation_campaigns
  for update
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  )
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Church admins can delete campaigns"
  on public.donation_campaigns
  for delete
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

-- ============================================================================
-- PAYMENTS POLICIES
-- Users can view their own payments, church admins can view church payments
-- ============================================================================

create policy "Users can view their own payments"
  on public.payments
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
  );

create policy "Church admins can view church payments"
  on public.payments
  for select
  to authenticated
  using (
    exists (
      select 1 from public.donations
      join public.donation_campaigns on donations.campaign_id = donation_campaigns.id
      where donations.payment_id = payments.id
      and (select public.is_church_admin((select auth.uid()), donation_campaigns.church_id))
    )
    or exists (
      select 1 from public.donations
      join public.events on donations.event_id = events.id
      where donations.payment_id = payments.id
      and (select public.is_church_admin((select auth.uid()), events.church_id))
    )
  );

create policy "Authenticated users can create payments"
  on public.payments
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
  );

create policy "System can update payments"
  on public.payments
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

-- ============================================================================
-- DONATIONS POLICIES
-- Donors can view their donations, signed-in users only can donate
-- ============================================================================

create policy "Users can view their own donations"
  on public.donations
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
  );

create policy "Church admins can view church donations"
  on public.donations
  for select
  to authenticated
  using (
    exists (
      select 1 from public.donation_campaigns
      where donation_campaigns.id = campaign_id
      and (select public.is_church_admin((select auth.uid()), donation_campaigns.church_id))
    )
  );

create policy "Authenticated users can create donations"
  on public.donations
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
  );

create policy "Users cannot update donations"
  on public.donations
  for update
  to authenticated
  using ( false )
  with check ( false );

create policy "Users cannot delete donations"
  on public.donations
  for delete
  to authenticated
  using ( false );

-- ============================================================================
-- CONTENT ITEMS POLICIES
-- Approved content viewable by all, creators can manage
-- ============================================================================

create policy "Approved content is viewable by everyone"
  on public.content_items
  for select
  to anon, authenticated
  using ( status = 'approved' );

create policy "Content creators can view their content"
  on public.content_items
  for select
  to authenticated
  using (
    created_by = (select auth.uid())
  );

create policy "Content admins can view church content"
  on public.content_items
  for select
  to authenticated
  using (
    (select public.is_content_admin((select auth.uid()), church_id))
  );

create policy "Content creators can create content"
  on public.content_items
  for insert
  to authenticated
  with check (
    (select public.is_content_creator((select auth.uid()), church_id))
  );

create policy "Content creators can update their content"
  on public.content_items
  for update
  to authenticated
  using (
    created_by = (select auth.uid())
  )
  with check (
    created_by = (select auth.uid())
  );

create policy "Content admins can approve content"
  on public.content_items
  for update
  to authenticated
  using (
    (select public.is_content_admin((select auth.uid()), church_id))
  )
  with check (
    (select public.is_content_admin((select auth.uid()), church_id))
  );

create policy "Content creators can delete their content"
  on public.content_items
  for delete
  to authenticated
  using (
    created_by = (select auth.uid())
    or (select public.is_content_admin((select auth.uid()), church_id))
  );

-- ============================================================================
-- AUDIO CONTENT POLICIES
-- Inherits from content_items
-- ============================================================================

create policy "Audio content is viewable with content item"
  on public.audio_content
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = audio_content.id
      and content_items.status = 'approved'
    )
  );

create policy "Content creators can view their audio"
  on public.audio_content
  for select
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = audio_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can create audio"
  on public.audio_content
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = audio_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can update their audio"
  on public.audio_content
  for update
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = audio_content.id
      and content_items.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = audio_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can delete their audio"
  on public.audio_content
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = audio_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

-- ============================================================================
-- VIDEO CONTENT POLICIES
-- Inherits from content_items
-- ============================================================================

create policy "Video content is viewable with content item"
  on public.video_content
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = video_content.id
      and content_items.status = 'approved'
    )
  );

create policy "Content creators can view their videos"
  on public.video_content
  for select
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = video_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can create videos"
  on public.video_content
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = video_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can update their videos"
  on public.video_content
  for update
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = video_content.id
      and content_items.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = video_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can delete their videos"
  on public.video_content
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = video_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

-- ============================================================================
-- ARTICLE CONTENT POLICIES
-- Inherits from content_items
-- ============================================================================

create policy "Article content is viewable with content item"
  on public.article_content
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = article_content.id
      and content_items.status = 'approved'
    )
  );

create policy "Content creators can view their articles"
  on public.article_content
  for select
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = article_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can create articles"
  on public.article_content
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = article_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can update their articles"
  on public.article_content
  for update
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = article_content.id
      and content_items.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = article_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can delete their articles"
  on public.article_content
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = article_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

-- ============================================================================
-- STORY CONTENT POLICIES
-- Inherits from content_items
-- ============================================================================

create policy "Story content is viewable with content item"
  on public.story_content
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = story_content.id
      and content_items.status = 'approved'
      and story_content.expires_at > now()
    )
  );

create policy "Content creators can view their stories"
  on public.story_content
  for select
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = story_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can create stories"
  on public.story_content
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = story_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can update their stories"
  on public.story_content
  for update
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = story_content.id
      and content_items.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = story_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can delete their stories"
  on public.story_content
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = story_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

-- ============================================================================
-- ROOM CONTENT POLICIES
-- Inherits from content_items
-- ============================================================================

create policy "Room content is viewable with content item"
  on public.room_content
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = room_content.id
      and content_items.status = 'approved'
    )
  );

create policy "Content creators can view their rooms"
  on public.room_content
  for select
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = room_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can create rooms"
  on public.room_content
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = room_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can update their rooms"
  on public.room_content
  for update
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = room_content.id
      and content_items.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.content_items
      where content_items.id = room_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Content creators can delete their rooms"
  on public.room_content
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = room_content.id
      and content_items.created_by = (select auth.uid())
    )
  );

-- ============================================================================
-- ROOM PARTICIPANTS POLICIES
-- Participants can view and manage their participation
-- ============================================================================

create policy "Room participants are viewable by authenticated users"
  on public.room_participants
  for select
  to authenticated
  using ( true );

create policy "Authenticated users can join rooms"
  on public.room_participants
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
  );

create policy "Users can update their participation"
  on public.room_participants
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "Room hosts can manage participants"
  on public.room_participants
  for update
  to authenticated
  using (
    exists (
      select 1 from public.room_content
      join public.content_items on room_content.id = content_items.id
      where room_content.id = room_id
      and content_items.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.room_content
      join public.content_items on room_content.id = content_items.id
      where room_content.id = room_id
      and content_items.created_by = (select auth.uid())
    )
  );

create policy "Users can leave rooms"
  on public.room_participants
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- ============================================================================
-- BIBLE BOOKS POLICIES
-- Public access for reading, super admin for management
-- ============================================================================

create policy "Bible books are viewable by everyone"
  on public.bible_books
  for select
  to anon, authenticated
  using ( true );

create policy "Super admins can create bible books"
  on public.bible_books
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update bible books"
  on public.bible_books
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete bible books"
  on public.bible_books
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- BIBLE CHAPTERS POLICIES
-- Public access for reading, super admin for management
-- ============================================================================

create policy "Bible chapters are viewable by everyone"
  on public.bible_chapters
  for select
  to anon, authenticated
  using ( true );

create policy "Super admins can create bible chapters"
  on public.bible_chapters
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update bible chapters"
  on public.bible_chapters
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete bible chapters"
  on public.bible_chapters
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- BIBLE VERSES POLICIES
-- Public access for reading, super admin for management
-- ============================================================================

create policy "Bible verses are viewable by everyone"
  on public.bible_verses
  for select
  to anon, authenticated
  using ( true );

create policy "Super admins can create bible verses"
  on public.bible_verses
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update bible verses"
  on public.bible_verses
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete bible verses"
  on public.bible_verses
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- VERSE OF THE DAY POLICIES
-- Public viewing, super admin management
-- ============================================================================

create policy "Verse of the day is viewable by everyone"
  on public.verse_of_the_day
  for select
  to anon, authenticated
  using ( true );

create policy "Super admins can schedule verse of the day"
  on public.verse_of_the_day
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update verse of the day"
  on public.verse_of_the_day
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete verse of the day"
  on public.verse_of_the_day
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- USER FOLLOWS POLICIES
-- Users can manage their follows
-- ============================================================================

create policy "User follows are viewable by authenticated users"
  on public.user_follows
  for select
  to authenticated
  using ( true );

create policy "Users can follow churches"
  on public.user_follows
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
  );

create policy "Users can unfollow churches"
  on public.user_follows
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- ============================================================================
-- USER PREFERENCES POLICIES
-- Users can manage their own preferences
-- ============================================================================

create policy "Users can view their own preferences"
  on public.user_preferences
  for select
  to authenticated
  using ( id = (select auth.uid()) );

create policy "Users can update their own preferences"
  on public.user_preferences
  for update
  to authenticated
  using ( id = (select auth.uid()) )
  with check ( id = (select auth.uid()) );

-- ============================================================================
-- INVITATIONS POLICIES
-- Admins can manage invitations
-- ============================================================================

create policy "Church admins can view church invitations"
  on public.invitations
  for select
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

create policy "Super admins can view all invitations"
  on public.invitations
  for select
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Church admins can create invitations"
  on public.invitations
  for insert
  to authenticated
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
    or (select public.is_content_admin((select auth.uid()), church_id))
  );

create policy "Super admins can create any invitation"
  on public.invitations
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Invitation creators can update their invitations"
  on public.invitations
  for update
  to authenticated
  using ( invited_by = (select auth.uid()) )
  with check ( invited_by = (select auth.uid()) );

create policy "Church admins can delete church invitations"
  on public.invitations
  for delete
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
  );

-- ============================================================================
-- FEATURE FLAGS POLICIES
-- Super admin management, public viewing of enabled flags
-- ============================================================================

create policy "Enabled feature flags are viewable by everyone"
  on public.feature_flags
  for select
  to anon, authenticated
  using ( is_enabled = true );

create policy "Super admins can view all feature flags"
  on public.feature_flags
  for select
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can create feature flags"
  on public.feature_flags
  for insert
  to authenticated
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can update feature flags"
  on public.feature_flags
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

create policy "Super admins can delete feature flags"
  on public.feature_flags
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );

-- ============================================================================
-- USER WALLETS POLICIES
-- Users can view and manage their own wallet
-- ============================================================================

create policy "Users can view their own wallet"
  on public.user_wallets
  for select
  to authenticated
  using ( user_id = (select auth.uid()) );

create policy "Users can update their own wallet"
  on public.user_wallets
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

-- ============================================================================
-- WALLET TRANSACTIONS POLICIES
-- Users can view their own transactions
-- ============================================================================

create policy "Users can view their own wallet transactions"
  on public.wallet_transactions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.user_wallets
      where user_wallets.id = wallet_id
      and user_wallets.user_id = (select auth.uid())
    )
  );

create policy "System can create wallet transactions"
  on public.wallet_transactions
  for insert
  to authenticated
  with check ( true );

-- ============================================================================
-- SCHEDULED DONATIONS POLICIES
-- Users can manage their own scheduled donations
-- ============================================================================

create policy "Users can view their own scheduled donations"
  on public.scheduled_donations
  for select
  to authenticated
  using ( user_id = (select auth.uid()) );

create policy "Users can create scheduled donations"
  on public.scheduled_donations
  for insert
  to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "Users can update their own scheduled donations"
  on public.scheduled_donations
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "Users can delete their own scheduled donations"
  on public.scheduled_donations
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- Users can view and manage their own notifications
-- ============================================================================

create policy "Users can view their own notifications"
  on public.notifications
  for select
  to authenticated
  using ( user_id = (select auth.uid()) );

create policy "System can create notifications"
  on public.notifications
  for insert
  to authenticated
  with check ( true );

create policy "Users can update their own notifications"
  on public.notifications
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "Users can delete their own notifications"
  on public.notifications
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

