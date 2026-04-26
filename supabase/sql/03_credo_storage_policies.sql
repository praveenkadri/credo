-- Optional but recommended for logo/signature uploads used by company setup/profile.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'company-assets',
  'company-assets',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists company_assets_read on storage.objects;
create policy company_assets_read
on storage.objects
for select
using (bucket_id = 'company-assets');

drop policy if exists company_assets_insert on storage.objects;
create policy company_assets_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'company-assets'
  and public.can_access_company_id((storage.foldername(name))[1])
);

drop policy if exists company_assets_update on storage.objects;
create policy company_assets_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'company-assets'
  and public.can_access_company_id((storage.foldername(name))[1])
)
with check (
  bucket_id = 'company-assets'
  and public.can_access_company_id((storage.foldername(name))[1])
);

drop policy if exists company_assets_delete on storage.objects;
create policy company_assets_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'company-assets'
  and public.can_access_company_id((storage.foldername(name))[1])
);

commit;
