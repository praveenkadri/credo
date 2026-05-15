import type { CompanyDetail } from "@/components/company-detail/company-detail-data";
import type { CompanyNextStep } from "@/components/company-detail/company-setup-progress";
import { getCompanySetupCompletion } from "@/components/company-detail/company-setup-progress";

export function CompanyBalanceSummary({
  company,
  nextSteps,
}: {
  company: CompanyDetail;
  nextSteps: CompanyNextStep[];
}) {
  const completion = getCompanySetupCompletion(nextSteps);

  return (
    <section className="shell-enter pb-5 pt-3 md:pb-7 md:pt-5">
      <div className="max-w-[720px]">
        <p className="text-[12px] font-medium leading-tight text-[var(--credo-muted-strong)]">Payroll workspace</p>
        <p className="numeric-tabular mt-4 text-[44px] font-semibold leading-[1] tracking-[-0.025em] text-[var(--credo-ink)] md:text-[54px]">
          {company.primaryValue}
        </p>
        <p className="mt-4 text-[15px] font-medium leading-[1.45] text-[var(--credo-muted-strong)]">
          {company.primaryLabel}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium leading-none text-[var(--credo-muted)]">
          <span className="rounded-full bg-[var(--credo-bronze-soft)] px-3 py-1.5 text-[var(--credo-green-950)]">
            {completion.complete} of {completion.total} complete
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--credo-taupe-strong)] sm:inline-block" aria-hidden="true" />
          <span>{company.preparedAt}</span>
          {company.status ? (
            <>
              <span className="hidden h-1 w-1 rounded-full bg-[var(--credo-taupe-strong)] sm:inline-block" aria-hidden="true" />
              <span className="text-[var(--credo-green-800)]">{company.status}</span>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
