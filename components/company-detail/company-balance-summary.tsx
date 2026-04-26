import type { CompanyDetail } from "@/components/company-detail/company-detail-data";

export function CompanyBalanceSummary({ company }: { company: CompanyDetail }) {
  return (
    <section className="shell-enter shell-enter-delay-1 mt-4 pb-2">
      <div className="space-y-2">
        <p className="text-[13px] text-neutral-600">{company.subtitle}</p>
        <p className="text-[56px] font-semibold leading-[0.98] tracking-[-0.045em] text-neutral-900 md:text-[64px]">
          {company.primaryValue}
        </p>
        <p className="text-[15px] font-medium text-neutral-800">{company.primaryLabel}</p>
        <p className="text-[13px] text-neutral-600">{company.preparedAt}</p>
        <p className="text-xs text-neutral-400">No unusual activity</p>
      </div>
    </section>
  );
}
