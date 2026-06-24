-- migration: add denomination to churches + refresh the coordinates RPC
-- description: adds the `denomination` field shown next to the category
--              badge on the redesigned church-detail page. The list of
--              services a church offers is intentionally NOT stored on
--              churches anymore — it lives in its own normalised table
--              (see 20260519000002_create_church_services.sql) so we can
--              share service definitions across churches by id.
-- author: leuliance
-- date: 2026-05-19

-- ============================================================================
-- 1. DENOMINATION COLUMN
-- ============================================================================
alter table public.churches
add column if not exists denomination text;

comment on column public.churches.denomination is
    'Free-form denomination label rendered in the church detail header (e.g. "Ethiopian Orthodox"). Defaulted to "Ethiopian Orthodox" for existing rows because this app ships exclusively to Ethiopian Orthodox communities, but admins can override per church.';

update public.churches
set denomination = 'Ethiopian Orthodox'
where denomination is null;

-- ============================================================================
-- 2. RPC RETURN SHAPE
-- ============================================================================
-- `extract_church_coordinates` is the RPC the client falls back to when it
-- needs decoded lat/lng. Surface `denomination` alongside the existing
-- payload so the detail page can render the new header chip without an
-- extra round-trip. Services are joined client-side via the dedicated
-- `church_services` API (see useChurchServices) since each church can have
-- N services from the shared catalog.
drop function if exists public.extract_church_coordinates();

create or replace function public.extract_church_coordinates()
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
    language text,
    denomination text
)
language plpgsql
security definer
as $$
begin
    return query
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
        c.language,
        c.denomination
    from public.churches c
    where c.status = 'approved';
end;
$$;

comment on function public.extract_church_coordinates is
    'Extracts longitude and latitude from PostGIS geography coordinates for churches, plus denomination for the detail screen.';

grant execute on function public.extract_church_coordinates() to anon, authenticated;
