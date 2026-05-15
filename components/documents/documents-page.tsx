"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BrandIcon, EmptyStateVisual, iconForDocumentRecord, toneForDocumentRecord } from "@/components/brand/brand-visuals";
import { DocumentPdfActions } from "@/components/documents/document-pdf-actions";
import { EmptyStateHeader, PreviewModuleGrid } from "@/components/ui-patterns/empty-preview";
import {
  filterDocuments,
  formatWorkspaceDateLabel,
  formatWorkspaceMonthLabel,
  getDocumentStateLabel,
  getDocumentsFilters,
  type DocumentRecord,
} from "@/lib/documents-workspace";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

export function DocumentsPage({ documents }: { documents: DocumentRecord[] }) {
  const c = useContent();
  const view = c.documents;
  const searchParams = useSearchParams();
  const filters = getDocumentsFilters(searchParams);

  const records = documents;
  const isLibraryEmpty = records.length === 0;
  const filteredRecords = useMemo(() => filterDocuments(records, filters), [filters, records]);
  const groupedRecords = useMemo(() => {
    const groups = new Map<string, typeof filteredRecords>();

    filteredRecords.forEach((record) => {
      const key = record.date.slice(0, 7);
      const current = groups.get(key) ?? [];
      current.push(record);
      groups.set(key, current);
    });

    return Array.from(groups.entries())
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([key, items]) => ({
        key,
        label: formatWorkspaceMonthLabel(`${key}-01`),
        items,
      }));
  }, [filteredRecords]);

  return (
    <div className="w-full pb-12">
      <section className="shell-enter">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-start gap-3">
              <BrandIcon icon="document" tone="olive" size="md" />
              <div>
                <h1 className="type-page-title md:text-[42px]">Company documents</h1>
                <p className="type-body mt-3 max-w-[720px] text-neutral-600">
                  Keep payroll records, employee files, and generated documents organized.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-1">
        {groupedRecords.length === 0 ? (
          <div className="rounded-[28px] bg-[#f7f7f4] p-5">
            <EmptyStateHeader
              eyebrow="Document library"
              title={isLibraryEmpty ? "No documents yet" : view.emptyState.title}
              description={
                isLibraryEmpty
                  ? "Documents will appear here after payroll runs, setup actions, or company workflows generate records."
                  : "Documents are available in the library, but the current filters are hiding them. Clear or widen the filters to return to the full list."
              }
              actionLabel={isLibraryEmpty ? "Run payroll" : undefined}
              actionHref={isLibraryEmpty ? routes.runPayroll : undefined}
            />
            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(230px,0.7fr)_minmax(0,1.3fr)]">
              <div className="rounded-[24px] bg-white/60 p-4">
                <EmptyStateVisual type="documents" className="mx-0 h-[88px]" />
                <p className="type-body-small mt-2 text-neutral-600">
                  Generate payroll or upload company records first. After that, document rows will show type, company, employee, date, status, and PDF actions.
                </p>
              </div>
              <div className="space-y-3">
                <PreviewModuleGrid
                  items={[
                    {
                      title: "Pay stubs",
                      description: "Employee pay stubs generated from submitted payroll runs.",
                      icon: "payroll",
                      tone: "olive",
                      meta: "Payroll",
                    },
                    {
                      title: "Employee letters",
                      description: "Employment, verification, bonus, and record letters tied to people.",
                      icon: "person",
                      tone: "olive",
                      meta: "Employees",
                    },
                    {
                      title: "Tax forms",
                      description: "Year-end and filing documents will sit with their company and employee context.",
                      icon: "tax",
                      tone: "olive",
                      meta: "Compliance",
                    },
                    {
                      title: "Company files",
                      description: "Authorization, board, and setup records will collect in one place.",
                      icon: "building",
                      tone: "olive",
                      meta: "Company",
                    },
                  ]}
                />
                <p className="type-body-small max-w-[620px] text-neutral-600">
                  {isLibraryEmpty
                    ? "Payroll runs and company workflows are the first sources for generated documents. Once files exist, open and download actions appear beside each row."
                    : "Quick filters, company, team, employee, date, or status can narrow the visible list."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            {groupedRecords.map((group) => (
              <section key={group.key}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="type-eyebrow font-medium text-neutral-500">{group.label}</h2>
                  <span className="type-caption text-neutral-400">
                    {group.items.length} {group.items.length === 1 ? view.documentCount.single : view.documentCount.plural}
                  </span>
                </div>

                <div className="overflow-hidden rounded-[28px] bg-[#fafaf7]">
                  {group.items.map((record, index) => (
                    <article
                      key={record.id}
                      role={record.openHref ? "link" : undefined}
                      tabIndex={record.openHref ? 0 : undefined}
                      onClick={() => {
                        if (!record.openHref) return;
                        window.open(record.openHref, "_blank", "noopener,noreferrer");
                      }}
                      onKeyDown={(event) => {
                        if (!record.openHref) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          window.open(record.openHref, "_blank", "noopener,noreferrer");
                        }
                      }}
                      className={cn(
                        "group/doc relative grid cursor-pointer gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f3f4ef] focus-within:bg-[#f3f4ef] focus-visible:outline-none focus-visible:bg-[#f3f4ef] md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.58fr)_auto] md:items-center md:gap-6",
                        index > 0 && "border-t border-black/[0.04]"
                      )}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <BrandIcon
                          icon={iconForDocumentRecord(record.typeId, Boolean(record.employeeId))}
                          tone={toneForDocumentRecord(record.typeId, Boolean(record.employeeId))}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="type-label truncate text-[#1f221c]">{record.title}</p>
                          <div className="type-body-small mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-neutral-600">
                            <Link
                              href={routes.company(record.companyId)}
                              onClick={(event) => event.stopPropagation()}
                              className="rounded-md underline-offset-4 hover:text-[#1f221c] hover:underline"
                            >
                              {record.companyLabel}
                            </Link>
                            <span className="text-neutral-400">·</span>
                            <span>{record.teamLabel}</span>
                            <span className="text-neutral-400">·</span>
                            {record.employeeId && record.employeeLabel ? (
                              <Link
                                href={routes.employee(record.employeeId)}
                                onClick={(event) => event.stopPropagation()}
                                className="rounded-md underline-offset-4 hover:text-[#1f221c] hover:underline"
                              >
                                {record.employeeLabel}
                              </Link>
                            ) : (
                              <span>{view.meta.notEmployeeDocument}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-4 md:justify-end md:gap-6">
                        <p className="type-body-small truncate text-[#1f221c]">{record.typeLabel}</p>
                        <p className="type-body-small numeric-tabular whitespace-nowrap text-[#1f221c]">
                          {formatWorkspaceDateLabel(record.date)}
                        </p>
                        <p className="type-caption text-neutral-400">{getDocumentStateLabel(record)}</p>
                      </div>

                      <DocumentPdfActions document={record} compact />
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
