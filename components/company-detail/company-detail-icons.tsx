import { cn } from "@/lib/utils";

type IconName =
  | "payroll"
  | "invoice"
  | "person"
  | "document"
  | "check"
  | "plus"
  | "run"
  | "upload"
  | "report"
  | "approve"
  | "settings";

export function CompanyIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100/75 text-[#63695f] ring-1 ring-white/60",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.6">
        {name === "payroll" ? <path d="M3.5 4.5h13v11h-13zM3.5 8h13M7 12h2.2M11 12h2" /> : null}
        {name === "invoice" ? <path d="M5 3.5h8l2 2v11H5zM13 3.5v3h3M7 10h6M7 13h6" /> : null}
        {name === "person" ? <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.5 16a5.5 5.5 0 0 1 11 0" /> : null}
        {name === "document" ? <path d="M5 3.5h8l2 2v11H5zM13 3.5v3h3M7 10h6M7 13h4" /> : null}
        {name === "check" ? <path d="m5.5 10 3 3 6-6" /> : null}
        {name === "plus" ? <path d="M10 5v10M5 10h10" /> : null}
        {name === "run" ? <path d="M6 14.5h8M6 10.5h8M10 6.5h4" /> : null}
        {name === "upload" ? <path d="M10 13V5m0 0 3 3m-3-3L7 8M5 14.5h10" /> : null}
        {name === "report" ? <path d="M5 15.5h10M7 13V9m3 4V6m3 7v-3" /> : null}
        {name === "approve" ? <path d="M4.5 10h2.4l1.4 3 2.2-6 1.8 4h3.2" /> : null}
        {name === "settings" ? (
          <>
            <path d="M10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
            <path d="m3.8 11 1.3.2.5 1.1-.8 1 .9 1.5 1.2-.4 1 .8v1.2h1.8v-1.2l1-.8 1.2.4.9-1.5-.8-1 .5-1.1 1.3-.2V9l-1.3-.2-.5-1.1.8-1-.9-1.5-1.2.4-1-.8V3.6H8.9v1.2l-1 .8-1.2-.4-.9 1.5.8 1-.5 1.1-1.3.2Z" />
          </>
        ) : null}
      </svg>
    </span>
  );
}
