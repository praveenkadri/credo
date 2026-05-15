-- RLS and storage policies for the normalized workspace data layer.

begin;

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

alter table public.teams enable row level security;
alter table public.company_profiles enable row level security;
alter table public.company_addresses enable row level security;
alter table public.company_tax_profiles enable row level security;
alter table public.company_signatories enable row level security;
alter table public.employee_addresses enable row level security;
alter table public.employee_tax_profiles enable row level security;
alter table public.employee_compensation_profiles enable row level security;
alter table public.employee_work_schedules enable row level security;
alter table public.employee_payroll_settings enable row level security;
alter table public.payroll_run_employees enable row level security;
alter table public.documents enable row level security;

drop policy if exists teams_select on public.teams;
create policy teams_select
on public.teams
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists teams_insert on public.teams;
create policy teams_insert
on public.teams
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists teams_update on public.teams;
create policy teams_update
on public.teams
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists teams_delete on public.teams;
create policy teams_delete
on public.teams
for delete
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists company_profiles_select on public.company_profiles;
create policy company_profiles_select
on public.company_profiles
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists company_profiles_insert on public.company_profiles;
create policy company_profiles_insert
on public.company_profiles
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists company_profiles_update on public.company_profiles;
create policy company_profiles_update
on public.company_profiles
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists company_addresses_select on public.company_addresses;
create policy company_addresses_select
on public.company_addresses
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists company_addresses_insert on public.company_addresses;
create policy company_addresses_insert
on public.company_addresses
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists company_addresses_update on public.company_addresses;
create policy company_addresses_update
on public.company_addresses
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists company_tax_profiles_select on public.company_tax_profiles;
create policy company_tax_profiles_select
on public.company_tax_profiles
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists company_tax_profiles_insert on public.company_tax_profiles;
create policy company_tax_profiles_insert
on public.company_tax_profiles
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists company_tax_profiles_update on public.company_tax_profiles;
create policy company_tax_profiles_update
on public.company_tax_profiles
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists company_signatories_select on public.company_signatories;
create policy company_signatories_select
on public.company_signatories
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists company_signatories_insert on public.company_signatories;
create policy company_signatories_insert
on public.company_signatories
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists company_signatories_update on public.company_signatories;
create policy company_signatories_update
on public.company_signatories
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists company_signatories_delete on public.company_signatories;
create policy company_signatories_delete
on public.company_signatories
for delete
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists employee_addresses_select on public.employee_addresses;
create policy employee_addresses_select
on public.employee_addresses
for select
to anon, authenticated
using (public.can_access_employee_id(employee_id));

drop policy if exists employee_addresses_insert on public.employee_addresses;
create policy employee_addresses_insert
on public.employee_addresses
for insert
to anon, authenticated
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_addresses_update on public.employee_addresses;
create policy employee_addresses_update
on public.employee_addresses
for update
to anon, authenticated
using (public.can_access_employee_id(employee_id))
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_tax_profiles_select on public.employee_tax_profiles;
create policy employee_tax_profiles_select
on public.employee_tax_profiles
for select
to anon, authenticated
using (public.can_access_employee_id(employee_id));

drop policy if exists employee_tax_profiles_insert on public.employee_tax_profiles;
create policy employee_tax_profiles_insert
on public.employee_tax_profiles
for insert
to anon, authenticated
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_tax_profiles_update on public.employee_tax_profiles;
create policy employee_tax_profiles_update
on public.employee_tax_profiles
for update
to anon, authenticated
using (public.can_access_employee_id(employee_id))
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_compensation_profiles_select on public.employee_compensation_profiles;
create policy employee_compensation_profiles_select
on public.employee_compensation_profiles
for select
to anon, authenticated
using (public.can_access_employee_id(employee_id));

drop policy if exists employee_compensation_profiles_insert on public.employee_compensation_profiles;
create policy employee_compensation_profiles_insert
on public.employee_compensation_profiles
for insert
to anon, authenticated
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_compensation_profiles_update on public.employee_compensation_profiles;
create policy employee_compensation_profiles_update
on public.employee_compensation_profiles
for update
to anon, authenticated
using (public.can_access_employee_id(employee_id))
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_work_schedules_select on public.employee_work_schedules;
create policy employee_work_schedules_select
on public.employee_work_schedules
for select
to anon, authenticated
using (public.can_access_employee_id(employee_id));

drop policy if exists employee_work_schedules_insert on public.employee_work_schedules;
create policy employee_work_schedules_insert
on public.employee_work_schedules
for insert
to anon, authenticated
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_work_schedules_update on public.employee_work_schedules;
create policy employee_work_schedules_update
on public.employee_work_schedules
for update
to anon, authenticated
using (public.can_access_employee_id(employee_id))
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_payroll_settings_select on public.employee_payroll_settings;
create policy employee_payroll_settings_select
on public.employee_payroll_settings
for select
to anon, authenticated
using (public.can_access_employee_id(employee_id));

drop policy if exists employee_payroll_settings_insert on public.employee_payroll_settings;
create policy employee_payroll_settings_insert
on public.employee_payroll_settings
for insert
to anon, authenticated
with check (public.can_access_employee_id(employee_id));

drop policy if exists employee_payroll_settings_update on public.employee_payroll_settings;
create policy employee_payroll_settings_update
on public.employee_payroll_settings
for update
to anon, authenticated
using (public.can_access_employee_id(employee_id))
with check (public.can_access_employee_id(employee_id));

drop policy if exists payroll_run_employees_select on public.payroll_run_employees;
create policy payroll_run_employees_select
on public.payroll_run_employees
for select
to anon, authenticated
using (public.can_access_payroll_run_id(run_id));

drop policy if exists payroll_run_employees_insert on public.payroll_run_employees;
create policy payroll_run_employees_insert
on public.payroll_run_employees
for insert
to anon, authenticated
with check (public.can_access_payroll_run_id(run_id));

drop policy if exists payroll_run_employees_update on public.payroll_run_employees;
create policy payroll_run_employees_update
on public.payroll_run_employees
for update
to anon, authenticated
using (public.can_access_payroll_run_id(run_id))
with check (public.can_access_payroll_run_id(run_id));

drop policy if exists payroll_run_employees_delete on public.payroll_run_employees;
create policy payroll_run_employees_delete
on public.payroll_run_employees
for delete
to anon, authenticated
using (public.can_access_payroll_run_id(run_id));

drop policy if exists documents_select on public.documents;
create policy documents_select
on public.documents
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists documents_insert on public.documents;
create policy documents_insert
on public.documents
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists documents_update on public.documents;
create policy documents_update
on public.documents
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists documents_delete on public.documents;
create policy documents_delete
on public.documents
for delete
to anon, authenticated
using (public.can_access_company_id(company_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760,
  array[
    'application/pdf',
    'text/plain',
    'text/csv',
    'image/png',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists documents_storage_read on storage.objects;
create policy documents_storage_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and public.can_access_company_id((storage.foldername(name))[1])
);

drop policy if exists documents_storage_insert on storage.objects;
create policy documents_storage_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and public.can_access_company_id((storage.foldername(name))[1])
);

drop policy if exists documents_storage_update on storage.objects;
create policy documents_storage_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documents'
  and public.can_access_company_id((storage.foldername(name))[1])
)
with check (
  bucket_id = 'documents'
  and public.can_access_company_id((storage.foldername(name))[1])
);

drop policy if exists documents_storage_delete on storage.objects;
create policy documents_storage_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documents'
  and public.can_access_company_id((storage.foldername(name))[1])
);

commit;
