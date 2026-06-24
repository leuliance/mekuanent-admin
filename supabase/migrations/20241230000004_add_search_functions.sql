-- Create function to search bible books across all languages
CREATE OR REPLACE FUNCTION search_bible_books(search_query TEXT)
RETURNS TABLE (
  id UUID,
  name JSONB,
  testament JSONB,
  book_number INTEGER,
  chapter_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.testament,
    b.book_number,
    b.chapter_count
  FROM bible_books b
  WHERE 
    LOWER(b.name->>'en') LIKE '%' || search_query || '%' OR
    LOWER(b.name->>'am') LIKE '%' || search_query || '%' OR
    LOWER(b.name->>'or') LIKE '%' || search_query || '%' OR
    LOWER(b.name->>'ti') LIKE '%' || search_query || '%' OR
    LOWER(b.name->>'so') LIKE '%' || search_query || '%'
  ORDER BY b.book_number
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Create function to search bible verses across all languages
CREATE OR REPLACE FUNCTION search_bible_verses_text(search_query TEXT)
RETURNS TABLE (
  verse_id UUID,
  chapter_id UUID,
  verse_number INTEGER,
  text JSONB,
  book_id UUID,
  book_name JSONB,
  testament JSONB,
  book_number INTEGER,
  chapter_count INTEGER,
  chapter_number INTEGER,
  verse_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id AS verse_id,
    v.chapter_id,
    v.verse_number,
    v.text,
    b.id AS book_id,
    b.name AS book_name,
    b.testament,
    b.book_number,
    b.chapter_count,
    c.chapter_number,
    c.verse_count
  FROM bible_verses v
  INNER JOIN bible_chapters c ON v.chapter_id = c.id
  INNER JOIN bible_books b ON c.book_id = b.id
  WHERE 
    LOWER(v.text->>'en') LIKE '%' || search_query || '%' OR
    LOWER(v.text->>'am') LIKE '%' || search_query || '%' OR
    LOWER(v.text->>'or') LIKE '%' || search_query || '%' OR
    LOWER(v.text->>'ti') LIKE '%' || search_query || '%' OR
    LOWER(v.text->>'so') LIKE '%' || search_query || '%'
  ORDER BY b.book_number, c.chapter_number, v.verse_number
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
