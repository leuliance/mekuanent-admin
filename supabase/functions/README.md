# Supabase Edge Functions - Mekuannent App

## OTP Integration with Afromessage

This directory contains Edge Functions for integrating Afromessage OTP service with Supabase Auth.

### Functions

#### 1. `send-sms-hook`

Auth Hook that sends OTP codes via Afromessage API when users sign up or log in with phone numbers.

#### 2. `verify-otp-hook`

Edge Function to verify OTP codes entered by users.

---

## Setup Instructions

### 1. Set Environment Variables

```bash
# Set your Afromessage API credentials
supabase secrets set AFROMESSAGE_TOKEN="your_afromessage_bearer_token"
supabase secrets set AFROMESSAGE_SENDER="Mekuannent"
supabase secrets set AFROMESSAGE_IDENTIFIER="your_identifier_id"
```

### 2. Deploy Functions

```bash
# Deploy the SMS hook
supabase functions deploy send-sms-hook

# Deploy the verification function
supabase functions deploy verify-otp-hook
```

### 3. Enable Auth Hook in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Auth Hooks**
2. Enable **Send SMS Hook**
3. Set the hook URL to: `https://your-project-ref.supabase.co/functions/v1/send-sms-hook`
4. Save changes

---

## Usage in Your App

### Sending OTP (Automatic via Auth Hook)

When users sign up or log in with phone, Supabase Auth automatically calls the `send-sms-hook`:

```typescript
import { supabase } from './config/supabase';

// Signup with phone
const { data, error } = await supabase.auth.signUp({
  phone: '+251912345678',
  password: 'user-password',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});
// OTP is automatically sent via Afromessage
```

### Verifying OTP

```typescript
// User enters OTP code
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+251912345678',
  token: '123456', // OTP code from user
  type: 'sms'
});

if (data.user) {
  console.log('Phone verified!', data.user);
}
```

### Manual OTP Verification (Optional)

If you need to verify OTP manually before Supabase Auth:

```typescript
const response = await fetch(
  'https://your-project-ref.supabase.co/functions/v1/verify-otp-hook',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify({
      phone: '+251912345678',
      code: '123456'
    })
  }
);

const result = await response.json();
if (result.success) {
  console.log('OTP verified!');
}
```

---

## Testing Locally

### 1. Start Supabase locally

```bash
supabase start
```

### 2. Serve functions locally

```bash
supabase functions serve send-sms-hook --env-file .env.local
```

### 3. Test the hook

```bash
curl -X POST http://localhost:54321/functions/v1/send-sms-hook \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": "test-user-id",
      "phone": "+251912345678"
    },
    "otp": "123456"
  }'
```

---

## Afromessage API Reference

### Send OTP Challenge

```
GET https://api.afromessage.com/api/challenge
Headers: Authorization: Bearer YOUR_TOKEN
Params:
  - from: YOUR_IDENTIFIER_ID
  - sender: YOUR_SENDER_NAME
  - to: RECIPIENT_PHONE
  - ps: MESSAGE_PREFIX
  - pt: MESSAGE_POSTFIX
  - sb: SPACES_BEFORE_CODE
  - sa: SPACES_AFTER_CODE
  - ttl: TIME_TO_LIVE (seconds)
  - len: CODE_LENGTH
  - t: CODE_TYPE (numeric, alpha, alphanumeric)
```

### Verify OTP

```
GET https://api.afromessage.com/api/verify
Headers: Authorization: Bearer YOUR_TOKEN
Params:
  - to: RECIPIENT_PHONE
  - code: CODE_TO_VERIFY
```

---

## Troubleshooting

### OTP not sending?

1. Check if `AFROMESSAGE_TOKEN` is set correctly
2. Verify your Afromessage account has sufficient credits
3. Check function logs: `supabase functions logs send-sms-hook`

### OTP verification fails?

1. Ensure OTP code hasn't expired (default 5 minutes)
2. Check if phone number format matches
3. Verify Afromessage API is responding correctly

---

## Security Notes

- Never expose `AFROMESSAGE_TOKEN` in client-side code
- OTP codes expire after 5 minutes (configurable via `ttl` parameter)
- Rate limiting is handled by Supabase Auth (6 requests per hour per phone)
- Always use HTTPS in production
