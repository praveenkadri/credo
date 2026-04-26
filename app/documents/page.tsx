import { DocumentsPage } from "@/components/documents/documents-page";

function normalizeTab(value: string | undefined) {
  if (value === "letters" || value === "tax-forms" || value === "company-documents") {
    return value;
  }

  return "pay-stubs";
}

function normalizeSource(value: string | undefined) {
  if (value === "generated" || value === "uploaded") {
    return value;
  }

  return "all";
}

function normalizeMonth(value: string | undefined) {
  if (value === "2026-04" || value === "2026-03" || value === "2025-12") {
    return value;
  }

  return "all";
}

export default async function DocumentsRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; source?: string; month?: string }>;
}) {
  const params = await searchParams;

  return (
    <DocumentsPage
      filters={{
        tab: normalizeTab(params.tab),
        source: normalizeSource(params.source),
        month: normalizeMonth(params.month),
      }}
    />
  );
}
