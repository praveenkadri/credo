import { SurfacePanel } from "@/components/ui-patterns/surface-panel";
import { cn } from "@/lib/utils";

export function RightRailCard({
  title,
  eyebrow,
  tone,
  className,
  children,
}: {
  title: string;
  eyebrow: string;
  tone: "soft" | "inset";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SurfacePanel
      title={title}
      eyebrow={eyebrow}
      className={cn(
        "rounded-[32px] bg-white p-5 shadow-[0_20px_70px_rgba(17,24,39,0.065)]",
        "[&_h2]:type-caption [&_h2]:font-semibold [&_h2]:text-neutral-500",
        className
      )}
      tone={tone}
    >
      {children}
    </SurfacePanel>
  );
}
