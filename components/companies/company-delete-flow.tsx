"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { deleteCompanyAction, type DeleteCompanyActionState } from "@/app/companies/profile-actions";
import type { CompanyDeleteSummary } from "@/lib/data/companies";
import { SoftNotice } from "@/components/system/SoftNotice";
import { SuccessToast } from "@/components/system/SuccessToast";
import { supabase } from "@/lib/supabase/client";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import { useContent } from "@/lib/useContent";
import { routes } from "@/lib/routes";

type DeleteStep = "reason" | "confirm";

const initialState: DeleteCompanyActionState = {};

function DeleteButton({ disabled }: { disabled: boolean }) {
  const c = useContent();
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="primary" disabled={disabled || pending}>
      {pending ? c.company.delete.deleting : c.company.delete.deleteButton}
    </Button>
  );
}

export function CompanyDeleteFlow({ summary }: { summary: CompanyDeleteSummary }) {
  const c = useContent();
  const router = useRouter();
  const action = deleteCompanyAction.bind(null, summary.id);
  const [state, formAction] = useActionState(action, initialState);
  const [step, setStep] = useState<DeleteStep>("reason");
  const [reason, setReason] = useState("");
  const [reasonNote, setReasonNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [sessionAccessToken, setSessionAccessToken] = useState("");
  const [localError, setLocalError] = useState("");
  const [showDeletedToast, setShowDeletedToast] = useState(false);
  const reasons = [
    c.company.delete.reasons.createdByMistake,
    c.company.delete.reasons.noLongerActive,
    c.company.delete.reasons.duplicate,
    c.company.delete.reasons.movedSystem,
    c.company.delete.reasons.testingData,
    c.company.delete.reasons.other,
  ] as const;

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSessionAccessToken(data.session?.access_token ?? "");
      })
      .catch(() => {
        if (!active) return;
        setSessionAccessToken("");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.success) return;
    setShowDeletedToast(true);
    const timer = setTimeout(() => {
      router.push(state.redirectTo ?? routes.overviewDeleted());
    }, 380);
    return () => clearTimeout(timer);
  }, [router, state.redirectTo, state.success]);

  function onContinue() {
    if (!reason) {
      setLocalError(c.company.delete.reasonContinueError);
      return;
    }
    setLocalError("");
    setStep("confirm");
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-10">
      <SuccessToast message={showDeletedToast ? c.company.delete.successToast : undefined} />
      {step === "reason" ? (
        <>
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-[#1f221c]">
            {c.company.delete.reasonStepTitle}
          </h1>
          <p className="mt-2 max-w-[680px] text-[15px] leading-[1.55] text-neutral-600">
            {c.company.delete.reasonStepSubtitle}
          </p>

          <section className="mt-8 rounded-[28px] bg-white/70 p-7 ring-1 ring-neutral-200/40 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:p-8">
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                {c.company.delete.reasonLabel}
              </span>
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="h-[52px] w-full rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40"
              >
                <option value="">{c.company.delete.reasonSelectPlaceholder}</option>
                {reasons.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            {reason === c.company.delete.reasons.other ? (
              <label className="mt-4 block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                  {c.company.delete.reasonOtherLabel}
                </span>
                <input
                  value={reasonNote}
                  onChange={(event) => setReasonNote(event.target.value)}
                  placeholder={c.company.delete.reasonOtherPlaceholder}
                  className="h-[52px] w-full rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] placeholder:text-[#93988f] ring-1 ring-neutral-200/60 transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40"
                />
              </label>
            ) : null}

            {localError ? (
              <SoftNotice
                title={c.company.delete.softNoticeContinueTitle}
                description={localError}
                variant="error"
                className="mt-5"
              />
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={routes.company(summary.id)}
                className={buttonClassName("secondary")}
              >
                {c.common.cancel}
              </Link>
              <Button type="button" variant="primary" onClick={onContinue}>
                {c.company.delete.continueButton}
              </Button>
            </div>
          </section>
        </>
      ) : (
        <>
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-[#1f221c]">
            {c.company.delete.title}
          </h1>
          <p className="mt-2 max-w-[680px] text-[15px] leading-[1.55] text-neutral-600">
            {c.company.delete.subtitle}
          </p>

          <form
            action={formAction}
            className="mt-8 rounded-[28px] bg-white/70 p-7 ring-1 ring-neutral-200/40 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:p-8"
          >
            <input type="hidden" name="sessionAccessToken" value={sessionAccessToken} />
            <input type="hidden" name="deleteReason" value={reason} />
            <input type="hidden" name="deleteReasonNote" value={reasonNote} />

            <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-neutral-200/50">
              <p className="text-[15px] font-semibold text-[#1f221c]">{summary.name}</p>
              <p className="mt-1 text-[13px] text-neutral-600">
                {summary.employeeCount} {c.company.delete.summaryEmployees}
              </p>
              <div className="mt-3 grid gap-1 text-[12px] text-neutral-500">
                <p>
                  {c.company.delete.payrollNumberLabel}: {summary.payrollNumber || c.common.noDataFallback}
                </p>
                <p>
                  {c.company.delete.hstNumberLabel}: {summary.hstNumber || c.common.noDataFallback}
                </p>
                <p>
                  {c.company.delete.binNumberLabel}:{" "}
                  {summary.binNumber || summary.businessNumber || c.common.noDataFallback}
                </p>
              </div>
            </div>

            <label className="mt-5 flex items-start gap-2 rounded-xl bg-neutral-50/70 px-3 py-2.5 text-[13px] text-neutral-700 ring-1 ring-neutral-200/60">
              <input
                type="checkbox"
                name="confirmDelete"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-[var(--action-primary)] focus:ring-neutral-300"
              />
              <span>{c.company.delete.confirmCheckbox}</span>
            </label>

            {state.error ? (
              <SoftNotice
                title={c.company.delete.softNoticeDeleteTitle}
                description={state.error}
                variant="error"
                className="mt-5"
              />
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep("reason")}>
                {c.company.delete.backButton}
              </Button>
              <DeleteButton disabled={!confirmed} />
            </div>
          </form>
        </>
      )}
    </div>
  );
}
