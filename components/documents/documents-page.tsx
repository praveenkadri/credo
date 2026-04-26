"use client";

import Link from "next/link";
import { buttonClassName } from "@/components/ui-primitives/button";
import { EmptyState } from "@/components/ui-patterns/empty-state";
import { useContent } from "@/lib/useContent";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type DocumentTabId = "pay-stubs" | "letters" | "tax-forms" | "company-documents";
type DocumentSourceId = "generated" | "uploaded";
type DocumentMonthId = "2026-04" | "2026-03" | "2025-12";
type DocumentGroupId = "april-2026" | "march-2026" | "december-2025";
type DocumentItemId =
  | "maya-paystub-apr"
  | "jonas-paystub-apr"
  | "amelia-letter-bonus"
  | "employment-verification-maya"
  | "t4-2025-maya"
  | "t4-2025-jonas"
  | "roe-noah"
  | "board-resolution-apr";

type DocumentFilters = {
  tab: DocumentTabId;
  source: "all" | DocumentSourceId;
  month: "all" | DocumentMonthId;
};

type DocumentsPageProps = {
  filters: DocumentFilters;
};

type DocumentRecord = {
  id: DocumentItemId;
  tab: DocumentTabId;
  source: DocumentSourceId;
  month: DocumentMonthId;
  group: DocumentGroupId;
  title: string;
  subtitle: string;
  meta: string;
  toneLabel: string;
  fileName: string;
  href: string;
};

export function DocumentsPage({ filters }: DocumentsPageProps) {
  const c = useContent();
  const view = c.documents;
  const records = getDocuments(view);

  const filteredRecords = records.filter((record) => {
    return (
      record.tab === filters.tab &&
      (filters.source === "all" || record.source === filters.source) &&
      (filters.month === "all" || record.month === filters.month)
    );
  });

  const groupedRecords = view.groups
    .map((group) => ({
      id: group.id,
      label: group.label,
      items: filteredRecords.filter((record) => record.group === group.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="w-full pb-12">
      <section className="shell-enter">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-400">{view.eyebrow}</p>
            <h1 className="mt-2 text-[36px] font-semibold tracking-[-0.035em] text-[#1f221c] md:text-[42px]">
              {view.title}
            </h1>
            <p className="mt-3 max-w-[720px] text-[15px] leading-7 text-neutral-600">{view.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={routes.documentsView({ action: "request" })} className={buttonClassName("secondary")}>
              {view.actions.requestDocuments}
            </Link>
            <Link href={routes.documentsView({ action: "upload" })} className={buttonClassName("outline")}>
              {view.actions.uploadDocuments}
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {view.tabs.map((tab) => {
            const active = filters.tab === tab.id;
            return (
              <Link
                key={tab.id}
                href={routes.documentsView({
                  tab: tab.id,
                  source: filters.source !== "all" ? filters.source : undefined,
                  month: filters.month !== "all" ? filters.month : undefined,
                })}
                className={buttonClassName(active ? "chipActive" : "chip")}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-1">
        {groupedRecords.length === 0 ? (
          <div className="rounded-[30px] bg-white/45 px-6 py-10 ring-1 ring-neutral-200/45">
            <div className="mx-auto max-w-[520px] text-center">
              <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1f221c]">{view.emptyState.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-neutral-600">{view.emptyState.description}</p>
              <div className="mt-6 flex justify-center">
                <EmptyState message={view.emptyState.hint} className="w-full max-w-[360px]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedRecords.map((group) => (
              <section key={group.id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-[13px] font-medium uppercase tracking-[0.11em] text-neutral-500">{group.label}</h2>
                  <span className="text-[12px] text-neutral-400">
                    {group.items.length} {group.items.length === 1 ? view.documentCount.single : view.documentCount.plural}
                  </span>
                </div>

                <div className="overflow-hidden rounded-[28px] bg-white/35 ring-1 ring-neutral-200/40">
                  {group.items.map((record, index) => (
                    <div
                      key={record.id}
                      className={cn(
                        "flex flex-col gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 md:flex-row md:items-center md:justify-between",
                        index > 0 && "border-t border-neutral-200/50"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex h-8 items-center rounded-full bg-[var(--action-primary-muted)] px-3 text-[12px] font-medium text-[var(--action-text)]">
                            {record.toneLabel}
                          </span>
                          <span className="text-[12px] text-neutral-400">{record.meta}</span>
                        </div>
                        <p className="mt-2 truncate text-[16px] font-semibold tracking-[-0.015em] text-[#1f221c]">
                          {record.title}
                        </p>
                        <p className="mt-1 text-[14px] leading-6 text-neutral-600">{record.subtitle}</p>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <a
                          href={record.href}
                          target="_blank"
                          rel="noreferrer"
                          className={buttonClassName("ghost") + " h-9 px-4 text-[13px]"}
                        >
                          {view.rowActions.open}
                        </a>
                        <a
                          href={record.href}
                          download={record.fileName}
                          className={buttonClassName("secondary") + " h-9 px-4 text-[13px]"}
                        >
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

function getDocuments(view: ReturnType<typeof useContent>["documents"]): DocumentRecord[] {
  return [
    {
      id: "maya-paystub-apr",
      tab: "pay-stubs",
      source: "generated",
      month: "2026-04",
      group: "april-2026",
      title: view.items.mayaPaystubApril.title,
      subtitle: view.items.mayaPaystubApril.subtitle,
      meta: view.items.mayaPaystubApril.meta,
      toneLabel: view.sourceLabels.generated,
      fileName: "maya-chen-pay-stub-apr-19-2026.txt",
      href: createMockDocumentHref(view.items.mayaPaystubApril.title, view.items.mayaPaystubApril.subtitle, view.items.mayaPaystubApril.meta),
    },
    {
      id: "jonas-paystub-apr",
      tab: "pay-stubs",
      source: "generated",
      month: "2026-04",
      group: "april-2026",
      title: view.items.jonasPaystubApril.title,
      subtitle: view.items.jonasPaystubApril.subtitle,
      meta: view.items.jonasPaystubApril.meta,
      toneLabel: view.sourceLabels.generated,
      fileName: "jonas-patel-pay-stub-apr-19-2026.txt",
      href: createMockDocumentHref(view.items.jonasPaystubApril.title, view.items.jonasPaystubApril.subtitle, view.items.jonasPaystubApril.meta),
    },
    {
      id: "amelia-letter-bonus",
      tab: "letters",
      source: "generated",
      month: "2026-04",
      group: "april-2026",
      title: view.items.ameliaBonusLetter.title,
      subtitle: view.items.ameliaBonusLetter.subtitle,
      meta: view.items.ameliaBonusLetter.meta,
      toneLabel: view.sourceLabels.generated,
      fileName: "amelia-brooks-bonus-letter.txt",
      href: createMockDocumentHref(view.items.ameliaBonusLetter.title, view.items.ameliaBonusLetter.subtitle, view.items.ameliaBonusLetter.meta),
    },
    {
      id: "employment-verification-maya",
      tab: "letters",
      source: "uploaded",
      month: "2026-03",
      group: "march-2026",
      title: view.items.mayaVerificationLetter.title,
      subtitle: view.items.mayaVerificationLetter.subtitle,
      meta: view.items.mayaVerificationLetter.meta,
      toneLabel: view.sourceLabels.uploaded,
      fileName: "maya-chen-employment-verification.txt",
      href: createMockDocumentHref(view.items.mayaVerificationLetter.title, view.items.mayaVerificationLetter.subtitle, view.items.mayaVerificationLetter.meta),
    },
    {
      id: "t4-2025-maya",
      tab: "tax-forms",
      source: "generated",
      month: "2025-12",
      group: "december-2025",
      title: view.items.mayaT4.title,
      subtitle: view.items.mayaT4.subtitle,
      meta: view.items.mayaT4.meta,
      toneLabel: view.sourceLabels.generated,
      fileName: "maya-chen-t4-2025.txt",
      href: createMockDocumentHref(view.items.mayaT4.title, view.items.mayaT4.subtitle, view.items.mayaT4.meta),
    },
    {
      id: "t4-2025-jonas",
      tab: "tax-forms",
      source: "generated",
      month: "2025-12",
      group: "december-2025",
      title: view.items.jonasT4.title,
      subtitle: view.items.jonasT4.subtitle,
      meta: view.items.jonasT4.meta,
      toneLabel: view.sourceLabels.generated,
      fileName: "jonas-patel-t4-2025.txt",
      href: createMockDocumentHref(view.items.jonasT4.title, view.items.jonasT4.subtitle, view.items.jonasT4.meta),
    },
    {
      id: "roe-noah",
      tab: "tax-forms",
      source: "generated",
      month: "2026-03",
      group: "march-2026",
      title: view.items.noahRoe.title,
      subtitle: view.items.noahRoe.subtitle,
      meta: view.items.noahRoe.meta,
      toneLabel: view.sourceLabels.generated,
      fileName: "noah-singh-record-of-employment.txt",
      href: createMockDocumentHref(view.items.noahRoe.title, view.items.noahRoe.subtitle, view.items.noahRoe.meta),
    },
    {
      id: "board-resolution-apr",
      tab: "company-documents",
      source: "uploaded",
      month: "2026-04",
      group: "april-2026",
      title: view.items.boardResolution.title,
      subtitle: view.items.boardResolution.subtitle,
      meta: view.items.boardResolution.meta,
      toneLabel: view.sourceLabels.uploaded,
      fileName: "board-resolution-package-apr-2026.txt",
      href: createMockDocumentHref(view.items.boardResolution.title, view.items.boardResolution.subtitle, view.items.boardResolution.meta),
    },
  ];
}

function createMockDocumentHref(title: string, subtitle: string, meta: string) {
  const body = [title, "", subtitle, "", meta, "", "Mock document preview for the Credo documents workspace."].join("\n");
  return `data:text/plain;charset=utf-8,${encodeURIComponent(body)}`;
}
