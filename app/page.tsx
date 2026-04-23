"use client";

import { useEffect, useState } from "react";
import { AttentionBanner } from "@/components/overview/attention-banner";
import { CashMovementChart } from "@/components/overview/cash-movement-chart";
import { CompanyAccountList } from "@/components/overview/company-account-list";
import { attentionBanner, cashMovementChart, companies } from "@/components/overview/overview-data";

export default function HomePage() {
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

  return (
    <div className="w-full pb-12">
      {!bannerDismissed ? (
        <AttentionBanner
          message={attentionBanner.message}
          variant={attentionBanner.variant}
          exiting={bannerExiting}
          onDismiss={dismissBanner}
        />
      ) : null}

      <section className="pb-10">
        <CashMovementChart {...cashMovementChart} />
        <CompanyAccountList companies={companies} />
      </section>
    </div>
  );
}
