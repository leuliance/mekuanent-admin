-- ============================================================================
-- Migration: Drop multilingual JSONB on admin-postable text fields
-- ----------------------------------------------------------------------------
-- Marketing decision (2026-04-28): admins no longer translate every post.
-- A piece of `content`, a `donation` campaign, an `event`, or a `church`
-- profile is now created in a single language and stored as plain TEXT.
-- A new `language` column on each of these parents records which language
-- the creator wrote in, so readers/feeds can group/filter by language.
--
-- Bible tables KEEP their JSONB shape — translations there are essential
-- and the data is static (managed centrally, not by admins).
--
-- Tables explicitly NOT touched here (out of scope per the marketing brief):
--   - notifications.title/body          (system-generated, multi-lang push)
--   - payment_gateways.display_name/... (seeded lookup table, not admin)
--   - region_categories / subcities     (seeded lookup tables)
--   - feature_flags                     (dev/admin internal)
--   - payments.gateway_response/...     (structured JSON, not text)
--   - wallet_transactions.metadata      (structured JSON)
--   - user_preferences.theme_preference (structured JSON)
--   - churches.location / events.location (struct: location metadata, not
--     localized text)
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Drop CHECK constraints that require {am, en} keys on the jsonb columns
--    we're about to convert.
-- ----------------------------------------------------------------------------
alter table public.churches
    drop constraint if exists churches_name_has_amharic,
    drop constraint if exists churches_name_has_english,
    drop constraint if exists churches_description_has_amharic;

alter table public.bank_accounts
    drop constraint if exists bank_accounts_bank_name_has_amharic;

alter table public.event_categories
    drop constraint if exists event_categories_name_has_amharic,
    drop constraint if exists event_categories_description_has_amharic;

alter table public.donation_categories
    drop constraint if exists donation_categories_name_has_amharic,
    drop constraint if exists donation_categories_description_has_amharic;

alter table public.events
    drop constraint if exists events_title_has_amharic,
    drop constraint if exists events_description_has_amharic;

alter table public.donation_campaigns
    drop constraint if exists donation_campaigns_title_has_amharic,
    drop constraint if exists donation_campaigns_description_has_amharic;

alter table public.content_items
    drop constraint if exists content_items_title_has_amharic,
    drop constraint if exists content_items_description_has_amharic;

alter table public.article_content
    drop constraint if exists article_content_body_has_amharic;

-- ----------------------------------------------------------------------------
-- 2. One-shot helpers (dropped at the end of this migration). They cover:
--      (a) row stored as a multilingual object: {"en":"Foo","am":"ፉ"}
--      (b) row stored as a bare jsonb string already: "Foo"
--      (c) defensive: anything else (return null / 'en')
--
--    `_mig_pick_localized_text` returns the best non-empty value, preferring
--    English then Amharic, then any other supported language, then any
--    non-empty key on the object.
--    `_mig_pick_localized_lang` returns the language code that matches the
--    value `_mig_pick_localized_text` would have picked, so we can backfill
--    the new `language` column consistently.
-- ----------------------------------------------------------------------------
create or replace function public._mig_pick_localized_text(j jsonb)
returns text
language plpgsql
immutable
as $$
declare
    v text;
begin
    if j is null then
        return null;
    end if;

    if jsonb_typeof(j) = 'string' then
        return j #>> '{}';
    end if;

    if jsonb_typeof(j) <> 'object' then
        return j::text;
    end if;

    v := coalesce(
        nullif(j ->> 'en', ''),
        nullif(j ->> 'am', ''),
        nullif(j ->> 'or', ''),
        nullif(j ->> 'ti', ''),
        nullif(j ->> 'so', ''),
        nullif(j ->> 'aa', ''),
        nullif(j ->> 'sid', '')
    );

    if v is not null then
        return v;
    end if;

    select nullif(value, '') into v
    from jsonb_each_text(j)
    where nullif(value, '') is not null
    limit 1;

    return v;
end;
$$;

create or replace function public._mig_pick_localized_lang(j jsonb)
returns text
language plpgsql
immutable
as $$
declare
    k text;
begin
    if j is null or jsonb_typeof(j) <> 'object' then
        return 'en';
    end if;

    if nullif(j ->> 'en', '')  is not null then return 'en'; end if;
    if nullif(j ->> 'am', '')  is not null then return 'am'; end if;
    if nullif(j ->> 'or', '')  is not null then return 'or'; end if;
    if nullif(j ->> 'ti', '')  is not null then return 'ti'; end if;
    if nullif(j ->> 'so', '')  is not null then return 'so'; end if;

    select key into k
    from jsonb_each_text(j)
    where nullif(value, '') is not null
    limit 1;

    return coalesce(k, 'en');
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. Add the new `language` column on each admin-postable parent table and
--    backfill it BEFORE we lose the original jsonb. Allowed values mirror
--    the locales we ship in `src/locales/`.
-- ----------------------------------------------------------------------------
alter table public.content_items
    add column if not exists language text not null default 'en';
alter table public.events
    add column if not exists language text not null default 'en';
alter table public.donation_campaigns
    add column if not exists language text not null default 'en';
alter table public.churches
    add column if not exists language text not null default 'en';

-- Drop check constraint first (idempotent re-runs) then add it back so the
-- name is deterministic regardless of how often the migration is replayed.
alter table public.content_items
    drop constraint if exists content_items_language_check;
alter table public.events
    drop constraint if exists events_language_check;
alter table public.donation_campaigns
    drop constraint if exists donation_campaigns_language_check;
alter table public.churches
    drop constraint if exists churches_language_check;

alter table public.content_items
    add constraint content_items_language_check
        check (language in ('en','am','or','ti','so'));
alter table public.events
    add constraint events_language_check
        check (language in ('en','am','or','ti','so'));
alter table public.donation_campaigns
    add constraint donation_campaigns_language_check
        check (language in ('en','am','or','ti','so'));
alter table public.churches
    add constraint churches_language_check
        check (language in ('en','am','or','ti','so'));

-- Backfill from the row's primary text column (title/name).
update public.content_items
   set language = public._mig_pick_localized_lang(title);

update public.events
   set language = public._mig_pick_localized_lang(title);

update public.donation_campaigns
   set language = public._mig_pick_localized_lang(title);

update public.churches
   set language = public._mig_pick_localized_lang(name);

-- ----------------------------------------------------------------------------
-- 4. Convert localized JSONB columns -> TEXT.
--    Pattern per column:
--      a) drop default if present (defaults are jsonb literals)
--      b) ALTER COLUMN ... TYPE text USING _mig_pick_localized_text(col)
--      c) restore an empty-string default for NOT NULL columns
-- ----------------------------------------------------------------------------

-- content_items (title NOT NULL, description NOT NULL)
alter table public.content_items
    alter column title       drop default,
    alter column description drop default;
alter table public.content_items
    alter column title       type text using coalesce(public._mig_pick_localized_text(title), ''),
    alter column description type text using coalesce(public._mig_pick_localized_text(description), '');
alter table public.content_items
    alter column title       set default '',
    alter column description set default '';

-- article_content (body NOT NULL, author_name NULLABLE)
alter table public.article_content
    alter column body        drop default,
    alter column author_name drop default;
alter table public.article_content
    alter column body        type text using coalesce(public._mig_pick_localized_text(body), ''),
    alter column author_name type text using public._mig_pick_localized_text(author_name);
alter table public.article_content
    alter column body set default '';

-- audio_content (both nullable)
alter table public.audio_content
    alter column album_name  drop default,
    alter column artist_name drop default;
alter table public.audio_content
    alter column album_name  type text using public._mig_pick_localized_text(album_name),
    alter column artist_name type text using public._mig_pick_localized_text(artist_name);

-- donation_campaigns (title NOT NULL, description NOT NULL)
alter table public.donation_campaigns
    alter column title       drop default,
    alter column description drop default;
alter table public.donation_campaigns
    alter column title       type text using coalesce(public._mig_pick_localized_text(title), ''),
    alter column description type text using coalesce(public._mig_pick_localized_text(description), '');
alter table public.donation_campaigns
    alter column title       set default '',
    alter column description set default '';

-- donation_categories (both NOT NULL)
alter table public.donation_categories
    alter column name        drop default,
    alter column description drop default;
alter table public.donation_categories
    alter column name        type text using coalesce(public._mig_pick_localized_text(name), ''),
    alter column description type text using coalesce(public._mig_pick_localized_text(description), '');
alter table public.donation_categories
    alter column name        set default '',
    alter column description set default '';

-- donations.message (nullable; donor-typed)
alter table public.donations
    alter column message drop default;
alter table public.donations
    alter column message type text using public._mig_pick_localized_text(message);

-- events (title NOT NULL, description NOT NULL, address NULLABLE)
-- events.location is intentionally LEFT as jsonb (it stores struct metadata,
-- not localized text — see column comment in the original schema).
alter table public.events
    alter column title       drop default,
    alter column description drop default;
alter table public.events
    alter column title       type text using coalesce(public._mig_pick_localized_text(title), ''),
    alter column description type text using coalesce(public._mig_pick_localized_text(description), ''),
    alter column address     type text using public._mig_pick_localized_text(address);
alter table public.events
    alter column title       set default '',
    alter column description set default '';

-- event_categories (both NOT NULL)
alter table public.event_categories
    alter column name        drop default,
    alter column description drop default;
alter table public.event_categories
    alter column name        type text using coalesce(public._mig_pick_localized_text(name), ''),
    alter column description type text using coalesce(public._mig_pick_localized_text(description), '');
alter table public.event_categories
    alter column name        set default '',
    alter column description set default '';

-- churches (name NOT NULL, description NOT NULL, address/city/state NULLABLE,
-- country had a jsonb default of {am,en}). location stays jsonb.
alter table public.churches
    alter column country drop default;
alter table public.churches
    alter column name        type text using coalesce(public._mig_pick_localized_text(name), ''),
    alter column description type text using coalesce(public._mig_pick_localized_text(description), ''),
    alter column address     type text using public._mig_pick_localized_text(address),
    alter column city        type text using public._mig_pick_localized_text(city),
    alter column state       type text using public._mig_pick_localized_text(state),
    alter column country     type text using public._mig_pick_localized_text(country);
alter table public.churches
    alter column country set default 'Ethiopia';

-- bank_accounts.bank_name (NOT NULL)
alter table public.bank_accounts
    alter column bank_name drop default;
alter table public.bank_accounts
    alter column bank_name type text using coalesce(public._mig_pick_localized_text(bank_name), '');

-- campaign_goal_changes.reason (NOT NULL, no default)
alter table public.campaign_goal_changes
    alter column reason type text using coalesce(public._mig_pick_localized_text(reason), '');

-- ----------------------------------------------------------------------------
-- 5. Update column comments so future devs understand the new shape.
-- ----------------------------------------------------------------------------
comment on column public.churches.name        is 'Plain-text church name (single language; see churches.language)';
comment on column public.churches.description is 'Plain-text description (single language)';
comment on column public.churches.address     is 'Plain-text street address';
comment on column public.churches.city        is 'Plain-text city name';
comment on column public.churches.state       is 'Plain-text state/region name';
comment on column public.churches.country     is 'Plain-text country name (default Ethiopia)';
comment on column public.churches.language    is 'ISO-639 language code of name/description (en/am/or/ti/so)';
comment on column public.events.title         is 'Plain-text title (see events.language)';
comment on column public.events.description   is 'Plain-text description';
comment on column public.events.address       is 'Plain-text event address';
comment on column public.events.language      is 'ISO-639 language code of title/description';
comment on column public.donation_campaigns.title       is 'Plain-text campaign title';
comment on column public.donation_campaigns.description is 'Plain-text campaign description';
comment on column public.donation_campaigns.language    is 'ISO-639 language code of title/description';
comment on column public.content_items.title       is 'Plain-text content title';
comment on column public.content_items.description is 'Plain-text content description';
comment on column public.content_items.language    is 'ISO-639 language code of title/description';
comment on column public.article_content.body        is 'Plain-text article body (single language; matches content_items.language)';
comment on column public.article_content.author_name is 'Plain-text author name';
comment on column public.audio_content.album_name  is 'Plain-text album name';
comment on column public.audio_content.artist_name is 'Plain-text artist name';
comment on column public.donations.message is 'Plain-text donor message';

-- ----------------------------------------------------------------------------
-- 6. Recreate B-tree indexes that referenced the (now ex-jsonb) columns.
--    Postgres rewrites the underlying heap on type change, but the original
--    indexes were btrees over the jsonb representation. Drop+recreate to
--    keep the planner statistics correct against the new TEXT type.
-- ----------------------------------------------------------------------------
drop index if exists public.idx_audio_content_album;
drop index if exists public.idx_audio_content_artist;
create index idx_audio_content_album  on public.audio_content (album_name);
create index idx_audio_content_artist on public.audio_content (artist_name);

-- Helpful indexes for filtering admin lists by language.
create index if not exists idx_content_items_language      on public.content_items (language);
create index if not exists idx_events_language             on public.events (language);
create index if not exists idx_donation_campaigns_language on public.donation_campaigns (language);
create index if not exists idx_churches_language           on public.churches (language);

-- ----------------------------------------------------------------------------
-- 7. Drop migration helper functions.
-- ----------------------------------------------------------------------------
drop function if exists public._mig_pick_localized_text(jsonb);
drop function if exists public._mig_pick_localized_lang(jsonb);

commit;
