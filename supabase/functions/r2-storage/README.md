# r2-storage edge function

Authorizes media operations against Cloudflare R2 and mints **presigned URLs** so
the app uploads bytes **directly** to R2 (videos can be ~1 GB — we never proxy
those bytes through the function).

```
app --create-upload--> r2-storage --presigned PUT--> app --PUT bytes--> R2
app --save url--> Supabase DB
r2-storage  -- delete / sign / list --> R2
```

Two buckets:

- `mekuannent-media` — **public**, fronted by a custom domain (e.g.
  `https://media.mekuannent.app`). Holds videos, shorts, audios, thumbnails and
  public images. Free egress, stable public URLs stored in the DB.
- `mekuannent-private` — **private**, no custom domain. Holds avatars (user
  profile images). Reads go through short-lived signed GET URLs minted by this
  function.

---

## 1. Create the buckets

Dashboard: https://dash.cloudflare.com -> R2 Object Storage -> Create bucket.
Create both `mekuannent-media` and `mekuannent-private`.

Or with Wrangler:

```bash
npx wrangler r2 bucket create mekuannent-media
npx wrangler r2 bucket create mekuannent-private
```

## 2. Make the media bucket public via a custom domain

This is a TWO-step process and the order matters.

### 2a. First add the ROOT domain `mekuannent.app` as a Cloudflare site

The screen titled "Connect your domain / Make your site faster..." is the
**Add a site** onboarding. It manages a whole DNS zone, so it only accepts the
**apex/root** domain. Entering `media.mekuannent.app` there triggers:

> Please ensure you are providing the root domain and not any subdomains
> (e.g., example.com, not subdomain.example.com)

Fix: enter `mekuannent.app` (not `media.mekuannent.app`), then point your
registrar's nameservers at the two Cloudflare nameservers it gives you. Once the
zone is **Active**, Cloudflare controls DNS for every subdomain of
`mekuannent.app` — including `media.`.

> If `mekuannent.app` is already an Active site in your account, skip 2a.

### 2b. Then connect the `media.` subdomain from the R2 bucket

R2 -> bucket `mekuannent-media` -> **Settings** -> **Public access** ->
**Custom Domains** -> **Connect Domain** -> enter `media.mekuannent.app`. This
screen DOES accept a subdomain (it just adds one CNAME in the zone from 2a), and
Cloudflare provisions TLS automatically. Use `https://media.mekuannent.app` as
`R2_PUBLIC_BASE_URL`.

> Do NOT connect a domain to `mekuannent-private`. Leaving it without public
> access is what keeps avatars private.

If you can't set up the domain yet, enable the bucket's `r2.dev` managed
subdomain (bucket -> Settings -> Public access -> **Allow Access**) and use that
`https://pub-xxxx.r2.dev` URL as `R2_PUBLIC_BASE_URL` (rate-limited; fine for
development).

## 3. CORS on `mekuannent-media`

R2 bucket -> Settings -> CORS policy -> add. Needed so direct PUT uploads (and
the web admin) work from a browser. Native (the Expo app) doesn't enforce CORS,
but the web admin does.

```json
[
  {
    "AllowedOrigins": ["https://admin.mekuannent.app", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-MD5"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  },
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range"],
    "MaxAgeSeconds": 3600
  }
]
```

## 4. Create R2 S3 API credentials (NOT a Cloudflare API token)

The S3 API needs an **Access Key ID + Secret Access Key**, which is different
from the Cloudflare API token. Your current `.env` `CLOUDFLARE_API_TOKEN` value
is actually the S3 **endpoint URL** — keep it for reference, but you still need
real S3 keys.

R2 Object Storage -> **Manage R2 API Tokens** -> Create API token:

- Permission: **Object Read & Write**
- Scope: apply to both buckets (or "all buckets")

Copy the generated **Access Key ID**, **Secret Access Key**, and note the
**S3 endpoint** `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.

## 5. Set Supabase secrets

```bash
supabase secrets set \
  R2_ACCOUNT_ID=ee7b1e8df836c48408d388513f14803d \
  R2_ACCESS_KEY_ID=<your-access-key-id> \
  R2_SECRET_ACCESS_KEY=<your-secret-access-key> \
  R2_PUBLIC_BUCKET=mekuannent-media \
  R2_PRIVATE_BUCKET=mekuannent-private \
  R2_PUBLIC_BASE_URL=https://media.mekuannent.app
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

## 6. Deploy (keep JWT verification ON)

Unlike `chapa-payment`, this function authenticates the caller, so deploy
**without** `--no-verify-jwt`:

```bash
supabase functions deploy r2-storage
```

---

## API

All requests are POST `application/json` with `{ action, ... }`. The user JWT is
attached automatically by `supabase.functions.invoke`.

| action          | body                                                  | who           | returns                                  |
| --------------- | ----------------------------------------------------- | ------------- | ---------------------------------------- |
| `create-upload` | `{ prefix, filename, contentType, visibility?, key? }`| authenticated | `{ uploadUrl, key, publicUrl }`          |
| `delete`        | `{ key, visibility? }`                                | authenticated | `{ success: true }`                      |
| `sign`          | `{ key, expiresIn? }`                                 | authenticated | `{ url, expiresIn }`                     |
| `list`          | `{ prefix?, cursor?, limit? }`                        | admin only    | `{ objects, truncated, cursor }`         |

- `visibility`: `"public"` (default) -> `mekuannent-media`; `"private"` ->
  `mekuannent-private`.
- `publicUrl` is only returned for public uploads; private objects must be read
  via `sign`.
- `prefix` is one of: `videos`, `shorts`, `audios`, `video-thumbnails`,
  `audio-thumbnails`, `article-thumbnails`, `campaign-images`, `event-images`,
  `church-images`, `avatars`, `static`.
