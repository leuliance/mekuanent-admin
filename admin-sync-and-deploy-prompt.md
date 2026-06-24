# Admin App — Backend Sync + Cloudflare Deploy Prompt

> **Paste this whole file into the AI coding agent that works on the ADMIN repo**
> (the existing TanStack Start admin app). It is written as actionable instructions.

## Goal

The admin app shares the **same Supabase database** as the Mekuannent mobile app, but
its types are stale. You must:

1. Re-sync the admin against the current backend schema.
2. Build the missing admin UI for new backend features (fasting calendar, reports
   moderation, shorts/new content types, donation category colors, new RPCs, R2 media).
3. Deploy the admin app to Cloudflare Workers at **`admin.mekuannent.app`**.

This doc was produced by diffing the mobile app's current types
(`src/types/database.types.ts`, the source of truth) against the admin's stale copy
(`_markdownsAndKey/admin-database.types.ts`). Treat the "What changed" section as a
checklist, but **always regenerate types from Supabase** to get column-exact truth.

---

## Step 0 — First thing: regenerate `database.types.ts`

Do this before writing any UI; everything else depends on it.

```bash
# Requires the Supabase CLI and the project ref / access token.
npx supabase login
npx supabase gen types typescript --project-id <YOUR_PROJECT_REF> --schema public > src/types/database.types.ts
# (or, if linked locally)
npx supabase gen types typescript --linked --schema public > src/types/database.types.ts
```

Then fix the resulting TypeScript errors across the admin — they will point you
straight at the renamed/added tables, columns, and enums listed below.

- [ ] `database.types.ts` regenerated from the live DB
- [ ] App compiles; broken references triaged into the tasks below

---

## Step 1 — What changed in the backend (schema diff)

> Confidence is noted per item. Anything marked **VERIFY** was inferred from the type
> diff and should be confirmed against the freshly generated types / the SQL migrations.

### 1a. Enum changes (high confidence)

| Enum | Change |
| --- | --- |
| `content_type` | **Added `"short"`.** Admin copy had `audio \| video \| room \| article \| story`; current adds `short`. (Note: `story` and `room` were already present in the admin copy, so those are **not** new.) |
| `notification_type` | **Added `"fasting_reminder"` and `"report_submitted"`** (appended after `event_reminder_1h`). |
| `user_role` | **CHANGED VALUES — breaking.** Admin copy: `super_admin, admin, church_admin, content_admin, content_creator, user`. Current: `super_admin, admin, manager, editor, contributor, viewer`. The role taxonomy was reworked. Audit every place the admin checks/render roles. **VERIFY** the exact mapping/migration of old→new roles. |
| `app_permission` *(NEW enum)* | `content.create, content.update, content.delete, content.approve, church.manage, users.manage, donations.manage, events.manage`. Backs the new `authorize()` RPC + `role_permissions` table. |
| `report_status` *(NEW enum)* | `pending, reviewing, resolved, dismissed, action_taken`. |
| `report_target_type` *(NEW enum)* | `event, donation, content, church`. |

### 1b. New tables (high confidence — present in current, absent in admin copy)

- `fasting_periods` — master fasting definitions (the "what").
- `fasting_occurrences` — per-Ethiopian-year concrete date ranges (the "when").
- `reports` — user-submitted reports.
- `report_reasons` — catalog of reasons per target type.
- `role_permissions` — maps `user_role` → `app_permission` (RBAC).
- `app_settings`
- `article_reading_progress`
- `audio_transcripts`
- `church_services`
- `content_item_topics`, `content_topics` — topic tagging for the teachings feed.
- `content_notes`, `content_saves` — saves/bookmarks + notes on content.
- `donation_allocations`, `donation_progress`
- `event_reminders`
- `service_settings`, `service_types`
- `space_kicks`, `space_role_assignments` — live room/space moderation.
- `video_lessons`
- View: `donation_paths` (**VERIFY** — appears as a relation/view in current types).

### 1c. Tables removed / renamed (present in admin copy, absent in current) — **VERIFY**

- `bible_bookmark_collections` — gone from current types.
- `bible_translations` — gone from current types.

Confirm whether these were dropped or renamed before deleting admin UI that uses them.

### 1d. Column changes on existing tables (high confidence unless noted)

- **`user_preferences`** — added notification toggles incl. **`notify_fasting`** and
  **`notify_reports`** (full current set: `notify_achievements, notify_co_hosting,
  notify_content_review, notify_donations, notify_events, notify_fasting,
  notify_followers, notify_new_content, notify_reminders, notify_reports, notify_rsvp,
  notify_verse_of_day, notify_wallet`). **VERIFY** which existed in the admin copy.
- **`donation_categories`** — has **`color` (text, nullable)** and `icon` (text,
  nullable). The `color` field drives category theming in the mobile app — add an editor.
- **`content_items`** — base row exposes `thumbnail_url`, `subtitle`, `share_count`,
  `save_count`, `like_count`, `view_count`, plus the new `content_type` values. Media
  URLs live on the per-type child tables (`audio_content.audio_url`,
  `video_content.*`, etc.), not on `content_items`.
- **Multilingual columns / R2 URLs** — **VERIFY.** In the current types some i18n fields
  read as `string` where the admin copy had `Json` (e.g. `audio_content.album_name`).
  Confirm against generated types; do not assume.

### 1e. New RPCs / functions (high confidence)

**Search (trigram / pg_trgm based):**
- `search_events(p_category?, p_limit?, p_offset?, search?)`
- `search_churches(p_category?, p_limit?, p_offset?, search?)`
- `search_campaigns(p_category?, p_church?, p_limit?, p_offset?, search?)`
- supporting: `show_limit()`, `show_trgm()`

**Fasting calendar:**
- `get_active_fasts(d)` → fasts active on a given date.
- `get_fasts_in_range(p_start, p_end)` → per-day fasting tiers/names across a range.
- `is_fasting_day(d)` → boolean.
- `ethiopian_to_gregorian(eth_year, eth_month, eth_day)` → date.
- `gregorian_to_ethiopian(d)` → `{ year, month, day }`.
- supporting: `ethiopian_year_of(d)`, `_fasting_is_weekly_excluded(...)`.

**Reports / moderation:**
- `can_report_target(p_target_type, p_target_id, p_user)` → boolean.
- `can_review_report(p_target_type, p_target_id, p_user)` → boolean (church-scoping —
  enforce in the admin UI so reviewers only see/act on reports they can review).
- `report_target_church(p_target_type, p_target_id)` → owning church id.

**RBAC / membership:**
- `authorize(requested_permission)` → boolean (uses `app_permission`).
- `assign_member_role(p_church_id, p_role, p_user_id)`.
- `is_admin`, `is_super_admin`.

**Teachings v2 / content:**
- `get_teachings_feed(p_content_type?, p_topic_slug?, p_saved_only?, p_limit?, p_offset?)`
  — returns enriched feed rows (topics, like/save flags, media durations).
- `toggle_content_save(p_content_item_id)`.
- `set_favorite_church`, `clear_favorite_church`.

**Spaces / rooms:** `is_space_moderator`, `list_expired_active_spaces`.

**Misc helpers:** `get_campaign_donors`, `get_campaign_donor_summaries`,
`get_donation_paths_with_campaigns`, `get_linked_bible_reference`, `lookup_referral_code`,
`diagnose_push_trigger`, `send_sms_hook`, `verify_otp_hook`, `cleanup_old_bot_sessions`,
`close_completed_events`, `expire_old_invitations`, `expire_old_stories`.

**Functions removed (admin copy only) — VERIFY:** `check_phone_exists`,
`decrement_like_count`, `get_church_admin_ids`.

- [ ] Schema diff reviewed; "What changed" reconciled against generated types

---

## Step 2 — What the admin needs to ADD (build tasks)

Each task has acceptance criteria. Implement against the regenerated types.

### Task A — Fasting Calendar management UI (NEW)

The mobile app **reads** fasting data; the admin **authors** it. Two tables:

- `fasting_periods` (the definition): `fasting_key` (stable slug), `name` (**jsonb,
  Amharic required**), `description` (jsonb), `type`, `severity`, `rules` (jsonb),
  `is_weekly`, `weekly_days` (text[]), `start_eth_month`/`start_eth_day`,
  `end_eth_month`/`end_eth_day`, `duration_days`, `sort_order`.
- `fasting_occurrences` (per-year concrete dates): `fasting_id` → `fasting_periods.id`,
  `ethiopian_year`, `start_gregorian_date`/`end_gregorian_date` (required),
  `start_eth_*`/`end_eth_*` (year/month/day), `notes` (jsonb).

**Acceptance criteria:**
- [ ] List + create + edit `fasting_periods` with a multilingual (jsonb) name/description
      editor; **Amharic name is required**, other locales optional.
- [ ] Per-period, manage `fasting_occurrences` by Ethiopian year, entering Ethiopian
      start/end dates; use `ethiopian_to_gregorian()` to populate the required
      `start_gregorian_date`/`end_gregorian_date` (or let the DB compute — VERIFY).
- [ ] Preview a date range with `get_fasts_in_range(p_start, p_end)` to validate authoring.
- [ ] Weekly fasts (e.g. Wed/Fri) handled via `is_weekly` + `weekly_days`.

### Task B — Reports moderation area (NEW)

Tables `reports` + `report_reasons`; enums `report_status`, `report_target_type`.

`reports` columns: `target_type`, `target_id`, `reason_key`, `description`,
`reporter_id`, `status`, `resolution_note`, `resolved_by`, `resolved_at`.

**Acceptance criteria:**
- [ ] List reports with filters by `status` and `target_type`; sort by `created_at`.
- [ ] Detail view resolves the target (event/donation/content/church) and shows the
      `report_reasons` label (jsonb) for the `reason_key`.
- [ ] Status change UI (`pending → reviewing → resolved/dismissed/action_taken`) that
      writes `resolution_note`, `resolved_by`, `resolved_at`.
- [ ] **Church-scoping enforced**: only show/allow actions where
      `can_review_report(target_type, target_id, currentUser)` is true. Use
      `report_target_church()` to display the owning church.
- [ ] Manage the `report_reasons` catalog (per `target_type`, jsonb `label`/`description`,
      `is_active`, `sort_order`).

### Task C — Shorts / new content types

`content_type` now includes `short` (plus existing `story`, `room`, `article`, `audio`,
`video`). Mobile has a dedicated shorts creation panel.

**Acceptance criteria:**
- [ ] Content create/edit supports `short` (and confirms `story`/`room` are handled).
- [ ] Shorts use the appropriate child media table (likely `video_content` — **VERIFY**
      against the mobile repo's `src/screens/admin/components/create/panels/short-panel.tsx`).
- [ ] Topic tagging via `content_topics` / `content_item_topics` is editable.

### Task D — Donation category colors

`donation_categories.color` (nullable text) drives category theming.

**Acceptance criteria:**
- [ ] Category editor includes a color picker writing `color` (and `icon`).

### Task D2 — App settings: store links (NEW)

`app_settings` is a key/value table (jsonb `value` per `key`, super-admin write via RLS).
The mobile app now reads two new keys used for share sheets and update prompts:

- `play_store_url` — Google Play listing URL.
- `app_store_url` — Apple App Store listing URL.

(Existing keys for reference: `app_version`, `min_supported_version`,
`donation_fee_percent`, `min_donation_amount`, `max_donation_amount`, `support_email`,
`support_phone`, `referral_points_per_signup`.)

**Acceptance criteria:**
- [ ] The app-settings editor exposes editable text fields for `play_store_url` and
      `app_store_url` (upsert into `app_settings` keyed by `key`, value as a JSON string).
- [ ] Values validate as URLs; saving is restricted to super-admins (RLS enforces this).

### Task E — Wire new RPCs

- [ ] Replace any client-side search with `search_events` / `search_churches` /
      `search_campaigns` (server-side, trigram-ranked, paginated).
- [ ] Use `get_teachings_feed` for content listing where appropriate.
- [ ] Gate privileged admin actions on `authorize(<app_permission>)` and the new
      `user_role` values; use `assign_member_role` for role changes.

### Task F — R2 media handling (**VERIFY** against mobile repo)

The backend moved media to **Cloudflare R2** (see the mobile repo's
`supabase/functions/r2-storage/`, `src/api/storage/r2-client.ts`,
`signed-image.ts`, `signed-audio.ts`). If the admin uploads/serves media:

**Acceptance criteria:**
- [ ] Admin uploads go through the same R2 path (presigned URLs / the `r2-storage`
      Edge Function) rather than the old Supabase Storage flow.
- [ ] Image/audio display uses signed URLs where required.
- [ ] Confirm the exact contract by reading the mobile repo's `src/api/storage/*`.

- [ ] User preferences screen (if any) exposes `notify_fasting` / `notify_reports`.

---

## Step 3 — Deploy the admin app to Cloudflare (`admin.mekuannent.app`)

> Verified against TanStack Start + Cloudflare official docs (2026). TanStack Start
> deploys via **Vite + the Cloudflare Vite plugin** to **Cloudflare Workers** (the
> older `cloudflare-pages` Nitro preset is deprecated in favor of this). Requires
> `@tanstack/react-start` **v1.138.0+**.

### 3.1 Install deps

```bash
npm i -D @cloudflare/vite-plugin wrangler
# (use pnpm/bun/yarn equivalently)
```

### 3.2 Configure Vite — Cloudflare plugin **before** `tanstackStart()`

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    viteReact(),
  ],
});
```

### 3.3 Add `wrangler.jsonc`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "mekuannent-admin",
  // Set to today's date when you run it (use the latest date).
  "compatibility_date": "2026-06-19",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  "observability": { "enabled": true },
  "routes": [
    { "pattern": "admin.mekuannent.app", "custom_domain": true }
  ]
}
```

> `custom_domain: true` makes Cloudflare auto-create the DNS record + TLS cert for the
> subdomain — no manual DNS needed **as long as `mekuannent.app` is an active zone in the
> same Cloudflare account**. If you instead use a `route` (e.g. `admin.mekuannent.app/*`
> with `zone_name`), you must pre-create a proxied (orange-cloud) DNS record yourself.

### 3.4 Update `package.json` scripts

```jsonc
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler deploy",
    "cf-typegen": "wrangler types"
  }
}
```

> Remove any old `"start": "node .output/server/index.mjs"` — Workers don't use it.
> Keep `wrangler` in **devDependencies** (CI installs dev deps).

### 3.5 Env vars / Supabase keys as Worker secrets

Workers inject env **per request** — `process.env.X` at module scope is `undefined`.
Read env inside handlers/middleware, or via the `cloudflare:workers` env binding.

```bash
# Secrets (never commit these):
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY   # server-only; never ship to client
```

- Client-exposed values (URL + anon key) can go via `VITE_`-prefixed build-time vars.
- The service-role key must stay server-side (server functions / middleware only).
- For local dev, put non-secret vars in `.dev.vars` (gitignored).

### 3.6 Custom domain / DNS for `admin.mekuannent.app`

- [ ] `mekuannent.app` is added as a **zone** in the target Cloudflare account.
- [ ] Using the `custom_domain: true` route above, `wrangler deploy` provisions the
      `admin.mekuannent.app` DNS record + cert automatically.
- [ ] (Alternative) In dashboard: Workers & Pages → your Worker → Settings → Domains &
      Routes → **Add Custom Domain** → `admin.mekuannent.app`.

### 3.7 Deploy

```bash
npx wrangler login
npm run deploy
# Verify:
npx wrangler whoami
```

### Deploy checklist

- [ ] `@cloudflare/vite-plugin` + `wrangler` installed (dev deps)
- [ ] `vite.config.ts` has `cloudflare()` before `tanstackStart()`
- [ ] `wrangler.jsonc` present with `main: @tanstack/react-start/server-entry`,
      recent `compatibility_date`, `nodejs_compat`
- [ ] `@tanstack/react-start` ≥ 1.138.0
- [ ] Secrets set (`SUPABASE_*`); service-role key kept server-only
- [ ] `admin.mekuannent.app` resolves over HTTPS and loads the app
- [ ] Auth + a few admin reads/writes verified against the shared Supabase

### Sources (verify if stale, today is 2026)

- Cloudflare framework guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/
- TanStack Start hosting: https://tanstack.com/start/latest/docs/framework/react/guide/hosting
- Wrangler config / routes: https://developers.cloudflare.com/workers/wrangler/configuration/
- Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
