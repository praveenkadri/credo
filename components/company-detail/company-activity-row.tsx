"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motionClass } from "@/components/ui/motion";
import { surfaceClass } from "@/components/ui/surface";
import { CompanyIcon } from "@/components/company-detail/company-detail-icons";
import type { CompanyActivityItem } from "@/components/company-detail/company-detail-data";

export function CompanyActivityRow({ item }: { item: CompanyActivityItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      className={cn(
        "group relative w-full text-left",
        "grid gap-3 px-4 py-3.5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-5",
        "hover:-translate-y-[1px] hover:bg-white/70 hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)] active:translate-y-0 active:scale-[0.998]",
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(31,34,28,0.08)]",
        "motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        surfaceClass("accountRow"),
        motionClass.standard
      )}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <CompanyIcon name={item.icon} className="mt-0.5" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-[#242721] transition-colors duration-200 group-hover:text-neutral-900">
            {item.title}
          </p>
          <p className="mt-1 truncate text-[13px] text-neutral-600 transition-colors duration-200 group-hover:text-neutral-700">
            {item.subtitle}
          </p>
          {expanded && item.expandedNote ? (
            <p className="mt-1.5 text-[12px] text-neutral-500">{item.expandedNote}</p>
          ) : null}
        </div>
      </div>

      <div className="text-left md:text-right">
        <p className="text-[15px] font-medium tracking-[-0.01em] text-[#1f221c]">{item.rightPrimary}</p>
        {item.rightSecondary ? <p className="mt-0.5 text-[12px] text-neutral-500">{item.rightSecondary}</p> : null}
      </div>
    </button>
  );
}
