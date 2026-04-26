-- Credo core schema for currently designed pages:
-- Dashboard, Company Create/Onboarding, Company Detail, Company Profile

begin;

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id text primary key,
  name text not null,
  legal_name text,
  address text,
  address_line_1 text,
  address_line2 text,
  city text,
  province text,
  postal_code text,
  country text,
  formatted_address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  address_verified boolean not null default false,
  address_source text,
  address_has_subpremise boolean not null default false,
  logo_url text,
  director_name text,
  director_title text,
  signature_url text,
  payroll_account_number text,
  hst_number text,
  bin_number text,
  business_number text,
  fiscal_year_end text,
  employee_count integer not null default 0,
  status text not null default 'active',
  user_id uuid,
  owner_id uuid,
  created_by uuid,
  workspace_id text,
  organization_id text,
  billing_override boolean not null default false,
  plan_override text,
  setup_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies add column if not exists legal_name text;
alter table public.companies add column if not exists address text;
alter table public.companies add column if not exists address_line_1 text;
alter table public.companies add column if not exists address_line2 text;
alter table public.companies add column if not exists city text;
alter table public.companies add column if not exists province text;
alter table public.companies add column if not exists postal_code text;
alter table public.companies add column if not exists country text;
alter table public.companies add column if not exists formatted_address text;
alter table public.companies add column if not exists latitude numeric(10,7);
alter table public.companies add column if not exists longitude numeric(10,7);
alter table public.companies add column if not exists address_verified boolean not null default false;
alter table public.companies add column if not exists address_source text;
alter table public.companies add column if not exists address_has_subpremise boolean not null default false;
alter table public.companies add column if not exists logo_url text;
alter table public.companies add column if not exists director_name text;
alter table public.companies add column if not exists director_title text;
alter table public.companies add column if not exists signature_url text;
alter table public.companies add column if not exists payroll_account_number text;
alter table public.companies add column if not exists hst_number text;
alter table public.companies add column if not exists bin_number text;
alter table public.companies add column if not exists business_number text;
alter table public.companies add column if not exists fiscal_year_end text;
alter table public.companies add column if not exists employee_count integer not null default 0;
alter table public.companies add column if not exists status text not null default 'active';
alter table public.companies add column if not exists user_id uuid;
alter table public.companies add column if not exists owner_id uuid;
alter table public.companies add column if not exists created_by uuid;
alter table public.companies add column if not exists workspace_id text;
alter table public.companies add column if not exists organization_id text;
alter table public.companies add column if not exists billing_override boolean not null default false;
alter table public.companies add column if not exists plan_override text;
alter table public.companies add column if not exists setup_completed_at timestamptz;
alter table public.companies add column if not exists created_at timestamptz not null default now();
alter table public.companies add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_companies_name on public.companies(name);
create index if not exists idx_companies_updated_at on public.companies(updated_at desc);
create index if not exists idx_companies_user_id on public.companies(user_id);
create index if not exists idx_companies_owner_id on public.companies(owner_id);
create index if not exists idx_companies_created_by on public.companies(created_by);
create index if not exists idx_companies_workspace_id on public.companies(workspace_id);
create index if not exists idx_companies_organization_id on public.companies(organization_id);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  full_name text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employees add column if not exists full_name text;
alter table public.employees add column if not exists status text not null default 'active';
alter table public.employees add column if not exists created_at timestamptz not null default now();
alter table public.employees add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_employees_company_id on public.employees(company_id);

create table if not exists public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  total numeric(12,2) not null default 0,
  run_status text not null default 'prepared',
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payroll_runs add column if not exists total numeric(12,2) not null default 0;
alter table public.payroll_runs add column if not exists run_status text not null default 'prepared';
alter table public.payroll_runs add column if not exists saved_at timestamptz not null default now();
alter table public.payroll_runs add column if not exists created_at timestamptz not null default now();
alter table public.payroll_runs add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_payroll_runs_company_saved_at on public.payroll_runs(company_id, saved_at desc);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id text references public.companies(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_name text not null default '',
  details text,
  at timestamptz not null default now(),
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.audit_logs add column if not exists company_id text references public.companies(id) on delete set null;
alter table public.audit_logs add column if not exists action text;
alter table public.audit_logs add column if not exists entity_type text;
alter table public.audit_logs add column if not exists entity_name text not null default '';
alter table public.audit_logs add column if not exists details text;
alter table public.audit_logs add column if not exists at timestamptz not null default now();
alter table public.audit_logs add column if not exists created_by uuid;
alter table public.audit_logs add column if not exists created_at timestamptz not null default now();

update public.audit_logs set action = coalesce(action, 'updated') where action is null;
update public.audit_logs set entity_type = coalesce(entity_type, 'company') where entity_type is null;

alter table public.audit_logs alter column action set not null;
alter table public.audit_logs alter column entity_type set not null;

create index if not exists idx_audit_logs_company_at on public.audit_logs(company_id, at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.sync_company_address_columns()
returns trigger
language plpgsql
as $$
begin
  if coalesce(new.address_line_1, '') = '' and coalesce(new.address, '') <> '' then
    new.address_line_1 = new.address;
  end if;

  if coalesce(new.address, '') = '' and coalesce(new.address_line_1, '') <> '' then
    new.address = new.address_line_1;
  end if;

  if coalesce(new.formatted_address, '') = '' then
    new.formatted_address = coalesce(new.address_line_1, new.address, '');
  end if;

  if coalesce(new.legal_name, '') = '' then
    new.legal_name = new.name;
  end if;

  if coalesce(new.created_by, null) is null then
    new.created_by = coalesce(new.user_id, new.owner_id, auth.uid());
  end if;

  if coalesce(new.owner_id, null) is null then
    new.owner_id = coalesce(new.user_id, new.created_by, auth.uid());
  end if;

  if coalesce(new.user_id, null) is null then
    new.user_id = coalesce(new.owner_id, new.created_by, auth.uid());
  end if;

  return new;
end;
$$;

drop trigger if exists trg_companies_set_updated_at on public.companies;
create trigger trg_companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists trg_employees_set_updated_at on public.employees;
create trigger trg_employees_set_updated_at
before update on public.employees
for each row execute function public.set_updated_at();

drop trigger if exists trg_payroll_runs_set_updated_at on public.payroll_runs;
create trigger trg_payroll_runs_set_updated_at
before update on public.payroll_runs
for each row execute function public.set_updated_at();

drop trigger if exists trg_companies_sync_address_columns on public.companies;
create trigger trg_companies_sync_address_columns
before insert or update on public.companies
for each row execute function public.sync_company_address_columns();

commit;
