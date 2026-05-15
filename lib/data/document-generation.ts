import "server-only";

import { stringifyAuditDetails } from "@/lib/audit/sanitize";
import {
  buildPayStubFileName,
  buildPayStubStoragePath,
  generatePayStubPdf,
  type PayStubPdfInput,
} from "@/lib/pdf/pay-stub-pdf";
import {
  requireAuthenticatedSupabaseClient,
  toSafeSupabaseErrorMessage,
} from "@/lib/supabase/client";

const PAY_STUB_BUCKET = "credo-documents";
const PAY_STUB_MIME_TYPE = "application/pdf";

const DOCUMENT_SELECT = [
  "id",
  "company_id",
  "employee_id",
  "payroll_run_id",
  "type",
  "document_type_id",
  "title",
  "generation_status",
  "storage_bucket",
  "storage_path",
].join(",");

const COMPANY_SELECT = ["id", "name"].join(",");
const EMPLOYEE_SELECT = ["id", "company_id", "full_name", "preferred_name"].join(",");
const PAYROLL_RUN_SELECT = [
  "id",
  "company_id",
  "pay_period_start",
  "pay_period_end",
  "pay_date",
].join(",");
const PAYROLL_LINE_SELECT = [
  "payroll_run_id",
  "company_id",
  "employee_id",
  "employee_name",
  "rate_type",
  "rate_amount",
  "total_hours",
  "gross_pay",
  "deductions",
  "net_pay",
].join(",");

type SupabaseClient = ReturnType<typeof requireAuthenticatedSupabaseClient>;

type DocumentRow = {
  id: string;
  company_id: string | null;
  employee_id: string | null;
  payroll_run_id: string | null;
  type?: string | null;
  document_type_id?: string | null;
  title?: string | null;
  generation_status?: string | null;
  storage_bucket?: string | null;
  storage_path?: string | null;
};

type CompanyRow = {
  id: string;
  name?: string | null;
};

type EmployeeRow = {
  id: string;
  company_id?: string | null;
  full_name?: string | null;
  preferred_name?: string | null;
};

type PayrollRunRow = {
  id: string;
  company_id?: string | null;
  pay_period_start?: string | null;
  pay_period_end?: string | null;
  pay_date?: string | null;
};

type PayrollLineRow = {
  payroll_run_id?: string | null;
  company_id?: string | null;
  employee_id?: string | null;
  employee_name?: string | null;
  rate_type?: string | null;
  rate_amount?: number | string | null;
  total_hours?: number | string | null;
  gross_pay?: number | string | null;
  deductions?: number | string | null;
  net_pay?: number | string | null;
};

export type PayStubGenerationData = {
  document: DocumentRow;
  company: CompanyRow;
  employee: EmployeeRow;
  payrollRun: PayrollRunRow;
  payrollLine: PayrollLineRow;
  pdfInput: PayStubPdfInput;
  fileName: string;
  storagePath: string;
};

export type PayStubGenerationResult = {
  documentId: string;
  companyId: string;
  payrollRunId: string;
  storageBucket: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
};

export type MarkDocumentGeneratedMetadata = {
  storageBucket: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  generatedAt?: string;
  sessionAccessToken?: string;
};

export async function getPayStubGenerationData(
  documentId: string,
  sessionAccessToken?: string
): Promise<PayStubGenerationData> {
  const client = requireAuthenticatedSupabaseClient(sessionAccessToken);
  await requireAuthenticatedUser(client);

  const document = await loadDocument(client, documentId);
  assertPayStubDocument(document);

  const companyId = requiredValue(document.company_id, "Pay stub document is missing a company.");
  const employeeId = requiredValue(document.employee_id, "Pay stub document is missing an employee.");
  const payrollRunId = requiredValue(document.payroll_run_id, "Pay stub document is missing a payroll run.");

  const [{ data: companyData, error: companyError }, { data: employeeData, error: employeeError }, { data: runData, error: runError }] =
    await Promise.all([
      client.from("companies").select(COMPANY_SELECT).eq("id", companyId).maybeSingle(),
      client.from("employees").select(EMPLOYEE_SELECT).eq("id", employeeId).maybeSingle(),
      client.from("payroll_runs").select(PAYROLL_RUN_SELECT).eq("id", payrollRunId).maybeSingle(),
    ]);

  if (companyError) throw new Error(`Failed to load pay stub company: ${toSafeSupabaseErrorMessage(companyError)}`);
  if (employeeError) throw new Error(`Failed to load pay stub employee: ${toSafeSupabaseErrorMessage(employeeError)}`);
  if (runError) throw new Error(`Failed to load pay stub payroll run: ${toSafeSupabaseErrorMessage(runError)}`);

  const company = requireRow<CompanyRow>(companyData, "Pay stub company could not be loaded.");
  const employee = requireRow<EmployeeRow>(employeeData, "Pay stub employee could not be loaded.");
  const payrollRun = requireRow<PayrollRunRow>(runData, "Pay stub payroll run could not be loaded.");

  if (employee.company_id !== companyId || payrollRun.company_id !== companyId) {
    throw new Error("Pay stub records do not belong to the same company.");
  }

  const { data: lineData, error: lineError } = await client
    .from("payroll_run_employees")
    .select(PAYROLL_LINE_SELECT)
    .eq("payroll_run_id", payrollRunId)
    .eq("employee_id", employeeId)
    .maybeSingle();

  if (lineError) {
    throw new Error(`Failed to load pay stub payroll line: ${toSafeSupabaseErrorMessage(lineError)}`);
  }

  const payrollLine = requireRow<PayrollLineRow>(lineData, "Pay stub payroll line could not be loaded.");
  if (payrollLine.company_id && payrollLine.company_id !== companyId) {
    throw new Error("Pay stub payroll line does not belong to the document company.");
  }

  const employeeDisplayName = employee.preferred_name?.trim() || employee.full_name?.trim() || payrollLine.employee_name?.trim() || employeeId;
  const pdfInput: PayStubPdfInput = {
    documentId: document.id,
    companyId,
    companyName: company.name?.trim() || companyId,
    employeeId,
    employeeDisplayName,
    payrollRunId,
    payPeriodStart: requiredValue(payrollRun.pay_period_start, "Pay stub payroll run is missing a pay period start."),
    payPeriodEnd: requiredValue(payrollRun.pay_period_end, "Pay stub payroll run is missing a pay period end."),
    payDate: requiredValue(payrollRun.pay_date, "Pay stub payroll run is missing a pay date."),
    rateType: payrollLine.rate_type?.trim() || "regular",
    rateAmount: requiredMoney(payrollLine.rate_amount, "Pay stub payroll line is missing a rate amount."),
    totalHours: requiredMoney(payrollLine.total_hours, "Pay stub payroll line is missing total hours."),
    grossPay: requiredMoney(payrollLine.gross_pay, "Pay stub payroll line is missing gross pay."),
    deductions: requiredMoney(payrollLine.deductions, "Pay stub payroll line is missing deductions."),
    netPay: requiredMoney(payrollLine.net_pay, "Pay stub payroll line is missing net pay."),
    generatedDate: new Date(),
  };

  return {
    document,
    company,
    employee,
    payrollRun,
    payrollLine,
    pdfInput,
    fileName: buildPayStubFileName(pdfInput),
    storagePath: buildPayStubStoragePath(pdfInput),
  };
}

export async function generateAndStorePayStubPdf(
  documentId: string,
  sessionAccessToken?: string,
  options: { allowRegeneration?: boolean } = {}
): Promise<PayStubGenerationResult> {
  const client = requireAuthenticatedSupabaseClient(sessionAccessToken);
  await requireAuthenticatedUser(client);

  let generationData: PayStubGenerationData | null = null;
  let markedGenerating = false;

  try {
    generationData = await getPayStubGenerationData(documentId, sessionAccessToken);

    if (generationData.document.generation_status === "generated" && !options.allowRegeneration) {
      throw new Error("Pay stub PDF has already been generated.");
    }

    await markDocumentGenerating(documentId, {
      sessionAccessToken,
      storageBucket: PAY_STUB_BUCKET,
      storagePath: generationData.storagePath,
      fileName: generationData.fileName,
    });
    markedGenerating = true;

    const pdfBytes = await generatePayStubPdf(generationData.pdfInput);
    const fileSizeBytes = pdfBytes.byteLength;

    const { error: uploadError } = await client.storage
      .from(PAY_STUB_BUCKET)
      .upload(generationData.storagePath, pdfBytes, {
        contentType: PAY_STUB_MIME_TYPE,
        upsert: Boolean(options.allowRegeneration),
      });

    if (uploadError) {
      throw new Error(`Failed to upload pay stub PDF: ${toSafeSupabaseErrorMessage(uploadError)}`);
    }

    const generatedAt = new Date().toISOString();
    await markDocumentGenerated(documentId, {
      sessionAccessToken,
      storageBucket: PAY_STUB_BUCKET,
      storagePath: generationData.storagePath,
      fileName: generationData.fileName,
      mimeType: PAY_STUB_MIME_TYPE,
      fileSizeBytes,
      generatedAt,
    });

    await writeDocumentGeneratedAuditLog(client, generationData, generatedAt);

    return {
      documentId,
      companyId: generationData.pdfInput.companyId,
      payrollRunId: generationData.pdfInput.payrollRunId,
      storageBucket: PAY_STUB_BUCKET,
      storagePath: generationData.storagePath,
      fileName: generationData.fileName,
      mimeType: PAY_STUB_MIME_TYPE,
      fileSizeBytes,
    };
  } catch (error) {
    if (markedGenerating) {
      await markDocumentGenerationFailed(documentId, error, sessionAccessToken).catch(() => undefined);
    }
    throw new Error(`Failed to generate pay stub PDF: ${safeGenerationError(error)}`);
  }
}

export async function markDocumentGenerating(
  documentId: string,
  metadataOrSessionAccessToken?: string | {
    sessionAccessToken?: string;
    storageBucket?: string;
    storagePath?: string;
    fileName?: string;
  }
): Promise<void> {
  const metadata = typeof metadataOrSessionAccessToken === "string"
    ? { sessionAccessToken: metadataOrSessionAccessToken }
    : metadataOrSessionAccessToken ?? {};
  const client = requireAuthenticatedSupabaseClient(metadata.sessionAccessToken);
  const payload: Record<string, unknown> = {
    generation_status: "generating",
    generation_error: null,
  };

  if (metadata.storageBucket) payload.storage_bucket = metadata.storageBucket;
  if (metadata.storagePath) payload.storage_path = metadata.storagePath;
  if (metadata.fileName) payload.file_name = metadata.fileName;
  if (metadata.storagePath || metadata.fileName) payload.mime_type = PAY_STUB_MIME_TYPE;

  const { error } = await client.from("documents").update(payload).eq("id", documentId);
  if (error) throw new Error(`Failed to mark document generating: ${toSafeSupabaseErrorMessage(error)}`);
}

export async function markDocumentGenerated(
  documentId: string,
  metadata: MarkDocumentGeneratedMetadata
): Promise<void> {
  const client = requireAuthenticatedSupabaseClient(metadata.sessionAccessToken);
  const { error } = await client
    .from("documents")
    .update({
      storage_bucket: metadata.storageBucket,
      storage_path: metadata.storagePath,
      file_name: metadata.fileName,
      mime_type: metadata.mimeType,
      file_size_bytes: metadata.fileSizeBytes,
      generation_status: "generated",
      generated_at: metadata.generatedAt ?? new Date().toISOString(),
      generation_error: null,
    })
    .eq("id", documentId);

  if (error) throw new Error(`Failed to mark document generated: ${toSafeSupabaseErrorMessage(error)}`);
}

export async function markDocumentGenerationFailed(
  documentId: string,
  error: unknown,
  sessionAccessToken?: string
): Promise<void> {
  const client = requireAuthenticatedSupabaseClient(sessionAccessToken);
  const { error: updateError } = await client
    .from("documents")
    .update({
      generation_status: "failed",
      generation_error: safeGenerationError(error),
    })
    .eq("id", documentId);

  if (updateError) {
    throw new Error(`Failed to mark document generation failed: ${toSafeSupabaseErrorMessage(updateError)}`);
  }
}

async function loadDocument(client: SupabaseClient, documentId: string) {
  const id = documentId.trim();
  if (!id) throw new Error("Document id is required.");

  const { data, error } = await client.from("documents").select(DOCUMENT_SELECT).eq("id", id).maybeSingle();
  if (error) throw new Error(`Failed to load pay stub document: ${toSafeSupabaseErrorMessage(error)}`);

  return requireRow<DocumentRow>(data, "Pay stub document could not be loaded.");
}

async function writeDocumentGeneratedAuditLog(client: SupabaseClient, data: PayStubGenerationData, generatedAt: string) {
  const { error } = await client.from("audit_logs").insert({
    company_id: data.pdfInput.companyId,
    action: "document_generated",
    entity_type: "document",
    entity_name: "Pay stub PDF",
    details: stringifyAuditDetails({
      documentId: data.pdfInput.documentId,
      payrollRunId: data.pdfInput.payrollRunId,
      employeeDisplayName: data.pdfInput.employeeDisplayName,
      storageBucket: PAY_STUB_BUCKET,
      storagePath: data.storagePath,
    }),
    at: generatedAt,
  });

  if (error) throw new Error(`Failed to write document audit log: ${toSafeSupabaseErrorMessage(error)}`);
}

async function requireAuthenticatedUser(client: SupabaseClient) {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user?.id) {
    throw new Error("Sign in required to generate pay stub PDFs.");
  }
}

function assertPayStubDocument(document: DocumentRow) {
  const type = document.type?.trim();
  const documentTypeId = document.document_type_id?.trim();
  if (type !== "pay_stub" && type !== "pay-stub" && documentTypeId !== "pay-stub" && documentTypeId !== "pay_stub") {
    throw new Error("Only pay stub documents can generate pay stub PDFs.");
  }
}

function requiredValue(value: string | null | undefined, message: string) {
  const normalized = value?.trim() ?? "";
  if (!normalized) throw new Error(message);
  return normalized;
}

function requiredMoney(value: number | string | null | undefined, message: string) {
  if (value === null || value === undefined || value === "") throw new Error(message);
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) throw new Error(message);
  return amount;
}

function requireRow<T>(row: unknown, message: string): T {
  if (!row) throw new Error(message);
  return row as T;
}

function safeGenerationError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/sign in|required|auth|jwt|permission|row-level security/i.test(message)) {
    return "Sign in required to generate this document.";
  }

  if (/already been generated/i.test(message)) {
    return "Pay stub PDF has already been generated.";
  }

  if (/missing|could not be loaded|only pay stub|same company|does not belong/i.test(message)) {
    return message;
  }

  if (/upload/i.test(message)) {
    return "Unable to store the generated pay stub PDF.";
  }

  return "Unable to generate the pay stub PDF.";
}
