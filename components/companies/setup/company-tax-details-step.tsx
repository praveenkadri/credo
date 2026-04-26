import { Input } from "@/components/ui-primitives/input";
import type { CompanySetupValues } from "@/components/companies/setup/types";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
      {hint ? <p className="text-[12px] text-neutral-500">{hint}</p> : null}
    </label>
  );
}

export function CompanyTaxDetailsStep({
  values,
  onChange,
}: {
  values: CompanySetupValues;
  onChange: (key: keyof CompanySetupValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="BIN number">
        <Input
          name="binNumber"
          value={values.binNumber}
          onChange={(event) => onChange("binNumber", event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>

      <Field label="Payroll number" hint="Used for payroll remittance and reporting.">
        <Input
          name="payrollNumber"
          value={values.payrollNumber}
          onChange={(event) => onChange("payrollNumber", event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>

      <Field label="HST number" hint="Used for invoices and tax documents.">
        <Input
          name="hstNumber"
          value={values.hstNumber}
          onChange={(event) => onChange("hstNumber", event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>

      <Field label="Business number">
        <Input
          name="businessNumber"
          value={values.businessNumber}
          onChange={(event) => onChange("businessNumber", event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>
    </div>
  );
}
