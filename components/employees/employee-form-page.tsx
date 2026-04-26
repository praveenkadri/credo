"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CompanySetupCard } from "@/components/companies/setup/company-setup-card";
import { CompanySetupStepHeader } from "@/components/companies/setup/company-setup-step-header";
import { SetupNavigationButtons } from "@/components/companies/setup/setup-navigation-buttons";
import { MapboxAddressField } from "@/components/forms/MapboxAddressField";
import { SoftNotice } from "@/components/system/SoftNotice";
import { Input } from "@/components/ui-primitives/input";
import { useEmployeesStore } from "@/hooks/useEmployeesStore";
import {
  employeeToFormValues,
  emptyEmployeeFormValues,
  formValuesToEmployee,
  formatCurrency,
  type EmployeeFormValues,
} from "@/lib/data/employees";
import {
  isAddressComplete,
  normalizeAddressValue,
  type AddressValue,
} from "@/lib/mapbox/address-search";
import { routes, type EmployeeEditSection } from "@/lib/routes";
import { useContent } from "@/lib/useContent";

const FIELD_CLASS =
  "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:outline-none focus-visible:outline-none focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

type EmployeeSetupStep = 1 | 2 | 3 | 4 | 5;

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

export function EmployeeFormPage({
  mode,
  employeeId,
  focusSection,
}: {
  mode: "create" | "edit";
  employeeId?: string;
  focusSection?: EmployeeEditSection;
}) {
  const c = useContent();
  const view = c.employee;
  const router = useRouter();
  const { employees, saveEmployee } = useEmployeesStore();
  const cancelHref = mode === "edit" && employeeId ? routes.employee(employeeId) : routes.employees;
  const isFocusedSectionMode = mode === "edit" && Boolean(focusSection);
  const existingEmployee = useMemo(
    () => (employeeId ? employees.find((employee) => employee.id === employeeId) ?? null : null),
    [employeeId, employees]
  );

  const [step, setStep] = useState<EmployeeSetupStep>(() => resolveStepFromSection(focusSection));
  const [values, setValues] = useState<EmployeeFormValues>(() =>
    existingEmployee ? employeeToFormValues(existingEmployee) : emptyEmployeeFormValues()
  );
  const [address, setAddress] = useState<AddressValue>(() => addressValueFromFormValues(existingEmployee ? employeeToFormValues(existingEmployee) : emptyEmployeeFormValues()));
  const [showUnitSuite, setShowUnitSuite] = useState(() => Boolean((existingEmployee ? employeeToFormValues(existingEmployee) : emptyEmployeeFormValues()).unit));
  const [addressTouched, setAddressTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sinVisible, setSinVisible] = useState(false);

  useEffect(() => {
    const nextValues = existingEmployee ? employeeToFormValues(existingEmployee) : emptyEmployeeFormValues();
    setValues(nextValues);
    setAddress(addressValueFromFormValues(nextValues));
    setShowUnitSuite(Boolean(nextValues.unit));
  }, [existingEmployee, mode]);

  useEffect(() => {
    setStep(resolveStepFromSection(focusSection));
  }, [focusSection]);

  if (mode === "edit" && !existingEmployee) {
    return (
      <div className="w-full">
        <section className="mt-2 px-6 py-5">
          <SoftNotice title={view.noEmployeesTitle} description={view.noEmployeesDescription} variant="warning" />
        </section>
      </div>
    );
  }

  const addressMissing = !isAddressComplete(address);
  const showAddressError = step === 1 && addressMissing && (addressTouched || formSubmitted);

  function update<K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function applyAddress(nextAddress: AddressValue) {
    const normalized = normalizeAddressValue(nextAddress, "CA");
    setAddress(normalized);
    setValues((current) => ({
      ...current,
      streetAddress: normalized.line1 || normalized.formattedAddress,
      unit: normalized.unit,
      city: normalized.city,
      province: normalized.province,
      postalCode: normalized.postalCode,
      country: normalized.country,
    }));
  }

  function nextStep() {
    if (isFocusedSectionMode) return;
    setFormSubmitted(true);
    const nextError = validateStep(step, values, address, view);
    if (nextError) {
      setError(nextError);
      if (step === 1) {
        setAddressTouched(true);
      }
      return;
    }

    setError("");
    setFormSubmitted(false);
    setStep((current) => nextEmployeeStep(current));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormSubmitted(true);
    const nextError = isFocusedSectionMode
      ? validateStep(step, values, address, view)
      : validateStep(5, values, address, view) || validateAllSteps(values, address, view);

    if (nextError) {
      setError(nextError);
      return;
    }

    const employee = formValuesToEmployee(values, existingEmployee?.id);
    saveEmployee(employee);
    router.push(routes.employee(employee.id));
  }

  const headerTitle = isFocusedSectionMode ? sectionTitle(view, focusSection!) : mode === "edit" ? view.editEmployee : view.createTitle;
  const headerSubtitle = isFocusedSectionMode
    ? sectionSubtitle(view, focusSection!)
    : mode === "edit"
      ? view.editDescription
      : view.createDescription;
  const finalActionLabel = isFocusedSectionMode ? c.common.saveChanges : view.saveStep;

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="mx-auto w-full max-w-[700px] shell-enter">
          <CompanySetupStepHeader
            step={step}
            totalSteps={isFocusedSectionMode ? 1 : 5}
            showStepLabel={false}
            title={headerTitle}
            subtitle={headerSubtitle}
            onBack={
              isFocusedSectionMode
                ? () => {
                    router.push(cancelHref);
                  }
                : step > 1
                ? () => {
                    setError("");
                    setFormSubmitted(false);
                    setStep((current) => previousEmployeeStep(current));
                  }
                : undefined
            }
          />

          {error ? (
            <SoftNotice title={view.validation.title} description={error} variant="error" className="mb-3 shell-enter" />
          ) : null}

          <CompanySetupCard>
            {step === 1 ? (
              <div className="space-y-4">
                <Field label={view.fullName}>
                  <Input
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    autoComplete="name"
                    className={FIELD_CLASS}
                  />
                </Field>
                <Field label={view.email}>
                  <Input
                    type="email"
                    value={values.email}
                    onChange={(event) => update("email", event.target.value)}
                    autoComplete="email"
                    className={FIELD_CLASS}
                  />
                </Field>
                <Field label={view.phone}>
                  <Input
                    type="tel"
                    value={values.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    autoComplete="tel"
                    className={FIELD_CLASS}
                  />
                </Field>
                <MapboxAddressField
                  value={address}
                  onChange={applyAddress}
                  onTouchedChange={(touched) => {
                    if (!touched) return;
                    setAddressTouched(true);
                  }}
                  required
                  defaultCountry="CA"
                  showRequiredError={showAddressError}
                  requiredErrorMessage={view.validation.addressRequired}
                  showUnitSuite={showUnitSuite}
                  onShowUnitSuiteChange={setShowUnitSuite}
                />
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <Field label={view.role}>
                  <Input value={values.role} onChange={(event) => update("role", event.target.value)} className={FIELD_CLASS} />
                </Field>
                <Field label={view.startDate}>
                  <Input type="date" value={values.startDate} onChange={(event) => update("startDate", event.target.value)} className={FIELD_CLASS} />
                </Field>
                <Field label={view.employmentType}>
                  <select
                    className={SELECT_CLASS}
                    value={values.employmentType}
                    onChange={(event) => update("employmentType", event.target.value as EmployeeFormValues["employmentType"])}
                  >
                    <option value="fullTime">{view.fullTime}</option>
                    <option value="partTime">{view.partTime}</option>
                    <option value="contractor">{view.contractor}</option>
                  </select>
                </Field>
                <Field label={view.department}>
                  <Input value={values.department} onChange={(event) => update("department", event.target.value)} className={FIELD_CLASS} />
                </Field>
                <Field label={view.workLocation}>
                  <Input value={values.workLocation} onChange={(event) => update("workLocation", event.target.value)} className={FIELD_CLASS} />
                </Field>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <Field label={view.sin} hint={view.secureFieldHint}>
                  <div className="flex gap-2">
                    <Input
                      type={sinVisible ? "text" : "password"}
                      value={values.sin}
                      onChange={(event) => update("sin", event.target.value)}
                      inputMode="numeric"
                      autoComplete="off"
                      className={FIELD_CLASS}
                    />
                    <button
                      type="button"
                      onClick={() => setSinVisible((current) => !current)}
                      className="type-button inline-flex h-[52px] shrink-0 items-center rounded-2xl bg-white/80 px-4 text-neutral-700 ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white"
                    >
                      {sinVisible ? view.hideSin : view.revealSin}
                    </button>
                  </div>
                </Field>
                <Field label={view.dateOfBirth}>
                  <Input type="date" value={values.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} className={FIELD_CLASS} />
                </Field>
                <Field label={view.taxProvince}>
                  <Input value={values.taxProvince} onChange={(event) => update("taxProvince", event.target.value)} className={FIELD_CLASS} />
                </Field>
                <label className="flex items-center gap-2.5 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-neutral-200/50">
                  <input
                    type="checkbox"
                    checked={values.hasSinExpiry}
                    onChange={(event) => update("hasSinExpiry", event.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
                  />
                  <span className="type-body-small text-neutral-700">{view.sinExpiryToggle}</span>
                </label>
                {values.hasSinExpiry ? (
                  <Field label={view.sinExpiryDate}>
                    <Input
                      type="date"
                      value={values.sinExpiryDate}
                      onChange={(event) => update("sinExpiryDate", event.target.value)}
                      className={FIELD_CLASS}
                    />
                  </Field>
                ) : null}
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4">
                <Field label={view.rateType}>
                  <select
                    className={SELECT_CLASS}
                    value={values.rateType}
                    onChange={(event) => update("rateType", event.target.value as EmployeeFormValues["rateType"])}
                  >
                    <option value="hourly">{view.hourly}</option>
                    <option value="daily">{view.daily}</option>
                    <option value="weekly">{view.weekly}</option>
                    <option value="biWeekly">{view.biWeekly}</option>
                    <option value="monthly">{view.monthly}</option>
                    <option value="annual">{view.annual}</option>
                  </select>
                </Field>
                <Field label={view.rateAmount}>
                  <Input type="number" min="0" step="0.01" value={values.rateAmount} onChange={(event) => update("rateAmount", event.target.value)} className={FIELD_CLASS} />
                </Field>
                <Field label={view.paySchedule}>
                  <select
                    className={SELECT_CLASS}
                    value={values.paySchedule}
                    onChange={(event) => update("paySchedule", event.target.value as EmployeeFormValues["paySchedule"])}
                  >
                    <option value="weekly">{view.weekly}</option>
                    <option value="biWeekly">{view.biWeekly}</option>
                    <option value="monthly">{view.monthly}</option>
                  </select>
                </Field>
                <Field label={view.hoursPerDay}>
                  <Input type="number" min="0" step="0.25" value={values.hoursPerDay} onChange={(event) => update("hoursPerDay", event.target.value)} className={FIELD_CLASS} />
                </Field>
                <Field label={view.hoursPerWeek}>
                  <Input type="number" min="0" step="0.25" value={values.hoursPerWeek} onChange={(event) => update("hoursPerWeek", event.target.value)} className={FIELD_CLASS} />
                </Field>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4">
                <label className="flex items-center gap-2.5 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-neutral-200/50">
                  <input
                    type="checkbox"
                    checked={values.eligibleForPayroll}
                    onChange={(event) => update("eligibleForPayroll", event.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
                  />
                  <span className="type-body-small text-neutral-700">{view.eligibleForPayroll}</span>
                </label>
                <label className="flex items-center gap-2.5 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-neutral-200/50">
                  <input
                    type="checkbox"
                    checked={values.defaultInPayroll}
                    onChange={(event) => update("defaultInPayroll", event.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
                  />
                  <span className="type-body-small text-neutral-700">{view.defaultInPayroll}</span>
                </label>
                <div className="space-y-4 rounded-2xl bg-white/60 p-4 ring-1 ring-neutral-200/50">
                  <ReviewGroup
                    title={view.personalDetails}
                    items={[
                      { label: view.fullName, value: values.name },
                      { label: view.email, value: values.email },
                      { label: view.phone, value: values.phone },
                      { label: view.employeeAddress, value: formatAddress(values) },
                    ]}
                  />
                  <ReviewGroup
                    title={view.employmentDetails}
                    items={[
                      { label: view.role, value: values.role },
                      { label: view.startDate, value: values.startDate },
                      { label: view.employmentType, value: employmentTypeLabel(view, values.employmentType) },
                      { label: view.department, value: values.department },
                      { label: view.workLocation, value: values.workLocation },
                    ]}
                  />
                  <ReviewGroup
                    title={view.taxAndIdentity}
                    items={[
                      { label: view.sin, value: maskSin(values.sin) },
                      { label: view.sinExpiryDate, value: values.hasSinExpiry ? values.sinExpiryDate : c.common.noDataFallback },
                      { label: view.dateOfBirth, value: values.dateOfBirth },
                      { label: view.taxProvince, value: values.taxProvince },
                    ]}
                  />
                  <ReviewGroup
                    title={view.compensation}
                    items={[
                      { label: view.rateType, value: rateTypeLabel(view, values.rateType) },
                      { label: view.rateAmount, value: formatRate(values.rateAmount) },
                      { label: view.paySchedule, value: payScheduleLabel(view, values.paySchedule) },
                      { label: view.hoursPerDay, value: values.hoursPerDay },
                      { label: view.hoursPerWeek, value: values.hoursPerWeek },
                    ]}
                  />
                </div>
              </div>
            ) : null}

            <SetupNavigationButtons
              canGoBack={!isFocusedSectionMode && step > 1}
              onBack={() => {
                setError("");
                setFormSubmitted(false);
                setStep((current) => previousEmployeeStep(current));
              }}
              onNext={!isFocusedSectionMode && step < 5 ? nextStep : undefined}
              isFinal={isFocusedSectionMode || step === 5}
              nextLabel={c.common.next}
              finalLabel={finalActionLabel}
              pendingLabel={finalActionLabel}
              secondaryActionHref={cancelHref}
              secondaryActionLabel={c.common.cancel}
            />
          </CompanySetupCard>
        </div>
      </form>
    </div>
  );
}

function ReviewGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="space-y-2">
      <h2 className="type-card-title">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={`${title}-${item.label}`} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <p className="type-caption text-neutral-500">{item.label}</p>
            <p className="type-body sm:max-w-[58%] sm:text-right text-[#1f221c]">{item.value || "Not provided"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function validateStep(
  step: EmployeeSetupStep,
  values: EmployeeFormValues,
  address: AddressValue,
  view: ReturnType<typeof useContent>["employee"]
) {
  if (step === 1) {
    if (!values.name.trim()) return view.validation.nameRequired;
    if (!values.email.trim()) return view.validation.emailRequired;
    if (!isAddressComplete(address)) return view.validation.addressRequired;
  }

  if (step === 2) {
    if (!values.role.trim() || !values.startDate || !values.department.trim() || !values.workLocation.trim()) {
      return view.validation.employmentRequired;
    }
  }

  if (step === 3) {
    if (!values.sin.trim() || !values.dateOfBirth || !values.taxProvince.trim()) {
      return view.validation.identityRequired;
    }
    if (values.hasSinExpiry && !values.sinExpiryDate) {
      return view.validation.sinExpiryRequired;
    }
  }

  if (step === 4) {
    if (!values.rateType) return view.validation.rateTypeRequired;
    if (!values.rateAmount.trim()) return view.validation.rateAmountRequired;
    if (!values.paySchedule) return view.validation.payScheduleRequired;
  }

  return "";
}

function validateAllSteps(
  values: EmployeeFormValues,
  address: AddressValue,
  view: ReturnType<typeof useContent>["employee"]
) {
  for (const step of [1, 2, 3, 4] as const) {
    const nextError = validateStep(step, values, address, view);
    if (nextError) return nextError;
  }
  return "";
}

function addressValueFromFormValues(values: EmployeeFormValues) {
  return normalizeAddressValue(
    {
      line1: values.streetAddress,
      unit: values.unit,
      hasSubpremise: Boolean(values.unit),
      city: values.city,
      province: values.province,
      postalCode: values.postalCode,
      country: values.country || "CA",
      source: values.streetAddress ? "manual" : "",
      verified: false,
      formattedAddress: values.streetAddress,
    },
    "CA"
  );
}

function employmentTypeLabel(view: ReturnType<typeof useContent>["employee"], employmentType: EmployeeFormValues["employmentType"]) {
  if (employmentType === "partTime") return view.partTime;
  if (employmentType === "contractor") return view.contractor;
  return view.fullTime;
}

function rateTypeLabel(view: ReturnType<typeof useContent>["employee"], rateType: EmployeeFormValues["rateType"]) {
  if (rateType === "daily") return view.daily;
  if (rateType === "weekly") return view.weekly;
  if (rateType === "biWeekly") return view.biWeekly;
  if (rateType === "monthly") return view.monthly;
  if (rateType === "annual") return view.annual;
  return view.hourly;
}

function payScheduleLabel(view: ReturnType<typeof useContent>["employee"], paySchedule: EmployeeFormValues["paySchedule"]) {
  if (paySchedule === "weekly") return view.weekly;
  if (paySchedule === "monthly") return view.monthly;
  return view.biWeekly;
}

function formatAddress(values: EmployeeFormValues) {
  return [values.streetAddress, values.unit, values.city, values.province, values.postalCode, values.country]
    .filter(Boolean)
    .join(", ");
}

function maskSin(value: string) {
  const normalized = value.replace(/\D/g, "");
  if (!normalized) return "";
  return `•••••${normalized.slice(-4)}`;
}

function formatRate(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || value.trim() === "") return "";
  return formatCurrency(parsed);
}

function nextEmployeeStep(step: EmployeeSetupStep): EmployeeSetupStep {
  if (step === 1) return 2;
  if (step === 2) return 3;
  if (step === 3) return 4;
  return 5;
}

function previousEmployeeStep(step: EmployeeSetupStep): EmployeeSetupStep {
  if (step === 5) return 4;
  if (step === 4) return 3;
  if (step === 3) return 2;
  return 1;
}

function resolveStepFromSection(section?: EmployeeEditSection): EmployeeSetupStep {
  if (section === "employment") return 2;
  if (section === "identity") return 3;
  if (section === "compensation") return 4;
  if (section === "payroll") return 5;
  return 1;
}

function sectionTitle(view: ReturnType<typeof useContent>["employee"], section: EmployeeEditSection) {
  if (section === "employment") return view.employmentDetails;
  if (section === "identity") return view.taxAndIdentity;
  if (section === "compensation") return `${view.compensation} & ${view.workSchedule.toLowerCase()}`;
  if (section === "payroll") return view.payrollSettings;
  return view.personalDetails;
}

function sectionSubtitle(view: ReturnType<typeof useContent>["employee"], section: EmployeeEditSection) {
  if (section === "employment") return view.stepDescriptions.employment;
  if (section === "identity") return view.stepDescriptions.identity;
  if (section === "compensation") return view.stepDescriptions.compensation;
  if (section === "payroll") return view.stepDescriptions.payroll;
  return view.stepDescriptions.personal;
}

const SELECT_CLASS =
  "h-[52px] w-full rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:outline-none focus-visible:outline-none focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";
