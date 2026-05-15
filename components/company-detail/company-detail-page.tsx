import type { CompanyActivityGroupData, CompanyDetail } from "@/components/company-detail/company-detail-data";
import { CompanyBalanceSummary } from "@/components/company-detail/company-balance-summary";
import { CompanyActivityList } from "@/components/company-detail/company-activity-list";
import { CompanyEmployeesSection } from "@/components/company-detail/company-employees-section";
import { getCompanyNextSteps } from "@/components/company-detail/company-setup-progress";
import { ClearCreateCompanyDraft } from "@/components/companies/setup/clear-create-company-draft";
import { SuccessToast } from "@/components/system/SuccessToast";
import type { CompanySetupPrimaryPrompt, CompanyWorkspaceSummary } from "@/lib/data/companies";

export function CompanyDetailPage({
  company,
  activityGroups,
  setupPrompt,
  payrollDetailsComplete,
  workspaceSummary,
  successToastMessage,
  clearCreateCompanyDraft = false,
}: {
  company: CompanyDetail;
  activityGroups: CompanyActivityGroupData[];
  setupPrompt?: CompanySetupPrimaryPrompt;
  payrollDetailsComplete: boolean;
  workspaceSummary: CompanyWorkspaceSummary;
  successToastMessage?: string;
  clearCreateCompanyDraft?: boolean;
}) {
  const nextSteps = getCompanyNextSteps({
    companyId: company.id,
    payrollDetailsComplete,
    setupPrompt,
    workspaceSummary,
  });

  return (
    <div className="w-full pb-12">
      <ClearCreateCompanyDraft shouldClear={clearCreateCompanyDraft} />
      <SuccessToast message={successToastMessage} />
      <CompanyBalanceSummary company={company} nextSteps={nextSteps} />
      <CompanyActivityList groups={activityGroups} />
      <CompanyEmployeesSection companyId={company.id} />
    </div>
  );
}
