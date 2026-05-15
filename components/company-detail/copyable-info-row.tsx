"use client";

import { useState } from "react";

export function CopyableInfoRow({
  label,
  value,
  displayValue,
}: {
  label: string;
  value: string;
  displayValue?: string;
}) {
  const [copied, setCopied] = useState(false);
  const canCopy = value.trim().length > 0;

  async function onCopy() {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] px-0 py-2.5 transition hover:bg-transparent">
      <div className="min-w-0">
        <p className="text-[12px] font-medium leading-tight text-[var(--credo-muted)]">{label}</p>
        <p className="mt-1 truncate text-[13px] font-medium leading-tight text-[var(--credo-ink)]">{displayValue ?? value}</p>
      </div>
      {canCopy ? (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label}`}
          title={copied ? "Copied" : `Copy ${label}`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--credo-muted)] transition hover:bg-[var(--credo-bronze-soft)] hover:text-[var(--credo-green-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        >
          {copied ? (
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="m4 8.2 2.4 2.4L12 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="M6 5.5V4.3C6 3.6 6.6 3 7.3 3h4.4c.7 0 1.3.6 1.3 1.3v4.4c0 .7-.6 1.3-1.3 1.3h-1.2M4.3 6h4.4c.7 0 1.3.6 1.3 1.3v4.4c0 .7-.6 1.3-1.3 1.3H4.3C3.6 13 3 12.4 3 11.7V7.3C3 6.6 3.6 6 4.3 6Z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      ) : null}
    </div>
  );
}
