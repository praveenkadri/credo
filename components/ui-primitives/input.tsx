import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={[
        "h-10 w-full rounded-xl bg-[var(--surface-warm)] px-3 text-[14px] font-normal leading-[1.4] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[var(--credo-taupe)] focus:bg-[var(--credo-taupe)] focus:text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--action-ring)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
