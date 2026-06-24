/*
 * Migration: Day-before fasting reminder pipeline
 * ============================================================================
 * Adds:
 *   1. notification_type enum value 'fasting_reminder'.
 *   2. public.fn_send_fasting_reminders() — finds fasts that START tomorrow
 *      (active tomorrow but NOT today) and notifies every user who has push
 *      enabled + notify_fasting on.
 *   3. A daily pg_cron job (18:00 EAT / 15:00 UTC) that runs it.
 *
 * REUSE OF THE EXISTING PUSH PIPELINE
 * --------------------------------------------------------------------------
 * We call the canonical public.create_notification(user, type, title, body,
 * data, pref_category). That function:
 *   • checks should_send_push(user, 'notify_fasting') (global kill-switch on
 *     profiles.notification_enabled + the per-category column),
 *   • inserts the in-app notifications row (with is_silent set accordingly),
 *   • whereupon the AFTER INSERT trigger trg_notifications_send_push fans the
 *     row out to the send-push-notification edge function (Expo) via pg_net.
 * So this migration adds NO new push transport — it plugs straight into the
 * same path event reminders & verse-of-the-day already use.
 *
 * Author: System
 * Date: 2026-06-21
 */

-- ============================================================================
-- 1. ENUM VALUE
--    Added in its own DO block; only ever referenced from inside PL/pgSQL
--    function bodies below (late-bound), so it is safe within this migration.
-- ============================================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
     WHERE enumlabel = 'fasting_reminder'
       AND enumtypid = 'public.notification_type'::regtype
  ) THEN
    ALTER TYPE public.notification_type ADD VALUE 'fasting_reminder';
  END IF;
END $$;


-- ============================================================================
-- 2. CRON FUNCTION
-- ----------------------------------------------------------------------------
-- "Starts tomorrow" = active on (current_date + 1) but NOT active today. This
-- naturally captures:
--   • the first day of a period fast (Lent, Nativity, Filseta, Apostles, ...),
--   • an eve fast (Gena/Timket eve),
--   • a Wed/Fri that becomes a fasting day tomorrow (and is not lifted by an
--     exclusion window).
-- One summarized notification is sent per user, listing tomorrow's fast(s).
-- A dedupe guard keys on data->>'fast_date' so re-runs never double-notify.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_send_fasting_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tomorrow  date := (current_date + 1);
  v_keys      text[];
  v_names_en  text;
  v_names_am  text;
  v_title     jsonb;
  v_body      jsonb;
  v_data      jsonb;
  v_user_id   uuid;
BEGIN
  -- Fasts active tomorrow but not today (a "start" transition).
  SELECT
    array_agg(t.fasting_key),
    string_agg(COALESCE(t.name ->> 'en', t.name ->> 'am'), ', '),
    string_agg(COALESCE(t.name ->> 'am', t.name ->> 'en'), '፣ ')
  INTO v_keys, v_names_en, v_names_am
  FROM public.get_active_fasts(v_tomorrow) t
  WHERE t.fasting_key NOT IN (
    SELECT fasting_key FROM public.get_active_fasts(current_date)
  );

  -- Nothing begins tomorrow → nothing to do.
  IF v_keys IS NULL OR array_length(v_keys, 1) IS NULL THEN
    RETURN;
  END IF;

  v_title := jsonb_build_object(
    'en', 'Fasting Begins Tomorrow',
    'am', 'ነገ ጾም ይጀምራል'
  );
  v_body := jsonb_build_object(
    'en', 'Tomorrow is a fasting day: ' || v_names_en,
    'am', 'ነገ የጾም ቀን ነው፦ ' || v_names_am
  );
  v_data := jsonb_build_object(
    'type',         'fasting_reminder',
    'fast_date',    v_tomorrow::text,
    'fasting_keys', to_jsonb(v_keys)
  );

  -- Audience: every user with the global push switch on. create_notification
  -- then applies the per-user notify_fasting preference (silent if off).
  FOR v_user_id IN
    SELECT id FROM public.profiles WHERE notification_enabled = true
  LOOP
    -- Dedupe: one reminder per user per fast_date.
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
       WHERE user_id = v_user_id
         AND type = 'fasting_reminder'
         AND data ->> 'fast_date' = v_tomorrow::text
    ) THEN
      PERFORM public.create_notification(
        v_user_id, 'fasting_reminder', v_title, v_body, v_data, 'notify_fasting'
      );
    END IF;
  END LOOP;
END;
$$;

COMMENT ON FUNCTION public.fn_send_fasting_reminders() IS
  'Daily cron: notify users (respecting notify_fasting) about fasts that begin tomorrow. Reuses create_notification -> push pipeline.';


-- ============================================================================
-- 3. SCHEDULE (idempotent; no-op if pg_cron is not installed)
--    18:00 EAT (UTC+3) == 15:00 UTC — an evening "tomorrow is a fast" nudge.
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    BEGIN
      PERFORM cron.unschedule('fasting-reminders');
    EXCEPTION WHEN OTHERS THEN
      NULL;  -- not scheduled yet
    END;

    PERFORM cron.schedule(
      'fasting-reminders',
      '0 15 * * *',
      'SELECT public.fn_send_fasting_reminders()'
    );
  END IF;
END $$;
