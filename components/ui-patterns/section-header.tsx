import * as React from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={["flex items-start justify-between gap-3", className].filter(Boolean).join(" ")}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#93988f]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-[15px] font-medium tracking-[-0.02em] text-[#1f221c]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-[12.5px] leading-[1.5] text-[#6e736b]">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
