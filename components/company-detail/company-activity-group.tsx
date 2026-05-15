import type { CompanyActivityGroupData } from "@/components/company-detail/company-detail-data";
import { CompanyActivityRow } from "@/components/company-detail/company-activity-row";

export function CompanyActivityGroup({ group }: { group: CompanyActivityGroupData }) {
  return (
    <section>
      <h3 className="type-eyebrow mb-2 text-[var(--credo-muted)]">{group.label}</h3>
      <div className="divide-y divide-[rgba(91,77,58,0.1)] overflow-hidden rounded-[22px] bg-[var(--credo-surface-warm)] shadow-[0_1px_0_rgba(255,255,255,0.74)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
        {group.items.map((item) => (
          <CompanyActivityRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
