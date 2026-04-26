"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SuccessToast({
  message,
  durationMs = 2400,
  className,
}: {
  message?: string;
  durationMs?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));
  }, [message]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, visible]);

  if (!message) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-6 right-6 z-50 transition-[opacity,transform] ease-[cubic-bezier(0.2,0,0,1)]",
        visible ? "translate-y-0 opacity-100 duration-[180ms]" : "translate-y-2 opacity-0 duration-[160ms]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl bg-[#242421] px-4 py-2.5 text-[12px] font-medium tracking-[-0.005em] text-white shadow-[0_12px_28px_rgba(15,23,42,0.22)]">
        {message}
      </div>
    </div>
  );
}
