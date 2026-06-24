-- ============================================================================
-- Bible reader redesign: USFM-derived "readable book" content model
-- ============================================================================
-- Goal: render the Bible like a real printed book (flowing paragraphs, poetry,
-- section headings, words of Jesus, inline footnote/cross-ref markers) instead
-- of a verse-card list, while keeping verse-level rows so users can bookmark /
-- highlight / note an individual verse, and keeping footnotes + cross refs.
--
-- What changes:
--   * DROP bible_translations          (unused — app hardcodes am/en)
--   * DROP bible_bookmark_collections  (unused) + bible_bookmarks.collection_id
--   * ADD  bible_chapters.content JSONB — the converted-from-USFM, render-ready
--          document, keyed by language: { "en": {blocks:[…]}, "am": {blocks:[…]} }
--   * Backfill `content` for every chapter that already has verses (Genesis),
--     building a flowing single-paragraph document straight from bible_verses
--     (real am/en data, no fabrication).
--   * Seed Mark 1 from the supplied USFM, fully converted to the readable
--     structure (major title, section headings, poetry, words of Jesus, an
--     inline footnote + a cross reference) in am + en — the showcase chapter.
--
-- Content block schema (per language: { "blocks": Block[] }):
--   Block =
--     | { kind:"major_title", level:1|2, text }      -- \mt
--     | { kind:"heading",     level:1|2, text }      -- \s
--     | { kind:"reference",   text }                 -- \r / \sr
--     | { kind:"paragraph",   style:"p"|"m"|"nb", content: Run[] }
--     | { kind:"poetry",      lines: { level:1|2, content: Run[] }[] }
--     | { kind:"blank" }
--   Run =
--     | { v:number }                                 -- verse-number marker
--     | { text:string, wj?:bool, nd?:bool, it?:bool } -- styled text span
--     | { note:{ marker, type:"footnote"|"cross_ref", text } } -- inline marker
--
-- bible_verses (plain text per lang) stays the anchor for bookmarks /
-- highlights / notes and the search index; the reader maps verse_number ->
-- verse_id from that list. bible_footnotes / bible_cross_references stay as
-- queryable rows anchored to a verse.
--
-- Reversible via `bible_reader_redesign_revert.sql`.
-- ============================================================================

-- 1. Drop the unused tables / column ----------------------------------------
alter table public.bible_bookmarks drop column if exists collection_id;
drop table if exists public.bible_bookmark_collections cascade;
drop table if exists public.bible_translations cascade;

-- 2. Add the render-ready content column ------------------------------------
alter table public.bible_chapters add column if not exists content jsonb;
comment on column public.bible_chapters.content is
    'Render-ready, USFM-derived document keyed by language: {"en":{"blocks":[…]},"am":{…}}. NULL = fall back to bible_verses.';

-- 3. Backfill flowing content for every chapter that already has verses ------
-- Builds one paragraph whose runs alternate { "v": n } and { "text": … } in
-- verse order, per language — the printed-book look, from existing data.
do $$
declare
    c      record;
    runs_en jsonb;
    runs_am jsonb;
begin
    for c in
        select ch.id
        from public.bible_chapters ch
        where exists (
            select 1 from public.bible_verses bv where bv.chapter_id = ch.id
        )
    loop
        select jsonb_agg(e order by ord) into runs_en
        from public.bible_verses bv
        cross join lateral (values
            (bv.verse_number * 2 - 1, jsonb_build_object('v', bv.verse_number)),
            (bv.verse_number * 2,     jsonb_build_object('text', bv.text ->> 'en'))
        ) as x(ord, e)
        where bv.chapter_id = c.id
          and coalesce(bv.text ->> 'en', '') <> '';

        select jsonb_agg(e order by ord) into runs_am
        from public.bible_verses bv
        cross join lateral (values
            (bv.verse_number * 2 - 1, jsonb_build_object('v', bv.verse_number)),
            (bv.verse_number * 2,     jsonb_build_object('text', bv.text ->> 'am'))
        ) as x(ord, e)
        where bv.chapter_id = c.id
          and coalesce(bv.text ->> 'am', '') <> '';

        update public.bible_chapters ch
        set content = jsonb_strip_nulls(jsonb_build_object(
            'en', case when runs_en is not null then
                jsonb_build_object('blocks', jsonb_build_array(
                    jsonb_build_object('kind', 'paragraph', 'style', 'p', 'content', runs_en)
                )) end,
            'am', case when runs_am is not null then
                jsonb_build_object('blocks', jsonb_build_array(
                    jsonb_build_object('kind', 'paragraph', 'style', 'p', 'content', runs_am)
                )) end
        ))
        where ch.id = c.id;
    end loop;
end $$;

-- 4. Showcase: Mark 1 converted from USFM -----------------------------------
-- 4a. Chapter row with the rich, render-ready content (am + en).
insert into public.bible_chapters (book_id, chapter_number, verse_count, content)
select b.id, 1, 11,
$json$
{
  "en": { "blocks": [
    { "kind": "major_title", "level": 2, "text": "The Gospel According to Mark" },
    { "kind": "heading", "level": 1, "text": "The Mission of John the Baptist" },
    { "kind": "paragraph", "style": "p", "content": [
      { "v": 1 }, { "text": "The beginning of the good news about Jesus Christ, the Son of God," },
      { "v": 2 }, { "text": "as it is written in Isaiah the prophet:" }
    ] },
    { "kind": "poetry", "lines": [
      { "level": 1, "content": [ { "text": "“I will send my messenger ahead of you," } ] },
      { "level": 2, "content": [ { "text": "who will prepare your way”" }, { "note": { "marker": "a", "type": "footnote", "text": "Malachi 3:1" } }, { "text": "—" } ] },
      { "level": 1, "content": [ { "v": 3 }, { "text": "“a voice of one calling in the wilderness," } ] },
      { "level": 2, "content": [ { "text": "‘Prepare the way for the Lord," } ] },
      { "level": 2, "content": [ { "text": "make straight paths for him.’”" } ] }
    ] },
    { "kind": "paragraph", "style": "p", "content": [
      { "v": 4 }, { "text": "And so John the Baptist appeared in the wilderness, preaching a baptism of repentance for the forgiveness of sins." },
      { "v": 5 }, { "text": "The whole Judean countryside and all the people of Jerusalem went out to him. Confessing their sins, they were baptized by him in the Jordan River." }
    ] },
    { "kind": "heading", "level": 1, "text": "The Baptism and Testing of Jesus" },
    { "kind": "paragraph", "style": "p", "content": [
      { "v": 9 }, { "text": "At that time Jesus came from Nazareth in Galilee and was baptized by John in the Jordan." },
      { "v": 10 }, { "text": "Just as Jesus was coming up out of the water, he saw heaven being torn open and the Spirit descending on him like a dove." },
      { "v": 11 }, { "text": "And a voice came from heaven: " }, { "text": "“You are my Son, whom I love; with you I am well pleased.”", "wj": true }
    ] }
  ] },
  "am": { "blocks": [
    { "kind": "major_title", "level": 2, "text": "የማርቆስ ወንጌል" },
    { "kind": "heading", "level": 1, "text": "የመጥምቁ ዮሐንስ ተልእኮ" },
    { "kind": "paragraph", "style": "p", "content": [
      { "v": 1 }, { "text": "የእግዚአብሔር ልጅ የኢየሱስ ክርስቶስ ወንጌል መጀመሪያ፤" },
      { "v": 2 }, { "text": "በነቢዩ በኢሳይያስ እንደ ተጻፈ፦" }
    ] },
    { "kind": "poetry", "lines": [
      { "level": 1, "content": [ { "text": "“እነሆ፥ መንገድህን የሚጠርግ" } ] },
      { "level": 2, "content": [ { "text": "መልእክተኛዬን በፊትህ እልካለሁ”" }, { "note": { "marker": "ሀ", "type": "footnote", "text": "ሚልክያስ 3፥1" } }, { "text": "—" } ] },
      { "level": 1, "content": [ { "v": 3 }, { "text": "“በምድረ በዳ የሚጮኽ ሰው ድምፅ፦" } ] },
      { "level": 2, "content": [ { "text": "‘የጌታን መንገድ አዘጋጁ፥" } ] },
      { "level": 2, "content": [ { "text": "ጥርጊያውንም አቅኑ።’”" } ] }
    ] },
    { "kind": "paragraph", "style": "p", "content": [
      { "v": 4 }, { "text": "ዮሐንስም በምድረ በዳ እያጠመቀ የኃጢአትን ስርየት ለማግኘት የንስሐን ጥምቀት እየሰበከ መጣ።" },
      { "v": 5 }, { "text": "የይሁዳ አገር ሁሉና የኢየሩሳሌም ሰዎች ሁሉ ወደ እርሱ ይወጡ ነበር፤ ኃጢአታቸውንም እየተናዘዙ በዮርዳኖስ ወንዝ ከእርሱ ይጠመቁ ነበር።" }
    ] },
    { "kind": "heading", "level": 1, "text": "የኢየሱስ ጥምቀት" },
    { "kind": "paragraph", "style": "p", "content": [
      { "v": 9 }, { "text": "በዚያ ወራትም ኢየሱስ ከገሊላ ናዝሬት መጥቶ በዮሐንስ በዮርዳኖስ ተጠመቀ።" },
      { "v": 10 }, { "text": "ወዲያውም ከውኃው ሲወጣ ሰማያት ሲቀደዱና መንፈስ እንደ ርግብ ሆኖ ሲወርድበት አየ።" },
      { "v": 11 }, { "text": "ድምፅም ከሰማይ መጣ፦ " }, { "text": "“የምወድህ ልጄ አንተ ነህ፥ በአንተ ደስ ይለኛል።”", "wj": true }
    ] }
  ] }
}
$json$::jsonb
from public.bible_books b
where b.paratext_code = 'MRK'
on conflict (book_id, chapter_number)
do update set verse_count = excluded.verse_count, content = excluded.content;

-- 4b. Verse rows (anchor for bookmarks/highlights/notes + search index).
with ch as (
    select c.id
    from public.bible_chapters c
    join public.bible_books b on b.id = c.book_id
    where b.paratext_code = 'MRK' and c.chapter_number = 1
)
insert into public.bible_verses (chapter_id, verse_number, text)
select ch.id, v.n, v.t
from ch,
(values
    (1,  '{"en":"The beginning of the good news about Jesus Christ, the Son of God,","am":"የእግዚአብሔር ልጅ የኢየሱስ ክርስቶስ ወንጌል መጀመሪያ፤"}'::jsonb),
    (2,  '{"en":"as it is written in Isaiah the prophet: “I will send my messenger ahead of you, who will prepare your way”—","am":"በነቢዩ በኢሳይያስ እንደ ተጻፈ፦ “እነሆ፥ መንገድህን የሚጠርግ መልእክተኛዬን በፊትህ እልካለሁ”—"}'::jsonb),
    (3,  '{"en":"“a voice of one calling in the wilderness, ‘Prepare the way for the Lord, make straight paths for him.’”","am":"“በምድረ በዳ የሚጮኽ ሰው ድምፅ፦ ‘የጌታን መንገድ አዘጋጁ፥ ጥርጊያውንም አቅኑ።’”"}'::jsonb),
    (4,  '{"en":"And so John the Baptist appeared in the wilderness, preaching a baptism of repentance for the forgiveness of sins.","am":"ዮሐንስም በምድረ በዳ እያጠመቀ የኃጢአትን ስርየት ለማግኘት የንስሐን ጥምቀት እየሰበከ መጣ።"}'::jsonb),
    (5,  '{"en":"The whole Judean countryside and all the people of Jerusalem went out to him. Confessing their sins, they were baptized by him in the Jordan River.","am":"የይሁዳ አገር ሁሉና የኢየሩሳሌም ሰዎች ሁሉ ወደ እርሱ ይወጡ ነበር፤ ኃጢአታቸውንም እየተናዘዙ በዮርዳኖስ ወንዝ ከእርሱ ይጠመቁ ነበር።"}'::jsonb),
    (9,  '{"en":"At that time Jesus came from Nazareth in Galilee and was baptized by John in the Jordan.","am":"በዚያ ወራትም ኢየሱስ ከገሊላ ናዝሬት መጥቶ በዮሐንስ በዮርዳኖስ ተጠመቀ።"}'::jsonb),
    (10, '{"en":"Just as Jesus was coming up out of the water, he saw heaven being torn open and the Spirit descending on him like a dove.","am":"ወዲያውም ከውኃው ሲወጣ ሰማያት ሲቀደዱና መንፈስ እንደ ርግብ ሆኖ ሲወርድበት አየ።"}'::jsonb),
    (11, '{"en":"And a voice came from heaven: “You are my Son, whom I love; with you I am well pleased.”","am":"ድምፅም ከሰማይ መጣ፦ “የምወድህ ልጄ አንተ ነህ፥ በአንተ ደስ ይለኛል።”"}'::jsonb)
) as v(n, t)
on conflict (chapter_id, verse_number) do update set text = excluded.text;

-- 4c. Inline footnote + cross reference (idempotent: clear Mark 1 first).
delete from public.bible_footnotes f
using public.bible_verses bv
join public.bible_chapters c on c.id = bv.chapter_id
join public.bible_books b on b.id = c.book_id
where f.verse_id = bv.id and b.paratext_code = 'MRK' and c.chapter_number = 1;

delete from public.bible_cross_references x
using public.bible_verses bv
join public.bible_chapters c on c.id = bv.chapter_id
join public.bible_books b on b.id = c.book_id
where x.verse_id = bv.id and b.paratext_code = 'MRK' and c.chapter_number = 1;

insert into public.bible_footnotes (verse_id, marker, note, type)
select bv.id,
    '{"en":"a","am":"ሀ"}'::jsonb,
    '{"en":"Malachi 3:1","am":"ሚልክያስ 3፥1"}'::jsonb,
    'footnote'
from public.bible_verses bv
join public.bible_chapters c on c.id = bv.chapter_id
join public.bible_books b on b.id = c.book_id
where b.paratext_code = 'MRK' and c.chapter_number = 1 and bv.verse_number = 2;

insert into public.bible_cross_references
    (verse_id, ref_book_id, ref_chapter, ref_verse_start, description)
select bv.id, isa.id, 40, 3, '{"en":"Isaiah 40:3","am":"ኢሳይያስ 40፥3"}'::jsonb
from public.bible_verses bv
join public.bible_chapters c on c.id = bv.chapter_id
join public.bible_books b on b.id = c.book_id
cross join (select id from public.bible_books where paratext_code = 'ISA') isa
where b.paratext_code = 'MRK' and c.chapter_number = 1 and bv.verse_number = 3;
