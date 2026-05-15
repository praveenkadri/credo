import type { Metadata } from "next";
import { FeatureRail } from "@/components/marketing/feature-rail";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { MarketingCTA } from "@/components/marketing/marketing-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ProductStripSection } from "@/components/marketing/product-strip-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { isAuthenticated } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Credo | Multi-company payroll, records, and documents",
  description: "A calm business operations workspace for multi-company payroll, employees, documents, and records.",
};

export default async function MarketingHomePage() {
  const workspaceHref = (await isAuthenticated()) ? routes.overview : routes.signup;

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--credo-bg)] text-[var(--text-primary)]">
      <MarketingNav workspaceHref={workspaceHref} />
      <HeroSection workspaceHref={workspaceHref} />
      <FeatureRail />
      <ProductStripSection />
      <HowItWorksSection />
      <TrustSection />
      <MarketingCTA workspaceHref={workspaceHref} />
      <MarketingFooter />
    </main>
  );
}
