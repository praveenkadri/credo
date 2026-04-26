"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { SoftNotice } from "@/components/system/SoftNotice";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

type WizardStep = 0 | 1 | 2 | 3;
type RunPayrollContent = ReturnType<typeof useContent>["runPayroll"];
type PayrollEmployee = RunPayrollContent["employees"][number];

const stepIndexes: WizardStep[] = [0, 1, 2, 3];

export function RunPayrollPageClient({ autoOpenWizard = false }: { autoOpenWizard?: boolean }) {
  const { runPayroll: c, common } = useContent();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>(0);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(
    c.employees.filter((employee) => employee.defaultSelected).map((employee) => employee.id)
  );
  const [activeFilter, setActiveFilter] = useState<string>(c.filters[0]?.id ?? "");
  const [openRailSections, setOpenRailSections] = useState<string[]>(["period", "totals", "status"]);
  const [confirmed, setConfirmed] = useState(false);
  const [validation, setValidation] = useState("");

  useEffect(() => {
    if (!autoOpenWizard) return;
    setIsWizardOpen(true);
    setStep(0);
    setValidation("");
  }, [autoOpenWizard]);

  const selectedEmployeeRows = useMemo(
    () => c.employees.filter((employee) => selectedEmployees.includes(employee.id)),
    [c.employees, selectedEmployees]
  );

  const selectedCount = selectedEmployeeRows.length;
  const allSelected = selectedCount === c.employees.length;

  function openWizard() {
    setIsWizardOpen(true);
    setStep(0);
    setValidation("");
  }

  function closeWizard() {
    setIsWizardOpen(false);
    setValidation("");
  }

  function goBack() {
    setValidation("");
    setStep((current) => Math.max(0, current - 1) as WizardStep);
  }

  function goNext() {
    if (step === 1 && selectedCount === 0) {
      setValidation(c.validation.selectEmployee);
      return;
    }

    setValidation("");
    setStep((current) => Math.min(3, current + 1) as WizardStep);
  }

  function submitPayroll() {
    if (!confirmed) {
      setValidation(c.validation.confirmationRequired);
      return;
    }

    setValidation("");
    setIsWizardOpen(false);
    setStep(0);
    setConfirmed(false);
  }

  function toggleEmployee(employeeId: string) {
    setValidation("");
    setSelectedEmployees((current) =>
      current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId]
    );
  }

  function toggleAllEmployees() {
    setValidation("");
    setSelectedEmployees(allSelected ? [] : c.employees.map((employee) => employee.id));
  }

  function toggleRailSection(sectionId: string) {
    setOpenRailSections((current) =>
      current.includes(sectionId) ? current.filter((id) => id !== sectionId) : [...current, sectionId]
    );
  }

  return (
    <>
      <div className="w-full space-y-8 pb-12">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-[#6e736b]">{c.eyebrow}</p>
            <h1 className="mt-3 text-[44px] font-semibold leading-[0.98] tracking-[-0.03em] text-[#1f221c] md:text-[58px]">
              {c.title}
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-7 tracking-[-0.01em] text-[#575b55]">{c.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary">{c.actions.reviewDraft}</Button>
            <Button variant="outline">{c.actions.export}</Button>
            <Button variant="primary" onClick={openWizard}>
              {c.actions.runPayroll}
            </Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            <section className="rounded-[32px] bg-white/62 p-6 shadow-[0_18px_60px_rgba(31,34,28,0.055)] ring-1 ring-white/70">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[24px] font-semibold tracking-[-0.025em] text-[#1f221c]">{c.timeline.title}</h2>
                  <p className="mt-1 text-[14px] leading-6 text-[#6e736b]">{c.timeline.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={activeFilter === filter.id ? "chipActive" : "chip"}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                {c.timeline.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-[32px_minmax(0,1fr)] gap-4 py-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "mt-1 size-3 rounded-full",
                          item.tone === "complete" ? "bg-[var(--action-primary)]" : "bg-neutral-100"
                        )}
                      />
                      {index < c.timeline.items.length - 1 ? <span className="mt-2 h-full w-px bg-neutral-200/70" /> : null}
                    </div>
                    <div className="min-w-0 border-b border-neutral-200/55 pb-5 last:border-b-0 last:pb-0">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-[17px] font-semibold tracking-[-0.015em] text-[#1f221c]">{item.title}</p>
                          <p className="mt-1 text-[14px] leading-6 text-[#6e736b]">{item.description}</p>
                        </div>
                        <span className="w-fit rounded-full bg-[#f5f5f1] px-3 py-1 text-[12px] font-medium text-[#6e736b]">
                          {item.status}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.meta.map((meta) => (
                          <span key={meta} className="rounded-full bg-[#fafaf7] px-3 py-1.5 text-[12px] text-[#6e736b]">
                            {meta}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-2xl bg-white/60 p-6 shadow-[0_1px_2px_rgba(31,34,28,0.025),0_10px_28px_rgba(31,34,28,0.035)] backdrop-blur">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-[#6e736b]">{c.summary.eyebrow}</p>
                  <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.025em] text-[#1f221c]">{c.summary.title}</h2>
                </div>
                <span className="rounded-full bg-[#edf0e9] px-3 py-1 text-[12px] font-medium text-[#575b55]">
                  {c.summary.statusValue}
                </span>
              </div>

              <div className="space-y-2">
                {c.summary.sections.map((section) => {
                  const isOpen = openRailSections.includes(section.id);

                  return (
                    <div key={section.id} className="rounded-[22px] bg-[#fafaf7]/75">
                      <button
                        type="button"
                        onClick={() => toggleRailSection(section.id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[13px] font-semibold text-[#1f221c]">{section.title}</span>
                        <span
                          className={cn(
                            "text-[16px] leading-none text-[#93988f] transition-transform duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
                            isOpen && "rotate-45"
                          )}
                        >
                          +
                        </span>
                      </button>
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <div className="overflow-hidden">
                          <dl className="space-y-3 px-4 pb-4">
                            {section.items.map((item) => (
                              <div key={item.label} className="flex items-baseline justify-between gap-4">
                                <dt className="text-[12px] text-[#6e736b]">{item.label}</dt>
                                <dd className="text-right text-[13px] font-semibold text-[#1f221c]">{item.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {isWizardOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f221c]/22 px-4 py-6 backdrop-blur-[6px] payroll-modal-overlay">
          <section
            className="max-h-[calc(100vh-48px)] w-full max-w-[760px] overflow-y-auto rounded-[32px] bg-white p-5 shadow-[0_26px_90px_rgba(31,34,28,0.18)] payroll-modal-surface md:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="run-payroll-modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="mb-3 text-[13px] font-medium text-[#6e736b] transition-colors hover:text-[#1f221c]"
                  >
                    {common.back}
                  </button>
                ) : null}
                <p className="text-[13px] font-medium text-[#6e736b]">{c.steps.progress.replace("{step}", String(step + 1)).replace("{total}", String(stepIndexes.length))}</p>
                <h2 id="run-payroll-modal-title" className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#1f221c]">
                  {c.steps.items[step].title}
                </h2>
                <p className="mt-2 max-w-xl text-[15px] leading-6 text-[#6e736b]">{c.steps.items[step].subtitle}</p>
              </div>
              <button
                type="button"
                onClick={closeWizard}
                aria-label={c.actions.close}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--action-primary-soft)] text-[22px] leading-none text-[var(--action-text)] transition-colors hover:bg-white hover:text-[var(--action-text)]"
              >
                ×
              </button>
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
                <PayrollSetupStep content={c} />
              ) : step === 1 ? (
                <SelectEmployeesStep
                  content={c}
                  allSelected={allSelected}
                  selectedEmployees={selectedEmployees}
                  onToggleAll={toggleAllEmployees}
                  onToggleEmployee={toggleEmployee}
                />
              ) : step === 2 ? (
                <ReviewPayrollStep content={c} selectedEmployeeRows={selectedEmployeeRows} />
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
                <Button variant="primary" onClick={submitPayroll}>
                  {c.actions.submitPayroll}
                </Button>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function PayrollSetupStep({ content: c }: { content: RunPayrollContent }) {
  return (
    <div className="grid gap-5">
      <Field label={c.fields.payPeriod.label} hint={c.microcopy.payPeriod}>
        <select className={selectClassName} defaultValue={c.fields.payPeriod.options[0]}>
          {c.fields.payPeriod.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>
      <Field label={c.fields.payDate.label} hint={c.microcopy.payDate}>
        <Input type="date" defaultValue={c.fields.payDate.defaultValue} />
      </Field>
      <Field label={c.fields.payrollType.label} hint={c.microcopy.payrollType}>
        <div className="flex flex-wrap gap-2">
          {c.fields.payrollType.options.map((option, index) => (
            <Button
              key={option}
              variant={index === 0 ? "chipActive" : "chip"}
            >
              {option}
            </Button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function SelectEmployeesStep({
  content: c,
  allSelected,
  selectedEmployees,
  onToggleAll,
  onToggleEmployee,
}: {
  content: RunPayrollContent;
  allSelected: boolean;
  selectedEmployees: string[];
  onToggleAll: () => void;
  onToggleEmployee: (employeeId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {c.employeeFilters.map((filter) => (
          <Button key={filter} variant="chip">
            {filter}
          </Button>
        ))}
      </div>
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[22px] bg-[#fafaf7] px-4 py-3">
        <span>
          <span className="block text-[15px] font-semibold text-[#1f221c]">{c.fields.employees.allEmployees}</span>
          <span className="mt-1 block text-[13px] text-[#6e736b]">{c.microcopy.allEmployees}</span>
        </span>
        <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="size-5 accent-[var(--action-primary)]" />
      </label>
      <div className="divide-y divide-neutral-200/65 overflow-hidden rounded-[24px] bg-[#fafaf7]/75">
        {c.employees.map((employee) => (
          <label key={employee.id} className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4">
            <span>
              <span className="block text-[15px] font-semibold text-[#1f221c]">{employee.name}</span>
              <span className="mt-1 block text-[13px] text-[#6e736b]">{employee.detail}</span>
            </span>
            <input
              type="checkbox"
              checked={selectedEmployees.includes(employee.id)}
              onChange={() => onToggleEmployee(employee.id)}
              className="size-5 accent-[var(--action-primary)]"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function ReviewPayrollStep({
  content: c,
  selectedEmployeeRows,
}: {
  content: RunPayrollContent;
  selectedEmployeeRows: PayrollEmployee[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {c.reviewTotals.map((total) => (
          <div key={total.label} className="rounded-[22px] bg-[#fafaf7] p-4">
            <p className="text-[12px] text-[#6e736b]">{total.label}</p>
            <p className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-[#1f221c]">{total.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[24px] bg-[#fafaf7]/75 p-4">
        <h3 className="text-[15px] font-semibold text-[#1f221c]">{c.summary.employeeTotals}</h3>
        <div className="mt-3 divide-y divide-neutral-200/65">
          {selectedEmployeeRows.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[14px] font-medium text-[#1f221c]">{employee.name}</span>
              <span className="text-[14px] font-semibold text-[#1f221c]">{employee.amount}</span>
            </div>
          ))}
        </div>
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
      <div className="rounded-[24px] bg-[#fafaf7]/75 p-4">
        <h3 className="text-[15px] font-semibold text-[#1f221c]">{c.confirmation.title}</h3>
        <p className="mt-2 text-[14px] leading-6 text-[#6e736b]">{c.confirmation.auditNote}</p>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-[22px] bg-[#fafaf7] p-4">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => onConfirmChange(event.target.checked)}
          className="mt-0.5 size-5 accent-[var(--action-primary)]"
        />
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

const selectClassName =
  "h-10 w-full rounded-xl bg-[#fafaf7] px-3 text-sm text-[#575b55] outline-none transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/60 focus:bg-neutral-100/60 focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";
