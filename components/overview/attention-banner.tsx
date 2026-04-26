"use client";

import { motionClass } from "@/components/ui/motion";
import { SoftNotice } from "@/components/system/SoftNotice";

export type BannerVariant = "neutral" | "attention" | "critical";

export function AttentionBanner({
  message,
  variant = "attention",
  exiting = false,
  onDismiss,
  actionLabel = "View",
  actionHref,
}: {
  message: string;
  variant?: BannerVariant;
  exiting?: boolean;
  onDismiss: () => void;
  actionLabel?: string;
  actionHref?: string;
}) {
  const [lead, rest] = message.split("·").map((part) => part.trim());
  const variantByBannerVariant: Record<BannerVariant, "info" | "warning" | "error"> = {
    neutral: "info",
    attention: "warning",
    critical: "error",
  };

  return (
    <SoftNotice
      title={lead}
      description={rest}
      variant={variantByBannerVariant[variant]}
      onDismiss={onDismiss}
      actionLabel={actionLabel}
      onAction={!actionHref ? () => undefined : undefined}
      actionHref={actionHref}
      dismissLabel="Dismiss attention banner"
      className={[
        "banner-enter",
        motionClass.bannerLifecycle,
        exiting ? "mb-0 max-h-0 -translate-y-1 opacity-0 py-0" : "mb-3 max-h-14 translate-y-0 opacity-100",
      ].join(" ")}
    />
  );
}
