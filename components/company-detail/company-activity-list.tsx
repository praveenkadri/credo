import type { CompanyActivityGroupData } from "@/components/company-detail/company-detail-data";
import { CompanyActivityGroup } from "@/components/company-detail/company-activity-group";

export function CompanyActivityList({ groups }: { groups: CompanyActivityGroupData[] }) {
  return (
    <section className="shell-enter shell-enter-delay-2 mt-12">
      <h2 className="mb-5 text-[22px] font-semibold tracking-[-0.025em] text-[#1f221c]">Recent activity</h2>
      <div className="space-y-8">
        {groups.map((group) => (
          <CompanyActivityGroup key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
