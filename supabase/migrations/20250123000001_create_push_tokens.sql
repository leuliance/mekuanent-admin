/*
 * Migration: Create Push Tokens Table
 * Description: Stores device push notification tokens for @notifee/react-native
 * Author: System
 * Date: 2025-01-23
 */

-- Create push_tokens table for storing device tokens
create table if not exists public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null,
  platform text not null check (platform in ('ios', 'android')),
  device_id text, -- Optional device identifier for managing multiple devices
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Ensure unique token per user (one token can only belong to one user)
  constraint push_tokens_token_unique unique (token)
);

comment on table public.push_tokens is 'Stores device push notification tokens for sending notifications';
comment on column public.push_tokens.token is 'FCM or APNs token for the device';
comment on column public.push_tokens.platform is 'Device platform (ios or android)';
comment on column public.push_tokens.device_id is 'Optional device identifier for multi-device management';
comment on column public.push_tokens.is_active is 'Whether this token is still valid';

-- Create index for faster lookups by user
create index if not exists idx_push_tokens_user_id on public.push_tokens(user_id);
create index if not exists idx_push_tokens_active on public.push_tokens(is_active) where is_active = true;

-- Enable RLS
alter table public.push_tokens enable row level security;

-- RLS Policies (drop if exists to avoid conflicts)
drop policy if exists "Users can view their own push tokens" on public.push_tokens;
drop policy if exists "Users can insert their own push tokens" on public.push_tokens;
drop policy if exists "Users can update their own push tokens" on public.push_tokens;
drop policy if exists "Users can delete their own push tokens" on public.push_tokens;

-- Users can only see their own push tokens
create policy "Users can view their own push tokens"
  on public.push_tokens for select
  using (auth.uid() = user_id);

-- Users can insert their own push tokens
create policy "Users can insert their own push tokens"
  on public.push_tokens for insert
  with check (auth.uid() = user_id);

-- Users can update their own push tokens
create policy "Users can update their own push tokens"
  on public.push_tokens for update
  using (auth.uid() = user_id);

-- Users can delete their own push tokens
create policy "Users can delete their own push tokens"
  on public.push_tokens for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.update_push_token_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updating updated_at (drop if exists)
drop trigger if exists push_tokens_updated_at on public.push_tokens;
create trigger push_tokens_updated_at
  before update on public.push_tokens
  for each row
  execute function public.update_push_token_updated_at();
