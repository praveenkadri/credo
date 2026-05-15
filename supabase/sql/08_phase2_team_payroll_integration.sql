-- Phase 2: Team + Payroll Data Integration foundation.
-- Additive and idempotent: safe to run more than once, with no destructive drops.

begin;

create extension if not exists pgcrypto;

alter table public.employees
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists role text,
  add column if not exists department text,
  add column if not exists work_location text,
  add column if not exists start_date date,
  add column if not exists employment_type text,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists postal_code text,
  add column if not exists country text,
  add column if not exists formatted_address text,
  add column if not exists address_verified boolean default false,
  add column if not exists address_source text,
  add column if not exists latitude numeric(10,7),
  add column if not exists longitude numeric(10,7),
  add column if not exists sin_last_four text,
  add column if not exists sin_status text default 'not_provided',
  add column if not exists date_of_birth date,
  add column if not exists tax_province text,
  add column if not exists rate_type text default 'hourly',
  add column if not exists rate_amount numeric(12,2) default 0,
  add column if not exists pay_schedule text,
  add column if not exists hours_per_day numeric(6,2) default 8,
  add column if not exists hours_per_week numeric(6,2) default 40,
  add column if not exists eligible_for_payroll boolean default true,
  add column if not exists default_in_payroll boolean default true,
  add column if not exists payment_method text,
  add column if not exists notes text;

alter table public.employees
  alter column address_verified set default false,
  alter column sin_status set default 'not_provided',
  alter column rate_type set default 'hourly',
  alter column rate_amount set default 0,
  alter column hours_per_day set default 8,
  alter column hours_per_week set default 40,
  alter column eligible_for_payroll set default true,
  alter column default_in_payroll set default true;

alter table public.payroll_runs
  add column if not exists pay_period_start date,
  add column if not exists pay_period_end date,
  add column if not exists pay_date date,
  add column if not exists payroll_type text,
  add column if not exists gross_pay numeric(12,2) default 0,
  add column if not exists deductions numeric(12,2) default 0,
  add column if not exists net_pay numeric(12,2) default 0,
  add column if not exists employee_count integer default 0,
  add column if not exists submitted_at timestamptz,
  add column if not exists submitted_by uuid,
  add column if not exists notes text;

alter table public.payroll_runs
  alter column gross_pay set default 0,
  alter column deductions set default 0,
  alter column net_pay set default 0,
  alter column employee_count set default 0;

do $$
declare
  payroll_runs_id_type text;
  employees_id_type text;
begin
  select format_type(a.atttypid, a.atttypmod)
    into payroll_runs_id_type
  from pg_attribute a
  where a.attrelid = 'public.payroll_runs'::regclass
    and a.attname = 'id'
    and not a.attisdropped;

  select format_type(a.atttypid, a.atttypmod)
    into employees_id_type
  from pg_attribute a
  where a.attrelid = 'public.employees'::regclass
    and a.attname = 'id'
    and not a.attisdropped;

  if payroll_runs_id_type is null or employees_id_type is null then
    raise exception 'Expected public.payroll_runs.id and public.employees.id to exist before running Phase 2 migration.';
  end if;

  if to_regclass('public.payroll_run_employees') is null then
    execute format(
      'create table public.payroll_run_employees (
        id uuid primary key default gen_random_uuid(),
        payroll_run_id %s references public.payroll_runs(id) on delete cascade,
        company_id text references public.companies(id) on delete cascade,
        employee_id %s references public.employees(id) on delete set null,
        employee_name text not null,
        rate_type text,
        rate_amount numeric(12,2) default 0,
        total_hours numeric(8,2) default 0,
        gross_pay numeric(12,2) default 0,
        deductions numeric(12,2) default 0,
        net_pay numeric(12,2) default 0,
        manual_hours_override boolean default false,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      )',
      payroll_runs_id_type,
      employees_id_type
    );
  else
    alter table public.payroll_run_employees
      add column if not exists id uuid default gen_random_uuid(),
      add column if not exists company_id text references public.companies(id) on delete cascade,
      add column if not exists employee_name text,
      add column if not exists rate_type text,
      add column if not exists rate_amount numeric(12,2) default 0,
      add column if not exists total_hours numeric(8,2) default 0,
      add column if not exists gross_pay numeric(12,2) default 0,
      add column if not exists deductions numeric(12,2) default 0,
      add column if not exists net_pay numeric(12,2) default 0,
      add column if not exists manual_hours_override boolean default false,
      add column if not exists created_at timestamptz default now(),
      add column if not exists updated_at timestamptz default now();

    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'payroll_run_employees'
        and column_name = 'payroll_run_id'
    ) then
      execute format(
        'alter table public.payroll_run_employees add column payroll_run_id %s references public.payroll_runs(id) on delete cascade',
        payroll_runs_id_type
      );
    end if;

    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'payroll_run_employees'
        and column_name = 'employee_id'
    ) then
      execute format(
        'alter table public.payroll_run_employees add column employee_id %s references public.employees(id) on delete set null',
        employees_id_type
      );
    end if;
  end if;
end $$;

alter table public.payroll_run_employees
  alter column id set default gen_random_uuid(),
  alter column rate_amount set default 0,
  alter column total_hours set default 0,
  alter column gross_pay set default 0,
  alter column deductions set default 0,
  alter column net_pay set default 0,
  alter column manual_hours_override set default false,
  alter column created_at set default now(),
  alter column updated_at set default now();

update public.payroll_run_employees
set id = gen_random_uuid()
where id is null;

update public.payroll_run_employees
set employee_name = 'Unknown employee'
where employee_name is null;

alter table public.payroll_run_employees
  alter column employee_name set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.payroll_run_employees'::regclass
      and contype = 'p'
  ) then
    alter table public.payroll_run_employees
      add constraint payroll_run_employees_pkey primary key (id);
  end if;
end $$;

do $$
declare
  payroll_runs_id_type text;
  employees_id_type text;
begin
  select format_type(a.atttypid, a.atttypmod)
    into payroll_runs_id_type
  from pg_attribute a
  where a.attrelid = 'public.payroll_runs'::regclass
    and a.attname = 'id'
    and not a.attisdropped;

  select format_type(a.atttypid, a.atttypmod)
    into employees_id_type
  from pg_attribute a
  where a.attrelid = 'public.employees'::regclass
    and a.attname = 'id'
    and not a.attisdropped;

  if payroll_runs_id_type is null or employees_id_type is null then
    raise exception 'Expected public.payroll_runs.id and public.employees.id to exist before running Phase 2 migration.';
  end if;

  if to_regclass('public.documents') is null then
    execute format(
      'create table public.documents (
        id uuid primary key default gen_random_uuid(),
        company_id text references public.companies(id) on delete cascade,
        employee_id %s references public.employees(id) on delete set null,
        payroll_run_id %s references public.payroll_runs(id) on delete set null,
        type text not null,
        document_type_id text,
        title text not null,
        document_date date,
        status text not null default ''generated'',
        file_url text,
        generated_at timestamptz,
        source_kind text not null default ''generated'',
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      )',
      employees_id_type,
      payroll_runs_id_type
    );
  else
    alter table public.documents
      add column if not exists id uuid default gen_random_uuid(),
      add column if not exists company_id text references public.companies(id) on delete cascade,
      add column if not exists type text,
      add column if not exists document_type_id text,
      add column if not exists title text,
      add column if not exists document_date date,
      add column if not exists status text default 'generated',
      add column if not exists file_url text,
      add column if not exists generated_at timestamptz,
      add column if not exists source_kind text default 'generated',
      add column if not exists created_at timestamptz default now(),
      add column if not exists updated_at timestamptz default now();

    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'documents'
        and column_name = 'employee_id'
    ) then
      execute format(
        'alter table public.documents add column employee_id %s references public.employees(id) on delete set null',
        employees_id_type
      );
    end if;

    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'documents'
        and column_name = 'payroll_run_id'
    ) then
      execute format(
        'alter table public.documents add column payroll_run_id %s references public.payroll_runs(id) on delete set null',
        payroll_runs_id_type
      );
    end if;
  end if;
end $$;

alter table public.documents
  alter column id set default gen_random_uuid(),
  alter column status set default 'generated',
  alter column created_at set default now(),
  alter column updated_at set default now();

update public.documents
set id = gen_random_uuid()
where id is null;

update public.documents
set type = coalesce(type, 'document')
where type is null;

update public.documents
set title = coalesce(title, 'Untitled document')
where title is null;

update public.documents
set status = coalesce(status, 'generated')
where status is null;

update public.documents
set source_kind = coalesce(source_kind, 'generated')
where source_kind is null;

alter table public.documents
  alter column type set not null,
  alter column title set not null,
  alter column status set not null,
  alter column source_kind set default 'generated',
  alter column source_kind set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.documents'::regclass
      and contype = 'p'
  ) then
    alter table public.documents
      add constraint documents_pkey primary key (id);
  end if;
end $$;

create index if not exists idx_employees_company_status
  on public.employees(company_id, status);

create index if not exists idx_payroll_runs_company_pay_date
  on public.payroll_runs(company_id, pay_date desc);

create index if not exists idx_payroll_run_employees_payroll_run_id
  on public.payroll_run_employees(payroll_run_id);

create index if not exists idx_payroll_run_employees_company_id
  on public.payroll_run_employees(company_id);

create index if not exists idx_payroll_run_employees_employee_id
  on public.payroll_run_employees(employee_id);

create index if not exists idx_documents_company_created_at
  on public.documents(company_id, created_at desc);

create index if not exists idx_documents_employee_id
  on public.documents(employee_id);

create index if not exists idx_documents_payroll_run_id
  on public.documents(payroll_run_id);

create index if not exists idx_documents_type
  on public.documents(type);

drop trigger if exists trg_payroll_run_employees_set_updated_at on public.payroll_run_employees;
create trigger trg_payroll_run_employees_set_updated_at
before update on public.payroll_run_employees
for each row execute function public.set_updated_at();

drop trigger if exists trg_documents_set_updated_at on public.documents;
create trigger trg_documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

alter table public.payroll_run_employees enable row level security;
alter table public.documents enable row level security;

drop policy if exists payroll_run_employees_select on public.payroll_run_employees;
create policy payroll_run_employees_select
on public.payroll_run_employees
for select
to anon, authenticated
using (public.can_access_company_id(company_id));

drop policy if exists payroll_run_employees_insert on public.payroll_run_employees;
create policy payroll_run_employees_insert
on public.payroll_run_employees
for insert
to anon, authenticated
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_run_employees_update on public.payroll_run_employees;
create policy payroll_run_employees_update
on public.payroll_run_employees
for update
to anon, authenticated
using (public.can_access_company_id(company_id))
with check (public.can_access_company_id(company_id));

drop policy if exists payroll_run_employees_delete on public.payroll_run_employees;
create policy payroll_run_employees_delete
on public.payroll_run_employees
for delete
to anon, authenticated
using (public.can_access_company_id(company_id));

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

commit;
