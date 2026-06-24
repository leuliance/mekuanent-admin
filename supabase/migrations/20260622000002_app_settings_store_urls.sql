/*
 * Migration: app_settings — store listing URLs
 * ============================================================================
 * Adds two key/value rows to public.app_settings so the store links can be
 * edited from the admin app and read by clients (share sheets / update
 * prompts). The table, RLS (public read, super-admin write) and value jsonb
 * shape were created in 20260526000001.
 *
 * Values are jsonb strings seeded with the live store listings (App Store id
 * is a placeholder — replace `id000000000` with the real numeric id from
 * App Store Connect, or edit it later from the admin). Idempotent via
 * ON CONFLICT (key) DO NOTHING so re-running never clobbers an admin-edited URL.
 *
 * Author: System
 * Date: 2026-06-22
 */

INSERT INTO public.app_settings (key, value, description) VALUES
    ('play_store_url', '"https://play.google.com/store/apps/details?id=com.mekuannent.app"'::jsonb, 'Google Play store listing URL (used for share & update prompts).'),
    ('app_store_url',  '"https://apps.apple.com/app/mekuannent/id000000000"'::jsonb, 'Apple App Store listing URL (used for share & update prompts).')
ON CONFLICT (key) DO NOTHING;
