# Implementation Guardrails

Use this before coding.

## Do not change unless explicitly requested

- Supabase auth behavior
- RLS policies
- database schema
- payroll calculations
- document generation
- private PDF storage
- signed URL behavior
- security checks
- route protection

## Safe UI tasks

These are generally safe:
- progressive sidebar visibility
- right rail next-action rendering
- Overview simplification
- color token cleanup
- button style alignment
- empty-state simplification
- component reuse
- marketing/auth visual polish

## Build requirements

After changes:

```bash
npm run build
```

If available and relevant:

```bash
npm run security:audit
```

## Output expectations for Codex

Return:
- files changed
- why each file changed
- build result
- known risks/TODOs

Do not return full files unless explicitly asked.
