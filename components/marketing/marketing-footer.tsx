import Link from "next/link";

const COLUMNS = {
  Product: ["Payroll", "Invoicing", "Compliance"],
  Company: ["About", "Careers", "Contact"],
  Resources: ["Guides", "Help", "Status"],
  Legal: ["Privacy", "Terms", "Security"],
} as const;

export function MarketingFooter() {
  return (
    <footer className="mt-24 border-t border-neutral-200/60 pb-10 pt-10">
      <div className="mx-auto w-full max-w-[1180px] px-5 lg:px-7">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="text-[31px] font-semibold tracking-[-0.045em] text-neutral-900">
              Credo
            </Link>
          </div>

          {Object.entries(COLUMNS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">{title}</h3>
              <div className="mt-3 space-y-2 text-[14px] text-neutral-600">
                {links.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
