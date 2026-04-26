-- Soft delete support for companies + deletion audit trail.

begin;

alter table public.companies add column if not exists deleted_at timestamptz;
alter table public.companies add column if not exists deleted_by uuid;
alter table public.companies add column if not exists delete_reason text;
alter table public.companies add column if not exists delete_reason_note text;

create index if not exists idx_companies_deleted_at on public.companies(deleted_at);

create table if not exists public.company_deletion_audit (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  deleted_by uuid not null,
  deleted_at timestamptz not null default now(),
  reason text not null,
  reason_note text,
  company_snapshot jsonb not null,
  related_counts jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_company_deletion_audit_company_id
  on public.company_deletion_audit(company_id, deleted_at desc);

create or replace function public.can_delete_company_row(c public.companies)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or (
      auth.uid() is not null
      and coalesce(c.owner_id, c.user_id, c.created_by) = auth.uid()
    );
$$;

drop policy if exists companies_delete on public.companies;
create policy companies_delete
on public.companies
for delete
to authenticated
using (public.can_delete_company_row(companies));

create or replace function public.enforce_company_soft_delete_owner()
returns trigger
language plpgsql
as $$
begin
  if old.deleted_at is null and new.deleted_at is not null then
    if auth.role() <> 'service_role' then
      if auth.uid() is null or coalesce(old.owner_id, old.user_id, old.created_by) is distinct from auth.uid() then
        raise exception 'Only the company owner can delete this company';
      end if;
    end if;

    if coalesce(trim(new.delete_reason), '') = '' then
      raise exception 'Delete reason is required when deleting a company';
    end if;

    if new.deleted_by is null then
      new.deleted_by = auth.uid();
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_companies_enforce_soft_delete_owner on public.companies;
create trigger trg_companies_enforce_soft_delete_owner
before update on public.companies
for each row execute function public.enforce_company_soft_delete_owner();

alter table public.company_deletion_audit enable row level security;

drop policy if exists company_deletion_audit_select on public.company_deletion_audit;
create policy company_deletion_audit_select
on public.company_deletion_audit
for select
to authenticated
using (
  public.can_access_company_id(company_id)
);

drop policy if exists company_deletion_audit_insert on public.company_deletion_audit;
create policy company_deletion_audit_insert
on public.company_deletion_audit
for insert
to authenticated
with check (
  deleted_by = auth.uid()
  and exists (
    select 1
    from public.companies c
    where c.id = company_deletion_audit.company_id
      and public.can_delete_company_row(c)
  )
);

commit;
