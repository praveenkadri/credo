import Link from "next/link";
import { BrandIcon, type BrandIconName, type BrandTone } from "@/components/brand/brand-visuals";
import { buttonClassName } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";

export type PreviewModule = {
  title: string;
  description: string;
  icon: BrandIconName;
  tone?: BrandTone;
  meta?: string;
};

export type ReadinessItem = {
  label: string;
  detail: string;
  status: string;
  done?: boolean;
  href?: string;
};

export function EmptyStateHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-[680px]">
        <p className="type-eyebrow text-neutral-400">{eyebrow}</p>
        <h2 className="type-card-title mt-2 text-[#1f221c]">{title}</h2>
        <p className="type-body mt-2 text-neutral-600">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className={`${buttonClassName("secondary")} shrink-0`}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function PreviewModuleGrid({
  items,
  className,
}: {
  items: PreviewModule[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-2", className)}>
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-[20px] bg-white/62 p-4 shadow-[inset_0_0_0_1px_rgba(31,34,28,0.045)]"
        >
          <div className="flex items-start gap-3">
            <BrandIcon icon={item.icon} tone={item.tone ?? "olive"} size="sm" />
            <div className="min-w-0">
              {item.meta ? <p className="type-caption mb-1 text-neutral-400">{item.meta}</p> : null}
              <h3 className="type-body-strong text-[#1f221c]">{item.title}</h3>
              <p className="type-body-small mt-1 text-neutral-600">{item.description}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ReadinessList({
  items,
  className,
}: {
  items: ReadinessItem[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[22px] bg-white/68 shadow-[inset_0_0_0_1px_rgba(31,34,28,0.045)]", className)}>
      {items.map((item, index) => {
        const content = (
          <>
            <span
              className={cn(
                "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                item.done
                  ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                  : "bg-[#f1f2ef] text-[#7a7f76]"
              )}
              aria-hidden
            >
              {item.done ? "OK" : String(index + 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="type-body-strong block text-[#1f221c]">{item.label}</span>
              <span className="type-body-small mt-1 block text-neutral-600">{item.detail}</span>
            </span>
            <span className="type-caption shrink-0 rounded-full bg-[#f3f4ef] px-2.5 py-1 font-medium text-[#6e736b]">
              {item.status}
            </span>
          </>
        );

        const className = cn(
          "flex gap-3 px-4 py-3.5 text-left transition-colors duration-[160ms] hover:bg-white/72",
          index > 0 && "border-t border-black/[0.04]"
        );

        return item.href ? (
          <Link key={item.label} href={item.href} className={className}>
            {content}
          </Link>
        ) : (
          <div key={item.label} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
