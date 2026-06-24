/*
 * migration: create region categories table
 * description: creates region_categories table for ethiopian regions and updates churches table
 * author: system
 * date: 2024-12-11
 * 
 * tables created:
 * - region_categories: ethiopian regions with metadata
 * 
 * tables modified:
 * - churches: adds region_id foreign key
 */

-- ============================================================================
-- region categories table
-- ============================================================================
create table public.region_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  display_name jsonb not null default '{"am": "", "en": ""}'::jsonb,
  slug text not null unique,
  description jsonb,
  color_start text not null,
  color_end text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint region_categories_name_not_empty check (length(trim(name)) > 0),
  constraint region_categories_slug_not_empty check (length(trim(slug)) > 0),
  constraint region_categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint region_categories_display_name_has_english check (display_name ? 'en' and display_name->>'en' is not null),
  constraint region_categories_color_start_format check (color_start ~ '^#[0-9A-Fa-f]{6}$'),
  constraint region_categories_color_end_format check (color_end ~ '^#[0-9A-Fa-f]{6}$')
);

comment on table public.region_categories is 'ethiopian regions with display metadata for regional categorization';
comment on column public.region_categories.name is 'official region name (e.g., "Addis Ababa", "Amhara")';
comment on column public.region_categories.display_name is 'multilingual display name with optional amharic translation';
comment on column public.region_categories.slug is 'url-friendly identifier (e.g., "addis-ababa")';
comment on column public.region_categories.color_start is 'gradient start color in hex format';
comment on column public.region_categories.color_end is 'gradient end color in hex format';
comment on column public.region_categories.display_order is 'sort order for display (lower numbers first)';

-- create index for common queries
create index region_categories_slug_idx on public.region_categories(slug);
create index region_categories_is_active_idx on public.region_categories(is_active);
create index region_categories_display_order_idx on public.region_categories(display_order);

-- ============================================================================
-- update churches table to add region_id
-- ============================================================================
alter table public.churches
  add column region_id uuid references public.region_categories(id);

comment on column public.churches.region_id is 'reference to region category for regional filtering';

-- create index for region lookups
create index churches_region_id_idx on public.churches(region_id);

-- ============================================================================
-- insert default ethiopian regions
-- ============================================================================
insert into public.region_categories (name, display_name, slug, color_start, color_end, display_order) values
  ('Addis Ababa', '{"en": "Addis Ababa", "am": "አዲስ አበባ"}'::jsonb, 'addis-ababa', '#7EC8FF', '#182135', 1),
  ('Dire Dawa', '{"en": "Dire Dawa", "am": "ድሬዳዋ"}'::jsonb, 'dire-dawa', '#2F3C4A', '#141826', 2),
  ('Afar', '{"en": "Afar Region", "am": "አፋር"}'::jsonb, 'afar', '#FFCF6E', '#2C1F12', 3),
  ('Amhara', '{"en": "Amhara Region", "am": "አማራ"}'::jsonb, 'amhara', '#80BBFF', '#1B2030', 4),
  ('Benishangul-Gumuz', '{"en": "Benishangul-Gumuz Region", "am": "በኒሻንጉል ጉሙዝ"}'::jsonb, 'benishangul-gumuz', '#8EE3A6', '#123428', 5),
  ('Central Ethiopia', '{"en": "Central Ethiopia Region", "am": "የመካከለኛ ኢትዮጵያ"}'::jsonb, 'central-ethiopia', '#9FA8FF', '#1E1B36', 6),
  ('Gambela', '{"en": "Gambela Region", "am": "ጋምቤላ"}'::jsonb, 'gambela', '#9AD8FF', '#163245', 7),
  ('Harari', '{"en": "Harari Region", "am": "ሐረሪ"}'::jsonb, 'harari', '#FFC1D6', '#3A1C2A', 8),
  ('Oromia', '{"en": "Oromia Region", "am": "ኦሮሚያ"}'::jsonb, 'oromia', '#FE9E8E', '#3A2228', 9),
  ('Sidama', '{"en": "Sidama Region", "am": "ሲዳማ"}'::jsonb, 'sidama', '#B5E48C', '#15331B', 10),
  ('Somali', '{"en": "Somali Region", "am": "ሶማሌ"}'::jsonb, 'somali', '#64DFDF', '#0E2D33', 11),
  ('South Ethiopia', '{"en": "South Ethiopia Region", "am": "የደቡብ ኢትዮጵያ"}'::jsonb, 'south-ethiopia', '#A1C4FD', '#2A3655', 12),
  ('South West Ethiopia Peoples', '{"en": "South West Ethiopia Peoples'' Region", "am": "ደቡብ ምዕራብ ኢትዮጵያ ሕዝቦች"}'::jsonb, 'south-west-ethiopia-peoples', '#FECF6B', '#3B2A10', 13),
  ('Tigray', '{"en": "Tigray Region", "am": "ትግራይ"}'::jsonb, 'tigray', '#3D4858', '#1B2030', 14);

-- ============================================================================
-- migrate existing church state data to region_id
-- ============================================================================
update public.churches
set region_id = region_categories.id
from public.region_categories
where churches.state = region_categories.name;

-- ============================================================================
-- enable rls
-- ============================================================================
alter table public.region_categories enable row level security;

-- ============================================================================
-- rls policies for region_categories
-- ============================================================================

-- allow public read access to active regions
create policy "region_categories_select_public"
  on public.region_categories
  for select
  to public
  using (is_active = true);

-- allow authenticated users to read all regions
create policy "region_categories_select_authenticated"
  on public.region_categories
  for select
  to authenticated
  using (true);

-- restrict insert/update/delete to super admins only
-- (super admin logic should be implemented in application layer)

-- ============================================================================
-- grants
-- ============================================================================
grant select on public.region_categories to anon, authenticated;
grant all on public.region_categories to service_role;

