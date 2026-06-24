-- Content admins can view user roles in their church
create policy "Content admins can view roles in their church"
  on public.user_roles
  for select
  to authenticated
  using (
    (select public.is_content_admin((select auth.uid()), church_id))
  );

-- Content creators can view roles in their church (read-only, to see team members)
create policy "Content creators can view roles in their church"
  on public.user_roles
  for select
  to authenticated
  using (
    (select public.is_content_creator((select auth.uid()), church_id))
  );

-- Content admins can assign roles (invite existing users)
create policy "Content admins can assign roles in their church"
  on public.user_roles
  for insert
  to authenticated
  with check (
    (select public.is_content_admin((select auth.uid()), church_id))
    and role not in ('super_admin', 'church_admin', 'admin')
  );

-- Content admins can remove roles they manage
create policy "Content admins can delete roles in their church"
  on public.user_roles
  for delete
  to authenticated
  using (
    (select public.is_content_admin((select auth.uid()), church_id))
    and role not in ('super_admin', 'church_admin', 'admin')
  );
