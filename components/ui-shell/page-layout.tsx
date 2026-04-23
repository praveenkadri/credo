import { APP_LAYOUT } from "@/components/ui-shell/layout-constants";
import { cn } from "@/lib/utils";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        APP_LAYOUT.topGridOffset,
        "grid w-full items-start",
        APP_LAYOUT.mainRailGap,
        `xl:grid-cols-[minmax(0,1fr)_${APP_LAYOUT.rightRailWidth}]`
      )}
    >
      {children}
    </div>
  );
}

export function PageMain({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={cn("min-w-0 px-0 md:px-0", className)}>{children}</main>;
}

export function PageRail({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
