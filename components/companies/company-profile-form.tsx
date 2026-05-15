"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui-primitives/input";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import { MapboxAddressField } from "@/components/forms/MapboxAddressField";
import { SoftNotice } from "@/components/system/SoftNotice";
import {
  createCompanyProfileAction,
  type CompanyProfileActionState,
  updateCompanyProfileAction,
} from "@/app/companies/profile-actions";
import type { CompanyProfile } from "@/lib/data/companies";
import { normalizeAddressValue, type AddressValue } from "@/lib/mapbox/address-search";
import { routes } from "@/lib/routes";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-[#fafaf7] px-4 text-[14px] text-[#575b55] transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f1f2ef] focus:bg-[#f1f2ef] focus:text-[#1f221c] focus:ring-2 focus:ring-[var(--action-ring)]";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] bg-[#fafaf7] p-6 shadow-[0_1px_1px_rgba(31,34,28,0.02)] md:p-7">
      <h2 className="type-card-title">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="type-label text-neutral-600">{label}</span>
      {children}
      {hint ? <p className="type-body-small text-neutral-500">{hint}</p> : null}
    </label>
  );
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  const label = pending
    ? mode === "create"
      ? "Creating…"
      : "Saving…"
    : mode === "create"
      ? "Create company"
      : "Save changes";

  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {label}
    </Button>
  );
}

const initialState: CompanyProfileActionState = {};

export function CompanyProfileForm({
  mode,
  companyId,
  defaultProfile,
  focusSection,
}: {
  mode: "create" | "edit";
  companyId?: string;
  defaultProfile?: CompanyProfile;
  focusSection?: "identity" | "address" | "tax" | "authorization";
}) {
  const [companyName, setCompanyName] = useState(defaultProfile?.companyName ?? "");
  const [legalName, setLegalName] = useState(defaultProfile?.legalName ?? "");
  const [sameAsCompanyName, setSameAsCompanyName] = useState(defaultProfile?.sameAsCompanyName ?? true);
  const [address, setAddress] = useState<AddressValue>(
    normalizeAddressValue({
      line1: defaultProfile?.streetAddress ?? "",
      unit: defaultProfile?.unitSuite ?? "",
      hasSubpremise: Boolean(defaultProfile?.unitSuite),
      city: defaultProfile?.city ?? "",
      province: defaultProfile?.provinceState ?? "",
      postalCode: defaultProfile?.postalCode ?? "",
      country: defaultProfile?.country ?? "CA",
      source: defaultProfile?.streetAddress ? "manual" : "",
      verified: false,
    })
  );

  const action = useMemo(() => {
    if (mode === "edit" && companyId) {
      return updateCompanyProfileAction.bind(null, companyId);
    }
    return createCompanyProfileAction;
  }, [mode, companyId]);

  const [state, formAction] = useActionState(action, initialState);
  const show = (section: "identity" | "address" | "tax" | "authorization") =>
    !focusSection || focusSection === section;

  return (
    <form action={formAction} className="space-y-5">
      {show("identity") ? (
        <SectionCard title="Company identity">
        <div className="space-y-4">
          <Field label="Company name" hint="This is how the company appears in Credo.">
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
              value={legalName}
              onChange={(event) => setLegalName(event.target.value)}
              required
              readOnly={sameAsCompanyName}
              className={FIELD_CLASS}
            />
          </Field>

          <label className="flex items-center gap-2.5 rounded-xl bg-[#f3f4ef] px-3 py-2">
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
              className="h-4 w-4 rounded border-neutral-300 accent-[var(--action-primary)] focus:ring-[var(--action-ring)]"
            />
            <span className="type-body-small text-neutral-700">Legal name is same as company name</span>
          </label>

          <Field label="Business established date">
            <Input
              name="establishedDate"
              type="date"
              defaultValue={defaultProfile?.establishedDate ?? ""}
              className={FIELD_CLASS}
            />
          </Field>

          <Field label="Company logo upload">
            <Input name="logoFile" type="file" accept="image/*" className={FIELD_CLASS + " pt-3"} />
          </Field>
          <input type="hidden" name="existingLogoUrl" value={defaultProfile?.logoUrl ?? ""} />
        </div>
        </SectionCard>
      ) : null}

      {show("address") ? (
        <SectionCard title="Address">
        <MapboxAddressField value={address} onChange={setAddress} defaultCountry="CA" allowManualEntry />
        </SectionCard>
      ) : null}

      {show("tax") ? (
        <SectionCard title="Tax details">
        <div className="space-y-4">
          <Field label="HST number">
            <Input name="hstNumber" defaultValue={defaultProfile?.hstNumber ?? ""} className={FIELD_CLASS} />
          </Field>
          <Field label="Payroll number">
            <Input
              name="payrollNumber"
              defaultValue={defaultProfile?.payrollNumber ?? ""}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label="BIN number">
            <Input name="binNumber" defaultValue={defaultProfile?.binNumber ?? ""} className={FIELD_CLASS} />
          </Field>
          <Field label="Business number">
            <Input
              name="businessNumber"
              defaultValue={defaultProfile?.businessNumber ?? ""}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label="Fiscal year end">
            <Input
              name="fiscalYearEnd"
              defaultValue={defaultProfile?.fiscalYearEnd ?? ""}
              placeholder="e.g. December 31"
              className={FIELD_CLASS}
            />
          </Field>
          <p className="type-body-small text-neutral-500">
            Some tax fields are stored in profile metadata until dedicated schema columns are available.
          </p>
        </div>
        </SectionCard>
      ) : null}

      {show("authorization") ? (
        <SectionCard title="Authorization">
        <div className="space-y-4">
          <Field label="Director name">
            <Input
              name="directorName"
              defaultValue={defaultProfile?.directorName ?? ""}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label="Director title">
            <Input
              name="directorTitle"
              defaultValue={defaultProfile?.directorTitle ?? ""}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label="Director signature upload">
            <Input name="signatureFile" type="file" accept="image/*" className={FIELD_CLASS + " pt-3"} />
          </Field>
          <input type="hidden" name="existingSignatureUrl" value={defaultProfile?.signatureUrl ?? ""} />
        </div>
        </SectionCard>
      ) : null}

      {state.error ? (
        <SoftNotice
          title={mode === "create" ? "We couldn’t create the company" : "We couldn’t save company details"}
          description={state.error}
          variant="error"
        />
      ) : null}

      <div className="flex items-center justify-center gap-3 pt-2">
        <SubmitButton mode={mode} />
        <Link
          href={mode === "edit" && companyId ? routes.companyProfile(companyId) : routes.home}
          className={buttonClassName("secondary")}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
