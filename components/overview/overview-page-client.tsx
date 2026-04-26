"use client";

import { useEffect, useState } from "react";
import { AttentionBanner } from "@/components/overview/attention-banner";
import { CashMovementChart } from "@/components/overview/cash-movement-chart";
import { CashMovementEmpty } from "@/components/overview/cash-movement-empty";
import { CashMovementNoActivity } from "@/components/overview/cash-movement-no-activity";
import { CompanyAccountList } from "@/components/overview/company-account-list";
import { attentionBanner, cashMovementChart } from "@/components/overview/overview-data";
import { SuccessToast } from "@/components/system/SuccessToast";
import type { CompanySetupPrimaryPrompt } from "@/lib/data/companies";
import type { OverviewCompany } from "@/lib/data/companies";
import { routes } from "@/lib/routes";

export function OverviewPageClient({
  companies,
  isEmpty = false,
  isError = false,
  showCompaniesSection = true,
  setupPrompt,
  successToastMessage,
}: {
  companies: OverviewCompany[];
  isEmpty?: boolean;
  isError?: boolean;
  showCompaniesSection?: boolean;
  setupPrompt?: CompanySetupPrimaryPrompt;
  successToastMessage?: string;
}) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [bannerExiting, setBannerExiting] = useState(false);

  useEffect(() => {
    if (!bannerExiting) return;
    const timer = setTimeout(() => {
      setBannerDismissed(true);
      setBannerExiting(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [bannerExiting]);

  const dismissBanner = () => {
    setBannerExiting(true);
  };

  const shouldShowBanner = !isEmpty && !bannerDismissed;
  const bannerMessage = setupPrompt
    ? `${setupPrompt.title} · ${setupPrompt.description}`
    : attentionBanner.message;
  const isZeroActivityState =
    !isEmpty && companies.length > 0 && companies.every((company) => company.lastActivity === "No activity yet");

  return (
    <div className="w-full pb-12">
      <SuccessToast message={successToastMessage} />
      {shouldShowBanner ? (
        <AttentionBanner
          message={bannerMessage}
          variant={setupPrompt ? "neutral" : attentionBanner.variant}
          exiting={bannerExiting}
          onDismiss={dismissBanner}
          actionLabel={setupPrompt?.cta ?? "View"}
          actionHref={setupPrompt?.href}
        />
      ) : null}

      <section className="pb-10">
        {isEmpty ? (
          <CashMovementEmpty
            ctaHref={isError ? routes.overview : routes.firstCompanySetup()}
            title={isError ? "We couldn’t load company data" : "No company activity yet"}
            description={
              isError
                ? "Try again to reload your workspace data."
                : "Add a company to start tracking payroll, invoices, and activity."
            }
            ctaLabel={isError ? "Try again" : "Add company"}
            noticeVariant={isError ? "error" : "warning"}
          />
        ) : isZeroActivityState ? (
          <CashMovementNoActivity />
        ) : (
          <CashMovementChart {...cashMovementChart} />
        )}
        {showCompaniesSection ? <CompanyAccountList companies={companies} /> : null}
      </section>
    </div>
  );
}
