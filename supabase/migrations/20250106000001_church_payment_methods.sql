-- Create table to link payment methods (bank accounts + gateways) to churches
CREATE TABLE IF NOT EXISTS public.church_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('bank_account', 'payment_gateway')),
    bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
    payment_gateway_id UUID REFERENCES public.payment_gateways(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT payment_method_reference_check CHECK (
        (payment_type = 'bank_account' AND bank_account_id IS NOT NULL AND payment_gateway_id IS NULL) OR
        (payment_type = 'payment_gateway' AND payment_gateway_id IS NOT NULL AND bank_account_id IS NULL)
    )
);

-- Create table to link payment methods to donation campaigns
CREATE TABLE IF NOT EXISTS public.campaign_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.donation_campaigns(id) ON DELETE CASCADE,
    church_payment_method_id UUID NOT NULL REFERENCES public.church_payment_methods(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(campaign_id, church_payment_method_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_church_payment_methods_church_id ON public.church_payment_methods(church_id);
CREATE INDEX IF NOT EXISTS idx_church_payment_methods_active ON public.church_payment_methods(church_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_campaign_payment_methods_campaign_id ON public.campaign_payment_methods(campaign_id);

-- Update payments table to track which payment method was used
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS church_payment_method_id UUID REFERENCES public.church_payment_methods(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.church_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for church_payment_methods
CREATE POLICY "Anyone can view active church payment methods"
    ON public.church_payment_methods
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Church admins can manage payment methods"
    ON public.church_payment_methods
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND church_id = church_payment_methods.church_id
            AND role IN ('church_admin', 'super_admin')
        )
    );

-- RLS Policies for campaign_payment_methods
CREATE POLICY "Anyone can view campaign payment methods"
    ON public.campaign_payment_methods
    FOR SELECT
    USING (true);

CREATE POLICY "Content admins can manage campaign payment methods"
    ON public.campaign_payment_methods
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.donation_campaigns dc
            JOIN public.user_roles ur ON ur.church_id = dc.church_id
            WHERE dc.id = campaign_payment_methods.campaign_id
            AND ur.user_id = auth.uid()
            AND ur.role IN ('content_admin', 'church_admin', 'super_admin')
        )
    );

-- Add comments
COMMENT ON TABLE public.church_payment_methods IS 'Links payment methods (bank accounts or payment gateways) to churches';
COMMENT ON TABLE public.campaign_payment_methods IS 'Links available payment methods to specific donation campaigns';

