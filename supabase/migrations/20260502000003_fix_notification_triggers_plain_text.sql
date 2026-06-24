-- -----------------------------------------------------------------------------
-- Align notification triggers with plain TEXT titles (20260428000001).
-- -----------------------------------------------------------------------------
-- Columns like donation_campaigns.title, churches.name, events.title, and
-- content_items.title are now plain text + companion `language`; using the
-- jsonb extractor `title->>'en'` fails at runtime:
--   ERROR: operator does not exist: text ->> unknown
--
-- This migration only replaces trigger bodies / helpers — triggers stay attached.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public._notif_en_am_plain(p_text text, p_lang text)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'en',
      CASE
        WHEN trim(coalesce(p_lang, '')) = 'en'
          THEN coalesce(trim(both FROM p_text), '')
        WHEN trim(coalesce(p_lang, '')) IN ('or', 'ti', 'so')
          THEN coalesce(trim(both FROM p_text), '')
        ELSE ''
      END,
    'am',
      CASE
        WHEN trim(coalesce(p_lang, '')) = 'am'
          THEN coalesce(trim(both FROM p_text), '')
        WHEN trim(coalesce(p_lang, '')) IN ('or', 'ti', 'so')
          THEN coalesce(trim(both FROM p_text), '')
        ELSE ''
      END
  );
$$;

COMMENT ON FUNCTION public._notif_en_am_plain(text, text)
  IS 'Build notification JSON fragment {en,am} from a localized plain-text field + ISO language code.';


CREATE OR REPLACE FUNCTION public.trg_notify_new_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_follower uuid;
  v_church   record;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'published' THEN RETURN NEW; END IF;

  SELECT language, name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object(
    'en', 'New Event',
    'am', 'አዲስ ዝግጅት'
  );
  v_body := jsonb_build_object(
    'en',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '')
        || ' by '
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'en', ''),
    'am',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '')
        || ' ከ'
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'am', '')
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


CREATE OR REPLACE FUNCTION public.trg_notify_event_updated()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user  uuid;
  v_title jsonb;
  v_body  jsonb;
  v_data  jsonb;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF OLD.title = NEW.title AND OLD.description = NEW.description
     AND OLD.start_time = NEW.start_time AND OLD.end_time = NEW.end_time
     AND OLD.address IS NOT DISTINCT FROM NEW.address
     AND OLD.is_online = NEW.is_online
  THEN RETURN NEW; END IF;

  v_title := jsonb_build_object('en', 'Event Updated', 'am', 'ዝግጅቱ ተቀይሯል');
  v_body  := jsonb_build_object(
    'en',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '') || ' has been updated',
    'am',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '') || ' ተስተካክሏል'
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
    'en',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '') || ' has been cancelled',
    'am',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '') || ' ተሰርዟል'
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

  IF TG_OP = 'UPDATE' AND OLD.status = NEW.status THEN
    RAISE LOG '[trg_notify_new_rsvp] Skipping: status unchanged (%)', NEW.status;
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
    'en', coalesce(v_user.first_name, '') || ' registered for ' ||
      coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', ''),
    'am', coalesce(v_user.first_name, '') || ' ለ' ||
      coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '') || ' ተመዝግቧል'
  );
  v_data := jsonb_build_object(
    'type', 'new_rsvp',
    'event_id', NEW.event_id,
    'rsvp_id', NEW.id,
    'user_id', NEW.user_id
  );

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
    RAISE WARNING '[trg_notify_new_rsvp] No admins found for church_id=%, event_id=%',
      v_event.church_id, NEW.event_id;
  END IF;

  RAISE LOG '[trg_notify_new_rsvp] Done. Admins found: %', v_admin_count;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[trg_notify_new_rsvp] Error: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$;


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
  IF TG_OP = 'DELETE' THEN
    IF OLD.status <> 'going' THEN RETURN OLD; END IF;
    v_event_id := OLD.event_id;
    v_user_id := OLD.user_id;
  ELSE
    IF NEW.status = OLD.status THEN RETURN NEW; END IF;
    v_event_id := NEW.event_id;
    v_user_id := NEW.user_id;
  END IF;

  SELECT * INTO v_event FROM public.events WHERE id = v_event_id;
  SELECT first_name INTO v_user FROM public.profiles WHERE id = v_user_id;

  IF TG_OP = 'DELETE' OR (NEW.status = 'not_going' AND OLD.status = 'going') THEN
    v_title := jsonb_build_object('en', 'RSVP Cancelled', 'am', 'ምዝገባ ተሰርዟል');
    v_body  := jsonb_build_object(
      'en', coalesce(v_user.first_name, '') || ' cancelled RSVP for ' ||
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', ''),
      'am', coalesce(v_user.first_name, '') || ' ለ' ||
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '') || ' ምዝገባ ሰርዟል'
    );
    v_data := jsonb_build_object(
      'type', 'rsvp_cancelled',
      'event_id', v_event_id,
      'user_id', v_user_id
    );

    FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_event.church_id)
    LOOP
      IF v_admin <> v_user_id THEN
        PERFORM public.create_notification(v_admin, 'rsvp_cancelled', v_title, v_body, v_data, 'notify_rsvp');
      END IF;
    END LOOP;

  ELSIF NEW.status = 'going' AND OLD.status <> 'going' THEN
    v_title := jsonb_build_object('en', 'RSVP Confirmed', 'am', 'ምዝገባ ተረጋግጧል');
    v_body  := jsonb_build_object(
      'en', coalesce(v_user.first_name, '') || ' confirmed for ' ||
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', ''),
      'am', coalesce(v_user.first_name, '') || ' ለ' ||
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '') || ' ተረጋግጧል'
    );
    v_data := jsonb_build_object(
      'type', 'rsvp_confirmed',
      'event_id', v_event_id,
      'user_id', v_user_id
    );

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

  SELECT language, name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object('en', 'New Donation Campaign', 'am', 'አዲስ የልገሣ ዘመቻ');
  v_body  := jsonb_build_object(
    'en',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '')
        || ' — '
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'en', ''),
    'am',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '')
        || ' — '
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'am', '')
  );
  v_data := jsonb_build_object(
    'type', 'new_campaign',
    'campaign_id', NEW.id,
    'church_id', NEW.church_id
  );

  FOR v_follower IN SELECT * FROM public.get_church_follower_ids(NEW.church_id)
  LOOP
    IF v_follower <> NEW.created_by THEN
      PERFORM public.create_notification(v_follower, 'new_campaign', v_title, v_body, v_data, 'notify_donations');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;


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
    'en',
      coalesce(trim(both FROM v_campaign.title), '') || ' goal changed from '
        || NEW.old_goal_amount || ' to ' || NEW.new_goal_amount,
    'am',
      coalesce(trim(both FROM v_campaign.title), '') || ' ግብ ከ'
        || NEW.old_goal_amount || ' ወደ ' || NEW.new_goal_amount || ' ተቀይሯል'
  );
  v_data := jsonb_build_object('type', 'campaign_goal_changed', 'campaign_id', NEW.campaign_id);

  FOR v_donor IN
    SELECT DISTINCT user_id FROM public.donations
     WHERE campaign_id = NEW.campaign_id AND status = 'completed'
  LOOP
    PERFORM public.create_notification(
      v_donor,
      'campaign_goal_changed',
      v_title,
      v_body,
      v_data,
      'notify_donations'
    );
  END LOOP;

  RETURN NEW;
END;
$$;


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
  v_ctitle        text;
BEGIN
  IF NEW.status <> 'completed' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'completed' THEN RETURN NEW; END IF;

  IF NEW.campaign_id IS NULL THEN RETURN NEW; END IF;

  SELECT * INTO v_campaign FROM public.donation_campaigns WHERE id = NEW.campaign_id;
  SELECT first_name INTO v_donor FROM public.profiles WHERE id = NEW.user_id;

  v_ctitle := coalesce(trim(both FROM v_campaign.title), '');

  v_title := jsonb_build_object('en', 'New Donation', 'am', 'አዲስ ልገሣ');
  v_body  := jsonb_build_object(
    'en',
      coalesce(v_donor.first_name, 'Someone') || ' donated ' || NEW.currency || ' ' || NEW.amount
        || ' to ' || v_ctitle,
    'am',
      coalesce(v_donor.first_name, 'አንድ ሰው') || ' ' || NEW.currency || ' ' || NEW.amount
        || ' ለ' || v_ctitle || ' ለገሠ'
  );
  v_data := jsonb_build_object(
    'type', 'new_donation',
    'campaign_id', NEW.campaign_id,
    'donation_id', NEW.id
  );

  IF NEW.user_id IS DISTINCT FROM v_campaign.created_by THEN
    PERFORM public.create_notification(v_campaign.created_by, 'new_donation', v_title, v_body, v_data, 'notify_donations');
  END IF;

  IF v_campaign.goal_amount IS NOT NULL AND v_campaign.goal_amount > 0 THEN
    v_pct     := (v_campaign.current_amount::numeric / v_campaign.goal_amount) * 100;
    v_old_pct := ((v_campaign.current_amount - NEW.amount)::numeric / v_campaign.goal_amount) * 100;

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
      NULL;
    END IF;

    IF v_old_pct >= 100 AND v_pct > v_old_pct AND v_milestone_type IS NULL THEN
      v_milestone_type := 'donation_exceeded';
      v_milestone_label_en := 'Goal exceeded! ' || round(v_pct) || '% raised';
      v_milestone_label_am := 'ግቡ አልፏል! ' || round(v_pct) || '% ተሰብስቧል';
    END IF;

    IF v_milestone_type IS NOT NULL THEN
      v_title := jsonb_build_object(
        'en', v_ctitle || ' — ' || v_milestone_label_en,
        'am', v_ctitle || ' — ' || v_milestone_label_am
      );
      v_body := jsonb_build_object(
        'en',
          v_campaign.currency || ' ' || v_campaign.current_amount || ' of ' || v_campaign.goal_amount || ' raised',
        'am',
          v_campaign.currency || ' ' || v_campaign.current_amount || ' ከ'
            || v_campaign.goal_amount || ' ተሰብስቧል'
      );
      v_data := jsonb_build_object('type', v_milestone_type::text, 'campaign_id', NEW.campaign_id);

      FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_campaign.church_id)
      LOOP
        IF v_admin <> NEW.user_id THEN
          PERFORM public.create_notification(v_admin, v_milestone_type, v_title, v_body, v_data, 'notify_donations');
        END IF;
      END LOOP;

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
    'en',
      coalesce(v_creator.first_name, '') || ' submitted "' ||
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '') || '"',
    'am',
      coalesce(v_creator.first_name, '') || ' "' ||
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '') || '" አቅርቧል'
  );
  v_data := jsonb_build_object(
    'type', 'content_pending',
    'content_id', NEW.id,
    'church_id', NEW.church_id,
    'content_type', NEW.content_type::text
  );

  IF v_creator_role = 'content_admin' THEN
    FOR v_admin IN SELECT * FROM public.get_church_admin_only_ids(NEW.church_id)
    LOOP
      IF v_admin <> NEW.created_by THEN
        PERFORM public.create_notification(v_admin, 'content_pending', v_title, v_body, v_data, 'notify_content_review');
      END IF;
    END LOOP;
  ELSE
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

  SELECT language, name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object('en', 'Content Approved', 'am', 'ይዘት ጸድቋል');
  v_body  := jsonb_build_object(
    'en',
      '"' || coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '') || '" has been approved',
    'am',
      '"' || coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '') || '" ጸድቋል'
  );
  v_data := jsonb_build_object(
    'type', 'content_approved',
    'content_id', NEW.id,
    'content_type', NEW.content_type::text
  );

  PERFORM public.create_notification(NEW.created_by, 'content_approved', v_title, v_body, v_data, 'notify_new_content');

  v_title := jsonb_build_object('en', 'New Content', 'am', 'አዲስ ይዘት');
  v_body  := jsonb_build_object(
    'en',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '') || ' from '
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'en', ''),
    'am',
      coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '') || ' ከ'
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'am', '')
  );
  v_data := jsonb_build_object(
    'type', 'new_content',
    'content_id', NEW.id,
    'content_type', NEW.content_type::text,
    'church_id', NEW.church_id
  );

  FOR v_follower IN SELECT * FROM public.get_church_follower_ids(NEW.church_id)
  LOOP
    IF v_follower <> NEW.created_by THEN
      PERFORM public.create_notification(v_follower, 'new_content', v_title, v_body, v_data, 'notify_new_content');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.trg_notify_content_rejected()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_title jsonb;
  v_body  jsonb;
  v_data  jsonb;
BEGIN
  IF NEW.status <> 'rejected' OR OLD.status = 'rejected' THEN RETURN NEW; END IF;

  v_title := jsonb_build_object('en', 'Content Rejected', 'am', 'ይዘት ውድቅ ተደርጓል');
  v_body := jsonb_build_object(
    'en',
      '"' || coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'en', '') || '" was rejected'
      || coalesce(': ' || NEW.rejected_reason, ''),
    'am',
      '"' || coalesce(public._notif_en_am_plain(NEW.title, NEW.language)->>'am', '') || '" ውድቅ ተደርጓል'
      || coalesce(': ' || NEW.rejected_reason, '')
  );
  v_data := jsonb_build_object(
    'type', 'content_rejected',
    'content_id', NEW.id,
    'content_type', NEW.content_type::text
  );

  PERFORM public.create_notification(NEW.created_by, 'content_rejected', v_title, v_body, v_data, 'notify_new_content');

  RETURN NEW;
END;
$$;


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
  SELECT language, name INTO v_source FROM public.churches WHERE id = v_event.church_id;

  v_title := jsonb_build_object('en', 'Co-host Invitation', 'am', 'የጋራ አዘጋጅ ጥሪ');
  v_body := jsonb_build_object(
    'en',
      coalesce(public._notif_en_am_plain(v_source.name, v_source.language)->>'en', '')
      || ' invited your church to co-host "'
      || coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', '') || '"',
    'am',
      coalesce(public._notif_en_am_plain(v_source.name, v_source.language)->>'am', '')
      || ' ቤተክርስቲያንዎን "'
      || coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '')
      || '" ለማዘጋጀት ጋብዟል'
  );
  v_data := jsonb_build_object(
    'type', 'co_host_invited',
    'event_id', NEW.event_id,
    'co_host_id', NEW.id,
    'church_id', NEW.church_id
  );

  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(NEW.church_id)
  LOOP
    PERFORM public.create_notification(v_admin, 'co_host_invited', v_title, v_body, v_data, 'notify_co_hosting');
  END LOOP;

  RETURN NEW;
END;
$$;


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
  SELECT language, name INTO v_target FROM public.churches WHERE id = NEW.church_id;

  IF NEW.status = 'accepted' THEN
    v_ntype := 'co_host_accepted';
    v_title := jsonb_build_object('en', 'Co-host Accepted', 'am', 'የጋራ አዘጋጅ ተቀብሏል');
    v_body := jsonb_build_object(
      'en',
        coalesce(public._notif_en_am_plain(v_target.name, v_target.language)->>'en', '')
          || ' accepted co-hosting "'
          || coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', '') || '"',
      'am',
        coalesce(public._notif_en_am_plain(v_target.name, v_target.language)->>'am', '')
          || ' "' || coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '')
          || '" ማዘጋጀት ተቀብሏል'
    );
  ELSE
    v_ntype := 'co_host_declined';
    v_title := jsonb_build_object('en', 'Co-host Declined', 'am', 'የጋራ አዘጋጅ አልተቀበለም');
    v_body := jsonb_build_object(
      'en',
        coalesce(public._notif_en_am_plain(v_target.name, v_target.language)->>'en', '')
          || ' declined co-hosting "'
          || coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', '') || '"',
      'am',
        coalesce(public._notif_en_am_plain(v_target.name, v_target.language)->>'am', '')
          || ' "' || coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '')
          || '" ማዘጋጀት አልተቀበለም'
    );
  END IF;

  v_data := jsonb_build_object(
    'type', v_ntype::text,
    'event_id', NEW.event_id,
    'co_host_id', NEW.id,
    'church_id', NEW.church_id
  );

  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_event.church_id)
  LOOP
    PERFORM public.create_notification(v_admin, v_ntype, v_title, v_body, v_data, 'notify_co_hosting');
  END LOOP;

  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.trg_notify_room_started()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_content  record;
  v_follower uuid;
  v_title    jsonb;
  v_body     jsonb;
  v_data     jsonb;
BEGIN
  IF NEW.room_status <> 'live' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.room_status = 'live' THEN RETURN NEW; END IF;

  SELECT * INTO v_content FROM public.content_items WHERE id = NEW.id;
  IF v_content IS NULL THEN RETURN NEW; END IF;

  v_title := jsonb_build_object('en', 'Room is Live', 'am', 'ክፍል ቀጥታ ነው');
  v_body := jsonb_build_object(
    'en',
      coalesce(public._notif_en_am_plain(v_content.title, v_content.language)->>'en', '') || ' is now live',
    'am',
      coalesce(public._notif_en_am_plain(v_content.title, v_content.language)->>'am', '') || ' አሁን ቀጥታ ነው'
  );
  v_data := jsonb_build_object(
    'type', 'room_started',
    'room_id', NEW.id,
    'church_id', v_content.church_id
  );

  FOR v_follower IN SELECT * FROM public.get_church_follower_ids(v_content.church_id)
  LOOP
    IF v_follower <> v_content.created_by THEN
      PERFORM public.create_notification(v_follower, 'room_started', v_title, v_body, v_data, 'notify_new_content');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;


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
  SELECT language, name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object('en', 'New Follower', 'am', 'አዲስ ተከታይ');
  v_body  := jsonb_build_object(
    'en',
      coalesce(v_user.first_name, '') || ' started following '
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'en', ''),
    'am',
      coalesce(v_user.first_name, '') || ' '
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'am', '') || 'ን መከተል ጀመረ'
  );
  v_data := jsonb_build_object(
    'type', 'new_follower',
    'user_id', NEW.user_id,
    'church_id', NEW.church_id
  );

  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(NEW.church_id)
  LOOP
    IF v_admin <> NEW.user_id THEN
      PERFORM public.create_notification(v_admin, 'new_follower', v_title, v_body, v_data, 'notify_followers');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;


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

  SELECT language, name INTO v_church FROM public.churches WHERE id = NEW.church_id;

  v_title := jsonb_build_object('en', 'Role Invitation', 'am', 'የሚና ጥሪ');
  v_body  := jsonb_build_object(
    'en',
      'You have been invited as ' || NEW.role || ' at '
        || coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'en', ''),
    'am',
      coalesce(public._notif_en_am_plain(v_church.name, v_church.language)->>'am', '')
        || ' ውስጥ ' || NEW.role || ' ሆነው ተጋብዘዋል'
  );
  v_data := jsonb_build_object(
    'type', 'role_invitation',
    'invitation_id', NEW.id,
    'church_id', NEW.church_id,
    'role', NEW.role::text
  );

  PERFORM public.create_notification(
    v_user_id,
    'role_invitation',
    v_title,
    v_body,
    v_data,
    'notification_enabled'
  );

  RETURN NEW;
END;
$$;


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
    'en',
      coalesce(v_liker.first_name, 'Someone') || ' liked "' ||
      coalesce(public._notif_en_am_plain(v_content.title, v_content.language)->>'en', '') || '"',
    'am',
      coalesce(v_liker.first_name, 'አንድ ሰው') || ' "' ||
      coalesce(public._notif_en_am_plain(v_content.title, v_content.language)->>'am', '') || '" ወደደ'
  );
  v_data := jsonb_build_object(
    'type', 'new_content',
    'content_id', NEW.content_id,
    'content_type', v_content.content_type::text
  );

  PERFORM public.create_notification(
    v_content.created_by,
    'new_content',
    v_title,
    v_body,
    v_data,
    'notify_new_content'
  );

  RETURN NEW;
END;
$$;


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
  FOR v_event IN
    SELECT e.* FROM public.events e
     WHERE e.status = 'published'
       AND e.start_time BETWEEN (v_now + interval '23 hours 45 minutes')
                           AND (v_now + interval '24 hours 15 minutes')
  LOOP
    v_ntype := 'event_reminder_24h';
    v_title := jsonb_build_object('en', 'Event Tomorrow', 'am', 'ነገ ዝግጅት');
    v_body := jsonb_build_object(
      'en',
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', '') || ' starts tomorrow',
      'am',
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '') || ' ነገ ይጀምራል'
    );
    v_data := jsonb_build_object('type', 'event_reminder_24h', 'event_id', v_event.id);

    FOR v_user_id IN
      SELECT user_id FROM public.event_rsvps
       WHERE event_id = v_event.id AND status IN ('going', 'maybe')
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications
         WHERE user_id = v_user_id AND type = 'event_reminder_24h'
           AND data->>'event_id' = v_event.id::text
      ) THEN
        PERFORM public.create_notification(v_user_id, v_ntype, v_title, v_body, v_data, 'notify_reminders');
      END IF;
    END LOOP;
  END LOOP;

  FOR v_event IN
    SELECT e.* FROM public.events e
     WHERE e.status = 'published'
       AND e.start_time BETWEEN (v_now + interval '45 minutes')
                           AND (v_now + interval '1 hour 15 minutes')
  LOOP
    v_ntype := 'event_reminder_1h';
    v_title := jsonb_build_object('en', 'Event Starting Soon', 'am', 'ዝግጅት በቅርቡ ይጀምራል');
    v_body := jsonb_build_object(
      'en',
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'en', '')
          || ' starts in about 1 hour',
      'am',
        coalesce(public._notif_en_am_plain(v_event.title, v_event.language)->>'am', '')
          || ' ከ1 ሰዓት ገደማ ይጀምራል'
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
