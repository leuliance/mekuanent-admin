/*
 * Migration: dedicated `event_reminders` table for the bell-icon flow
 * ---------------------------------------------------------------------
 *
 * Why:
 *   Today, the only way a user can opt into the 24h+1h event reminder
 *   push pipeline is by RSVPing. That conflates two distinct user
 *   intents:
 *     • "I'm coming" (a hard commitment + attendee count)
 *     • "Just remind me when it's about to start" (no commitment)
 *
 *   The mobile event-detail screen wants a separate bell-shaped toggle
 *   so users can park interest in an event without showing up as a
 *   confirmed attendee. This migration adds the storage + a small
 *   surgical edit to `fn_send_event_reminders` so the pg_cron job
 *   picks up reminder-only opt-ins alongside RSVPs.
 *
 * Design:
 *   • One row per (user_id, event_id). PK is the pair so duplicate
 *     opt-ins are no-ops.
 *   • RLS: every user manages their own rows; nobody else can read
 *     them (this is a personal cue, not a public attendance signal).
 *   • Cron loop: `fn_send_event_reminders` now scans the UNION of
 *     RSVP rows ('going'/'maybe') and `event_reminders` rows so a
 *     single notification fires per (user, event) regardless of how
 *     they opted in. The existing duplicate-guard
 *     (`NOT EXISTS ... type = 'event_reminder_*h' AND data->>'event_id' = …`)
 *     keeps us from double-firing if the same user has both an RSVP
 *     and a reminder row.
 *   • The notification itself uses `notify_reminders` as the pref
 *     category, identical to today's path — so the user-settings
 *     screen stays the source of truth.
 */

-- ============================================================================
-- 1. TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_reminders (
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id   uuid        NOT NULL REFERENCES public.events(id)   ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_event_reminders_event_id
  ON public.event_reminders (event_id);

COMMENT ON TABLE  public.event_reminders
  IS 'Per-user opt-in for the 24h+1h event reminder push pipeline, independent of RSVPs.';
COMMENT ON COLUMN public.event_reminders.user_id
  IS 'Owner; reminders are personal — only the user can read/write their own row.';

-- ============================================================================
-- 2. ROW-LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "event_reminders: select own" ON public.event_reminders;
CREATE POLICY "event_reminders: select own"
  ON public.event_reminders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "event_reminders: insert own" ON public.event_reminders;
CREATE POLICY "event_reminders: insert own"
  ON public.event_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "event_reminders: delete own" ON public.event_reminders;
CREATE POLICY "event_reminders: delete own"
  ON public.event_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. CRON: extend fn_send_event_reminders to scan the new table too
--    Same shape as the existing function; only the recipient set widens.
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
  -- ── 24-hour bucket ────────────────────────────────────────────────
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
      -- UNION of RSVPs (going/maybe) and bell-icon reminder opt-ins.
      SELECT user_id FROM public.event_rsvps
       WHERE event_id = v_event.id AND status IN ('going', 'maybe')
      UNION
      SELECT user_id FROM public.event_reminders
       WHERE event_id = v_event.id
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

  -- ── 1-hour bucket ─────────────────────────────────────────────────
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
      UNION
      SELECT user_id FROM public.event_reminders
       WHERE event_id = v_event.id
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
