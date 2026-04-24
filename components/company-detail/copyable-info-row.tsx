"use client";

import { useState } from "react";
import { motionClass } from "@/components/ui/motion";

export function CopyableInfoRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl px-2 py-2 hover:bg-white/45">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.09em] text-neutral-400">{label}</p>
        <p className="mt-0.5 truncate text-[13px] text-[#2d3228]">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className={[
          "inline-flex h-7 items-center rounded-lg px-2 text-[11px] font-medium",
          "text-neutral-600 hover:bg-white/60 hover:text-neutral-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40",
          motionClass.colorFast,
        ].join(" ")}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
