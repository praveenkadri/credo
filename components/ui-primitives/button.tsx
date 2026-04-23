import * as React from "react";

type ButtonVariant = "default" | "icon" | "subtle";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    "inline-flex h-10 items-center gap-2 rounded-xl bg-[#fafaf7] px-3 text-sm font-medium text-[#575b55]",
  icon:
    "inline-flex size-10 items-center justify-center rounded-xl bg-[#fafaf7] text-[#6e736b]",
  subtle:
    "inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium text-[#6e736b]",
};

export function Button({
  className,
  variant = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        VARIANT_CLASS[variant],
        "transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/60 hover:text-neutral-900 active:bg-[#eef0ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
