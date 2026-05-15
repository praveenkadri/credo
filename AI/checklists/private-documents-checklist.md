# Private Documents and PDF Checklist

Use this only when touching documents, pay stubs, PDF generation, or Supabase Storage.

## Storage security

- `credo-documents` bucket must be private.
- Storage policies must target authenticated users only.
- Generated pay stubs use `storage_bucket` and `storage_path`, not public `file_url`.
- Signed URLs are the only browser-facing access path for private PDFs.
- Signed URLs should be short-lived.
- Raw storage paths must not be rendered as user-facing links.

## PDF security

- PDF generation is server-side only.
- PDF modules should import `server-only`.
- Client components must not import PDF generation modules.
- Pay stub PDFs must exclude full SIN.
- Pay stub PDFs must exclude bank account details.
- Pay stub PDFs must exclude private tax identifiers.

## Document lifecycle

Supported states:
- pending
- generating
- generated
- failed

Failed generation should be retryable.

Missing PDF metadata should show a generate action, not a fake download link.

## Access control

- Document detail loads through authenticated Supabase access.
- Signed URL creation loads the document through authenticated Supabase access.
- Generation loads document/company/employee/payroll rows through authenticated Supabase access.
- Unauthenticated access fails safely.
