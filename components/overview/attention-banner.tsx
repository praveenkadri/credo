"use client";

import { motionClass } from "@/components/ui/motion";
import { surfaceClass } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

export type BannerVariant = "neutral" | "attention" | "critical";

const BANNER_STYLES: Record<BannerVariant, string> = {
  neutral: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
  attention: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
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
  return (
    <div
      className={cn(
        "banner-enter flex w-full items-center justify-between overflow-hidden px-3.5 py-2.5",
        motionClass.bannerLifecycle,
        exiting ? "mb-0 max-h-0 -translate-y-1 opacity-0 py-0" : "mb-3 max-h-14 translate-y-0 opacity-100",
        surfaceClass("subtleBanner"),
        BANNER_STYLES[variant]
      )}
      role="status"
      aria-live="polite"
    >
      <p className="text-[12px] font-medium tracking-[-0.005em]">{message}</p>
      <div className="ml-4 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-neutral-600 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-800"
        >
          View
        </button>
        <button
          type="button"
          aria-label="Dismiss attention banner"
          onClick={onDismiss}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[13px] text-neutral-500 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-700"
        >
          ×
        </button>
      </div>
    </div>
  );
}
