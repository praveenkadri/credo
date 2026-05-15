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
  actionStyle = "filled",
  actionHref,
}: {
  message: string;
  variant?: BannerVariant;
  exiting?: boolean;
  onDismiss: () => void;
  actionLabel?: string;
  actionStyle?: "filled" | "text";
  actionHref?: string;
}) {
  const [lead, rest] = message.split("·").map((part) => part.trim());
  const variantByBannerVariant: Record<BannerVariant, "info" | "brand" | "warning" | "error"> = {
    neutral: "brand",
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
      actionStyle={actionStyle}
      onAction={!actionHref ? () => undefined : undefined}
      actionHref={actionHref}
      dismissLabel="Dismiss attention banner"
      className={[
        "banner-enter mt-4 shadow-none",
        motionClass.bannerLifecycle,
        exiting ? "mb-0 max-h-0 -translate-y-1 opacity-0 py-0" : "mb-4 max-h-14 translate-y-0 opacity-100",
      ].join(" ")}
    />
  );
}
