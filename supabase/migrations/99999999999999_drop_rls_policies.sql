/*
 * Migration: Drop All RLS Policies
 * Description: Drops all Row Level Security policies
 * Author: System
 * Date: 2024-12-01
 * 
 * WARNING: This will remove all security policies. Use only for cleanup/reset.
 */

-- Drop all policies from all tables
do $$
declare
  r record;
begin
  for r in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists %I on %I.%I cascade', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

