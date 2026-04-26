import type { CompanySetupStep } from "@/components/companies/setup/types";
import { Button } from "@/components/ui-primitives/button";
import { useContent } from "@/lib/useContent";

export function CompanySetupStepHeader({
  step,
  totalSteps = 5,
  title,
  subtitle,
  reassurance,
  brandLabel,
  contextLabel,
  onBack,
  showStepLabel = true,
}: {
  step: CompanySetupStep;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  reassurance?: string;
  brandLabel?: string;
  contextLabel?: string;
  onBack?: () => void;
  showStepLabel?: boolean;
}) {
  const c = useContent();
  const isFirstStep = step === 1;
  const stepLabel = c.company.setup.stepLabel
    .replace("{step}", String(step))
    .replace("{totalSteps}", String(totalSteps));

  return (
    <div className="mb-4">
      {!isFirstStep ? (
        <Button type="button" variant="secondary" onClick={onBack} className="mb-4">
          ← {c.common.back}
        </Button>
      ) : null}
      {brandLabel ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">{brandLabel}</p>
      ) : null}
      {contextLabel ? (
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">{contextLabel}</p>
      ) : null}
      {showStepLabel ? (
        <p className="type-caption mt-1 text-neutral-400">
          {stepLabel}
        </p>
      ) : null}
      <h1 className="type-page-title mt-2">{title}</h1>
      {subtitle ? <p className="type-body mt-2 max-w-[640px] text-neutral-600">{subtitle}</p> : null}
      {reassurance ? <p className="type-body-small mt-2 text-neutral-500">{reassurance}</p> : null}
    </div>
  );
}
