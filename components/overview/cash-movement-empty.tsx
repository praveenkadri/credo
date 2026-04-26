import { surfaceClass } from "@/components/ui/surface";
import { EmptyState } from "@/components/system/EmptyState";
import { type SoftNoticeVariant } from "@/components/system/SoftNotice";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function CashMovementEmpty({
  ctaHref = routes.firstCompanySetup(),
  title = "No company activity yet",
  description = "Add a company to start tracking payroll, invoices, and activity.",
  ctaLabel = "Add company",
  noticeVariant = "warning",
}: {
  ctaHref?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  noticeVariant?: SoftNoticeVariant;
}) {
  return (
    <section className={cn(surfaceClass("chartSurface"), "shell-enter shell-enter-delay-2 px-5 py-4")}>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#93988f]">Cash movement</p>
        <h2 className="mt-2 text-[36px] font-medium leading-none tracking-[-0.04em] text-neutral-900">{title}</h2>
      </div>

      <div className="mt-3 h-[280px]">
        <EmptyState
          title={title}
          description={description}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          variant={noticeVariant}
          className="flex h-full flex-col justify-center text-center"
        />
      </div>
    </section>
  );
}
