import Link from "next/link";
import { MARKETING_SHELL } from "@/components/marketing/marketing-layout";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Why Credo", href: "#trust" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[var(--credo-green-975)] py-9 text-white">
      <div className={MARKETING_SHELL.container}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-[20px] font-semibold tracking-[-0.04em] text-[var(--marketing-cream)]">
            <span className="inline-flex size-8 items-center justify-center rounded-[11px] bg-[var(--marketing-cream)] text-[14px] font-semibold text-[var(--marketing-green)] ring-1 ring-white/20">
              C
            </span>
            <span>Credo</span>
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((item) => (
              <a key={item.label} href={item.href} className="text-[13px] font-medium text-white/64 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </div>

          <p className="text-[13px] font-medium text-white/54">Copyright {new Date().getFullYear()} Credo.</p>
        </div>
      </div>
    </footer>
  );
}
