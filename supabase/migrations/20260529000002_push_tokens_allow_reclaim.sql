-- Allow a signed-in user to "claim" a push_tokens row whose token already
-- exists but is currently owned by another user (e.g. a device was reused
-- across accounts). The original UPDATE policy used USING (auth.uid() = user_id)
-- against the EXISTING row, so the ON CONFLICT (token) DO UPDATE path in
-- `syncPushTokenForUser` failed with:
--   new row violates row-level security policy (USING expression) for table "push_tokens"
--
-- This migration relaxes USING to `true` for UPDATE, but adds a strict
-- WITH CHECK ensuring the NEW row's user_id matches the current caller.
-- That keeps the table safe (you can only ever rewrite a row to point to
-- yourself, never to someone else) while letting the upsert re-key.

drop policy if exists "Users can update their own push tokens" on public.push_tokens;
drop policy if exists "Users can claim or update push tokens" on public.push_tokens;

create policy "Users can claim or update push tokens"
  on public.push_tokens
  for update
  using (true)
  with check (auth.uid() = user_id);

comment on policy "Users can claim or update push tokens" on public.push_tokens is
  'Any authenticated user may UPDATE a push_tokens row, but the resulting row must belong to them. This supports the ON CONFLICT (token) DO UPDATE upsert path used when a device token is reused across accounts.';
