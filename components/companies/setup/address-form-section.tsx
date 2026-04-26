import { Input } from "@/components/ui-primitives/input";
import type { CompanySetupValues } from "@/components/companies/setup/types";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

const SELECT_CLASS =
  "h-[52px] w-full rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 outline-none transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export function AddressFormSection({
  values,
  onChange,
}: {
  values: CompanySetupValues;
  onChange: (key: keyof CompanySetupValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Address">
        <Input
          name="streetAddress"
          value={values.streetAddress}
          onChange={(event) => onChange("streetAddress", event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>

      <Field label="Apartment, suite, etc.">
        <Input
          name="unitSuite"
          value={values.unitSuite}
          onChange={(event) => onChange("unitSuite", event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City">
          <Input
            name="city"
            value={values.city}
            onChange={(event) => onChange("city", event.target.value)}
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Province">
          <select
            name="provinceState"
            value={values.provinceState}
            onChange={(event) => onChange("provinceState", event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">Select province</option>
            {PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Postal code">
          <Input
            name="postalCode"
            value={values.postalCode}
            onChange={(event) => onChange("postalCode", event.target.value)}
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Country">
          <Input
            name="country"
            value={values.country}
            onChange={(event) => onChange("country", event.target.value)}
            placeholder="Canada"
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      {/* TODO(Mapbase): Add Mapbase validation and map preview hook in this reusable section when available. */}
    </div>
  );
}
