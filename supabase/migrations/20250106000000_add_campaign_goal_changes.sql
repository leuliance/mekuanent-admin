-- Create table to track donation campaign goal changes
CREATE TABLE IF NOT EXISTS public.campaign_goal_changes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.donation_campaigns(id) ON DELETE CASCADE,
    old_goal_amount NUMERIC(15, 2) NOT NULL,
    new_goal_amount NUMERIC(15, 2) NOT NULL,
    reason JSONB NOT NULL,
    changed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaign_goal_changes_campaign_id ON public.campaign_goal_changes(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_goal_changes_changed_at ON public.campaign_goal_changes(changed_at DESC);

-- Enable RLS
ALTER TABLE public.campaign_goal_changes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view goal changes
CREATE POLICY "Anyone can view goal changes"
    ON public.campaign_goal_changes
    FOR SELECT
    USING (true);

-- Policy: Only content admins and creators can insert goal changes
CREATE POLICY "Content admins and creators can insert goal changes"
    ON public.campaign_goal_changes
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('content_admin', 'content_creator', 'church_admin')
        )
    );

-- Add comment
COMMENT ON TABLE public.campaign_goal_changes IS 'Tracks changes to donation campaign goal amounts with reasons';

