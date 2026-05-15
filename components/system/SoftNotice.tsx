import Link from "next/link";
import { cn } from "@/lib/utils";
import { surfaceClass } from "@/components/ui/surface";
import { buttonClassName } from "@/components/ui-primitives/button";

export type SoftNoticeVariant = "info" | "warning" | "brand" | "error";

const NOTICE_STYLES: Record<SoftNoticeVariant, string> = {
  info: "bg-[var(--credo-cream-muted)] text-[var(--credo-ink)]",
  warning: "bg-[var(--credo-bronze-pale)] text-[var(--credo-ink)] ring-1 ring-[var(--credo-taupe-strong)]",
  brand: "bg-[var(--credo-bronze-pale)] text-[var(--credo-ink)] ring-1 ring-[rgba(216,203,185,0.82)]",
  error: "bg-[#f6eceb] text-neutral-800",
};

const ACCENT_STYLES: Record<SoftNoticeVariant, string> = {
  info: "before:bg-[var(--credo-green-800)]/75",
  warning: "before:bg-[var(--credo-bronze)]",
  brand: "before:bg-[var(--credo-bronze)]",
  error: "before:bg-red-600/70",
};

export function SoftNotice({
  title,
  description,
  variant = "info",
  actionLabel,
  actionHref,
  onAction,
  onDismiss,
  dismissLabel = "Dismiss notice",
  className,
  actionStyle = "filled",
}: {
  title: string;
  description?: string;
  variant?: SoftNoticeVariant;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
  actionStyle?: "filled" | "text";
}) {
  const renderedActionLabel = actionStyle === "text" ? `${actionLabel} →` : actionLabel;
  const actionClassName =
    actionStyle === "text"
      ? "inline-flex h-[26px] items-center justify-center rounded-[8px] px-1 text-[13px] font-semibold leading-none text-[var(--credo-green-800)] transition-colors duration-[160ms] hover:text-[var(--credo-green-950)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(21,90,67,0.18)]"
      : `${buttonClassName("noticeAction")} h-[26px] rounded-[10px] px-3 text-[13px]`;

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between overflow-hidden px-4 py-2.5 before:absolute before:left-4 before:top-1/2 before:h-5 before:w-[2px] before:-translate-y-1/2 before:rounded-full",
        surfaceClass("subtleBanner"),
        NOTICE_STYLES[variant],
        ACCENT_STYLES[variant],
        className
      )}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <p className="pl-4 text-[12px] leading-[1.35] text-[var(--credo-ink)]">
        <span className="font-semibold text-[var(--credo-ink)]">{title}</span>
        {description ? <span className="text-[var(--credo-muted)]"> · {description}</span> : null}
      </p>
      {actionLabel || onDismiss ? (
        <div className="ml-4 flex items-center gap-2">
          {actionLabel ? (
            actionHref ? (
              <Link
                href={actionHref}
                className={actionClassName}
              >
                {renderedActionLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className={actionClassName}
              >
                {renderedActionLabel}
              </button>
            )
          ) : null}
          {onDismiss ? (
            <button
              type="button"
              aria-label={dismissLabel}
              onClick={onDismiss}
              className={`${buttonClassName("noticeDismiss")} size-7 text-[13px] opacity-70 hover:opacity-100`}
            >
              <span aria-hidden="true">×</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
