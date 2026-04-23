import { EmptyState } from "@/components/ui-patterns/empty-state";
import { ListRow } from "@/components/ui-patterns/list-row";
import { SurfacePanel } from "@/components/ui-patterns/surface-panel";
import { Button } from "@/components/ui-primitives/button";

const ACTION_ITEMS = [
  "Run payroll check",
  "Review pending invoices",
  "Prepare monthly close",
];

const APPROVAL_ITEMS = [
  "2 payroll runs awaiting sign-off",
  "5 invoices ready to send",
];

const UPCOMING_ITEMS = [
  "Payroll funding in 2 days",
  "Quarterly filing window this week",
  "Invoice reminders on Friday",
];

const FILTER_ITEMS = ["All companies", "Current month", "Open items only"];

function RailList({ items, emptyMessage }: { items: string[]; emptyMessage?: string }) {
  if (items.length === 0) {
    return <EmptyState message={emptyMessage ?? "No items"} />;
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <ListRow key={item} as="div" title={item} className="px-2 py-2.5" />
      ))}
    </div>
  );
}

export default function RightRail() {
  return (
    <aside className="hidden xl:flex xl:w-[clamp(340px,24vw,414px)] xl:shrink-0 xl:flex-col">
      <div className="sticky top-3 flex flex-col gap-4 px-2 pb-4 pt-0">
        <SurfacePanel title="Actions" eyebrow="Quick" className="shell-enter bg-[#fafaf8] shadow-[0_1px_1px_rgba(31,34,28,0.01),0_4px_10px_rgba(31,34,28,0.014)]" tone="soft">
          <RailList items={ACTION_ITEMS} />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTER_ITEMS.map((item) => (
              <Button
                key={item}
                variant="subtle"
                className="h-8 rounded-xl bg-[#f3f4ef] px-2.5 text-[11px] text-[#6e736b]"
              >
                {item}
              </Button>
            ))}
          </div>
        </SurfacePanel>

        <SurfacePanel
          title="Queue"
          eyebrow="Support"
          className="shell-enter shell-enter-delay-1 bg-[#f7f8f5] shadow-[0_1px_1px_rgba(31,34,28,0.008)]"
          tone="inset"
        >
          <div className="space-y-3">
            <div>
              <p className="px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#93988f]">
                Approvals
              </p>
              <RailList items={APPROVAL_ITEMS} emptyMessage="No pending approvals" />
            </div>
            <div>
              <p className="px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#93988f]">
                Upcoming
              </p>
              <RailList items={UPCOMING_ITEMS} emptyMessage="No upcoming events" />
            </div>
          </div>
        </SurfacePanel>
      </div>
    </aside>
  );
}
