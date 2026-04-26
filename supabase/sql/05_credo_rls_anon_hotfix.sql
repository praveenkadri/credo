-- Hotfix if Create Company still fails after initial setup.
-- Allows anon-role app traffic (no Supabase auth session) to pass current policies.

begin;

create or replace function public.can_access_company_row(c public.companies)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or auth.role() = 'anon'
    or (
      auth.uid() is not null
      and (
        c.user_id = auth.uid()
        or c.owner_id = auth.uid()
        or c.created_by = auth.uid()
      )
    )
    or (
      public.jwt_workspace_id() is not null
      and (
        c.workspace_id = public.jwt_workspace_id()
        or c.organization_id = public.jwt_workspace_id()
      )
    );
$$;

create or replace function public.can_insert_company_row(c public.companies)
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'service_role'
    or auth.role() = 'anon'
    or (
      auth.uid() is not null
      and (
        coalesce(c.user_id, auth.uid()) = auth.uid()
        or coalesce(c.owner_id, auth.uid()) = auth.uid()
        or coalesce(c.created_by, auth.uid()) = auth.uid()
        or (
          public.jwt_workspace_id() is not null
          and (
            coalesce(c.workspace_id, public.jwt_workspace_id()) = public.jwt_workspace_id()
            or coalesce(c.organization_id, public.jwt_workspace_id()) = public.jwt_workspace_id()
          )
        )
      )
    );
$$;

drop policy if exists companies_insert on public.companies;
create policy companies_insert
on public.companies
for insert
to anon, authenticated
with check (public.can_insert_company_row(companies));

commit;
