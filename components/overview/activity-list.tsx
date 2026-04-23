import { ListRow } from "@/components/ui-patterns/list-row";
import { SurfacePanel } from "@/components/ui-patterns/surface-panel";

type ActivityEvent = { id: string; title: string };

export function ActivityList({ events }: { events: ActivityEvent[] }) {
  return (
    <SurfacePanel
      title="Activity"
      eyebrow="Important events"
      compact
      tone="soft"
      className="mt-6 shell-enter shell-enter-delay-4"
    >
      <div className="space-y-1">
        {events.map((event) => (
          <ListRow
            key={event.id}
            as="div"
            title={event.title}
            className="px-2 py-2.5"
            marker={<span className="h-1.5 w-1.5 rounded-full bg-[#93988f]/75" />}
          />
        ))}
      </div>
    </SurfacePanel>
  );
}
