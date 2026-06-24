-- Add verification and rejection tracking columns to donation_campaigns table

ALTER TABLE public.donation_campaigns
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- Add comments
COMMENT ON COLUMN public.donation_campaigns.verified_at IS 'Timestamp when the campaign was approved/rejected by an admin';
COMMENT ON COLUMN public.donation_campaigns.verified_by IS 'Admin user who approved/rejected the campaign';
COMMENT ON COLUMN public.donation_campaigns.rejected_reason IS 'Reason for rejection if status is cancelled';

-- Add index for verified_by for faster lookups
CREATE INDEX IF NOT EXISTS idx_donation_campaigns_verified_by ON public.donation_campaigns(verified_by);

