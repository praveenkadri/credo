import type { CompanyDetail } from "@/components/company-detail/company-detail-data";

export function CompanyBalanceSummary({ company }: { company: CompanyDetail }) {
  return (
    <section className="shell-enter shell-enter-delay-1 mt-4 pb-2">
      <div className="space-y-2">
        <p className="type-body-small text-neutral-600">{company.subtitle}</p>
        <p className="type-metric text-[56px] text-neutral-900 md:text-[64px]">
          {company.primaryValue}
        </p>
        <p className="type-body text-neutral-800">{company.primaryLabel}</p>
        <p className="type-body-small text-neutral-600">{company.preparedAt}</p>
        <p className="type-caption text-neutral-400">No unusual activity</p>
      </div>
    </section>
  );
}
