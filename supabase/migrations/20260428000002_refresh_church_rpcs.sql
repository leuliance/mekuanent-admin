-- ============================================================================
-- Migration: Refresh church RPCs after dropping multilingual JSONB
-- ----------------------------------------------------------------------------
-- The previous migration converted churches.{name,description,address,city,
-- state,country} from jsonb to text. The two RPCs below still declare jsonb
-- in their RETURNS TABLE signature, so calling them now raises:
--   "structure of query does not match function result type"
-- This migration drops + recreates them with the new text column types.
-- The returned columns are byte-for-byte the same except the multilingual
-- ones are now `text` instead of `jsonb`.
-- ============================================================================

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
    language text
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
        c.language
    from public.churches c
    where c.status = 'approved';
end;
$$;

comment on function public.extract_church_coordinates is
    'Extracts longitude and latitude from PostGIS geography coordinates for churches';

drop function if exists public.get_nearby_churches(double precision, double precision, double precision);

create or replace function public.get_nearby_churches(
    user_lat double precision,
    user_lng double precision,
    radius_km double precision default 10
)
returns table (
    id uuid,
    name text,
    address text,
    city text,
    state text,
    country text,
    coordinates extensions.geography,
    latitude double precision,
    longitude double precision,
    distance_km double precision,
    phone_number text,
    email text,
    website text,
    logo_url text,
    cover_image_url text,
    description text,
    founded_year integer,
    status text,
    category text,
    subcity_id uuid,
    region_id uuid,
    location jsonb,
    rejected_reason text,
    verified_at timestamptz,
    verified_by uuid,
    created_at timestamptz,
    updated_at timestamptz,
    language text
)
language plpgsql
stable
as $$
begin
    return query
    select
        c.id,
        c.name,
        c.address,
        c.city,
        c.state,
        c.country,
        c.coordinates,
        st_y(st_astext(c.coordinates::geometry)::geometry) as latitude,
        st_x(st_astext(c.coordinates::geometry)::geometry) as longitude,
        st_distance(
            c.coordinates::geography,
            st_setsrid(st_makepoint(user_lng, user_lat), 4326)::geography
        ) / 1000.0 as distance_km,
        c.phone_number,
        c.email,
        c.website,
        c.logo_url,
        c.cover_image_url,
        c.description,
        c.founded_year,
        c.status::text,
        c.category::text,
        c.subcity_id,
        c.region_id,
        c.location,
        c.rejected_reason,
        c.verified_at,
        c.verified_by,
        c.created_at,
        c.updated_at,
        c.language
    from public.churches c
    where
        c.status = 'approved'
        and st_dwithin(
            c.coordinates::geography,
            st_setsrid(st_makepoint(user_lng, user_lat), 4326)::geography,
            radius_km * 1000
        )
    order by distance_km asc;
end;
$$;

comment on function public.get_nearby_churches is
    'Returns churches within specified radius from given coordinates, sorted by distance';

grant execute on function public.get_nearby_churches(
    double precision, double precision, double precision
) to anon, authenticated;
