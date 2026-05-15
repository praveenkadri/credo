"use client";

import Link from "next/link";
import { BrandIcon, type BrandIconName, type BrandTone } from "@/components/brand/brand-visuals";
import { buttonClassName } from "@/components/ui-primitives/button";
import type { CompanyQuickAction } from "@/components/company-detail/company-detail-data";

const quickActionClassName = [
  buttonClassName("rowActionQuiet"),
  "group flex h-11 w-full items-center justify-between rounded-[14px] bg-transparent px-0 text-left hover:bg-transparent",
].join(" ");

export function CompanyQuickActions({ actions }: { actions: CompanyQuickAction[] }) {
  const availableActions = actions.filter((action) => action.href);
  const primaryAction = availableActions.find((action) => action.id === "add-employee") ?? availableActions[0];
  const secondaryActions = availableActions.filter((action) => action.id !== primaryAction?.id);

  return (
    <div className="grid gap-3">
      {primaryAction?.href ? (
        <Link
          href={primaryAction.href}
          className={`${buttonClassName("primary")} h-10 w-full rounded-[14px] px-4 text-[13px] shadow-none`}
          aria-label={primaryAction.label}
        >
          {primaryAction.label}
        </Link>
      ) : null}

      {secondaryActions.length ? (
        <div className="grid gap-1.5">
          {secondaryActions.map((action) => {
            if (!action.href) return null;

            const content = (
              <>
                <span className="flex min-w-0 items-center gap-3">
                  <BrandIcon icon={brandIconForAction(action)} tone={brandToneForAction(action)} size="sm" className="size-7 rounded-[10px] bg-[var(--credo-bronze-soft)] text-[var(--credo-green-950)] [&_svg]:size-3.5" />
                  <span className="truncate text-[13px] font-medium text-[var(--credo-ink)]">{action.label}</span>
                </span>
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--credo-green-800)] transition-transform duration-[160ms] group-hover:translate-x-0.5" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="size-4" fill="none">
                    <path d="m6.25 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </>
            );

            return (
              <Link key={action.id} href={action.href} className={quickActionClassName} aria-label={action.label}>
                {content}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function brandIconForAction(action: CompanyQuickAction): BrandIconName {
  if (action.icon === "run") return "payroll";
  if (action.label.toLowerCase().includes("settings")) return "settings";
  if (action.label.toLowerCase().includes("document")) return "document";
  if (isEmployeeAction(action.label)) return "userPlus";
  return "plus";
}

function brandToneForAction(action: CompanyQuickAction): BrandTone {
  if (action.icon === "run") return "olive";
  if (isEmployeeAction(action.label)) return "sky";
  return "sand";
}

function isEmployeeAction(label: string) {
  return label.toLowerCase().includes("employee");
}
