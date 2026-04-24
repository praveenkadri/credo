"use client";

import * as React from "react";
import { ChartRangeSelector } from "@/components/overview/chart-range-selector";
import { motionClass } from "@/components/ui/motion";
import { surfaceClass } from "@/components/ui/surface";
import { layoutTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type HeroGraphPoint = {
  label: string;
  value: number;
};

type HeroGraphProps = {
  title?: string;
  valueLabel?: string;
  currentValue: string;
  deltaText: string;
  deltaPositive?: boolean;
  interpretation?: string;
  points?: HeroGraphPoint[];
  ranges?: string[];
  activeRange?: string;
  mode?: "Value" | "Returns";
  className?: string;
};

const DEFAULT_POINTS: HeroGraphPoint[] = [
  { label: "9:30 AM", value: 18 },
  { label: "10:00 AM", value: 10 },
  { label: "10:30 AM", value: 11 },
  { label: "11:00 AM", value: 14 },
  { label: "11:30 AM", value: 15 },
  { label: "12:00 PM", value: 15 },
  { label: "12:30 PM", value: 16 },
  { label: "1:00 PM", value: 16 },
  { label: "1:30 PM", value: 17 },
  { label: "2:00 PM", value: 48 },
  { label: "2:30 PM", value: 50 },
  { label: "3:00 PM", value: 49 },
  { label: "3:30 PM", value: 49 },
  { label: "4:00 PM", value: 48 },
  { label: "4:30 PM", value: 47 },
  { label: "5:00 PM", value: 48 },
  { label: "5:30 PM", value: 48 },
  { label: "6:00 PM", value: 48 },
  { label: "6:30 PM", value: 47 },
  { label: "7:00 PM", value: 47 },
  { label: "7:30 PM", value: 46 },
  { label: "8:00 PM", value: 46 },
  { label: "8:30 PM", value: 46 },
  { label: "9:00 PM", value: 47 },
];

const RANGE_SERIES_CONFIG: Record<
  string,
  { count: number; labelPrefix: string; multiplier: number; wobble: number }
> = {
  "1W": { count: 7, labelPrefix: "Day", multiplier: 0.94, wobble: 1.8 },
  "1M": { count: 12, labelPrefix: "Wk", multiplier: 0.98, wobble: 2.6 },
  "3M": { count: 14, labelPrefix: "Wk", multiplier: 1.03, wobble: 3.2 },
  "6M": { count: 16, labelPrefix: "Wk", multiplier: 1.07, wobble: 3.8 },
  YTD: { count: 18, labelPrefix: "Wk", multiplier: 1.11, wobble: 4.4 },
  "1Y": { count: 20, labelPrefix: "Mo", multiplier: 1.15, wobble: 4.9 },
  ALL: { count: 22, labelPrefix: "Mo", multiplier: 1.2, wobble: 5.4 },
};

function getDataForRange(points: HeroGraphPoint[], range: string): HeroGraphPoint[] {
  if (range === "1D" || !RANGE_SERIES_CONFIG[range]) return points;

  const config = RANGE_SERIES_CONFIG[range];
  const lastIndex = Math.max(config.count - 1, 1);

  return Array.from({ length: config.count }, (_, index) => {
    const sourceIndex = Math.round((index / lastIndex) * (points.length - 1));
    const source = points[sourceIndex];
    const trend = (index / lastIndex - 0.5) * config.wobble;
    const wave = Math.sin(index * 0.78) * (config.wobble * 0.7);
    return {
      label: `${config.labelPrefix} ${index + 1}`,
      value: Math.max(1, Number((source.value * config.multiplier + trend + wave).toFixed(2))),
    };
  });
}

function getDataForMode(points: HeroGraphPoint[], mode: "Value" | "Returns"): HeroGraphPoint[] {
  if (mode === "Value") return points;
  const baseline = points[0]?.value ?? 1;
  return points.map((point) => ({
    label: point.label,
    value: Number((((point.value - baseline) / baseline) * 100).toFixed(2)),
  }));
}

function buildPath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function areaPath(points: { x: number; y: number }[], baseY: number, endIndex: number) {
  const active = points.slice(0, endIndex + 1);
  if (!active.length) return "";
  const line = buildPath(active);
  const last = active[active.length - 1];
  return `${line} L ${last.x} ${baseY} L ${active[0].x} ${baseY} Z`;
}

export function HeroGraph({
  title = "Cash movement",
  valueLabel = "Portfolio value",
  currentValue,
  deltaText,
  deltaPositive = true,
  interpretation,
  points = DEFAULT_POINTS,
  ranges = ["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "ALL"],
  activeRange = "1D",
  mode = "Value",
  className,
}: HeroGraphProps) {
  const ids = React.useId();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedRange, setSelectedRange] = React.useState(activeRange);
  const [selectedMode, setSelectedMode] = React.useState(mode);
  const [width, setWidth] = React.useState(0);
  const [hoverIndex, setHoverIndex] = React.useState<number>(Math.floor(points.length * 0.72));
  const [isHovering, setIsHovering] = React.useState(false);
  const [isRangeTransitioning, setIsRangeTransitioning] = React.useState(false);

  React.useEffect(() => {
    setSelectedRange(activeRange);
  }, [activeRange]);

  React.useEffect(() => {
    setSelectedMode(mode);
  }, [mode]);

  React.useEffect(() => {
    setIsRangeTransitioning(true);
    const frame = requestAnimationFrame(() => {
      setIsRangeTransitioning(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedRange, selectedMode]);

  const rangePoints = React.useMemo(() => getDataForRange(points, selectedRange), [points, selectedRange]);
  const displayPoints = React.useMemo(
    () => getDataForMode(rangePoints, selectedMode),
    [rangePoints, selectedMode]
  );

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const height = layoutTokens.chartHeight;
  const topPad = 24;
  const rightPad = 10;
  const bottomPad = 28;
  const leftPad = 10;
  const innerWidth = Math.max(width - leftPad - rightPad, 40);
  const innerHeight = height - topPad - bottomPad;

  const min = Math.min(...displayPoints.map((p) => p.value));
  const max = Math.max(...displayPoints.map((p) => p.value));
  const range = Math.max(max - min, 1);

  const svgPoints = displayPoints.map((point, index) => {
    const x = leftPad + (index / (displayPoints.length - 1)) * innerWidth;
    const y = topPad + (1 - (point.value - min) / range) * innerHeight;
    return { ...point, x, y };
  });

  const safeHoverIndex = Math.min(Math.max(hoverIndex, 0), svgPoints.length - 1);
  const activePoint = svgPoints[safeHoverIndex];

  const activePath = buildPath(svgPoints.slice(0, safeHoverIndex + 1));
  const trailingPath = buildPath(svgPoints.slice(safeHoverIndex));
  const fillPath = areaPath(svgPoints, height - bottomPad, safeHoverIndex);

  const currentDisplayValue =
    selectedMode === "Returns"
      ? `${activePoint.value.toFixed(2)}%`
      : currentValue || `$${activePoint.value.toLocaleString()}`;
  const hoverDisplayValue =
    selectedMode === "Returns"
      ? `${activePoint.value.toFixed(2)}%`
      : `$${activePoint.value.toLocaleString()}`;
  const hoverLabel = activePoint.label;

  const plotWidth = Math.max(width, 320);
  const tooltipLeft = Math.max(12, Math.min(activePoint.x + 16, plotWidth - 126));
  const tooltipTop = Math.max(12, activePoint.y - 34);

  function updateHover(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left - leftPad;
    const ratio = Math.min(Math.max(x / innerWidth, 0), 1);
    const nextIndex = Math.round(ratio * (displayPoints.length - 1));
    setHoverIndex(nextIndex);
  }

  return (
    <section
      className={cn(
        surfaceClass("chartSurface"),
        "px-5 py-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#93988f]">{title}</p>
          <h2 className="mt-2 text-[60px] font-medium leading-none tracking-[-0.05em] text-neutral-950">{currentDisplayValue}</h2>
          <p
            className={cn(
              "mt-2 text-[17px] font-medium tracking-[-0.02em]",
              deltaPositive ? "text-[#159947]" : "text-[#6e736b]"
            )}
          >
            {deltaText}
          </p>
        </div>

        <div className="pt-2 text-right">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#93988f]">{valueLabel}</p>
          <p className="mt-2 text-[19px] font-medium tracking-[-0.02em] text-[#575b55]">{hoverDisplayValue}</p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mt-3 rounded-xl bg-neutral-100/60 px-5 py-4"
        onMouseMove={(e) => updateHover(e.clientX)}
        onMouseEnter={(e) => {
          setIsHovering(true);
          updateHover(e.clientX);
        }}
        onMouseLeave={() => setIsHovering(false)}
      >
        <svg
          viewBox={`0 0 ${plotWidth} ${height}`}
          className={cn(
            `block h-[248px] w-full overflow-visible ${motionClass.softFadeTransform}`,
            isRangeTransitioning ? "translate-y-[2px] opacity-65" : "translate-y-0 opacity-100"
          )}
        >
          <defs>
            <linearGradient id={`hero-graph-fill-${ids}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(31,122,76,0.08)" />
              <stop offset="58%" stopColor="rgba(31,122,76,0.04)" />
              <stop offset="100%" stopColor="rgba(31,122,76,0)" />
            </linearGradient>

            <pattern id={`hero-graph-dots-${ids}`} width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="0.65" fill="rgba(31,122,76,0.09)" />
            </pattern>

            <mask id={`hero-graph-area-mask-${ids}`}>
              <path d={fillPath} fill="white" />
            </mask>
          </defs>

          <path d={fillPath} fill={`url(#hero-graph-fill-${ids})`} />
          <rect
            x="0"
            y={topPad}
            width={plotWidth}
            height={height - topPad - bottomPad}
            fill={`url(#hero-graph-dots-${ids})`}
            mask={`url(#hero-graph-area-mask-${ids})`}
          />

          <path
            d={activePath}
            fill="none"
            stroke="#1f7a4c"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={trailingPath}
            fill="none"
            stroke="rgba(31,122,76,0.34)"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={topPad + 8}
            y2={height - bottomPad}
            stroke="rgba(212,212,212,0.6)"
            strokeWidth="1"
            className={cn(
              "transition-opacity duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              isHovering ? "opacity-100" : "opacity-0"
            )}
          />

          <circle cx={activePoint.x} cy={activePoint.y} r="5.5" fill="#1f7a4c" stroke="#fafaf7" strokeWidth="2.5" />
        </svg>

        <div
          className={cn(
            `pointer-events-none absolute rounded-lg bg-white px-2.5 py-1.5 text-xs shadow-[0_4px_14px_rgba(15,23,42,0.08)] ${motionClass.softFadeFast}`,
            isHovering ? "translate-y-0 opacity-100" : "translate-y-[3px] opacity-0"
          )}
          style={{ left: tooltipLeft, top: tooltipTop }}
        >
          <p className="font-medium text-[#1f221c]">{hoverDisplayValue}</p>
          <p className="mt-0.5 text-[11px] text-[#6e736b]">{hoverLabel}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <ChartRangeSelector
          ranges={ranges}
          selectedRange={selectedRange}
          onSelect={(rangeOption) => {
            setSelectedRange(rangeOption);
            const nextLength = getDataForRange(points, rangeOption).length;
            setHoverIndex(Math.floor(nextLength * 0.72));
          }}
        />

        <div className="inline-flex items-center rounded-xl bg-[#f3f4ef] p-1">
          <button
            type="button"
            onClick={() => setSelectedMode("Value")}
            className={cn(
              "inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
              selectedMode === "Value" ? "bg-[#fafaf7] text-[#1f221c]" : "text-[#6e736b] hover:text-neutral-900"
            )}
          >
            Value
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode("Returns")}
            className={cn(
              "inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
              selectedMode === "Returns" ? "bg-[#fafaf7] text-[#1f221c]" : "text-[#6e736b] hover:text-neutral-900"
            )}
          >
            Returns
          </button>
        </div>
      </div>

      {interpretation ? (
        <p className="mt-3 border-t border-[#e4e8df] pt-3 text-[13px] leading-6 text-neutral-600">
          {interpretation}
        </p>
      ) : null}
    </section>
  );
}
