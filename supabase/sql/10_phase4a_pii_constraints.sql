-- Phase 4A PII constraints and full-SIN storage removal.
--
-- This migration is intentionally additive for constraints and uses NOT VALID
-- so existing rows are not blocked during deploy. New and changed rows are
-- still checked by PostgreSQL.

begin;

-- Remove view dependency on deprecated SIN expiry storage before dropping
-- columns. Avoid CASCADE so unrelated dependent objects are never removed.
drop view if exists public.workspace_employee_directory_v;

create view public.workspace_employee_directory_v as
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

alter table if exists public.employee_tax_profiles
  drop column if exists sin_encrypted,
  drop column if exists sin_expiry_date;

do $$
declare
  item record;
begin
  for item in
    select *
    from (
      values
        ('public.employees', 'employees_sin_last_four_format', '(sin_last_four is null or sin_last_four ~ ''^[0-9]{4}$'')'),
        ('public.employees', 'employees_sin_status_known', '(sin_status is null or sin_status in (''not_provided'', ''provided'', ''verified'', ''invalid'', ''expired''))'),
        ('public.employees', 'employees_rate_amount_nonnegative', '(rate_amount is null or rate_amount >= 0)'),
        ('public.employees', 'employees_hours_per_day_nonnegative', '(hours_per_day is null or hours_per_day >= 0)'),
        ('public.employees', 'employees_hours_per_week_nonnegative', '(hours_per_week is null or hours_per_week >= 0)'),
        ('public.employee_tax_profiles', 'employee_tax_profiles_sin_last4_format', '(sin_last4 is null or sin_last4 ~ ''^[0-9]{4}$'')'),
        ('public.employee_compensation_profiles', 'employee_compensation_profiles_rate_amount_nonnegative', '(rate_amount >= 0)'),
        ('public.employee_work_schedules', 'employee_work_schedules_hours_per_day_nonnegative', '(hours_per_day >= 0)'),
        ('public.employee_work_schedules', 'employee_work_schedules_hours_per_week_nonnegative', '(hours_per_week >= 0)'),
        ('public.payroll_runs', 'payroll_runs_total_nonnegative', '(total is null or total >= 0)'),
        ('public.payroll_runs', 'payroll_runs_gross_pay_nonnegative', '(gross_pay is null or gross_pay >= 0)'),
        ('public.payroll_runs', 'payroll_runs_deductions_nonnegative', '(deductions is null or deductions >= 0)'),
        ('public.payroll_runs', 'payroll_runs_net_pay_nonnegative', '(net_pay is null or net_pay >= 0)'),
        ('public.payroll_runs', 'payroll_runs_total_gross_nonnegative', '(total_gross is null or total_gross >= 0)'),
        ('public.payroll_runs', 'payroll_runs_total_deductions_nonnegative', '(total_deductions is null or total_deductions >= 0)'),
        ('public.payroll_runs', 'payroll_runs_total_net_nonnegative', '(total_net is null or total_net >= 0)'),
        ('public.payroll_run_employees', 'payroll_run_employees_rate_amount_nonnegative', '(rate_amount is null or rate_amount >= 0)'),
        ('public.payroll_run_employees', 'payroll_run_employees_total_hours_nonnegative', '(total_hours is null or total_hours >= 0)'),
        ('public.payroll_run_employees', 'payroll_run_employees_hours_worked_nonnegative', '(hours_worked is null or hours_worked >= 0)'),
        ('public.payroll_run_employees', 'payroll_run_employees_gross_pay_nonnegative', '(gross_pay is null or gross_pay >= 0)'),
        ('public.payroll_run_employees', 'payroll_run_employees_deductions_nonnegative', '(deductions is null or deductions >= 0)'),
        ('public.payroll_run_employees', 'payroll_run_employees_net_pay_nonnegative', '(net_pay is null or net_pay >= 0)')
    ) as c(table_name, constraint_name, check_sql)
  loop
    if to_regclass(item.table_name) is not null
      and not exists (
        select 1
        from pg_constraint
        where conrelid = to_regclass(item.table_name)
          and conname = item.constraint_name
      )
    then
      execute format(
        'alter table %s add constraint %I check %s not valid',
        item.table_name,
        item.constraint_name,
        item.check_sql
      );
    end if;
  end loop;
end $$;

commit;

-- Verification queries:
--
-- Confirm no full-SIN-shaped column remains:
-- select table_schema, table_name, column_name
-- from information_schema.columns
-- where table_schema = 'public'
--   and column_name ilike any (array['%sin_encrypted%', '%full_sin%', '%sin_number%', '%social_insurance%', '%sin_expiry_date%'])
-- order by table_name, column_name;
--
-- Review PII hardening constraints:
-- select conrelid::regclass as table_name, conname, convalidated
-- from pg_constraint
-- where conname in (
--   'employees_sin_last_four_format',
--   'employees_sin_status_known',
--   'employees_rate_amount_nonnegative',
--   'employees_hours_per_day_nonnegative',
--   'employees_hours_per_week_nonnegative',
--   'employee_tax_profiles_sin_last4_format',
--   'employee_compensation_profiles_rate_amount_nonnegative',
--   'employee_work_schedules_hours_per_day_nonnegative',
--   'employee_work_schedules_hours_per_week_nonnegative',
--   'payroll_runs_total_nonnegative',
--   'payroll_runs_gross_pay_nonnegative',
--   'payroll_runs_deductions_nonnegative',
--   'payroll_runs_net_pay_nonnegative',
--   'payroll_runs_total_gross_nonnegative',
--   'payroll_runs_total_deductions_nonnegative',
--   'payroll_runs_total_net_nonnegative',
--   'payroll_run_employees_rate_amount_nonnegative',
--   'payroll_run_employees_total_hours_nonnegative',
--   'payroll_run_employees_hours_worked_nonnegative',
--   'payroll_run_employees_gross_pay_nonnegative',
--   'payroll_run_employees_deductions_nonnegative',
--   'payroll_run_employees_net_pay_nonnegative'
-- )
-- order by table_name::text, conname;
