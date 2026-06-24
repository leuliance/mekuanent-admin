/*
 * Migration: Content Reports / Moderation
 * ============================================================================
 * Lets authenticated users report inappropriate or incorrect content across
 * several polymorphic entity types (events, donation campaigns, teaching
 * content items, churches) and gives church managers + super admins a queue to
 * triage and resolve those reports.
 *
 * DESIGN (opinionated):
 *   • ONE polymorphic `reports` table keyed by (target_type, target_id) instead
 *     of a table-per-entity. Cheap to extend to new entity types — add a value
 *     to the `report_target_type` enum, a branch in `report_target_church()`,
 *     and seed rows in `report_reasons`.
 *   • A `report_reasons` lookup table (keyed by target_type) drives the in-app
 *     reason chooser. Labels are localized jsonb {"am": "...", "en": "..."} with
 *     Amharic REQUIRED — same convention as fasting_periods / *_categories.
 *   • A PARTIAL UNIQUE index enforces "one ACTIVE report per
 *     (reporter, target_type, target_id)" (active = pending|reviewing). This is
 *     what powers the "you already reported this — edit or remove it" UX while
 *     still letting a user file a fresh report after an old one is resolved.
 *   • Self-reporting guard: a manager / editor / contributor of the church that
 *     OWNS the reported entity may NOT report it. Enforced in the INSERT policy
 *     via SECURITY DEFINER helper `can_report_target()` which builds on the
 *     existing `is_content_creator()` role helper (true for app_role
 *     contributor/editor/manager).
 *   • Optional notification: a new `report_submitted` notification_type +
 *     AFTER INSERT trigger notifies the owning church's admins, reusing the
 *     existing `create_notification()` / `get_church_admin_ids()` pipeline and a
 *     new `user_preferences.notify_reports` toggle.
 *
 * Reuses existing helpers (defined in earlier migrations):
 *   public.is_super_admin(uuid)
 *   public.is_church_admin(uuid, uuid)
 *   public.is_content_creator(uuid, uuid)
 *   public.update_updated_at()                 -- shared updated_at touch trigger
 *   public.create_notification(...)            -- notification + push pipeline
 *   public.get_church_admin_ids(uuid)          -- church_admin + content_admin ids
 *
 * Tables referenced for ownership resolution (church_id columns confirmed):
 *   public.events(id, church_id)
 *   public.donation_campaigns(id, church_id)   -- the "donation" / campaign target
 *   public.content_items(id, church_id)        -- teachings: video/short/audio/article/story/room
 *   public.churches(id)
 *
 * Author: System
 * Date: 2026-06-22
 */

-- ============================================================================
-- 0. EXTENSIONS
--    gen_random_uuid() ships with pgcrypto (enabled by default on Supabase).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================================
-- 1. ENUMS
--    Guarded with DO ... EXCEPTION WHEN duplicate_object so the migration is
--    idempotent (safe to re-run on a database that already has the type).
-- ============================================================================

-- What kind of entity a report points at. Extend here to support new types.
DO $$ BEGIN
  CREATE TYPE public.report_target_type AS ENUM (
    'event',     -- public.events
    'donation',  -- public.donation_campaigns (campaign)
    'content',   -- public.content_items (video/short/audio/article/story/room)
    'church'     -- public.churches
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
COMMENT ON TYPE public.report_target_type IS
  'Polymorphic entity kinds that can be reported. target_id points at the matching table PK.';

-- Moderation workflow status. Defaults to 'pending'.
DO $$ BEGIN
  CREATE TYPE public.report_status AS ENUM (
    'pending',      -- newly filed, untouched
    'reviewing',    -- a reviewer has picked it up
    'resolved',     -- reviewed and closed (issue confirmed/fixed)
    'dismissed',    -- reviewed and closed (no action warranted)
    'action_taken'  -- reviewed and closed AND the entity was actioned (removed/edited)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
COMMENT ON TYPE public.report_status IS
  'Lifecycle of a report. Active = pending|reviewing; the rest are terminal/resolved states.';


-- ============================================================================
-- 2. TABLE: report_reasons  (lookup: valid reasons per target_type)
-- ----------------------------------------------------------------------------
-- The app fetches rows for a given target_type to render the reason chooser.
-- (target_type, reason_key) is the natural key referenced by reports via a
-- composite FK, which guarantees a report's reason is valid for its target.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.report_reasons (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type  public.report_target_type NOT NULL,

  -- Stable machine key the app references, e.g. 'fraud', 'inappropriate'.
  reason_key   text NOT NULL,

  -- Localized label. Amharic ("am") is REQUIRED. May also carry en/ti/or.
  label        jsonb NOT NULL,
  -- Optional localized helper/description text shown under the label.
  description  jsonb,

  -- Display ordering in the chooser.
  sort_order   int  NOT NULL DEFAULT 0,
  -- Soft-disable a reason without deleting it.
  is_active    boolean NOT NULL DEFAULT true,

  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  -- Natural key referenced by reports(target_type, reason_key).
  CONSTRAINT report_reasons_unique UNIQUE (target_type, reason_key),
  -- Multi-language convention: Amharic label is mandatory.
  CONSTRAINT report_reasons_label_has_am CHECK (label ? 'am')
);
COMMENT ON TABLE public.report_reasons IS
  'Per-target-type catalog of report reasons. Drives the in-app reason chooser.';
COMMENT ON COLUMN public.report_reasons.reason_key IS
  'Stable machine key, unique within a target_type; referenced by reports.reason_key.';
COMMENT ON COLUMN public.report_reasons.label IS
  'Localized jsonb label; "am" (Amharic) is required (enforced by CHECK).';


-- ============================================================================
-- 3. TABLE: reports  (the polymorphic report queue)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who filed it. RLS pins this to auth.uid() on INSERT.
  reporter_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Polymorphic target. There is intentionally NO real FK on target_id because
  -- it can point at several tables; existence is validated by can_report_target()
  -- on INSERT (it returns false when the target/owning church does not exist).
  target_type     public.report_target_type NOT NULL,
  target_id       uuid NOT NULL,

  -- The chosen reason. Composite FK below guarantees it is valid for target_type.
  reason_key      text NOT NULL,
  -- Free-form reporter note.
  description     text,

  status          public.report_status NOT NULL DEFAULT 'pending',

  -- Resolution metadata, set by a reviewer when closing the report.
  resolved_by     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at     timestamptz,
  resolution_note text,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  -- Reason must exist for this target type.
  CONSTRAINT reports_reason_fk
    FOREIGN KEY (target_type, reason_key)
    REFERENCES public.report_reasons (target_type, reason_key)
    ON UPDATE CASCADE,

  -- Resolution fields may only be present once the report is in a closed state.
  CONSTRAINT reports_resolution_consistency CHECK (
    status IN ('resolved', 'dismissed', 'action_taken')
    OR (resolved_at IS NULL AND resolved_by IS NULL AND resolution_note IS NULL)
  )
);
COMMENT ON TABLE public.reports IS
  'User-filed content/moderation reports across polymorphic targets (event/donation/content/church).';
COMMENT ON COLUMN public.reports.target_id IS
  'PK of the reported row in the table implied by target_type. No FK (polymorphic); validated by can_report_target().';
COMMENT ON COLUMN public.reports.reason_key IS
  'FK (with target_type) into report_reasons; the reason the reporter selected.';
COMMENT ON COLUMN public.reports.status IS
  'Workflow state; defaults to pending. Active = pending|reviewing.';

-- One ACTIVE report per (reporter, target). A user may file again only after a
-- previous report is closed. This backs the "edit/remove your existing report"
-- UX: the app looks up the row matching this partial-unique key.
CREATE UNIQUE INDEX IF NOT EXISTS uq_reports_active_per_target
  ON public.reports (reporter_id, target_type, target_id)
  WHERE status IN ('pending', 'reviewing');


-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_reports_status
  ON public.reports (status);
-- Find all reports for a given entity (admin entity view, dup checks).
CREATE INDEX IF NOT EXISTS idx_reports_target
  ON public.reports (target_type, target_id);
-- "My reports" + reporter-scoped RLS lookups.
CREATE INDEX IF NOT EXISTS idx_reports_reporter
  ON public.reports (reporter_id);
-- Newest-first queue.
CREATE INDEX IF NOT EXISTS idx_reports_created_at
  ON public.reports (created_at DESC);
-- Chooser fetch by target type.
CREATE INDEX IF NOT EXISTS idx_report_reasons_target_type
  ON public.report_reasons (target_type);


-- ============================================================================
-- 5. updated_at TRIGGERS  (reuse the shared public.update_updated_at())
-- ============================================================================

DROP TRIGGER IF EXISTS trg_reports_set_updated_at ON public.reports;
CREATE TRIGGER trg_reports_set_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_report_reasons_set_updated_at ON public.report_reasons;
CREATE TRIGGER trg_report_reasons_set_updated_at
  BEFORE UPDATE ON public.report_reasons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================================================
-- 6. OWNERSHIP RESOLUTION + AUTHZ HELPERS (SECURITY DEFINER)
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER so they can read the owning tables regardless of the
-- caller's RLS, and search_path is pinned to '' (everything fully qualified)
-- exactly like the rest of the RBAC helpers.
-- ============================================================================

-- Resolve the church that OWNS a reported target. NULL if the target does not
-- exist (or the type has no owning church). Extend the CASE for new types.
CREATE OR REPLACE FUNCTION public.report_target_church(
  p_target_type public.report_target_type,
  p_target_id   uuid
) RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_church uuid;
BEGIN
  IF p_target_id IS NULL THEN
    RETURN NULL;
  END IF;

  CASE p_target_type
    WHEN 'event' THEN
      SELECT church_id INTO v_church FROM public.events            WHERE id = p_target_id;
    WHEN 'donation' THEN
      SELECT church_id INTO v_church FROM public.donation_campaigns WHERE id = p_target_id;
    WHEN 'content' THEN
      SELECT church_id INTO v_church FROM public.content_items      WHERE id = p_target_id;
    WHEN 'church' THEN
      SELECT id        INTO v_church FROM public.churches           WHERE id = p_target_id;
    ELSE
      v_church := NULL;
  END CASE;

  RETURN v_church;
END;
$$;
COMMENT ON FUNCTION public.report_target_church(public.report_target_type, uuid) IS
  'Returns the church_id that owns a reported target, or NULL if the target does not exist.';

-- Can p_user file a report against this target?
-- Rule: target must exist AND the user must NOT be staff (manager/editor/
-- contributor) of the owning church. Built on is_content_creator(), which is
-- true for app_role contributor/editor/manager (legacy content_creator/
-- content_admin/church_admin). Used by the INSERT policy WITH CHECK.
CREATE OR REPLACE FUNCTION public.can_report_target(
  p_user        uuid,
  p_target_type public.report_target_type,
  p_target_id   uuid
) RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_church uuid;
BEGIN
  IF p_user IS NULL OR p_target_id IS NULL THEN
    RETURN false;
  END IF;

  v_church := public.report_target_church(p_target_type, p_target_id);

  -- Cannot report something that does not exist.
  IF v_church IS NULL THEN
    RETURN false;
  END IF;

  -- Staff of the owning church may not report their own church's entity.
  IF public.is_content_creator(p_user, v_church) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;
COMMENT ON FUNCTION public.can_report_target(uuid, public.report_target_type, uuid) IS
  'INSERT guard: true only if the target exists and the user is NOT a manager/editor/contributor of the owning church (self-report prevention).';

-- Can p_user review/moderate reports for this target?
-- Super admins: everything. Church managers (church_admin): only reports for
-- entities owned by their church. Used by SELECT/UPDATE reviewer policies.
CREATE OR REPLACE FUNCTION public.can_review_report(
  p_user        uuid,
  p_target_type public.report_target_type,
  p_target_id   uuid
) RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_church uuid;
BEGIN
  IF p_user IS NULL THEN
    RETURN false;
  END IF;

  -- Super admins moderate everything.
  IF public.is_super_admin(p_user) THEN
    RETURN true;
  END IF;

  -- Managers moderate only their own church's entities (multi-tenant scoping).
  v_church := public.report_target_church(p_target_type, p_target_id);
  IF v_church IS NULL THEN
    RETURN false;
  END IF;

  RETURN public.is_church_admin(p_user, v_church);
END;
$$;
COMMENT ON FUNCTION public.can_review_report(uuid, public.report_target_type, uuid) IS
  'Reviewer guard: true for super admins (all reports) or the church_admin/manager of the report target''s owning church.';

-- Helpers are called by RLS for the CURRENT authenticated user.
GRANT EXECUTE ON FUNCTION public.report_target_church(public.report_target_type, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_report_target(uuid, public.report_target_type, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_review_report(uuid, public.report_target_type, uuid) TO authenticated;


-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_reasons ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 7a. report_reasons: public read, super-admin write
--     (mirrors the event_categories / donation_categories / fasting pattern)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Report reasons are viewable by everyone" ON public.report_reasons;
CREATE POLICY "Report reasons are viewable by everyone"
  ON public.report_reasons FOR SELECT
  TO anon, authenticated
  USING ( true );

DROP POLICY IF EXISTS "Super admins can insert report reasons" ON public.report_reasons;
CREATE POLICY "Super admins can insert report reasons"
  ON public.report_reasons FOR INSERT
  TO authenticated
  WITH CHECK ( (select public.is_super_admin((select auth.uid()))) );

DROP POLICY IF EXISTS "Super admins can update report reasons" ON public.report_reasons;
CREATE POLICY "Super admins can update report reasons"
  ON public.report_reasons FOR UPDATE
  TO authenticated
  USING ( (select public.is_super_admin((select auth.uid()))) )
  WITH CHECK ( (select public.is_super_admin((select auth.uid()))) );

DROP POLICY IF EXISTS "Super admins can delete report reasons" ON public.report_reasons;
CREATE POLICY "Super admins can delete report reasons"
  ON public.report_reasons FOR DELETE
  TO authenticated
  USING ( (select public.is_super_admin((select auth.uid()))) );

-- ----------------------------------------------------------------------------
-- 7b. reports
--     INSERT  : authenticated, must be self + pass can_report_target()
--     SELECT  : own reports OR reports you may review (manager/super admin)
--     UPDATE  : reporter may edit own report WHILE pending (cannot self-resolve);
--               reviewers may update status/resolution
--     DELETE  : reporter may remove own report; super admins may remove any
-- ----------------------------------------------------------------------------

-- INSERT: only file as yourself, and only if allowed to report this target.
DROP POLICY IF EXISTS "Users can file their own reports" ON public.reports;
CREATE POLICY "Users can file their own reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (
    reporter_id = (select auth.uid())
    AND public.can_report_target((select auth.uid()), target_type, target_id)
  );

-- SELECT: your own reports, plus everything you are allowed to moderate.
DROP POLICY IF EXISTS "Users see own reports, reviewers see reviewable" ON public.reports;
CREATE POLICY "Users see own reports, reviewers see reviewable"
  ON public.reports FOR SELECT
  TO authenticated
  USING (
    reporter_id = (select auth.uid())
    OR public.can_review_report((select auth.uid()), target_type, target_id)
  );

-- UPDATE (reporter): edit your OWN report only while it is still 'pending'.
-- WITH CHECK keeps it yours and keeps status 'pending' so a reporter can never
-- mark their own report resolved/dismissed.
DROP POLICY IF EXISTS "Reporters can edit their own pending report" ON public.reports;
CREATE POLICY "Reporters can edit their own pending report"
  ON public.reports FOR UPDATE
  TO authenticated
  USING ( reporter_id = (select auth.uid()) AND status = 'pending' )
  WITH CHECK ( reporter_id = (select auth.uid()) AND status = 'pending' );

-- UPDATE (reviewer): managers/super admins manage status + resolution.
DROP POLICY IF EXISTS "Reviewers can update report status" ON public.reports;
CREATE POLICY "Reviewers can update report status"
  ON public.reports FOR UPDATE
  TO authenticated
  USING ( public.can_review_report((select auth.uid()), target_type, target_id) )
  WITH CHECK ( public.can_review_report((select auth.uid()), target_type, target_id) );

-- DELETE: a reporter can remove their own report; super admins can remove any.
DROP POLICY IF EXISTS "Reporters and super admins can delete reports" ON public.reports;
CREATE POLICY "Reporters and super admins can delete reports"
  ON public.reports FOR DELETE
  TO authenticated
  USING (
    reporter_id = (select auth.uid())
    OR (select public.is_super_admin((select auth.uid())))
  );


-- ============================================================================
-- 8. OPTIONAL NOTIFICATION: notify owning-church admins on a new report
--    Reuses create_notification() + get_church_admin_ids(). A new enum value
--    and a per-user preference toggle are added the same way the rest of the
--    notification system does it.
--
--    NOTE on the enum: a value added by ALTER TYPE ... ADD VALUE cannot be used
--    as a *literal that is evaluated* in the same transaction, but it is safe to
--    reference inside a plpgsql function BODY (parsed lazily at call time). This
--    is the exact pattern used by 20250220000001_create_notification_triggers.
-- ============================================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
     WHERE enumlabel = 'report_submitted'
       AND enumtypid = 'public.notification_type'::regtype
  ) THEN
    ALTER TYPE public.notification_type ADD VALUE 'report_submitted';
  END IF;
END $$;

-- Per-user opt-out for moderation pings (default on, like other categories).
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS notify_reports boolean NOT NULL DEFAULT true;
COMMENT ON COLUMN public.user_preferences.notify_reports IS
  'Opt-in for "a new report needs review" pushes to church admins (default on).';

-- Trigger function: on a new report, ping the owning church's admins.
CREATE OR REPLACE FUNCTION public.trg_notify_report_submitted()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_church uuid;
  v_admin  uuid;
  v_title  jsonb;
  v_body   jsonb;
  v_data   jsonb;
BEGIN
  v_church := public.report_target_church(NEW.target_type, NEW.target_id);
  IF v_church IS NULL THEN
    RETURN NEW;
  END IF;

  v_title := jsonb_build_object('en', 'New Report', 'am', 'አዲስ ሪፖርት');
  v_body  := jsonb_build_object(
    'en', 'A ' || NEW.target_type::text || ' was reported and needs review',
    'am', 'አንድ ' || NEW.target_type::text || ' ሪፖርት ተደርጓል፤ ግምገማ ያስፈልጋል'
  );
  v_data := jsonb_build_object(
    'type',        'report_submitted',
    'report_id',   NEW.id,
    'target_type', NEW.target_type::text,
    'target_id',   NEW.target_id,
    'church_id',   v_church,
    'reason_key',  NEW.reason_key
  );

  FOR v_admin IN SELECT * FROM public.get_church_admin_ids(v_church)
  LOOP
    IF v_admin <> NEW.reporter_id THEN
      PERFORM public.create_notification(
        v_admin, 'report_submitted', v_title, v_body, v_data, 'notify_reports'
      );
    END IF;
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[trg_notify_report_submitted] %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_report_submitted ON public.reports;
CREATE TRIGGER trg_notify_report_submitted
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_report_submitted();


-- ============================================================================
-- 9. SEED: report_reasons per target type
--    Idempotent: ON CONFLICT (target_type, reason_key) refreshes the labels so
--    re-running the migration keeps wording in sync.
-- ============================================================================

INSERT INTO public.report_reasons (target_type, reason_key, label, sort_order) VALUES
  -- DONATION / campaign --------------------------------------------------------
  ('donation', 'false_donation', '{"am": "ሐሰተኛ ልገሳ",   "en": "Not a real donation"}'::jsonb, 10),
  ('donation', 'fraud',          '{"am": "ማጭበርበር",      "en": "Fraud / scam"}'::jsonb,         20),
  ('donation', 'misleading',     '{"am": "አሳሳች መረጃ",    "en": "Misleading"}'::jsonb,            30),
  ('donation', 'duplicate',      '{"am": "ድግግሞሽ",       "en": "Duplicate"}'::jsonb,             40),

  -- EVENT ----------------------------------------------------------------------
  ('event', 'inappropriate', '{"am": "ተገቢ ያልሆነ",        "en": "Inappropriate"}'::jsonb,             10),
  ('event', 'wrong_info',    '{"am": "የተሳሳተ መረጃ",       "en": "Wrong information"}'::jsonb,          20),
  ('event', 'spam',          '{"am": "አይፈለጌ መልዕክት",     "en": "Spam"}'::jsonb,                       30),
  ('event', 'cancelled',     '{"am": "ተሰርዟል / አይካሄድም",  "en": "Cancelled / not happening"}'::jsonb,  40),

  -- CONTENT (teachings) --------------------------------------------------------
  ('content', 'inappropriate',  '{"am": "ተገቢ ያልሆነ",     "en": "Inappropriate"}'::jsonb,        10),
  ('content', 'copyright',      '{"am": "የቅጂ መብት ጥሰት",  "en": "Copyright violation"}'::jsonb,   20),
  ('content', 'misinformation', '{"am": "የተሳሳተ መረጃ",    "en": "Misinformation"}'::jsonb,        30),
  ('content', 'spam',           '{"am": "አይፈለጌ መልዕክት",  "en": "Spam"}'::jsonb,                  40),
  ('content', 'offensive',      '{"am": "አሰዳቢ",         "en": "Offensive"}'::jsonb,             50),

  -- CHURCH (extensible) --------------------------------------------------------
  ('church', 'inappropriate', '{"am": "ተገቢ ያልሆነ",    "en": "Inappropriate"}'::jsonb,     10),
  ('church', 'wrong_info',    '{"am": "የተሳሳተ መረጃ",   "en": "Wrong information"}'::jsonb,  20),
  ('church', 'fraud',         '{"am": "ማጭበርበር",      "en": "Fraud / scam"}'::jsonb,       30),
  ('church', 'spam',          '{"am": "አይፈለጌ መልዕክት", "en": "Spam"}'::jsonb,               40)
ON CONFLICT (target_type, reason_key) DO UPDATE
  SET label      = EXCLUDED.label,
      sort_order = EXCLUDED.sort_order,
      is_active  = true,
      updated_at = now();
