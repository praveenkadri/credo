import { Input } from "@/components/ui-primitives/input";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

export function FileUploadField({
  label,
  name,
  accept,
  hint,
}: {
  label: string;
  name: string;
  accept: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      <Input name={name} type="file" accept={accept} className={FIELD_CLASS + " pt-3"} />
      {hint ? <p className="text-[12px] text-neutral-500">{hint}</p> : null}
    </label>
  );
}
