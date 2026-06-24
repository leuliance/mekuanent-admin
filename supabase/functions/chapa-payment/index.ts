// @ts-nocheck — Deno runtime, not type-checked by the app TS compiler.
/**
 * Supabase Edge Function — Chapa payments for Mekuannent.
 *
 * Endpoints:
 *   POST  { action: "initialize", amount, user_id, return_url, campaign_id|event_id, ... }
 *   POST  { action: "verify",     tx_ref }
 *   POST  Chapa webhook (top-level `event`)
 *   GET   ?redirect=<deeplink>     302 to deeplink + branded HTML fallback
 *
 * Database model
 * --------------
 * `initialize` writes NOTHING to the database — we only call Chapa and return
 * the checkout URL + tx_ref. All donor metadata (user_id, campaign_id,
 * event_id, is_anonymous, message) is passed to Chapa as `meta` and round-trips
 * back to us on the verify response. This way "user opened the browser then
 * closed it without paying" leaves zero trace in the DB.
 *
 * On `verify` (or a webhook) we ask Chapa for the truth and reconcile:
 *   • pending  → no DB write at all (user hasn't finished, or Chapa is still
 *                deciding — there's just nothing to record yet).
 *   • success  → INSERT a `payments` row marked `completed`, then INSERT a
 *                single `donations` row so the campaign-totals trigger fires
 *                once. Both inserts are idempotent against tx_ref.
 *   • failed   → INSERT a `payments` row marked `failed` with the Chapa
 *                error message. No donation row.
 *
 * Required secrets (set with `supabase secrets set ...`):
 *   CHAPA_SECRET_KEY
 *   SUPABASE_URL                (auto)
 *   SUPABASE_SERVICE_ROLE_KEY   (auto)
 *
 * Deploy:
 *   supabase functions deploy chapa-payment --no-verify-jwt
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// ============================================================================
// Types
// ============================================================================

interface InitializeRequest {
    action: "initialize";
    amount: string | number;
    currency?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    callback_url?: string;
    return_url: string;
    campaign_id?: string;
    event_id?: string;
    user_id: string;
    is_anonymous?: boolean;
    /** Optional donor message — stored on the donation row on success. */
    message?: string | null;
    customization?: {
        title?: string;
        description?: string;
        logo?: string;
    };
}

interface VerifyRequest {
    action: "verify";
    tx_ref: string;
}

type Verdict = "success" | "failed" | "pending";

interface ChapaInitResp {
    status: string;
    message?: string;
    data: { checkout_url: string };
}

interface ChapaVerifyData {
    status?: string;
    payment_status?: string;
    tx_ref?: string;
    reference?: string;
    amount?: string | number;
    currency?: string;
    method?: string;
    mode?: string;
    type?: string;
    charge?: string | number;
    meta?: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
}

interface ChapaVerifyResp {
    status: string;
    message?: string;
    data?: ChapaVerifyData;
}

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

interface PaymentRow {
    id: string;
    user_id: string;
    amount: number;
    currency: string;
    status: string;
    payment_details: Record<string, unknown> | null;
}

// ============================================================================
// HTTP helpers
// ============================================================================

const CHAPA_BASE = "https://api.chapa.co/v1";

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-chapa-signature",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
} as const;

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", ...CORS },
    });
}

function errorResponse(message: string, status = 400): Response {
    return jsonResponse({ status: "failed", error: message }, status);
}

function generateTxRef(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 12; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MK-${suffix}`;
}

function trimToString(v: unknown): string | null {
    if (typeof v !== "string") return null;
    const t = v.trim();
    return t.length > 0 ? t : null;
}

/**
 * Chapa's `customization.title` / `customization.description` validators
 * only accept letters, numbers, hyphens, underscores, spaces, and dots.
 * That kicks out Amharic characters, colons, parentheses, etc. Strip
 * anything else and collapse whitespace so we always pass validation.
 */
function sanitizeForChapa(input: string | undefined | null, fallback: string): string {
    const raw = trimToString(input) ?? "";
    const cleaned = raw
        .replace(/[^A-Za-z0-9 _\-.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * Map Chapa wording → our 3-state verdict.
 *
 * Chapa is inconsistent — they return things like `"success"`, `"successful"`,
 * `"completed"`, but also compound statuses like `"failed/cancelled"` and
 * sometimes phrases like `"payment failed"`. Substring matching keeps us
 * robust against whatever they decide to call it next.
 */
function classify(raw: unknown): Verdict {
    if (typeof raw !== "string") return "pending";
    const s = raw.toLowerCase().trim();
    if (!s) return "pending";

    // Explicit pending-like statuses first so e.g. "pending failure check"
    // (hypothetically) doesn't get caught by the regex below.
    if (
        s === "pending" ||
        s === "processing" ||
        s === "initiated" ||
        s === "init"
    ) {
        return "pending";
    }

    if (/fail|cancel|decline|reject|void|abort|expired/.test(s)) return "failed";
    if (/success|complete|paid|accept|authoriz/.test(s)) return "success";
    return "pending";
}

/**
 * Read the payment verdict from a Chapa verify envelope.
 *
 * IMPORTANT: Chapa's top-level `status` field on the envelope means "did the
 * API call succeed?" (it's "success" on every 2xx response). The actual
 * payment outcome lives ONLY in `data.status` (and sometimes the alias
 * `data.payment_status`). Do NOT fall back to the envelope status — doing so
 * misclassifies "still pending" responses as paid.
 */
function verdictFromVerifyResp(resp: ChapaVerifyResp): Verdict {
    const d = resp.data ?? {};
    for (const candidate of [d.status, d.payment_status]) {
        const v = classify(candidate);
        if (v !== "pending") return v;
    }
    return "pending";
}

// ============================================================================
// Chapa API
// ============================================================================

async function chapaInitialize(
    secretKey: string,
    body: Record<string, unknown>,
): Promise<ChapaInitResp> {
    const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const txt = await res.text();
        console.error("[chapa] initialize failed:", res.status, txt.slice(0, 400));
        throw new Error(
            `Chapa initialize failed (${res.status}): ${txt.slice(0, 240)}`,
        );
    }
    return res.json();
}

/**
 * Verify a transaction with Chapa.
 *
 * Chapa's verify endpoint behavior we need to handle:
 *   - 200 + `data.status: "success" | "pending" | "failed"`  → real outcome
 *   - 4xx + `{ status: "failed", message: "..." }`           → payment failed
 *     (e.g. user entered an invalid phone or the channel rejected the tx)
 *   - 4xx + "transaction not found"                          → still pending
 *
 * We log the raw envelope at every call so the dashboard logs always show
 * exactly what Chapa returned for a given tx_ref.
 */
async function chapaVerify(
    secretKey: string,
    txRef: string,
): Promise<ChapaVerifyResp> {
    const res = await fetch(`${CHAPA_BASE}/transaction/verify/${txRef}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${secretKey}` },
    });

    const rawBody = await res.text();
    console.log(
        `[chapa] verify ${txRef} → http ${res.status} body=${rawBody.slice(0, 600)}`,
    );

    let parsed: ChapaVerifyResp | null = null;
    if (rawBody) {
        try {
            parsed = JSON.parse(rawBody) as ChapaVerifyResp;
        } catch (err) {
            console.warn(
                `[chapa] verify ${txRef} → unparseable body: ${(err as Error).message}`,
            );
        }
    }

    // 200 — trust the parsed envelope (caller will read data.status).
    if (res.ok) {
        if (parsed) return parsed;
        return {
            status: "pending",
            message: "pending",
            data: { status: "pending", tx_ref: txRef },
        };
    }

    // 4xx/5xx — Chapa often signals "transaction not found / not yet finalized"
    // this way (treat as pending), but they also use 4xx to report a failed
    // attempt. Probe the body to tell the difference instead of blanket-pending.
    const lower = rawBody.toLowerCase();
    const looksLikeFailure = parsed
        ? classify(parsed.status) === "failed" ||
          classify(parsed.data?.status) === "failed" ||
          classify(parsed.data?.payment_status) === "failed"
        : /failed|declined|rejected/.test(lower);

    if (looksLikeFailure) {
        console.warn(
            `[chapa] verify ${txRef} → http ${res.status} classified as FAILED`,
        );
        return parsed ?? {
            status: "failed",
            message: rawBody.slice(0, 200),
            data: { status: "failed", tx_ref: txRef },
        };
    }

    console.warn(
        `[chapa] verify ${txRef} → http ${res.status} treated as PENDING`,
    );
    return {
        status: "pending",
        message: "pending",
        data: { status: "pending", tx_ref: txRef },
    };
}

// ============================================================================
// Database
// ============================================================================

/** Postgres unique_violation code raised when our partial unique index
 *  on `payments(gateway_transaction_id) WHERE payment_gateway='chapa'`
 *  catches a verify-vs-webhook race. */
const PG_UNIQUE_VIOLATION = "23505";

/**
 * Lazily create a payment row at the moment Chapa gives us a definitive
 * verdict (success or failed). Donor context that we sent to Chapa as
 * `meta` during `initialize` round-trips back on `data.meta` and is
 * authoritative here — Chapa stores it for us so we don't have to.
 *
 * Idempotency: callers SHOULD first try `findPaymentByTxRef`. As a
 * defense-in-depth backstop, the `payments` table has a partial unique
 * index on `gateway_transaction_id` for chapa rows; if that fires
 * (because verify and webhook raced past the initial SELECT) we
 * gracefully reconcile to the surviving row instead of bubbling the
 * 23505 to the caller and creating a stale "verify failed" UX.
 */
async function insertPaymentFromVerify(
    supabase: SupabaseClient,
    args: {
        tx_ref: string;
        envelope: ChapaVerifyResp;
        status: "completed" | "failed";
        error_message: string | null;
    },
): Promise<PaymentRow> {
    const data = args.envelope.data ?? {};
    const meta = (data.meta ?? {}) as Record<string, unknown>;

    const userId = trimToString(meta.user_id);
    if (!userId) {
        throw new Error(
            `Cannot create payment: meta.user_id missing for tx_ref=${args.tx_ref}`,
        );
    }

    const amountNum = typeof data.amount === "number"
        ? data.amount
        : parseFloat(String(data.amount ?? "0"));
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
        throw new Error(
            `Cannot create payment: invalid amount for tx_ref=${args.tx_ref}`,
        );
    }
    const currency = typeof data.currency === "string" && data.currency
        ? data.currency
        : "ETB";
    const now = new Date().toISOString();

    const row: Record<string, unknown> = {
        user_id: userId,
        amount: amountNum,
        currency,
        payment_method: "mobile_money",
        payment_gateway: "chapa",
        status: args.status,
        gateway_reference: trimToString(data.reference),
        gateway_transaction_id: trimToString(data.tx_ref) ?? args.tx_ref,
        gateway_response: data,
        payment_details: {
            tx_ref: args.tx_ref,
            gateway: "chapa",
            campaign_id: trimToString(meta.campaign_id),
            event_id: trimToString(meta.event_id),
            is_anonymous: meta.is_anonymous === true,
            message: trimToString(meta.message),
        },
    };

    if (args.status === "completed") {
        row.completed_at = now;
    } else {
        row.failed_at = now;
        row.error_message = args.error_message;
    }

    const { data: inserted, error } = await supabase
        .from("payments")
        .insert(row)
        .select("id, user_id, amount, currency, status, payment_details")
        .single();

    if (!error) return inserted as PaymentRow;

    // Lost the verify-vs-webhook race — the other side already inserted
    // the row. Re-fetch and let the caller's `existing` branch handle it.
    if (error.code === PG_UNIQUE_VIOLATION) {
        console.log(
            `[insertPaymentFromVerify] tx_ref=${args.tx_ref} unique_violation — racing winner already inserted, reconciling to existing row`,
        );
        const winner = await findPaymentByTxRef(supabase, args.tx_ref);
        if (winner) return winner;
    }
    throw error;
}

async function findPaymentByTxRef(
    supabase: SupabaseClient,
    txRef: string,
): Promise<PaymentRow | null> {
    const { data, error } = await supabase
        .from("payments")
        .select("id, user_id, amount, currency, status, payment_details")
        .eq("payment_details->>tx_ref", txRef)
        .maybeSingle();

    if (error) throw error;
    return (data as PaymentRow | null) ?? null;
}

async function ensureDonationRow(
    supabase: SupabaseClient,
    payment: PaymentRow,
): Promise<string> {
    const meta = payment.payment_details ?? {};
    const campaignId = trimToString(meta.campaign_id);
    let eventId = trimToString(meta.event_id);

    if (campaignId && eventId) {
        // Donation rows have a CHECK constraint that allows exactly one of
        // campaign_id / event_id. Prefer campaign when both are set.
        eventId = null;
    }
    if (!campaignId && !eventId) {
        throw new Error(
            "Cannot create donation: missing campaign_id and event_id",
        );
    }

    const message = trimToString(meta.message);
    const isAnonymous = meta.is_anonymous === true;
    const now = new Date().toISOString();

    const { data: existing, error: findErr } = await supabase
        .from("donations")
        .select("id, status")
        .eq("payment_id", payment.id)
        .maybeSingle();
    if (findErr) throw findErr;

    if (existing) {
        if (existing.status !== "completed") {
            const { error: upErr } = await supabase
                .from("donations")
                .update({ status: "completed", completed_at: now })
                .eq("id", existing.id);
            if (upErr) throw upErr;
        }
        return existing.id;
    }

    const row: Record<string, unknown> = {
        user_id: payment.user_id,
        payment_id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: "completed",
        completed_at: now,
        is_anonymous: isAnonymous,
        message,
    };
    if (campaignId) row.campaign_id = campaignId;
    if (eventId) row.event_id = eventId;

    const { data: inserted, error: insErr } = await supabase
        .from("donations")
        .insert(row)
        .select("id")
        .single();
    if (!insErr) return (inserted as { id: string }).id;

    // Lost the verify-vs-webhook race for the donation row. The unique
    // index on donations.payment_id caught it — re-fetch the surviving
    // row and return its id so the caller's flow stays uniform.
    if (insErr.code === PG_UNIQUE_VIOLATION) {
        console.log(
            `[ensureDonationRow] payment_id=${payment.id} unique_violation — reconciling to existing donation`,
        );
        const { data: winner, error: refetchErr } = await supabase
            .from("donations")
            .select("id")
            .eq("payment_id", payment.id)
            .maybeSingle();
        if (!refetchErr && winner) return (winner as { id: string }).id;
    }
    throw insErr;
}

async function markPaymentCompleted(
    supabase: SupabaseClient,
    paymentId: string,
    data: ChapaVerifyData,
) {
    const { error } = await supabase
        .from("payments")
        .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            gateway_reference: trimToString(data.reference),
            gateway_transaction_id: trimToString(data.tx_ref),
            gateway_response: data,
            error_message: null,
        })
        .eq("id", paymentId);
    if (error) throw error;
}

async function markPaymentFailed(
    supabase: SupabaseClient,
    paymentId: string,
    data: ChapaVerifyData | null,
    reason: string,
) {
    const { error } = await supabase
        .from("payments")
        .update({
            status: "failed",
            failed_at: new Date().toISOString(),
            error_message: reason,
            gateway_reference: data ? trimToString(data.reference) : null,
            gateway_transaction_id: data ? trimToString(data.tx_ref) : null,
            gateway_response: data,
        })
        .eq("id", paymentId);
    if (error) throw error;
}

interface ReconcileResult {
    verdict: Verdict;
    payment_id?: string;
    donation_id?: string;
}

async function reconcile(
    supabase: SupabaseClient,
    txRef: string,
    envelope: ChapaVerifyResp,
): Promise<ReconcileResult> {
    const verdict = verdictFromVerifyResp(envelope);
    const data = envelope.data ?? {};
    console.log(
        `[reconcile] tx_ref=${txRef} envelope.status=${envelope.status} ` +
            `data.status=${data.status} data.payment_status=${data.payment_status} ` +
            `→ verdict=${verdict}`,
    );

    // Pending → there's nothing to record. The user hasn't completed the
    // checkout or Chapa hasn't decided yet; either way we don't want a
    // payment row in the DB until we have a definitive outcome.
    if (verdict === "pending") {
        console.log(`[reconcile] tx_ref=${txRef} pending — no DB write`);
        return { verdict: "pending" };
    }

    // Look up an existing row in case verify and webhook both fire for the
    // same tx_ref. The first one to reach this point inserts; the second
    // sees the row and short-circuits.
    const existing = await findPaymentByTxRef(supabase, txRef);

    if (existing) {
        console.log(
            `[reconcile] tx_ref=${txRef} found existing payment id=${existing.id} ` +
                `current_status=${existing.status}`,
        );
        if (existing.status === "completed") {
            const donation_id = await ensureDonationRow(supabase, existing);
            return {
                verdict: "success",
                payment_id: existing.id,
                donation_id,
            };
        }
        if (existing.status === "failed") {
            return { verdict: "failed", payment_id: existing.id };
        }
        // A row exists but isn't yet in a terminal state (legacy data from
        // an older deploy that still inserted pending rows). Flip it.
        if (verdict === "failed") {
            const reason = trimToString(envelope.message) ??
                trimToString(data.status) ??
                "Chapa reported a failed payment";
            await markPaymentFailed(supabase, existing.id, data, reason);
            return { verdict: "failed", payment_id: existing.id };
        }
        await markPaymentCompleted(supabase, existing.id, data);
        const donation_id = await ensureDonationRow(supabase, {
            ...existing,
            status: "completed",
        });
        return { verdict: "success", payment_id: existing.id, donation_id };
    }

    // No row yet — create one with the terminal status, hydrating donor
    // context from the `meta` Chapa returned to us.
    if (verdict === "failed") {
        const reason = trimToString(envelope.message) ??
            trimToString(data.status) ??
            "Chapa reported a failed payment";
        console.log(
            `[reconcile] tx_ref=${txRef} inserting FAILED payment: ${reason}`,
        );
        const payment = await insertPaymentFromVerify(supabase, {
            tx_ref: txRef,
            envelope,
            status: "failed",
            error_message: reason,
        });
        return { verdict: "failed", payment_id: payment.id };
    }

    console.log(
        `[reconcile] tx_ref=${txRef} inserting COMPLETED payment + donation`,
    );
    const payment = await insertPaymentFromVerify(supabase, {
        tx_ref: txRef,
        envelope,
        status: "completed",
        error_message: null,
    });
    const donation_id = await ensureDonationRow(supabase, payment);
    console.log(
        `[reconcile] tx_ref=${txRef} success — payment=${payment.id} donation=${donation_id}`,
    );
    return { verdict: "success", payment_id: payment.id, donation_id };
}

// ============================================================================
// Handlers
// ============================================================================

async function handleInitialize(
    req: InitializeRequest,
    secretKey: string,
): Promise<Response> {
    if (!req.user_id || !req.return_url || req.amount == null) {
        return errorResponse(
            "Missing required fields: amount, user_id, return_url",
        );
    }
    if (!req.campaign_id && !req.event_id) {
        return errorResponse("Either campaign_id or event_id is required");
    }

    const amountNum = typeof req.amount === "number"
        ? req.amount
        : parseFloat(String(req.amount));
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
        return errorResponse("amount must be a positive number");
    }

    const currency = req.currency ?? "ETB";
    const txRef = generateTxRef();

    try {
        // Chapa requires an HTTP/HTTPS return_url. Wrap native deeplinks in
        // our GET bounce so the OS, not the in-app browser, performs the
        // scheme switch (in-app browsers block JS-initiated cross-scheme
        // navigations for security).
        let returnUrl = req.return_url;
        if (
            !returnUrl.startsWith("http://") &&
            !returnUrl.startsWith("https://")
        ) {
            const base = `${Deno.env.get("SUPABASE_URL")}/functions/v1/chapa-payment`;
            returnUrl = `${base}?redirect=${encodeURIComponent(returnUrl)}`;
        }

        // Chapa's title field is capped at 16 chars and (along with
        // description) only accepts ASCII letters/numbers/dashes/dots/etc.
        // Sanitize before sending or Chapa rejects the request with a 400.
        const customization = {
            title: sanitizeForChapa(req.customization?.title, "Mekuannent").substring(0, 16),
            description: sanitizeForChapa(
                req.customization?.description,
                "Church donation",
            ),
            logo: req.customization?.logo,
        };

        // All donor context goes into Chapa's `meta` and round-trips back
        // on `verify` / webhook. This is what lets us avoid writing a
        // pending row up front: Chapa is our source of truth for what was
        // attempted, and we only persist if/when it becomes terminal.
        const chapaResp = await chapaInitialize(secretKey, {
            amount: String(amountNum),
            currency,
            email: req.email,
            first_name: req.first_name,
            last_name: req.last_name,
            phone_number: req.phone_number,
            tx_ref: txRef,
            callback_url: req.callback_url,
            return_url: returnUrl,
            customization,
            meta: {
                campaign_id: req.campaign_id,
                event_id: req.event_id,
                user_id: req.user_id,
                is_anonymous: req.is_anonymous === true,
                message: trimToString(req.message),
            },
        });

        return jsonResponse({
            status: "success",
            message: "Payment initialized",
            data: {
                checkout_url: chapaResp.data.checkout_url,
                tx_ref: txRef,
            },
        });
    } catch (err) {
        console.error("[handleInitialize]", err);
        return errorResponse(
            err instanceof Error ? err.message : "Failed to initialize payment",
            500,
        );
    }
}

async function handleVerify(
    req: VerifyRequest,
    secretKey: string,
    supabase: SupabaseClient,
): Promise<Response> {
    const txRef = trimToString(req.tx_ref);
    if (!txRef) return errorResponse("Missing tx_ref");

    console.log(`[handleVerify] tx_ref=${txRef} START`);
    try {
        const envelope = await chapaVerify(secretKey, txRef);
        const result = await reconcile(supabase, txRef, envelope);
        const d = envelope.data ?? {};

        console.log(
            `[handleVerify] tx_ref=${txRef} DONE → verdict=${result.verdict} ` +
                `payment_id=${result.payment_id ?? "-"} ` +
                `donation_id=${result.donation_id ?? "-"}`,
        );

        return jsonResponse({
            status: "success",
            message: "Payment verified",
            data: {
                tx_ref: txRef,
                payment_status: result.verdict,
                amount: d.amount ?? "0",
                currency: d.currency ?? "ETB",
                method: d.method ?? null,
                reference: d.reference ?? null,
                payment_id: result.payment_id ?? null,
                donation_id: result.donation_id ?? null,
                verified_at: new Date().toISOString(),
            },
        });
    } catch (err) {
        console.error(`[handleVerify] tx_ref=${txRef} ERROR`, err);
        return errorResponse(
            err instanceof Error ? err.message : "Failed to verify payment",
            500,
        );
    }
}

async function handleWebhook(
    payload: Record<string, unknown>,
    supabase: SupabaseClient,
): Promise<Response> {
    const txRef = trimToString(payload.tx_ref);
    console.log(
        "[webhook]",
        JSON.stringify({
            event: payload.event,
            status: payload.status,
            tx_ref: txRef,
        }),
    );
    if (!txRef) return errorResponse("Invalid webhook: missing tx_ref");

    const data: ChapaVerifyData = {
        status: typeof payload.status === "string" ? payload.status : "pending",
        currency: typeof payload.currency === "string"
            ? payload.currency
            : "ETB",
        amount: payload.amount as string | number | undefined,
        charge: payload.charge as string | number | undefined,
        tx_ref: txRef,
        reference: trimToString(payload.reference) ?? undefined,
        method: trimToString(payload.method) ?? undefined,
        mode: trimToString(payload.mode) ?? undefined,
        type: trimToString(payload.type) ?? undefined,
        meta: payload.meta as Record<string, unknown> | undefined,
    };

    try {
        await reconcile(supabase, txRef, {
            status: typeof payload.status === "string" ? payload.status : "pending",
            message: typeof payload.message === "string" ? payload.message : "",
            data,
        });
        return jsonResponse({ status: "success", message: "Webhook processed" });
    } catch (err) {
        console.error("[handleWebhook]", err);
        // Always 200 so Chapa doesn't keep retrying a failure that's on our side.
        return jsonResponse({
            status: "error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
}

// ============================================================================
// GET — bounce back to the app via the OS-level scheme handler
// ============================================================================
//
// We can't return a 200 + JS that does `window.location = "mekuannent://..."`
// because modern Custom Tabs / SFSafariViewController block JS-initiated
// cross-scheme navigations. A 3xx with a custom-scheme `Location` header IS
// honored — the OS hands the URL to the registered app and the in-app
// browser auto-dismisses. The HTML is only rendered when the redirect fails
// (e.g. desktop browser, app not installed), and acts as a polished fallback.

function buildBounceResponse(target: string): Response {
    const safeAttr = target
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
    const jsonTarget = JSON.stringify(target);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<meta http-equiv="refresh" content="0;url=${safeAttr}" />
<meta name="theme-color" content="#016B37" />
<title>Returning to Mekuannent</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(180deg, #0E1A12 0%, #1A2E22 100%);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    min-height: 100vh;
  }
  .card {
    width: 100%;
    max-width: 360px;
    border-radius: 24px;
    box-shadow: 0 16px 40px rgba(1, 107, 55, 0.25);
    padding: 32px 24px;
    text-align: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
  }
  .badge {
    width: 64px; height: 64px;
    margin: 0 auto 20px;
    border-radius: 20px;
    background: #016B37;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 800;
  }
  h1 { font-size: 20px; margin: 0 0 8px; font-weight: 700; }
  p { color: #B6C2BD; margin: 0 0 24px; font-size: 14px; line-height: 1.5; }
  .cta {
    display: inline-block;
    background: #FFFFFF; color: #0E1A12 !important;
    padding: 14px 28px; border-radius: 14px;
    text-decoration: none; font-weight: 700; font-size: 15px;
  }
  .spinner {
    width: 20px; height: 20px;
    border: 3px solid rgba(255,255,255,0.2);
    border-top-color: #34D399;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    display: inline-block; vertical-align: middle; margin-right: 10px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  iframe { display: none; }
</style>
</head>
<body>
  <div class="card">
    <div class="badge">M</div>
    <h1><span class="spinner"></span>Returning to Mekuannent</h1>
    <p>If the app doesn't open automatically, tap below.</p>
    <a class="cta" id="link" href="${safeAttr}">Open Mekuannent</a>
  </div>
  <iframe id="bounce" src="${safeAttr}" aria-hidden="true"></iframe>
  <script>
    (function () {
      var target = ${jsonTarget};
      function go() { try { window.location.replace(target); } catch (e) {} }
      go();
      setTimeout(function () {
        var a = document.getElementById("link");
        if (a && typeof a.click === "function") try { a.click(); } catch (e) {}
      }, 80);
      setTimeout(function () { try { window.location.href = target; } catch (e) {} }, 400);
    })();
  </script>
</body>
</html>`;

    return new Response(html, {
        status: 302,
        headers: {
            location: target,
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
            ...CORS,
        },
    });
}

// ============================================================================
// Serve
// ============================================================================

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS });
    }

    if (req.method === "GET") {
        const url = new URL(req.url);
        const redirect = url.searchParams.get("redirect");
        if (!redirect) {
            return new Response("Missing redirect target", {
                status: 400,
                headers: { "content-type": "text/plain; charset=utf-8" },
            });
        }
        // Pass through any query params Chapa appends (status, trx_ref, …)
        // so the app can react when it relaunches.
        const passthrough = new URLSearchParams();
        for (const [k, v] of url.searchParams) {
            if (k !== "redirect") passthrough.set(k, v);
        }
        const extra = passthrough.toString();
        const target = extra
            ? redirect + (redirect.includes("?") ? "&" : "?") + extra
            : redirect;
        return buildBounceResponse(target);
    }

    if (req.method !== "POST") {
        return errorResponse("Method not allowed", 405);
    }

    const CHAPA_SECRET_KEY = Deno.env.get("CHAPA_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!CHAPA_SECRET_KEY) {
        console.error("CHAPA_SECRET_KEY not configured");
        return errorResponse("Payment service not configured", 500);
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return errorResponse("Database service not configured", 500);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let body: Record<string, unknown>;
    try {
        body = (await req.json()) as Record<string, unknown>;
    } catch {
        return errorResponse("Invalid JSON body");
    }

    // Webhooks always carry a top-level `event` field.
    if (typeof body.event === "string" && body.event.length > 0) {
        return handleWebhook(body, supabase);
    }

    switch (body.action) {
        case "initialize":
            return handleInitialize(
                body as unknown as InitializeRequest,
                CHAPA_SECRET_KEY,
            );
        case "verify":
            return handleVerify(
                body as unknown as VerifyRequest,
                CHAPA_SECRET_KEY,
                supabase,
            );
        default:
            return errorResponse(
                "Invalid action. Supported actions: initialize, verify",
            );
    }
});
