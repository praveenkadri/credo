-- Backfill normalized workspace tables from the current thin schema.
-- Safe to re-run.

begin;

insert into public.company_profiles (
  company_id,
  legal_name,
  logo_url,
  created_at,
  updated_at
)
select
  c.id,
  nullif(c.legal_name, ''),
  nullif(c.logo_url, ''),
  c.created_at,
  c.updated_at
from public.companies c
on conflict (company_id) do update
set
  legal_name = excluded.legal_name,
  logo_url = excluded.logo_url,
  updated_at = greatest(public.company_profiles.updated_at, excluded.updated_at);

insert into public.company_addresses (
  company_id,
  line_1,
  line_2,
  city,
  province,
  postal_code,
  country,
  formatted_address,
  source,
  verified,
  has_subpremise,
  latitude,
  longitude,
  created_at,
  updated_at
)
select
  c.id,
  nullif(coalesce(c.address_line_1, c.address), ''),
  nullif(c.address_line2, ''),
  nullif(c.city, ''),
  nullif(c.province, ''),
  nullif(c.postal_code, ''),
  nullif(c.country, ''),
  nullif(c.formatted_address, ''),
  nullif(c.address_source, ''),
  coalesce(c.address_verified, false),
  coalesce(c.address_has_subpremise, false),
  c.latitude,
  c.longitude,
  c.created_at,
  c.updated_at
from public.companies c
on conflict (company_id) do update
set
  line_1 = excluded.line_1,
  line_2 = excluded.line_2,
  city = excluded.city,
  province = excluded.province,
  postal_code = excluded.postal_code,
  country = excluded.country,
  formatted_address = excluded.formatted_address,
  source = excluded.source,
  verified = excluded.verified,
  has_subpremise = excluded.has_subpremise,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  updated_at = greatest(public.company_addresses.updated_at, excluded.updated_at);

insert into public.company_tax_profiles (
  company_id,
  payroll_account_number,
  hst_number,
  bin_number,
  business_number,
  fiscal_year_end,
  created_at,
  updated_at
)
select
  c.id,
  nullif(c.payroll_account_number, ''),
  nullif(c.hst_number, ''),
  nullif(c.bin_number, ''),
  nullif(c.business_number, ''),
  case
    when nullif(c.fiscal_year_end, '') ~ '^\d{4}-\d{2}-\d{2}$' then c.fiscal_year_end::date
    else null
  end,
  c.created_at,
  c.updated_at
from public.companies c
on conflict (company_id) do update
set
  payroll_account_number = excluded.payroll_account_number,
  hst_number = excluded.hst_number,
  bin_number = excluded.bin_number,
  business_number = excluded.business_number,
  fiscal_year_end = excluded.fiscal_year_end,
  updated_at = greatest(public.company_tax_profiles.updated_at, excluded.updated_at);

insert into public.company_signatories (
  company_id,
  full_name,
  title,
  signature_url,
  is_primary,
  active,
  created_at,
  updated_at
)
select
  c.id,
  nullif(c.director_name, ''),
  nullif(c.director_title, ''),
  nullif(c.signature_url, ''),
  true,
  true,
  c.created_at,
  c.updated_at
from public.companies c
where nullif(c.director_name, '') is not null
on conflict do nothing;

insert into public.teams (
  company_id,
  slug,
  name,
  status,
  is_system_default,
  created_at,
  updated_at
)
select
  c.id,
  'general',
  'General',
  'active'::public.team_status,
  true,
  c.created_at,
  c.updated_at
from public.companies c
on conflict (company_id, slug) do update
set
  name = excluded.name,
  status = excluded.status,
  is_system_default = excluded.is_system_default,
  updated_at = greatest(public.teams.updated_at, excluded.updated_at);

update public.employees e
set team_id = t.id
from public.teams t
where e.company_id = t.company_id
  and t.is_system_default
  and e.team_id is null;

insert into public.employee_addresses (employee_id)
select e.id
from public.employees e
on conflict (employee_id) do nothing;

insert into public.employee_tax_profiles (employee_id)
select e.id
from public.employees e
on conflict (employee_id) do nothing;

insert into public.employee_compensation_profiles (
  employee_id,
  rate_type,
  rate_amount,
  pay_schedule,
  additional_rates,
  currency_code
)
select
  e.id,
  'hourly'::public.compensation_rate_type,
  0,
  'bi_weekly'::public.pay_schedule,
  '[]'::jsonb,
  'CAD'
from public.employees e
on conflict (employee_id) do nothing;

insert into public.employee_work_schedules (
  employee_id,
  hours_per_day,
  hours_per_week,
  working_days,
  overrides
)
select
  e.id,
  8,
  40,
  '["Mon","Tue","Wed","Thu","Fri"]'::jsonb,
  '[]'::jsonb
from public.employees e
on conflict (employee_id) do nothing;

insert into public.employee_payroll_settings (
  employee_id,
  eligible_for_payroll,
  default_in_payroll,
  tax_profile
)
select
  e.id,
  true,
  true,
  'Standard payroll profile'
from public.employees e
on conflict (employee_id) do nothing;

update public.payroll_runs
set
  pay_date = coalesce(pay_date, timezone('UTC', saved_at)::date),
  pay_period_label = coalesce(pay_period_label, 'Imported payroll run'),
  payroll_type = coalesce(payroll_type, 'regular'::public.payroll_type),
  total_gross = case when total_gross = 0 then total else total_gross end,
  total_net = case when total_net = 0 then total else total_net end
where
  pay_date is null
  or pay_period_label is null
  or total_gross = 0
  or total_net = 0;

commit;

-- Screen-friendly compatibility views for the new archive/detail flows.

create or replace view public.workspace_company_profiles_v as
with primary_signatory as (
  select distinct on (company_id)
    company_id,
    full_name,
    title,
    signature_url
  from public.company_signatories
  where active
  order by company_id, is_primary desc, created_at asc
)
select
  c.id as company_id,
  c.name as company_name,
  coalesce(cp.legal_name, c.legal_name, c.name) as legal_name,
  cp.established_date,
  coalesce(cp.logo_url, c.logo_url) as logo_url,
  coalesce(ca.line_1, c.address_line_1, c.address) as address_line_1,
  coalesce(ca.line_2, c.address_line2) as address_line_2,
  coalesce(ca.city, c.city) as city,
  coalesce(ca.province, c.province) as province,
  coalesce(ca.postal_code, c.postal_code) as postal_code,
  coalesce(ca.country, c.country) as country,
  coalesce(ca.formatted_address, c.formatted_address) as formatted_address,
  coalesce(ca.source, c.address_source) as address_source,
  coalesce(ca.verified, c.address_verified) as address_verified,
  coalesce(ca.has_subpremise, c.address_has_subpremise) as address_has_subpremise,
  coalesce(ca.latitude, c.latitude) as latitude,
  coalesce(ca.longitude, c.longitude) as longitude,
  coalesce(ctp.payroll_account_number, c.payroll_account_number) as payroll_account_number,
  coalesce(ctp.hst_number, c.hst_number) as hst_number,
  coalesce(ctp.bin_number, c.bin_number) as bin_number,
  coalesce(ctp.business_number, c.business_number) as business_number,
  ctp.fiscal_year_end,
  coalesce(ps.full_name, c.director_name) as director_name,
  coalesce(ps.title, c.director_title) as director_title,
  coalesce(ps.signature_url, c.signature_url) as signature_url,
  c.status,
  c.employee_count,
  c.user_id,
  c.owner_id,
  c.created_by,
  c.workspace_id,
  c.organization_id,
  c.setup_completed_at,
  c.deleted_at,
  c.deleted_by,
  c.delete_reason,
  c.delete_reason_note,
  c.created_at,
  c.updated_at
from public.companies c
left join public.company_profiles cp on cp.company_id = c.id
left join public.company_addresses ca on ca.company_id = c.id
left join public.company_tax_profiles ctp on ctp.company_id = c.id
left join primary_signatory ps on ps.company_id = c.id;

create or replace view public.workspace_employee_directory_v as
with last_paid as (
  select
    pre.employee_id,
    max(pr.pay_date) as last_paid_date
  from public.payroll_run_employees pre
  join public.payroll_runs pr on pr.id = pre.run_id
  where pre.included
  group by pre.employee_id
)
select
  e.id as employee_id,
  e.company_id,
  c.name as company_name,
  e.team_id,
  t.name as team_name,
  e.full_name,
  e.preferred_name,
  e.email,
  e.phone,
  e.role_title,
  e.department,
  e.work_location,
  e.status,
  e.start_date,
  e.employment_type,
  ea.line_1 as address_line_1,
  ea.line_2 as address_line_2,
  ea.city,
  ea.province,
  ea.postal_code,
  ea.country,
  ea.formatted_address,
  etp.sin_last4,
  etp.sin_expiry_date,
  etp.date_of_birth,
  etp.tax_province,
  ecp.rate_type,
  ecp.rate_amount,
  ecp.pay_schedule,
  ecp.additional_rates,
  ecp.currency_code,
  ews.hours_per_day,
  ews.hours_per_week,
  ews.working_days,
  ews.overrides,
  eps.eligible_for_payroll,
  eps.default_in_payroll,
  eps.payment_method,
  eps.tax_profile,
  lp.last_paid_date,
  e.created_at,
  e.updated_at
from public.employees e
join public.companies c on c.id = e.company_id
left join public.teams t on t.id = e.team_id
left join public.employee_addresses ea on ea.employee_id = e.id
left join public.employee_tax_profiles etp on etp.employee_id = e.id
left join public.employee_compensation_profiles ecp on ecp.employee_id = e.id
left join public.employee_work_schedules ews on ews.employee_id = e.id
left join public.employee_payroll_settings eps on eps.employee_id = e.id
left join last_paid lp on lp.employee_id = e.id;

create or replace view public.workspace_payroll_runs_v as
with employee_rollup as (
  select
    pre.run_id,
    count(*) filter (where pre.included) as employees_count,
    jsonb_agg(pre.employee_id order by e.full_name) filter (where pre.included) as employee_ids,
    string_agg(e.full_name, ', ' order by e.full_name) filter (where pre.included) as employee_names
  from public.payroll_run_employees pre
  join public.employees e on e.id = pre.employee_id
  group by pre.run_id
)
select
  pr.id as payroll_run_id,
  pr.company_id,
  c.name as company_name,
  pr.team_id,
  t.name as team_name,
  coalesce(pr.pay_period_label, 'Imported payroll run') as pay_period_label,
  pr.period_start,
  pr.period_end,
  pr.pay_date,
  pr.run_status,
  pr.payroll_type,
  pr.currency_code,
  pr.total,
  pr.total_gross,
  pr.total_deductions,
  pr.total_net,
  coalesce(er.employees_count, 0) as employees_count,
  coalesce(er.employee_ids, '[]'::jsonb) as employee_ids,
  coalesce(pr.employee_summary, er.employee_names, '') as employee_summary,
  pr.notes,
  pr.saved_at,
  pr.completed_at,
  pr.created_at,
  pr.updated_at
from public.payroll_runs pr
join public.companies c on c.id = pr.company_id
left join public.teams t on t.id = pr.team_id
left join employee_rollup er on er.run_id = pr.id;

create or replace view public.workspace_documents_archive_v as
select
  d.id as document_id,
  d.company_id,
  c.name as company_name,
  coalesce(d.team_id, e.team_id, pr.team_id) as team_id,
  t.name as team_name,
  d.employee_id,
  e.full_name as employee_name,
  d.payroll_run_id,
  d.document_type_id,
  dt.label as document_type_label,
  dt.category as document_category,
  d.title,
  d.document_date,
  d.storage_bucket,
  d.storage_path,
  d.download_name,
  d.mime_type,
  d.file_size_bytes,
  d.source_kind,
  d.status,
  d.metadata,
  d.created_by,
  d.created_at,
  d.updated_at
from public.documents d
join public.companies c on c.id = d.company_id
join public.document_types dt on dt.id = d.document_type_id
left join public.employees e on e.id = d.employee_id
left join public.payroll_runs pr on pr.id = d.payroll_run_id
left join public.teams t on t.id = coalesce(d.team_id, e.team_id, pr.team_id);
