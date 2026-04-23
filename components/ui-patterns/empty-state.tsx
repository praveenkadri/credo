import * as React from "react";

type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <p
      className={[
        "rounded-2xl bg-[#f3f4ef] px-3 py-3 text-center text-[12px] text-[#93988f]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {message}
    </p>
  );
}
