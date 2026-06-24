-- ============================================================================
-- Public campaign donor summaries
-- ----------------------------------------------------------------------------
-- RLS on `donations` restricts visibility to the donor themselves and church
-- admins, and `profiles` is gated to authenticated users. That means the
-- donation cards on the home feed (which need a donor count + a handful of
-- avatars to show social proof) render empty for anyone who isn't a church
-- admin — including anonymous visitors.
--
-- The fix is a SECURITY DEFINER RPC that returns ONLY aggregated, public-safe
-- data (count + up to 4 avatar URLs), for campaigns whose status is 'active'.
-- Ownership and admin policies on the base tables remain untouched.
-- ============================================================================

create or replace function public.get_campaign_donor_summaries(
    p_campaign_ids uuid[]
)
returns table (
    campaign_id uuid,
    donor_count integer,
    donor_avatars text[]
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
    return query
    with unique_donors as (
        select distinct on (d.campaign_id, d.user_id)
            d.campaign_id,
            d.user_id,
            p.avatar_url,
            d.created_at
        from public.donations d
        join public.donation_campaigns c
            on c.id = d.campaign_id
           and c.status = 'active'
        left join public.profiles p
            on p.id = d.user_id
        where d.status = 'completed'
          and d.user_id is not null
          and d.campaign_id = any(p_campaign_ids)
        order by d.campaign_id, d.user_id, d.created_at desc
    ),
    per_campaign as (
        select
            ud.campaign_id,
            count(*)::int as donor_count,
            coalesce(
                (
                    array_agg(ud.avatar_url order by ud.created_at desc)
                    filter (where ud.avatar_url is not null)
                )[1:4],
                array[]::text[]
            ) as donor_avatars
        from unique_donors ud
        group by ud.campaign_id
    )
    select
        cid as campaign_id,
        coalesce(pc.donor_count, 0) as donor_count,
        coalesce(pc.donor_avatars, array[]::text[]) as donor_avatars
    from unnest(p_campaign_ids) as cid
    left join per_campaign pc on pc.campaign_id = cid;
end;
$$;

comment on function public.get_campaign_donor_summaries(uuid[]) is
  'Returns aggregated donor count + up to 4 avatar URLs per active campaign. SECURITY DEFINER so anonymous and authenticated viewers can see social-proof counts without exposing raw donation rows.';

revoke all on function public.get_campaign_donor_summaries(uuid[]) from public;
grant execute on function public.get_campaign_donor_summaries(uuid[]) to anon, authenticated;
