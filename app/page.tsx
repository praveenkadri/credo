import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { HeroSection } from "@/components/marketing/hero-section";
import { EditorialWordStack } from "@/components/marketing/editorial-word-stack";
import { FeatureBand } from "@/components/marketing/feature-band";
import { DecisionSurfaceSection } from "@/components/marketing/decision-surface-section";
import { AudienceCards } from "@/components/marketing/audience-cards";
import { FAQSection } from "@/components/marketing/faq-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-[#f6f6f2] text-neutral-900">
      <MarketingNav />

      <main>
        <HeroSection />
        <EditorialWordStack />

        <FeatureBand
          title="Built for operators managing more than one company."
          description="Switch between companies, check payroll readiness, track invoices, and surface actions that need attention without jumping across tools."
          points={[
            "Switch between companies in seconds",
            "See payroll readiness at a glance",
            "Track invoices and documents in one workspace",
            "Surface what needs attention next",
          ]}
          visualRows={[
            ["Aster Health Group", "Ready"],
            ["Northlake Services", "Needs review"],
            ["Ridgeview Partners", "Funding due"],
          ]}
        />

        <FeatureBand
          id="payroll"
          title="Move money and paperwork without the chaos."
          description="Run payroll, invoice clients, generate documents, and keep approvals in one calm flow designed for real operations work."
          points={[
            "Run payroll with clear review states",
            "Send invoices with consistent follow-through",
            "Generate documents from company data",
            "Track approvals across teams",
          ]}
          cards={[
            { title: "Run payroll", body: "Prepare and approve payroll with clear status signals." },
            { title: "Send invoices", body: "Create and send invoices from one structured workspace." },
            { title: "Generate documents", body: "Produce letters and reports without copy-paste workflows." },
            { title: "Track approvals", body: "Keep decisions moving with visible next actions." },
          ]}
        />

        <DecisionSurfaceSection />

        <section className="mx-auto mt-24 w-full max-w-[1180px] px-5 lg:px-7" id="compliance">
          <h2 className="text-[35px] font-semibold leading-[1.14] tracking-[-0.03em] text-neutral-950 sm:text-[44px]">
            Built for small business confidence.
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Calm financial workflows",
              "Multi-company support",
              "Payroll-ready data",
              "Document and tax visibility",
            ].map((item) => (
              <li key={item} className="rounded-2xl bg-white/65 px-4 py-3 text-[15px] text-neutral-700 ring-1 ring-neutral-200/50">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <AudienceCards />
        <FAQSection />

        <section className="mx-auto mt-24 w-full max-w-[980px] px-5 text-center lg:px-7" id="pricing">
          <h2 className="text-[38px] font-semibold tracking-[-0.035em] text-neutral-950 sm:text-[52px]">
            Start with one company. Scale when you&apos;re ready.
          </h2>
          <div className="mt-8">
            <Link href={routes.firstCompanySetup()} className={buttonClassName("primary")}>
              Create your workspace
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
