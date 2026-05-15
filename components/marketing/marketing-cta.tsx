import Link from "next/link";
import { MARKETING_SHELL, MARKETING_STYLE } from "@/components/marketing/marketing-layout";
import { routes } from "@/lib/routes";

type MarketingCTAProps = {
  workspaceHref: string;
};

export function MarketingCTA({ workspaceHref }: MarketingCTAProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--credo-green-900)] py-18 text-white md:py-24" id="start">
      <div
        className="pointer-events-none absolute right-[8%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[rgba(239,229,213,0.08)] blur-[76px]"
        aria-hidden="true"
      />
      <div className={`${MARKETING_SHELL.container} relative`}>
        <div
          className="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[rgba(184,135,79,0.055)] blur-[64px]"
          aria-hidden="true"
        />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,720px)_minmax(260px,340px)] lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-[720px]">
            <p className={MARKETING_STYLE.eyebrowOnDark}>Start with clarity</p>
            <h2 className="mt-3 text-[36px] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--marketing-cream)] sm:text-[48px]">
              Run every company from one calm workspace.
            </h2>
            <p className="mt-4 max-w-[560px] text-[16px] font-medium leading-7 text-white/[0.72]">
              Create your Credo account and bring companies, payroll, people, and documents into one organized system.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-self-start">
            <Link href={workspaceHref} className={MARKETING_STYLE.primaryCtaOnDark}>
              Create account
            </Link>
            <Link href={routes.login} className={MARKETING_STYLE.secondaryCtaOnDark}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
