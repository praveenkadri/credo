import { surfaceClass } from "@/components/ui/surface";
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
  const isError = noticeVariant === "error";

  return (
    <section className={cn(surfaceClass("chartSurface"), "shell-enter shell-enter-delay-2 px-6 py-5")}>
      <div className="max-w-[760px]">
        <p className="type-eyebrow text-[var(--credo-bronze-700)]">Net revenue</p>
        <h2 className="numeric-tabular mt-3 text-[42px] font-bold leading-[0.96] text-[var(--credo-ink)] md:text-[54px]">
          {isError ? "Workspace unavailable" : "$0.00"}
        </h2>
        <p className="mt-2.5 text-[14px] font-medium text-[var(--credo-muted)]">{title}</p>
      </div>
    </section>
  );
}
