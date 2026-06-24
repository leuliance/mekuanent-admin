// @ts-nocheck — Deno runtime, not type-checked by the app TS compiler.
/**
 * Supabase Edge Function — Mekuannent fasting-reminder runner.
 * ============================================================================
 * Thin scheduled entry point that triggers the day-before fasting reminders.
 *
 * WHY THIS EXISTS (and what it does NOT do)
 * --------------------------------------------------------------------------
 * The reminder *business logic* lives in Postgres as
 * `public.fn_send_fasting_reminders()` (migration 20260621000004). That
 * function finds the fasts that begin tomorrow and calls
 * `create_notification(...)` for each eligible user, which in turn fans out
 * to the existing `send-push-notification` edge function via the
 * `trg_notifications_send_push` trigger + pg_net. There is exactly ONE source
 * of truth for the audience + message — this function never duplicates it.
 *
 * Two equally valid ways to run the daily job:
 *   (A) pg_cron — already scheduled by the migration (15:00 UTC / 18:00 EAT).
 *       Nothing else required; this edge function is optional.
 *   (B) This edge function — invoke it once a day from an external scheduler
 *       (Supabase Scheduled Functions, GitHub Actions cron, an uptime pinger,
 *       etc.). Useful if pg_cron is unavailable on your plan, or if you want
 *       edge-function logs/retries around the run. It simply RPCs into
 *       `fn_send_fasting_reminders()` using the service role.
 *
 * Auth: send a POST with the service-role (or a configured CRON_SECRET) so a
 * random caller cannot trigger a fanout.
 *
 * Required secrets (already present for the push pipeline):
 *   SUPABASE_URL                (auto)
 *   SUPABASE_SERVICE_ROLE_KEY   (auto)
 * Optional:
 *   FASTING_CRON_SECRET         — if set, callers must send it as
 *                                 `Authorization: Bearer <secret>` or
 *                                 `x-cron-secret: <secret>`.
 *
 * Response:
 *   200 { ok: true,  ran: true }              — RPC executed
 *   401 { ok: false, error: "unauthorized" }  — bad/missing secret
 *   500 { ok: false, error: "..." }           — env missing / RPC failed
 *
 * PHASE-2 TODO (app wiring, out of scope here):
 *   • Add a `fasting_reminder` deep-link handler in the app so tapping the
 *     push opens the redesigned fasting calendar on the relevant date.
 *   • Surface a `notify_fasting` toggle on the in-app notification-settings
 *     screen (the DB column already exists & defaults on).
 *   • Mirror the `fasting_reminder -> "spiritual"` channel mapping in
 *     src/constants/notification-channels.ts if a dedicated channel is wanted.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "method not allowed" });
  }

  // Optional shared-secret gate so this can't be triggered by anyone.
  const cronSecret = Deno.env.get("FASTING_CRON_SECRET");
  if (cronSecret) {
    const auth = req.headers.get("authorization") ?? "";
    const headerSecret = req.headers.get("x-cron-secret") ??
      (auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : "");
    if (headerSecret !== cronSecret) {
      return json(401, { ok: false, error: "unauthorized" });
    }
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { ok: false, error: "supabase env not configured" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // All the logic (who, what, dedupe, push fanout) lives in the SQL function.
  const { error } = await supabase.rpc("fn_send_fasting_reminders");

  if (error) {
    console.error("[fasting-reminders] rpc failed:", error.message);
    return json(500, { ok: false, error: error.message });
  }

  console.log("[fasting-reminders] fn_send_fasting_reminders() ran OK");
  return json(200, { ok: true, ran: true });
});
