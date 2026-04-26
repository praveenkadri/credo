import Link from "next/link";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Payroll", href: "#payroll" },
  { label: "Invoicing", href: "#invoicing" },
  { label: "Compliance", href: "#compliance" },
  { label: "Pricing", href: "#pricing" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-[#f6f6f2]/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-5 lg:px-7">
        <Link href="/" className="text-[31px] font-semibold tracking-[-0.045em] text-neutral-900">
          Credo
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[14px] text-neutral-600 transition-colors duration-150 hover:text-neutral-900"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={routes.overview}
            className={buttonClassName("secondary")}
          >
            Log in
          </Link>
          <Link
            href={routes.firstCompanySetup()}
            className={buttonClassName("primary")}
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
