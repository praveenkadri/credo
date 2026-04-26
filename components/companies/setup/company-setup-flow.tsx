"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createCompanySetupAction,
  type CreateCompanySetupActionState,
} from "@/app/companies/new/actions";
import { CompanySetupCard } from "@/components/companies/setup/company-setup-card";
import { SoftNotice } from "@/components/system/SoftNotice";
import { CompanySetupStepHeader } from "@/components/companies/setup/company-setup-step-header";
import { SetupNavigationButtons } from "@/components/companies/setup/setup-navigation-buttons";
import { MapboxAddressField } from "@/components/forms/MapboxAddressField";
import { Input } from "@/components/ui-primitives/input";
import {
  isAddressComplete,
  normalizeAddressValue,
  type AddressValue,
} from "@/lib/mapbox/address-search";
import { supabase } from "@/lib/supabase/client";
import { useSessionDraft } from "@/hooks/useSessionDraft";
import { useContent } from "@/lib/useContent";

const initialActionState: CreateCompanySetupActionState = {};

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:outline-none focus-visible:outline-none focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

type SetupStep = 1 | 2;
type CompanySetupDraft = {
  step: SetupStep;
  companyName: string;
  legalName: string;
  legalSameAsCompanyName: boolean;
  address: AddressValue;
  showUnitSuite: boolean;
};
const COMPANY_SETUP_DRAFT_KEY = "credo:create-company:draft";
const INITIAL_DRAFT: CompanySetupDraft = {
  step: 1,
  companyName: "",
  legalName: "",
  legalSameAsCompanyName: true,
  address: normalizeAddressValue({
    country: "CA",
    source: "",
    verified: false,
    hasSubpremise: false,
  }),
  showUnitSuite: false,
};

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
      <span className="text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
      {hint ? <p className="text-[12px] text-neutral-500">{hint}</p> : null}
    </label>
  );
}

export function CompanySetupFlow({ mode = "default" }: { mode?: "first" | "default" }) {
  const c = useContent();
  const { value: draft, setValue: setDraft } = useSessionDraft<CompanySetupDraft>(
    COMPANY_SETUP_DRAFT_KEY,
    INITIAL_DRAFT
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [companyNameTouched, setCompanyNameTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [localCompanyNameError, setLocalCompanyNameError] = useState<string | null>(null);
  const [localAddressError, setLocalAddressError] = useState<string | null>(null);
  const [sessionAccessToken, setSessionAccessToken] = useState("");
  const [sessionUserId, setSessionUserId] = useState("");
  const [sessionWorkspaceId, setSessionWorkspaceId] = useState("");
  const [actionState, formAction] = useActionState(createCompanySetupAction, initialActionState);

  const isFirstMode = mode === "first";
  const step = draft.step;
  const companyName = draft.companyName;
  const legalName = draft.legalSameAsCompanyName ? draft.companyName : draft.legalName;
  const address = draft.address;
  const companyNameMissing = !companyName.trim();
  const addressMissing = !isAddressComplete(address);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        const session = data.session;
        const user = session?.user;
        const appMeta = user?.app_metadata as Record<string, unknown> | undefined;
        const userMeta = user?.user_metadata as Record<string, unknown> | undefined;
        setSessionAccessToken(session?.access_token ?? "");
        setSessionUserId(user?.id ?? "");
        setSessionWorkspaceId(
          String(
            appMeta?.workspace_id ??
              userMeta?.workspace_id ??
              appMeta?.organization_id ??
              userMeta?.organization_id ??
              ""
          )
        );
      })
      .catch(() => {
        if (!active) return;
        setSessionAccessToken("");
        setSessionUserId("");
        setSessionWorkspaceId("");
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      const appMeta = user?.app_metadata as Record<string, unknown> | undefined;
      const userMeta = user?.user_metadata as Record<string, unknown> | undefined;
      setSessionAccessToken(session?.access_token ?? "");
      setSessionUserId(user?.id ?? "");
      setSessionWorkspaceId(
        String(
          appMeta?.workspace_id ??
            userMeta?.workspace_id ??
            appMeta?.organization_id ??
            userMeta?.organization_id ??
            ""
        )
      );
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  function nextStep() {
    setCompanyNameTouched(true);
    if (companyNameMissing) {
      setLocalCompanyNameError(c.company.create.companyNameRequired);
      return;
    }

    setLocalCompanyNameError("");
    setDraft((previous) => ({
      ...previous,
      step: 2,
    }));
  }

  const companyNameError = localCompanyNameError ?? actionState.fieldErrors?.companyName;
  const addressError = localAddressError ?? actionState.fieldErrors?.address;
  const showCompanyNameError = Boolean(companyNameError && (companyNameTouched || formSubmitted));
  const showAddressError = Boolean(addressError && (addressTouched || formSubmitted));
  const formError = actionState.error;
  const companyNameFieldClass = showCompanyNameError
    ? `${FIELD_CLASS} bg-rose-50/40 text-[#4b1d1d] ring-red-200/70 focus:ring-red-200/80`
    : FIELD_CLASS;

  return (
    <form
      action={formAction}
      className="mt-3 flex min-h-[calc(100vh-220px)] flex-col"
      onSubmit={(event) => {
        if (step !== 2) {
          event.preventDefault();
          return;
        }

        setFormSubmitted(true);
        if (companyNameMissing) {
          setCompanyNameTouched(true);
          setLocalCompanyNameError(c.company.create.companyNameRequired);
          event.preventDefault();
          return;
        }

        if (addressMissing) {
          setAddressTouched(true);
          setLocalAddressError(c.company.create.addressRequired);
          event.preventDefault();
          return;
        }

        setLocalCompanyNameError("");
        setLocalAddressError("");
      }}
    >
      <CompanySetupStepHeader
        step={step}
        totalSteps={2}
        showStepLabel={false}
        title={
          isFirstMode
            ? step === 1
              ? c.company.create.firstCompanyTitle
              : c.company.create.title
            : c.company.create.enteringDetailsTitle
        }
        subtitle={
          isFirstMode
            ? step === 1
              ? c.company.create.firstCompanySubtitle
              : c.company.create.subtitle
            : c.company.create.enteringDetailsSubtitle
        }
        onBack={step === 2 ? () => setDraft((previous) => ({ ...previous, step: 1 })) : undefined}
      />

      {formError ? (
        <SoftNotice
          title={formError.title}
          description={formError.description}
          variant="error"
          className="mb-3 shell-enter"
        />
      ) : null}

      <CompanySetupCard>
        {step === 1 ? (
          <div className="space-y-4">
            <Field
              label={c.company.create.companyNameLabel}
              hint={c.company.create.companyNameHint}
            >
              <Input
                name="companyName"
                value={companyName}
                onChange={(event) => {
                  const nextCompanyName = event.target.value;
                  setDraft((previous) => ({
                    ...previous,
                    companyName: nextCompanyName,
                    legalName: previous.legalSameAsCompanyName ? nextCompanyName : previous.legalName,
                  }));
                  if (companyNameTouched || formSubmitted || actionState.fieldErrors?.companyName) {
                    setLocalCompanyNameError(
                      nextCompanyName.trim() ? "" : c.company.create.companyNameRequired
                    );
                  }
                }}
                onBlur={() => {
                  setCompanyNameTouched(true);
                  setLocalCompanyNameError(companyNameMissing ? c.company.create.companyNameRequired : "");
                }}
                required
                aria-invalid={showCompanyNameError}
                className={companyNameFieldClass}
              />
              {showCompanyNameError ? <p className="text-[12px] text-rose-900">{companyNameError}</p> : null}
            </Field>
          </div>
        ) : (
          <div className="space-y-4">
            <MapboxAddressField
              value={address}
              onTouchedChange={(touched) => {
                if (!touched) return;
                setAddressTouched(true);
                setLocalAddressError(addressMissing ? c.company.create.addressRequired : "");
              }}
              onChange={(next) => {
                setDraft((previous) => ({
                  ...previous,
                  address: next,
                }));
                const nextAddressMissing = !isAddressComplete(next);
                if (addressTouched || formSubmitted || actionState.fieldErrors?.address) {
                  setLocalAddressError(nextAddressMissing ? c.company.create.addressRequired : "");
                }
              }}
              required
              defaultCountry="CA"
              showRequiredError={showAddressError}
              requiredErrorMessage={addressError ?? c.company.create.requiredAddressHint}
              showUnitSuite={draft.showUnitSuite}
              onShowUnitSuiteChange={(next) =>
                setDraft((previous) => ({
                  ...previous,
                  showUnitSuite: next,
                }))
              }
            />
          </div>
        )}

        <input type="hidden" name="companyName" value={companyName} />
        <input type="hidden" name="legalName" value={legalName} />
        <input
          type="hidden"
          name="sameAsCompanyName"
          value={draft.legalSameAsCompanyName ? "on" : "off"}
        />
        <input type="hidden" name="sessionAccessToken" value={sessionAccessToken} />
        <input type="hidden" name="sessionUserId" value={sessionUserId} />
        <input type="hidden" name="sessionWorkspaceId" value={sessionWorkspaceId} />

        {step === 1 ? (
          <SetupNavigationButtons
            canGoBack={false}
            onBack={() => undefined}
            onNext={nextStep}
            isFinal={false}
            nextLabel={c.common.next}
          />
        ) : (
          <SetupNavigationButtons
            canGoBack={false}
            onBack={() => undefined}
            isFinal
            finalLabel={isFirstMode ? c.company.create.createButton : c.company.create.addButton}
          />
        )}
      </CompanySetupCard>
    </form>
  );
}
