import * as React from "react";
import { cn } from "@/lib/utils";

export type BrandTone = "olive" | "sky" | "peach" | "lavender" | "sand";
export type BrandIconName =
  | "activity"
  | "approve"
  | "building"
  | "check"
  | "compliance"
  | "document"
  | "insight"
  | "invoice"
  | "payroll"
  | "person"
  | "plus"
  | "profile"
  | "report"
  | "settings"
  | "tax"
  | "team"
  | "upload"
  | "userPlus";

const toneClass: Record<BrandTone, string> = {
  olive: "bg-[var(--brand-olive-bg)] text-[var(--brand-olive-fg)]",
  sky: "bg-[var(--brand-sky-bg)] text-[var(--brand-sky-fg)]",
  peach: "bg-[var(--brand-peach-bg)] text-[var(--brand-peach-fg)]",
  lavender: "bg-[var(--brand-lavender-bg)] text-[var(--brand-lavender-fg)]",
  sand: "bg-[var(--brand-sand-bg)] text-[var(--brand-sand-fg)]",
};

const iconSizeClass = {
  sm: "size-8 rounded-xl [&_svg]:size-4",
  md: "size-10 rounded-2xl [&_svg]:size-[18px]",
  lg: "size-12 rounded-2xl [&_svg]:size-5",
} as const;

type BrandIconProps = {
  icon: BrandIconName;
  tone?: BrandTone;
  size?: keyof typeof iconSizeClass;
  label?: string;
  className?: string;
};

export function BrandIcon({
  icon,
  tone = "sand",
  size = "md",
  label,
  className,
}: BrandIconProps) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center ring-1 ring-black/[0.025]",
        toneClass[tone],
        iconSizeClass[size],
        className
      )}
    >
      <BrandSvgIcon icon={icon} />
    </span>
  );
}

type EntityAvatarType = "company" | "employee" | "document" | "payroll" | "compliance" | "insight";

const entityTone: Record<EntityAvatarType, BrandTone> = {
  company: "olive",
  employee: "sky",
  document: "lavender",
  payroll: "olive",
  compliance: "olive",
  insight: "peach",
};

const entityIcon: Record<EntityAvatarType, BrandIconName> = {
  company: "building",
  employee: "person",
  document: "document",
  payroll: "payroll",
  compliance: "compliance",
  insight: "insight",
};

export function EntityAvatar({
  type,
  initials,
  name,
  tone,
  size = "md",
  className,
}: {
  type: EntityAvatarType;
  initials?: string;
  name?: string;
  tone?: BrandTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const resolvedInitials = initials || initialsFromName(name);
  const resolvedTone = tone ?? entityTone[type];
  const sizeClass = size === "lg" ? "size-14 text-[16px]" : size === "sm" ? "size-9 text-[12px]" : "size-11 text-[13px]";

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[0.02em] ring-1 ring-black/[0.025]",
        toneClass[resolvedTone],
        sizeClass,
        className
      )}
    >
      {resolvedInitials || <BrandSvgIcon icon={entityIcon[type]} />}
    </span>
  );
}

export function EmptyStateVisual({
  type = "onboarding",
  className,
}: {
  type?: "company" | "documents" | "employees" | "insights" | "onboarding" | "payroll" | "compliance" | "team";
  className?: string;
}) {
  const config = {
    company: { primary: "building", secondary: "compliance", primaryTone: "olive", secondaryTone: "lavender" },
    documents: { primary: "document", secondary: "tax", primaryTone: "olive", secondaryTone: "sand" },
    employees: { primary: "person", secondary: "profile", primaryTone: "olive", secondaryTone: "sky" },
    insights: { primary: "insight", secondary: "activity", primaryTone: "olive", secondaryTone: "lavender" },
    onboarding: { primary: "building", secondary: "person", primaryTone: "olive", secondaryTone: "sky" },
    payroll: { primary: "payroll", secondary: "check", primaryTone: "olive", secondaryTone: "sand" },
    compliance: { primary: "compliance", secondary: "check", primaryTone: "olive", secondaryTone: "sand" },
    // Keep Team distinct from payroll employees; replace the secondary icon with
    // a dedicated access/admin symbol when the internal icon set grows one.
    team: { primary: "team", secondary: "settings", primaryTone: "olive", secondaryTone: "sky" },
  }[type] as {
    primary: BrandIconName;
    secondary: BrandIconName;
    primaryTone: BrandTone;
    secondaryTone: BrandTone;
  };

  return (
    <div className={cn("mx-auto flex h-[112px] w-[156px] items-center justify-center", className)} aria-hidden>
      <div className="flex h-[96px] w-[140px] flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-3">
          <BrandIcon icon={config.primary} tone={config.primaryTone} size="lg" />
          <BrandIcon icon={config.secondary} tone={config.secondaryTone} size="sm" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="h-2 w-12 rounded-full bg-[var(--brand-border)]" />
          <span className="h-2 w-8 rounded-full bg-[var(--brand-border)]" />
        </div>
      </div>
    </div>
  );
}

export function StepIcon({
  icon,
  tone = "sand",
  label,
}: {
  icon: BrandIconName;
  tone?: BrandTone;
  label?: string;
}) {
  return <BrandIcon icon={icon} tone={tone} size="sm" label={label} />;
}

export function toneForPayrollStatus(status: "draft" | "completed") {
  return status === "completed" ? "olive" : "sand";
}

export function toneForDocumentRecord(typeId: string, hasEmployeeDocument: boolean): BrandTone {
  if (typeId === "tax-form") return "lavender";
  if (typeId === "payroll-run" || typeId === "pay-stub") return "sand";
  if (typeId === "letter" && hasEmployeeDocument) return "sky";
  return "sand";
}

export function iconForDocumentRecord(typeId: string, hasEmployeeDocument: boolean): BrandIconName {
  if (typeId === "tax-form") return "tax";
  if (typeId === "payroll-run" || typeId === "pay-stub") return "payroll";
  if (typeId === "letter" && hasEmployeeDocument) return "person";
  if (typeId === "letter") return "building";
  return "document";
}

function initialsFromName(name?: string) {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function BrandSvgIcon({ icon }: { icon: BrandIconName }) {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      {icon === "activity" ? <path d="M4 13.5h12M6 11V7m4 4V4.5m4 6.5V8" /> : null}
      {icon === "approve" ? <path d="M4.5 10h2.4l1.4 3 2.2-6 1.8 4h3.2" /> : null}
      {icon === "building" ? <path d="M4.5 16V5.5h7V16m0-7h4V16M7 8h2M7 11h2M6 16h9" /> : null}
      {icon === "check" ? <path d="m5.2 10.4 3.1 3.1 6.5-7" /> : null}
      {icon === "compliance" ? <path d="M10 3.5 15 5v4.2c0 3-1.8 5.5-5 7.3-3.2-1.8-5-4.3-5-7.3V5l5-1.5Zm-2.1 6.4 1.5 1.5 3-3.1" /> : null}
      {icon === "document" ? <path d="M5 3.5h7l3 3V16H5V3.5Zm7 0v3h3M7.5 10h5M7.5 13h4" /> : null}
      {icon === "insight" ? <path d="M5.5 13.5c0-2.1 1.5-3.2 2.4-4 .8-.7 1.1-1.1 1.1-2.1M10 16v-3.5M14.5 13.5c0-2.1-1.5-3.2-2.4-4-.8-.7-1.1-1.1-1.1-2.1M7 16h6" /> : null}
      {icon === "invoice" ? <path d="M5 3.5h8l2 2V16H5V3.5Zm8 0v3h2M7.5 10h5M7.5 13h5" /> : null}
      {icon === "payroll" ? <path d="M4 5h12v10H4V5Zm0 3h12M7 12h2.2M11.4 12H13" /> : null}
      {icon === "person" ? <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.5 16a5.5 5.5 0 0 1 11 0" /> : null}
      {icon === "plus" ? <path d="M10 5v10M5 10h10" /> : null}
      {icon === "profile" ? <path d="M6 4.5h8v11H6v-11Zm2.2 3h3.6M8.2 10h3.6M8.2 12.5h2.4" /> : null}
      {icon === "report" ? <path d="M5 15.5h10M7 13V9m3 4V6m3 7v-3" /> : null}
      {icon === "settings" ? <path d="M10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0-4v2m0 9v2m6-6h-2m-8 0H4m10.2-4.2-1.4 1.4M7.2 12.8l-1.4 1.4m8.4 0-1.4-1.4M7.2 7.2 5.8 5.8" /> : null}
      {icon === "tax" ? <path d="M5 4h10v12H5V4Zm2.4 3h5.2M7.4 10h5.2M7.4 13h2.2" /> : null}
      {icon === "team" ? <path d="M7 8.5a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Zm5.6.3a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8ZM3.7 16c.7-2.3 2.1-3.5 4.1-3.5s3.4 1.2 4.1 3.5m-1.6-1.8c.6-.8 1.4-1.2 2.5-1.2 1.4 0 2.4.8 3 2.5" /> : null}
      {icon === "upload" ? <path d="M10 13V5m0 0 3 3m-3-3L7 8M5 15h10" /> : null}
      {icon === "userPlus" ? <path d="M8.5 9.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM4 16c.7-2.3 2.2-3.5 4.5-3.5 1.1 0 2 .3 2.8.9M14.5 9v5M12 11.5h5" /> : null}
    </svg>
  );
}
