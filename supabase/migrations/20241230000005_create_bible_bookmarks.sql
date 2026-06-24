-- Create Bible Bookmarks table
CREATE TABLE IF NOT EXISTS public.bible_bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verse_id UUID REFERENCES public.bible_verses(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.bible_books(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES public.bible_chapters(id) ON DELETE CASCADE NOT NULL,
  note TEXT, -- Optional personal note
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, verse_id)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_bible_bookmarks_user_id ON public.bible_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bible_bookmarks_verse_id ON public.bible_bookmarks(verse_id);

-- Enable RLS
ALTER TABLE public.bible_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies - users can only see and manage their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bible_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON public.bible_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON public.bible_bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.bible_bookmarks
  FOR DELETE USING (auth.uid() = user_id);
