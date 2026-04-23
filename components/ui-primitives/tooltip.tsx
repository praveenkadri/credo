import * as React from "react";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <span className={["group relative inline-flex", className].filter(Boolean).join(" ")}>
      {children}
      <span
        className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-xl bg-white px-3 py-2 text-sm font-medium text-[#575b55] opacity-0 shadow-[0_1px_2px_rgba(31,34,28,0.03),0_6px_14px_rgba(31,34,28,0.04)] transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100"
        aria-hidden="true"
      >
        {label}
      </span>
    </span>
  );
}
