"use client";

import { useRouter } from "next/navigation";
import { EntityAvatar } from "@/components/brand/brand-visuals";
import { cn } from "@/lib/utils";
import { motionClass } from "@/components/ui/motion";
import { surfaceClass } from "@/components/ui/surface";

type CompanyAccountRowProps = {
  id: string;
  name: string;
  initials: string;
  avatarTone: string;
  state: string;
  stateDetail: string;
  statusTone: string;
  statusPillTone: string;
  lastActivity: string;
  payrollAmount: string;
  employeeCount: number;
  href: string;
};

export function CompanyAccountRow(company: CompanyAccountRowProps) {
  const router = useRouter();

  return (
    <div
      key={company.id}
      role="link"
      tabIndex={0}
      onClick={() => router.push(company.href)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(company.href);
        }
      }}
      className={cn(
        "group relative grid min-h-[94px] cursor-pointer gap-y-4 px-6 py-5 transition-[background-color,box-shadow,color,transform] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[rgba(247,239,228,0.52)] hover:shadow-[0_10px_30px_rgba(23,26,23,0.032)] hover:ring-[rgba(216,203,185,0.92)] active:scale-[0.998] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(21,90,67,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--credo-bg)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:items-center md:gap-x-6 md:gap-y-0",
        surfaceClass("accountRow"),
        motionClass.standard
      )}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <EntityAvatar
          type="company"
          initials={company.initials}
          size="sm"
          className="mt-0.5 bg-[var(--credo-icon-wash)] text-[var(--credo-green-950)] ring-[rgba(91,77,58,0.18)]"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-[15px] font-semibold leading-5 text-[var(--credo-ink)] transition-colors duration-200 group-hover:text-[var(--credo-green-950)]">
              {company.name}
            </p>
            <span
              className={cn(
                "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[10.5px] font-medium leading-none opacity-90 ring-1 ring-[rgba(91,77,58,0.16)]",
                company.statusPillTone
              )}
            >
              {company.state}
            </span>
          </div>
          <p className="mt-1.5 truncate text-[12.5px] leading-[1.35] text-[var(--credo-muted)] transition-colors duration-200 group-hover:text-[var(--credo-muted-strong)]">
            {company.stateDetail}
            <span className="mx-1 text-[var(--credo-taupe-strong)]">·</span>
            <span className={company.statusTone}>{company.lastActivity}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 md:justify-self-end">
        <div className="text-right leading-tight">
          <p className="type-metric-small numeric-tabular text-[16px] text-[var(--credo-ink)]">{company.payrollAmount}</p>
          <p className="numeric-tabular mt-1 text-[12px] text-[var(--credo-muted)]">{company.employeeCount} employees</p>
        </div>
        <span className={cn("inline-flex size-5 items-center justify-center text-[rgba(143,99,53,0.72)] group-hover:text-[var(--credo-green-800)]", motionClass.chevron)} aria-hidden="true">
          <svg viewBox="0 0 16 16" className="size-4" fill="none">
            <path d="m6.5 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
