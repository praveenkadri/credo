import type { CompanySetupPrimaryPrompt, CompanyWorkspaceSummary } from "@/lib/data/companies";
import { routes } from "@/lib/routes";

export type CompanyNextStep = {
  id: string;
  label: string;
  done: boolean;
  href: string;
};

export function getCompanyNextSteps({
  companyId,
  payrollDetailsComplete,
  setupPrompt,
  workspaceSummary,
}: {
  companyId: string;
  payrollDetailsComplete: boolean;
  setupPrompt?: CompanySetupPrimaryPrompt;
  workspaceSummary: CompanyWorkspaceSummary;
}): CompanyNextStep[] {
  return [
    {
      id: "employee",
      label: "Add first employee",
      done: workspaceSummary.employeeCount > 0,
      href: routes.employeesNewForCompany(companyId),
    },
    {
      id: "details",
      label: "Complete payroll details",
      done: payrollDetailsComplete,
      href: setupPrompt?.href ?? routes.companyProfileSectionEdit(companyId, "tax"),
    },
    {
      id: "payroll",
      label: "Run first payroll",
      done: workspaceSummary.payrollRunCount > 0,
      href: routes.runPayrollForCompany(companyId),
    },
    {
      id: "documents",
      label: "Generate pay stubs",
      done: workspaceSummary.documentCount > 0,
      href: routes.documentsView({ company: companyId }),
    },
  ];
}

export function getCompanySetupCompletion(steps: CompanyNextStep[]) {
  return {
    complete: steps.filter((item) => item.done).length,
    total: steps.length,
  };
}
