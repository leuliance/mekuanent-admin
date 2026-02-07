-- ============================================================
-- Scalable broadcast notifications
-- 
-- Instead of inserting 1 row per user for broadcast messages,
-- we insert 1 row with user_id = NULL (means "for everyone").
-- 
-- Client app queries: WHERE user_id = auth.uid() OR user_id IS NULL
-- Read tracking: separate notification_reads table
-- ============================================================

-- 1. Make user_id nullable (broadcast = NULL, targeted = specific user)
ALTER TABLE public.notifications
  ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add sent_by to track which admin sent it
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS sent_by uuid REFERENCES public.profiles(id) DEFAULT NULL;

-- 3. Add is_broadcast flag for easy filtering
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS is_broadcast boolean NOT NULL DEFAULT false;

-- 4. Index for broadcast queries
CREATE INDEX IF NOT EXISTS idx_notifications_broadcast 
  ON public.notifications(is_broadcast) WHERE is_broadcast = true;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_null
  ON public.notifications(created_at DESC) WHERE user_id IS NULL;

-- 5. Notification reads table (tracks which users read broadcast notifications)
CREATE TABLE IF NOT EXISTS public.notification_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(notification_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_reads_user 
  ON public.notification_reads(user_id);

CREATE INDEX IF NOT EXISTS idx_notification_reads_notification 
  ON public.notification_reads(notification_id);

ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Users can read/insert their own read receipts
CREATE POLICY "Users can manage own read receipts"
  ON public.notification_reads
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can view all read receipts
CREATE POLICY "Admins can view all read receipts"
  ON public.notification_reads
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()) OR public.is_super_admin(auth.uid()));

-- 6. Update existing RLS: users should also see broadcasts (user_id IS NULL)
-- Drop the old user-only SELECT policy and recreate it
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can view own and broadcast notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);
