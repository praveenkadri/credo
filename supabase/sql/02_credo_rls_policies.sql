-- Credo RLS for current app pages and server actions.
-- This is designed for Supabase Auth JWT + authenticated users.

begin;

create or replace function public.jwt_workspace_id()
returns text
language sql
stable
as $$
  select nullif(
    coalesce(
      auth.jwt() ->> 'workspace_id',
      auth.jwt() ->> 'organization_id'
    ),
    ''
  );
$$;

create or replace function public.can_access_company_row(c public.companies)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or auth.role() = 'anon'
    or (
      auth.uid() is not null
      and (
        c.user_id = auth.uid()
        or c.owner_id = auth.uid()
        or c.created_by = auth.uid()
      )
    )
    or (
      public.jwt_workspace_id() is not null
      and (
        c.workspace_id = public.jwt_workspace_id()
        or c.organization_id = public.jwt_workspace_id()
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
    or auth.role() = 'anon'
    or (
      auth.uid() is not null
      and (
        coalesce(c.user_id, auth.uid()) = auth.uid()
        or coalesce(c.owner_id, auth.uid()) = auth.uid()
        or coalesce(c.created_by, auth.uid()) = auth.uid()
        or (
          public.jwt_workspace_id() is not null
          and (
            coalesce(c.workspace_id, public.jwt_workspace_id()) = public.jwt_workspace_id()
            or coalesce(c.organization_id, public.jwt_workspace_id()) = public.jwt_workspace_id()
          )
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

alter table public.companies enable row level security;
alter table public.employees enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.audit_logs enable row level security;

-- companies

drop policy if exists companies_select on public.companies;
create policy companies_select
on public.companies
for select
using (public.can_access_company_row(companies));

drop policy if exists companies_insert on public.companies;
create policy companies_insert
on public.companies
for insert
to anon, authenticated
with check (public.can_insert_company_row(companies));

drop policy if exists companies_update on public.companies;
create policy companies_update
on public.companies
for update
to authenticated
using (public.can_access_company_row(companies))
with check (public.can_access_company_row(companies));

drop policy if exists companies_delete on public.companies;
create policy companies_delete
on public.companies
for delete
to authenticated
using (public.can_access_company_row(companies));

-- employees

drop policy if exists employees_select on public.employees;
create policy employees_select
on public.employees
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists employees_insert on public.employees;
create policy employees_insert
on public.employees
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists employees_update on public.employees;
create policy employees_update
on public.employees
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists employees_delete on public.employees;
create policy employees_delete
on public.employees
for delete
to anon, authenticated
using (public.can_access_company_id(company_id));

-- payroll_runs

drop policy if exists payroll_runs_select on public.payroll_runs;
create policy payroll_runs_select
on public.payroll_runs
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists payroll_runs_insert on public.payroll_runs;
create policy payroll_runs_insert
on public.payroll_runs
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_runs_update on public.payroll_runs;
create policy payroll_runs_update
on public.payroll_runs
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_runs_delete on public.payroll_runs;
create policy payroll_runs_delete
on public.payroll_runs
for delete
to anon, authenticated
using (public.can_access_company_id(company_id));

-- audit_logs

drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select
on public.audit_logs
for select
to anon, authenticated
using (
  company_id is null
  or public.can_access_company_id(company_id)
);

drop policy if exists audit_logs_insert on public.audit_logs;
create policy audit_logs_insert
on public.audit_logs
for insert
to anon, authenticated
with check (
  company_id is null
  or public.can_access_company_id(company_id)
);

drop policy if exists audit_logs_update on public.audit_logs;
create policy audit_logs_update
on public.audit_logs
for update
to anon, authenticated
using (
  company_id is null
  or public.can_access_company_id(company_id)
)
with check (
  company_id is null
  or public.can_access_company_id(company_id)
);

drop policy if exists audit_logs_delete on public.audit_logs;
create policy audit_logs_delete
on public.audit_logs
for delete
to anon, authenticated
using (
  company_id is null
  or public.can_access_company_id(company_id)
);

commit;
