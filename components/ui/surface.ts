import { cn } from "@/lib/utils";

export const surfaceVariants = {
  softGlass: "rounded-[24px] bg-white/50 ring-1 ring-neutral-200/40",
  accountRow:
    "rounded-[24px] bg-white/50 ring-1 ring-neutral-200/50 shadow-[0_8px_30px_rgba(15,23,42,0.035)]",
  rightRailCard:
    "relative overflow-hidden rounded-2xl bg-white/60 p-0 backdrop-blur-md shadow-[0_1px_2px_rgba(31,34,28,0.025),0_10px_28px_rgba(31,34,28,0.035)]",
  chartSurface: "rounded-2xl bg-neutral-50/40",
  subtleBanner: "rounded-lg border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
} as const;

export type SurfaceVariant = keyof typeof surfaceVariants;

export function surfaceClass(variant: SurfaceVariant, className?: string) {
  return cn(surfaceVariants[variant], className);
}
