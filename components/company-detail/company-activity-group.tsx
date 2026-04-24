import type { CompanyActivityGroupData } from "@/components/company-detail/company-detail-data";
import { CompanyActivityRow } from "@/components/company-detail/company-activity-row";

export function CompanyActivityGroup({ group }: { group: CompanyActivityGroupData }) {
  return (
    <section>
      <h3 className="mb-3 text-[12px] font-medium uppercase tracking-[0.11em] text-neutral-400">{group.label}</h3>
      <div className="space-y-3">
        {group.items.map((item) => (
          <CompanyActivityRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
