-- Verification for the normalized workspace data layer.
-- Run after 08, 09, and 10.

-- 1) New tables and views exist
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'teams',
    'company_profiles',
    'company_addresses',
    'company_tax_profiles',
    'company_signatories',
    'employee_addresses',
    'employee_tax_profiles',
    'employee_compensation_profiles',
    'employee_work_schedules',
    'employee_payroll_settings',
    'payroll_run_employees',
    'document_types',
    'documents'
  )
order by table_name;

select table_name
from information_schema.views
where table_schema = 'public'
  and table_name in (
    'workspace_company_profiles_v',
    'workspace_employee_directory_v',
    'workspace_payroll_runs_v',
    'workspace_documents_archive_v'
  )
order by table_name;

-- 2) Backfill row counts
select
  (select count(*) from public.companies) as companies,
  (select count(*) from public.company_profiles) as company_profiles,
  (select count(*) from public.company_addresses) as company_addresses,
  (select count(*) from public.company_tax_profiles) as company_tax_profiles,
  (select count(*) from public.teams) as teams,
  (select count(*) from public.employees) as employees,
  (select count(*) from public.employee_compensation_profiles) as employee_compensation_profiles,
  (select count(*) from public.employee_work_schedules) as employee_work_schedules,
  (select count(*) from public.employee_payroll_settings) as employee_payroll_settings,
  (select count(*) from public.payroll_runs) as payroll_runs,
  (select count(*) from public.documents) as documents;

-- 3) RLS and policies
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'teams',
    'company_profiles',
    'company_addresses',
    'company_tax_profiles',
    'company_signatories',
    'employee_addresses',
    'employee_tax_profiles',
    'employee_compensation_profiles',
    'employee_work_schedules',
    'employee_payroll_settings',
    'payroll_run_employees',
    'documents'
  )
order by tablename;

select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname in ('public', 'storage')
  and tablename in (
    'teams',
    'company_profiles',
    'company_addresses',
    'company_tax_profiles',
    'company_signatories',
    'employee_addresses',
    'employee_tax_profiles',
    'employee_compensation_profiles',
    'employee_work_schedules',
    'employee_payroll_settings',
    'payroll_run_employees',
    'documents',
    'objects'
  )
order by schemaname, tablename, policyname;

-- 4) Compatibility view spot checks
select *
from public.workspace_company_profiles_v
order by updated_at desc
limit 5;

select *
from public.workspace_employee_directory_v
order by updated_at desc
limit 5;

select *
from public.workspace_payroll_runs_v
order by coalesce(pay_date, saved_at::date) desc
limit 5;

select *
from public.workspace_documents_archive_v
order by document_date desc
limit 5;
