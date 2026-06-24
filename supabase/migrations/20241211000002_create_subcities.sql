/*
 * migration: create subcities table
 * description: creates subcities table for cities/districts within regions and updates churches table
 * author: system
 * date: 2024-12-11
 * 
 * tables created:
 * - subcities: cities/districts within ethiopian regions
 * 
 * tables modified:
 * - churches: adds subcity_id foreign key
 */

-- ============================================================================
-- subcities table
-- ============================================================================
create table public.subcities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  display_name jsonb not null default '{"am": "", "en": ""}'::jsonb,
  slug text not null,
  region_id uuid not null references public.region_categories(id) on delete cascade,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint subcities_name_not_empty check (length(trim(name)) > 0),
  constraint subcities_slug_not_empty check (length(trim(slug)) > 0),
  constraint subcities_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint subcities_display_name_has_english check (display_name ? 'en' and display_name->>'en' is not null),
  constraint subcities_unique_slug_per_region unique (slug, region_id)
);

comment on table public.subcities is 'cities/districts within ethiopian regions for detailed church location';
comment on column public.subcities.name is 'official subcity/city name (e.g., "Bole", "Arada")';
comment on column public.subcities.display_name is 'multilingual display name with optional amharic translation';
comment on column public.subcities.slug is 'url-friendly identifier (e.g., "bole", "arada")';
comment on column public.subcities.region_id is 'parent region for this subcity';
comment on column public.subcities.display_order is 'sort order for display (lower numbers first)';

-- create indexes for common queries
create index subcities_region_id_idx on public.subcities(region_id);
create index subcities_slug_idx on public.subcities(slug);
create index subcities_is_active_idx on public.subcities(is_active);
create index subcities_display_order_idx on public.subcities(display_order);

-- ============================================================================
-- update churches table to add subcity_id
-- ============================================================================
alter table public.churches
  add column subcity_id uuid references public.subcities(id);

comment on column public.churches.subcity_id is 'reference to subcity for detailed location filtering';

-- create index for subcity lookups
create index churches_subcity_id_idx on public.churches(subcity_id);

-- ============================================================================
-- insert subcities for all regions
-- ============================================================================

-- get region ids first (we'll use them in inserts)
do $$
declare
  region_addis_id uuid;
  region_dire_id uuid;
  region_afar_id uuid;
  region_amhara_id uuid;
  region_bg_id uuid;
  region_central_id uuid;
  region_gambela_id uuid;
  region_harari_id uuid;
  region_oromia_id uuid;
  region_sidama_id uuid;
  region_somali_id uuid;
  region_south_id uuid;
  region_swpeoples_id uuid;
  region_tigray_id uuid;
begin
  -- fetch region ids
  select id into region_addis_id from public.region_categories where slug = 'addis-ababa';
  select id into region_dire_id from public.region_categories where slug = 'dire-dawa';
  select id into region_afar_id from public.region_categories where slug = 'afar';
  select id into region_amhara_id from public.region_categories where slug = 'amhara';
  select id into region_bg_id from public.region_categories where slug = 'benishangul-gumuz';
  select id into region_central_id from public.region_categories where slug = 'central-ethiopia';
  select id into region_gambela_id from public.region_categories where slug = 'gambela';
  select id into region_harari_id from public.region_categories where slug = 'harari';
  select id into region_oromia_id from public.region_categories where slug = 'oromia';
  select id into region_sidama_id from public.region_categories where slug = 'sidama';
  select id into region_somali_id from public.region_categories where slug = 'somali';
  select id into region_south_id from public.region_categories where slug = 'south-ethiopia';
  select id into region_swpeoples_id from public.region_categories where slug = 'south-west-ethiopia-peoples';
  select id into region_tigray_id from public.region_categories where slug = 'tigray';

  -- addis ababa subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Bole', '{"en": "Bole", "am": "ቦሌ"}'::jsonb, 'bole', region_addis_id, 1),
    ('Arada', '{"en": "Arada", "am": "አራዳ"}'::jsonb, 'arada', region_addis_id, 2),
    ('Nifas Silk', '{"en": "Nifas Silk", "am": "ንፋስ ስልክ"}'::jsonb, 'nifas-silk', region_addis_id, 3),
    ('Kolfe Keranio', '{"en": "Kolfe Keranio", "am": "ኮልፌ ቀራንዮ"}'::jsonb, 'kolfe-keranio', region_addis_id, 4),
    ('Gullele', '{"en": "Gullele", "am": "ጉለሌ"}'::jsonb, 'gullele', region_addis_id, 5),
    ('Yeka', '{"en": "Yeka", "am": "የካ"}'::jsonb, 'yeka', region_addis_id, 6),
    ('Lideta', '{"en": "Lideta", "am": "ልደታ"}'::jsonb, 'lideta', region_addis_id, 7),
    ('Akaki Kality', '{"en": "Akaki Kality", "am": "አቃቂ ቃሊቲ"}'::jsonb, 'akaki-kality', region_addis_id, 8),
    ('Kirkos', '{"en": "Kirkos", "am": "ቂርቆስ"}'::jsonb, 'kirkos', region_addis_id, 9);

  -- dire dawa subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Sabian', '{"en": "Sabian", "am": "ሳቢያን"}'::jsonb, 'sabian', region_dire_id, 1),
    ('Legehare', '{"en": "Legehare", "am": "ለገሀረ"}'::jsonb, 'legehare', region_dire_id, 2),
    ('Megala', '{"en": "Megala", "am": "መጋላ"}'::jsonb, 'megala', region_dire_id, 3);

  -- afar subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Asayita', '{"en": "Asayita", "am": "አሳይታ"}'::jsonb, 'asayita', region_afar_id, 1),
    ('Afambo', '{"en": "Afambo", "am": "አፋምቦ"}'::jsonb, 'afambo', region_afar_id, 2);

  -- amhara subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Bahir Dar', '{"en": "Bahir Dar", "am": "ባህር ዳር"}'::jsonb, 'bahir-dar', region_amhara_id, 1),
    ('Gondar', '{"en": "Gondar", "am": "ጎንደር"}'::jsonb, 'gondar', region_amhara_id, 2);

  -- benishangul-gumuz subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Assosa', '{"en": "Assosa", "am": "አሶሳ"}'::jsonb, 'assosa', region_bg_id, 1);

  -- central ethiopia subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Butajira', '{"en": "Butajira", "am": "ቡታጂራ"}'::jsonb, 'butajira', region_central_id, 1);

  -- gambela subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Gambela Zuria', '{"en": "Gambela Zuria", "am": "ጋምቤላ ዙሪያ"}'::jsonb, 'gambela-zuria', region_gambela_id, 1);

  -- harari subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Hakim', '{"en": "Hakim", "am": "ሃኪም"}'::jsonb, 'hakim', region_harari_id, 1);

  -- oromia subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Adama', '{"en": "Adama", "am": "አዳማ"}'::jsonb, 'adama', region_oromia_id, 1),
    ('Jimma', '{"en": "Jimma", "am": "ጅማ"}'::jsonb, 'jimma', region_oromia_id, 2),
    ('Bishoftu', '{"en": "Bishoftu", "am": "ብሾፍቱ"}'::jsonb, 'bishoftu', region_oromia_id, 3);

  -- sidama subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Hawassa', '{"en": "Hawassa", "am": "ሀዋሳ"}'::jsonb, 'hawassa', region_sidama_id, 1);

  -- somali subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Jigjiga', '{"en": "Jigjiga", "am": "ጅግጅጋ"}'::jsonb, 'jigjiga', region_somali_id, 1);

  -- south ethiopia subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Wolaita Sodo', '{"en": "Wolaita Sodo", "am": "ወላይታ ሶዶ"}'::jsonb, 'wolaita-sodo', region_south_id, 1);

  -- south west ethiopia peoples subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Bonga', '{"en": "Bonga", "am": "ቦንጋ"}'::jsonb, 'bonga', region_swpeoples_id, 1);

  -- tigray subcities
  insert into public.subcities (name, display_name, slug, region_id, display_order) values
    ('Mekelle', '{"en": "Mekelle", "am": "መቐለ"}'::jsonb, 'mekelle', region_tigray_id, 1);
end $$;

-- ============================================================================
-- enable rls
-- ============================================================================
alter table public.subcities enable row level security;

-- ============================================================================
-- rls policies for subcities
-- ============================================================================

-- allow public read access to active subcities
create policy "subcities_select_public"
  on public.subcities
  for select
  to public
  using (is_active = true);

-- allow authenticated users to read all subcities
create policy "subcities_select_authenticated"
  on public.subcities
  for select
  to authenticated
  using (true);

-- ============================================================================
-- grants
-- ============================================================================
grant select on public.subcities to anon, authenticated;
grant all on public.subcities to service_role;

