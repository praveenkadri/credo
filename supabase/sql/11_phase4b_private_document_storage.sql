-- Phase 4B: private generated-document storage foundation.
--
-- Generated pay stubs must be stored in the private credo-documents bucket.
-- Path convention:
--   companies/{companyId}/payroll-runs/{payrollRunId}/pay-stubs/{documentId}.pdf

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'credo-documents',
  'credo-documents',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.documents
  add column if not exists storage_bucket text default 'credo-documents',
  add column if not exists storage_path text,
  add column if not exists file_name text,
  add column if not exists mime_type text,
  add column if not exists file_size_bytes bigint,
  add column if not exists generated_at timestamptz,
  add column if not exists generation_status text default 'pending',
  add column if not exists generation_error text;

alter table public.documents
  alter column storage_bucket set default 'credo-documents',
  alter column generation_status set default 'pending';

update public.documents
set storage_bucket = 'credo-documents'
where storage_bucket is null;

update public.documents
set generation_status = 'pending'
where generation_status is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.documents'::regclass
      and conname = 'documents_generation_status_check'
  ) then
    alter table public.documents
      add constraint documents_generation_status_check
      check (generation_status in ('pending', 'generating', 'generated', 'failed'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.documents'::regclass
      and conname = 'documents_generated_pdf_mime_type_check'
  ) then
    alter table public.documents
      add constraint documents_generated_pdf_mime_type_check
      check (
        mime_type is null
        or storage_bucket is distinct from 'credo-documents'
        or mime_type = 'application/pdf'
      );
  end if;
end $$;

create index if not exists idx_documents_storage_bucket_path
  on public.documents(storage_bucket, storage_path);

create index if not exists idx_documents_generation_status
  on public.documents(generation_status);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'documents'
      and column_name = 'type'
  ) then
    create index if not exists idx_documents_company_type
      on public.documents(company_id, type);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'documents'
      and column_name = 'document_type_id'
  ) then
    create index if not exists idx_documents_company_document_type_id
      on public.documents(company_id, document_type_id);
  end if;
end $$;

create or replace function public.company_id_from_document_storage_path(object_name text)
returns text
language sql
stable
as $$
  select case
    when (storage.foldername(object_name))[1] = 'companies'
      then nullif((storage.foldername(object_name))[2], '')
    else null
  end;
$$;

create or replace function public.can_access_document_storage_object(p_bucket_id text, p_object_name text)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.documents d
      where d.storage_bucket = p_bucket_id
        and d.storage_path = p_object_name
        and d.company_id = public.company_id_from_document_storage_path(p_object_name)
        and public.can_access_company_id(d.company_id)
    );
$$;

drop policy if exists credo_documents_storage_read on storage.objects;
create policy credo_documents_storage_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'credo-documents'
  and public.can_access_document_storage_object(bucket_id, name)
);

drop policy if exists credo_documents_storage_insert on storage.objects;
create policy credo_documents_storage_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'credo-documents'
  and public.can_access_document_storage_object(bucket_id, name)
);

drop policy if exists credo_documents_storage_update on storage.objects;
create policy credo_documents_storage_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'credo-documents'
  and public.can_access_document_storage_object(bucket_id, name)
)
with check (
  bucket_id = 'credo-documents'
  and public.can_access_document_storage_object(bucket_id, name)
);

drop policy if exists credo_documents_storage_delete on storage.objects;

revoke all on table storage.objects from anon;
revoke all on table public.documents from anon;

commit;

-- Verification queries:
--
-- Confirm bucket is private:
-- select id, name, public, file_size_limit, allowed_mime_types
-- from storage.buckets
-- where id = 'credo-documents';
--
-- List storage policies mentioning anon:
-- select schemaname, tablename, policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'storage'
--   and tablename = 'objects'
--   and roles::text ilike '%anon%';
--
-- List documents missing storage metadata for generated pay stubs:
-- select id, company_id, payroll_run_id, storage_bucket, storage_path, file_name, mime_type, generation_status
-- from public.documents
-- where coalesce(type, document_type_id) in ('pay_stub', 'pay-stub')
--   and coalesce(source_kind, 'generated') = 'generated'
--   and (
--     storage_bucket is null
--     or storage_bucket <> 'credo-documents'
--     or storage_path is null
--     or file_name is null
--     or generation_status is null
--   );
--
-- Check RLS state:
-- select n.nspname as schemaname, c.relname as tablename, c.relrowsecurity, c.relforcerowsecurity
-- from pg_class c
-- join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname in ('public', 'storage')
--   and c.relname in ('documents', 'objects');
