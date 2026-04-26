"use client";

import { useActionState, useState } from "react";
import {
  createCompanySetupAction,
  type CreateCompanySetupActionState,
} from "@/app/companies/new/actions";
import { SoftNotice } from "@/components/system/SoftNotice";
import { Input } from "@/components/ui-primitives/input";
import { Button } from "@/components/ui-primitives/button";

const initialActionState: CreateCompanySetupActionState = {};

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export function FirstCompanyOnboarding({ firstName }: { firstName?: string }) {
  const [sameAsCompanyName, setSameAsCompanyName] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [actionState, formAction] = useActionState(createCompanySetupAction, initialActionState);

  // TODO(auth): wire authenticated user profile first name.
  const welcomeLabel = firstName?.trim() ? `Welcome ${firstName.trim()}` : "Welcome";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[760px] items-center px-5 py-10">
      <div className="w-full">
        <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-[#1f221c]">{welcomeLabel}</h1>
        <p className="mt-2 max-w-[680px] text-[15px] leading-[1.55] text-neutral-600">
          Create your first company to start tracking payroll, invoices, and activity.
        </p>

        <form
          action={formAction}
          className="mt-8 rounded-[28px] bg-white/70 p-7 ring-1 ring-neutral-200/40 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:p-8"
          onSubmit={(event) => {
            if (!companyName.trim()) {
              setLocalError("Add the company name and try again.");
              event.preventDefault();
              return;
            }

            if (!(sameAsCompanyName ? companyName : legalName).trim()) {
              setLocalError("Add the legal name and try again.");
              event.preventDefault();
              return;
            }

            setLocalError(null);
          }}
        >
          <div className="space-y-4">
            <Field label="Company name">
              <Input
                name="companyName"
                value={companyName}
                onChange={(event) => {
                  const next = event.target.value;
                  setCompanyName(next);
                  if (sameAsCompanyName) {
                    setLegalName(next);
                  }
                }}
                required
                className={FIELD_CLASS}
              />
            </Field>

            <Field label="Legal name">
              <Input
                name="legalName"
                value={sameAsCompanyName ? companyName : legalName}
                onChange={(event) => setLegalName(event.target.value)}
                required
                readOnly={sameAsCompanyName}
                className={FIELD_CLASS}
              />
            </Field>

            <label className="flex items-center gap-2.5 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-neutral-200/50">
              <input
                name="sameAsCompanyName"
                type="checkbox"
                checked={sameAsCompanyName}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setSameAsCompanyName(checked);
                  if (checked) {
                    setLegalName(companyName);
                  }
                }}
                className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
              />
              <span className="text-[12px] text-neutral-700">Legal name is same as company name</span>
            </label>
          </div>

          {localError ? (
            <SoftNotice
              title="We couldn’t create the company"
              description={localError}
              variant="error"
              className="mt-5"
            />
          ) : null}

          {!localError && actionState.fieldErrors?.companyName ? (
            <SoftNotice
              title="We couldn’t create the company"
              description={actionState.fieldErrors.companyName}
              variant="error"
              className="mt-5"
            />
          ) : null}

          {!localError && !actionState.fieldErrors?.companyName && actionState.error ? (
            <SoftNotice
              title={actionState.error.title}
              description={actionState.error.description}
              variant="error"
              className="mt-5"
            />
          ) : null}

          <div className="mt-6">
            <Button type="submit" variant="primary">
              Create company
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
