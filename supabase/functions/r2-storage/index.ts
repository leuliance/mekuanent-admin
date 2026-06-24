// @ts-nocheck — Deno runtime, not type-checked by the app TS compiler.
/**
 * Supabase Edge Function — Cloudflare R2 media gateway for Mekuannent.
 *
 * The app uploads bytes DIRECTLY to R2 using a presigned PUT URL minted here,
 * so we never proxy large media (videos can be ~1 GB) through the function.
 * Delete / sign / list are small S3 calls we make server-side.
 *
 * Endpoints (POST application/json, `{ action, ... }`):
 *   create-upload       { prefix, filename, contentType, visibility?, key? }
 *                       -> { uploadUrl, key, publicUrl }
 *   create-multipart    { prefix, filename, contentType, visibility?, key? }
 *                       -> { key, uploadId, publicUrl }    (large/resumable upload)
 *   sign-part           { key, uploadId, partNumber, visibility? }
 *                       -> { url }                          (presigned UploadPart PUT)
 *   complete-multipart  { key, uploadId, parts:[{partNumber,etag}], visibility? }
 *                       -> { key, publicUrl }
 *   abort-multipart     { key, uploadId, visibility? }     -> { success }
 *   delete              { key, visibility? }               -> { success }
 *   sign                { key, expiresIn? }                -> { url, expiresIn }  (private reads)
 *   list                { prefix?, cursor?, limit? }       -> { objects, truncated, cursor }  (admin only)
 *
 * Two buckets:
 *   - R2_PUBLIC_BUCKET   public, fronted by R2_PUBLIC_BASE_URL custom domain
 *   - R2_PRIVATE_BUCKET  private, read via short-lived presigned GET URLs
 *
 * Required secrets (set with `supabase secrets set ...`):
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_PUBLIC_BUCKET
 *   R2_PRIVATE_BUCKET
 *   R2_PUBLIC_BASE_URL          (e.g. https://media.mekuannent.app)
 *   SUPABASE_URL                (auto)
 *   SUPABASE_ANON_KEY           (auto)
 *
 * Deploy (keep JWT verification ON — unlike chapa-payment):
 *   supabase functions deploy r2-storage
 */

import { AwsClient } from "https://esm.sh/aws4fetch@1.0.20";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// ============================================================================
// Constants / HTTP helpers
// ============================================================================

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
} as const;

/** Object-key prefixes the client is allowed to write under. */
const ALLOWED_PREFIXES = new Set([
    "videos",
    "shorts",
    "audios",
    "video-thumbnails",
    "audio-thumbnails",
    "article-thumbnails",
    "campaign-images",
    "event-images",
    "church-images",
    "avatars",
    "static",
]);

/** Prefixes only an admin may write to. */
const ADMIN_ONLY_PREFIXES = new Set(["static"]);

/** Roles considered "admin" for list / static writes. */
const ADMIN_ROLES = new Set(["super_admin", "admin", "manager"]);

const DEFAULT_UPLOAD_EXPIRY = 600; // 10 min to start the PUT
const DEFAULT_SIGN_EXPIRY = 3600; // 1 h read window for private objects
const MAX_SIGN_EXPIRY = 24 * 3600;

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", ...CORS },
    });
}

function errorResponse(message: string, status = 400): Response {
    return jsonResponse({ error: message }, status);
}

function sanitizeFilename(name: string): string {
    return (name || "file")
        .normalize("NFKD")
        .replace(/[^\w.\- ]+/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(-120) || "file";
}

// ============================================================================
// R2 (S3-compatible) config
// ============================================================================

interface R2Config {
    client: AwsClient;
    endpoint: string; // https://<account>.r2.cloudflarestorage.com
    publicBucket: string;
    privateBucket: string;
    publicBaseUrl: string;
}

function loadR2(): R2Config {
    const accountId = Deno.env.get("R2_ACCOUNT_ID");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const publicBucket = Deno.env.get("R2_PUBLIC_BUCKET");
    const privateBucket = Deno.env.get("R2_PRIVATE_BUCKET");
    const publicBaseUrl = Deno.env.get("R2_PUBLIC_BASE_URL");

    if (
        !accountId || !accessKeyId || !secretAccessKey || !publicBucket ||
        !privateBucket || !publicBaseUrl
    ) {
        throw new Error("R2 storage not configured");
    }

    const client = new AwsClient({
        accessKeyId,
        secretAccessKey,
        service: "s3",
        region: "auto",
    });

    return {
        client,
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        publicBucket,
        privateBucket,
        publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
    };
}

type Visibility = "public" | "private";

function bucketFor(cfg: R2Config, visibility: Visibility): string {
    return visibility === "private" ? cfg.privateBucket : cfg.publicBucket;
}

function encodeKey(key: string): string {
    // Each path segment encoded individually so "/" in the key is preserved.
    return key.split("/").map(encodeURIComponent).join("/");
}

function objectUrl(cfg: R2Config, bucket: string, key: string): string {
    return `${cfg.endpoint}/${bucket}/${encodeKey(key)}`;
}

function publicUrlFor(cfg: R2Config, visibility: Visibility, key: string): string | null {
    return visibility === "public" ? `${cfg.publicBaseUrl}/${encodeKey(key)}` : null;
}

function escapeXml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

interface ResolvedKey {
    key: string;
    prefix: string;
    visibility: Visibility;
    contentType: string;
}

/**
 * Validate the requested prefix + (optional) explicit key for a NEW upload and
 * mint a key when none is supplied. Shared by `create-upload` and
 * `create-multipart` so both enforce the same prefix allow-list / overwrite rule.
 */
function resolveKey(
    caller: Caller,
    body: Record<string, unknown>,
): ResolvedKey | { error: Response } {
    const prefix = String(body.prefix ?? "").trim();
    if (!ALLOWED_PREFIXES.has(prefix)) {
        return { error: errorResponse(`Unknown prefix "${prefix}"`) };
    }
    if (ADMIN_ONLY_PREFIXES.has(prefix) && !caller.isAdmin) {
        return { error: errorResponse("Forbidden", 403) };
    }
    const visibility: Visibility = body.visibility === "private"
        ? "private"
        : "public";
    const contentType = typeof body.contentType === "string" && body.contentType
        ? body.contentType
        : "application/octet-stream";

    let key: string;
    if (typeof body.key === "string" && body.key.trim()) {
        const requested = body.key.trim().replace(/^\/+/, "");
        if (!requested.startsWith(`${prefix}/`)) {
            return { error: errorResponse("key must live under the given prefix") };
        }
        key = requested;
    } else {
        const filename = sanitizeFilename(String(body.filename ?? "file"));
        key = `${prefix}/${crypto.randomUUID()}-${filename}`;
    }
    return { key, prefix, visibility, contentType };
}

/**
 * Validate an EXISTING key (multipart sign-part / complete / abort). The key
 * must sit under an allowed prefix so a client can't drive S3 calls against
 * arbitrary objects.
 */
function validateKey(
    body: Record<string, unknown>,
): { key: string; visibility: Visibility } | { error: Response } {
    const key = String(body.key ?? "").trim().replace(/^\/+/, "");
    if (!key) return { error: errorResponse("Missing key") };
    const top = key.split("/")[0];
    if (!ALLOWED_PREFIXES.has(top)) {
        return { error: errorResponse("key must live under an allowed prefix") };
    }
    const visibility: Visibility = body.visibility === "private"
        ? "private"
        : "public";
    return { key, visibility };
}

// ============================================================================
// Auth
// ============================================================================

interface Caller {
    userId: string;
    isAdmin: boolean;
}

/** Decode the `user_roles` claim straight off the JWT payload. */
function rolesFromToken(token: string): string[] {
    try {
        const payload = token.split(".")[1];
        const json = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
        );
        const roles = json.user_roles;
        if (!Array.isArray(roles)) return [];
        return roles
            .map((r: { role?: string }) => r?.role)
            .filter((r: unknown): r is string => typeof r === "string");
    } catch {
        return [];
    }
}

async function authenticate(req: Request): Promise<Caller> {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) throw new Error("UNAUTHORIZED");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !anonKey) throw new Error("Auth service not configured");

    const supabase = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Validate the bearer token explicitly. Passing the JWT means GoTrue
    // verifies THIS request's token instead of trying (and failing) to resolve
    // a session from the function's empty server-side storage.
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) throw new Error("UNAUTHORIZED");

    const roles = rolesFromToken(token);
    const isAdmin = roles.some((r) => ADMIN_ROLES.has(r));
    return { userId: data.user.id, isAdmin };
}

// ============================================================================
// Handlers
// ============================================================================

async function handleCreateUpload(
    cfg: R2Config,
    caller: Caller,
    body: Record<string, unknown>,
): Promise<Response> {
    const resolved = resolveKey(caller, body);
    if ("error" in resolved) return resolved.error;
    const { key, visibility, contentType } = resolved;

    const bucket = bucketFor(cfg, visibility);
    const url = new URL(objectUrl(cfg, bucket, key));
    url.searchParams.set("X-Amz-Expires", String(DEFAULT_UPLOAD_EXPIRY));

    const signed = await cfg.client.sign(
        new Request(url.toString(), { method: "PUT" }),
        { aws: { signQuery: true } },
    );

    return jsonResponse({
        uploadUrl: signed.url,
        key,
        contentType,
        publicUrl: publicUrlFor(cfg, visibility, key),
        expiresIn: DEFAULT_UPLOAD_EXPIRY,
    });
}

// ── Multipart upload (large / resumable) ─────────────────────────────────────
// Big videos (up to ~150 MB) upload as S3 multipart so a dropped part can be
// retried without restarting the whole transfer. The client splits the file
// into parts, PUTs each to a presigned URL, then asks us to assemble them.

async function handleCreateMultipart(
    cfg: R2Config,
    caller: Caller,
    body: Record<string, unknown>,
): Promise<Response> {
    const resolved = resolveKey(caller, body);
    if ("error" in resolved) return resolved.error;
    const { key, visibility, contentType } = resolved;

    const bucket = bucketFor(cfg, visibility);
    const res = await cfg.client.fetch(`${objectUrl(cfg, bucket, key)}?uploads`, {
        method: "POST",
        headers: { "Content-Type": contentType },
    });
    const xml = await res.text();
    if (!res.ok) {
        console.error("[r2-storage] create-multipart failed", res.status, xml.slice(0, 300));
        return errorResponse(`create-multipart failed (${res.status})`, 502);
    }
    const uploadId = xml.match(/<UploadId>([\s\S]*?)<\/UploadId>/)?.[1];
    if (!uploadId) return errorResponse("No UploadId returned", 502);

    return jsonResponse({
        key,
        uploadId,
        contentType,
        publicUrl: publicUrlFor(cfg, visibility, key),
    });
}

async function handleSignPart(
    cfg: R2Config,
    body: Record<string, unknown>,
): Promise<Response> {
    const v = validateKey(body);
    if ("error" in v) return v.error;
    const partNumber = Number(body.partNumber);
    if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) {
        return errorResponse("Invalid partNumber");
    }
    const uploadId = String(body.uploadId ?? "").trim();
    if (!uploadId) return errorResponse("Missing uploadId");

    const bucket = bucketFor(cfg, v.visibility);
    const url = new URL(objectUrl(cfg, bucket, v.key));
    url.searchParams.set("partNumber", String(partNumber));
    url.searchParams.set("uploadId", uploadId);
    url.searchParams.set("X-Amz-Expires", String(DEFAULT_UPLOAD_EXPIRY));

    const signed = await cfg.client.sign(
        new Request(url.toString(), { method: "PUT" }),
        { aws: { signQuery: true } },
    );
    return jsonResponse({ url: signed.url });
}

async function handleCompleteMultipart(
    cfg: R2Config,
    body: Record<string, unknown>,
): Promise<Response> {
    const v = validateKey(body);
    if ("error" in v) return v.error;
    const uploadId = String(body.uploadId ?? "").trim();
    if (!uploadId) return errorResponse("Missing uploadId");

    const rawParts = Array.isArray(body.parts) ? body.parts : [];
    const parts = rawParts
        .map((p) => ({
            partNumber: Number((p as { partNumber?: unknown }).partNumber),
            etag: String((p as { etag?: unknown }).etag ?? ""),
        }))
        .filter((p) => Number.isInteger(p.partNumber) && p.etag)
        .sort((a, b) => a.partNumber - b.partNumber);
    if (parts.length === 0) return errorResponse("No parts to complete");

    const xmlBody = `<CompleteMultipartUpload>${
        parts
            .map(
                (p) =>
                    `<Part><PartNumber>${p.partNumber}</PartNumber><ETag>${escapeXml(p.etag)}</ETag></Part>`,
            )
            .join("")
    }</CompleteMultipartUpload>`;

    const bucket = bucketFor(cfg, v.visibility);
    const url = `${objectUrl(cfg, bucket, v.key)}?uploadId=${encodeURIComponent(uploadId)}`;
    const res = await cfg.client.fetch(url, {
        method: "POST",
        body: xmlBody,
        headers: { "Content-Type": "application/xml" },
    });
    const text = await res.text();
    // S3/R2 can return 200 with an <Error> payload, so check both.
    if (!res.ok || /<Error>/.test(text)) {
        console.error("[r2-storage] complete-multipart failed", res.status, text.slice(0, 300));
        return errorResponse(`complete-multipart failed (${res.status})`, 502);
    }

    return jsonResponse({
        key: v.key,
        publicUrl: publicUrlFor(cfg, v.visibility, v.key),
    });
}

async function handleAbortMultipart(
    cfg: R2Config,
    body: Record<string, unknown>,
): Promise<Response> {
    const v = validateKey(body);
    if ("error" in v) return v.error;
    const uploadId = String(body.uploadId ?? "").trim();
    if (!uploadId) return errorResponse("Missing uploadId");

    const bucket = bucketFor(cfg, v.visibility);
    const url = `${objectUrl(cfg, bucket, v.key)}?uploadId=${encodeURIComponent(uploadId)}`;
    const res = await cfg.client.fetch(url, { method: "DELETE" });
    // Treat already-gone (404) as success — abort is best-effort cleanup.
    return jsonResponse({ success: res.ok || res.status === 404 });
}

async function handleDelete(
    cfg: R2Config,
    body: Record<string, unknown>,
): Promise<Response> {
    const key = String(body.key ?? "").trim().replace(/^\/+/, "");
    if (!key) return errorResponse("Missing key");
    const visibility: Visibility = body.visibility === "private"
        ? "private"
        : "public";
    const bucket = bucketFor(cfg, visibility);

    const res = await cfg.client.fetch(objectUrl(cfg, bucket, key), {
        method: "DELETE",
    });

    // R2 returns 204 on delete and is idempotent (204 even if absent).
    if (!res.ok && res.status !== 404) {
        const txt = await res.text();
        console.error("[r2-storage] delete failed", res.status, txt.slice(0, 300));
        return errorResponse(`Delete failed (${res.status})`, 502);
    }
    return jsonResponse({ success: true });
}

async function handleSign(
    cfg: R2Config,
    body: Record<string, unknown>,
): Promise<Response> {
    const key = String(body.key ?? "").trim().replace(/^\/+/, "");
    if (!key) return errorResponse("Missing key");

    const expiresIn = Math.min(
        MAX_SIGN_EXPIRY,
        Math.max(60, Number(body.expiresIn) || DEFAULT_SIGN_EXPIRY),
    );

    // Private bucket reads only — public objects are served by the CDN domain.
    const url = new URL(objectUrl(cfg, cfg.privateBucket, key));
    url.searchParams.set("X-Amz-Expires", String(expiresIn));

    const signed = await cfg.client.sign(
        new Request(url.toString(), { method: "GET" }),
        { aws: { signQuery: true } },
    );

    return jsonResponse({ url: signed.url, expiresIn });
}

/** Minimal ListObjectsV2 XML extraction (avoids pulling an XML parser dep). */
function parseListXml(xml: string): {
    objects: { key: string; size: number; lastModified: string }[];
    truncated: boolean;
    cursor: string | null;
} {
    const objects: { key: string; size: number; lastModified: string }[] = [];
    const contentsRe = /<Contents>([\s\S]*?)<\/Contents>/g;
    let m: RegExpExecArray | null;
    while ((m = contentsRe.exec(xml)) !== null) {
        const block = m[1];
        const key = block.match(/<Key>([\s\S]*?)<\/Key>/)?.[1] ?? "";
        const size = Number(block.match(/<Size>(\d+)<\/Size>/)?.[1] ?? "0");
        const lastModified =
            block.match(/<LastModified>([\s\S]*?)<\/LastModified>/)?.[1] ?? "";
        if (key) objects.push({ key, size, lastModified });
    }
    const truncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
    const cursor =
        xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/)
            ?.[1] ?? null;
    return { objects, truncated, cursor };
}

async function handleList(
    cfg: R2Config,
    caller: Caller,
    body: Record<string, unknown>,
): Promise<Response> {
    if (!caller.isAdmin) return errorResponse("Forbidden", 403);

    const visibility: Visibility = body.visibility === "private"
        ? "private"
        : "public";
    const bucket = bucketFor(cfg, visibility);
    const limit = Math.min(1000, Math.max(1, Number(body.limit) || 100));

    const url = new URL(`${cfg.endpoint}/${bucket}`);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("max-keys", String(limit));
    if (typeof body.prefix === "string" && body.prefix) {
        url.searchParams.set("prefix", body.prefix);
    }
    if (typeof body.cursor === "string" && body.cursor) {
        url.searchParams.set("continuation-token", body.cursor);
    }

    const res = await cfg.client.fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
        const txt = await res.text();
        console.error("[r2-storage] list failed", res.status, txt.slice(0, 300));
        return errorResponse(`List failed (${res.status})`, 502);
    }
    const xml = await res.text();
    const parsed = parseListXml(xml);

    return jsonResponse({
        objects: parsed.objects.map((o) => ({
            ...o,
            url: visibility === "public"
                ? `${cfg.publicBaseUrl}/${o.key.split("/").map(encodeURIComponent).join("/")}`
                : null,
        })),
        truncated: parsed.truncated,
        cursor: parsed.cursor,
    });
}

// ============================================================================
// Serve
// ============================================================================

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS });
    }
    if (req.method !== "POST") {
        return errorResponse("Method not allowed", 405);
    }

    let cfg: R2Config;
    try {
        cfg = loadR2();
    } catch (err) {
        console.error("[r2-storage] config error", err);
        return errorResponse("Storage service not configured", 500);
    }

    let caller: Caller;
    try {
        caller = await authenticate(req);
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return errorResponse("Unauthorized", 401);
        }
        console.error("[r2-storage] auth error", err);
        return errorResponse("Auth failed", 500);
    }

    let body: Record<string, unknown>;
    try {
        body = (await req.json()) as Record<string, unknown>;
    } catch {
        return errorResponse("Invalid JSON body");
    }

    try {
        switch (body.action) {
            case "create-upload":
                return await handleCreateUpload(cfg, caller, body);
            case "create-multipart":
                return await handleCreateMultipart(cfg, caller, body);
            case "sign-part":
                return await handleSignPart(cfg, body);
            case "complete-multipart":
                return await handleCompleteMultipart(cfg, body);
            case "abort-multipart":
                return await handleAbortMultipart(cfg, body);
            case "delete":
                return await handleDelete(cfg, body);
            case "sign":
                return await handleSign(cfg, body);
            case "list":
                return await handleList(cfg, caller, body);
            default:
                return errorResponse(
                    "Invalid action. Supported: create-upload, " +
                        "create-multipart, sign-part, complete-multipart, " +
                        "abort-multipart, delete, sign, list",
                );
        }
    } catch (err) {
        console.error("[r2-storage] handler error", err);
        return errorResponse(
            err instanceof Error ? err.message : "Storage operation failed",
            500,
        );
    }
});
