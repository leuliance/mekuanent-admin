/*
 * Migration: Expo Push trigger on `public.notifications`
 * ------------------------------------------------------
 * Why:
 *   We're migrating off Entrig (one trigger configured in their
 *   dashboard) onto Expo Notifications. The fan-out is now done in our
 *   own edge function (`send-push-notification`) which talks to the
 *   Expo Push API and retires dead tokens. To keep the existing
 *   per-domain triggers (`trg_notify_new_event`, etc.) untouched we
 *   add a NEW row-level trigger on `public.notifications` itself —
 *   it's the single fan-out point, exactly where Entrig used to hook.
 *
 * Architecture:
 *   1. Every domain trigger keeps calling `public.create_notification`
 *      (unchanged) which inserts into `public.notifications` and
 *      populates `title_text` / `body_text` from the recipient's
 *      language_preference.
 *   2. This trigger fires AFTER each INSERT, makes a non-blocking
 *      `net.http_post` to the Supabase edge function with the row's
 *      identifying fields, and the edge function does the actual
 *      fan-out to all of the user's active `push_tokens`.
 *   3. `is_silent = true` rows still get inserted (they show up in the
 *      in-app inbox) but the edge function short-circuits on them so
 *      no device ever rings.
 *
 * Prerequisites:
 *   - `pg_net` extension installed (it ships with Supabase). The
 *     `net.http_post` API is what gives the trigger a non-blocking
 *     HTTP call that won't deadlock the inserting transaction.
 *   - Two GUCs configured at the database level:
 *
 *       ALTER DATABASE postgres SET app.settings.supabase_url
 *         = 'https://<project-ref>.supabase.co';
 *       ALTER DATABASE postgres SET app.settings.service_role_key
 *         = '<service-role-key>';
 *
 *     Supabase auto-configures these when the project is provisioned
 *     under the names below (the snake_case form). If a self-hosted
 *     install doesn't have them the function logs a warning and the
 *     INSERT still succeeds — push is best-effort, the inbox is the
 *     source of truth.
 *
 * Rollback:
 *   DROP TRIGGER  trg_notifications_send_push       ON public.notifications;
 *   DROP FUNCTION public.notifications_send_push_via_expo();
 */

-- ============================================================================
-- 0. Extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_net;


-- ============================================================================
-- 1. Trigger function — calls the edge function via pg_net
-- ============================================================================

CREATE OR REPLACE FUNCTION public.notifications_send_push_via_expo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_url    text;
  v_key    text;
  v_payload jsonb;
BEGIN
  -- Pull the project URL + service-role key from database GUCs.
  -- Supabase populates these automatically; on self-hosted you must
  -- set them once via ALTER DATABASE.
  BEGIN
    v_url := current_setting('app.settings.supabase_url', true);
    v_key := current_setting('app.settings.service_role_key', true);
  EXCEPTION WHEN OTHERS THEN
    v_url := NULL;
    v_key := NULL;
  END;

  -- If config is missing, fall back to the well-known Supabase
  -- variables so this still works in CI / local dev.
  IF v_url IS NULL OR v_url = '' THEN
    v_url := current_setting('supabase.functions.url', true);
  END IF;
  IF v_key IS NULL OR v_key = '' THEN
    v_key := current_setting('supabase.functions.service_role_key', true);
  END IF;

  IF v_url IS NULL OR v_url = '' OR v_key IS NULL OR v_key = '' THEN
    RAISE LOG '[notifications_send_push_via_expo] missing supabase_url / service_role_key — skipping push for notification %', NEW.id;
    RETURN NEW;
  END IF;

  -- Build the envelope the edge function expects.
  v_payload := jsonb_build_object(
    'notification_id', NEW.id,
    'user_id',         NEW.user_id,
    'type',            NEW.type::text,
    'title_text',      coalesce(NEW.title_text, ''),
    'body_text',       coalesce(NEW.body_text,  ''),
    'data',            coalesce(NEW.data, '{}'::jsonb),
    'is_silent',       coalesce(NEW.is_silent, false)
  );

  -- Fire-and-forget. pg_net queues the request and returns
  -- immediately so the original INSERT transaction commits without
  -- blocking on network I/O. The edge function logs failures.
  PERFORM net.http_post(
    url     := rtrim(v_url, '/') || '/functions/v1/send-push-notification',
    body    := v_payload,
    headers := jsonb_build_object(
      'content-type',   'application/json',
      'authorization',  'Bearer ' || v_key
    ),
    timeout_milliseconds := 5000
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never let a push delivery failure block an in-app notification
  -- from landing in the inbox. Log + swallow.
  RAISE LOG '[notifications_send_push_via_expo] failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.notifications_send_push_via_expo()
  IS 'AFTER INSERT trigger that POSTs new public.notifications rows to the send-push-notification edge function for fan-out via Expo Push.';


-- ============================================================================
-- 2. Trigger — fire on every notifications INSERT
-- ============================================================================

DROP TRIGGER IF EXISTS trg_notifications_send_push ON public.notifications;
CREATE TRIGGER trg_notifications_send_push
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.notifications_send_push_via_expo();
