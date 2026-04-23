import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={[
        "h-10 w-full rounded-xl bg-[#fafaf7] px-3 text-sm text-[#575b55] placeholder:text-[#93988f] outline-none transition-all duration-200 ease-out hover:bg-[#f3f4ef] focus:bg-[#f3f4ef] focus:text-[#1f221c] focus:shadow-[0_0_0_3px_rgba(31,34,28,0.08)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
