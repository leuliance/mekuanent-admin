-- ============================================================================
-- REVERT: 20260609000005_bible_reader_redesign.sql
-- ============================================================================
-- Restores the pre-redesign Bible schema:
--   * drops bible_chapters.content
--   * recreates bible_translations (+ seed) and bible_bookmark_collections
--     (+ bible_bookmarks.collection_id)
--   * removes the seeded Mark 1 chapter (cascades its verses / footnotes /
--     cross refs). Genesis `content` is removed with the dropped column.
-- ============================================================================

-- 1. Remove the seeded Mark 1 chapter (cascades verses/footnotes/cross refs) -
delete from public.bible_chapters c
using public.bible_books b
where c.book_id = b.id and b.paratext_code = 'MRK' and c.chapter_number = 1;

-- 2. Drop the content column ------------------------------------------------
alter table public.bible_chapters drop column if exists content;

-- 3. Recreate bible_translations + seed -------------------------------------
create table if not exists public.bible_translations (
    id          uuid primary key default gen_random_uuid(),
    code        text unique not null,
    name        jsonb not null,
    script      text not null,
    is_default  boolean not null default false,
    created_at  timestamptz not null default now()
);
alter table public.bible_translations enable row level security;
drop policy if exists "bible_translations public read" on public.bible_translations;
create policy "bible_translations public read"
    on public.bible_translations for select using (true);

insert into public.bible_translations (code, name, script, is_default) values
    ('am',  '{"am":"አማርኛ","en":"Amharic"}',   'ethiopic', true),
    ('gez', '{"am":"ግዕዝ","en":"Geez"}',        'ethiopic', false),
    ('en',  '{"am":"እንግሊዝኛ","en":"English"}',  'latin',    false),
    ('ti',  '{"am":"ትግርኛ","en":"Tigrinya"}',   'ethiopic', false),
    ('or',  '{"am":"ኦሮምኛ","en":"Oromo"}',      'latin',    false)
on conflict (code) do nothing;

-- 4. Recreate bible_bookmark_collections + bookmarks.collection_id ----------
create table if not exists public.bible_bookmark_collections (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    name        text not null,
    color       text not null default '#F59E0B',
    sort_order  int not null default 0,
    created_at  timestamptz not null default now()
);
alter table public.bible_bookmark_collections enable row level security;
drop policy if exists "bible_bookmark_collections owner" on public.bible_bookmark_collections;
create policy "bible_bookmark_collections owner"
    on public.bible_bookmark_collections for all
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

alter table public.bible_bookmarks
    add column if not exists collection_id uuid
    references public.bible_bookmark_collections(id) on delete set null;
