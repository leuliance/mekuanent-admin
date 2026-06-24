-- ============================================================================
-- Campaign donor summaries v2
-- ----------------------------------------------------------------------------
-- The previous `get_campaign_donor_summaries` filtered out donations with a
-- null user_id AND deduplicated by user_id. That caused the home-feed donor
-- count to disagree with the campaign-detail donors list (which shows ALL
-- completed donations). It also only exposed avatar URLs, so the UI had no
-- way to render a proper initials fallback for donors with no profile image.
--
-- This replaces the function to:
--   * Count `completed` donations the same way the detail RPC does
--     (no user_id filter, each donation counts — including anonymous).
--   * Return up to 4 donor samples with avatar + name so the card can show
--     the donor's real initials when an avatar is missing.
-- ============================================================================

create or replace function public.get_campaign_donor_summaries(
    p_campaign_ids uuid[]
)
returns table (
    campaign_id uuid,
    donor_count integer,
    donor_samples jsonb
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
    return query
    with completed_donations as (
        select
            d.campaign_id,
            d.id as donation_id,
            d.is_anonymous,
            d.created_at,
            case
                when d.is_anonymous then null
                else p.avatar_url
            end as avatar_url,
            case
                when d.is_anonymous then 'Anonymous'::text
                else nullif(trim(
                    coalesce(p.first_name, '') || ' ' || coalesce(p.last_name, '')
                ), '')
            end as donor_name
        from public.donations d
        join public.donation_campaigns c
            on c.id = d.campaign_id
           and c.status = 'active'
        left join public.profiles p
            on p.id = d.user_id
        where d.status = 'completed'
          and d.campaign_id = any(p_campaign_ids)
    ),
    ranked as (
        select
            cd.*,
            row_number() over (
                partition by cd.campaign_id
                order by cd.created_at desc
            ) as rn
        from completed_donations cd
    ),
    per_campaign as (
        select
            cd.campaign_id,
            count(*)::int as donor_count,
            coalesce(
                (
                    select jsonb_agg(
                        jsonb_build_object(
                            'avatar', r.avatar_url,
                            'name', r.donor_name
                        )
                        order by r.created_at desc
                    )
                    from ranked r
                    where r.campaign_id = cd.campaign_id
                      and r.rn <= 4
                ),
                '[]'::jsonb
            ) as donor_samples
        from completed_donations cd
        group by cd.campaign_id
    )
    select
        cid as campaign_id,
        coalesce(pc.donor_count, 0) as donor_count,
        coalesce(pc.donor_samples, '[]'::jsonb) as donor_samples
    from unnest(p_campaign_ids) as cid
    left join per_campaign pc on pc.campaign_id = cid;
end;
$$;

comment on function public.get_campaign_donor_summaries(uuid[]) is
  'Returns aggregated donor count + up to 4 donor samples ({avatar,name}) per active campaign. Matches the semantics of get_campaign_donors (counts every completed donation, including anonymous). SECURITY DEFINER so anonymous and authenticated viewers see identical social-proof numbers.';

revoke all on function public.get_campaign_donor_summaries(uuid[]) from public;
grant execute on function public.get_campaign_donor_summaries(uuid[]) to anon, authenticated;
