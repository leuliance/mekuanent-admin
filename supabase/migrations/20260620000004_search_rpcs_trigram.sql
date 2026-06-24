-- ============================================================================
-- Migration: Trigram-backed search RPCs for events / churches / campaigns
-- ----------------------------------------------------------------------------
-- The "All Events", "All Churches" and "All Causes" lists previously searched
-- with naive PostgREST `ilike` filters that sequential-scan the base tables.
-- This migration adds pg_trgm GIN indexes on the searchable text columns and
-- exposes three RPCs that the app calls instead. Each RPC:
--   * returns the SAME columns the previous query returned (so cards render
--     identically),
--   * applies the same visibility filter (published / approved / active),
--   * orders results the same way (events by start_time, churches by name,
--     campaigns newest-first),
--   * supports an empty search (returns everything matching the filters,
--     paginated via limit/offset),
--   * uses ILIKE on the trigram-indexed columns when search is non-empty.
--
-- RLS already exposes published events, approved churches and active campaigns
-- to anon + authenticated, so these are SECURITY INVOKER + STABLE.
-- ============================================================================

create extension if not exists pg_trgm;

-- ----------------------------------------------------------------------------
-- Trigram GIN indexes on the searchable text columns
-- ----------------------------------------------------------------------------
create index if not exists idx_events_title_trgm
    on public.events using gin (title gin_trgm_ops);
create index if not exists idx_events_description_trgm
    on public.events using gin (description gin_trgm_ops);
create index if not exists idx_events_address_trgm
    on public.events using gin (address gin_trgm_ops);

create index if not exists idx_churches_name_trgm
    on public.churches using gin (name gin_trgm_ops);
create index if not exists idx_churches_city_trgm
    on public.churches using gin (city gin_trgm_ops);
create index if not exists idx_churches_state_trgm
    on public.churches using gin (state gin_trgm_ops);

create index if not exists idx_donation_campaigns_title_trgm
    on public.donation_campaigns using gin (title gin_trgm_ops);
create index if not exists idx_donation_campaigns_description_trgm
    on public.donation_campaigns using gin (description gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- search_events — upcoming published events, optional category, trigram search
-- on title / description / address. Returns the events row + church_name.
-- ----------------------------------------------------------------------------
create or replace function public.search_events(
    search text default null,
    p_category uuid default null,
    p_limit int default 10,
    p_offset int default 0
)
returns table (
    id uuid,
    church_id uuid,
    category_id uuid,
    title text,
    description text,
    location jsonb,
    address text,
    coordinates extensions.geography,
    start_time timestamptz,
    end_time timestamptz,
    cover_image_url text,
    is_online boolean,
    meeting_url text,
    max_attendees integer,
    rsvp_deadline timestamptz,
    has_donation boolean,
    donation_goal_amount numeric,
    donation_current_amount numeric,
    donation_currency text,
    status public.event_status,
    created_by uuid,
    created_at timestamptz,
    updated_at timestamptz,
    language text,
    church_name text
)
language sql
stable
as $$
    select
        e.id,
        e.church_id,
        e.category_id,
        e.title,
        e.description,
        e.location,
        e.address,
        e.coordinates,
        e.start_time,
        e.end_time,
        e.cover_image_url,
        e.is_online,
        e.meeting_url,
        e.max_attendees,
        e.rsvp_deadline,
        e.has_donation,
        e.donation_goal_amount,
        e.donation_current_amount,
        e.donation_currency,
        e.status,
        e.created_by,
        e.created_at,
        e.updated_at,
        e.language,
        c.name as church_name
    from public.events e
    left join public.churches c on c.id = e.church_id
    where
        e.status = 'published'
        and e.start_time >= now()
        and (p_category is null or e.category_id = p_category)
        and (
            search is null
            or btrim(search) = ''
            or e.title ilike '%' || btrim(search) || '%'
            or e.description ilike '%' || btrim(search) || '%'
            or e.address ilike '%' || btrim(search) || '%'
        )
    order by e.start_time asc
    limit p_limit offset p_offset;
$$;

comment on function public.search_events(text, uuid, int, int) is
    'Trigram-accelerated search over upcoming published events (title/description/address). Returns the events row plus church_name.';

revoke all on function public.search_events(text, uuid, int, int) from public;
grant execute on function public.search_events(text, uuid, int, int)
    to anon, authenticated;

-- ----------------------------------------------------------------------------
-- search_churches — approved churches, optional category, trigram search on
-- name / city / state. Mirrors extract_church_coordinates' column shape
-- (including extracted longitude/latitude) so existing consumers keep working.
-- A null p_limit returns every matching row (the All Churches list paginates
-- client-side).
-- ----------------------------------------------------------------------------
create or replace function public.search_churches(
    search text default null,
    p_category text default null,
    p_limit int default 10,
    p_offset int default 0
)
returns table (
    id uuid,
    name text,
    description text,
    phone_number text,
    email text,
    website text,
    location jsonb,
    address text,
    city text,
    state text,
    country text,
    coordinates extensions.geography,
    longitude numeric,
    latitude numeric,
    logo_url text,
    cover_image_url text,
    category text,
    status public.church_status,
    rejected_reason text,
    verified_at timestamptz,
    verified_by uuid,
    created_at timestamptz,
    updated_at timestamptz,
    region_id uuid,
    subcity_id uuid,
    founded_year integer,
    language text
)
language sql
stable
as $$
    select
        c.id,
        c.name,
        c.description,
        c.phone_number,
        c.email,
        c.website,
        c.location,
        c.address,
        c.city,
        c.state,
        c.country,
        c.coordinates,
        st_x(st_transform(c.coordinates::geometry, 4326))::numeric as longitude,
        st_y(st_transform(c.coordinates::geometry, 4326))::numeric as latitude,
        c.logo_url,
        c.cover_image_url,
        c.category::text,
        c.status,
        c.rejected_reason,
        c.verified_at,
        c.verified_by,
        c.created_at,
        c.updated_at,
        c.region_id,
        c.subcity_id,
        c.founded_year,
        c.language
    from public.churches c
    where
        c.status = 'approved'
        and (p_category is null or c.category::text = p_category)
        and (
            search is null
            or btrim(search) = ''
            or c.name ilike '%' || btrim(search) || '%'
            or c.city ilike '%' || btrim(search) || '%'
            or c.state ilike '%' || btrim(search) || '%'
        )
    order by c.name asc
    limit p_limit offset p_offset;
$$;

comment on function public.search_churches(text, text, int, int) is
    'Trigram-accelerated search over approved churches (name/city/state). Mirrors extract_church_coordinates'' column shape including extracted longitude/latitude.';

revoke all on function public.search_churches(text, text, int, int) from public;
grant execute on function public.search_churches(text, text, int, int)
    to anon, authenticated;

-- ----------------------------------------------------------------------------
-- search_campaigns — active donation campaigns, optional category, trigram
-- search on title / description. Returns the campaign row joined with church
-- meta + category_name (donor counts are enriched client-side afterwards).
-- ----------------------------------------------------------------------------
create or replace function public.search_campaigns(
    search text default null,
    p_category uuid default null,
    p_church uuid default null,
    p_limit int default 10,
    p_offset int default 0
)
returns table (
    id uuid,
    church_id uuid,
    category_id uuid,
    title text,
    description text,
    goal_amount numeric,
    current_amount numeric,
    currency text,
    cover_image_url text,
    bank_account_id uuid,
    start_date timestamptz,
    end_date timestamptz,
    status public.campaign_status,
    created_by uuid,
    created_at timestamptz,
    updated_at timestamptz,
    verified_at timestamptz,
    verified_by uuid,
    rejected_reason text,
    language text,
    church_name text,
    church_address text,
    church_city text,
    church_state text,
    church_country text,
    category_name text
)
language sql
stable
as $$
    select
        dc.id,
        dc.church_id,
        dc.category_id,
        dc.title,
        dc.description,
        dc.goal_amount,
        dc.current_amount,
        dc.currency,
        dc.cover_image_url,
        dc.bank_account_id,
        dc.start_date,
        dc.end_date,
        dc.status,
        dc.created_by,
        dc.created_at,
        dc.updated_at,
        dc.verified_at,
        dc.verified_by,
        dc.rejected_reason,
        dc.language,
        ch.name as church_name,
        ch.address as church_address,
        ch.city as church_city,
        ch.state as church_state,
        ch.country as church_country,
        cat.name as category_name
    from public.donation_campaigns dc
    left join public.churches ch on ch.id = dc.church_id
    left join public.donation_categories cat on cat.id = dc.category_id
    where
        dc.status = 'active'
        and (p_category is null or dc.category_id = p_category)
        and (p_church is null or dc.church_id = p_church)
        and (
            search is null
            or btrim(search) = ''
            or dc.title ilike '%' || btrim(search) || '%'
            or dc.description ilike '%' || btrim(search) || '%'
        )
    order by dc.created_at desc
    limit p_limit offset p_offset;
$$;

comment on function public.search_campaigns(text, uuid, uuid, int, int) is
    'Trigram-accelerated search over active donation campaigns (title/description). Returns the campaign row plus church meta + category_name.';

revoke all on function public.search_campaigns(text, uuid, uuid, int, int) from public;
grant execute on function public.search_campaigns(text, uuid, uuid, int, int)
    to anon, authenticated;
