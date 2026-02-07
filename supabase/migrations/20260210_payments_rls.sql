-- ============================================================
-- RLS for payments and church_payment_methods tables
-- Allows admins to view all payment transactions
-- ============================================================

-- ==================== PAYMENTS ====================
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view all payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ==================== CHURCH PAYMENT METHODS ====================
ALTER TABLE public.church_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all church payment methods"
  ON public.church_payment_methods
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view all church payment methods"
  ON public.church_payment_methods
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
