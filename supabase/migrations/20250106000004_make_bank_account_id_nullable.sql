-- Make bank_account_id nullable in donation_campaigns table
-- Churches now use payment methods configured separately

ALTER TABLE public.donation_campaigns
ALTER COLUMN bank_account_id DROP NOT NULL;

-- Add comment explaining the field is deprecated
COMMENT ON COLUMN public.donation_campaigns.bank_account_id IS 'Deprecated: Use church_payment_methods instead. Kept for backward compatibility.';

