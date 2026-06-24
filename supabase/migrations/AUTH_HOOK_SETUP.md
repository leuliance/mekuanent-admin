# Supabase Auth Hook Setup Guide

This guide explains how to set up Postgres functions for SMS/OTP authentication using Afromessage API.

## Prerequisites

1. Supabase project with database access
2. Afromessage API credentials:
   - `AFROMESSAGE_TOKEN` - Bearer token
   - `AFROMESSAGE_SENDER` - Sender name (optional, defaults to "Mekuannent")
   - `AFROMESSAGE_IDENTIFIER` - Identifier ID

## Step 1: Run Migration

Apply the migration to create the Postgres functions:

```bash
supabase migration up
```

Or via Supabase Dashboard:

1. Go to **SQL Editor**
2. Copy and paste the contents of `20241201000008_create_auth_hook_functions.sql`
3. Run the migration

## Step 2: Configure Database Settings

Set the Afromessage credentials as database settings. You can do this via SQL:

```sql
-- Set Afromessage token
ALTER DATABASE postgres SET app.settings.afromessage_token = 'your_token_here';

-- Set Afromessage sender (optional)
ALTER DATABASE postgres SET app.settings.afromessage_sender = 'Mekuannent';

-- Set Afromessage identifier
ALTER DATABASE postgres SET app.settings.afromessage_identifier = 'your_identifier_id';
```

**OR** via Supabase Dashboard:

1. Go to **Settings** > **Database**
2. Scroll to **Custom Postgres Config**
3. Add the following settings:
   - `app.settings.afromessage_token` = `your_token_here`
   - `app.settings.afromessage_sender` = `Mekuannent` (optional)
   - `app.settings.afromessage_identifier` = `your_identifier_id`

## Step 3: Configure Auth Hook in Supabase Dashboard

1. Go to **Authentication** > **Hooks** in your Supabase Dashboard
2. Find **Send SMS Hook** section
3. Enable the hook
4. Set the hook URL to:

   ```
   pg-functions://postgres/public.send_sms_hook
   ```

5. Save changes

## Step 4: Test the Setup

The auth hook will automatically trigger when users sign up or log in with phone numbers. Test by:

1. Using your app to sign up with a phone number
2. Check that the OTP SMS is received
3. Verify the OTP code works

## Function Details

### `send_sms_hook(event jsonb)`

- **Purpose**: Sends OTP via Afromessage API when Supabase Auth generates an OTP
- **Called by**: Supabase Auth automatically during phone signup/login
- **Event Format**:

  ```json
  {
    "user": {
      "id": "uuid",
      "phone": "+251912345678"
    },
    "otp": "123456"
  }
  ```

- **Returns**: The event (allows auth to proceed)

### `verify_otp_hook(event jsonb)`

- **Purpose**: Verifies OTP codes via Afromessage API (optional, Supabase handles verification internally)
- **Event Format**:

  ```json
  {
    "user": {
      "phone": "+251912345678"
    },
    "otp": "123456"
  }
  ```

- **Returns**: The event if verification succeeds, raises exception if it fails

## Troubleshooting

### SMS not being sent

1. Check that database settings are configured correctly:

   ```sql
   SELECT current_setting('app.settings.afromessage_token', true);
   SELECT current_setting('app.settings.afromessage_identifier', true);
   ```

2. Check Supabase logs for errors:
   - Go to **Logs** > **Postgres Logs** in Dashboard
   - Look for errors related to `send_sms_hook`

3. Verify the auth hook is enabled and URL is correct

### Function permissions

If you get permission errors, ensure the functions have correct grants:

```sql
GRANT EXECUTE ON FUNCTION public.send_sms_hook TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.verify_otp_hook TO supabase_auth_admin;
```

## Notes

- The `pg_net` extension is used for HTTP requests and works asynchronously
- SMS sending happens asynchronously, so auth proceeds even if SMS is delayed
- For production, consider adding retry logic and error handling
- Monitor the `net.http_request_queue` table to check request status if needed
