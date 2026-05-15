import { BrandIcon, type BrandIconName, type BrandTone } from "@/components/brand/brand-visuals";

type IconName =
  | "payroll"
  | "invoice"
  | "person"
  | "document"
  | "check"
  | "plus"
  | "run"
  | "upload"
  | "report"
  | "approve"
  | "settings";

const ICON_MAP: Record<IconName, BrandIconName> = {
  payroll: "payroll",
  invoice: "invoice",
  person: "person",
  document: "document",
  check: "check",
  plus: "plus",
  run: "payroll",
  upload: "upload",
  report: "report",
  approve: "approve",
  settings: "settings",
};

const TONE_MAP: Record<IconName, BrandTone> = {
  payroll: "sand",
  invoice: "sand",
  person: "sky",
  document: "lavender",
  check: "olive",
  plus: "sand",
  run: "olive",
  upload: "lavender",
  report: "lavender",
  approve: "olive",
  settings: "lavender",
};

export function CompanyIcon({ name, className }: { name: IconName; className?: string }) {
  return <BrandIcon icon={ICON_MAP[name]} tone={TONE_MAP[name]} size="sm" className={className} />;
}
