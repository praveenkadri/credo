"use client";

import { motionClass } from "@/components/ui/motion";
import { surfaceClass } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

export type BannerVariant = "neutral" | "attention" | "critical";

const BANNER_STYLES: Record<BannerVariant, string> = {
  neutral: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-800",
  attention: "border border-amber-100/60 bg-amber-50/60 text-neutral-800",
  critical: "border border-red-100/70 bg-red-50/60 text-neutral-700",
};

export function AttentionBanner({
  message,
  variant = "attention",
  exiting = false,
  onDismiss,
}: {
  message: string;
  variant?: BannerVariant;
  exiting?: boolean;
  onDismiss: () => void;
}) {
  const [lead, rest] = message.split("·").map((part) => part.trim());

  return (
    <div
      className={cn(
        "banner-enter relative flex w-full items-center justify-between overflow-hidden px-3.5 py-2.5 before:absolute before:left-3 before:top-1/2 before:h-4 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-amber-400/60",
        motionClass.bannerLifecycle,
        exiting ? "mb-0 max-h-0 -translate-y-1 opacity-0 py-0" : "mb-3 max-h-14 translate-y-0 opacity-100",
        surfaceClass("subtleBanner"),
        BANNER_STYLES[variant]
      )}
      role="status"
      aria-live="polite"
    >
      <p className="pl-3 text-[12px] tracking-[-0.005em] text-neutral-800">
        <span className="font-medium text-neutral-900">{lead}</span>
        {rest ? <span className="text-neutral-600"> · {rest}</span> : null}
      </p>
      <div className="ml-4 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-neutral-600 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-amber-700"
        >
          View
        </button>
        <button
          type="button"
          aria-label="Dismiss attention banner"
          onClick={onDismiss}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[13px] text-neutral-400 opacity-70 transition-[color,opacity] duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-600 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
