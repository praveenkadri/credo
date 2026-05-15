import { type DocumentRecord } from "@/lib/documents-workspace";
import { routes } from "@/lib/routes";
import { requireAuthenticatedSupabaseClient, toSafeSupabaseErrorMessage } from "@/lib/supabase/client";

const DOCUMENT_SELECT = [
  "id",
  "company_id",
  "employee_id",
  "payroll_run_id",
  "type",
  "title",
  "status",
  "file_url",
  "storage_bucket",
  "storage_path",
  "file_name",
  "mime_type",
  "file_size_bytes",
  "generation_status",
  "generation_error",
  "source_kind",
  "generated_at",
  "created_at",
  "updated_at",
].join(",");

export type SupabaseDocumentRow = {
  id: string;
  company_id?: string | null;
  employee_id?: string | null;
  payroll_run_id?: string | null;
  type?: string | null;
  title?: string | null;
  status?: string | null;
  file_url?: string | null;
  storage_bucket?: string | null;
  storage_path?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  file_size_bytes?: number | string | null;
  generation_status?: string | null;
  generation_error?: string | null;
  source_kind?: string | null;
  generated_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DocumentContext = {
  companyLabels?: Map<string, string>;
  employeeLabels?: Map<string, string>;
  availableFiles?: Set<string>;
};

export async function listDocuments(): Promise<DocumentRecord[]> {
  return listDocumentsForToken();
}

export async function listDocumentsForToken(accessToken?: string): Promise<DocumentRecord[]> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const [{ data, error }, { data: companiesData, error: companiesError }, { data: employeesData, error: employeesError }] =
    await Promise.all([
      client.from("documents").select(DOCUMENT_SELECT).order("created_at", { ascending: false }),
      client.from("companies").select("id,name"),
      client.from("employees").select("id,full_name"),
    ]);

  if (error) {
    throw new Error(`Failed to load documents: ${toSafeSupabaseErrorMessage(error)}`);
  }

  if (companiesError) {
    throw new Error(`Failed to load document company context: ${toSafeSupabaseErrorMessage(companiesError)}`);
  }

  if (employeesError) {
    throw new Error(`Failed to load document employee context: ${toSafeSupabaseErrorMessage(employeesError)}`);
  }

  const companyLabels = new Map(
    (((companiesData as unknown) as Array<{ id: string; name: string }> | null) ?? []).map((company) => [company.id, company.name])
  );
  const employeeLabels = new Map(
    (((employeesData as unknown) as Array<{ id: string; full_name?: string | null }> | null) ?? []).map((employee) => [
      employee.id,
      employee.full_name ?? employee.id,
    ])
  );
  const availableFiles = await resolveDocumentStorageAvailability(client, ((data as unknown) as SupabaseDocumentRow[] | null) ?? []);

  return (((data as unknown) as SupabaseDocumentRow[] | null) ?? []).map((row) =>
    mapSupabaseDocumentToWorkspaceDocument(row, { companyLabels, employeeLabels, availableFiles })
  );
}

export async function getDocument(documentId: string): Promise<DocumentRecord | null> {
  return getDocumentForToken(documentId);
}

export async function getDocumentForToken(documentId: string, accessToken?: string): Promise<DocumentRecord | null> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await client
    .from("documents")
    .select(DOCUMENT_SELECT)
    .eq("id", documentId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load document ${documentId}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return data ? mapSupabaseDocumentToWorkspaceDocument((data as unknown) as SupabaseDocumentRow) : null;
}

export function mapSupabaseDocumentToWorkspaceDocument(
  row: SupabaseDocumentRow,
  context: DocumentContext = {}
): DocumentRecord {
  const typeId = normalizeDocumentType(row.type);
  const companyId = row.company_id ?? "";
  const employeeId = row.employee_id ?? undefined;
  const date = dateOnly(row.generated_at ?? row.created_at ?? row.updated_at) || "";
  const storageBucket = row.storage_bucket?.trim() ?? "";
  const storagePath = row.storage_path?.trim() ?? "";
  const hasStorageMetadata = Boolean(storageBucket && storagePath);
  const hasPrivateFile = hasStorageMetadata && (context.availableFiles ? context.availableFiles.has(storageObjectKey(storageBucket, storagePath)) : true);
  const isGeneratedPayStub = typeId === "pay-stub";
  const openHref = hasPrivateFile
    ? routes.documentDownload(row.id)
    : isGeneratedPayStub
      ? undefined
      : row.source_kind === "generated"
        ? undefined
        : row.file_url?.trim() || undefined;
  const downloadHref = hasPrivateFile ? routes.documentDownloadFile(row.id) : undefined;
  const generationStatus = row.generation_status?.trim() || (hasPrivateFile ? "generated" : "pending");

  return {
    id: row.id,
    title: row.title ?? "Untitled document",
    typeId,
    typeLabel: typeLabel(typeId),
    companyId,
    companyLabel: context.companyLabels?.get(companyId) ?? companyId,
    teamId: "operations",
    teamLabel: "Team",
    employeeId,
    employeeLabel: employeeId ? context.employeeLabels?.get(employeeId) ?? employeeId : undefined,
    date,
    status: generationStatus,
    openHref,
    downloadHref,
    downloadName: row.file_name?.trim() || (openHref ? `${slugify(row.title ?? row.id)}.pdf` : undefined),
    fileAvailable: hasPrivateFile,
    fileMetadataMissing: !hasStorageMetadata,
    fileName: row.file_name?.trim() || undefined,
    fileSizeBytes: toOptionalNumber(row.file_size_bytes),
    generatedAt: row.generated_at ?? undefined,
    generationError: row.generation_error?.trim() || undefined,
    generationStatus,
  };
}

export async function resolveDocumentStorageAvailability(
  client: ReturnType<typeof requireAuthenticatedSupabaseClient>,
  rows: SupabaseDocumentRow[]
) {
  const candidates = rows.filter((row) => row.storage_bucket?.trim() && row.storage_path?.trim());
  if (candidates.length === 0) return new Set<string>();

  const bucketIds = Array.from(new Set(candidates.map((row) => row.storage_bucket!.trim())));
  const paths = Array.from(new Set(candidates.map((row) => row.storage_path!.trim())));
  const { data, error } = await client
    .schema("storage")
    .from("objects")
    .select("bucket_id,name")
    .in("bucket_id", bucketIds)
    .in("name", paths);

  if (error) {
    throw new Error(`Failed to verify document files: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return new Set(
    (((data as unknown) as Array<{ bucket_id?: string | null; name?: string | null }> | null) ?? [])
      .filter((row) => row.bucket_id && row.name)
      .map((row) => storageObjectKey(row.bucket_id!, row.name!))
  );
}

function storageObjectKey(bucket: string, path: string) {
  return `${bucket}:${path}`;
}

function normalizeDocumentType(value?: string | null): DocumentRecord["typeId"] {
  if (value === "pay_stub" || value === "pay-stub") return "pay-stub";
  if (value === "payroll_run" || value === "payroll-run") return "payroll-run";
  if (value === "employment_letter") return "letter";
  if (value === "tax_document" || value === "tax-form") return "tax-form";
  if (value === "company_document") return "company-document";
  if (value === "employee_document") return "employee-document";
  return "employee-document";
}

function typeLabel(typeId: DocumentRecord["typeId"]) {
  if (typeId === "pay-stub") return "Pay stub";
  if (typeId === "payroll-run") return "Payroll run";
  if (typeId === "tax-form") return "Tax form";
  if (typeId === "company-document") return "Company document";
  if (typeId === "employee-document") return "Employee document";
  return "Letter";
}

function dateOnly(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}

function toOptionalNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
