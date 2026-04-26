import { Input } from "@/components/ui-primitives/input";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export function AddressFormSection({
  defaults,
}: {
  defaults?: {
    streetAddress?: string;
    unitSuite?: string;
    city?: string;
    provinceState?: string;
    postalCode?: string;
    country?: string;
  };
}) {
  return (
    <div className="space-y-4">
      <Field label="Street address">
        <Input name="streetAddress" defaultValue={defaults?.streetAddress ?? ""} className={FIELD_CLASS} />
      </Field>

      <Field label="Unit/suite">
        <Input name="unitSuite" defaultValue={defaults?.unitSuite ?? ""} className={FIELD_CLASS} />
      </Field>

      <Field label="City">
        <Input name="city" defaultValue={defaults?.city ?? ""} className={FIELD_CLASS} />
      </Field>

      <Field label="Province/state">
        <Input name="provinceState" defaultValue={defaults?.provinceState ?? ""} className={FIELD_CLASS} />
      </Field>

      <Field label="Postal code">
        <Input name="postalCode" defaultValue={defaults?.postalCode ?? ""} className={FIELD_CLASS} />
      </Field>

      <Field label="Country">
        <Input name="country" defaultValue={defaults?.country ?? ""} className={FIELD_CLASS} />
      </Field>

      {/* TODO(Mapbase): Isolate address autocomplete/map validation here via a reusable hook/provider. */}
    </div>
  );
}
