import { cn } from "@/lib/utils";

export const surfaceVariants = {
  softGlass: "rounded-[28px] bg-[var(--credo-surface-warm)]",
  accountRow: "rounded-[24px] bg-[var(--credo-surface-warm)] shadow-[0_1px_1px_rgba(23,26,23,0.016)] ring-1 ring-[rgba(225,218,207,0.72)]",
  rightRailCard: "rounded-[28px] bg-[var(--credo-surface-warm)] ring-1 ring-[var(--credo-border)]",
  chartSurface: "bg-transparent",
  subtleBanner: "rounded-[18px] bg-[var(--credo-bronze-pale)] text-[var(--credo-ink)] ring-1 ring-[var(--credo-taupe-strong)]",
} as const;

export type SurfaceVariant = keyof typeof surfaceVariants;

export function surfaceClass(variant: SurfaceVariant, className?: string) {
  return cn(surfaceVariants[variant], className);
}
