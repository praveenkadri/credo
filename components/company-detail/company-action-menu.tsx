"use client";

import { motionClass } from "@/components/ui/motion";
import { CompanyIcon } from "@/components/company-detail/company-detail-icons";
import type { RightRailAction } from "@/components/company-detail/company-detail-data";

export function CompanyActionMenu({ actions }: { actions: RightRailAction[] }) {
  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={[
            "group flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left",
            "text-[13px] font-medium text-[#2f342a] hover:bg-white/55",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40",
            motionClass.colorBase,
          ].join(" ")}
          aria-label={action.label}
        >
          <CompanyIcon name={action.icon} className="size-7 bg-neutral-100/75" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
