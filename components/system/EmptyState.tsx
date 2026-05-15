import Link from "next/link";
import type * as React from "react";
import { EmptyStateVisual } from "@/components/brand/brand-visuals";
import { SoftNotice, type SoftNoticeVariant } from "@/components/system/SoftNotice";
import { buttonClassName } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = "warning",
  visualType,
  className,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: SoftNoticeVariant;
  visualType?: React.ComponentProps<typeof EmptyStateVisual>["type"];
  className?: string;
}) {
  return (
    <div className={cn("rounded-[24px] bg-white px-6 py-5 shadow-[0_18px_60px_rgba(31,34,28,0.06)]", className)}>
      {visualType ? <EmptyStateVisual type={visualType} className="mb-2" /> : null}
      <SoftNotice title={title} description={description} variant={variant} />
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className={`mt-4 ${buttonClassName("primary")}`}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
