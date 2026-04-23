import { HeroGraph } from "@/components/ui-patterns/hero-graph";

type CashMovementChartProps = {
  title: string;
  valueLabel: string;
  currentValue: string;
  deltaText: string;
  deltaPositive: boolean;
  activeRange: string;
  mode: "Value" | "Returns";
  interpretation: string;
  ranges: string[];
};

export function CashMovementChart(props: CashMovementChartProps) {
  return (
    <HeroGraph
      title={props.title}
      valueLabel={props.valueLabel}
      currentValue={props.currentValue}
      deltaText={props.deltaText}
      deltaPositive={props.deltaPositive}
      activeRange={props.activeRange}
      mode={props.mode}
      interpretation={props.interpretation}
      ranges={props.ranges}
      className="shell-enter shell-enter-delay-2"
    />
  );
}
