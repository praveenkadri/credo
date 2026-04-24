import { RightRailCard } from "@/components/overview/right-rail-card";
import {
  getCompanyDetailPageData,
  type CompanyQuickAction,
  type DirectDepositField,
  type RightRailAction,
} from "@/components/company-detail/company-detail-data";
import { CompanyQuickActions } from "@/components/company-detail/company-quick-actions";
import { CompanyActionMenu } from "@/components/company-detail/company-action-menu";
import { DirectDepositInfoCard } from "@/components/company-detail/direct-deposit-info-card";

export function CompanyRightRail({
  quickActions,
  rightRailActions,
  directDepositFields,
}: {
  quickActions: CompanyQuickAction[];
  rightRailActions: RightRailAction[];
  directDepositFields: DirectDepositField[];
}) {
  return (
    <aside className="hidden xl:flex xl:w-[clamp(340px,24vw,414px)] xl:shrink-0 xl:flex-col">
      <div className="sticky top-3 flex flex-col gap-4 px-2 pb-4 pt-0">
        <RightRailCard title="Quick actions" eyebrow="Company" tone="soft" className="shell-enter">
          <CompanyQuickActions actions={quickActions} />
        </RightRailCard>

        <RightRailCard
          title="Company actions"
          eyebrow="Menu"
          tone="inset"
          className="shell-enter shell-enter-delay-1"
        >
          <CompanyActionMenu actions={rightRailActions} />
        </RightRailCard>

        <RightRailCard
          title="Direct deposit info"
          eyebrow="Identifiers"
          tone="soft"
          className="shell-enter shell-enter-delay-2"
        >
          <DirectDepositInfoCard fields={directDepositFields} />
        </RightRailCard>
      </div>
    </aside>
  );
}

export function CompanyRightRailForId({ companyId }: { companyId: string }) {
  const { quickActions, rightRailActions, directDepositFields } = getCompanyDetailPageData(companyId);

  return (
    <CompanyRightRail
      quickActions={quickActions}
      rightRailActions={rightRailActions}
      directDepositFields={directDepositFields}
    />
  );
}
