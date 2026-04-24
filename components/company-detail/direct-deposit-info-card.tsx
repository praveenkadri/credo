import type { DirectDepositField } from "@/components/company-detail/company-detail-data";
import { CopyableInfoRow } from "@/components/company-detail/copyable-info-row";

export function DirectDepositInfoCard({ fields }: { fields: DirectDepositField[] }) {
  return (
    <div className="space-y-1">
      {fields.map((field) => (
        <CopyableInfoRow key={field.id} label={field.label} value={field.value} />
      ))}
    </div>
  );
}
