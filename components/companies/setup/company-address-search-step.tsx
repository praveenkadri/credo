import { MapboxAddressSearch, type MapboxAddressSuggestion } from "@/components/forms/MapboxAddressSearch";
import type { CompanySetupValues } from "@/components/companies/setup/types";

export function CompanyAddressSearchStep({
  values,
  onSearchChange,
  onAddressSelected,
  onManualEntry,
}: {
  values: CompanySetupValues;
  onSearchChange: (value: string) => void;
  onAddressSelected: (suggestion: MapboxAddressSuggestion) => void;
  onManualEntry: () => void;
}) {
  return (
    <div className="space-y-4">
      <MapboxAddressSearch
        query={values.addressSearchQuery}
        onQueryChange={onSearchChange}
        onSelect={onAddressSelected}
        onManualEntry={onManualEntry}
      />
    </div>
  );
}
