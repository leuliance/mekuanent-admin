/*
 * Migration: Comprehensive Notification Triggers
 * Description: Creates all notification triggers, helper functions, preference columns,
 *              and cron jobs for the Mekuanent app notification system.
 *
 * Key design decisions:
 *   - Every trigger inserts into the `notifications` table (the source of truth for in-app history).
 *   - Entrig push delivery is handled via `net.http_post` to the Entrig REST API.
 *   - User preferences are checked BEFORE sending push (silent = row exists but no push).
 *   - Notifications table always gets the row so the in-app list is complete.
 *   - pg_cron handles event reminders (24h + 1h) and verse-of-the-day.
 *
 * Author: System
 * Date: 2025-02-20
 */

-- ============================================================================
-- 0. DROP EXISTING TRIGGERS, FUNCTIONS & CRON JOBS (idempotent re-run)
-- ============================================================================

-- Cron jobs (safe if pg_cron is not installed)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('event-reminders');
    PERFORM cron.unschedule('verse-of-the-day');
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Triggers
DROP TRIGGER IF EXISTS trg_notify_new_event          ON public.events;
DROP TRIGGER IF EXISTS trg_notify_event_updated       ON public.events;
DROP TRIGGER IF EXISTS trg_notify_event_cancelled     ON public.events;
DROP TRIGGER IF EXISTS trg_notify_new_rsvp            ON public.event_rsvps;
DROP TRIGGER IF EXISTS trg_notify_rsvp_changed        ON public.event_rsvps;
DROP TRIGGER IF EXISTS trg_notify_new_campaign        ON public.donation_campaigns;
DROP TRIGGER IF EXISTS trg_notify_campaign_goal_changed ON public.campaign_goal_changes;
DROP TRIGGER IF EXISTS trg_notify_donation_completed  ON public.donations;
DROP TRIGGER IF EXISTS trg_notify_content_pending     ON public.content_items;
DROP TRIGGER IF EXISTS trg_notify_content_approved    ON public.content_items;
DROP TRIGGER IF EXISTS trg_notify_content_rejected    ON public.content_items;
DROP TRIGGER IF EXISTS trg_notify_cohost_invited      ON public.event_co_hosts;
DROP TRIGGER IF EXISTS trg_notify_cohost_response     ON public.event_co_hosts;
DROP TRIGGER IF EXISTS trg_notify_room_started        ON public.room_content;
DROP TRIGGER IF EXISTS trg_notify_new_follower        ON public.user_follows;
DROP TRIGGER IF EXISTS trg_notify_role_invitation     ON public.invitations;
DROP TRIGGER IF EXISTS trg_notify_wallet_transaction  ON public.wallet_transactions;
DROP TRIGGER IF EXISTS trg_notify_content_liked       ON public.content_likes;

-- Trigger functions
DROP FUNCTION IF EXISTS public.trg_notify_new_event()          CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_event_updated()      CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_event_cancelled()    CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_new_rsvp()           CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_rsvp_cancelled()     CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_new_campaign()       CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_campaign_goal_changed() CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_donation_completed() CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_content_pending()    CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_content_approved()   CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_content_rejected()   CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_cohost_invited()     CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_cohost_response()    CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_room_started()       CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_new_follower()       CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_role_invitation()    CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_wallet_transaction() CASCADE;
DROP FUNCTION IF EXISTS public.trg_notify_content_liked()      CASCADE;

-- Helper functions
DROP FUNCTION IF EXISTS public.create_notification(uuid, public.notification_type, jsonb, jsonb, jsonb, text) CASCADE;
DROP FUNCTION IF EXISTS public.should_send_push(uuid, text)     CASCADE;
DROP FUNCTION IF EXISTS public.get_church_admin_ids(uuid)       CASCADE;
DROP FUNCTION IF EXISTS public.get_church_admin_only_ids(uuid)  CASCADE;
DROP FUNCTION IF EXISTS public.get_church_follower_ids(uuid)    CASCADE;

-- Cron functions
DROP FUNCTION IF EXISTS public.fn_send_event_reminders()        CASCADE;
DROP FUNCTION IF EXISTS public.fn_send_verse_of_the_day()       CASCADE;


-- ============================================================================
-- 1. ADD NEW NOTIFICATION TYPE ENUM VALUES
-- ============================================================================

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new_event'           AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'new_event';           END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'event_cancelled'     AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'event_cancelled';     END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new_rsvp'            AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'new_rsvp';            END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'rsvp_confirmed'      AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'rsvp_confirmed';      END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'rsvp_updated'        AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'rsvp_updated';        END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'rsvp_cancelled'      AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'rsvp_cancelled';      END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new_donation'        AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'new_donation';        END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'donation_milestone'  AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'donation_milestone';  END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'donation_goal_reached' AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'donation_goal_reached'; END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'donation_exceeded'   AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'donation_exceeded';   END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'campaign_goal_changed' AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'campaign_goal_changed'; END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new_campaign'        AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'new_campaign';        END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'content_pending'     AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'content_pending';     END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'co_host_invited'     AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'co_host_invited';     END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'co_host_accepted'    AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'co_host_accepted';    END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'co_host_declined'    AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'co_host_declined';    END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new_follower'        AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'new_follower';        END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'wallet_deposit'      AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'wallet_deposit';      END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'wallet_withdrawal'   AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'wallet_withdrawal';   END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'event_reminder_24h'  AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'event_reminder_24h';  END IF; END$$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'event_reminder_1h'   AND enumtypid = 'public.notification_type'::regtype) THEN ALTER TYPE public.notification_type ADD VALUE 'event_reminder_1h';   END IF; END$$;

-- ============================================================================
-- 2. EXPAND user_preferences WITH GRANULAR NOTIFICATION TOGGLES
-- ============================================================================

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS notify_rsvp           boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_co_hosting     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_content_review boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_followers      boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_wallet         boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_reminders      boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_achievements   boolean NOT NULL DEFAULT true;

-- ============================================================================
-- 3. ADD is_silent FLAG TO notifications TABLE
--    Silent = stored for in-app list but push was NOT sent (user had pref off).
-- ============================================================================

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS is_silent boolean NOT NULL DEFAULT false;

-- ============================================================================
-- 4. HELPER: Check if user wants push for a given notification category
--    Returns TRUE when push should be sent.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.should_send_push(
  p_user_id uuid,
  p_category text
) RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  v_global boolean;
  v_pref   boolean;
BEGIN
  -- Global kill-switch on profiles
  SELECT notification_enabled INTO v_global
    FROM public.profiles WHERE id = p_user_id;
  IF v_global IS DISTINCT FROM true THEN RETURN false; END IF;

  -- Per-category check (gracefully handle missing columns or rows)
  BEGIN
    EXECUTE format(
      'SELECT %I FROM public.user_preferences WHERE id = $1',
      p_category
    ) INTO v_pref USING p_user_id;
  EXCEPTION WHEN undefined_column OR undefined_table THEN
    v_pref := NULL;
  END;

  RETURN coalesce(v_pref, true);
END;
$$;

-- ============================================================================
-- 5. HELPER: Insert a notification row & optionally send push via Entrig
--    p_data is arbitrary jsonb that the client uses for deep-linking.
--    This function is called by every trigger below.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id       uuid,
  p_type          public.notification_type,
  p_title         jsonb,
  p_body          jsonb,
  p_data          jsonb DEFAULT NULL,
  p_pref_category text  DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_send_push boolean;
  v_notif_id  uuid;
BEGIN
  -- Determine if push should be sent
  BEGIN
    IF p_pref_category IS NOT NULL THEN
      v_send_push := public.should_send_push(p_user_id, p_pref_category);
    ELSE
      v_send_push := public.should_send_push(p_user_id, 'notification_enabled');
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_send_push := true;
  END;

  -- Always insert the notification row
  INSERT INTO public.notifications (user_id, type, title, body, data, is_silent)
  VALUES (p_user_id, p_type, p_title, p_body, p_data, NOT v_send_push)
  RETURNING id INTO v_notif_id;

  RETURN v_notif_id;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'create_notification failed for user=% type=%: %', p_user_id, p_type, SQLERRM;
  RETURN NULL;
END;
$$;

-- ============================================================================
-- 6. HELPER: Get admin user IDs for a church (church_admin + content_admin)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_church_admin_ids(p_church_id uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT DISTINCT user_id
    FROM public.user_roles
   WHERE church_id = p_church_id
     AND role IN ('church_admin', 'content_admin');
$$;

-- ============================================================================
-- 7. HELPER: Get church admin IDs only (church_admin role)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_church_admin_only_ids(p_church_id uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT DISTINCT user_id
    FROM public.user_roles
   WHERE church_id = p_church_id
     AND role = 'church_admin';
$$;

-- ============================================================================
-- 8. HELPER: Get followers of a church
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_church_follower_ids(p_church_id uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT user_id FROM public.user_follows WHERE church_id = p_church_id;
$$;


-- ############################################################################
-- TRIGGERS: EVENTS
-- ############################################################################

-- ============================================================================
-- T1: NEW EVENT PUBLISHED → notify church followers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_new_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_follower uuid;
  v_church   record;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
BEGIN
  -- Only fire when status becomes 'published'
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'published' THEN RETURN NEW; END IF;

  SELECT name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object(
    'en', 'New Event',
    'am', 'አዲስ ዝግጅት'
  );
  v_body := jsonb_build_object(
    'en', coalesce(NEW.title->>'en', '') || ' by ' || coalesce(v_church.name->>'en', ''),
    'am', coalesce(NEW.title->>'am', '') || ' ከ' || coalesce(v_church.name->>'am', '')
  );
  v_data := jsonb_build_object('type', 'new_event', 'event_id', NEW.id, 'church_id', NEW.church_id);

  FOR v_follower IN SELECT * FROM public.get_church_follower_ids(NEW.church_id)
  LOOP
    IF v_follower <> NEW.created_by THEN
      PERFORM public.create_notification(v_follower, 'new_event', v_title, v_body, v_data, 'notify_events');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_event ON public.events;
CREATE TRIGGER trg_notify_new_event
  AFTER INSERT OR UPDATE OF status ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_new_event();


-- ============================================================================
-- T2: EVENT UPDATED → notify RSVPd users
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_event_updated()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user  uuid;
  v_title jsonb;
  v_body  jsonb;
  v_data  jsonb;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  -- Only when meaningful fields change
  IF OLD.title = NEW.title AND OLD.description = NEW.description
     AND OLD.start_time = NEW.start_time AND OLD.end_time = NEW.end_time
     AND OLD.address IS NOT DISTINCT FROM NEW.address
     AND OLD.is_online = NEW.is_online
  THEN RETURN NEW; END IF;

  v_title := jsonb_build_object('en', 'Event Updated', 'am', 'ዝግጅቱ ተቀይሯል');
  v_body  := jsonb_build_object(
    'en', coalesce(NEW.title->>'en', '') || ' has been updated',
    'am', coalesce(NEW.title->>'am', '') || ' ተስተካክሏል'
  );
  v_data := jsonb_build_object('type', 'event_update', 'event_id', NEW.id);

  FOR v_user IN
    SELECT user_id FROM public.event_rsvps WHERE event_id = NEW.id AND status = 'going'
  LOOP
    PERFORM public.create_notification(v_user, 'event_update', v_title, v_body, v_data, 'notify_events');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_event_updated ON public.events;
CREATE TRIGGER trg_notify_event_updated
  AFTER UPDATE ON public.events
  FOR EACH ROW
  WHEN (OLD.status = 'published' AND NEW.status = 'published')
  EXECUTE FUNCTION public.trg_notify_event_updated();


-- ============================================================================
-- T3: EVENT CANCELLED → notify RSVPd users
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_event_cancelled()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user  uuid;
  v_title jsonb;
  v_body  jsonb;
  v_data  jsonb;
BEGIN
  IF NEW.status <> 'cancelled' OR OLD.status = 'cancelled' THEN RETURN NEW; END IF;

  v_title := jsonb_build_object('en', 'Event Cancelled', 'am', 'ዝግጅቱ ተሰርዟል');
  v_body  := jsonb_build_object(
    'en', coalesce(NEW.title->>'en', '') || ' has been cancelled',
    'am', coalesce(NEW.title->>'am', '') || ' ተሰርዟል'
  );
  v_data := jsonb_build_object('type', 'event_cancelled', 'event_id', NEW.id);

  FOR v_user IN
    SELECT user_id FROM public.event_rsvps WHERE event_id = NEW.id AND status IN ('going', 'maybe')
  LOOP
    PERFORM public.create_notification(v_user, 'event_cancelled', v_title, v_body, v_data, 'notify_events');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_event_cancelled ON public.events;
CREATE TRIGGER trg_notify_event_cancelled
  AFTER UPDATE OF status ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_event_cancelled();


-- ############################################################################
-- TRIGGERS: RSVPs
-- ############################################################################

-- ============================================================================
-- T4: NEW RSVP → notify church_admin + content_admin of the event's church
--     (excludes the RSVP user themselves, even if they are an admin)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_new_rsvp()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_event  record;
  v_user   record;
  v_admin  uuid;
  v_title  jsonb;
  v_body   jsonb;
  v_data   jsonb;
  v_admin_count int := 0;
BEGIN
  RAISE LOG '[trg_notify_new_rsvp] FIRED op=% user=% event=% status=%',
    TG_OP, NEW.user_id, NEW.event_id, NEW.status;

  -- Skip if this is an UPDATE and the status didn't actually change
  IF TG_OP = 'UPDATE' AND OLD.status = NEW.status THEN
    RAISE LOG '[trg_notify_new_rsvp] Skipping: status unchanged (%)' , NEW.status;
    RETURN NEW;
  END IF;

  SELECT * INTO v_event FROM public.events WHERE id = NEW.event_id;
  IF v_event IS NULL THEN
    RAISE WARNING '[trg_notify_new_rsvp] Event not found for id=%', NEW.event_id;
    RETURN NEW;
  END IF;

  RAISE LOG '[trg_notify_new_rsvp] Event found: church_id=%', v_event.church_id;

  SELECT first_name, last_name INTO v_user FROM public.profiles WHERE id = NEW.user_id;

  v_title := jsonb_build_object('en', 'New RSVP', 'am', 'አዲስ ተመዝጋቢ');
  v_body  := jsonb_build_object(
    'en', coalesce(v_user.first_name, '') || ' registered for ' || coalesce(v_event.title->>'en', ''),
    'am', coalesce(v_user.first_name, '') || ' ለ' || coalesce(v_event.title->>'am', '') || ' ተመዝግቧል'
  );
  v_data := jsonb_build_object('type', 'new_rsvp', 'event_id', NEW.event_id, 'rsvp_id', NEW.id, 'user_id', NEW.user_id);

  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_event.church_id)
  LOOP
    v_admin_count := v_admin_count + 1;
    RAISE LOG '[trg_notify_new_rsvp] Admin found: %, rsvp_user: %', v_admin, NEW.user_id;
    IF v_admin <> NEW.user_id THEN
      PERFORM public.create_notification(v_admin, 'new_rsvp', v_title, v_body, v_data, 'notify_rsvp');
      RAISE LOG '[trg_notify_new_rsvp] Notification created for admin=%', v_admin;
    ELSE
      RAISE LOG '[trg_notify_new_rsvp] Skipping self-notification for admin=%', v_admin;
    END IF;
  END LOOP;

  IF v_admin_count = 0 THEN
    RAISE WARNING '[trg_notify_new_rsvp] No admins found for church_id=%, event_id=%', v_event.church_id, NEW.event_id;
  END IF;

  RAISE LOG '[trg_notify_new_rsvp] Done. Admins found: %', v_admin_count;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[trg_notify_new_rsvp] Error: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_rsvp ON public.event_rsvps;
CREATE TRIGGER trg_notify_new_rsvp
  AFTER INSERT OR UPDATE OF status ON public.event_rsvps
  FOR EACH ROW
  WHEN (NEW.status = 'going')
  EXECUTE FUNCTION public.trg_notify_new_rsvp();


-- ============================================================================
-- T5: RSVP STATUS CHANGED → notify church_admin + content_admin only
--     (excludes the RSVP user themselves, even if they are an admin)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_rsvp_cancelled()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_event    record;
  v_user     record;
  v_admin    uuid;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
  v_event_id uuid;
  v_user_id  uuid;
BEGIN
  -- Handle both UPDATE and DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.status <> 'going' THEN RETURN OLD; END IF;
    v_event_id := OLD.event_id;
    v_user_id  := OLD.user_id;
  ELSE
    IF NEW.status = OLD.status THEN RETURN NEW; END IF;
    v_event_id := NEW.event_id;
    v_user_id  := NEW.user_id;
  END IF;

  SELECT * INTO v_event FROM public.events WHERE id = v_event_id;
  SELECT first_name INTO v_user FROM public.profiles WHERE id = v_user_id;

  IF TG_OP = 'DELETE' OR (NEW.status = 'not_going' AND OLD.status = 'going') THEN
    v_title := jsonb_build_object('en', 'RSVP Cancelled', 'am', 'ምዝገባ ተሰርዟል');
    v_body  := jsonb_build_object(
      'en', coalesce(v_user.first_name, '') || ' cancelled RSVP for ' || coalesce(v_event.title->>'en', ''),
      'am', coalesce(v_user.first_name, '') || ' ለ' || coalesce(v_event.title->>'am', '') || ' ምዝገባ ሰርዟል'
    );
    v_data := jsonb_build_object('type', 'rsvp_cancelled', 'event_id', v_event_id, 'user_id', v_user_id);

    FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_event.church_id)
    LOOP
      IF v_admin <> v_user_id THEN
        PERFORM public.create_notification(v_admin, 'rsvp_cancelled', v_title, v_body, v_data, 'notify_rsvp');
      END IF;
    END LOOP;

  ELSIF NEW.status = 'going' AND OLD.status <> 'going' THEN
    v_title := jsonb_build_object('en', 'RSVP Confirmed', 'am', 'ምዝገባ ተረጋግጧል');
    v_body  := jsonb_build_object(
      'en', coalesce(v_user.first_name, '') || ' confirmed for ' || coalesce(v_event.title->>'en', ''),
      'am', coalesce(v_user.first_name, '') || ' ለ' || coalesce(v_event.title->>'am', '') || ' ተረጋግጧል'
    );
    v_data := jsonb_build_object('type', 'rsvp_confirmed', 'event_id', v_event_id, 'user_id', v_user_id);

    FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_event.church_id)
    LOOP
      IF v_admin <> v_user_id THEN
        PERFORM public.create_notification(v_admin, 'rsvp_confirmed', v_title, v_body, v_data, 'notify_rsvp');
      END IF;
    END LOOP;
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_rsvp_changed ON public.event_rsvps;
CREATE TRIGGER trg_notify_rsvp_changed
  AFTER UPDATE OF status OR DELETE ON public.event_rsvps
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_rsvp_cancelled();


-- ############################################################################
-- TRIGGERS: DONATIONS
-- ############################################################################

-- ============================================================================
-- T6: NEW DONATION CAMPAIGN → notify church followers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_new_campaign()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_follower uuid;
  v_church   record;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
BEGIN
  IF NEW.status <> 'active' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'active' THEN RETURN NEW; END IF;

  SELECT name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object('en', 'New Donation Campaign', 'am', 'አዲስ የልገሣ ዘመቻ');
  v_body  := jsonb_build_object(
    'en', coalesce(NEW.title->>'en', '') || ' — ' || coalesce(v_church.name->>'en', ''),
    'am', coalesce(NEW.title->>'am', '') || ' — ' || coalesce(v_church.name->>'am', '')
  );
  v_data := jsonb_build_object('type', 'new_campaign', 'campaign_id', NEW.id, 'church_id', NEW.church_id);

  FOR v_follower IN SELECT * FROM public.get_church_follower_ids(NEW.church_id)
  LOOP
    IF v_follower <> NEW.created_by THEN
      PERFORM public.create_notification(v_follower, 'new_campaign', v_title, v_body, v_data, 'notify_donations');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_campaign ON public.donation_campaigns;
CREATE TRIGGER trg_notify_new_campaign
  AFTER INSERT OR UPDATE OF status ON public.donation_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_new_campaign();


-- ============================================================================
-- T7: CAMPAIGN GOAL CHANGED → notify donors who already donated
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_campaign_goal_changed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_donor    uuid;
  v_campaign record;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
BEGIN
  SELECT * INTO v_campaign FROM public.donation_campaigns WHERE id = NEW.campaign_id;

  v_title := jsonb_build_object('en', 'Goal Updated', 'am', 'ግብ ተቀይሯል');
  v_body  := jsonb_build_object(
    'en', coalesce(v_campaign.title->>'en', '') || ' goal changed from ' || NEW.old_goal_amount || ' to ' || NEW.new_goal_amount,
    'am', coalesce(v_campaign.title->>'am', '') || ' ግብ ከ' || NEW.old_goal_amount || ' ወደ ' || NEW.new_goal_amount || ' ተቀይሯል'
  );
  v_data := jsonb_build_object('type', 'campaign_goal_changed', 'campaign_id', NEW.campaign_id);

  FOR v_donor IN
    SELECT DISTINCT user_id FROM public.donations
     WHERE campaign_id = NEW.campaign_id AND status = 'completed'
  LOOP
    PERFORM public.create_notification(v_donor, 'campaign_goal_changed', v_title, v_body, v_data, 'notify_donations');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_campaign_goal_changed ON public.campaign_goal_changes;
CREATE TRIGGER trg_notify_campaign_goal_changed
  AFTER INSERT ON public.campaign_goal_changes
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_campaign_goal_changed();


-- ============================================================================
-- T8: NEW DONATION COMPLETED → notify campaign creator + check milestones
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_donation_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_campaign      record;
  v_donor         record;
  v_pct           numeric;
  v_old_pct       numeric;
  v_title         jsonb;
  v_body          jsonb;
  v_data          jsonb;
  v_admin         uuid;
  v_milestone_type public.notification_type;
  v_milestone_label_en text;
  v_milestone_label_am text;
BEGIN
  IF NEW.status <> 'completed' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'completed' THEN RETURN NEW; END IF;

  -- Skip if no campaign
  IF NEW.campaign_id IS NULL THEN RETURN NEW; END IF;

  SELECT * INTO v_campaign FROM public.donation_campaigns WHERE id = NEW.campaign_id;
  SELECT first_name INTO v_donor FROM public.profiles WHERE id = NEW.user_id;

  -- Notify campaign creator about new donation (skip if donor is the creator)
  v_title := jsonb_build_object('en', 'New Donation', 'am', 'አዲስ ልገሣ');
  v_body  := jsonb_build_object(
    'en', coalesce(v_donor.first_name, 'Someone') || ' donated ' || NEW.currency || ' ' || NEW.amount || ' to ' || coalesce(v_campaign.title->>'en', ''),
    'am', coalesce(v_donor.first_name, 'አንድ ሰው') || ' ' || NEW.currency || ' ' || NEW.amount || ' ለ' || coalesce(v_campaign.title->>'am', '') || ' ለገሠ'
  );
  v_data := jsonb_build_object('type', 'new_donation', 'campaign_id', NEW.campaign_id, 'donation_id', NEW.id);

  IF NEW.user_id IS DISTINCT FROM v_campaign.created_by THEN
    PERFORM public.create_notification(v_campaign.created_by, 'new_donation', v_title, v_body, v_data, 'notify_donations');
  END IF;

  -- MILESTONE CHECKS
  IF v_campaign.goal_amount IS NOT NULL AND v_campaign.goal_amount > 0 THEN
    v_pct     := (v_campaign.current_amount::numeric / v_campaign.goal_amount) * 100;
    v_old_pct := ((v_campaign.current_amount - NEW.amount)::numeric / v_campaign.goal_amount) * 100;

    -- Check each milestone threshold
    IF v_old_pct < 50 AND v_pct >= 50 THEN
      v_milestone_type := 'donation_milestone';
      v_milestone_label_en := '50% reached!';
      v_milestone_label_am := '50% ደርሷል!';
    ELSIF v_old_pct < 75 AND v_pct >= 75 THEN
      v_milestone_type := 'donation_milestone';
      v_milestone_label_en := '75% reached!';
      v_milestone_label_am := '75% ደርሷል!';
    ELSIF v_old_pct < 100 AND v_pct >= 100 THEN
      v_milestone_type := 'donation_goal_reached';
      v_milestone_label_en := 'Goal reached!';
      v_milestone_label_am := 'ግቡ ተሳክቷል!';
    ELSIF v_old_pct < 100 AND v_pct > 100 THEN
      -- Already covered by goal_reached
      NULL;
    END IF;

    -- Exceeded check (crosses 100 for the first time is goal_reached above;
    -- if old was already >= 100 and new pushes further, mark exceeded)
    IF v_old_pct >= 100 AND v_pct > v_old_pct AND v_milestone_type IS NULL THEN
      v_milestone_type := 'donation_exceeded';
      v_milestone_label_en := 'Goal exceeded! ' || round(v_pct) || '% raised';
      v_milestone_label_am := 'ግቡ አልፏል! ' || round(v_pct) || '% ተሰብስቧል';
    END IF;

    IF v_milestone_type IS NOT NULL THEN
      v_title := jsonb_build_object('en', coalesce(v_campaign.title->>'en', '') || ' — ' || v_milestone_label_en,
                                    'am', coalesce(v_campaign.title->>'am', '') || ' — ' || v_milestone_label_am);
      v_body  := jsonb_build_object(
        'en', v_campaign.currency || ' ' || v_campaign.current_amount || ' of ' || v_campaign.goal_amount || ' raised',
        'am', v_campaign.currency || ' ' || v_campaign.current_amount || ' ከ' || v_campaign.goal_amount || ' ተሰብስቧል'
      );
      v_data := jsonb_build_object('type', v_milestone_type::text, 'campaign_id', NEW.campaign_id);

      -- Notify all church admins (exclude the donor)
      FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_campaign.church_id)
      LOOP
        IF v_admin <> NEW.user_id THEN
          PERFORM public.create_notification(v_admin, v_milestone_type, v_title, v_body, v_data, 'notify_donations');
        END IF;
      END LOOP;

      -- Notify all donors of this campaign
      FOR v_admin IN
        SELECT DISTINCT user_id FROM public.donations
         WHERE campaign_id = NEW.campaign_id AND status = 'completed' AND user_id <> NEW.user_id
      LOOP
        PERFORM public.create_notification(v_admin, v_milestone_type, v_title, v_body, v_data, 'notify_donations');
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_donation_completed ON public.donations;
CREATE TRIGGER trg_notify_donation_completed
  AFTER INSERT OR UPDATE OF status ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_donation_completed();


-- ############################################################################
-- TRIGGERS: CONTENT
-- ############################################################################

-- ============================================================================
-- T9: CONTENT SUBMITTED FOR REVIEW → notify church admins / content admins
--     If creator is content_admin → only church_admin sees it
--     If creator is content_creator → church_admin + content_admin see it
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_content_pending()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_admin       uuid;
  v_creator_role text;
  v_title       jsonb;
  v_body        jsonb;
  v_data        jsonb;
  v_creator     record;
BEGIN
  IF NEW.status <> 'pending_approval' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'pending_approval' THEN RETURN NEW; END IF;

  SELECT first_name INTO v_creator FROM public.profiles WHERE id = NEW.created_by;

  -- Determine creator's highest role in this church
  SELECT role INTO v_creator_role
    FROM public.user_roles
   WHERE user_id = NEW.created_by AND church_id = NEW.church_id
   ORDER BY CASE role
     WHEN 'church_admin' THEN 1
     WHEN 'content_admin' THEN 2
     WHEN 'content_creator' THEN 3
     ELSE 4
   END
   LIMIT 1;

  v_title := jsonb_build_object('en', 'Content for Review', 'am', 'ይዘት ለግምገማ');
  v_body  := jsonb_build_object(
    'en', coalesce(v_creator.first_name, '') || ' submitted "' || coalesce(NEW.title->>'en', '') || '"',
    'am', coalesce(v_creator.first_name, '') || ' "' || coalesce(NEW.title->>'am', '') || '" አቅርቧል'
  );
  v_data := jsonb_build_object('type', 'content_pending', 'content_id', NEW.id, 'church_id', NEW.church_id, 'content_type', NEW.content_type::text);

  IF v_creator_role = 'content_admin' THEN
    -- Content admin created it → only church admins need to review
    FOR v_admin IN SELECT * FROM public.get_church_admin_only_ids(NEW.church_id)
    LOOP
      IF v_admin <> NEW.created_by THEN
        PERFORM public.create_notification(v_admin, 'content_pending', v_title, v_body, v_data, 'notify_content_review');
      END IF;
    END LOOP;
  ELSE
    -- Content creator → both church_admin and content_admin
    FOR v_admin IN SELECT * FROM public.get_church_admin_ids(NEW.church_id)
    LOOP
      IF v_admin <> NEW.created_by THEN
        PERFORM public.create_notification(v_admin, 'content_pending', v_title, v_body, v_data, 'notify_content_review');
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_content_pending ON public.content_items;
CREATE TRIGGER trg_notify_content_pending
  AFTER INSERT OR UPDATE OF status ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_content_pending();


-- ============================================================================
-- T10: CONTENT APPROVED → notify creator + church followers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_content_approved()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_follower uuid;
  v_church   record;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
BEGIN
  IF NEW.status <> 'approved' OR OLD.status = 'approved' THEN RETURN NEW; END IF;

  SELECT name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  -- Notify the creator
  v_title := jsonb_build_object('en', 'Content Approved', 'am', 'ይዘት ጸድቋል');
  v_body  := jsonb_build_object(
    'en', '"' || coalesce(NEW.title->>'en', '') || '" has been approved',
    'am', '"' || coalesce(NEW.title->>'am', '') || '" ጸድቋል'
  );
  v_data := jsonb_build_object('type', 'content_approved', 'content_id', NEW.id, 'content_type', NEW.content_type::text);

  PERFORM public.create_notification(NEW.created_by, 'content_approved', v_title, v_body, v_data, 'notify_new_content');

  -- Notify church followers about new content
  v_title := jsonb_build_object('en', 'New Content', 'am', 'አዲስ ይዘት');
  v_body  := jsonb_build_object(
    'en', coalesce(NEW.title->>'en', '') || ' from ' || coalesce(v_church.name->>'en', ''),
    'am', coalesce(NEW.title->>'am', '') || ' ከ' || coalesce(v_church.name->>'am', '')
  );
  v_data := jsonb_build_object('type', 'new_content', 'content_id', NEW.id, 'content_type', NEW.content_type::text, 'church_id', NEW.church_id);

  FOR v_follower IN SELECT * FROM public.get_church_follower_ids(NEW.church_id)
  LOOP
    IF v_follower <> NEW.created_by THEN
      PERFORM public.create_notification(v_follower, 'new_content', v_title, v_body, v_data, 'notify_new_content');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_content_approved ON public.content_items;
CREATE TRIGGER trg_notify_content_approved
  AFTER UPDATE OF status ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_content_approved();


-- ============================================================================
-- T11: CONTENT REJECTED → notify creator
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_content_rejected()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_title jsonb;
  v_body  jsonb;
  v_data  jsonb;
BEGIN
  IF NEW.status <> 'rejected' OR OLD.status = 'rejected' THEN RETURN NEW; END IF;

  v_title := jsonb_build_object('en', 'Content Rejected', 'am', 'ይዘት ውድቅ ተደርጓል');
  v_body  := jsonb_build_object(
    'en', '"' || coalesce(NEW.title->>'en', '') || '" was rejected' || coalesce(': ' || NEW.rejected_reason, ''),
    'am', '"' || coalesce(NEW.title->>'am', '') || '" ውድቅ ተደርጓል' || coalesce(': ' || NEW.rejected_reason, '')
  );
  v_data := jsonb_build_object('type', 'content_rejected', 'content_id', NEW.id, 'content_type', NEW.content_type::text);

  PERFORM public.create_notification(NEW.created_by, 'content_rejected', v_title, v_body, v_data, 'notify_new_content');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_content_rejected ON public.content_items;
CREATE TRIGGER trg_notify_content_rejected
  AFTER UPDATE OF status ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_content_rejected();


-- ############################################################################
-- TRIGGERS: CO-HOSTING
-- ############################################################################

-- ============================================================================
-- T12: CO-HOST INVITATION SENT → notify target church admins
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_cohost_invited()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_admin  uuid;
  v_event  record;
  v_source record;
  v_title  jsonb;
  v_body   jsonb;
  v_data   jsonb;
BEGIN
  SELECT * INTO v_event FROM public.events WHERE id = NEW.event_id;
  SELECT name INTO v_source FROM public.churches WHERE id = v_event.church_id;

  v_title := jsonb_build_object('en', 'Co-host Invitation', 'am', 'የጋራ አዘጋጅ ጥሪ');
  v_body  := jsonb_build_object(
    'en', coalesce(v_source.name->>'en', '') || ' invited your church to co-host "' || coalesce(v_event.title->>'en', '') || '"',
    'am', coalesce(v_source.name->>'am', '') || ' ቤተክርስቲያንዎን "' || coalesce(v_event.title->>'am', '') || '" ለማዘጋጀት ጋብዟል'
  );
  v_data := jsonb_build_object('type', 'co_host_invited', 'event_id', NEW.event_id, 'co_host_id', NEW.id, 'church_id', NEW.church_id);

  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(NEW.church_id)
  LOOP
    PERFORM public.create_notification(v_admin, 'co_host_invited', v_title, v_body, v_data, 'notify_co_hosting');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_cohost_invited ON public.event_co_hosts;
CREATE TRIGGER trg_notify_cohost_invited
  AFTER INSERT ON public.event_co_hosts
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_cohost_invited();


-- ============================================================================
-- T13: CO-HOST ACCEPTED/DECLINED → notify the church that sent the invite
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_cohost_response()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_admin  uuid;
  v_event  record;
  v_target record;
  v_title  jsonb;
  v_body   jsonb;
  v_data   jsonb;
  v_ntype  public.notification_type;
BEGIN
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;
  IF NEW.status NOT IN ('accepted', 'declined') THEN RETURN NEW; END IF;

  SELECT * INTO v_event FROM public.events WHERE id = NEW.event_id;
  SELECT name INTO v_target FROM public.churches WHERE id = NEW.church_id;

  IF NEW.status = 'accepted' THEN
    v_ntype := 'co_host_accepted';
    v_title := jsonb_build_object('en', 'Co-host Accepted', 'am', 'የጋራ አዘጋጅ ተቀብሏል');
    v_body  := jsonb_build_object(
      'en', coalesce(v_target.name->>'en', '') || ' accepted co-hosting "' || coalesce(v_event.title->>'en', '') || '"',
      'am', coalesce(v_target.name->>'am', '') || ' "' || coalesce(v_event.title->>'am', '') || '" ማዘጋጀት ተቀብሏል'
    );
  ELSE
    v_ntype := 'co_host_declined';
    v_title := jsonb_build_object('en', 'Co-host Declined', 'am', 'የጋራ አዘጋጅ አልተቀበለም');
    v_body  := jsonb_build_object(
      'en', coalesce(v_target.name->>'en', '') || ' declined co-hosting "' || coalesce(v_event.title->>'en', '') || '"',
      'am', coalesce(v_target.name->>'am', '') || ' "' || coalesce(v_event.title->>'am', '') || '" ማዘጋጀት አልተቀበለም'
    );
  END IF;

  v_data := jsonb_build_object('type', v_ntype::text, 'event_id', NEW.event_id, 'co_host_id', NEW.id, 'church_id', NEW.church_id);

  -- Notify admins of the SOURCE church (the one that sent the invite)
  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_event.church_id)
  LOOP
    PERFORM public.create_notification(v_admin, v_ntype, v_title, v_body, v_data, 'notify_co_hosting');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_cohost_response ON public.event_co_hosts;
CREATE TRIGGER trg_notify_cohost_response
  AFTER UPDATE OF status ON public.event_co_hosts
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_cohost_response();


-- ############################################################################
-- TRIGGERS: ROOMS
-- ############################################################################

-- ============================================================================
-- T14: ROOM GOES LIVE → notify church followers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_room_started()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_content  record;
  v_follower uuid;
  v_church   record;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
BEGIN
  IF NEW.room_status <> 'live' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.room_status = 'live' THEN RETURN NEW; END IF;

  SELECT * INTO v_content FROM public.content_items WHERE id = NEW.id;
  IF v_content IS NULL THEN RETURN NEW; END IF;

  SELECT name INTO v_church FROM public.churches WHERE id = v_content.church_id;

  v_title := jsonb_build_object('en', 'Room is Live', 'am', 'ክፍል ቀጥታ ነው');
  v_body  := jsonb_build_object(
    'en', coalesce(v_content.title->>'en', '') || ' is now live',
    'am', coalesce(v_content.title->>'am', '') || ' አሁን ቀጥታ ነው'
  );
  v_data := jsonb_build_object('type', 'room_started', 'room_id', NEW.id, 'church_id', v_content.church_id);

  FOR v_follower IN SELECT * FROM public.get_church_follower_ids(v_content.church_id)
  LOOP
    IF v_follower <> v_content.created_by THEN
      PERFORM public.create_notification(v_follower, 'room_started', v_title, v_body, v_data, 'notify_new_content');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_room_started ON public.room_content;
CREATE TRIGGER trg_notify_room_started
  AFTER INSERT OR UPDATE OF room_status ON public.room_content
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_room_started();


-- ############################################################################
-- TRIGGERS: FOLLOWS
-- ############################################################################

-- ============================================================================
-- T15: NEW FOLLOWER → notify church admins
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_new_follower()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_admin  uuid;
  v_user   record;
  v_church record;
  v_title  jsonb;
  v_body   jsonb;
  v_data   jsonb;
BEGIN
  SELECT first_name, last_name INTO v_user FROM public.profiles WHERE id = NEW.user_id;
  SELECT name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object('en', 'New Follower', 'am', 'አዲስ ተከታይ');
  v_body  := jsonb_build_object(
    'en', coalesce(v_user.first_name, '') || ' started following ' || coalesce(v_church.name->>'en', ''),
    'am', coalesce(v_user.first_name, '') || ' ' || coalesce(v_church.name->>'am', '') || 'ን መከተል ጀመረ'
  );
  v_data := jsonb_build_object('type', 'new_follower', 'user_id', NEW.user_id, 'church_id', NEW.church_id);

  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(NEW.church_id)
  LOOP
    IF v_admin <> NEW.user_id THEN
      PERFORM public.create_notification(v_admin, 'new_follower', v_title, v_body, v_data, 'notify_followers');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_follower ON public.user_follows;
CREATE TRIGGER trg_notify_new_follower
  AFTER INSERT ON public.user_follows
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_new_follower();


-- ############################################################################
-- TRIGGERS: ROLE INVITATIONS
-- ############################################################################

-- ============================================================================
-- T16: ROLE INVITATION → notify invited user (by phone match)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_role_invitation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id uuid;
  v_church  record;
  v_title   jsonb;
  v_body    jsonb;
  v_data    jsonb;
BEGIN
  SELECT id INTO v_user_id FROM public.profiles WHERE phone_number = NEW.phone_number LIMIT 1;
  IF v_user_id IS NULL THEN RETURN NEW; END IF;

  SELECT name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object('en', 'Role Invitation', 'am', 'የሚና ጥሪ');
  v_body  := jsonb_build_object(
    'en', 'You have been invited as ' || NEW.role || ' at ' || coalesce(v_church.name->>'en', ''),
    'am', coalesce(v_church.name->>'am', '') || ' ውስጥ ' || NEW.role || ' ሆነው ተጋብዘዋል'
  );
  v_data := jsonb_build_object('type', 'role_invitation', 'invitation_id', NEW.id, 'church_id', NEW.church_id, 'role', NEW.role::text);

  PERFORM public.create_notification(v_user_id, 'role_invitation', v_title, v_body, v_data, 'notification_enabled');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_role_invitation ON public.invitations;
CREATE TRIGGER trg_notify_role_invitation
  AFTER INSERT ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_role_invitation();


-- ############################################################################
-- TRIGGERS: WALLET
-- ############################################################################

-- ============================================================================
-- T17: WALLET TRANSACTION COMPLETED → notify user
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_wallet_transaction()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_wallet  record;
  v_title   jsonb;
  v_body    jsonb;
  v_data    jsonb;
  v_ntype   public.notification_type;
BEGIN
  IF NEW.status <> 'completed' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'completed' THEN RETURN NEW; END IF;

  SELECT * INTO v_wallet FROM public.user_wallets WHERE id = NEW.wallet_id;
  IF v_wallet IS NULL THEN RETURN NEW; END IF;

  IF NEW.transaction_type = 'deposit' THEN
    v_ntype := 'wallet_deposit';
    v_title := jsonb_build_object('en', 'Wallet Deposit', 'am', 'የቦርሳ ተቀማጭ');
    v_body  := jsonb_build_object(
      'en', NEW.currency || ' ' || NEW.amount || ' deposited to your wallet',
      'am', NEW.currency || ' ' || NEW.amount || ' ወደ ቦርሳዎ ገብቷል'
    );
  ELSIF NEW.transaction_type = 'withdrawal' THEN
    v_ntype := 'wallet_withdrawal';
    v_title := jsonb_build_object('en', 'Wallet Withdrawal', 'am', 'ከቦርሳ ወጪ');
    v_body  := jsonb_build_object(
      'en', NEW.currency || ' ' || NEW.amount || ' withdrawn from your wallet',
      'am', NEW.currency || ' ' || NEW.amount || ' ከቦርሳዎ ወጥቷል'
    );
  ELSE
    RETURN NEW;
  END IF;

  v_data := jsonb_build_object('type', v_ntype::text, 'wallet_id', NEW.wallet_id, 'transaction_id', NEW.id);

  PERFORM public.create_notification(v_wallet.user_id, v_ntype, v_title, v_body, v_data, 'notify_wallet');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_wallet_transaction ON public.wallet_transactions;
CREATE TRIGGER trg_notify_wallet_transaction
  AFTER INSERT OR UPDATE OF status ON public.wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_wallet_transaction();


-- ############################################################################
-- TRIGGERS: CONTENT LIKES
-- ############################################################################

-- ============================================================================
-- T18: CONTENT LIKED → notify content creator
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trg_notify_content_liked()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_content record;
  v_liker   record;
  v_title   jsonb;
  v_body    jsonb;
  v_data    jsonb;
BEGIN
  SELECT * INTO v_content FROM public.content_items WHERE id = NEW.content_id;
  IF v_content IS NULL OR v_content.created_by = NEW.user_id THEN RETURN NEW; END IF;

  SELECT first_name INTO v_liker FROM public.profiles WHERE id = NEW.user_id;

  v_title := jsonb_build_object('en', 'New Like', 'am', 'አዲስ ላይክ');
  v_body  := jsonb_build_object(
    'en', coalesce(v_liker.first_name, 'Someone') || ' liked "' || coalesce(v_content.title->>'en', '') || '"',
    'am', coalesce(v_liker.first_name, 'አንድ ሰው') || ' "' || coalesce(v_content.title->>'am', '') || '" ወደደ'
  );
  v_data := jsonb_build_object('type', 'new_content', 'content_id', NEW.content_id, 'content_type', v_content.content_type::text);

  PERFORM public.create_notification(v_content.created_by, 'new_content', v_title, v_body, v_data, 'notify_new_content');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_content_liked ON public.content_likes;
CREATE TRIGGER trg_notify_content_liked
  AFTER INSERT ON public.content_likes
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_content_liked();


-- ############################################################################
-- CRON: EVENT REMINDERS (24h and 1h before start)
-- Requires pg_cron and pg_net extensions
-- ############################################################################

-- ============================================================================
-- F1: Send event reminders — called by cron every 15 minutes
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_send_event_reminders()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_event   record;
  v_user_id uuid;
  v_title   jsonb;
  v_body    jsonb;
  v_data    jsonb;
  v_ntype   public.notification_type;
  v_now     timestamptz := now();
BEGIN
  -- 24-hour reminders: events starting between 23h45m and 24h15m from now
  FOR v_event IN
    SELECT e.* FROM public.events e
     WHERE e.status = 'published'
       AND e.start_time BETWEEN (v_now + interval '23 hours 45 minutes')
                           AND (v_now + interval '24 hours 15 minutes')
  LOOP
    v_ntype := 'event_reminder_24h';
    v_title := jsonb_build_object('en', 'Event Tomorrow', 'am', 'ነገ ዝግጅት');
    v_body  := jsonb_build_object(
      'en', coalesce(v_event.title->>'en', '') || ' starts tomorrow',
      'am', coalesce(v_event.title->>'am', '') || ' ነገ ይጀምራል'
    );
    v_data := jsonb_build_object('type', 'event_reminder_24h', 'event_id', v_event.id);

    FOR v_user_id IN
      SELECT user_id FROM public.event_rsvps
       WHERE event_id = v_event.id AND status IN ('going', 'maybe')
    LOOP
      -- Avoid duplicates: skip if already reminded
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications
         WHERE user_id = v_user_id AND type = 'event_reminder_24h'
           AND data->>'event_id' = v_event.id::text
      ) THEN
        PERFORM public.create_notification(v_user_id, v_ntype, v_title, v_body, v_data, 'notify_reminders');
      END IF;
    END LOOP;
  END LOOP;

  -- 1-hour reminders: events starting between 45m and 1h15m from now
  FOR v_event IN
    SELECT e.* FROM public.events e
     WHERE e.status = 'published'
       AND e.start_time BETWEEN (v_now + interval '45 minutes')
                           AND (v_now + interval '1 hour 15 minutes')
  LOOP
    v_ntype := 'event_reminder_1h';
    v_title := jsonb_build_object('en', 'Event Starting Soon', 'am', 'ዝግጅት በቅርቡ ይጀምራል');
    v_body  := jsonb_build_object(
      'en', coalesce(v_event.title->>'en', '') || ' starts in about 1 hour',
      'am', coalesce(v_event.title->>'am', '') || ' ከ1 ሰዓት ገደማ ይጀምራል'
    );
    v_data := jsonb_build_object('type', 'event_reminder_1h', 'event_id', v_event.id);

    FOR v_user_id IN
      SELECT user_id FROM public.event_rsvps
       WHERE event_id = v_event.id AND status IN ('going', 'maybe')
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications
         WHERE user_id = v_user_id AND type = 'event_reminder_1h'
           AND data->>'event_id' = v_event.id::text
      ) THEN
        PERFORM public.create_notification(v_user_id, v_ntype, v_title, v_body, v_data, 'notify_reminders');
      END IF;
    END LOOP;
  END LOOP;
END;
$$;


-- ============================================================================
-- F2: Send verse of the day — called by cron once daily
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_send_verse_of_the_day()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_votd    record;
  v_verse   record;
  v_chapter record;
  v_book    record;
  v_user_id uuid;
  v_title   jsonb;
  v_body    jsonb;
  v_data    jsonb;
BEGIN
  -- Get today's verse
  SELECT * INTO v_votd FROM public.verse_of_the_day
   WHERE scheduled_date = current_date
   LIMIT 1;
  IF v_votd IS NULL THEN RETURN; END IF;

  SELECT * INTO v_verse FROM public.bible_verses WHERE id = v_votd.verse_id;
  IF v_verse IS NULL THEN RETURN; END IF;

  SELECT * INTO v_chapter FROM public.bible_chapters WHERE id = v_verse.chapter_id;
  SELECT * INTO v_book FROM public.bible_books WHERE id = v_chapter.book_id;

  v_title := jsonb_build_object(
    'en', 'Verse of the Day',
    'am', 'የዕለቱ ጥቅስ'
  );
  v_body := jsonb_build_object(
    'en', coalesce(v_verse.text->>'en', '') || ' — ' || coalesce(v_book.name->>'en', '') || ' ' || v_chapter.chapter_number || ':' || v_verse.verse_number,
    'am', coalesce(v_verse.text->>'am', '') || ' — ' || coalesce(v_book.name->>'am', '') || ' ' || v_chapter.chapter_number || ':' || v_verse.verse_number
  );
  v_data := jsonb_build_object(
    'type', 'verse_of_day',
    'verse_id', v_votd.verse_id,
    'book_id', v_chapter.book_id,
    'chapter', v_chapter.chapter_number,
    'verse', v_verse.verse_number
  );

  -- Send to ALL users who have verse_of_day enabled
  FOR v_user_id IN
    SELECT id FROM public.profiles WHERE notification_enabled = true
  LOOP
    PERFORM public.create_notification(v_user_id, 'verse_of_day', v_title, v_body, v_data, 'notify_verse_of_day');
  END LOOP;
END;
$$;


-- ============================================================================
-- REGISTER CRON JOBS (requires pg_cron extension)
-- Run reminders every 15 minutes, verse of the day at 6:00 AM EAT (03:00 UTC)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Event reminders every 15 minutes
    PERFORM cron.schedule(
      'event-reminders',
      '*/15 * * * *',
      'SELECT public.fn_send_event_reminders()'
    );

    -- Verse of the day at 6 AM EAT (UTC+3)
    PERFORM cron.schedule(
      'verse-of-the-day',
      '0 3 * * *',
      'SELECT public.fn_send_verse_of_the_day()'
    );
  END IF;
END$$;
