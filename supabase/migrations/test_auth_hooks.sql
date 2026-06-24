/*
 * Test Script for Auth Hook Functions
 * Run this in Supabase SQL Editor to test the SMS/OTP functions
 * 
 * Instructions:
 * 1. Replace the test phone number with your actual phone number
 * 2. Run each test section separately
 * 3. Check the results and HTTP request status
 */

-- ============================================================================
-- TEST 1: Test send_sms_hook function
-- This simulates what Supabase Auth sends when a user signs up/logs in
-- ============================================================================

-- Test sending SMS with a sample OTP
select public.send_sms_hook(
  jsonb_build_object(
    'user', jsonb_build_object(
      'id', gen_random_uuid(),
      'phone', '+251912345678'  -- REPLACE WITH YOUR TEST PHONE NUMBER
    ),
    'otp', '123456'
  )
) as result;

-- ============================================================================
-- TEST 2: Check HTTP request status
-- The function now waits for the response, so check Postgres logs for notices/warnings
-- ============================================================================

-- Check Postgres logs in Supabase Dashboard: Logs > Postgres Logs
-- Look for messages like:
-- - "SMS sent successfully. Status: 200, Response: ..."
-- - "SMS API returned error status ..."
-- - "SMS request timed out ..."

-- Alternative: Check http_request_queue for pending/completed requests
select 
  id,
  created,
  method,
  url,
  status
from net.http_request_queue
order by created desc
limit 10;

-- ============================================================================
-- TEST 3: Test verify_otp_hook function
-- This simulates OTP verification (note: you need a real OTP code from SMS)
-- ============================================================================

-- Test verifying OTP (replace with actual OTP code you received)
select public.verify_otp_hook(
  jsonb_build_object(
    'user', jsonb_build_object(
      'phone', '+251912345678'  -- REPLACE WITH YOUR TEST PHONE NUMBER
    ),
    'otp', '123456'  -- REPLACE WITH ACTUAL OTP CODE FROM SMS
  )
) as result;

-- ============================================================================
-- TEST 4: Test error handling - missing phone
-- ============================================================================

select public.send_sms_hook(
  jsonb_build_object(
    'user', jsonb_build_object(
      'id', gen_random_uuid()
    ),
    'otp', '123456'
  )
) as result;

-- ============================================================================
-- TEST 5: Test error handling - missing OTP
-- ============================================================================

select public.send_sms_hook(
  jsonb_build_object(
    'user', jsonb_build_object(
      'id', gen_random_uuid(),
      'phone', '+251912345678'
    )
  )
) as result;

-- ============================================================================
-- HELPER: Function to check HTTP request status by ID
-- ============================================================================

-- Helper function to check HTTP request by ID
-- Note: http_response is a composite type, so we use http_collect_response
create or replace function public.check_http_request(request_id bigint)
returns jsonb
language plpgsql
as $$
declare
  response_record record;
begin
  select * into response_record
  from net.http_collect_response(check_http_request.request_id, async := false) r;
  
  return jsonb_build_object(
    'status_code', (response_record).status_code,
    'content', (response_record).content::text,
    'headers', (response_record).headers
  );
end;
$$;

-- Example usage (replace with actual request_id from http_request_queue):
-- select * from public.check_http_request(12345);

-- Example: Check a specific request (replace with actual request ID from TEST 2)
-- select * from public.check_http_request(12345);

