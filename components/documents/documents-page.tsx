"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonClassName } from "@/components/ui-primitives/button";
import {
  filterDocuments,
  formatWorkspaceDateLabel,
  formatWorkspaceMonthLabel,
  getDocumentRecords,
  getDocumentsFilters,
} from "@/lib/documents-workspace";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

export function DocumentsPage() {
  const c = useContent();
  const view = c.documents;
  const searchParams = useSearchParams();
  const filters = getDocumentsFilters(searchParams);

  const records = useMemo(() => getDocumentRecords(view), [view]);
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
            <p className="type-eyebrow text-neutral-400">{view.eyebrow}</p>
            <h1 className="type-page-title mt-2 md:text-[42px]">{view.title}</h1>
            <p className="type-body mt-3 max-w-[720px] text-neutral-600">{view.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={view.actionLinks.requestDocuments} className={buttonClassName("secondary")}>
              {view.actions.requestDocuments}
            </Link>
            <Link href={view.actionLinks.uploadDocuments} className={buttonClassName("outline")}>
              {view.actions.uploadDocuments}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-1">
        {groupedRecords.length === 0 ? (
          <div className="rounded-[30px] bg-white/40 px-6 py-10 ring-1 ring-neutral-200/45">
              <div className="mx-auto max-w-[520px] text-center">
              <h2 className="type-card-title text-[#1f221c]">{view.emptyState.title}</h2>
              <p className="type-body mt-3 text-neutral-600">{view.emptyState.description}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedRecords.map((group) => (
              <section key={group.key}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="type-eyebrow text-neutral-500">{group.label}</h2>
                  <span className="type-caption text-neutral-400">
                    {group.items.length} {group.items.length === 1 ? view.documentCount.single : view.documentCount.plural}
                  </span>
                </div>

                <div className="overflow-hidden rounded-[28px] bg-white/30 ring-1 ring-neutral-200/40">
                  {group.items.map((record, index) => (
                    <div
                      key={record.id}
                      className={cn(
                        "grid gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 md:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.8fr)_auto] md:items-center md:gap-6",
                        index > 0 && "border-t border-neutral-200/50"
                      )}
                      >
                      <div className="min-w-0">
                        <p className="type-body-strong text-[#1f221c]">{record.title}</p>
                        <p className="type-body-small mt-1 text-neutral-600">
                          {[record.companyLabel, record.teamLabel, record.employeeLabel ?? view.meta.notEmployeeDocument].join(" · ")}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left md:min-w-[210px] md:grid-cols-1 md:text-right">
                        <div>
                          <p className="type-caption text-neutral-400">{view.columns.type}</p>
                          <p className="type-body-strong mt-1 text-[#1f221c]">{record.typeLabel}</p>
                        </div>
                        <div>
                          <p className="type-caption text-neutral-400">{view.columns.date}</p>
                          <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">{formatWorkspaceDateLabel(record.date)}</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
                        <a href={record.openHref} target="_blank" rel="noreferrer" className={buttonClassName("ghost") + " h-9 px-4"}>
                          {view.rowActions.open}
                        </a>
                        <a href={record.openHref} download={record.downloadName} className={buttonClassName("secondary") + " h-9 px-4"}>
                          {view.rowActions.download}
                        </a>
                      </div>
                    </div>
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
