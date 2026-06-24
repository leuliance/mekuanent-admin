/*
 * Direct SMS Test - Tests the Afromessage API call directly
 * This helps debug if the issue is with the API or the function
 */

-- Test the API URL construction (with proper URL encoding)
select format(
  'https://api.afromessage.com/api/challenge?from=%s&sender=%s&to=%s&pr=%s&ps=%s&sb=1&sa=1&ttl=300&len=%s&t=0',
  'e80ad9d8-adf3-463f-80f4-7c4b39f7f164',
  'Mekuannent',
  '+251912345678',  -- REPLACE WITH YOUR PHONE NUMBER
  'Your%20Mekuannent%20verification%20code%20is%3A',  -- URL encoded
  'Valid%20for%205%20minutes%2E',  -- URL encoded
  6
) as api_url;

-- Test making the HTTP request directly
-- Replace phone number and check the result
do $$
declare
  api_url text;
  request_id bigint;
begin
  api_url := format(
    'https://api.afromessage.com/api/challenge?from=%s&sender=%s&to=%s&pr=%s&ps=%s&sb=1&sa=1&ttl=300&len=%s&t=0',
    'e80ad9d8-adf3-463f-80f4-7c4b39f7f164',
    'Mekuannent',
    '+251912345678',  -- REPLACE WITH YOUR PHONE NUMBER
    'Your%20Mekuannent%20verification%20code%20is%3A',  -- URL encoded: "Your Mekuannent verification code is:"
    'Valid%20for%205%20minutes%2E',  -- URL encoded: "Valid for 5 minutes."
    6
  );
  
  request_id := net.http_get(
    url := api_url,
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoieTR6ZDlKSVlEVUozdXVJRkFSbE9yRzRGRWF4U3lBbnAiLCJleHAiOjE5MjIzODM1NDUsImlhdCI6MTc2NDYxNzE0NSwianRpIjoiMDk4ZmY1ODktODQ1Yi00NmYwLWIyMDktMDY4MzkwYmMwZmMyIn0.tX6DU-8aVBYcXTyjwN4PQbgdjMjNRCWTRjaLA5BDRAA',
      'Content-Type', 'application/json'
    )
  );
  
  raise notice 'Request ID: %', request_id;
  raise notice 'Check your phone for SMS. Also check http_request_queue table for status.';
end;
$$;

-- Check the request queue after a few seconds
select * from net.http_request_queue order by created desc limit 5;

