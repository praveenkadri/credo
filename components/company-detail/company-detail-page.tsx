import type { CompanyActivityGroupData, CompanyDetail } from "@/components/company-detail/company-detail-data";
import { CompanyBalanceSummary } from "@/components/company-detail/company-balance-summary";
import { CompanyActivityList } from "@/components/company-detail/company-activity-list";
import { ClearCreateCompanyDraft } from "@/components/companies/setup/clear-create-company-draft";
import { SuccessToast } from "@/components/system/SuccessToast";

export function CompanyDetailPage({
  company,
  activityGroups,
  successToastMessage,
  clearCreateCompanyDraft = false,
}: {
  company: CompanyDetail;
  activityGroups: CompanyActivityGroupData[];
  successToastMessage?: string;
  clearCreateCompanyDraft?: boolean;
}) {
  return (
    <div className="w-full pb-12">
      <ClearCreateCompanyDraft shouldClear={clearCreateCompanyDraft} />
      <SuccessToast message={successToastMessage} />
      <CompanyBalanceSummary company={company} />
      <CompanyActivityList groups={activityGroups} />
    </div>
  );
}
