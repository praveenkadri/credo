import { cn } from "@/lib/utils";
import type { CompanyDetail } from "@/components/company-detail/company-detail-data";

export function CompanyDetailHeader({ company }: { company: CompanyDetail }) {
  const showStatusPill = company.status !== "Healthy";

  return (
    <header className="shell-enter">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-medium tracking-[0.02em] text-neutral-600 ring-1 ring-neutral-200/60",
            company.avatarTone
          )}
        >
          {company.initials}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-left text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#1f221c] transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40"
              aria-label="Open company selector"
            >
              <span className="truncate">{company.name}</span>
              <span className="text-[18px] text-neutral-500">⌄</span>
            </button>

            {showStatusPill ? (
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium ring-1",
                  company.statusPillTone
                )}
              >
                {company.status}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-[13px] text-neutral-600">{company.subtitle}</p>
        </div>
      </div>
    </header>
  );
}
