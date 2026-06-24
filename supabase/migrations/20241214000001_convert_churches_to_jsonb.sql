-- migration: convert churches and events text fields to jsonb
-- description: converts name, address, city, state, country to jsonb for multilingual support
-- author: system
-- date: 2024-12-14

-- ============================================================================
-- step 1: alter churches table columns from text to jsonb
-- ============================================================================

-- convert name from text to jsonb
alter table public.churches 
  alter column name type jsonb using jsonb_build_object('am', name, 'en', name);

-- add constraint for name to require amharic
alter table public.churches
  add constraint churches_name_has_amharic check (name ? 'am' and name->>'am' is not null),
  add constraint churches_name_has_english check (name ? 'en' and name->>'en' is not null);

-- convert address from text to jsonb
alter table public.churches 
  alter column address type jsonb using case 
    when address is not null then jsonb_build_object('am', address, 'en', address)
    else null
  end;

-- convert city from text to jsonb
alter table public.churches 
  alter column city type jsonb using case 
    when city is not null then jsonb_build_object('am', city, 'en', city)
    else null
  end;

-- convert state from text to jsonb
alter table public.churches 
  alter column state type jsonb using case 
    when state is not null then jsonb_build_object('am', state, 'en', state)
    else null
  end;

-- convert country from text to jsonb with default
-- first drop the existing default
alter table public.churches 
  alter column country drop default;

-- then convert the type
alter table public.churches 
  alter column country type jsonb using case 
    when country is not null then jsonb_build_object('am', 'ኢትዮጵያ', 'en', country)
    else '{"am": "ኢትዮጵያ", "en": "Ethiopia"}'::jsonb
  end;

-- set new default for country
alter table public.churches
  alter column country set default '{"am": "ኢትዮጵያ", "en": "Ethiopia"}'::jsonb;

-- ============================================================================
-- step 2: alter events table address column to jsonb
-- ============================================================================

-- convert events address from text to jsonb
alter table public.events 
  alter column address type jsonb using case 
    when address is not null then jsonb_build_object('am', address, 'en', address)
    else null
  end;

-- ============================================================================
-- step 3: update comments
-- ============================================================================

comment on column public.churches.name is 'Multilingual church name with required Amharic and English translations';
comment on column public.churches.address is 'Multilingual address';
comment on column public.churches.city is 'Multilingual city name';
comment on column public.churches.state is 'Multilingual state/region name';
comment on column public.churches.country is 'Multilingual country name, defaults to Ethiopia';
comment on column public.events.address is 'Multilingual event address';

-- ============================================================================
-- summary
-- ============================================================================
-- this migration converts the following text columns to jsonb for multilingual support:
-- churches table:
--   - name (now required to have am and en keys)
--   - address
--   - city
--   - state
--   - country (defaults to Ethiopia in both languages)
-- events table:
--   - address

