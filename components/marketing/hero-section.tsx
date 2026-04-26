import Link from "next/link";
import { ProductSurfaceMock } from "@/components/marketing/product-surface-mock";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";

export function HeroSection() {
  return (
    <section className="mx-auto mt-14 w-full max-w-[1180px] px-5 lg:px-7">
      <div className="max-w-[860px]">
        <h1 className="text-[44px] font-semibold leading-[1.06] tracking-[-0.045em] text-neutral-950 sm:text-[62px]">
          Run payroll, invoices, and company operations from one calm workspace.
        </h1>
        <p className="mt-6 max-w-[760px] text-[19px] leading-[1.5] text-neutral-600">
          Credo helps small businesses manage payroll, invoices, documents, and compliance across one or many
          companies.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href={routes.firstCompanySetup()}
            className={buttonClassName("primary")}
          >
            Get started
          </Link>
          <a
            href="#how"
            className={buttonClassName("outline")}
          >
            See how it works
          </a>
        </div>
      </div>

      <div className="mt-11">
        <ProductSurfaceMock />
      </div>
    </section>
  );
}
