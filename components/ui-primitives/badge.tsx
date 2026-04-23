import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-7 items-center rounded-lg bg-[#f3f4ef] px-2.5 text-xs font-medium text-[#6e736b]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
