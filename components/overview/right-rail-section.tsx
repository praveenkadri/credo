import Link from "next/link";
import { EmptyState } from "@/components/ui-patterns/empty-state";
import { ListRow } from "@/components/ui-patterns/list-row";
import { cn } from "@/lib/utils";

type RightRailSectionItem = string | { title: string; href: string };

export function RightRailSection({
  items,
  emptyMessage,
}: {
  items: RightRailSectionItem[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return <EmptyState message={emptyMessage ?? "No items"} />;
  }

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const title = typeof item === "string" ? item : item.title;
        const className = cn(
          "px-2 py-2.5 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f3f4ef] hover:text-neutral-900"
        );

        return typeof item === "string" ? (
          <ListRow key={title} as="div" title={title} className={className} />
        ) : (
          <Link key={title} href={item.href} className="block rounded-xl">
            <ListRow as="div" title={title} className={className} />
          </Link>
        );
      })}
    </div>
  );
}
