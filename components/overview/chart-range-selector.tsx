import { buttonClassName } from "@/components/ui-primitives/button";

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
            className={buttonClassName(active ? "chipActive" : "chip")}
          >
            {rangeOption}
          </button>
        );
      })}
    </div>
  );
}
