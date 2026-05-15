"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  generatePayStubPdfAction,
  regeneratePayStubPdfAction,
} from "@/app/documents/actions";
import { buttonClassName } from "@/components/ui-primitives/button";
import { type DocumentRecord } from "@/lib/documents-workspace";
import { routes } from "@/lib/routes";

export function DocumentPdfActions({
  document,
  compact = false,
  showDetailsLink = true,
}: {
  document: DocumentRecord;
  compact?: boolean;
  showDetailsLink?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const hasFile = Boolean(document.fileAvailable && document.openHref);
  const isPayStub = document.typeId === "pay-stub";
  const generationStatus = document.generationStatus ?? document.status;
  const isGenerating = generationStatus === "generating";
  const isFailed = generationStatus === "failed";
  const canGenerate = isPayStub && !hasFile && !isGenerating;

  function runGeneration(regenerate: boolean) {
    setError("");
    startTransition(async () => {
      const result = regenerate
        ? await regeneratePayStubPdfAction(document.id)
        : await generatePayStubPdfAction(document.id);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      {hasFile ? (
        <>
          <a
            href={document.openHref}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={buttonClassName("rowAction")}
          >
            Open PDF
          </a>
          <a
            href={document.downloadHref ?? document.openHref}
            onClick={(event) => event.stopPropagation()}
            className={buttonClassName("rowActionQuiet")}
          >
            Download PDF
          </a>
        </>
      ) : isGenerating ? (
        <button type="button" className={buttonClassName("rowAction")} disabled>
          Generating
        </button>
      ) : canGenerate ? (
        <button
          type="button"
          className={buttonClassName("rowAction")}
          disabled={isPending}
          onClick={(event) => {
            event.stopPropagation();
            runGeneration(isFailed);
          }}
        >
          {isPending ? "Working" : isFailed ? "Retry PDF" : "Generate PDF"}
        </button>
      ) : compact ? (
        <Link href={routes.document(document.id)} onClick={(event) => event.stopPropagation()} className={buttonClassName("rowAction")}>
          Details
        </Link>
      ) : null}

      {showDetailsLink && !compact && !hasFile ? (
        <Link href={routes.document(document.id)} onClick={(event) => event.stopPropagation()} className={buttonClassName("rowActionQuiet")}>
          View details
        </Link>
      ) : null}

      {error ? <p className="type-caption basis-full text-[#9f3a2f]">{error}</p> : null}
    </div>
  );
}
