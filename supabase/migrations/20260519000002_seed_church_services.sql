-- migration: normalised "services available" catalog + join + seed
-- description: introduces a global `service_types` catalog (the list of
--              services a church can offer) and a `church_services` join
--              table that links churches to the catalog by id. Each
--              service type carries a multilingual `name` jsonb so the
--              client renders the user's locale via `getLocalizedField`.
--              Existing churches are seeded with sensible defaults based
--              on their `category` (parish church vs. monastery vs.
--              female monastery).
-- author: leuliance
-- date: 2026-05-19
--
-- Schema shape:
--   service_types (catalog, shared across churches)
--     id              uuid pk
--     key             text unique   -- canonical key for analytics / icons
--     name            jsonb         -- {"en":"...","am":"...","or":"...","ti":"...","so":"..."}
--     icon            text          -- Ionicons name rendered next to the chip
--     applicable_to   church_category[]  -- categories that typically offer this service (informational)
--
--   church_services (join, owned by the church)
--     church_id       uuid fk
--     service_type_id uuid fk
--     display_order   int    -- chip ordering on the detail page
--     pk (church_id, service_type_id)

-- ============================================================================
-- 1. CATALOG TABLE
-- ============================================================================
create table if not exists public.service_types (
    id              uuid primary key default gen_random_uuid(),
    key             text not null unique,
    name            jsonb not null,
    icon            text,
    applicable_to   public.church_category[] not null default '{}'::public.church_category[],
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    constraint service_types_name_has_amharic
        check (name ? 'am' and name->>'am' is not null),
    constraint service_types_name_has_english
        check (name ? 'en' and name->>'en' is not null)
);

comment on table  public.service_types is
    'Global catalog of services churches can offer (Sunday liturgy, Confession, …). Shared by id across churches via church_services.';
comment on column public.service_types.key is
    'Canonical kebab-case key for analytics / programmatic lookups (e.g. "sunday-liturgy").';
comment on column public.service_types.name is
    'Multilingual label rendered via getLocalizedField on the client. MUST contain "am" and "en"; other locales are optional fallbacks.';
comment on column public.service_types.icon is
    'Ionicons name rendered alongside the chip (e.g. "book-outline"). Optional.';
comment on column public.service_types.applicable_to is
    'Hint for admin UIs about which church categories typically offer this service. Not enforced at the join level — any church can attach any service.';

create index if not exists idx_service_types_key on public.service_types(key);

-- ============================================================================
-- 2. JOIN TABLE
-- ============================================================================
create table if not exists public.church_services (
    church_id        uuid not null references public.churches(id)     on delete cascade,
    service_type_id  uuid not null references public.service_types(id) on delete cascade,
    display_order    integer not null default 0,
    created_at       timestamptz not null default now(),
    primary key (church_id, service_type_id)
);

comment on table  public.church_services is
    'Join table linking churches to the services they offer. Display order controls chip ordering on the detail page.';
comment on column public.church_services.display_order is
    'Lower values render first. Ties broken by service_types.key for stability.';

create index if not exists idx_church_services_church_id
    on public.church_services(church_id, display_order);
create index if not exists idx_church_services_service_type_id
    on public.church_services(service_type_id);

-- ============================================================================
-- 3. RLS
-- ============================================================================
-- service_types is a global lookup — everyone reads, only super admins
-- write. church_services is per-church — everyone reads (so non-members
-- can see what a church offers on the public detail page), church admins
-- and super admins write.
alter table public.service_types   enable row level security;
alter table public.church_services enable row level security;

drop policy if exists "Anyone can view service types" on public.service_types;
create policy "Anyone can view service types"
    on public.service_types
    for select
    using (true);

drop policy if exists "Super admins can manage service types" on public.service_types;
create policy "Super admins can manage service types"
    on public.service_types
    for all
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid()
              and role = 'super_admin'
        )
    );

drop policy if exists "Anyone can view church services" on public.church_services;
create policy "Anyone can view church services"
    on public.church_services
    for select
    using (true);

drop policy if exists "Church admins can manage church services" on public.church_services;
create policy "Church admins can manage church services"
    on public.church_services
    for all
    using (
        exists (
            select 1 from public.user_roles
            where user_id = auth.uid()
              and church_id = church_services.church_id
              and role in ('church_admin', 'super_admin')
        )
    );

-- ============================================================================
-- 4. SEED THE CATALOG
-- ============================================================================
-- Twelve common services covering parish churches, monasteries, and female
-- monasteries. Each entry is a multilingual record; `am` and `en` are
-- always present, the other locales fall back through `getLocalizedField`.
insert into public.service_types (key, name, icon, applicable_to)
values
    (
        'sunday-liturgy',
        jsonb_build_object(
            'en', 'Sunday liturgy',
            'am', 'ሰንበት ቅዳሴ',
            'or', 'Kadiroo Dilbataa',
            'ti', 'ቅዳሴ ሰንበት',
            'so', 'Cibaadada Axadda'
        ),
        'book-outline',
        array['church']::public.church_category[]
    ),
    (
        'daily-liturgy',
        jsonb_build_object(
            'en', 'Daily liturgy',
            'am', 'ዕለታዊ ቅዳሴ',
            'or', 'Kadiroo Guyyuu',
            'ti', 'ኣገልግሎት ዕለታዊ',
            'so', 'Cibaadada Maalinlaha'
        ),
        'book-outline',
        array['monastery', 'female-monastery']::public.church_category[]
    ),
    (
        'confession',
        jsonb_build_object(
            'en', 'Confession',
            'am', 'ንስሐ',
            'or', 'Tobaa',
            'ti', 'ንስሓ',
            'so', 'Qirashada'
        ),
        'heart-outline',
        array['church', 'monastery']::public.church_category[]
    ),
    (
        'sunday-school',
        jsonb_build_object(
            'en', 'Sunday school',
            'am', 'ሰንበት ት/ቤት',
            'or', 'Mana Baruumsaa Dilbataa',
            'ti', 'ቤት ትምህርቲ ሰንበት',
            'so', 'Iskoolka Axadda'
        ),
        'school-outline',
        array['church']::public.church_category[]
    ),
    (
        'baptism',
        jsonb_build_object(
            'en', 'Baptism',
            'am', 'ጥምቀት',
            'or', 'Cuuphaa',
            'ti', 'ጥምቀት',
            'so', 'Baabtiisid'
        ),
        'water-outline',
        array['church']::public.church_category[]
    ),
    (
        'holy-matrimony',
        jsonb_build_object(
            'en', 'Holy matrimony',
            'am', 'ቅዱስ ጋብቻ',
            'or', 'Gaa''ila Qulqulluu',
            'ti', 'ቅዱስ ሓዳር',
            'so', 'Guur Quduus'
        ),
        'heart-circle-outline',
        array['church']::public.church_category[]
    ),
    (
        'pilgrim-guidance',
        jsonb_build_object(
            'en', 'Pilgrim guidance',
            'am', 'የንግደት መርሐ-ግብር',
            'or', 'Qajeelfama Imala Quduus',
            'ti', 'መሪሕ ጉዕዞ ቅዱስ',
            'so', 'Hagaajinta Safarka Diineed'
        ),
        'walk-outline',
        array['monastery', 'female-monastery']::public.church_category[]
    ),
    (
        'holy-water',
        jsonb_build_object(
            'en', 'Holy water',
            'am', 'ጸበል',
            'or', 'Bishaan Qulqulluu',
            'ti', 'ጸበል',
            'so', 'Biyo Quduus'
        ),
        'water-outline',
        array['monastery', 'female-monastery', 'church']::public.church_category[]
    ),
    (
        'spiritual-counsel',
        jsonb_build_object(
            'en', 'Spiritual counsel',
            'am', 'መንፈሳዊ ምክር',
            'or', 'Gorsa Hafuuraa',
            'ti', 'መንፈሳዊ ምኽሪ',
            'so', 'Talo Ruuxi ah'
        ),
        'chatbubble-ellipses-outline',
        array['monastery', 'female-monastery']::public.church_category[]
    ),
    (
        'evening-prayer',
        jsonb_build_object(
            'en', 'Evening prayer',
            'am', 'የምሽት ጸሎት',
            'or', 'Kadhannaa Galgalaa',
            'ti', 'ጸሎት ምሸት',
            'so', 'Salaadda Fiidka'
        ),
        'moon-outline',
        array['church', 'monastery', 'female-monastery']::public.church_category[]
    ),
    (
        'kidase',
        jsonb_build_object(
            'en', 'Kidasé',
            'am', 'ቅዳሴ',
            'or', 'Kadiroo',
            'ti', 'ቅዳሴ',
            'so', 'Cibaadada Kidasé'
        ),
        'sunny-outline',
        array['church', 'monastery']::public.church_category[]
    ),
    (
        'funeral-service',
        jsonb_build_object(
            'en', 'Funeral service',
            'am', 'የቀብር ሥርዓት',
            'or', 'Tajaajila Sirna Awwaalcha',
            'ti', 'ስርዓት ቀብሪ',
            'so', 'Adeegga Aaska'
        ),
        'flower-outline',
        array['church']::public.church_category[]
    )
on conflict (key) do update
    set name          = excluded.name,
        icon          = excluded.icon,
        applicable_to = excluded.applicable_to,
        updated_at    = now();

-- ============================================================================
-- 5. CONNECT EXISTING CHURCHES TO THE CATALOG
-- ============================================================================
-- For every existing church, attach a category-appropriate set of services
-- using the catalog keys above. `with ordered_services as (...)` produces
-- a per-category list with a stable display_order so the chips render in
-- the same sequence the admin would expect.
--
-- Idempotent: `on conflict do nothing` means re-running the migration
-- after an admin has curated a church's chips is a no-op for that church.

with ordered_services(category, key, display_order) as (
    values
        -- parish churches
        ('church'::public.church_category,           'sunday-liturgy',  0),
        ('church'::public.church_category,           'confession',      1),
        ('church'::public.church_category,           'sunday-school',   2),
        ('church'::public.church_category,           'baptism',         3),
        ('church'::public.church_category,           'holy-matrimony',  4),
        -- monasteries
        ('monastery'::public.church_category,        'daily-liturgy',     0),
        ('monastery'::public.church_category,        'pilgrim-guidance',  1),
        ('monastery'::public.church_category,        'confession',        2),
        ('monastery'::public.church_category,        'holy-water',        3),
        ('monastery'::public.church_category,        'spiritual-counsel', 4),
        -- female monasteries
        ('female-monastery'::public.church_category, 'daily-liturgy',     0),
        ('female-monastery'::public.church_category, 'spiritual-counsel', 1),
        ('female-monastery'::public.church_category, 'holy-water',        2),
        ('female-monastery'::public.church_category, 'pilgrim-guidance',  3)
)
insert into public.church_services (church_id, service_type_id, display_order)
select
    c.id,
    st.id,
    os.display_order
from public.churches c
join ordered_services os on os.category = c.category
join public.service_types st on st.key = os.key
on conflict (church_id, service_type_id) do nothing;

-- ============================================================================
-- 6. UPDATED_AT TRIGGER FOR THE CATALOG
-- ============================================================================
create or replace function public.tg_service_types_set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists trg_service_types_set_updated_at on public.service_types;
create trigger trg_service_types_set_updated_at
    before update on public.service_types
    for each row execute function public.tg_service_types_set_updated_at();
