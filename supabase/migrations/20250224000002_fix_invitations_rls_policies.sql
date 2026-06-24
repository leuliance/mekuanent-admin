-- Content admins can also view invitations for their church
create policy "Content admins can view church invitations"
  on public.invitations
  for select
  to authenticated
  using (
    (select public.is_content_admin((select auth.uid()), church_id))
  );

-- Church admins and content admins can update (cancel) invitations
create policy "Church admins can update church invitations"
  on public.invitations
  for update
  to authenticated
  using (
    (select public.is_church_admin((select auth.uid()), church_id))
    or (select public.is_content_admin((select auth.uid()), church_id))
  )
  with check (
    (select public.is_church_admin((select auth.uid()), church_id))
    or (select public.is_content_admin((select auth.uid()), church_id))
  );

-- Super admins can update any invitation
create policy "Super admins can update any invitation"
  on public.invitations
  for update
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  )
  with check (
    (select public.is_super_admin((select auth.uid())))
  );

-- Content admins can also delete invitations for their church
create policy "Content admins can delete church invitations"
  on public.invitations
  for delete
  to authenticated
  using (
    (select public.is_content_admin((select auth.uid()), church_id))
  );

-- Super admins can delete any invitation
create policy "Super admins can delete any invitation"
  on public.invitations
  for delete
  to authenticated
  using (
    (select public.is_super_admin((select auth.uid())))
  );
