"use client";

import { useRouter } from "next/navigation";
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
        "group relative grid cursor-pointer gap-y-4 px-6 py-5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.03))] hover:-translate-y-[1px] hover:bg-white/70 hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)] active:translate-y-0 active:scale-[0.998] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(31,34,28,0.08)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:items-center md:gap-x-6 md:gap-y-0 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        surfaceClass("accountRow"),
        motionClass.standard
      )}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <span
          className={cn(
            "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-medium tracking-[0.02em] text-neutral-600 ring-1 ring-neutral-200/60",
            company.avatarTone
          )}
        >
          {company.initials}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-[16px] font-semibold leading-5 tracking-[-0.015em] text-[#242721] transition-colors duration-200 group-hover:text-neutral-900">
              {company.name}
            </p>
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium ring-1",
                company.statusPillTone
              )}
            >
              {company.state}
            </span>
          </div>
          <p className="mt-1 truncate text-[13px] leading-[1.35] text-neutral-600 transition-colors duration-200 group-hover:text-neutral-700">
            {company.stateDetail}
            <span className="mx-1 text-neutral-400">·</span>
            <span className={company.statusTone}>{company.lastActivity}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 md:justify-self-end">
        <div className="text-right leading-tight">
          <p className="text-[24px] font-semibold leading-6 tracking-[-0.02em] text-[#1f221c]">{company.payrollAmount}</p>
          <p className="mt-1 text-[12px] text-neutral-500">{company.employeeCount} employees</p>
        </div>
        <span className={cn("text-[18px] leading-none text-neutral-500 group-hover:translate-x-[2px]", motionClass.chevron)}>
          ›
        </span>
      </div>
    </div>
  );
}
