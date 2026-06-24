/*
 * Migration: Plain-text title/body columns on `notifications` for Entrig push
 * --------------------------------------------------------------------------
 * Why:
 *   Entrig's placeholder DSL (`{{table.column}}`) has no syntax for jsonb
 *   field extraction. Our existing triggers write `title` / `body` as jsonb
 *   `{"en": "...", "am": "..."}`, which would render as raw JSON inside a
 *   push notification. To keep the in-app history (which expects jsonb)
 *   intact *and* give Entrig a clean string to use, we add two plain-text
 *   companion columns and populate them at insertion time from the
 *   recipient's preferred language.
 *
 * Changes:
 *   1. Add `notifications.title_text` and `notifications.body_text` (text).
 *   2. Add a partial index on `is_silent` so the Entrig trigger
 *      (`WHERE is_silent = false`) scans cheaply.
 *   3. Replace `create_notification` so it resolves the recipient's
 *      language_preference once and stores both text columns alongside
 *      the existing jsonb.
 *   4. Backfill existing rows using the English/Amharic values.
 *
 * Backwards compatibility:
 *   - The `create_notification(uuid, notification_type, jsonb, jsonb, jsonb, text)`
 *     signature is unchanged, so every existing trigger keeps working.
 *   - `notifications.title` and `notifications.body` keep their jsonb shape
 *     and are still what the in-app notification list consumes.
 */

-- ============================================================================
-- 1. SCHEMA
-- ============================================================================

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS title_text text,
  ADD COLUMN IF NOT EXISTS body_text  text;

-- Entrig's eventConditions will read `is_silent = false`. A partial index
-- keeps that read O(matches) instead of full-table per fanout row.
CREATE INDEX IF NOT EXISTS idx_notifications_unsilent_created_at
  ON public.notifications (created_at DESC)
  WHERE is_silent = false;

COMMENT ON COLUMN public.notifications.title_text
  IS 'Plain-text notification title in the recipient''s language. Used by Entrig push delivery.';
COMMENT ON COLUMN public.notifications.body_text
  IS 'Plain-text notification body in the recipient''s language. Used by Entrig push delivery.';


-- ============================================================================
-- 2. HELPER: pick the right localized string out of a jsonb {en, am, ...}
--    blob, falling back through the user's language → English → Amharic →
--    any non-empty value → empty string.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._notif_pick_text(p_jsonb jsonb, p_lang text)
RETURNS text
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_value text;
  v_lang  text := lower(coalesce(nullif(trim(p_lang), ''), 'en'));
BEGIN
  IF p_jsonb IS NULL THEN
    RETURN '';
  END IF;

  -- Preferred language first.
  v_value := nullif(trim(coalesce(p_jsonb ->> v_lang, '')), '');
  IF v_value IS NOT NULL THEN RETURN v_value; END IF;

  -- Then English.
  v_value := nullif(trim(coalesce(p_jsonb ->> 'en', '')), '');
  IF v_value IS NOT NULL THEN RETURN v_value; END IF;

  -- Then Amharic.
  v_value := nullif(trim(coalesce(p_jsonb ->> 'am', '')), '');
  IF v_value IS NOT NULL THEN RETURN v_value; END IF;

  -- Any other non-empty entry.
  SELECT trim(value::text) INTO v_value
    FROM jsonb_each_text(p_jsonb)
   WHERE coalesce(trim(value::text), '') <> ''
   LIMIT 1;

  RETURN coalesce(v_value, '');
END;
$$;

COMMENT ON FUNCTION public._notif_pick_text(jsonb, text)
  IS 'Pick the recipient-language string from a localized jsonb {en, am, …} title/body.';


-- ============================================================================
-- 3. REPLACE create_notification
--    Same signature, but now also writes the resolved plain-text columns.
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
  v_send_push  boolean;
  v_notif_id   uuid;
  v_lang       text;
  v_title_text text;
  v_body_text  text;
BEGIN
  -- Determine if push should fire.
  BEGIN
    IF p_pref_category IS NOT NULL THEN
      v_send_push := public.should_send_push(p_user_id, p_pref_category);
    ELSE
      v_send_push := public.should_send_push(p_user_id, 'notification_enabled');
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_send_push := true;
  END;

  -- Resolve recipient language (silently default to English on lookup error).
  BEGIN
    SELECT language_preference INTO v_lang
      FROM public.profiles
     WHERE id = p_user_id;
  EXCEPTION WHEN OTHERS THEN
    v_lang := 'en';
  END;
  v_lang := coalesce(nullif(trim(v_lang), ''), 'en');

  v_title_text := public._notif_pick_text(p_title, v_lang);
  v_body_text  := public._notif_pick_text(p_body,  v_lang);

  INSERT INTO public.notifications (
    user_id, type, title, body, title_text, body_text, data, is_silent
  )
  VALUES (
    p_user_id, p_type, p_title, p_body, v_title_text, v_body_text, p_data, NOT v_send_push
  )
  RETURNING id INTO v_notif_id;

  RETURN v_notif_id;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'create_notification failed for user=% type=%: %', p_user_id, p_type, SQLERRM;
  RETURN NULL;
END;
$$;


-- ============================================================================
-- 4. BACKFILL existing rows (cheap one-shot UPDATE)
--    Use English (or Amharic fallback) since we don't know what language
--    each historical row was sent in.
-- ============================================================================

UPDATE public.notifications
   SET title_text = public._notif_pick_text(title, 'en'),
       body_text  = public._notif_pick_text(body,  'en')
 WHERE title_text IS NULL
    OR body_text  IS NULL;
