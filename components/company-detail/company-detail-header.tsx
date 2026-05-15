import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui-primitives/button";
import type { CompanyDetail } from "@/components/company-detail/company-detail-data";

export function CompanyDetailHeader({ company }: { company: CompanyDetail }) {
  const showStatusPill = company.status !== "Healthy";

  return (
    <header className="shell-enter">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "type-body-small mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-medium text-neutral-600 ring-1 ring-neutral-200/60",
            company.avatarTone
          )}
        >
          {company.initials}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`${buttonClassName("subtle")} type-page-title h-auto gap-1.5 px-1.5 py-0.5 text-left`}
              aria-label="Open company selector"
            >
              <span className="truncate">{company.name}</span>
              <span className="type-card-title text-neutral-500" aria-hidden="true">⌄</span>
            </button>

            {showStatusPill ? (
              <span
                className={cn(
                  "type-caption inline-flex h-6 items-center rounded-full px-2.5 font-medium ring-1",
                  company.statusPillTone
                )}
              >
                {company.status}
              </span>
            ) : null}
          </div>

          <p className="type-body-small mt-2 text-neutral-600">{company.subtitle}</p>
        </div>
      </div>
    </header>
  );
}
