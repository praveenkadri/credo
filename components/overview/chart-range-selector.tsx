import { cn } from "@/lib/utils";

export function ChartRangeSelector({
  ranges,
  selectedRange,
  onSelect,
}: {
  ranges: string[];
  selectedRange: string;
  onSelect: (range: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ranges.map((rangeOption) => {
        const active = rangeOption === selectedRange;
        return (
          <button
            key={rangeOption}
            type="button"
            onClick={() => onSelect(rangeOption)}
            className={cn(
              "inline-flex h-8 items-center rounded-xl px-3 text-xs font-medium transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
              active
                ? "bg-[var(--action-primary-muted)] text-[var(--action-text)] shadow-[inset_0_0_0_1px_rgba(31,34,28,0.05)]"
                : "text-[#6e736b] hover:bg-neutral-100/70 hover:text-neutral-900"
            )}
          >
            {rangeOption}
          </button>
        );
      })}
    </div>
  );
}
