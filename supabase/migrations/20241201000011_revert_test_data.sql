/*
 * migration: revert test data
 * description: 
 *   removes all test data created by migration 20241201000010_populate_test_data.sql
 *   this will delete churches, images, bank accounts, events, campaigns, donations, etc.
 * author: system
 * date: 2024-12-01
 */

DO $$
DECLARE
  church_saint_mary_id uuid;
  church_bole_id uuid;
BEGIN
  -- get church ids (name is JSONB, so use ->> operator to extract text)
  select id into church_saint_mary_id from public.churches where name->>'en' = 'Saint Mary Church' limit 1;
  select id into church_bole_id from public.churches where name->>'en' = 'Bole Medhanialem Church' limit 1;

  -- ============================================================================
  -- delete in reverse order of creation (respecting foreign key constraints)
  -- ============================================================================

  -- delete notifications
  delete from public.notifications 
  where user_id = '62744e9b-2255-4acf-be3e-3af2736201eb';

  -- Delete user follows
  delete from public.user_follows 
  where user_id = '62744e9b-2255-4acf-be3e-3af2736201eb';

  -- Delete event RSVPs
  delete from public.event_rsvps 
  where user_id = '62744e9b-2255-4acf-be3e-3af2736201eb';

  -- Delete video content details
  delete from public.video_content 
  where id in (
    select id from public.content_items 
    where church_id in (church_saint_mary_id, church_bole_id)
    and content_type = 'video'
  );

  -- Delete article content details
  delete from public.article_content 
  where id in (
    select id from public.content_items 
    where church_id in (church_saint_mary_id, church_bole_id)
    and content_type = 'article'
  );

  -- Delete content items
  delete from public.content_items 
  where church_id in (church_saint_mary_id, church_bole_id);

  -- Delete donations
  delete from public.donations 
  where user_id = '62744e9b-2255-4acf-be3e-3af2736201eb';

  -- Delete donation campaigns
  delete from public.donation_campaigns 
  where church_id in (church_saint_mary_id, church_bole_id);

  -- Delete events (this will cascade delete event_rsvps, event_co_hosts, etc.)
  delete from public.events 
  where church_id in (church_saint_mary_id, church_bole_id);

  -- Delete donation categories
  delete from public.donation_categories 
  where name->>'en' in ('Church Building', 'Food', 'Health');

  -- Delete event categories
  delete from public.event_categories 
  where name->>'en' in ('Service', 'Festival', 'Wedding', 'Conference');

  -- Delete bank accounts
  delete from public.bank_accounts 
  where church_id in (church_saint_mary_id, church_bole_id);

  -- Delete church images
  delete from public.church_images 
  where church_id in (church_saint_mary_id, church_bole_id);

  -- Delete churches (this will cascade delete related data)
  delete from public.churches 
  where id in (church_saint_mary_id, church_bole_id);

  -- Delete church_admin role for the user
  delete from public.user_roles 
  where user_id = '62744e9b-2255-4acf-be3e-3af2736201eb' 
    and role = 'church_admin'
    and church_id IS NOT NULL;

END $$;

-- ============================================================================
-- summary
-- ============================================================================

-- this migration removes:
-- 1. Church admin role for user 62744e9b-2255-4acf-be3e-3af2736201eb
-- 2. All churches (Saint Mary and Bole Medhanialem)
-- 3. All church images
-- 4. All bank accounts
-- 5. All event categories
-- 6. All donation categories
-- 7. All events
-- 8. All donation campaigns
-- 9. All donations
-- 10. All content items and their details
-- 11. All event RSVPs
-- 12. All user follows
-- 13. All notifications

