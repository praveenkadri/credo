import { EmptyState } from "@/components/ui-patterns/empty-state";
import { ListRow } from "@/components/ui-patterns/list-row";
import { SurfacePanel } from "@/components/ui-patterns/surface-panel";
import {
  ATTENTION_ITEMS,
  UPCOMING_DEADLINES,
} from "@/lib/overview-decision-data";

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
  const todayItems = ATTENTION_ITEMS.filter((item) => item.timing === "Today").map(
    (item) => `${item.title} (${item.timing})`
  );
  const nextItems = UPCOMING_DEADLINES.map((item) => `${item.title} (${item.dueLabel})`);

  return (
    <aside className="hidden xl:flex xl:w-[clamp(340px,24vw,414px)] xl:shrink-0 xl:flex-col">
      <div className="sticky top-3 flex flex-col gap-4 px-2 pb-4 pt-0">
        <SurfacePanel
          title="Today"
          eyebrow="Operational focus"
          className="shell-enter relative overflow-hidden rounded-[28px] bg-white/45 backdrop-blur-md ring-1 ring-white/40 shadow-[0_8px_30px_rgba(15,23,42,0.04)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.20),rgba(255,255,255,0.02))] [&>*]:relative [&>*]:z-[1]"
          tone="soft"
        >
          <RailList items={todayItems} emptyMessage="No items due today" />
        </SurfacePanel>

        <SurfacePanel
          title="Next"
          eyebrow="Upcoming"
          className="shell-enter shell-enter-delay-1 relative overflow-hidden rounded-[28px] bg-white/45 backdrop-blur-md ring-1 ring-white/40 shadow-[0_8px_30px_rgba(15,23,42,0.04)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.20),rgba(255,255,255,0.02))] [&>*]:relative [&>*]:z-[1]"
          tone="inset"
        >
          <RailList items={nextItems} emptyMessage="No upcoming deadlines" />
        </SurfacePanel>
      </div>
    </aside>
  );
}
