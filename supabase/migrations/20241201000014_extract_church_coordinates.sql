-- migration: extract church coordinates function
-- description: creates a function to extract longitude and latitude from PostGIS geography coordinates
-- author: system
-- date: 2024-12-01

create or replace function public.extract_church_coordinates()
returns table (
  id uuid,
  name jsonb,
  description jsonb,
  phone_number text,
  email text,
  website text,
  location jsonb,
  address jsonb,
  city jsonb,
  state jsonb,
  country jsonb,
  coordinates geography,
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
  founded_year integer
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
    c.founded_year
  from public.churches c
  where c.status = 'approved';
end;
$$;

comment on function public.extract_church_coordinates is 'Extracts longitude and latitude from PostGIS geography coordinates for churches';

