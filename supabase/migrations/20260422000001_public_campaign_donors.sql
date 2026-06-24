-- ============================================================================
-- Public campaign donors list
-- ----------------------------------------------------------------------------
-- The `donations` table's RLS restricts row visibility to the donor themselves
-- and church admins. That means the campaign detail page cannot render the
-- public donors list for anonymous visitors (or for authenticated users who
-- are not church admins).
--
-- We already expose an aggregated donor-count RPC via
-- `get_campaign_donor_summaries`. This migration adds a sibling RPC that
-- returns the actual donor rows needed by the UI (name, avatar, amount,
-- anonymized for is_anonymous donations), while still hiding raw fields
-- behind a SECURITY DEFINER function so per-row RLS is bypassed safely.
-- ============================================================================

create or replace function public.get_campaign_donors(
    p_campaign_id uuid,
    p_limit integer default 100
)
returns table (
    id uuid,
    amount numeric,
    is_anonymous boolean,
    created_at timestamptz,
    name text,
    avatar text
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
    return query
    select
        d.id,
        d.amount,
        d.is_anonymous,
        d.created_at,
        case
            when d.is_anonymous then 'Anonymous'::text
            else nullif(trim(
                coalesce(p.first_name, '') || ' ' || coalesce(p.last_name, '')
            ), '')
        end as name,
        case
            when d.is_anonymous then null::text
            else p.avatar_url
        end as avatar
    from public.donations d
    join public.donation_campaigns c
        on c.id = d.campaign_id
       and c.status = 'active'
    left join public.profiles p
        on p.id = d.user_id
    where d.campaign_id = p_campaign_id
      and d.status = 'completed'
    order by d.created_at desc
    limit greatest(p_limit, 0);
end;
$$;

comment on function public.get_campaign_donors(uuid, integer) is
  'Returns the donor list (name + avatar + amount) for an active campaign. SECURITY DEFINER so anonymous viewers can see social proof without exposing raw donation rows via RLS.';

revoke all on function public.get_campaign_donors(uuid, integer) from public;
grant execute on function public.get_campaign_donors(uuid, integer) to anon, authenticated;
