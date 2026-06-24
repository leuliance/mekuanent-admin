/*
 * Migration: rewire `trg_notifications_send_push` to read config from
 *            Supabase Vault (the canonical pattern) instead of custom
 *            GUCs that Supabase does not auto-populate.
 *
 * Why this exists:
 *   The previous trigger function tried `current_setting('app.settings.supabase_url')`
 *   first. Supabase Hosted does NOT auto-set that GUC, so the
 *   trigger silently returned NEW without ever calling
 *   `net.http_post`. Result: no edge-function invocation, no logs,
 *   no pushes. This migration replaces the function with one that
 *   reads from `vault.decrypted_secrets` (the place Supabase itself
 *   uses for database webhooks) and RAISES WARNING loudly if the
 *   secrets aren't configured, so the failure is obvious.
 *
 * One-time setup required AFTER applying this migration:
 *
 *   SELECT vault.create_secret(
 *     'https://<your-project-ref>.supabase.co', 'project_url');
 *   SELECT vault.create_secret('<your-service-role-key>', 'service_role_key');
 *
 *   (or, to update existing secrets, use vault.update_secret.)
 *
 * Use `SELECT * FROM public.diagnose_push_trigger();` to verify.
 */

CREATE EXTENSION IF NOT EXISTS pg_net;


-- ============================================================================
-- 1. Replacement trigger function — vault-backed, loud on misconfig
-- ============================================================================

CREATE OR REPLACE FUNCTION public.notifications_send_push_via_expo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, vault
AS $$
DECLARE
  v_url        text;
  v_key        text;
  v_request_id bigint;
BEGIN
  BEGIN
    SELECT decrypted_secret
      INTO v_url
      FROM vault.decrypted_secrets
     WHERE name = 'project_url'
     LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    v_url := NULL;
  END;

  IF v_url IS NULL OR v_url = '' THEN
    v_url := current_setting('app.settings.supabase_url', true);
  END IF;

  BEGIN
    SELECT decrypted_secret
      INTO v_key
      FROM vault.decrypted_secrets
     WHERE name = 'service_role_key'
     LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    v_key := NULL;
  END;

  IF v_key IS NULL OR v_key = '' THEN
    v_key := current_setting('app.settings.service_role_key', true);
  END IF;

  IF v_url IS NULL OR v_url = '' THEN
    RAISE WARNING '[push_trigger] project_url not configured. Run: SELECT vault.create_secret(''https://<your-ref>.supabase.co'', ''project_url'');';
    RETURN NEW;
  END IF;

  v_request_id := net.http_post(
    url     := rtrim(v_url, '/') || '/functions/v1/send-push-notification',
    body    := jsonb_build_object(
      'notification_id', NEW.id,
      'user_id',         NEW.user_id,
      'type',            NEW.type::text,
      'title_text',      coalesce(NEW.title_text, ''),
      'body_text',       coalesce(NEW.body_text,  ''),
      'data',            coalesce(NEW.data, '{}'::jsonb),
      'is_silent',       coalesce(NEW.is_silent, false)
    ),
    headers := CASE
      WHEN v_key IS NOT NULL AND v_key <> '' THEN
        jsonb_build_object(
          'content-type',  'application/json',
          'authorization', 'Bearer ' || v_key
        )
      ELSE
        jsonb_build_object('content-type', 'application/json')
    END,
    -- 10s is comfortable for the edge function's new 202-async
    -- pattern (it responds in <50ms) and covers any future cold-start
    -- variance without making INSERTs feel slow.
    timeout_milliseconds := 10000
  );

  RAISE LOG '[push_trigger] queued net.http_post id=% notification=% type=% silent=%',
    v_request_id, NEW.id, NEW.type, NEW.is_silent;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[push_trigger] failed for notification %: % (%)',
    NEW.id, SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.notifications_send_push_via_expo() IS
  'AFTER INSERT trigger on public.notifications. Reads project_url + service_role_key from vault.decrypted_secrets and fans the row out to the send-push-notification edge function via pg_net.';


-- ============================================================================
-- 2. Make sure the trigger itself is present (idempotent).
-- ============================================================================

DROP TRIGGER IF EXISTS trg_notifications_send_push ON public.notifications;
CREATE TRIGGER trg_notifications_send_push
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.notifications_send_push_via_expo();


-- ============================================================================
-- 3. Diagnostic helper — `SELECT * FROM public.diagnose_push_trigger();`
--    returns one row per check. Anything not OK is the reason pushes
--    aren't going out.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.diagnose_push_trigger()
RETURNS TABLE(check_name text, value text, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, vault
AS $$
DECLARE
  v_url       text;
  v_key       text;
  v_has_net   boolean;
  v_has_trig  boolean;
  v_recent    integer;
BEGIN
  BEGIN
    SELECT decrypted_secret INTO v_url
      FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN v_url := NULL;
  END;

  BEGIN
    SELECT decrypted_secret INTO v_key
      FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN v_key := NULL;
  END;

  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net')
    INTO v_has_net;
  SELECT EXISTS (SELECT 1 FROM pg_trigger
                  WHERE tgname = 'trg_notifications_send_push')
    INTO v_has_trig;

  BEGIN
    EXECUTE 'SELECT count(*) FROM net._http_response WHERE created > now() - interval ''10 minutes'''
      INTO v_recent;
  EXCEPTION WHEN OTHERS THEN
    v_recent := -1;
  END;

  RETURN QUERY VALUES
    ('vault.project_url',
       coalesce(v_url, '<missing>'),
       CASE WHEN v_url IS NOT NULL AND v_url <> '' THEN 'OK' ELSE 'MISSING' END),
    ('vault.service_role_key',
       CASE WHEN v_key IS NOT NULL AND v_key <> '' THEN
         'set (' || left(v_key, 8) || '…)'
       ELSE '<missing>' END,
       CASE WHEN v_key IS NOT NULL AND v_key <> '' THEN 'OK' ELSE 'MISSING' END),
    ('extension pg_net',
       'pg_net',
       CASE WHEN v_has_net THEN 'OK' ELSE 'MISSING' END),
    ('trigger trg_notifications_send_push',
       CASE WHEN v_has_trig THEN 'present' ELSE 'missing' END,
       CASE WHEN v_has_trig THEN 'OK' ELSE 'MISSING' END),
    ('net._http_response rows in last 10m',
       v_recent::text,
       CASE WHEN v_recent > 0 THEN 'OK'
            WHEN v_recent = 0 THEN 'NO RECENT CALLS'
            ELSE 'CANNOT QUERY' END);
END;
$$;

COMMENT ON FUNCTION public.diagnose_push_trigger() IS
  'Run SELECT * FROM public.diagnose_push_trigger() to verify the push pipeline (vault secrets, pg_net, trigger, recent pg_net activity).';
