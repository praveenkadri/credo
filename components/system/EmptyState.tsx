import Link from "next/link";
import { SoftNotice, type SoftNoticeVariant } from "@/components/system/SoftNotice";
import { buttonClassName } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = "warning",
  className,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: SoftNoticeVariant;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl bg-neutral-100/60 px-6 py-5", className)}>
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
