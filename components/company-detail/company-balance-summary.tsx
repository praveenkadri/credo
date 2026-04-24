import type { CompanyDetail } from "@/components/company-detail/company-detail-data";

export function CompanyBalanceSummary({ company }: { company: CompanyDetail }) {
  return (
    <section className="shell-enter shell-enter-delay-1 mt-8 pb-2">
      <p className="text-[56px] font-semibold leading-[0.98] tracking-[-0.045em] text-[#1f221c] md:text-[64px]">
        {company.primaryValue}
      </p>
      <p className="mt-4 text-[15px] font-medium text-neutral-700">{company.primaryLabel}</p>
      <p className="mt-1 text-[13px] text-neutral-600">{company.preparedAt}</p>
      <p className="mt-2 text-[12px] text-neutral-500">{company.runSignal}</p>
    </section>
  );
}
