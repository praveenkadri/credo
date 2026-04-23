import * as React from "react";
import { SurfacePanel } from "@/components/ui-patterns/surface-panel";

type ChartSurfaceProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: React.ReactNode;
  controls?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  canvasClassName?: string;
  openCanvas?: boolean;
};

export function ChartSurface({
  title,
  eyebrow,
  subtitle,
  action,
  controls,
  footer,
  children,
  className,
  canvasClassName,
  openCanvas = false,
}: ChartSurfaceProps) {
  return (
    <SurfacePanel
      title={title}
      eyebrow={eyebrow}
      subtitle={subtitle}
      action={action}
      className={["shell-enter", className].filter(Boolean).join(" ")}
      contentClassName="space-y-3"
    >
      {controls ? <div className="flex justify-end">{controls}</div> : null}
      <div
        className={[
          openCanvas
            ? "relative rounded-2xl bg-[#f1f2ef] p-2"
            : "relative rounded-2xl bg-[#f1f2ef] p-3 shadow-[0_1px_1px_rgba(31,34,28,0.02)]",
          canvasClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </SurfacePanel>
  );
}
