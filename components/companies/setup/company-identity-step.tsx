import { Input } from "@/components/ui-primitives/input";
import type { CompanySetupValues } from "@/components/companies/setup/types";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
      {hint ? <p className="text-[12px] text-neutral-500">{hint}</p> : null}
    </label>
  );
}

export function CompanyIdentityStep({
  values,
  onChange,
  onToggleSameAs,
}: {
  values: CompanySetupValues;
  onChange: (key: keyof CompanySetupValues, value: string) => void;
  onToggleSameAs: (checked: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Company name" hint="This is how the company appears in Credo.">
        <Input
          name="companyName"
          value={values.companyName}
          onChange={(event) => onChange("companyName", event.target.value)}
          required
          className={FIELD_CLASS}
        />
      </Field>

      <Field label="Legal name">
        <Input
          name="legalName"
          value={values.legalName}
          onChange={(event) => onChange("legalName", event.target.value)}
          required
          readOnly={values.sameAsCompanyName}
          className={FIELD_CLASS}
        />
      </Field>

      <label className="flex items-center gap-2.5 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-neutral-200/50">
        <input
          name="sameAsCompanyName"
          type="checkbox"
          checked={values.sameAsCompanyName}
          onChange={(event) => onToggleSameAs(event.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
        />
        <span className="text-[12px] text-neutral-700">Legal name is same as company name</span>
      </label>
    </div>
  );
}
