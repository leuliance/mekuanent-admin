# Supabase Functions Deployment Guide

## Prerequisites

1. Supabase CLI installed
2. Supabase project initialized
3. Afromessage API credentials

---

## Step 1: Set Environment Secrets

Set your Afromessage API credentials as Supabase secrets:

```bash
# Navigate to your project directory
cd /Users/leuliance/Desktop/mekuannent/mekuannent-app

# Set Afromessage token (REQUIRED)
supabase secrets set AFROMESSAGE_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoieTR6ZDlKSVlEVUozdXVJRkFSbE9yRzRGRWF4U3lBbnAiLCJleHAiOjE5MjIzODM1NDUsImlhdCI6MTc2NDYxNzE0NSwianRpIjoiMDk4ZmY1ODktODQ1Yi00NmYwLWIyMDktMDY4MzkwYmMwZmMyIn0.tX6DU-8aVBYcXTyjwN4PQbgdjMjNRCWTRjaLA5BDRAA"

# Set Afromessage sender name (REQUIRED for production, optional for beta)
supabase secrets set AFROMESSAGE_SENDER="Whale"

# Set Afromessage identifier ID (REQUIRED)
supabase secrets set AFROMESSAGE_IDENTIFIER="e80ad9d8-adf3-463f-80f4-7c4b39f7f164"

# Set webhook secret for auth hook verification (REQUIRED)
# Get this from Supabase Dashboard: Authentication > Hooks > Send SMS Hook
supabase secrets set SEND_SMS_HOOK_SECRET="v1,whsec_cu1s3IDyot8fTvk3JSqwYs+gQW8+NW5F6vKq9b7k4SgzT2N6sSCtH/LrWJ/Bcrer3Tc0R+pMnbBmiHmU"
```

**Important:** Replace the placeholder values with your actual Afromessage credentials.

---

## Step 2: Deploy Functions

### Deploy SMS Hook Function

```bash
supabase functions deploy send-sms-hook --no-verify-jwt
```

**Note:** We use `--no-verify-jwt` because this function is called by Supabase Auth, not your client app.

### Deploy Verification Function

```bash
supabase functions deploy verify-otp-hook
```

---

## Step 3: Verify Deployment

Check if functions are deployed:

```bash
supabase functions list
```

Expected output:

```
┌───────────────────┬─────────┬─────────┬─────────────────────┐
│ NAME              │ STATUS  │ VERSION │ CREATED             │
├───────────────────┼─────────┼─────────┼─────────────────────┤
│ send-sms-hook     │ ACTIVE  │ 1       │ 2024-12-01 10:00:00 │
│ verify-otp-hook   │ ACTIVE  │ 1       │ 2024-12-01 10:01:00 │
└───────────────────┴─────────┴─────────┴─────────────────────┘
```

---

## Step 4: Configure Auth Hook in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Auth Hooks**
2. Find **"Send SMS Hook"**
3. Click **"Enable Hook"**
4. Set the hook URL:

   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-sms-hook
   ```

5. Replace `YOUR_PROJECT_REF` with your actual project reference
6. Click **"Save"**

---

## Step 5: Test the Integration

### Test Sending OTP (via Supabase Auth)

```bash
# This will trigger the send-sms-hook automatically
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/signup' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+251912345678",
    "password": "test-password-123"
  }'
```

### Test Verifying OTP

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/verify-otp-hook' \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+251912345678",
    "code": "123456"
  }'
```

---

## Step 6: View Function Logs

Monitor function execution and debug issues:

```bash
# View send-sms-hook logs
supabase functions logs send-sms-hook

# View verify-otp-hook logs
supabase functions logs verify-otp-hook

# Stream logs in real-time
supabase functions logs send-sms-hook --follow
```

---

## Local Development & Testing

### Serve Functions Locally

```bash
# Start Supabase services
supabase start

# Serve functions locally
supabase functions serve
```

This will start both functions locally:

- `http://localhost:54321/functions/v1/send-sms-hook`
- `http://localhost:54321/functions/v1/verify-otp-hook`

### Test Locally with cURL

```bash
# Test send-sms-hook locally
curl -X POST http://localhost:54321/functions/v1/send-sms-hook \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": "test-user-id",
      "phone": "+251912345678"
    },
    "otp": "123456"
  }'

# Test verify-otp-hook locally
curl -X POST http://localhost:54321/functions/v1/verify-otp-hook \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+251912345678",
    "code": "123456"
  }'
```

---

## Update/Redeploy Functions

If you make changes to the functions, redeploy them:

```bash
# Redeploy send-sms-hook
supabase functions deploy send-sms-hook --no-verify-jwt

# Redeploy verify-otp-hook
supabase functions deploy verify-otp-hook
```

---

## Update Secrets

If you need to update your Afromessage credentials:

```bash
# Update token
supabase secrets set AFROMESSAGE_TOKEN="new_token_here"

# Update sender
supabase secrets set AFROMESSAGE_SENDER="NewSenderName"

# Update identifier
supabase secrets set AFROMESSAGE_IDENTIFIER="new_identifier_here"
```

**Note:** After updating secrets, you need to redeploy the functions for changes to take effect.

---

## Troubleshooting

### Issue: "SMS service not configured" error

**Solution:** Make sure `AFROMESSAGE_TOKEN` is set:

```bash
supabase secrets set AFROMESSAGE_TOKEN="your_token"
supabase functions deploy send-sms-hook --no-verify-jwt
```

### Issue: "Invalid or expired OTP" error

**Possible causes:**

1. OTP code has expired (default TTL is 300 seconds / 5 minutes)
2. Wrong phone number format
3. Code was already used

**Solution:** Generate a new OTP by signing up again or check phone format.

### Issue: Function not being called by Auth Hook

**Solution:**

1. Verify Auth Hook is enabled in Dashboard
2. Check the hook URL is correct
3. View function logs for errors: `supabase functions logs send-sms-hook`

### Issue: Afromessage API returns error

**Check:**

1. Your Afromessage account has sufficient credits
2. API token is valid and not expired
3. Sender name is approved (for production)
4. Phone number format is correct (E.164 format: +251...)

---

## Complete Deployment Commands (Copy & Paste)

```bash
# 1. Navigate to project
cd /Users/leuliance/Desktop/mekuannent/mekuannent-app

# 2. Set secrets
supabase secrets set AFROMESSAGE_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoieTR6ZDlKSVlEVUozdXVJRkFSbE9yRzRGRWF4U3lBbnAiLCJleHAiOjE5MjIzODM1NDUsImlhdCI6MTc2NDYxNzE0NSwianRpIjoiMDk4ZmY1ODktODQ1Yi00NmYwLWIyMDktMDY4MzkwYmMwZmMyIn0.tX6DU-8aVBYcXTyjwN4PQbgdjMjNRCWTRjaLA5BDRAA"
supabase secrets set AFROMESSAGE_SENDER="Whale"
supabase secrets set AFROMESSAGE_IDENTIFIER="e80ad9d8-adf3-463f-80f4-7c4b39f7f164"
supabase secrets set SEND_SMS_HOOK_SECRET="v1,whsec_your_webhook_secret_here"

# 3. Deploy functions
supabase functions deploy send-sms-hook --no-verify-jwt
supabase functions deploy verify-otp-hook

# 4. Verify deployment
supabase functions list

# 5. View logs
supabase functions logs send-sms-hook
```

---

## Afromessage API Parameters Reference

| Parameter | Type    | Description                                      | Default       |
|-----------|---------|--------------------------------------------------|---------------|
| `from`    | string  | Identifier ID for multiple short codes           | Empty (default) |
| `sender`  | string  | Sender name (must be verified for production)    | "AfroMessage" |
| `to`      | string  | Recipient phone number (E.164 format)            | **Required**  |
| `len`     | integer | Character length of security code                | 4             |
| `t`       | integer | Code type: 0=numeric, 1=alphabet, 2=alphanumeric | 0             |
| `ttl`     | integer | Time to live in seconds (0 = never expire)       | 0             |
| `pr`      | string  | Message prefix (text before code)                | Empty         |
| `ps`      | string  | Message postfix (text after code)                | Empty         |
| `sb`      | integer | Number of spaces before code                     | 0             |
| `sa`      | integer | Number of spaces after code                      | 0             |
| `callback`| string  | Callback URL for SMS send progress               | Empty         |

---

## Support

For Afromessage API issues:

- Visit: <https://afromessage.com>
- Email: <support@afromessage.com>

For Supabase issues:

- Visit: <https://supabase.com/docs>
- Discord: <https://discord.supabase.com>
