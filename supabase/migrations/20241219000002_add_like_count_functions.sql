-- Add functions to increment and decrement like count atomically

CREATE OR REPLACE FUNCTION increment_like_count(content_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE content_items
    SET like_count = COALESCE(like_count, 0) + 1,
        updated_at = NOW()
    WHERE id = content_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_like_count(content_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE content_items
    SET like_count = GREATEST(COALESCE(like_count, 0) - 1, 0),
        updated_at = NOW()
    WHERE id = content_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
