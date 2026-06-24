-- Create content_likes table to track user likes
CREATE TABLE IF NOT EXISTS content_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, user_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_likes_content_id ON content_likes(content_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_user_id ON content_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_created_at ON content_likes(created_at DESC);

-- Enable RLS
ALTER TABLE content_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view all likes
CREATE POLICY "Anyone can view likes"
    ON content_likes
    FOR SELECT
    USING (true);

-- Users can insert their own likes
CREATE POLICY "Users can insert their own likes"
    ON content_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
    ON content_likes
    FOR DELETE
    USING (auth.uid() = user_id);
