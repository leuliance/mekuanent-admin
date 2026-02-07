-- ============================================================
-- Migration: Add admin/super_admin RLS policies for all tables
-- needed by the admin panel.
--
-- Covers: events, donations, donation_campaigns,
--         payment_gateways, feature_flags, notifications,
--         event_rsvps, event_co_hosts, profiles (self-update),
--         event_categories, donation_categories
-- ============================================================

-- ==================== EVENTS ====================
CREATE POLICY "Super admins have full access to events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins have full access to events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ==================== DONATIONS ====================
CREATE POLICY "Super admins can view all donations"
  ON public.donations
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view all donations"
  ON public.donations
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==================== DONATION CAMPAIGNS ====================
CREATE POLICY "Super admins have full access to donation campaigns"
  ON public.donation_campaigns
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins have full access to donation campaigns"
  ON public.donation_campaigns
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ==================== PAYMENT GATEWAYS ====================
-- Enable RLS if not already enabled
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins have full access to payment gateways"
  ON public.payment_gateways
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view and update payment gateways"
  ON public.payment_gateways
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ==================== FEATURE FLAGS ====================
-- Enable RLS if not already enabled
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins have full access to feature flags"
  ON public.feature_flags
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins have full access to feature flags"
  ON public.feature_flags
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ==================== NOTIFICATIONS ====================
-- Enable RLS if not already enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage all notifications"
  ON public.notifications
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can manage all notifications"
  ON public.notifications
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ==================== EVENT RSVPS ====================
CREATE POLICY "Super admins can view all event rsvps"
  ON public.event_rsvps
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view all event rsvps"
  ON public.event_rsvps
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==================== EVENT CO-HOSTS ====================
CREATE POLICY "Super admins can manage event co-hosts"
  ON public.event_co_hosts
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view event co-hosts"
  ON public.event_co_hosts
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==================== EVENT CATEGORIES ====================
CREATE POLICY "Super admins have full access to event categories"
  ON public.event_categories
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins have full access to event categories"
  ON public.event_categories
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Anyone can view categories
CREATE POLICY "Everyone can view event categories"
  ON public.event_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ==================== DONATION CATEGORIES ====================
CREATE POLICY "Super admins have full access to donation categories"
  ON public.donation_categories
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins have full access to donation categories"
  ON public.donation_categories
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Anyone can view categories
CREATE POLICY "Everyone can view donation categories"
  ON public.donation_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ==================== PROFILES (self-update) ====================
-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can view all profiles (needed for donation/event donor info)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin(auth.uid()));
