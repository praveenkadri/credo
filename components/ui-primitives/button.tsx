import * as React from "react";

type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "chip"
  | "chipActive"
  | "icon"
  | "subtle";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const BASE_BUTTON_CLASS =
  "type-button inline-flex h-11 items-center justify-center rounded-full px-[22px] text-center transition-all duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/45 disabled:cursor-not-allowed disabled:translate-y-0";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    `${BASE_BUTTON_CLASS} bg-[var(--action-primary-soft)] text-[var(--action-text)] hover:bg-white hover:text-[var(--action-text)] hover:-translate-y-[1px] active:translate-y-0 disabled:bg-neutral-200/70 disabled:text-neutral-500`,
  primary:
    `${BASE_BUTTON_CLASS} bg-[var(--action-primary)] text-white hover:bg-[var(--action-primary-hover)] hover:-translate-y-[1px] active:translate-y-0 disabled:bg-neutral-300 disabled:text-neutral-600`,
  secondary:
    `${BASE_BUTTON_CLASS} bg-[var(--action-primary-soft)] text-[var(--action-text)] hover:bg-white hover:text-[var(--action-text)] hover:-translate-y-[1px] active:translate-y-0 disabled:bg-neutral-200/70 disabled:text-neutral-500`,
  ghost:
    `${BASE_BUTTON_CLASS} bg-transparent text-[var(--action-text)] hover:bg-[var(--action-primary-muted)] hover:text-[var(--action-text)] hover:-translate-y-[1px] active:translate-y-0 disabled:text-neutral-400`,
  outline:
    `${BASE_BUTTON_CLASS} bg-transparent text-[var(--action-text)] ring-1 ring-neutral-200/65 hover:bg-[var(--action-primary-soft)] hover:text-[var(--action-text)] hover:-translate-y-[1px] active:translate-y-0 disabled:text-neutral-400 disabled:ring-neutral-200/45`,
  icon:
    "inline-flex size-10 items-center justify-center rounded-full bg-[var(--action-primary-soft)] text-[var(--action-text)] transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white hover:text-[var(--action-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/45",
  subtle:
    "type-button inline-flex h-8 items-center rounded-lg px-2.5 text-[14px] text-[var(--action-text)] transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[var(--action-primary-muted)] hover:text-[var(--action-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40",
  chip:
    "type-button inline-flex h-9 items-center justify-center rounded-full bg-[var(--action-primary-soft)] px-4 text-[14px] text-[var(--action-text)] transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white hover:text-[var(--action-text)] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0",
  chipActive:
    "type-button inline-flex h-9 items-center justify-center rounded-full bg-[var(--action-primary-muted)] px-4 text-[14px] text-[var(--action-text)] transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[var(--action-primary-muted)] hover:text-[var(--action-text)] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0",
};

export function buttonClassName(variant: ButtonVariant = "default") {
  return VARIANT_CLASS[variant];
}

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
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
