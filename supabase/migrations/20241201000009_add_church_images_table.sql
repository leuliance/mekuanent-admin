/*
 * migration: add church images table
 * description: 
 *   creates a table to store multiple images for churches
 *   simple array of image urls with display order
 * author: system
 * date: 2024-12-01
 */

-- ============================================================================
-- church images table
-- ============================================================================

create table public.church_images (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references public.churches(id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint church_images_image_url_not_empty check (length(trim(image_url)) > 0),
  constraint church_images_display_order_non_negative check (display_order >= 0)
);

comment on table public.church_images is 'multiple images for churches';
comment on column public.church_images.church_id is 'reference to the church';
comment on column public.church_images.image_url is 'url of the image';
comment on column public.church_images.display_order is 'order in which images should be displayed (lower numbers first)';

-- ============================================================================
-- create indexes
-- ============================================================================

create index idx_church_images_church_id on public.church_images(church_id);
create index idx_church_images_display_order on public.church_images(church_id, display_order);

-- ============================================================================
-- enable rls (row level security)
-- ============================================================================

alter table public.church_images enable row level security;

-- rls policies will be created in a separate migration file
-- for now, allow all operations (will be restricted later)

-- ============================================================================
-- grant permissions
-- ============================================================================

grant select, insert, update, delete on public.church_images to authenticated;
grant select on public.church_images to anon;
