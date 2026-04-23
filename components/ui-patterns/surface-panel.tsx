import * as React from "react";
import { SectionHeader } from "@/components/ui-patterns/section-header";

type SurfaceTone = "base" | "soft" | "inset";

type SurfacePanelProps = {
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: SurfaceTone;
  compact?: boolean;
};

const TONE_CLASS: Record<SurfaceTone, string> = {
  base: "bg-[#f7f7f4] shadow-[0_1px_2px_rgba(31,34,28,0.02),0_8px_24px_rgba(31,34,28,0.03)]",
  soft: "bg-[#fafaf7] shadow-[0_1px_1px_rgba(31,34,28,0.02),0_6px_18px_rgba(31,34,28,0.025)]",
  inset: "bg-[#f3f4ef] shadow-[0_1px_1px_rgba(31,34,28,0.015)]",
};

export function SurfacePanel({
  title,
  eyebrow,
  subtitle,
  action,
  children,
  className,
  contentClassName,
  tone = "base",
  compact = false,
}: SurfacePanelProps) {
  return (
    <section
      className={[
        "rounded-[28px]",
        compact ? "p-4" : "p-5",
        TONE_CLASS[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? (
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          action={action}
          className="mb-3"
        />
      ) : null}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
