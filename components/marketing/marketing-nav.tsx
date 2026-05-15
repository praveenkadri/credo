import Link from "next/link";
import { MARKETING_SHELL, MARKETING_STYLE } from "@/components/marketing/marketing-layout";
import { routes } from "@/lib/routes";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Why Credo", href: "#trust" },
];

type MarketingNavProps = {
  workspaceHref: string;
};

export function MarketingNav({ workspaceHref }: MarketingNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--marketing-border)] bg-[rgba(251,250,244,0.92)] backdrop-blur-xl">
      <nav className={`${MARKETING_SHELL.container} flex h-16 items-center justify-between`}>
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[21px] font-semibold tracking-[-0.04em] text-[var(--marketing-green)]"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-[11px] bg-[var(--marketing-green)] text-[14px] font-semibold text-[var(--marketing-cream)] shadow-[0_10px_22px_rgba(18,54,44,0.16)] ring-1 ring-[rgba(255,255,255,0.55)]">
            C
          </span>
          <span>Credo</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium text-[var(--marketing-muted)] transition-colors duration-150 hover:text-[var(--marketing-green)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={routes.login}
            className="hidden h-10 items-center rounded-full px-3 text-[13px] font-semibold text-[var(--marketing-muted)] transition hover:text-[var(--marketing-green)] sm:inline-flex"
          >
            Sign in
          </Link>
          <Link href={workspaceHref} className={MARKETING_STYLE.primaryCta}>
            Create account
          </Link>
        </div>
      </nav>
    </header>
  );
}
