import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandIcon, iconForDocumentRecord, toneForDocumentRecord } from "@/components/brand/brand-visuals";
import { DocumentPdfActions } from "@/components/documents/document-pdf-actions";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { buttonClassName } from "@/components/ui-primitives/button";
import { getCurrentUser } from "@/lib/auth/session";
import { getDocumentFileAccessState } from "@/lib/data/document-access";
import { getDocumentForToken } from "@/lib/data/documents";
import { getPayStubGenerationData, type PayStubGenerationData } from "@/lib/data/document-generation";
import { formatWorkspaceDateLabel, getDocumentStateLabel } from "@/lib/documents-workspace";
import { routes } from "@/lib/routes";

export default async function DocumentDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const [document, accessState, payStubPreview] = await Promise.all([
    getDocumentForToken(id, user.accessToken),
    getDocumentFileAccessState(id, { sessionAccessToken: user.accessToken }),
    getSafePayStubPreview(id, user.accessToken),
  ]);

  if (!document) {
    notFound();
  }

  const enrichedDocument = {
    ...document,
    fileAvailable: accessState.hasFile,
    fileMetadataMissing: document.fileMetadataMissing,
    fileName: accessState.fileName ?? document.fileName,
    fileSizeBytes: accessState.fileSizeBytes ?? document.fileSizeBytes,
    generationStatus: accessState.generationStatus,
    status: accessState.generationStatus !== "unavailable" ? accessState.generationStatus : document.status,
  };
  const stateLabel = getDocumentStateLabel(enrichedDocument);
  const helperText = getStateHelperText(enrichedDocument);
  const sanitizedError = enrichedDocument.generationStatus === "failed"
    ? sanitizeGenerationError(document.generationError ?? accessState.error)
    : "";

  return (
    <div className="w-full pb-12">
      <section className="shell-enter">
        <Link href={routes.documents} className={buttonClassName("rowActionQuiet")}>
          Back to Documents
        </Link>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-start gap-3">
              <BrandIcon
                icon={iconForDocumentRecord(document.typeId, Boolean(document.employeeId))}
                tone={toneForDocumentRecord(document.typeId, Boolean(document.employeeId))}
                size="md"
              />
              <div>
                <p className="type-eyebrow text-neutral-400">{document.typeLabel}</p>
                <h1 className="type-page-title mt-2 md:text-[42px]">{document.title}</h1>
                <div className="type-body mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-neutral-600">
                  <Link href={routes.company(document.companyId)} className="rounded-md underline-offset-4 hover:text-[#1f221c] hover:underline">
                    {document.companyLabel}
                  </Link>
                  <span className="text-neutral-400">·</span>
                  {document.employeeId && document.employeeLabel ? (
                    <Link href={routes.employee(document.employeeId)} className="rounded-md underline-offset-4 hover:text-[#1f221c] hover:underline">
                      {document.employeeLabel}
                    </Link>
                  ) : (
                    <span>Company document</span>
                  )}
                  <span className="text-neutral-400">·</span>
                  <span>{formatWorkspaceDateLabel(document.date)}</span>
                </div>
              </div>
            </div>
          </div>

          <DocumentPdfActions document={enrichedDocument} showDetailsLink={false} />
        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-1">
        <div className="grid gap-3 md:grid-cols-4">
          <SummaryItem label="Status" value={stateLabel} />
          <SummaryItem label="File" value={accessState.hasFile ? "PDF available" : "PDF missing"} />
          <SummaryItem label="Type" value={document.typeLabel} />
          <SummaryItem label="Date" value={formatWorkspaceDateLabel(document.date)} />
          {enrichedDocument.fileName ? <SummaryItem label="File name" value={enrichedDocument.fileName} /> : null}
          {document.generatedAt ? <SummaryItem label="Generated" value={formatWorkspaceDateLabel(document.generatedAt.slice(0, 10))} /> : null}
          {enrichedDocument.fileSizeBytes ? <SummaryItem label="File size" value={formatFileSize(enrichedDocument.fileSizeBytes)} /> : null}
        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-2">
        <div className="rounded-[24px] bg-[#fafaf7] px-5 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="type-eyebrow text-neutral-400">PDF status</p>
              <h2 className="type-card-title mt-2 text-[#1f221c]">{stateLabel}</h2>
              <p className="type-body mt-2 max-w-2xl text-neutral-600">{helperText}</p>
              {sanitizedError ? <p className="type-body-small mt-3 text-[#9f3a2f]">{sanitizedError}</p> : null}
            </div>
            <DocumentPdfActions document={enrichedDocument} showDetailsLink={false} />
          </div>
        </div>
      </section>

      {payStubPreview ? (
        <section className="mt-8 shell-enter shell-enter-delay-2">
          <div className="mb-4">
            <p className="type-eyebrow text-neutral-400">Pay stub preview</p>
            <h2 className="type-card-title mt-2 text-[#1f221c]">Persisted payroll values</h2>
            <p className="type-body-small mt-2 text-neutral-600">This preview is not a substitute for the generated PDF.</p>
          </div>

          <div className="rounded-[24px] bg-[#fafaf7] p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <SummaryItem label="Company" value={payStubPreview.pdfInput.companyName} />
              <SummaryItem label="Employee" value={payStubPreview.pdfInput.employeeDisplayName} />
              <SummaryItem label="Pay date" value={formatWorkspaceDateLabel(String(payStubPreview.pdfInput.payDate))} />
              <SummaryItem
                label="Pay period"
                value={`${formatWorkspaceDateLabel(String(payStubPreview.pdfInput.payPeriodStart))} to ${formatWorkspaceDateLabel(String(payStubPreview.pdfInput.payPeriodEnd))}`}
              />
              <SummaryItem label="Gross pay" value={formatMoney(payStubPreview.pdfInput.grossPay)} />
              <SummaryItem label="Deductions" value={formatMoney(payStubPreview.pdfInput.deductions)} />
              <SummaryItem label="Net pay" value={formatMoney(payStubPreview.pdfInput.netPay)} />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-[#fafaf7] px-4 py-3">
      <p className="type-caption text-neutral-400">{label}</p>
      <p className="type-body-strong numeric-tabular mt-1 truncate capitalize text-[#1f221c]">{value}</p>
    </div>
  );
}

function formatFileSize(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

async function getSafePayStubPreview(documentId: string, accessToken: string): Promise<PayStubGenerationData | null> {
  try {
    return await getPayStubGenerationData(documentId, accessToken);
  } catch {
    return null;
  }
}

function getStateHelperText(document: {
  fileAvailable?: boolean;
  fileMetadataMissing?: boolean;
  generationStatus?: string;
  status?: string;
}) {
  const status = document.generationStatus ?? document.status;
  if (status === "generating") return "Credo is generating this private PDF. Refresh shortly if the status does not update.";
  if (status === "failed") return "PDF generation did not complete. You can retry generation from this page.";
  if (document.fileMetadataMissing) return "This pay stub record exists, but the PDF has not been generated yet.";
  if (document.fileAvailable) return "This PDF is stored privately. Open and download links use short-lived signed access.";
  return "This pay stub record exists, but the PDF has not been generated yet.";
}

function sanitizeGenerationError(value?: string) {
  const message = value?.trim();
  if (!message) return "The last generation attempt failed. Retry when ready.";
  if (/stack|supabase|storage|jwt|token|permission denied|row-level security/i.test(message)) {
    return "The last generation attempt failed. Retry when ready.";
  }
  return message.slice(0, 180);
}

function formatMoney(value: number | string) {
  const amount = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(Number.isFinite(amount) ? amount : 0);
}
