import { surfaceClass } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import type { OverviewCompany } from "@/lib/data/companies";

export function CashMovementNoActivity({ companies = [] }: { companies?: OverviewCompany[] }) {
  const dateRange = getZeroChartDateRange(companies);

  return (
    <section className={cn(surfaceClass("chartSurface"), "shell-enter shell-enter-delay-2 px-6 py-4")}>
      <div className="max-w-[760px]">
        <p className="type-eyebrow text-[var(--credo-bronze-700)]">Net revenue</p>
        <h2 className="numeric-tabular mt-3 text-[48px] font-bold leading-[0.96] text-[var(--credo-ink)] md:text-[54px]">$0.00</h2>
        <p className="mt-2.5 text-[14px] font-medium text-[var(--credo-muted)]">No payroll activity yet</p>
        <p className="mt-1.5 text-[13px] font-normal leading-[1.4] text-[#6F746D]">
          Add an employee and complete setup to prepare your first payroll run.
        </p>
        <ZeroCashMovementChart startLabel={dateRange.startLabel} endLabel={dateRange.endLabel} />
      </div>
    </section>
  );
}

function ZeroCashMovementChart({ startLabel, endLabel }: { startLabel: string; endLabel: string }) {
  return (
    <div className="mt-5 w-full border-b border-[rgba(225,218,207,0.38)] pb-0.5" aria-label={`Flat zero-value net revenue chart from ${startLabel} to ${endLabel}`}>
      <svg viewBox="0 0 760 132" className="h-[132px] w-full overflow-visible" role="img">
        <title>Net revenue remains at zero</title>
        <line x1="0" y1="90" x2="760" y2="90" stroke="rgba(225,218,207,0.5)" strokeWidth="1" />
        <line x1="8" y1="85" x2="8" y2="95" stroke="rgba(216,203,185,0.62)" strokeWidth="1" strokeLinecap="round" />
        <line x1="752" y1="85" x2="752" y2="95" stroke="rgba(216,203,185,0.62)" strokeWidth="1" strokeLinecap="round" />
        <path
          d="M8 90H752"
          fill="none"
          stroke="var(--brand-chart-line)"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.9"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="752" cy="90" r="4.8" fill="var(--credo-surface-warm)" stroke="var(--credo-taupe-strong)" strokeWidth="1" opacity="0.86" />
        <circle cx="752" cy="90" r="2.4" fill="var(--brand-chart-line)" opacity="0.96" />
      </svg>
      <div className="mt-1 flex items-center justify-between text-[11px] font-medium leading-none text-[var(--credo-muted)]">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}

function getZeroChartDateRange(companies: OverviewCompany[]) {
  const now = new Date();
  const fallbackStart = new Date(now);
  fallbackStart.setDate(now.getDate() - 30);

  const startDate = companies
    .map((company) => parseDate(company.createdAt))
    .filter((date): date is Date => Boolean(date))
    .sort((left, right) => left.getTime() - right.getTime())[0] ?? fallbackStart;

  return {
    startLabel: formatChartDate(startDate),
    endLabel: formatChartDate(now),
  };
}

function parseDate(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatChartDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}
