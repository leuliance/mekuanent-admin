# fasting-reminders

Scheduled runner for the day-before Ethiopian Orthodox fasting reminder.

## What it does

POSTing to this function calls the Postgres RPC
`public.fn_send_fasting_reminders()`, which:

1. Finds the fasts that **begin tomorrow** (active on `current_date + 1` but
   not on `current_date`) using `public.get_active_fasts(...)`.
2. For every user with push enabled (`profiles.notification_enabled = true`),
   inserts one summarized notification via `public.create_notification(...)`
   with pref category `notify_fasting`.
3. The existing `trg_notifications_send_push` trigger then fans each row out
   to `send-push-notification` (Expo) via `pg_net`.

All audience/message logic lives in SQL — this function is just a trigger.

## Two ways to run the daily job

- **pg_cron (default):** migration `20260621000004_fasting_reminders_cron.sql`
  already schedules `fn_send_fasting_reminders()` at `15:00 UTC` (18:00 EAT).
  You do **not** need this edge function in that case.
- **This edge function:** invoke once a day from an external scheduler
  (Supabase Scheduled Functions, GitHub Actions cron, an uptime pinger, …) if
  you prefer edge logs/retries or pg_cron is unavailable.

## Secrets

| Name | Required | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | yes (auto) | |
| `SUPABASE_SERVICE_ROLE_KEY` | yes (auto) | |
| `FASTING_CRON_SECRET` | optional | If set, callers must send `Authorization: Bearer <secret>` or `x-cron-secret: <secret>`. |

## Example

```bash
curl -X POST "$SUPABASE_URL/functions/v1/fasting-reminders" \
  -H "Authorization: Bearer $FASTING_CRON_SECRET"
# -> { "ok": true, "ran": true }
```

## Phase-2 TODO (app side, out of scope for the backend)

- Add a `fasting_reminder` deep-link handler so tapping the push opens the
  redesigned fasting calendar on the relevant date.
- Surface the `notify_fasting` toggle on the notification-settings screen
  (the `user_preferences.notify_fasting` column already exists, default on).
- Mirror `fasting_reminder -> "spiritual"` in
  `src/constants/notification-channels.ts` if a dedicated channel is desired.
