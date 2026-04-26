import { APP_LAYOUT } from "@/components/ui-shell/layout-constants";
import { cn } from "@/lib/utils";

export function PageFrame({
  children,
  withRail = true,
}: {
  children: React.ReactNode;
  withRail?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full items-start",
        APP_LAYOUT.containerMaxWidth,
        APP_LAYOUT.mainRailGap,
        withRail ? APP_LAYOUT.withRailColumns : "block"
      )}
    >
      {children}
    </div>
  );
}

export function PageMain({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={cn(APP_LAYOUT.mainColumnWidthClass, className)}>{children}</main>;
}

export function PageRail({ children }: { children: React.ReactNode }) {
  return <aside className={APP_LAYOUT.rightRailWidthClass}>{children}</aside>;
}
