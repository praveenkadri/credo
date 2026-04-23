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
        "transition-all duration-200 ease-out hover:bg-[#f3f4ef] hover:text-[#1f221c] active:bg-[#eef0ea] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(31,34,28,0.08)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
