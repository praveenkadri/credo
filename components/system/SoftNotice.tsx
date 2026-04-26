import Link from "next/link";
import { cn } from "@/lib/utils";
import { surfaceClass } from "@/components/ui/surface";

export type SoftNoticeVariant = "info" | "warning" | "error";

const NOTICE_STYLES: Record<SoftNoticeVariant, string> = {
  info: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-800",
  warning: "border border-amber-100/60 bg-amber-50/60 text-neutral-800",
  error: "border border-amber-200/60 bg-amber-50/55 text-neutral-800",
};

const ACCENT_STYLES: Record<SoftNoticeVariant, string> = {
  info: "before:bg-neutral-400/55",
  warning: "before:bg-amber-400/60",
  error: "before:bg-amber-500/55",
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
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between overflow-hidden px-3.5 py-2.5 before:absolute before:left-3 before:top-1/2 before:h-4 before:w-1 before:-translate-y-1/2 before:rounded-full",
        surfaceClass("subtleBanner"),
        NOTICE_STYLES[variant],
        ACCENT_STYLES[variant],
        className
      )}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <p className="pl-3 text-[12px] tracking-[-0.005em] text-neutral-800">
        <span className="font-medium text-neutral-900">{title}</span>
        {description ? <span className="text-neutral-600"> · {description}</span> : null}
      </p>
      {actionLabel || onDismiss ? (
        <div className="ml-4 flex items-center gap-2">
          {actionLabel ? (
            actionHref ? (
              <Link
                href={actionHref}
                className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-neutral-600 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-900"
              >
                {actionLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-neutral-600 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-900"
              >
                {actionLabel}
              </button>
            )
          ) : null}
          {onDismiss ? (
            <button
              type="button"
              aria-label={dismissLabel}
              onClick={onDismiss}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[13px] text-neutral-400 opacity-70 transition-[color,opacity] duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-600 hover:opacity-100"
            >
              ×
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
