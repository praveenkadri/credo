# Auth, Security, and RLS Checklist

Use this only when touching auth, Supabase, RLS, protected data, or server actions.

## Core rule

Credo must never expose company, employee, payroll, document, or audit data through anonymous Supabase access.

## Protected workspace routes

The auth guard must protect:
- `/app`
- `/dashboard`
- `/companies`
- `/companies/*`
- `/employees`
- `/employees/*`
- `/team`
- `/payroll`
- `/payroll/*`
- `/documents`
- `/documents/*`
- `/insights`
- `/compliance`

Signed-out users should redirect to `/login?next=<safe internal path>`.

## Server action requirements

- Mutations must require auth server-side.
- Mutations must use the authenticated Supabase session from cookies.
- Do not use hidden browser-provided tokens as server authority.
- Company create must derive owner/user fields from the authenticated Supabase user.
- Writes must rely on RLS-backed company access checks.

## Client security requirements

- Do not expose service-role keys in browser/client code.
- Public anon key is allowed only for normal client auth behavior.
- Do not persist full SIN.
- Do not store sensitive payroll/document data in localStorage.

## Search checks

```bash
grep -RIn "to anon\|auth.role() = 'anon'\|role() = 'anon'" supabase app lib || true
grep -RIn "SERVICE_ROLE\|service_role\|SUPABASE_SERVICE" app components hooks lib public || true
grep -RIn "localStorage" app components hooks lib || true
grep -RIn "sin\|SIN\|social insurance" app components hooks lib supabase || true
grep -RIn "file_url\|publicUrl\|getPublicUrl\|download" app components hooks lib supabase || true
```

Expected:
- no active anon policies for sensitive app data
- no service-role key in browser code
- no full SIN persistence
- no fake/public generated document links
