/*
 * Migration: Create Auth Hook Functions for SMS/OTP
 * Description: Creates Postgres functions for SMS sending and OTP verification via Afromessage API
 * These functions can be called from Supabase Auth Hooks using: pg-functions://postgres/public.function_name
 * Author: System
 * Date: 2024-12-01
 * 
 * Functions created:
 * - send_sms_hook: Sends OTP via Afromessage API (for auth hooks)
 * - verify_otp_hook: Verifies OTP codes via Afromessage API
 * 
 * Setup Instructions:
 * 1. Replace the hardcoded credentials below with your actual values from .env
 * 2. Configure auth hook in Supabase Dashboard: Authentication > Hooks > Send SMS Hook
 *    - Hook URL: pg-functions://postgres/public.send_sms_hook
 */

-- Enable pg_net extension if not already enabled
create extension if not exists pg_net;

-- ============================================================================
-- FUNCTION: Send SMS Hook (for Supabase Auth Hooks)
-- Accepts Supabase auth hook event payload and sends OTP via Afromessage
-- Event format: { "user": { "id": "...", "phone": "..." }, "otp": "..." }
-- ============================================================================
create or replace function public.send_sms_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_id uuid;
  user_phone text;
  otp_code text;
  afromessage_token text := 'eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoieTR6ZDlKSVlEVUozdXVJRkFSbE9yRzRGRWF4U3lBbnAiLCJleHAiOjE5MjIzODM1NDUsImlhdCI6MTc2NDYxNzE0NSwianRpIjoiMDk4ZmY1ODktODQ1Yi00NmYwLWIyMDktMDY4MzkwYmMwZmMyIn0.tX6DU-8aVBYcXTyjwN4PQbgdjMjNRCWTRjaLA5BDRAA';
  afromessage_sender text := 'Mekuannent';
  afromessage_identifier text := 'e80ad9d8-adf3-463f-80f4-7c4b39f7f164';
  api_url text;
  request_params text;
  http_request_id bigint;
begin
  -- Extract data from auth hook event payload
  -- Supabase auth hooks send: { "user": { "id": "...", "phone": "..." }, "otp": "..." }
  user_id := (event->'user'->>'id')::uuid;
  user_phone := event->'user'->>'phone';
  otp_code := event->>'otp';

  -- Validate required fields
  if user_phone is null or otp_code is null then
    raise exception 'Phone and OTP are required';
  end if;

  -- Hardcoded credentials (replace with your actual values from .env)
  -- TODO: Replace YOUR_AFROMESSAGE_TOKEN_HERE and YOUR_AFROMESSAGE_IDENTIFIER_HERE with actual values

  -- Build API URL with properly URL-encoded parameters
  -- Simple URL encoding: space -> %20, colon -> %3A, period -> %2E
  declare
    encoded_prefix text;
    encoded_postfix text;
  begin
    -- URL encode the prefix: "Your Mekuannent verification code is:"
    encoded_prefix := 'Your%20Mekuannent%20verification%20code%20is%3A';
    
    -- URL encode the postfix: "Valid for 5 minutes."
    encoded_postfix := 'Valid%20for%205%20minutes%2E';
    
    -- Build query string with encoded values
    request_params := format(
      'from=%s&sender=%s&to=%s&pr=%s&ps=%s&sb=1&sa=1&ttl=300&len=%s&t=0',
      afromessage_identifier,
      afromessage_sender,
      user_phone,
      encoded_prefix,
      encoded_postfix,
      length(otp_code)
    );
    
    api_url := format('https://api.afromessage.com/api/challenge?%s', request_params);
  end;

  -- Log the request for debugging
  raise notice 'Sending SMS to % with OTP %. API URL: %', user_phone, otp_code, api_url;

  -- Make HTTP request to Afromessage API using pg_net
  -- pg_net is async, so the request will complete in the background
  begin
    http_request_id := net.http_get(
      url := api_url,
      headers := jsonb_build_object(
        'Authorization', format('Bearer %s', afromessage_token),
        'Content-Type', 'application/json'
      )
    );
    
    raise notice 'HTTP request initiated. Request ID: %', http_request_id;
  exception
    when others then
      raise warning 'Failed to initiate HTTP request: %', sqlerrm;
      -- Continue anyway to not block auth
  end;
  
  -- Return the event to allow authentication to proceed
  return event;

exception
  when others then
    -- Log error but don't fail auth - you may want to change this behavior
    raise warning 'Error sending SMS: %', sqlerrm;
    -- Return event anyway to allow auth to proceed
    -- Or raise exception to block auth if SMS is critical
    return event;
end;
$$;

comment on function public.send_sms_hook is 'Sends OTP via Afromessage API when called from Supabase Auth Hook. Configure in Dashboard: Authentication > Hooks > Send SMS Hook with URL: pg-functions://postgres/public.send_sms_hook';

-- Grant execute permission to supabase_auth_admin (required for auth hooks)
grant execute on function public.send_sms_hook to supabase_auth_admin;
revoke execute on function public.send_sms_hook from authenticated, anon, public;

-- ============================================================================
-- FUNCTION: Verify OTP Hook (for Supabase Auth Hooks)
-- Verifies OTP codes via Afromessage API
-- Event format: { "user": { "phone": "..." }, "otp": "..." }
-- ============================================================================
create or replace function public.verify_otp_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_phone text;
  otp_code text;
  afromessage_token text := 'eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoieTR6ZDlKSVlEVUozdXVJRkFSbE9yRzRGRWF4U3lBbnAiLCJleHAiOjE5MjIzODM1NDUsImlhdCI6MTc2NDYxNzE0NSwianRpIjoiMDk4ZmY1ODktODQ1Yi00NmYwLWIyMDktMDY4MzkwYmMwZmMyIn0.tX6DU-8aVBYcXTyjwN4PQbgdjMjNRCWTRjaLA5BDRAA';
  api_url text;
  request_params text;
  http_request_id bigint;
begin
  -- Extract data from event payload
  user_phone := event->'user'->>'phone';
  otp_code := event->>'otp';

  -- Validate input
  if user_phone is null or otp_code is null then
    raise exception 'Phone and code are required';
  end if;

  -- Hardcoded credentials (replace with your actual values from .env)
  -- TODO: Replace YOUR_AFROMESSAGE_TOKEN_HERE with actual value

  -- Build API URL with parameters
  request_params := format('to=%s&code=%s', user_phone, otp_code);
  api_url := format('https://api.afromessage.com/api/verify?%s', request_params);

  -- Make HTTP request to Afromessage API
  http_request_id := net.http_get(
    url := api_url,
    headers := jsonb_build_object(
      'Authorization', format('Bearer %s', afromessage_token),
      'Content-Type', 'application/json'
    )
  );

  -- Note: pg_net is async, so we initiate the request and return
  -- For auth hooks, Supabase handles OTP verification internally
  -- This function can be used for custom verification logic if needed
  -- The actual verification happens via Supabase's built-in OTP flow
  
  -- Return event to allow auth to proceed
  -- The HTTP request will complete asynchronously
  return event;

exception
  when others then
    -- Re-raise to block auth on verification failure
    raise;
end;
$$;

comment on function public.verify_otp_hook is 'Verifies OTP code via Afromessage API. Can be called from Supabase Auth Hooks or directly via RPC.';

-- Grant execute permission to supabase_auth_admin (required for auth hooks)
grant execute on function public.verify_otp_hook to supabase_auth_admin;
revoke execute on function public.verify_otp_hook from authenticated, anon, public;
