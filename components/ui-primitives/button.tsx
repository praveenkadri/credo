import * as React from "react";

type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive"
  | "destructiveGhost"
  | "chip"
  | "chipActive"
  | "segmentedItem"
  | "icon"
  | "toolbarIcon"
  | "rowAction"
  | "rowActionQuiet"
  | "menuItem"
  | "floating"
  | "noticeAction"
  | "noticeDismiss"
  | "subtle";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const MOTION_CLASS =
  "transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98] motion-reduce:active:scale-100";

const FOCUS_CLASS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]";

const DISABLED_CLASS =
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:scale-100";

const BASE_BUTTON_CLASS = [
  "type-button inline-flex h-11 items-center justify-center rounded-full px-[22px] text-center font-semibold",
  MOTION_CLASS,
  FOCUS_CLASS,
  DISABLED_CLASS,
].join(" ");

const COMPACT_BUTTON_CLASS = [
  "type-button inline-flex items-center font-semibold",
  MOTION_CLASS,
  FOCUS_CLASS,
  DISABLED_CLASS,
].join(" ");

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    `${BASE_BUTTON_CLASS} bg-[var(--surface-warm)] text-[var(--action-text)] ring-1 ring-[var(--border-soft)] hover:bg-[var(--credo-taupe)] hover:text-[var(--action-text)] disabled:bg-neutral-200/70 disabled:text-neutral-500`,
  primary:
    `${BASE_BUTTON_CLASS} bg-[var(--credo-green-800)] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-[var(--credo-green-700)] disabled:bg-neutral-300 disabled:text-neutral-600`,
  secondary:
    `${BASE_BUTTON_CLASS} bg-[var(--surface-warm)] text-[var(--action-text)] ring-1 ring-[var(--border-soft)] hover:bg-[var(--credo-taupe)] hover:text-[var(--action-text)] disabled:bg-neutral-200/70 disabled:text-neutral-500 disabled:ring-neutral-200/45`,
  ghost:
    `${BASE_BUTTON_CLASS} bg-transparent text-[var(--action-text)] hover:bg-[var(--interactive-active)] hover:text-[var(--action-text)] disabled:text-neutral-400`,
  outline:
    `${BASE_BUTTON_CLASS} bg-[var(--surface-warm)] text-[var(--action-text)] ring-1 ring-[var(--border-soft)] hover:bg-[var(--credo-taupe)] hover:text-[var(--action-text)] disabled:text-neutral-400 disabled:ring-neutral-200/45`,
  destructive:
    `${BASE_BUTTON_CLASS} bg-transparent text-red-700 ring-1 ring-red-200/80 hover:bg-red-50 hover:text-red-800 hover:ring-red-200 disabled:text-red-700/50 disabled:ring-red-100`,
  destructiveGhost:
    `${BASE_BUTTON_CLASS} bg-transparent text-red-700 hover:bg-red-50 hover:text-red-800 disabled:text-red-700/50`,
  icon:
    `${COMPACT_BUTTON_CLASS} size-10 justify-center rounded-xl bg-[var(--surface-warm)] p-0 text-[var(--action-text)] ring-1 ring-[var(--border-soft)] hover:bg-[var(--credo-taupe)] hover:text-[var(--action-text)]`,
  toolbarIcon:
    `${COMPACT_BUTTON_CLASS} size-10 justify-center rounded-xl bg-[var(--credo-bg)] p-0 text-[var(--text-secondary)] hover:bg-[var(--credo-taupe)] hover:text-[var(--text-primary)]`,
  subtle:
    `${COMPACT_BUTTON_CLASS} h-8 rounded-xl px-2.5 text-[14px] text-[var(--action-text)] hover:bg-[var(--interactive-active)] hover:text-[var(--action-text)]`,
  chip:
    `${COMPACT_BUTTON_CLASS} h-8 shrink-0 justify-center rounded-full px-3 text-[12px] text-[var(--text-muted)] hover:bg-[var(--credo-taupe)] hover:text-[var(--text-primary)]`,
  chipActive:
    `${COMPACT_BUTTON_CLASS} h-8 shrink-0 justify-center rounded-full bg-[var(--credo-taupe)] px-3 text-[12px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_rgba(23,26,23,0.05)] hover:bg-[var(--credo-taupe)] hover:text-[var(--text-primary)]`,
  segmentedItem:
    `${COMPACT_BUTTON_CLASS} h-8 shrink-0 rounded-full px-3 text-[12px] text-[var(--text-muted)] aria-[current=true]:bg-[var(--credo-taupe)] aria-[current=true]:text-[var(--text-primary)] aria-[current=true]:shadow-[inset_0_0_0_1px_rgba(23,26,23,0.05)] hover:bg-[var(--credo-taupe)] hover:text-[var(--text-primary)]`,
  rowAction:
    `${COMPACT_BUTTON_CLASS} h-9 justify-center rounded-xl px-3.5 text-[13px] text-[var(--action-text)] hover:bg-[var(--interactive-active)] hover:text-[var(--action-text)]`,
  rowActionQuiet:
    `${COMPACT_BUTTON_CLASS} h-9 rounded-xl px-3 text-[12px] text-[var(--text-muted)] hover:bg-[var(--credo-taupe)] hover:text-[var(--text-primary)]`,
  menuItem:
    `${COMPACT_BUTTON_CLASS} flex h-9 w-full justify-start rounded-2xl px-2 text-left text-[13px] text-[var(--text-secondary)] hover:bg-[var(--credo-taupe)] hover:text-[var(--text-primary)]`,
  floating:
    `${BASE_BUTTON_CLASS} fixed bottom-5 right-5 z-40 h-12 px-5 shadow-[0_18px_40px_rgba(18,54,44,0.18)] bg-[var(--credo-green-800)] text-white hover:bg-[var(--credo-green-700)] disabled:bg-neutral-300 disabled:text-neutral-600`,
  noticeAction:
    `${COMPACT_BUTTON_CLASS} h-8 rounded-full bg-[var(--credo-green-800)] px-3 text-[13px] font-semibold text-white shadow-none hover:bg-[var(--credo-green-700)] hover:text-white`,
  noticeDismiss:
    `${COMPACT_BUTTON_CLASS} size-8 justify-center rounded-xl p-0 text-[#8f8375] hover:bg-[rgba(184,135,79,0.12)] hover:text-[var(--credo-green-950)]`,
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
