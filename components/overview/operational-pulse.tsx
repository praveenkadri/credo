import { SurfacePanel } from "@/components/ui-patterns/surface-panel";
import { StatBlock } from "@/components/ui-patterns/stat-block";

export function OperationalPulse() {
  return (
    <SurfacePanel
      title="Operational pulse"
      eyebrow="Interpreted signals"
      tone="soft"
      compact
      className="mt-6 shell-enter shell-enter-delay-3"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatBlock quiet label="Payroll flow" value="3 runs progressing normally" helper="No intervention needed." />
        <StatBlock quiet label="Invoice pressure" value="Backlog forming in 1 company" helper="12 invoices older than five days." />
        <StatBlock quiet label="Compliance readiness" value="2 filings inside seven-day window" helper="1 packet pending review." />
      </div>
    </SurfacePanel>
  );
}
