import { AddressFormSection } from "@/components/companies/setup/address-form-section";
import type { CompanySetupValues } from "@/components/companies/setup/types";

export function CompanyAddressStep({
  values,
  onChange,
}: {
  values: CompanySetupValues;
  onChange: (key: keyof CompanySetupValues, value: string) => void;
}) {
  return <AddressFormSection values={values} onChange={onChange} />;
}
