import { EmptyState } from "@/components/ui-patterns/empty-state";
import { ListRow } from "@/components/ui-patterns/list-row";
import { cn } from "@/lib/utils";

export function RightRailSection({
  items,
  emptyMessage,
}: {
  items: string[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return <EmptyState message={emptyMessage ?? "No items"} />;
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <ListRow
          key={item}
          as="div"
          title={item}
          className={cn(
            "px-2 py-2.5 transition-all duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-[1px] hover:bg-white/80 hover:text-neutral-900 motion-reduce:hover:translate-y-0"
          )}
        />
      ))}
    </div>
  );
}
