-- Allow anyone (including unauthenticated users) to read a pending invitation
-- by its token. This is needed so the invite-role deep link screen can fetch
-- invitation details before the user has signed in.
create policy "Anyone can read pending invitation by token"
  on public.invitations
  for select
  to anon, authenticated
  using (
    status = 'pending'
  );
