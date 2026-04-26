"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui-primitives/button";
import { useContent } from "@/lib/useContent";

export function SetupNavigationButtons({
  canGoBack,
  onBack,
  onNext,
  isFinal,
  nextLabel,
  backLabel,
  finalLabel,
}: {
  canGoBack: boolean;
  onBack: () => void;
  onNext?: () => void;
  isFinal: boolean;
  nextLabel?: string;
  backLabel?: string;
  finalLabel?: string;
}) {
  const c = useContent();
  const { pending } = useFormStatus();
  const resolvedNextLabel = nextLabel || c.common.continue;
  const resolvedBackLabel = backLabel || c.common.back;
  const resolvedFinalLabel = finalLabel || c.company.create.createButton;

  return (
    <div className="mt-7 flex items-center justify-center gap-3">
      {canGoBack ? (
        <Button type="button" variant="secondary" onClick={onBack}>
          {resolvedBackLabel}
        </Button>
      ) : null}

      {isFinal ? (
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? c.company.create.creating : resolvedFinalLabel}
        </Button>
      ) : (
        <Button type="button" variant="primary" onClick={onNext}>
          {resolvedNextLabel}
        </Button>
      )}
    </div>
  );
}
