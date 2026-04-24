import { cn } from "@/lib/utils";

export const surfaceVariants = {
  softGlass: "rounded-[24px] bg-white/50 ring-1 ring-neutral-200/40",
  accountRow:
    "rounded-[24px] bg-white/50 ring-1 ring-neutral-200/50 shadow-[0_8px_30px_rgba(15,23,42,0.035)]",
  rightRailCard:
    "relative overflow-hidden rounded-[28px] bg-white/45 backdrop-blur-md ring-1 ring-white/40 shadow-[0_8px_30px_rgba(15,23,42,0.04)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.20),rgba(255,255,255,0.02))] [&>*]:relative [&>*]:z-[1]",
  chartSurface: "rounded-2xl bg-neutral-50/40",
  subtleBanner: "rounded-lg border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
} as const;

export type SurfaceVariant = keyof typeof surfaceVariants;

export function surfaceClass(variant: SurfaceVariant, className?: string) {
  return cn(surfaceVariants[variant], className);
}
