import { Input } from "@/components/ui-primitives/input";
import { FileUploadField } from "@/components/companies/setup/file-upload-field";
import type { CompanySetupValues } from "@/components/companies/setup/types";

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

export function CompanyBusinessDetailsStep({
  values,
  onChange,
}: {
  values: CompanySetupValues;
  onChange: (key: keyof CompanySetupValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Business established date">
        <Input
          name="establishedDate"
          type="date"
          value={values.establishedDate}
          onChange={(event) => onChange("establishedDate", event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>

      <FileUploadField
        label="Company logo upload"
        name="logoFile"
        accept="image/*"
        hint="Optional. Add a logo to personalize the company profile."
      />
    </div>
  );
}
