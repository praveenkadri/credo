-- Workspace data layer redesign driven by the current Credo screens.
-- Run after 01-07. This is additive: it keeps the existing tables alive
-- while introducing normalized structures for company, employee, payroll,
-- and document workflows.

begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'team_status'
  ) then
    create type public.team_status as enum ('active', 'archived');
  end if;

  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'employment_type'
  ) then
    create type public.employment_type as enum ('full_time', 'part_time', 'contractor');
  end if;

  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'compensation_rate_type'
  ) then
    create type public.compensation_rate_type as enum ('hourly', 'daily', 'weekly', 'bi_weekly', 'monthly', 'annual');
  end if;

  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'pay_schedule'
  ) then
    create type public.pay_schedule as enum ('weekly', 'bi_weekly', 'monthly');
  end if;

  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'payroll_type'
  ) then
    create type public.payroll_type as enum ('regular', 'bonus', 'off_cycle');
  end if;
end $$;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  slug text not null,
  name text not null,
  status public.team_status not null default 'active',
  is_system_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, slug)
);

create unique index if not exists idx_teams_one_default_per_company
  on public.teams(company_id)
  where is_system_default;

create index if not exists idx_teams_company_status
  on public.teams(company_id, status, name);

create table if not exists public.company_profiles (
  company_id text primary key references public.companies(id) on delete cascade,
  legal_name text,
  established_date date,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_addresses (
  company_id text primary key references public.companies(id) on delete cascade,
  line_1 text,
  line_2 text,
  city text,
  province text,
  postal_code text,
  country text,
  formatted_address text,
  source text,
  verified boolean not null default false,
  has_subpremise boolean not null default false,
  latitude numeric(10,7),
  longitude numeric(10,7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_tax_profiles (
  company_id text primary key references public.companies(id) on delete cascade,
  payroll_account_number text,
  hst_number text,
  bin_number text,
  business_number text,
  fiscal_year_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_signatories (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  full_name text not null,
  title text,
  signature_url text,
  is_primary boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_company_signatories_primary
  on public.company_signatories(company_id)
  where is_primary and active;

create index if not exists idx_company_signatories_company
  on public.company_signatories(company_id, active, created_at desc);

alter table public.employees
  add column if not exists team_id uuid references public.teams(id) on delete set null,
  add column if not exists preferred_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists role_title text,
  add column if not exists department text,
  add column if not exists work_location text,
  add column if not exists start_date date,
  add column if not exists employment_type public.employment_type not null default 'full_time',
  add column if not exists termination_date date;

create index if not exists idx_employees_team_id
  on public.employees(team_id);

create index if not exists idx_employees_company_status
  on public.employees(company_id, status, full_name);

create table if not exists public.employee_addresses (
  employee_id text primary key references public.employees(id) on delete cascade,
  line_1 text,
  line_2 text,
  city text,
  province text,
  postal_code text,
  country text not null default 'Canada',
  formatted_address text,
  source text,
  verified boolean not null default false,
  has_subpremise boolean not null default false,
  latitude numeric(10,7),
  longitude numeric(10,7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_tax_profiles (
  employee_id text primary key references public.employees(id) on delete cascade,
  sin_encrypted text,
  sin_last4 text,
  sin_expiry_date date,
  date_of_birth date,
  tax_province text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_compensation_profiles (
  employee_id text primary key references public.employees(id) on delete cascade,
  rate_type public.compensation_rate_type not null default 'hourly',
  rate_amount numeric(12,2) not null default 0,
  pay_schedule public.pay_schedule not null default 'bi_weekly',
  additional_rates jsonb not null default '[]'::jsonb,
  currency_code text not null default 'CAD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_work_schedules (
  employee_id text primary key references public.employees(id) on delete cascade,
  hours_per_day numeric(5,2) not null default 8,
  hours_per_week numeric(5,2) not null default 40,
  working_days jsonb not null default '["Mon","Tue","Wed","Thu","Fri"]'::jsonb,
  overrides jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_payroll_settings (
  employee_id text primary key references public.employees(id) on delete cascade,
  eligible_for_payroll boolean not null default true,
  default_in_payroll boolean not null default true,
  payment_method text,
  tax_profile text not null default 'Standard payroll profile',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payroll_runs
  add column if not exists team_id uuid references public.teams(id) on delete set null,
  add column if not exists pay_period_label text,
  add column if not exists period_start date,
  add column if not exists period_end date,
  add column if not exists pay_date date,
  add column if not exists payroll_type public.payroll_type not null default 'regular',
  add column if not exists currency_code text not null default 'CAD',
  add column if not exists employee_summary text,
  add column if not exists total_gross numeric(12,2) not null default 0,
  add column if not exists total_deductions numeric(12,2) not null default 0,
  add column if not exists total_net numeric(12,2) not null default 0,
  add column if not exists notes text,
  add column if not exists completed_at timestamptz,
  add column if not exists created_by uuid;

create index if not exists idx_payroll_runs_team_pay_date
  on public.payroll_runs(team_id, pay_date desc nulls last);

create index if not exists idx_payroll_runs_company_pay_date
  on public.payroll_runs(company_id, pay_date desc nulls last);

create table if not exists public.payroll_run_employees (
  run_id text not null references public.payroll_runs(id) on delete cascade,
  employee_id text not null references public.employees(id) on delete cascade,
  included boolean not null default true,
  hours_worked numeric(8,2),
  gross_pay numeric(12,2) not null default 0,
  deductions numeric(12,2) not null default 0,
  net_pay numeric(12,2) not null default 0,
  rate_type public.compensation_rate_type,
  rate_amount numeric(12,2),
  payment_method text,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (run_id, employee_id)
);

create index if not exists idx_payroll_run_employees_employee
  on public.payroll_run_employees(employee_id, created_at desc);

create table if not exists public.document_types (
  id text primary key,
  label text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  employee_id text references public.employees(id) on delete set null,
  payroll_run_id text references public.payroll_runs(id) on delete set null,
  document_type_id text not null references public.document_types(id),
  title text not null,
  document_date date not null,
  storage_bucket text not null default 'documents',
  storage_path text,
  download_name text,
  mime_type text,
  file_size_bytes bigint,
  source_kind text not null default 'generated',
  status text not null default 'ready',
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_company_date
  on public.documents(company_id, document_date desc);

create index if not exists idx_documents_employee_date
  on public.documents(employee_id, document_date desc)
  where employee_id is not null;

create index if not exists idx_documents_payroll_run
  on public.documents(payroll_run_id)
  where payroll_run_id is not null;

insert into public.document_types (id, label, category)
values
  ('pay-stub', 'Pay stub', 'payroll'),
  ('payroll-run', 'Payroll run', 'payroll'),
  ('letter', 'Letter', 'company'),
  ('tax-form', 'Tax form', 'tax')
on conflict (id) do update
set
  label = excluded.label,
  category = excluded.category;

drop trigger if exists trg_teams_set_updated_at on public.teams;
create trigger trg_teams_set_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

drop trigger if exists trg_company_profiles_set_updated_at on public.company_profiles;
create trigger trg_company_profiles_set_updated_at
before update on public.company_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_company_addresses_set_updated_at on public.company_addresses;
create trigger trg_company_addresses_set_updated_at
before update on public.company_addresses
for each row execute function public.set_updated_at();

drop trigger if exists trg_company_tax_profiles_set_updated_at on public.company_tax_profiles;
create trigger trg_company_tax_profiles_set_updated_at
before update on public.company_tax_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_company_signatories_set_updated_at on public.company_signatories;
create trigger trg_company_signatories_set_updated_at
before update on public.company_signatories
for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_addresses_set_updated_at on public.employee_addresses;
create trigger trg_employee_addresses_set_updated_at
before update on public.employee_addresses
for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_tax_profiles_set_updated_at on public.employee_tax_profiles;
create trigger trg_employee_tax_profiles_set_updated_at
before update on public.employee_tax_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_compensation_profiles_set_updated_at on public.employee_compensation_profiles;
create trigger trg_employee_compensation_profiles_set_updated_at
before update on public.employee_compensation_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_work_schedules_set_updated_at on public.employee_work_schedules;
create trigger trg_employee_work_schedules_set_updated_at
before update on public.employee_work_schedules
for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_payroll_settings_set_updated_at on public.employee_payroll_settings;
create trigger trg_employee_payroll_settings_set_updated_at
before update on public.employee_payroll_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_payroll_run_employees_set_updated_at on public.payroll_run_employees;
create trigger trg_payroll_run_employees_set_updated_at
before update on public.payroll_run_employees
for each row execute function public.set_updated_at();

drop trigger if exists trg_documents_set_updated_at on public.documents;
create trigger trg_documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

commit;
