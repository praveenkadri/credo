import type { CompanyActivityGroupData } from "@/components/company-detail/company-detail-data";
import { CompanyActivityGroup } from "@/components/company-detail/company-activity-group";

export function CompanyActivityList({ groups }: { groups: CompanyActivityGroupData[] }) {
  return (
    <section className="shell-enter shell-enter-delay-1 mt-3">
      <h2 className="mb-4 text-[18px] font-semibold leading-tight tracking-[-0.01em] text-[var(--credo-ink)]">Recent activity</h2>
      {groups.length ? (
        <div className="space-y-7">
          {groups.map((group) => (
            <CompanyActivityGroup key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[var(--credo-surface-warm)] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.72)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
          <h3 className="text-[15px] font-semibold leading-tight text-[var(--credo-ink)]">No recent activity yet</h3>
          <p className="mt-1.5 max-w-[520px] text-[13px] leading-[1.45] text-[var(--credo-muted)]">
            Employee and payroll updates will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
