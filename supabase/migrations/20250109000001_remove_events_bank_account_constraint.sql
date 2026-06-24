-- Remove bank_account_id column from events table
-- Events will use the church's bank accounts through church_payment_methods table instead

-- First, drop the constraint that requires bank_account_id when has_donation is true
ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_donation_bank_required;

-- Then drop the bank_account_id column entirely
ALTER TABLE public.events
DROP COLUMN IF EXISTS bank_account_id;
