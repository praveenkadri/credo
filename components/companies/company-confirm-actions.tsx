"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { SoftNotice } from "@/components/system/SoftNotice";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import {
  confirmCompanyProfileAction,
  type CompanyProfileActionState,
} from "@/app/companies/profile-actions";

const initialState: CompanyProfileActionState = {};

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Saving…" : "Confirm company"}
    </Button>
  );
}

export function CompanyConfirmActions({ companyId }: { companyId: string }) {
  const action = confirmCompanyProfileAction.bind(null, companyId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="rounded-[28px] bg-white/70 p-6 ring-1 ring-neutral-200/40 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
      <div className="flex flex-wrap items-center gap-3">
        <ConfirmButton />
        <Link
          href={`/companies/${companyId}/profile/edit`}
          className={buttonClassName("secondary")}
        >
          Back to edit
        </Link>
      </div>

      {state.error ? (
        <SoftNotice
          title="We couldn’t confirm the company"
          description={state.error}
          variant="error"
          className="mt-3"
        />
      ) : null}
    </form>
  );
}
