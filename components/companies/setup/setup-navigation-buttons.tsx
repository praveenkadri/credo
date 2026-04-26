"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import { useContent } from "@/lib/useContent";

export function SetupNavigationButtons({
  canGoBack,
  onBack,
  onNext,
  isFinal,
  nextLabel,
  backLabel,
  finalLabel,
  pendingLabel,
  secondaryActionHref,
  secondaryActionLabel,
}: {
  canGoBack: boolean;
  onBack: () => void;
  onNext?: () => void;
  isFinal: boolean;
  nextLabel?: string;
  backLabel?: string;
  finalLabel?: string;
  pendingLabel?: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
}) {
  const c = useContent();
  const { pending } = useFormStatus();
  const resolvedNextLabel = nextLabel || c.common.continue;
  const resolvedBackLabel = backLabel || c.common.back;
  const resolvedFinalLabel = finalLabel || c.company.create.createButton;
  const resolvedPendingLabel = pendingLabel || c.company.create.creating;
  const resolvedSecondaryActionLabel = secondaryActionLabel || c.common.cancel;

  return (
    <div className="mt-7 flex items-center justify-center gap-3">
      {canGoBack ? (
        <Button type="button" variant="secondary" onClick={onBack}>
          {resolvedBackLabel}
        </Button>
      ) : null}

      {!canGoBack && secondaryActionHref ? (
        <Link href={secondaryActionHref} className={buttonClassName("secondary")}>
          {resolvedSecondaryActionLabel}
        </Link>
      ) : null}

      {isFinal ? (
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? resolvedPendingLabel : resolvedFinalLabel}
        </Button>
      ) : (
        <Button type="button" variant="primary" onClick={onNext}>
          {resolvedNextLabel}
        </Button>
      )}
    </div>
  );
}
