/*
 * migration: add story feature flag
 * description: 
 *   creates a global feature flag for story functionality
 *   when enabled, shows the story component on the home screen
 *   when disabled, hides the story component
 * author: system
 * date: 2024-12-01
 */

-- ============================================================================
-- insert story feature flag
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
  'story',
  '{"am": "ስቶሪ", "en": "Story"}',
  '{"am": "ስቶሪ ባህሪያትን ያንብባል", "en": "Enables story features on the home screen"}',
  'global',
  null,
  false,
  '62744e9b-2255-4acf-be3e-3af2736201eb',
  now(),
  now()
)
on conflict (key, church_id) do nothing;

comment on table public.feature_flags is 'platform and church-level feature toggles controlled by super admin';

