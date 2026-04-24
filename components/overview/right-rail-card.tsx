import { SurfacePanel } from "@/components/ui-patterns/surface-panel";
import { surfaceClass } from "@/components/ui/surface";
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
        surfaceClass("rightRailCard"),
        "[&_h2]:text-[12px] [&_h2]:text-neutral-600",
        className
      )}
      tone={tone}
    >
      {children}
    </SurfacePanel>
  );
}
