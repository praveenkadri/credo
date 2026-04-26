import { Input } from "@/components/ui-primitives/input";
import { SoftNotice } from "@/components/system/SoftNotice";
import type { CompanySetupValues } from "@/components/companies/setup/types";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

export function CompanyFiscalDetailsStep({
  values,
  onChange,
}: {
  values: CompanySetupValues;
  onChange: (key: keyof CompanySetupValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-[12px] font-medium text-neutral-600">Fiscal year end</span>
        <Input
          name="fiscalYearEnd"
          value={values.fiscalYearEnd}
          onChange={(event) => onChange("fiscalYearEnd", event.target.value)}
          placeholder="e.g. December 31"
          className={FIELD_CLASS}
        />
      </label>

      <SoftNotice
        title="Fiscal setup uses profile metadata"
        description="Details are saved now and can move to dedicated fields later."
        variant="info"
      />
    </div>
  );
}
