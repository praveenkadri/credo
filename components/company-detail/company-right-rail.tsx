"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { getCompanyById, getCompanyProfile, getCompanySetupPrompts, type CompanySetupPrimaryPrompt } from "@/lib/data/companies";
import { routes } from "@/lib/routes";
import { buttonClassName } from "@/components/ui-primitives/button";
import { useContent } from "@/lib/useContent";

type CompanySetupCardPrompt = {
  href: string;
};

export function CompanyRightRail({
  companyId,
  quickActions,
  rightRailActions,
  directDepositFields,
  setupPrompt,
  showFundingDueCard = false,
}: {
  companyId: string;
  quickActions: CompanyQuickAction[];
  rightRailActions: RightRailAction[];
  directDepositFields: DirectDepositField[];
  setupPrompt?: CompanySetupCardPrompt;
  showFundingDueCard?: boolean;
}) {
  const c = useContent();
  return (
    <div className="flex flex-col">
      <div className="sticky top-6 flex flex-col gap-4 pb-4">
        <RightRailCard
          title={c.company.setup.quickActionsTitle}
          eyebrow={c.company.setup.quickActionsEyebrow}
          tone="soft"
          className="shell-enter"
        >
          <CompanyQuickActions actions={quickActions} />
        </RightRailCard>

        <RightRailCard
          title={c.company.setup.actionsTitle}
          eyebrow={c.company.setup.actionsEyebrow}
          tone="inset"
          className="shell-enter shell-enter-delay-1"
        >
          <CompanyActionMenu actions={rightRailActions} />
        </RightRailCard>

        {setupPrompt ? (
          <RightRailCard
            title={c.company.setup.completeSetupTitle}
            eyebrow={c.company.setup.completeSetupEyebrow}
            tone="soft"
            className="shell-enter shell-enter-delay-2"
          >
            <div className="space-y-3">
              <p className="type-body-small text-neutral-600">
                {c.company.setup.completeSetupDescription}
              </p>
              <Link
                href={setupPrompt.href}
                className={buttonClassName("secondary")}
              >
                {c.company.setup.completeSetupButton}
              </Link>
            </div>
          </RightRailCard>
        ) : null}

        {showFundingDueCard ? (
          <RightRailCard
            title={c.company.setup.fundingDueTitle}
            eyebrow={c.company.setup.fundingDueEyebrow}
            tone="inset"
            className="shell-enter shell-enter-delay-2"
          >
            <p className="type-body-small text-neutral-600">{c.company.setup.fundingDueDescription}</p>
          </RightRailCard>
        ) : null}

        <RightRailCard
          title={c.company.setup.directDepositTitle}
          eyebrow={c.company.setup.directDepositEyebrow}
          tone="soft"
          className="shell-enter shell-enter-delay-3"
        >
          <DirectDepositInfoCard fields={directDepositFields} />
        </RightRailCard>

        <RightRailCard
          title={c.company.dangerZone.title}
          eyebrow={c.company.dangerZone.label}
          tone="inset"
          className="shell-enter shell-enter-delay-4"
        >
          <div className="space-y-3">
            <p className="type-caption text-neutral-500">
              {c.company.dangerZone.description}
            </p>
            <Link
              href={routes.companyDelete(companyId)}
              className={buttonClassName("outline")}
            >
              {c.company.dangerZone.cta}
            </Link>
          </div>
        </RightRailCard>
      </div>
    </div>
  );
}

export function CompanyRightRailForId({ companyId }: { companyId: string }) {
  const { quickActions, rightRailActions, directDepositFields } = getCompanyDetailPageData(companyId);
  const [setupPrompt, setSetupPrompt] = useState<CompanySetupCardPrompt | undefined>(undefined);
  const [showFundingDueCard, setShowFundingDueCard] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([getCompanyById(companyId), getCompanyProfile(companyId)])
      .then(([company, profile]) => {
        if (!active) return;

        setShowFundingDueCard(company?.status === "Funding due");

        const primaryPrompt: CompanySetupPrimaryPrompt | undefined = profile
          ? getCompanySetupPrompts(profile).primaryPrompt
          : undefined;

        if (!primaryPrompt) {
          setSetupPrompt(undefined);
          return;
        }

        setSetupPrompt({
          href: primaryPrompt.href,
        });
      })
      .catch(() => {
        if (!active) return;
        setSetupPrompt(undefined);
        setShowFundingDueCard(false);
      });

    return () => {
      active = false;
    };
  }, [companyId]);

  return (
    <CompanyRightRail
      companyId={companyId}
      quickActions={quickActions}
      rightRailActions={rightRailActions}
      directDepositFields={directDepositFields}
      setupPrompt={setupPrompt}
      showFundingDueCard={showFundingDueCard}
    />
  );
}
