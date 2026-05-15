-- Phase 4A exit-gate RLS hardening.
--
-- Runs after workspace data-layer migrations so later normalized-table policies
-- cannot reintroduce anonymous access to sensitive app data.

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

create or replace function public.can_access_team_id(p_team_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.teams t
    where t.id = p_team_id
      and public.can_access_company_id(t.company_id)
  );
$$;

create or replace function public.can_access_employee_id(p_employee_id text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.employees e
    where e.id = p_employee_id
      and public.can_access_company_id(e.company_id)
  );
$$;

create or replace function public.can_access_payroll_run_id(p_run_id text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.payroll_runs pr
    where pr.id = p_run_id
      and public.can_access_company_id(pr.company_id)
  );
$$;

create or replace function public.company_id_from_storage_object_name(object_name text)
returns text
language sql
stable
as $$
  select case
    when (storage.foldername(object_name))[1] = 'companies'
      then nullif((storage.foldername(object_name))[2], '')
    else nullif((storage.foldername(object_name))[1], '')
  end;
$$;

do $$
declare
  app_tables text[] := array[
    'companies',
    'employees',
    'payroll_runs',
    'payroll_run_employees',
    'documents',
    'audit_logs',
    'company_deletion_audit',
    'teams',
    'company_profiles',
    'company_addresses',
    'company_tax_profiles',
    'company_signatories',
    'employee_addresses',
    'employee_tax_profiles',
    'employee_compensation_profiles',
    'employee_work_schedules',
    'employee_payroll_settings'
  ];
  table_name text;
  policy record;
begin
  foreach table_name in array app_tables loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('alter table public.%I force row level security', table_name);
      execute format('revoke all on table public.%I from anon', table_name);
    end if;
  end loop;

  for policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any(app_tables)
  loop
    execute format('drop policy if exists %I on %I.%I', policy.policyname, policy.schemaname, policy.tablename);
  end loop;
end $$;

do $$
begin
  if to_regclass('public.companies') is not null then
    create policy companies_select on public.companies for select to authenticated using (public.can_access_company_row(companies));
    create policy companies_insert on public.companies for insert to authenticated with check (public.can_insert_company_row(companies));
    create policy companies_update on public.companies for update to authenticated using (public.can_access_company_row(companies)) with check (public.can_access_company_row(companies));
  end if;

  if to_regclass('public.employees') is not null then
    create policy employees_select on public.employees for select to authenticated using (public.can_access_company_id(company_id));
    create policy employees_insert on public.employees for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy employees_update on public.employees for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.payroll_runs') is not null then
    create policy payroll_runs_select on public.payroll_runs for select to authenticated using (public.can_access_company_id(company_id));
    create policy payroll_runs_insert on public.payroll_runs for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy payroll_runs_update on public.payroll_runs for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.payroll_run_employees') is not null then
    create policy payroll_run_employees_select on public.payroll_run_employees for select to authenticated using (public.can_access_company_id(company_id));
    create policy payroll_run_employees_insert on public.payroll_run_employees for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy payroll_run_employees_update on public.payroll_run_employees for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.documents') is not null then
    create policy documents_select on public.documents for select to authenticated using (public.can_access_company_id(company_id));
    create policy documents_insert on public.documents for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy documents_update on public.documents for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.audit_logs') is not null then
    create policy audit_logs_select on public.audit_logs for select to authenticated using (company_id is not null and public.can_access_company_id(company_id));
    create policy audit_logs_insert on public.audit_logs for insert to authenticated with check (company_id is not null and public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.company_deletion_audit') is not null then
    create policy company_deletion_audit_select on public.company_deletion_audit for select to authenticated using (public.can_access_company_id(company_id));
    create policy company_deletion_audit_insert on public.company_deletion_audit for insert to authenticated with check (
      deleted_by = auth.uid()
      and exists (
        select 1
        from public.companies c
        where c.id = company_deletion_audit.company_id
          and public.can_delete_company_row(c)
      )
    );
  end if;

  if to_regclass('public.teams') is not null then
    create policy teams_select on public.teams for select to authenticated using (public.can_access_company_id(company_id));
    create policy teams_insert on public.teams for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy teams_update on public.teams for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.company_profiles') is not null then
    create policy company_profiles_select on public.company_profiles for select to authenticated using (public.can_access_company_id(company_id));
    create policy company_profiles_insert on public.company_profiles for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy company_profiles_update on public.company_profiles for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.company_addresses') is not null then
    create policy company_addresses_select on public.company_addresses for select to authenticated using (public.can_access_company_id(company_id));
    create policy company_addresses_insert on public.company_addresses for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy company_addresses_update on public.company_addresses for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.company_tax_profiles') is not null then
    create policy company_tax_profiles_select on public.company_tax_profiles for select to authenticated using (public.can_access_company_id(company_id));
    create policy company_tax_profiles_insert on public.company_tax_profiles for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy company_tax_profiles_update on public.company_tax_profiles for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.company_signatories') is not null then
    create policy company_signatories_select on public.company_signatories for select to authenticated using (public.can_access_company_id(company_id));
    create policy company_signatories_insert on public.company_signatories for insert to authenticated with check (public.can_access_company_id(company_id));
    create policy company_signatories_update on public.company_signatories for update to authenticated using (public.can_access_company_id(company_id)) with check (public.can_access_company_id(company_id));
  end if;

  if to_regclass('public.employee_addresses') is not null then
    create policy employee_addresses_select on public.employee_addresses for select to authenticated using (public.can_access_employee_id(employee_id));
    create policy employee_addresses_insert on public.employee_addresses for insert to authenticated with check (public.can_access_employee_id(employee_id));
    create policy employee_addresses_update on public.employee_addresses for update to authenticated using (public.can_access_employee_id(employee_id)) with check (public.can_access_employee_id(employee_id));
  end if;

  if to_regclass('public.employee_tax_profiles') is not null then
    create policy employee_tax_profiles_select on public.employee_tax_profiles for select to authenticated using (public.can_access_employee_id(employee_id));
    create policy employee_tax_profiles_insert on public.employee_tax_profiles for insert to authenticated with check (public.can_access_employee_id(employee_id));
    create policy employee_tax_profiles_update on public.employee_tax_profiles for update to authenticated using (public.can_access_employee_id(employee_id)) with check (public.can_access_employee_id(employee_id));
  end if;

  if to_regclass('public.employee_compensation_profiles') is not null then
    create policy employee_compensation_profiles_select on public.employee_compensation_profiles for select to authenticated using (public.can_access_employee_id(employee_id));
    create policy employee_compensation_profiles_insert on public.employee_compensation_profiles for insert to authenticated with check (public.can_access_employee_id(employee_id));
    create policy employee_compensation_profiles_update on public.employee_compensation_profiles for update to authenticated using (public.can_access_employee_id(employee_id)) with check (public.can_access_employee_id(employee_id));
  end if;

  if to_regclass('public.employee_work_schedules') is not null then
    create policy employee_work_schedules_select on public.employee_work_schedules for select to authenticated using (public.can_access_employee_id(employee_id));
    create policy employee_work_schedules_insert on public.employee_work_schedules for insert to authenticated with check (public.can_access_employee_id(employee_id));
    create policy employee_work_schedules_update on public.employee_work_schedules for update to authenticated using (public.can_access_employee_id(employee_id)) with check (public.can_access_employee_id(employee_id));
  end if;

  if to_regclass('public.employee_payroll_settings') is not null then
    create policy employee_payroll_settings_select on public.employee_payroll_settings for select to authenticated using (public.can_access_employee_id(employee_id));
    create policy employee_payroll_settings_insert on public.employee_payroll_settings for insert to authenticated with check (public.can_access_employee_id(employee_id));
    create policy employee_payroll_settings_update on public.employee_payroll_settings for update to authenticated using (public.can_access_employee_id(employee_id)) with check (public.can_access_employee_id(employee_id));
  end if;
end $$;

update storage.buckets
set public = false
where id in ('documents', 'company-assets');

drop policy if exists documents_storage_read on storage.objects;
create policy documents_storage_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
);

drop policy if exists documents_storage_insert on storage.objects;
create policy documents_storage_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
);

drop policy if exists documents_storage_update on storage.objects;
create policy documents_storage_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documents'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
)
with check (
  bucket_id = 'documents'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
);

drop policy if exists documents_storage_delete on storage.objects;

drop policy if exists company_assets_read on storage.objects;
create policy company_assets_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'company-assets'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
);

drop policy if exists company_assets_insert on storage.objects;
create policy company_assets_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'company-assets'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
);

drop policy if exists company_assets_update on storage.objects;
create policy company_assets_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'company-assets'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
)
with check (
  bucket_id = 'company-assets'
  and public.can_access_company_id(public.company_id_from_storage_object_name(name))
);

drop policy if exists company_assets_delete on storage.objects;

commit;

-- Verification queries:
--
-- Active policies on sensitive/app tables that still mention anon:
-- select schemaname, tablename, policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname in ('public', 'storage')
--   and (
--     roles::text ilike '%anon%'
--     or coalesce(qual, '') ilike '%anon%'
--     or coalesce(with_check, '') ilike '%anon%'
--   )
-- order by schemaname, tablename, policyname;
--
-- RLS and FORCE RLS status:
-- select n.nspname as schema_name,
--        c.relname as table_name,
--        c.relrowsecurity as rls_enabled,
--        c.relforcerowsecurity as force_rls
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
--     'company_deletion_audit',
--     'teams',
--     'company_profiles',
--     'company_addresses',
--     'company_tax_profiles',
--     'company_signatories',
--     'employee_addresses',
--     'employee_tax_profiles',
--     'employee_compensation_profiles',
--     'employee_work_schedules',
--     'employee_payroll_settings'
--   )
-- order by c.relname;
