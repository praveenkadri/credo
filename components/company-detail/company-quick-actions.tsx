"use client";

import { motionClass } from "@/components/ui/motion";
import { CompanyIcon } from "@/components/company-detail/company-detail-icons";
import type { CompanyQuickAction } from "@/components/company-detail/company-detail-data";

export function CompanyQuickActions({ actions }: { actions: CompanyQuickAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={[
            "group flex min-h-[74px] flex-col items-start justify-between rounded-2xl bg-white/60 px-3.5 py-3 text-left ring-1 ring-white/50",
            "hover:-translate-y-[1px] hover:bg-white/75 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)] active:translate-y-0",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40",
            motionClass.standard,
          ].join(" ")}
          aria-label={action.label}
        >
          <CompanyIcon name={action.icon} className="size-7 bg-neutral-100/85" />
          <span className="text-[12.5px] font-medium tracking-[-0.01em] text-[#2d3228]">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
