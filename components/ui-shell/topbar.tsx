"use client";

import { Avatar } from "@/components/ui-primitives/avatar";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";

export default function Topbar() {
  return (
    <header className="relative z-20">
      <div className="pt-1">
        <div className="relative flex h-14 items-center justify-between rounded-xl bg-[#f7f7f4] px-3 shadow-[0_1px_1px_rgba(31,34,28,0.014)]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-[9px] font-medium uppercase tracking-[0.12em] text-[#93988f]">
                Workspace
              </p>
              <h1 className="truncate text-[13.5px] font-medium leading-[1.25] text-[#1f221c]">Credo</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden w-[260px] md:block">
              <Input placeholder="Search workspace" className="h-9 bg-[#fafaf7] pl-3" />
            </div>
            <Button className="hidden h-9 bg-[#fafaf7] px-3.5 text-[#575b55] sm:inline-flex">Today</Button>
            <Button variant="icon" aria-label="Notifications" className="size-9 bg-[#fafaf7] text-[#575b55]">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
                <path
                  d="M8 2.8C6.1 2.8 4.6 4.3 4.6 6.2V8.6L3.4 10.3H12.6L11.4 8.6V6.2C11.4 4.3 9.9 2.8 8 2.8Z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M6.9 11.7C7.1 12.2 7.5 12.5 8 12.5C8.5 12.5 8.9 12.2 9.1 11.7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
              </svg>
            </Button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#fafaf7] px-2.5 pr-3 text-sm font-medium text-[#575b55] transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/60 hover:text-[#1f221c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40"
            >
              <Avatar initials="C" compact />
              <span className="hidden sm:block">Credo workspace</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
