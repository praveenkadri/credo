import { CompanyDetailHeader } from "@/components/company-detail/company-detail-header";
import { CompanyBalanceSummary } from "@/components/company-detail/company-balance-summary";
import { CompanyActivityList } from "@/components/company-detail/company-activity-list";
import { getCompanyDetailPageData } from "@/components/company-detail/company-detail-data";

export function CompanyDetailPage({ companyId }: { companyId: string }) {
  const { companyDetail, activityGroups, companyInfo } = getCompanyDetailPageData(companyId);

  return (
    <div className="w-full pb-12">
      <div className="shell-enter mb-4 flex w-full items-center justify-between overflow-hidden rounded-lg border border-amber-100/60 bg-amber-50/60 px-3.5 py-2.5 text-neutral-800">
        <p className="pl-3 text-[12px] tracking-[-0.005em]">
          <span className="font-medium text-neutral-900">Funding window closes tomorrow</span>
          <span className="text-neutral-600"> · Confirm payroll funding by 4:00 PM</span>
        </p>
      </div>

      <CompanyDetailHeader company={companyDetail} />
      <CompanyBalanceSummary company={companyDetail} />
      <CompanyActivityList groups={activityGroups} />

      <section className="shell-enter shell-enter-delay-3 mt-12">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1f221c]">Company info</h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {companyInfo.map((label) => (
            <button
              key={label}
              type="button"
              className="inline-flex h-9 items-center rounded-full bg-white/55 px-3.5 text-[12px] font-medium text-neutral-700 ring-1 ring-neutral-200/50 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/70 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40"
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
