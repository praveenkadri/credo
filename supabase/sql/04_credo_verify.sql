-- Run after schema and RLS scripts.

-- 1) Columns used by current UI/server actions
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'companies'
  and column_name in (
    'id','name','legal_name','address','address_line_1','address_line2','city','province','postal_code','country',
    'formatted_address','latitude','longitude','address_verified','address_source','address_has_subpremise',
    'logo_url','director_name','director_title','signature_url','payroll_account_number',
    'user_id','owner_id','created_by','workspace_id','organization_id','plan_override','setup_completed_at',
    'deleted_at','deleted_by','delete_reason','delete_reason_note','created_at','updated_at'
  )
order by column_name;

-- 2) Tables used by current pages
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('companies', 'employees', 'payroll_runs', 'audit_logs', 'company_deletion_audit')
order by table_name;

-- 3) RLS enabled?
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('companies', 'employees', 'payroll_runs', 'audit_logs', 'company_deletion_audit')
order by tablename;

-- 4) Policies present?
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname in ('public', 'storage')
  and tablename in ('companies', 'employees', 'payroll_runs', 'audit_logs', 'company_deletion_audit', 'objects')
order by schemaname, tablename, policyname;
