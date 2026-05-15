import Link from "next/link";
import { HeroPreviewCard } from "@/components/marketing/hero-preview-card";
import { MARKETING_SHELL, MARKETING_STYLE } from "@/components/marketing/marketing-layout";
import { routes } from "@/lib/routes";

type HeroSectionProps = {
  workspaceHref: string;
};

export function HeroSection({ workspaceHref }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--credo-green-900)] text-white">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(16,47,36,0),rgba(239,229,213,0.16))]"
        aria-hidden="true"
      />
      <div className={`${MARKETING_SHELL.container} ${MARKETING_SHELL.heroSpacing}`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(390px,0.78fr)] lg:items-center xl:gap-12">
          <div className="relative z-10 max-w-[720px]">
            <p className={MARKETING_STYLE.eyebrowOnDark}>
              Multi-company payroll &amp; operations
            </p>

            <h1 className="mt-5 max-w-[730px] text-[42px] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--marketing-cream)] sm:text-[56px] lg:text-[64px]">
              A calmer way to manage payroll, documents, and companies.
            </h1>
            <p className="mt-6 max-w-[610px] text-[16px] font-medium leading-[1.7] text-white/72 sm:text-[17px]">
              Credo brings companies, employees, payroll, records, and documents into one clean workspace so every
              business stays organized without another spreadsheet.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={workspaceHref} className={MARKETING_STYLE.primaryCtaOnDark}>
                Create account
              </Link>
              <Link href={routes.login} className={MARKETING_STYLE.secondaryCtaOnDark}>
                Sign in
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Multi-company ready", "Payroll workspace", "Private records"].map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] font-semibold text-white/72 ring-1 ring-white/[0.1]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 justify-self-center lg:justify-self-end">
            <HeroPreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}
