"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitPayrollRunAction } from "@/app/payroll/actions";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import { EmptyStateVisual, StepIcon, type BrandIconName, type BrandTone } from "@/components/brand/brand-visuals";
import { Input } from "@/components/ui-primitives/input";
import { SoftNotice } from "@/components/system/SoftNotice";
import { calculateGrossPay, calculatePayPeriodHours, parseDateOnly } from "@/lib/payroll-calculations";
import { employeeCompensationSummary, type EmployeeRecord } from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

type WizardStep = 0 | 1 | 2 | 3;
type RunPayrollContent = ReturnType<typeof useContent>["runPayroll"];

type SetupState = {
  payPeriodId: string;
  payDate: string;
  payrollType: string;
  useCustomDates: boolean;
  customStartDate: string;
  customEndDate: string;
};

type EmployeeCompState = {
  totalHours: string;
  calculatedHours: string;
  manualHoursOverride: boolean;
};

const stepIndexes: WizardStep[] = [0, 1, 2, 3];
const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function RunPayrollModal({
  open,
  onClose,
  companyId,
  companyName,
  employees,
  hasCompanies,
}: {
  open: boolean;
  onClose: () => void;
  companyId?: string;
  companyName?: string;
  employees: EmployeeRecord[];
  hasCompanies: boolean;
}) {
  const router = useRouter();
  const { runPayroll: c, common } = useContent();
  const initialSetup = useMemo<SetupState>(
    () => ({
      payPeriodId: c.fields.payPeriod.options[0]?.id ?? "",
      payDate: c.fields.payDate.defaultValue,
      payrollType: c.fields.payrollType.options[0] ?? "",
      useCustomDates: false,
      customStartDate: "",
      customEndDate: "",
    }),
    [c.fields.payDate.defaultValue, c.fields.payPeriod.options, c.fields.payrollType.options]
  );

  const [step, setStep] = useState<WizardStep>(0);
  const [setup, setSetup] = useState<SetupState>(initialSetup);
  const [confirmed, setConfirmed] = useState(false);
  const [validation, setValidation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const payrollEmployees = employees;
  const defaultSelectedEmployees = useMemo(
    () => payrollEmployees.filter((employee) => employee.payrollSettings.defaultInPayroll).map((employee) => employee.id),
    [payrollEmployees]
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(defaultSelectedEmployees);
  const [employeeConfigs, setEmployeeConfigs] = useState<Record<string, EmployeeCompState>>(() =>
    buildEmployeeConfigs(payrollEmployees, initialSetup, c.fields.payPeriod.options)
  );

  const activePayPeriod = useMemo(
    () => c.fields.payPeriod.options.find((option) => option.id === setup.payPeriodId) ?? c.fields.payPeriod.options[0],
    [c.fields.payPeriod.options, setup.payPeriodId]
  );
  const resolvedStartDate = setup.useCustomDates ? setup.customStartDate : activePayPeriod?.startDate ?? "";
  const resolvedEndDate = setup.useCustomDates ? setup.customEndDate : activePayPeriod?.endDate ?? "";

  useEffect(() => {
    if (!open) return;

    setStep(0);
    setSetup(initialSetup);
    setConfirmed(false);
    setValidation("");
    setSubmitting(false);
    setSelectedEmployees(defaultSelectedEmployees);
    setEmployeeConfigs(buildEmployeeConfigs(payrollEmployees, initialSetup, c.fields.payPeriod.options));
  }, [c.fields.payPeriod.options, defaultSelectedEmployees, initialSetup, open, payrollEmployees]);

  useEffect(() => {
    setEmployeeConfigs((current) =>
      recalculateEmployeeConfigs(current, {
        employees: payrollEmployees,
        startDate: resolvedStartDate,
        endDate: resolvedEndDate,
      })
    );
  }, [payrollEmployees, resolvedEndDate, resolvedStartDate]);

  useEffect(() => {
    setSelectedEmployees((current) => {
      const validIds = new Set(payrollEmployees.map((employee) => employee.id));
      const preserved = current.filter((id) => validIds.has(id));
      return preserved.length > 0 ? preserved : defaultSelectedEmployees;
    });
  }, [defaultSelectedEmployees, payrollEmployees]);

  const selectedEmployeeRows = useMemo(
    () => payrollEmployees.filter((employee) => selectedEmployees.includes(employee.id)),
    [payrollEmployees, selectedEmployees]
  );
  const selectedCount = selectedEmployeeRows.length;
  const allSelected = selectedCount === payrollEmployees.length && payrollEmployees.length > 0;

  const paySummary = useMemo(() => {
    const employeeSummaries = selectedEmployeeRows.map((employee) => {
      const config = employeeConfigs[employee.id];
      const totalHours = parseNumeric(config?.totalHours);
      const grossPay = calculateGrossPay({
        rateType: employee.compensation.rateType,
        rateAmount: employee.compensation.rateAmount,
        totalHours,
        hoursPerDay: employee.workSchedule.hoursPerDay,
        hoursPerWeek: employee.workSchedule.hoursPerWeek,
        startDate: resolvedStartDate,
        endDate: resolvedEndDate,
      });

      return { employee, config, totalHours, grossPay };
    });

    const grossPay = employeeSummaries.reduce((total, item) => total + item.grossPay, 0);
    const deductions = grossPay * 0.2542;
    const netPay = grossPay - deductions;

    return { employeeSummaries, grossPay, deductions, netPay };
  }, [employeeConfigs, resolvedEndDate, resolvedStartDate, selectedEmployeeRows]);

  if (!open) return null;

  function closeWizard() {
    setValidation("");
    onClose();
  }

  function goBack() {
    setValidation("");
    setStep((current) => Math.max(0, current - 1) as WizardStep);
  }

  function goNext() {
    if (step === 0) {
      const error = validateSetup({
        content: c,
        useCustomDates: setup.useCustomDates,
        startDate: resolvedStartDate,
        endDate: resolvedEndDate,
        payDate: setup.payDate,
      });

      if (error) {
        setValidation(error);
        return;
      }
    }

    if (step === 1 && selectedCount === 0) {
      setValidation(c.validation.selectEmployee);
      return;
    }

    setValidation("");
    setStep((current) => Math.min(3, current + 1) as WizardStep);
  }

  async function submitPayroll() {
    if (!confirmed) {
      setValidation(c.validation.confirmationRequired);
      return;
    }

    if (!companyId) {
      setValidation("Choose a company before submitting payroll.");
      return;
    }

    setSubmitting(true);
    const result = await submitPayrollRunAction(
      {
        companyId,
        payPeriodStart: resolvedStartDate,
        payPeriodEnd: resolvedEndDate,
        payDate: setup.payDate,
        payrollType: setup.payrollType,
        employees: selectedEmployeeRows.map((employee) => {
          const config = employeeConfigs[employee.id];
          return {
            employeeId: employee.id,
            employeeName: employee.name,
            rateType: employee.compensation.rateType,
            rateAmount: employee.compensation.rateAmount,
            totalHours: parseNumeric(config?.totalHours),
            manualHoursOverride: Boolean(config?.manualHoursOverride),
          };
        }),
      }
    );

    setSubmitting(false);

    if (result.error) {
      setValidation(result.error);
      return;
    }

    router.refresh();
    if (result.warning) {
      setValidation(result.warning);
      return;
    }

    closeWizard();
  }

  function updateSetup<K extends keyof SetupState>(key: K, value: SetupState[K]) {
    setValidation("");
    setSetup((current) => ({ ...current, [key]: value }));
  }

  function toggleEmployee(employeeId: string) {
    setValidation("");
    setSelectedEmployees((current) =>
      current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId]
    );
  }

  function toggleAllEmployees() {
    setValidation("");
    setSelectedEmployees(allSelected ? [] : payrollEmployees.map((employee) => employee.id));
  }

  function setManualHours(employeeId: string, value: string) {
    setEmployeeConfigs((current) => ({
      ...current,
      [employeeId]: {
        ...current[employeeId],
        totalHours: value,
        manualHoursOverride: true,
      },
    }));
  }

  function resetCalculatedHours(employeeId: string) {
    setEmployeeConfigs((current) => {
      const config = current[employeeId];
      const employee = payrollEmployees.find((item) => item.id === employeeId);
      if (!employee || !config) return current;

      const nextHours = String(calculateEmployeeHours(employee, resolvedStartDate, resolvedEndDate));

      return {
        ...current,
        [employeeId]: {
          ...config,
          manualHoursOverride: false,
          totalHours: nextHours,
          calculatedHours: nextHours,
        },
      };
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#f7f7f2]/78 px-4 py-5 backdrop-blur-[3px] backdrop-saturate-[0.92] payroll-modal-overlay md:items-center md:py-6">
      <section
        className="max-h-[calc(100vh-32px)] w-full max-w-[800px] overflow-y-auto rounded-[32px] bg-[#fafaf7] p-5 shadow-[0_18px_48px_rgba(31,34,28,0.11),0_0_0_1px_rgba(31,34,28,0.04)] payroll-modal-surface md:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-payroll-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {step > 0 ? (
              <Button
                type="button"
                onClick={goBack}
                variant="subtle"
                className="mb-3 h-auto px-0 py-0 text-[13px]"
              >
                {common.back}
              </Button>
            ) : null}
            <p className="text-[13px] font-medium text-[#6e736b]">
              {c.steps.progress.replace("{step}", String(step + 1)).replace("{total}", String(stepIndexes.length))}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <StepIcon {...payrollStepVisual(step)} />
              <h2 id="run-payroll-modal-title" className="text-[30px] font-semibold tracking-[-0.03em] text-[#1f221c]">
                {c.steps.items[step].title}
              </h2>
            </div>
            <p className="mt-2 max-w-xl text-[15px] leading-6 text-[#6e736b]">{c.steps.items[step].subtitle}</p>
          </div>
          <Button
            type="button"
            onClick={closeWizard}
            aria-label={c.actions.close}
            variant="toolbarIcon"
            className="shrink-0 text-[22px] leading-none"
          >
            <span aria-hidden="true">×</span>
          </Button>
        </div>

        <div className="mt-6 flex gap-2">
          {stepIndexes.map((stepIndex) => (
            <span
              key={stepIndex}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-[180ms]",
                stepIndex <= step ? "bg-[var(--action-primary)]" : "bg-neutral-100"
              )}
            />
          ))}
        </div>

        <div className="mt-7 payroll-step-surface" key={step}>
          {step === 0 ? (
            <PayrollSetupStep content={c} setup={setup} activePayPeriod={activePayPeriod} onUpdateSetup={updateSetup} />
          ) : step === 1 ? (
            <EmployeeRateSelectionStep
              content={c}
              companyId={companyId}
              companyName={companyName}
              hasCompanies={hasCompanies}
              employees={payrollEmployees}
              allSelected={allSelected}
              selectedEmployees={selectedEmployees}
              employeeConfigs={employeeConfigs}
              startDate={resolvedStartDate}
              endDate={resolvedEndDate}
              onToggleAll={toggleAllEmployees}
              onToggleEmployee={toggleEmployee}
              onSetManualHours={setManualHours}
              onResetCalculatedHours={resetCalculatedHours}
            />
          ) : step === 2 ? (
            <ReviewPayrollStep
              content={c}
              selectedEmployeeSummaries={paySummary.employeeSummaries}
              startDate={resolvedStartDate}
              endDate={resolvedEndDate}
              payDate={setup.payDate}
              reviewTotals={paySummary}
            />
          ) : (
            <ConfirmPayrollStep content={c} confirmed={confirmed} onConfirmChange={setConfirmed} />
          )}
        </div>

        {validation ? <SoftNotice title={c.validation.title} description={validation} variant="error" className="mt-6" /> : null}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="secondary" onClick={closeWizard}>
            {common.cancel}
          </Button>
          {step < 3 ? (
            <Button variant="primary" onClick={goNext}>
              {c.actions.continue}
            </Button>
          ) : (
            <Button variant="primary" onClick={submitPayroll} disabled={submitting}>
              {submitting ? "Submitting..." : c.actions.submitPayroll}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function PayrollSetupStep({
  content: c,
  setup,
  activePayPeriod,
  onUpdateSetup,
}: {
  content: RunPayrollContent;
  setup: SetupState;
  activePayPeriod?: RunPayrollContent["fields"]["payPeriod"]["options"][number];
  onUpdateSetup: <K extends keyof SetupState>(key: K, value: SetupState[K]) => void;
}) {
  const payPeriodLabel = setup.useCustomDates
    ? formatDateRangeLabel(setup.customStartDate, setup.customEndDate)
    : activePayPeriod
      ? formatDateRangeLabel(activePayPeriod.startDate, activePayPeriod.endDate)
      : "";
  const payDateLabel = formatDateLabel(setup.payDate);

  return (
    <div className="grid gap-5">
      <Field label={c.fields.payPeriod.label} hint={c.microcopy.payPeriod}>
        <select className={selectClassName} value={setup.payPeriodId} onChange={(event) => onUpdateSetup("payPeriodId", event.target.value)}>
          {c.fields.payPeriod.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="mt-3 rounded-[22px] bg-[#f3f4ef] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] text-[#6e736b]">{setup.useCustomDates ? c.fields.useCustomDates : "Selected period"}</p>
              <p className="mt-1 text-[14px] font-semibold text-[#1f221c]">{payPeriodLabel || "Choose dates below"}</p>
            </div>
            <button
              type="button"
              aria-expanded={setup.useCustomDates}
              onClick={() => onUpdateSetup("useCustomDates", !setup.useCustomDates)}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-full px-3 text-[12px] font-medium transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#fafaf7]",
                setup.useCustomDates ? "bg-[#fafaf7] text-[#1f221c] shadow-[inset_0_0_0_1px_rgba(31,34,28,0.05)]" : "text-[#6e736b]"
              )}
            >
              <span
                className={cn(
                  "relative inline-flex h-4 w-7 rounded-full bg-neutral-200 transition-colors duration-[160ms]",
                  setup.useCustomDates && "bg-[var(--action-primary)]"
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 size-3 rounded-full bg-white transition-transform duration-[160ms]",
                    setup.useCustomDates && "translate-x-3"
                  )}
                />
              </span>
              {c.fields.useCustomDates}
            </button>
          </div>
        </div>
      </Field>

      {setup.useCustomDates ? (
        <div className="rounded-[26px] bg-[#f3f4ef] p-4">
          <p className="text-[13px] leading-6 text-[#6e736b]">{c.fields.customDateHelper}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label={c.fields.startDate} hint={c.fields.customDateHelper}>
              <Input type="date" value={setup.customStartDate} onChange={(event) => onUpdateSetup("customStartDate", event.target.value)} />
            </Field>
            <Field label={c.fields.endDate} hint={c.fields.customDateHelper}>
              <Input type="date" value={setup.customEndDate} onChange={(event) => onUpdateSetup("customEndDate", event.target.value)} />
            </Field>
          </div>
        </div>
      ) : null}

      <Field label={c.fields.payDate.label} hint={c.microcopy.payDate}>
        <div className="mb-2 rounded-[22px] bg-[#f3f4ef] px-4 py-3">
          <p className="text-[12px] text-[#6e736b]">Selected pay date</p>
          <p className="mt-1 text-[14px] font-semibold text-[#1f221c]">{payDateLabel || "Choose a pay date"}</p>
        </div>
        <Input type="date" value={setup.payDate} onChange={(event) => onUpdateSetup("payDate", event.target.value)} />
      </Field>

      <Field label={c.fields.payrollType.label} hint={c.microcopy.payrollType}>
        <div className="flex flex-wrap gap-2">
          {c.fields.payrollType.options.map((option) => (
            <Button key={option} variant={setup.payrollType === option ? "chipActive" : "chip"} onClick={() => onUpdateSetup("payrollType", option)}>
              {option}
            </Button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function EmployeeRateSelectionStep({
  content: c,
  companyId,
  companyName,
  hasCompanies,
  employees,
  allSelected,
  selectedEmployees,
  employeeConfigs,
  startDate,
  endDate,
  onToggleAll,
  onToggleEmployee,
  onSetManualHours,
  onResetCalculatedHours,
}: {
  content: RunPayrollContent;
  companyId?: string;
  companyName?: string;
  hasCompanies: boolean;
  employees: readonly EmployeeRecord[];
  allSelected: boolean;
  selectedEmployees: string[];
  employeeConfigs: Record<string, EmployeeCompState>;
  startDate: string;
  endDate: string;
  onToggleAll: () => void;
  onToggleEmployee: (employeeId: string) => void;
  onSetManualHours: (employeeId: string, value: string) => void;
  onResetCalculatedHours: (employeeId: string) => void;
}) {
  if (!hasCompanies) {
    return (
      <div className="rounded-[26px] bg-[#f3f4ef] p-6 text-center">
        <EmptyStateVisual type="company" className="mx-auto mb-3" />
        <h3 className="text-[15px] font-semibold text-[#1f221c]">Create a company first</h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-[#6e736b]">
          Add an active company before running payroll.
        </p>
        <div className="mt-5 flex justify-center">
          <Link href={routes.companiesNew} className={buttonClassName("secondary")}>
            Add company
          </Link>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="rounded-[26px] bg-[#f3f4ef] p-6 text-center">
        <EmptyStateVisual type="employees" className="mx-auto mb-3" />
        <h3 className="text-[15px] font-semibold text-[#1f221c]">Add an eligible Team member</h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-[#6e736b]">
          {companyName ? `${companyName} has no active payroll-eligible employees yet.` : "This company has no active payroll-eligible employees yet."}
        </p>
        {companyId ? (
          <div className="mt-5 flex justify-center">
            <Link href={routes.employeesNewForCompany(companyId)} className={buttonClassName("secondary")}>
              Add Team member
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {c.employeeFilters.map((filter) => (
          <Button key={filter} variant="chip">
            {filter}
          </Button>
        ))}
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[22px] bg-[#f3f4ef] px-4 py-3">
        <span>
          <span className="block text-[15px] font-semibold text-[#1f221c]">{c.fields.employees.allEmployees}</span>
          <span className="mt-1 block text-[13px] text-[#6e736b]">{c.microcopy.allEmployees}</span>
        </span>
        <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="size-5 accent-[var(--action-primary)]" />
      </label>

      <div className="space-y-3">
        {employees.map((employee) => {
          const isSelected = selectedEmployees.includes(employee.id);
          const config = employeeConfigs[employee.id];
          if (!config) return null;

          const grossPayEstimate = calculateGrossPay({
            rateType: employee.compensation.rateType,
            rateAmount: employee.compensation.rateAmount,
            totalHours: parseNumeric(config.totalHours),
            hoursPerDay: employee.workSchedule.hoursPerDay,
            hoursPerWeek: employee.workSchedule.hoursPerWeek,
            startDate,
            endDate,
          });

          return (
            <div key={employee.id} className="overflow-hidden rounded-[26px] bg-[#f3f4ef]">
              <label className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4">
                <span>
                  <span className="block text-[15px] font-semibold text-[#1f221c]">{employee.name}</span>
                  <span className="mt-1 block text-[13px] text-[#6e736b]">{payrollEmployeeDetail(employee, c)}</span>
                </span>
                <input type="checkbox" checked={isSelected} onChange={() => onToggleEmployee(employee.id)} className="size-5 accent-[var(--action-primary)]" />
              </label>

              {isSelected ? (
                <div className="border-t border-neutral-200/60 px-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <ProfileMeta label={c.fields.rateType} value={rateTypeLabel(c, employee.compensation.rateType)} />
                    <ProfileMeta label={c.fields.rateAmount} value={employeeCompensationSummary(employee)} />
                    <ProfileMeta label={c.fields.hoursPerDay} value={String(employee.workSchedule.hoursPerDay)} />
                    <ProfileMeta label={c.fields.hoursPerWeek} value={String(employee.workSchedule.hoursPerWeek)} />
                  </div>

                  <div className="mt-4 rounded-[22px] bg-[#fafaf7] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div className="min-w-0 flex-1">
                        <Field label={c.fields.totalHours} hint={c.microcopy.totalHours}>
                          <Input type="number" min="0" step="0.25" value={config.totalHours} onChange={(event) => onSetManualHours(employee.id, event.target.value)} />
                        </Field>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-8 items-center rounded-full bg-[#f1f2ef] px-3 text-[12px] font-medium text-[var(--action-text)]">
                          {c.fields.calculatedHours}: {formatHours(parseNumeric(config.calculatedHours))}
                        </span>
                        {config.manualHoursOverride ? (
                          <>
                            <span className="inline-flex h-8 items-center rounded-full bg-[#f1f2ef] px-3 text-[12px] font-medium text-[#6e736b]">
                              {c.fields.manualHoursOverride}
                            </span>
                            <Button variant="ghost" className="h-8 px-3 text-[12px]" onClick={() => onResetCalculatedHours(employee.id)}>
                              {c.fields.useCalculatedHours}
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 text-[13px]">
                      <span className="text-[#6e736b]">{c.fields.grossPayEstimate}</span>
                      <span className="font-semibold text-[#1f221c]">{formatCurrency(grossPayEstimate)}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewPayrollStep({
  content: c,
  selectedEmployeeSummaries,
  startDate,
  endDate,
  payDate,
  reviewTotals,
}: {
  content: RunPayrollContent;
  selectedEmployeeSummaries: Array<{
    employee: EmployeeRecord;
    config: EmployeeCompState;
    totalHours: number;
    grossPay: number;
  }>;
  startDate: string;
  endDate: string;
  payDate: string;
  reviewTotals: { grossPay: number; deductions: number; netPay: number };
}) {
  return (
    <div className="space-y-5">
      <EmptyStateVisual type="payroll" className="h-[96px]" />
      <div className="rounded-[24px] bg-[#f3f4ef] p-4">
        <h3 className="text-[15px] font-semibold text-[#1f221c]">{c.timeline.items[0].title}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <ReviewMeta label={c.fields.payPeriodStart} value={formatDateLabel(startDate)} />
          <ReviewMeta label={c.fields.payPeriodEnd} value={formatDateLabel(endDate)} />
          <ReviewMeta label={c.fields.payDate.label} value={formatDateLabel(payDate)} />
        </div>
      </div>

      <div className="rounded-[24px] bg-[#f3f4ef] p-4">
        <h3 className="text-[15px] font-semibold text-[#1f221c]">{c.summary.employeeTotals}</h3>
        <div className="mt-3 space-y-3">
          {selectedEmployeeSummaries.map(({ employee, config, totalHours, grossPay }) => (
            <div key={employee.id} className="rounded-[20px] bg-[#fafaf7] p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-[#1f221c]">{employee.name}</p>
                  <p className="mt-1 text-[13px] text-[#6e736b]">{payrollEmployeeDetail(employee, c)}</p>
                </div>
                <span className="text-[14px] font-semibold text-[#1f221c]">{formatCurrency(grossPay)}</span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                <ReviewMeta label={c.fields.rateType} value={rateTypeLabel(c, employee.compensation.rateType)} />
                <ReviewMeta label={c.fields.totalHours} value={formatHours(totalHours)} />
                <ReviewMeta label={c.fields.grossPayEstimate} value={formatCurrency(grossPay)} />
                <ReviewMeta label={c.fields.manualHoursOverride} value={config.manualHoursOverride ? c.fields.manualHoursOverride : c.fields.calculatedHours} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label={c.reviewTotals[0].label} value={formatCurrency(reviewTotals.grossPay)} />
        <SummaryCard label={c.reviewTotals[1].label} value={formatCurrency(reviewTotals.deductions)} />
        <SummaryCard label={c.reviewTotals[2].label} value={formatCurrency(reviewTotals.netPay)} />
      </div>

      <SoftNotice title={c.validation.noticeTitle} description={c.validation.noticeDescription} variant="info" />
    </div>
  );
}

function ConfirmPayrollStep({
  content: c,
  confirmed,
  onConfirmChange,
}: {
  content: RunPayrollContent;
  confirmed: boolean;
  onConfirmChange: (next: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[24px] bg-[#f3f4ef] p-4">
        <h3 className="text-[15px] font-semibold text-[#1f221c]">{c.confirmation.title}</h3>
        <p className="mt-2 text-[14px] leading-6 text-[#6e736b]">{c.confirmation.auditNote}</p>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-[22px] bg-[#f3f4ef] p-4">
        <input type="checkbox" checked={confirmed} onChange={(event) => onConfirmChange(event.target.checked)} className="mt-0.5 size-5 accent-[var(--action-primary)]" />
        <span className="text-[14px] leading-6 text-[#1f221c]">{c.confirmation.checkbox}</span>
      </label>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-[#1f221c]">{label}</span>
      {children}
      <span className="mt-2 block text-[12px] leading-5 text-[#6e736b]">{hint}</span>
    </label>
  );
}

function ReviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-[#6e736b]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#1f221c]">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[#f3f4ef] p-4">
      <p className="text-[12px] text-[#6e736b]">{label}</p>
      <p className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-[#1f221c]">{value}</p>
    </div>
  );
}

function payrollStepVisual(step: number): { icon: BrandIconName; tone: BrandTone } {
  if (step === 0) return { icon: "payroll", tone: "sand" };
  if (step === 1) return { icon: "person", tone: "sky" };
  if (step === 2) return { icon: "check", tone: "olive" };
  return { icon: "compliance", tone: "lavender" };
}

function ProfileMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-[#6e736b]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#1f221c]">{value}</p>
    </div>
  );
}

function buildEmployeeConfigs(
  employees: readonly EmployeeRecord[],
  setup: SetupState,
  payPeriods: readonly RunPayrollContent["fields"]["payPeriod"]["options"][number][]
) {
  const activePayPeriod = payPeriods.find((option) => option.id === setup.payPeriodId) ?? payPeriods[0];
  const startDate = activePayPeriod?.startDate ?? "";
  const endDate = activePayPeriod?.endDate ?? "";

  return Object.fromEntries(
    employees.map((employee) => [
      employee.id,
      {
        totalHours: String(calculateEmployeeHours(employee, startDate, endDate)),
        calculatedHours: String(calculateEmployeeHours(employee, startDate, endDate)),
        manualHoursOverride: false,
      },
    ])
  ) as Record<string, EmployeeCompState>;
}

function recalculateEmployeeConfigs(
  current: Record<string, EmployeeCompState>,
  {
    employees,
    startDate,
    endDate,
  }: {
    employees: readonly EmployeeRecord[];
    startDate: string;
    endDate: string;
  }
) {
  return Object.fromEntries(
    employees.map((employee) => {
      const existing = current[employee.id];
      if (!existing) {
        const nextHours = String(calculateEmployeeHours(employee, startDate, endDate));
        return [
          employee.id,
          {
            totalHours: nextHours,
            calculatedHours: nextHours,
            manualHoursOverride: false,
          },
        ] as const;
      }

      if (existing.manualHoursOverride) {
        return [employee.id, existing] as const;
      }

      const nextHours = String(calculateEmployeeHours(employee, startDate, endDate));

      return [
        employee.id,
        {
          ...existing,
          totalHours: nextHours,
          calculatedHours: nextHours,
        },
      ] as const;
    })
  );
}

function validateSetup({
  content: c,
  useCustomDates,
  startDate,
  endDate,
  payDate,
}: {
  content: RunPayrollContent;
  useCustomDates: boolean;
  startDate: string;
  endDate: string;
  payDate: string;
}) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  const pay = parseDateOnly(payDate);

  if (useCustomDates && (!startDate || !endDate)) return c.fields.invalidDateRange;
  if (!start || !end || end <= start) return c.fields.invalidDateRange;
  if (!pay || pay < end) return c.fields.payDateBeforeEndDate;

  return "";
}

function payrollEmployeeDetail(employee: EmployeeRecord, c: RunPayrollContent) {
  const parts = [employee.role, rateTypeLabel(c, employee.compensation.rateType), employee.payrollSettings.defaultInPayroll ? c.employeeDetail.ready : c.employeeDetail.review];
  return parts.filter(Boolean).join(" · ");
}

function rateTypeLabel(c: RunPayrollContent, rateType: EmployeeRecord["compensation"]["rateType"]) {
  if (rateType === "daily") return c.fields.daily;
  if (rateType === "weekly") return c.fields.weekly;
  if (rateType === "biWeekly") return c.fields.biWeekly;
  if (rateType === "monthly") return c.fields.monthly;
  if (rateType === "annual") return c.fields.annual;
  return c.fields.hourly;
}

function parseNumeric(value: string | undefined, fallback = 0) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function formatDateLabel(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) return value || "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function formatDateRangeLabel(startDate: string, endDate: string) {
  const start = formatDateLabel(startDate);
  const end = formatDateLabel(endDate);

  if (start && end) return `${start} - ${end}`;
  return start || end;
}

function formatHours(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function calculateEmployeeHours(employee: EmployeeRecord, startDate: string, endDate: string) {
  return calculatePayPeriodHours({
    startDate,
    endDate,
    rateType: employee.compensation.rateType,
    hoursPerDay: employee.workSchedule.hoursPerDay,
    hoursPerWeek: employee.workSchedule.hoursPerWeek,
  });
}

const selectClassName =
  "h-10 w-full rounded-xl bg-[#fafaf7] px-3 text-sm text-[#575b55] outline-none transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f1f2ef] focus:bg-[#f1f2ef] focus:text-[#1f221c] focus:ring-2 focus:ring-[var(--action-ring)]";
