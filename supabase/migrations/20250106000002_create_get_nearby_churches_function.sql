/*
 * migration: create get_nearby_churches RPC function
 * description: Returns churches within a specified radius (in km) from given coordinates
 * author: system
 * date: 2025-01-06
 */

-- ============================================================================
-- get_nearby_churches function
-- ============================================================================

-- Drop the function if it exists (to handle signature changes)
DROP FUNCTION IF EXISTS public.get_nearby_churches(double precision, double precision, double precision);

CREATE OR REPLACE FUNCTION public.get_nearby_churches(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_km DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name JSONB,
    address JSONB,
    city JSONB,
    state JSONB,
    country JSONB,
    coordinates GEOGRAPHY,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_km DOUBLE PRECISION,
    phone_number TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    description JSONB,
    founded_year INTEGER,
    status TEXT,
    category TEXT,
    subcity_id UUID,
    region_id UUID,
    location JSONB,
    rejected_reason TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.address,
        c.city,
        c.state,
        c.country,
        c.coordinates,
        ST_Y(ST_AsText(c.coordinates::geometry)::geometry) as latitude,
        ST_X(ST_AsText(c.coordinates::geometry)::geometry) as longitude,
        ST_Distance(
            c.coordinates::geography,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) / 1000.0 as distance_km,
        c.phone_number,
        c.email,
        c.website,
        c.logo_url,
        c.cover_image_url,
        c.description,
        c.founded_year,
        c.status::TEXT,
        c.category::TEXT,
        c.subcity_id,
        c.region_id,
        c.location,
        c.rejected_reason,
        c.verified_at,
        c.verified_by,
        c.created_at,
        c.updated_at
    FROM public.churches c
    WHERE 
        c.status = 'approved'
        AND ST_DWithin(
            c.coordinates::geography,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
            radius_km * 1000  -- Convert km to meters
        )
    ORDER BY distance_km ASC;
END;
$$;

-- Add comment
COMMENT ON FUNCTION public.get_nearby_churches IS 'Returns churches within specified radius from given coordinates, sorted by distance';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_nearby_churches TO anon, authenticated;

