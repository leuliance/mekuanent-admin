/*
 * migration: add social media feature flag
 * description: 
 *   creates a global feature flag for social media functionality
 *   when enabled, shows social media features (rooms, teachings)
 *   when disabled, shows alternative feature order (churches, events, bible, teachings)
 * author: system
 * date: 2024-12-01
 */

-- ============================================================================
-- insert social media feature flag
-- ============================================================================

-- note: created_by should be set to a super admin user id
-- for now, using a placeholder that should be updated with actual super admin id
insert into public.feature_flags (
  key,
  name,
  description,
  scope,
  church_id,
  is_enabled,
  created_by,
  created_at,
  updated_at
) values (
  'social_media',
  '{"am": "ማህበራዊ ሚዲያ", "en": "Social Media"}',
  '{"am": "ማህበራዊ ሚዲያ ባህሪያትን ያንብባል (ክፍሎች, ትምህርቶች)", "en": "Enables social media features (rooms, teachings)"}',
  'global',
  null,
  true,
  '62744e9b-2255-4acf-be3e-3af2736201eb',
  now(),
  now()
)
on conflict (key, church_id) do nothing;

comment on table public.feature_flags is 'platform and church-level feature toggles controlled by super admin';

