-- Phase 4A RLS hardening for sensitive app data.
--
-- Removes anonymous access from normal company, employee, payroll, document,
-- and audit data while preserving trusted service_role maintenance.

begin;

create or replace function public.jwt_workspace_id()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'workspace_id', '');
$$;

create or replace function public.jwt_organization_id()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'organization_id', '');
$$;

create or replace function public.can_access_company_row(c public.companies)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and auth.uid() is not null
      and (
        c.user_id = auth.uid()
        or c.owner_id = auth.uid()
        or c.created_by = auth.uid()
        or (
          public.jwt_workspace_id() is not null
          and c.workspace_id = public.jwt_workspace_id()
        )
        or (
          public.jwt_organization_id() is not null
          and c.organization_id = public.jwt_organization_id()
        )
      )
    );
$$;

create or replace function public.can_insert_company_row(c public.companies)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and auth.uid() is not null
      and (c.user_id is null or c.user_id = auth.uid())
      and (c.owner_id is null or c.owner_id = auth.uid())
      and (c.created_by is null or c.created_by = auth.uid())
      and (
        c.user_id = auth.uid()
        or c.owner_id = auth.uid()
        or c.created_by = auth.uid()
        or (
          c.workspace_id is not null
          and public.jwt_workspace_id() is not null
          and c.workspace_id = public.jwt_workspace_id()
        )
        or (
          c.organization_id is not null
          and public.jwt_organization_id() is not null
          and c.organization_id = public.jwt_organization_id()
        )
      )
    );
$$;

create or replace function public.can_access_company_id(company_id text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.companies c
    where c.id = company_id
      and public.can_access_company_row(c)
  );
$$;

create or replace function public.can_delete_company_row(c public.companies)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and auth.uid() is not null
      and coalesce(c.owner_id, c.user_id, c.created_by) = auth.uid()
    );
$$;

alter table if exists public.companies enable row level security;
alter table if exists public.employees enable row level security;
alter table if exists public.payroll_runs enable row level security;
alter table if exists public.payroll_run_employees enable row level security;
alter table if exists public.documents enable row level security;
alter table if exists public.audit_logs enable row level security;
alter table if exists public.company_deletion_audit enable row level security;

alter table if exists public.companies force row level security;
alter table if exists public.employees force row level security;
alter table if exists public.payroll_runs force row level security;
alter table if exists public.payroll_run_employees force row level security;
alter table if exists public.documents force row level security;
alter table if exists public.audit_logs force row level security;
alter table if exists public.company_deletion_audit force row level security;

do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'companies',
        'employees',
        'payroll_runs',
        'payroll_run_employees',
        'documents',
        'audit_logs',
        'company_deletion_audit'
      )
      and (
        'anon' = any(roles)
        or coalesce(qual, '') ilike '%auth.role()%anon%'
        or coalesce(with_check, '') ilike '%auth.role()%anon%'
      )
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- companies

drop policy if exists companies_select on public.companies;
create policy companies_select
on public.companies
for select
to authenticated
using (public.can_access_company_row(companies));

drop policy if exists companies_insert on public.companies;
create policy companies_insert
on public.companies
for insert
to authenticated
with check (public.can_insert_company_row(companies));

drop policy if exists companies_update on public.companies;
create policy companies_update
on public.companies
for update
to authenticated
using (public.can_access_company_row(companies))
with check (public.can_access_company_row(companies));

drop policy if exists companies_delete on public.companies;

-- employees

drop policy if exists employees_select on public.employees;
create policy employees_select
on public.employees
for select
to authenticated
using (public.can_access_company_id(company_id));

drop policy if exists employees_insert on public.employees;
create policy employees_insert
on public.employees
for insert
to authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists employees_update on public.employees;
create policy employees_update
on public.employees
for update
to authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists employees_delete on public.employees;

-- payroll_runs

drop policy if exists payroll_runs_select on public.payroll_runs;
create policy payroll_runs_select
on public.payroll_runs
for select
to authenticated
using (public.can_access_company_id(company_id));

drop policy if exists payroll_runs_insert on public.payroll_runs;
create policy payroll_runs_insert
on public.payroll_runs
for insert
to authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_runs_update on public.payroll_runs;
create policy payroll_runs_update
on public.payroll_runs
for update
to authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_runs_delete on public.payroll_runs;

-- payroll_run_employees

drop policy if exists payroll_run_employees_select on public.payroll_run_employees;
create policy payroll_run_employees_select
on public.payroll_run_employees
for select
to authenticated
using (public.can_access_company_id(company_id));

drop policy if exists payroll_run_employees_insert on public.payroll_run_employees;
create policy payroll_run_employees_insert
on public.payroll_run_employees
for insert
to authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_run_employees_update on public.payroll_run_employees;
create policy payroll_run_employees_update
on public.payroll_run_employees
for update
to authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_run_employees_delete on public.payroll_run_employees;

-- documents

drop policy if exists documents_select on public.documents;
create policy documents_select
on public.documents
for select
to authenticated
using (public.can_access_company_id(company_id));

drop policy if exists documents_insert on public.documents;
create policy documents_insert
on public.documents
for insert
to authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists documents_update on public.documents;
create policy documents_update
on public.documents
for update
to authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists documents_delete on public.documents;

-- audit_logs

drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select
on public.audit_logs
for select
to authenticated
using (
  company_id is not null
  and public.can_access_company_id(company_id)
);

drop policy if exists audit_logs_insert on public.audit_logs;
create policy audit_logs_insert
on public.audit_logs
for insert
to authenticated
with check (
  company_id is not null
  and public.can_access_company_id(company_id)
);

drop policy if exists audit_logs_update on public.audit_logs;
drop policy if exists audit_logs_delete on public.audit_logs;

-- company_deletion_audit

drop policy if exists company_deletion_audit_select on public.company_deletion_audit;
create policy company_deletion_audit_select
on public.company_deletion_audit
for select
to authenticated
using (public.can_access_company_id(company_id));

drop policy if exists company_deletion_audit_insert on public.company_deletion_audit;
create policy company_deletion_audit_insert
on public.company_deletion_audit
for insert
to authenticated
with check (
  deleted_by = auth.uid()
  and exists (
    select 1
    from public.companies c
    where c.id = company_deletion_audit.company_id
      and public.can_delete_company_row(c)
  )
);

drop policy if exists company_deletion_audit_update on public.company_deletion_audit;
drop policy if exists company_deletion_audit_delete on public.company_deletion_audit;

revoke all on table public.companies from anon;
revoke all on table public.employees from anon;
revoke all on table public.payroll_runs from anon;
revoke all on table public.payroll_run_employees from anon;
revoke all on table public.documents from anon;
revoke all on table public.audit_logs from anon;
revoke all on table public.company_deletion_audit from anon;

commit;

-- Verification queries:
--
-- Policies on sensitive tables that still mention anon:
-- select schemaname, tablename, policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in (
--     'companies',
--     'employees',
--     'payroll_runs',
--     'payroll_run_employees',
--     'documents',
--     'audit_logs',
--     'company_deletion_audit'
--   )
--   and (
--     'anon' = any(roles)
--     or coalesce(qual, '') ilike '%auth.role()%anon%'
--     or coalesce(with_check, '') ilike '%auth.role()%anon%'
--   )
-- order by tablename, policyname;
--
-- RLS enabled status:
-- select schemaname, tablename, rowsecurity
-- from pg_tables
-- where schemaname = 'public'
--   and tablename in (
--     'companies',
--     'employees',
--     'payroll_runs',
--     'payroll_run_employees',
--     'documents',
--     'audit_logs',
--     'company_deletion_audit'
--   )
-- order by tablename;
--
-- FORCE RLS status:
-- select n.nspname as schemaname, c.relname as tablename, c.relforcerowsecurity
-- from pg_class c
-- join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname = 'public'
--   and c.relname in (
--     'companies',
--     'employees',
--     'payroll_runs',
--     'payroll_run_employees',
--     'documents',
--     'audit_logs',
--     'company_deletion_audit'
--   )
-- order by c.relname;
