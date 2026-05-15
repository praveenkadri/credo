-- Duplicate-company guard for the current Credo create/update flow.
-- Run after 01-11.
--
-- Rules:
-- 1. Inside the same workspace/org scope, block duplicates on:
--    - business_number
--    - payroll_account_number
--    - hst_number
-- 2. If none of those identifiers are present, block likely duplicates on:
--    - normalized legal_name/name
--    - same city
--    - same province
-- 3. Ignore soft-deleted companies when deleted_at exists.

begin;

create or replace function public.normalize_company_match_text(value text)
returns text
language sql
immutable
as $$
  select nullif(
    regexp_replace(
      lower(trim(coalesce(value, ''))),
      '[^a-z0-9]+',
      '',
      'g'
    ),
    ''
  );
$$;

create or replace function public.enforce_company_duplicate_guard()
returns trigger
language plpgsql
as $$
declare
  existing_record public.companies%rowtype;
  new_scope text;
  new_business_number text;
  new_payroll_number text;
  new_hst_number text;
  new_legal_name text;
  new_city text;
  new_province text;
  has_deleted_at boolean;
begin
  new_scope := coalesce(nullif(new.workspace_id, ''), nullif(new.organization_id, ''), '__global__');
  new_business_number := public.normalize_company_match_text(new.business_number);
  new_payroll_number := public.normalize_company_match_text(new.payroll_account_number);
  new_hst_number := public.normalize_company_match_text(new.hst_number);
  new_legal_name := public.normalize_company_match_text(coalesce(nullif(new.legal_name, ''), new.name));
  new_city := public.normalize_company_match_text(new.city);
  new_province := public.normalize_company_match_text(new.province);

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'companies'
      and column_name = 'deleted_at'
  ) into has_deleted_at;

  if new_business_number is not null then
    select c.*
    into existing_record
    from public.companies c
    where c.id <> coalesce(new.id, '')
      and coalesce(nullif(c.workspace_id, ''), nullif(c.organization_id, ''), '__global__') = new_scope
      and public.normalize_company_match_text(c.business_number) = new_business_number
      and (not has_deleted_at or c.deleted_at is null)
    limit 1;

    if found then
      raise exception 'Duplicate company: business number already exists for "%"', existing_record.name
        using errcode = '23505';
    end if;
  end if;

  if new_payroll_number is not null then
    select c.*
    into existing_record
    from public.companies c
    where c.id <> coalesce(new.id, '')
      and coalesce(nullif(c.workspace_id, ''), nullif(c.organization_id, ''), '__global__') = new_scope
      and public.normalize_company_match_text(c.payroll_account_number) = new_payroll_number
      and (not has_deleted_at or c.deleted_at is null)
    limit 1;

    if found then
      raise exception 'Duplicate company: payroll number already exists for "%"', existing_record.name
        using errcode = '23505';
    end if;
  end if;

  if new_hst_number is not null then
    select c.*
    into existing_record
    from public.companies c
    where c.id <> coalesce(new.id, '')
      and coalesce(nullif(c.workspace_id, ''), nullif(c.organization_id, ''), '__global__') = new_scope
      and public.normalize_company_match_text(c.hst_number) = new_hst_number
      and (not has_deleted_at or c.deleted_at is null)
    limit 1;

    if found then
      raise exception 'Duplicate company: HST number already exists for "%"', existing_record.name
        using errcode = '23505';
    end if;
  end if;

  if new_business_number is null
     and new_payroll_number is null
     and new_hst_number is null
     and new_legal_name is not null
     and new_city is not null
     and new_province is not null then
    select c.*
    into existing_record
    from public.companies c
    where c.id <> coalesce(new.id, '')
      and coalesce(nullif(c.workspace_id, ''), nullif(c.organization_id, ''), '__global__') = new_scope
      and public.normalize_company_match_text(coalesce(nullif(c.legal_name, ''), c.name)) = new_legal_name
      and public.normalize_company_match_text(c.city) = new_city
      and public.normalize_company_match_text(c.province) = new_province
      and (not has_deleted_at or c.deleted_at is null)
    limit 1;

    if found then
      raise exception 'Duplicate company: "%", in the same city/province, already exists', existing_record.name
        using errcode = '23505';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_companies_duplicate_guard on public.companies;
create trigger trg_companies_duplicate_guard
before insert or update on public.companies
for each row execute function public.enforce_company_duplicate_guard();

commit;
