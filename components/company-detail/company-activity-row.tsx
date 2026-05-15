"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CompanyIcon } from "@/components/company-detail/company-detail-icons";
import type { CompanyActivityItem } from "@/components/company-detail/company-detail-data";

const activityToneClass: Record<string, string> = {
  payroll: "bg-[var(--credo-bronze-soft)] text-[var(--credo-green-950)]",
  invoice: "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)]",
  tax: "bg-[var(--credo-taupe-wash)] text-[var(--credo-muted-strong)]",
  compliance: "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)]",
  document: "bg-[var(--credo-taupe-wash)] text-[var(--credo-muted-strong)]",
};

export function CompanyActivityRow({ item }: { item: CompanyActivityItem }) {
  const [expanded, setExpanded] = useState(false);
  const toneClass = activityToneClass[item.icon] ?? "bg-[var(--credo-taupe-wash)] text-[var(--credo-muted-strong)]";

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      className={cn(
        "group relative grid h-auto w-full gap-3 rounded-none bg-transparent px-4 py-4 text-left transition duration-200 hover:bg-[rgba(184,135,79,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-5"
      )}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <CompanyIcon name={item.icon} className={cn("mt-0.5 size-8 rounded-full [&_svg]:size-3.5", toneClass)} />
        <div className="min-w-0">
          <p className="type-body-strong truncate text-[var(--text-primary)] transition-colors duration-200">
            {item.title}
          </p>
          <p className="type-body-small mt-1 truncate text-neutral-500 transition-colors duration-200">
            {item.subtitle}
          </p>
          {expanded && item.expandedNote ? (
            <p className="type-caption mt-2 text-neutral-500">{item.expandedNote}</p>
          ) : null}
        </div>
      </div>

      <div className="text-left md:text-right">
        <p className="type-body-strong text-[var(--text-primary)]">{item.rightPrimary}</p>
        {item.rightSecondary ? <p className="type-caption mt-0.5 text-neutral-500">{item.rightSecondary}</p> : null}
      </div>
    </button>
  );
}
