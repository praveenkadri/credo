import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={[
        "h-10 w-full rounded-xl bg-[#fafaf7] px-3 text-sm text-[#575b55] placeholder:text-[#93988f] outline-none transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/60 focus:bg-neutral-100/60 focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
