import * as React from "react";
import { Badge } from "@/components/ui-primitives/badge";

type StatBlockProps = {
  label: string;
  value: string;
  helper?: string;
  trailing?: React.ReactNode;
  badgeText?: string;
  quiet?: boolean;
  className?: string;
};

export function StatBlock({
  label,
  value,
  helper,
  trailing,
  badgeText,
  quiet = false,
  className,
}: StatBlockProps) {
  return (
    <div className={["flex flex-col gap-2.5", className].filter(Boolean).join(" ")}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[13px] text-[#6e736b]">{label}</p>
          <p className={quiet ? "mt-1 text-[24px] font-medium tracking-[-0.03em] text-[#1f221c]" : "mt-1 text-[28px] font-medium tracking-[-0.03em] text-[#1f221c]"}>{value}</p>
        </div>
        {trailing}
      </div>
      {helper ? <p className="text-[13px] leading-6 text-[#6e736b]">{helper}</p> : null}
      {badgeText ? <Badge className="bg-[#dfeee3] text-[#159947]">{badgeText}</Badge> : null}
    </div>
  );
}
