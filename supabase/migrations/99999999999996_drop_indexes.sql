/*
 * Migration: Drop All Indexes
 * Description: Drops all custom indexes (keeps primary keys and unique constraints)
 * Author: System
 * Date: 2024-12-01
 * 
 * WARNING: This will remove all performance indexes. Use only for cleanup/reset.
 */

-- Drop all custom indexes
do $$
declare
  r record;
begin
  for r in (
    select schemaname, tablename, indexname
    from pg_indexes
    where schemaname = 'public'
    and indexname like 'idx_%'
  ) loop
    execute format('drop index if exists %I.%I cascade', r.schemaname, r.indexname);
  end loop;
end $$;

