-- =============================================================================
-- Migration: Spaces / Live Audio Rooms backed by 100ms
-- Date:     2026-05-23
-- Purpose:
--   Extend the existing `room_content` polymorphic content table with the
--   metadata we need to drive Clubhouse-style audio rooms via the 100ms SDK,
--   and add side tables for role assignments and kicks so moderators can
--   pre-designate hosts/moderators and persist boots across sessions.
--
-- High-level model:
--   room_content              — extended with hms_room_id / hms_template_id /
--                               recording_enabled / max_duration_seconds /
--                               cover_image_url. One room_content row =
--                               one 100ms room.
--   space_role_assignments    — design-time host/moderator picks done by the
--                               creator. Looked up when minting a join token
--                               to decide which 100ms role to grant the user.
--   space_kicks               — persistent kick list. The 100ms SDK only
--                               enforces a kick for the current session;
--                               this table makes it stick across rejoins.
--   service_settings          — generic key/value singleton store used by the
--                               hms-spaces edge function to cache the
--                               auto-provisioned audio-only template id.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Extend room_content with 100ms fields + cover image
-- -----------------------------------------------------------------------------
alter table public.room_content
    add column if not exists hms_room_id text,
    add column if not exists hms_template_id text,
    add column if not exists recording_enabled boolean not null default false,
    add column if not exists max_duration_seconds integer not null default 2700,
    add column if not exists cover_image_url text;

comment on column public.room_content.hms_room_id is
    '100ms server-side room id returned by POST /v2/rooms';
comment on column public.room_content.hms_template_id is
    '100ms template id used to provision this room (audio-only template)';
comment on column public.room_content.recording_enabled is
    'Whether SFU recording is allowed for this room (only hosts/moderators can start)';
comment on column public.room_content.max_duration_seconds is
    'Auto-end the room after this many seconds (default 45 min = 2700s). Enforced server-side by 100ms AND by the expire-spaces cron.';

alter table public.room_content
    drop constraint if exists room_content_max_duration_valid;
alter table public.room_content
    add constraint room_content_max_duration_valid
    check (max_duration_seconds between 120 and 43200);

create unique index if not exists room_content_hms_room_id_idx
    on public.room_content (hms_room_id)
    where hms_room_id is not null;

create index if not exists room_content_room_status_idx
    on public.room_content (room_status);

-- -----------------------------------------------------------------------------
-- 2. Visibility: surface scheduled + live rooms even if content_items.status
--    is still 'draft'. We always set status='approved' from the edge function,
--    so this is belt-and-suspenders for legacy rows, but the policy needs to
--    permit it so listings work.
-- -----------------------------------------------------------------------------
drop policy if exists "Room content is viewable with content item" on public.room_content;

create policy "Active rooms are viewable by everyone"
    on public.room_content
    for select
    to anon, authenticated
    using (
        exists (
            select 1 from public.content_items ci
            where ci.id = room_content.id
              and (
                  ci.status = 'approved'
                  or room_content.room_status in ('scheduled', 'live')
              )
        )
    );

-- -----------------------------------------------------------------------------
-- 3. space_role_assignments — pre-assigned hosts / moderators
-- -----------------------------------------------------------------------------
create table if not exists public.space_role_assignments (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid not null references public.room_content(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    role text not null check (role in ('host', 'moderator')),
    assigned_by uuid references public.profiles(id) on delete set null,
    assigned_at timestamptz not null default now(),
    constraint space_role_assignments_unique unique (room_id, user_id)
);

comment on table public.space_role_assignments is
    'Pre-assigned host/moderator roles for an audio room. Consulted when minting 100ms auth tokens.';

create index if not exists space_role_assignments_room_idx
    on public.space_role_assignments (room_id);
create index if not exists space_role_assignments_user_idx
    on public.space_role_assignments (user_id);

alter table public.space_role_assignments enable row level security;

create policy "Space role assignments are viewable"
    on public.space_role_assignments
    for select
    to anon, authenticated
    using ( true );

create policy "Room creators and church admins manage assignments"
    on public.space_role_assignments
    for all
    to authenticated
    using (
        exists (
            select 1
            from public.room_content rc
            join public.content_items ci on ci.id = rc.id
            where rc.id = room_id
              and (
                  ci.created_by = (select auth.uid())
                  or (select public.is_church_admin((select auth.uid()), ci.church_id))
              )
        )
    )
    with check (
        exists (
            select 1
            from public.room_content rc
            join public.content_items ci on ci.id = rc.id
            where rc.id = room_id
              and (
                  ci.created_by = (select auth.uid())
                  or (select public.is_church_admin((select auth.uid()), ci.church_id))
              )
        )
    );

-- -----------------------------------------------------------------------------
-- 4. space_kicks — persistent boot list
--    The 100ms SDK only enforces a kick for the current session, so a kicked
--    listener could just rejoin. The hms-spaces edge function refuses to mint
--    a join token for any user with a row in this table.
-- -----------------------------------------------------------------------------
create table if not exists public.space_kicks (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid not null references public.room_content(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    kicked_by uuid references public.profiles(id) on delete set null,
    reason text,
    kicked_at timestamptz not null default now(),
    constraint space_kicks_unique unique (room_id, user_id)
);

comment on table public.space_kicks is
    'Persistent kick list. Users with a row here cannot rejoin the referenced room.';

create index if not exists space_kicks_room_idx on public.space_kicks (room_id);

alter table public.space_kicks enable row level security;

create policy "Kicks are visible to authenticated users"
    on public.space_kicks
    for select
    to authenticated
    using ( true );

-- All writes go through the hms-spaces edge function with the service role.

-- -----------------------------------------------------------------------------
-- 5. service_settings — generic singleton key/value
--    The hms-spaces edge function uses key='hms_audio_template' to cache the
--    100ms template_id of the auto-provisioned audio-only template so we
--    don't recreate it on every room.
-- -----------------------------------------------------------------------------
create table if not exists public.service_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz not null default now()
);

comment on table public.service_settings is
    'Generic key/value singleton store for edge-function-managed runtime config.';

drop trigger if exists update_service_settings_updated_at on public.service_settings;
create trigger update_service_settings_updated_at
    before update on public.service_settings
    for each row execute function public.update_updated_at();

alter table public.service_settings enable row level security;

create policy "Service settings readable by everyone"
    on public.service_settings
    for select
    to anon, authenticated
    using ( true );

-- No client write policies — service role only.

-- -----------------------------------------------------------------------------
-- 6. Helper: is a given user a host/moderator of a given room?
--    Returns TRUE if any of the following hold:
--      - they are the room's creator (always implicit host)
--      - they have a space_role_assignments row for the room
--      - they are a church_admin in the room's church
-- -----------------------------------------------------------------------------
create or replace function public.is_space_moderator(
    p_user_id uuid,
    p_room_id uuid
)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
    select
        exists (
            select 1
            from public.room_content rc
            join public.content_items ci on ci.id = rc.id
            where rc.id = p_room_id
              and ci.created_by = p_user_id
        )
        or exists (
            select 1
            from public.space_role_assignments sra
            where sra.room_id = p_room_id
              and sra.user_id = p_user_id
        )
        or exists (
            select 1
            from public.room_content rc
            join public.content_items ci on ci.id = rc.id
            where rc.id = p_room_id
              and public.is_church_admin(p_user_id, ci.church_id)
        );
$$;

comment on function public.is_space_moderator is
    'Returns true if the user is host/moderator/creator/church-admin for the room.';

-- -----------------------------------------------------------------------------
-- 7. Cron support: list spaces that have run past their max duration so the
--    expire-spaces edge function can end them on both 100ms and supabase.
-- -----------------------------------------------------------------------------
create or replace function public.list_expired_active_spaces()
returns table (
    room_id uuid,
    hms_room_id text,
    actual_start_time timestamptz,
    max_duration_seconds integer
)
language sql
stable
security definer
set search_path = ''
as $$
    select
        rc.id as room_id,
        rc.hms_room_id,
        rc.actual_start_time,
        rc.max_duration_seconds
    from public.room_content rc
    where rc.room_status = 'live'
      and rc.actual_start_time is not null
      and rc.hms_room_id is not null
      and (rc.actual_start_time + (rc.max_duration_seconds || ' seconds')::interval) <= now();
$$;

comment on function public.list_expired_active_spaces is
    'Returns live audio rooms that have exceeded their max_duration_seconds — used by the hms-spaces edge function cron job.';

-- -----------------------------------------------------------------------------
-- 8. Feature flag seed
-- -----------------------------------------------------------------------------
insert into public.feature_flags (
    key, name, description, scope, church_id, is_enabled, created_by, created_at, updated_at
)
select
    'spaces',
    '{"am": "የድምፅ ቤቶች", "en": "Live audio rooms"}'::jsonb,
    '{"am": "ቤተክርስቲያኖች የቀጥታ የድምፅ ቤቶችን እንዲፈጥሩ ያስችላል።", "en": "Allow churches to host live audio rooms backed by 100ms."}'::jsonb,
    'global',
    null,
    false,
    p.id,
    now(),
    now()
from public.profiles p
join public.user_roles ur on ur.user_id = p.id and ur.role = 'super_admin'
limit 1
on conflict (key, church_id) do nothing;
