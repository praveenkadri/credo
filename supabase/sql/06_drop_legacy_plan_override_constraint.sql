-- Fix legacy constraint blocking Create Company inserts.
-- Error seen: companies_plan_override_check (code 23514)

begin;

do $$
declare c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.companies'::regclass
      and conname = 'companies_plan_override_check'
  loop
    execute format('alter table public.companies drop constraint %I', c.conname);
  end loop;
end $$;

commit;
