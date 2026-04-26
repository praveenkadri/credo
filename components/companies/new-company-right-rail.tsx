import { RightRailCard } from "@/components/overview/right-rail-card";
import { RightRailSection } from "@/components/overview/right-rail-section";
import { routes } from "@/lib/routes";

const setupItems = ["Legal company name", "Payroll number", "HST number", "BIN number"];
const nextItems = ["Add employees", { title: "Run payroll", href: routes.runPayroll }, "Create invoices"];

export function NewCompanyRightRail() {
  return (
    <aside className="hidden xl:flex xl:w-[clamp(340px,24vw,414px)] xl:shrink-0 xl:flex-col">
      <div className="sticky top-3 flex flex-col gap-4 px-2 pb-4 pt-0">
        <RightRailCard title="What you'll need" eyebrow="Setup" tone="soft" className="shell-enter">
          <RightRailSection items={setupItems} />
        </RightRailCard>

        <RightRailCard
          title="After creating a company"
          eyebrow="Next"
          className="shell-enter shell-enter-delay-1"
          tone="inset"
        >
          <RightRailSection items={nextItems} />
        </RightRailCard>
      </div>
    </aside>
  );
}
