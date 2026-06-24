// @ts-nocheck — Deno runtime, not type-checked by the app TS compiler.
/**
 * Supabase Edge Function — Mekuannent push notification fanout.
 *
 * Triggered by a database trigger on `public.notifications` INSERT (see
 * `supabase/migrations/20260528000001_notifications_expo_push_trigger.sql`).
 * Receives one notification row and fans it out to every `is_active=true`
 * `push_tokens` row for the recipient via the Expo Push API.
 *
 * Why an edge function instead of doing it directly in Postgres?
 *   - We need to talk to api.exponent.com over HTTPS, batch up to 100
 *     messages per request, and parse a JSON response. `pg_net` *can*
 *     post JSON but parsing receipts to retire bad tokens is ugly in
 *     PL/pgSQL.
 *   - Edge functions have first-class secrets, retries, and logging.
 *   - The DB trigger stays a one-liner.
 *
 * Payload (sent from the DB trigger):
 *   {
 *     "notification_id": "uuid",
 *     "user_id": "uuid",
 *     "type": "new_event" | ...,
 *     "title_text": "...",
 *     "body_text":  "...",
 *     "data": { event_id: ..., ... },
 *     "is_silent": false
 *   }
 *
 * Response:
 *   202 { ok: true, queued: true, notification_id }    — fanout running
 *                                                        in background
 *   202 { ok: true, queued: false, skipped: <reason> } — bail (silent /
 *                                                        empty content)
 *
 * The handler ACKs in <50ms (no DB query, no Expo call) and uses
 * `EdgeRuntime.waitUntil()` to do the heavy fanout in the
 * background. This keeps pg_net's trigger-side timeout (~10s)
 * comfortable even on cold starts. Inspect the edge function's Logs
 * tab to see per-notification fanout results.
 *
 * Required secrets (set with `supabase secrets set ...`):
 *   SUPABASE_URL                (auto)
 *   SUPABASE_SERVICE_ROLE_KEY   (auto)
 *   EXPO_ACCESS_TOKEN           (optional — enhanced rate limits)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
const EXPO_BATCH_LIMIT = 100;

/**
 * Channel routing — duplicated client-side in
 * `src/constants/notification-channels.ts`. Keep the two in sync:
 * adding a notification type means updating both.
 *
 * The values here are channel ids (Android) / categories (iOS) and
 * match exactly what `setupNotificationChannels()` registers on the
 * device.
 */
const TYPE_TO_CHANNEL: Record<string, string> = {
    // Events
    new_event: "events",
    event_update: "events",
    event_reminder: "events",
    event_cancelled: "events",
    event_reminder_24h: "events",
    event_reminder_1h: "events",

    // RSVPs / co-hosting
    new_rsvp: "rsvps",
    rsvp_confirmed: "rsvps",
    rsvp_updated: "rsvps",
    rsvp_cancelled: "rsvps",
    co_host_invited: "rsvps",
    co_host_accepted: "rsvps",
    co_host_declined: "rsvps",

    // Donations
    donation_received: "donations",
    new_donation: "donations",
    new_campaign: "donations",
    donation_milestone: "donations",
    donation_goal_reached: "donations",
    donation_exceeded: "donations",
    donation_campaign_update: "donations",
    campaign_goal_changed: "donations",

    // Content
    new_content: "content",
    content_pending: "content",
    content_approved: "content",
    content_rejected: "content",

    // Social
    new_follower: "social",

    // Roles
    role_invitation: "system",

    // Wallet
    wallet_deposit: "wallet",
    wallet_withdrawal: "wallet",

    // Spiritual
    verse_of_day: "spiritual",
    prayer_request: "spiritual",
    fasting_reminder: "spiritual",

    // System
    church_announcement: "system",
    system_message: "system",
    achievement: "system",
    admin_message: "system",
    new_announcement: "system",
};

/**
 * iOS interruption levels per channel — mirrors the client.
 * `timeSensitive` bypasses Focus modes; `passive` lands silently in
 * Notification Center.
 */
const CHANNEL_TO_PRIORITY: Record<string, "high" | "default" | "low"> = {
    events: "high",
    donations: "high",
    rsvps: "high",
    wallet: "high",
    system: "high",
    content: "default",
    social: "default",
    default: "default",
    spiritual: "low",
};

// NOTE: Expo's push API contract uses kebab-case for interruption
// levels (`time-sensitive`), even though the underlying iOS API uses
// camelCase (`timeSensitive`). Sending the camelCase value back fails
// Zod validation with:
//   "0.interruptionLevel": Invalid enum value.
//   Expected 'active' | 'critical' | 'passive' | 'time-sensitive'
const CHANNEL_TO_INTERRUPTION: Record<
    string,
    "active" | "time-sensitive" | "passive" | "critical"
> = {
    wallet: "time-sensitive",
    system: "time-sensitive",
    spiritual: "passive",
};

interface IncomingPayload {
    notification_id: string;
    user_id: string;
    type: string;
    title_text: string;
    body_text: string;
    data: Record<string, unknown> | null;
    is_silent: boolean;
}

interface ExpoPushMessage {
    to: string;
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
    sound?: "default" | null;
    channelId?: string;
    categoryId?: string;
    priority?: "default" | "normal" | "high";
    badge?: number;
    interruptionLevel?: "active" | "time-sensitive" | "passive" | "critical";
    mutableContent?: boolean;
    ttl?: number;
    _contentAvailable?: boolean;
}

interface ExpoPushTicket {
    status: "ok" | "error";
    id?: string;
    message?: string;
    details?: { error?: string };
}

interface ExpoPushResponse {
    data?: ExpoPushTicket[];
    errors?: Array<{ code: string; message: string }>;
}

const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
    });

/**
 * Chunk an array into windows of at most `size`.
 */
function chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size));
    }
    return out;
}

/**
 * Send one batch (≤100 messages) to Expo's push service. Returns the
 * raw ticket array, parallel to `messages`.
 *
 * Wraps `fetch` in an `AbortController` with a 20s timeout — Deno's
 * default fetch has no timeout, so a stuck Expo gateway would hang
 * the whole background task. 20s is well below Supabase Edge
 * Runtime's per-request limit but generous enough that healthy
 * deliveries (typ. 200–800ms) always complete.
 */
async function sendBatch(
    messages: ExpoPushMessage[],
    accessToken: string | null,
): Promise<ExpoPushTicket[]> {
    const headers: Record<string, string> = {
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
    };
    if (accessToken) {
        headers.authorization = `Bearer ${accessToken}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);

    let res: Response;
    try {
        res = await fetch(EXPO_PUSH_ENDPOINT, {
            method: "POST",
            headers,
            body: JSON.stringify(messages),
            signal: controller.signal,
        });
    } catch (e) {
        clearTimeout(timer);
        console.error(
            `[send-push] Expo push API fetch failed: ${(e as Error)?.message}`,
        );
        return messages.map((_) => ({
            status: "error" as const,
            message: `fetch failed: ${(e as Error)?.message}`,
        }));
    }
    clearTimeout(timer);

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(
            `[send-push] Expo push API returned ${res.status}: ${text}`,
        );
        return messages.map((_) => ({
            status: "error" as const,
            message: `Expo API ${res.status}`,
        }));
    }

    const body = (await res.json()) as ExpoPushResponse;
    if (body.errors?.length) {
        console.warn("[send-push] Expo returned top-level errors:", body.errors);
    }
    return body.data ?? [];
}

/**
 * The heavy fanout — DB lookups + Expo Push API calls + retire dead
 * tokens. Runs in the background via `EdgeRuntime.waitUntil()` so
 * pg_net (the DB trigger that invoked us) gets its 200 response in
 * <50ms and never times out.
 */
async function fanout(payload: IncomingPayload, env: {
    supabaseUrl: string;
    serviceRoleKey: string;
    expoAccessToken: string | null;
}): Promise<void> {
    const { notification_id, user_id, type, title_text, body_text, data } =
        payload;

    const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: tokens, error: tokenErr } = await supabase
        .from("push_tokens")
        .select("id, token, platform")
        .eq("user_id", user_id)
        .eq("is_active", true);

    if (tokenErr) {
        console.error(
            `[send-push] token lookup failed for notification ${notification_id}:`,
            tokenErr.message,
        );
        return;
    }
    if (!tokens?.length) {
        console.log(
            `[send-push] no active tokens for user ${user_id} (notification ${notification_id})`,
        );
        return;
    }

    const channel = TYPE_TO_CHANNEL[type] ?? "default";
    const priority = CHANNEL_TO_PRIORITY[channel] ?? "default";
    const interruption = CHANNEL_TO_INTERRUPTION[channel];

    const pushData = {
        type,
        notification_id,
        data: data ?? {},
    };

    const expoTokens = tokens.filter((row) =>
        row.token?.startsWith("ExponentPushToken") ||
        row.token?.startsWith("ExpoPushToken")
    );
    if (expoTokens.length === 0) {
        console.log(
            `[send-push] tokens present but none are Expo-format for ${user_id}`,
        );
        return;
    }

    const messages: ExpoPushMessage[] = expoTokens.map((row) => ({
        to: row.token,
        title: title_text || undefined,
        body: body_text || undefined,
        data: pushData,
        sound: "default",
        channelId: channel,
        categoryId: channel,
        priority,
        interruptionLevel: interruption,
        mutableContent: true,
        ttl: 3600,
    }));

    const batches = chunk(
        messages.map((m, i) => ({ message: m, token: expoTokens[i] })),
        EXPO_BATCH_LIMIT,
    );

    const retirements: string[] = [];
    let sent = 0;
    for (const batch of batches) {
        const tickets = await sendBatch(
            batch.map((b) => b.message),
            env.expoAccessToken,
        );
        tickets.forEach((ticket, idx) => {
            if (ticket.status === "ok") {
                sent += 1;
            } else if (
                ticket.details?.error === "DeviceNotRegistered" ||
                ticket.message?.toLowerCase().includes(
                    "not a registered push notification recipient",
                )
            ) {
                retirements.push(batch[idx].token.token);
            } else if (ticket.status === "error") {
                console.warn(
                    `[send-push] ticket error for notification ${notification_id}:`,
                    ticket.details?.error,
                    ticket.message,
                );
            }
        });
    }

    if (retirements.length > 0) {
        const { error: retireErr } = await supabase
            .from("push_tokens")
            .update({ is_active: false })
            .in("token", retirements);
        if (retireErr) {
            console.warn(
                "[send-push] failed to retire dead tokens:",
                retireErr.message,
            );
        }
    }

    console.log(
        `[send-push] fanout done — notification=${notification_id} sent=${sent} retired=${retirements.length}`,
    );
}

// `EdgeRuntime.waitUntil` keeps the worker alive after `Deno.serve`'s
// handler returns, so pg_net (the DB trigger that invoked us) gets a
// fast 202 response and never trips its 5s timeout. Declared as a
// loose `any` because the type isn't in @types/deno but the symbol
// IS present at runtime on Supabase Edge Runtime.
// deno-lint-ignore no-explicit-any
declare const EdgeRuntime: any;

Deno.serve(async (req) => {
    if (req.method !== "POST") {
        return json(405, { error: "method not allowed" });
    }

    let payload: IncomingPayload;
    try {
        payload = (await req.json()) as IncomingPayload;
    } catch {
        return json(400, { error: "invalid json body" });
    }

    const { user_id, type, title_text, body_text, is_silent } = payload;

    if (!user_id || !type) {
        return json(400, { error: "user_id and type are required" });
    }

    // Silent rows live in the in-app inbox but should NEVER ring a
    // device. Acknowledge and exit.
    if (is_silent) {
        return json(202, { ok: true, queued: false, skipped: "silent" });
    }

    // Empty content is the other "definitely don't push" case — the
    // user would see a blank banner.
    if (!title_text?.trim() && !body_text?.trim()) {
        return json(202, {
            ok: true,
            queued: false,
            skipped: "empty-content",
        });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
        return json(500, { error: "supabase env not configured" });
    }
    const expoAccessToken = Deno.env.get("EXPO_ACCESS_TOKEN") ?? null;

    // Hand off the heavy work. The handler returns immediately;
    // Supabase keeps the worker alive until this promise settles.
    const work = fanout(payload, {
        supabaseUrl,
        serviceRoleKey,
        expoAccessToken,
    }).catch((e) =>
        console.error(
            `[send-push] fanout threw for notification ${payload.notification_id}:`,
            e,
        )
    );

    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
        EdgeRuntime.waitUntil(work);
    }
    // If the runtime ever lacks waitUntil (e.g. local `supabase
    // functions serve`), we still kicked off `work` above — Deno's
    // event loop will keep it alive until it settles.

    return json(202, {
        ok: true,
        queued: true,
        notification_id: payload.notification_id,
    });
});
