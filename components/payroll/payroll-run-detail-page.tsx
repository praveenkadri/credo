import Link from "next/link";
import { type ReactNode } from "react";
import { BrandIcon, iconForDocumentRecord, toneForDocumentRecord, toneForPayrollStatus } from "@/components/brand/brand-visuals";
import { DocumentPdfActions } from "@/components/documents/document-pdf-actions";
import { buttonClassName } from "@/components/ui-primitives/button";
import { type PayrollRunEmployeeRecord } from "@/lib/data/payroll";
import { getPayrollDocumentStateLabel, type DocumentRecord } from "@/lib/documents-workspace";
import { formatPayrollDateLabel, formatPayrollMoney, type PayrollRunRecord } from "@/lib/payroll-workspace";
import { routes } from "@/lib/routes";

export function PayrollRunDetailPage({
  run,
  lineItems,
  documents,
}: {
  run: PayrollRunRecord;
  lineItems: PayrollRunEmployeeRecord[];
  documents: DocumentRecord[];
}) {
  const submittedDate = run.submittedAt ? formatPayrollDateLabel(run.submittedAt) : "Not submitted";

  return (
    <div className="w-full pb-12">
      <section className="shell-enter">
        <Link href={routes.payroll} className={buttonClassName("rowActionQuiet")}>
          Back to Payroll
        </Link>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-start gap-3">
              <BrandIcon icon="payroll" tone={toneForPayrollStatus(run.status)} size="md" />
              <div>
                <p className="type-eyebrow text-neutral-400">Payroll run</p>
                <h1 className="type-page-title mt-2 md:text-[42px]">{run.payPeriod}</h1>
                <div className="type-body mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-neutral-600">
                  <Link href={routes.company(run.companyId)} className="rounded-md underline-offset-4 hover:text-[#1f221c] hover:underline">
                    {run.companyLabel}
                  </Link>
                  <span className="text-neutral-400">·</span>
                  <span>{run.payrollTypeLabel}</span>
                  <span className="text-neutral-400">·</span>
                  <span>{run.employeeSummary}</span>
                </div>
              </div>
            </div>
          </div>

          <span className="type-caption inline-flex h-8 items-center gap-2 rounded-full bg-[#f1f2ef] px-3 font-medium text-[var(--action-text)]">
            <BrandIcon icon={run.status === "completed" ? "check" : "payroll"} tone={toneForPayrollStatus(run.status)} size="sm" className="size-5 rounded-lg [&_svg]:size-3" />
            {run.statusLabel}
          </span>
        </div>
      </section>

      <section className="mt-7 shell-enter shell-enter-delay-1">
        <div className="grid gap-3 md:grid-cols-4">
          <SummaryItem label="Company" value={run.companyLabel} />
          <SummaryItem label="Pay period" value={run.payPeriod} />
          <SummaryItem label="Pay date" value={formatPayrollDateLabel(run.payDate)} />
          <SummaryItem label="Payroll type" value={run.payrollTypeLabel} />
          <SummaryItem label="Employees" value={String(run.employeesCount)} />
          <SummaryItem label="Gross pay" value={formatPayrollMoney(run.grossPay ?? 0)} />
          <SummaryItem label="Deductions" value={formatPayrollMoney(run.deductions ?? 0)} />
          <SummaryItem label="Net pay" value={formatPayrollMoney(run.netPay ?? run.totalAmount)} />
          <SummaryItem label="Submitted" value={submittedDate} />
        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="type-eyebrow font-medium text-neutral-500">Employee line items</h2>
          <span className="type-caption text-neutral-400">{lineItems.length} records</span>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-[#fafaf7]">
          {lineItems.length === 0 ? (
            <EmptyPanelText>No employee line items were found for this payroll run.</EmptyPanelText>
          ) : (
            lineItems.map((item, index) => (
              <div
                key={item.id}
                className={[
                  "grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.2fr)_110px_110px_90px_120px_120px_120px] md:items-center md:gap-4",
                  index > 0 ? "border-t border-black/[0.04]" : "",
                ].join(" ")}
              >
                <RowValue label="Employee" value={item.employeeName} strong />
                <RowValue label="Rate type" value={formatRateType(item.rateType)} />
                <RowValue label="Rate" value={formatPayrollMoney(item.rateAmount)} align="right" />
                <RowValue label="Hours" value={formatHours(item.totalHours)} align="right" />
                <RowValue label="Gross" value={formatPayrollMoney(item.grossPay)} align="right" />
                <RowValue label="Deductions" value={formatPayrollMoney(item.deductions)} align="right" />
                <RowValue label="Net" value={formatPayrollMoney(item.netPay)} align="right" strong />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="type-eyebrow font-medium text-neutral-500">Generated documents</h2>
          <span className="type-caption text-neutral-400">{documents.length} records</span>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-[#fafaf7]">
          {documents.length === 0 ? (
            <EmptyPanelText>No generated documents were found for this payroll run.</EmptyPanelText>
          ) : (
            documents.map((document, index) => (
              <div
                key={document.id}
                className={[
                  "grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.35fr)_minmax(160px,0.5fr)_110px_130px_auto] md:items-center md:gap-5",
                  index > 0 ? "border-t border-black/[0.04]" : "",
                ].join(" ")}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <BrandIcon
                    icon={iconForDocumentRecord(document.typeId, Boolean(document.employeeId))}
                    tone={toneForDocumentRecord(document.typeId, Boolean(document.employeeId))}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <Link href={routes.document(document.id)} className="type-label block truncate text-[#1f221c] underline-offset-4 hover:underline">
                      {document.title}
                    </Link>
                    <p className="type-body-small mt-1 truncate text-neutral-600">{document.employeeLabel ?? "Payroll run document"}</p>
                  </div>
                </div>

                <RowValue label="Employee" value={document.employeeLabel ?? "Not employee specific"} />
                <RowValue label="Status" value={getPayrollDocumentStateLabel(document)} />
                <RowValue label="Generated" value={formatPayrollDateLabel(document.date)} />

                <DocumentPdfActions document={document} compact />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-[#fafaf7] px-4 py-3">
      <p className="type-caption text-neutral-400">{label}</p>
      <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">{value}</p>
    </div>
  );
}

function RowValue({
  label,
  value,
  align = "left",
  strong = false,
}: {
  label: string;
  value: string;
  align?: "left" | "right";
  strong?: boolean;
}) {
  return (
    <div className={align === "right" ? "text-left md:text-right" : "min-w-0"}>
      <p className="type-caption text-neutral-400 md:hidden">{label}</p>
      <p className={`${strong ? "type-body-strong" : "type-body-small"} numeric-tabular mt-1 truncate capitalize text-[#1f221c] md:mt-0`}>
        {value}
      </p>
    </div>
  );
}

function EmptyPanelText({ children }: { children: ReactNode }) {
  return <p className="type-body px-5 py-8 text-neutral-600">{children}</p>;
}

function formatRateType(value: PayrollRunEmployeeRecord["rateType"]) {
  if (value === "biWeekly") return "Bi-weekly";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatHours(value: number) {
  return new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(value);
}
