-- migration: add founded_year to churches table
-- description: adds a founded_year column to track when churches were established
-- author: system
-- date: 2024-12-12

alter table public.churches
add column founded_year integer;

comment on column public.churches.founded_year is 'Year the church was founded (Gregorian Calendar)';

-- add constraint to ensure reasonable year values
alter table public.churches
add constraint churches_founded_year_reasonable 
check (founded_year is null or (founded_year >= 1 and founded_year <= extract(year from now()) + 10));

