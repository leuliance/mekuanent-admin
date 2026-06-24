-- migration: create payment_gateways table
-- description: creates a table to store payment gateway configurations (Chapa, ArifPay, SantimPay, Telebirr)
-- author: system
-- date: 2024-12-13

-- Create payment_gateways table
create table public.payment_gateways (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  display_name jsonb not null default '{"am": "", "en": ""}'::jsonb,
  slug text not null unique,
  description jsonb default '{"am": "", "en": ""}'::jsonb,
  icon_url text,
  color text, -- hex color for UI display
  is_active boolean not null default true,
  api_key text, -- encrypted/stored securely
  webhook_secret text, -- for webhook verification
  test_mode boolean not null default true,
  config jsonb default '{}'::jsonb, -- additional gateway-specific config
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint payment_gateways_name_not_empty check (length(trim(name)) > 0),
  constraint payment_gateways_slug_not_empty check (length(trim(slug)) > 0),
  constraint payment_gateways_slug_format check (slug ~ '^[a-z0-9-]+$')
);

comment on table public.payment_gateways is 'Payment gateway configurations (Chapa, ArifPay, SantimPay, Telebirr, etc.)';
comment on column public.payment_gateways.slug is 'URL-friendly identifier (e.g., chapa, arifpay, santimpay, telebirr)';
comment on column public.payment_gateways.api_key is 'Gateway API key (should be encrypted in production)';
comment on column public.payment_gateways.webhook_secret is 'Secret for webhook verification';
comment on column public.payment_gateways.config is 'Gateway-specific configuration as JSON';

-- Enable RLS
alter table public.payment_gateways enable row level security;

-- RLS Policies
create policy "Payment gateways are viewable by everyone"
  on public.payment_gateways
  for select
  using (is_active = true);

-- Insert initial payment gateways
insert into public.payment_gateways (
  name,
  display_name,
  slug,
  description,
  color,
  is_active,
  test_mode,
  config
) values
  (
    'Chapa',
    '{"am": "ቻፓ", "en": "Chapa"}',
    'chapa',
    '{"am": "የቻፓ የክፍያ መንገድ", "en": "Chapa payment gateway"}',
    '#10B981', -- green
    true,
    true,
    '{}'::jsonb
  ),
  (
    'ArifPay',
    '{"am": "አሪፍፔይ", "en": "ArifPay"}',
    'arifpay',
    '{"am": "የአሪፍፔይ የክፍያ መንገድ", "en": "ArifPay payment gateway"}',
    '#3B82F6', -- blue
    true,
    true,
    '{}'::jsonb
  ),
  (
    'SantimPay',
    '{"am": "ሳንቲምፔይ", "en": "SantimPay"}',
    'santimpay',
    '{"am": "የሳንቲምፔይ የክፍያ መንገድ", "en": "SantimPay payment gateway"}',
    '#F59E0B', -- yellow/amber
    true,
    true,
    '{}'::jsonb
  ),
  (
    'Telebirr',
    '{"am": "ቴሌቢር", "en": "Telebirr"}',
    'telebirr',
    '{"am": "የቴሌቢር የክፍያ መንገድ", "en": "Telebirr payment gateway"}',
    '#EF4444', -- red
    true,
    true,
    '{}'::jsonb
  ),
  (
    'Card',
    '{"am": "ካርድ", "en": "Card"}',
    'card',
    '{"am": "የክሬዲት ካርድ ክፍያ", "en": "Credit/Debit card payment"}',
    '#6366F1', -- indigo
    true,
    true,
    '{}'::jsonb
  );

-- Update payments table to reference payment_gateways
-- Note: This assumes the payments table already exists
-- If payment_gateway column exists as text, we can add a foreign key reference
-- For now, we'll keep payment_gateway as text for flexibility

-- Grant permissions
grant select on public.payment_gateways to anon, authenticated;

