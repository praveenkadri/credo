import * as React from "react";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  initials: string;
  compact?: boolean;
};

export function Avatar({ initials, compact = false, className, ...props }: AvatarProps) {
  return (
    <div
      className={[
        "flex items-center justify-center rounded-full bg-[#1f221c] font-medium text-white",
        compact ? "size-7 text-[11px]" : "size-9 text-[12.5px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {initials}
    </div>
  );
}
