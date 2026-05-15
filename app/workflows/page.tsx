import { WorkflowsPage } from "@/components/workflows/workflows-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getCompaniesForToken,
  getCompanyProfileForToken,
  getCompanySetupPrompts,
  hasCompletePayrollDetails,
} from "@/lib/data/companies";
import { listDocumentsForToken } from "@/lib/data/documents";
import { listEmployeesForToken } from "@/lib/data/employees";
import { listPayrollRunsForToken } from "@/lib/data/payroll";
import { routes } from "@/lib/routes";

export default async function WorkflowsRoute() {
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const [companies, employees, payrollRuns, documents] = await Promise.all([
    getCompaniesForToken(user.accessToken),
    listEmployeesForToken(undefined, user.accessToken),
    listPayrollRunsForToken(user.accessToken),
    listDocumentsForToken(user.accessToken),
  ]);

  const primaryCompany = companies[0];
  const primaryProfile = primaryCompany
    ? await getCompanyProfileForToken(primaryCompany.id, user.accessToken).catch(() => null)
    : null;
  const hasCompanies = companies.length > 0;
  const hasEmployees = employees.length > 0;
  const hasPayrollRuns = payrollRuns.length > 0;
  const hasDocuments = documents.length > 0;
  const payrollSetupComplete = primaryProfile ? hasCompletePayrollDetails(primaryProfile) : false;
  const setupPrompt = primaryProfile ? getCompanySetupPrompts(primaryProfile).primaryPrompt : undefined;
  const companyProfileHref = primaryCompany ? routes.companyProfile(primaryCompany.id) : undefined;
  const companyDetailsHref = setupPrompt?.href ?? (primaryCompany ? routes.companyProfileSectionEdit(primaryCompany.id, "tax") : undefined);
  const addEmployeeHref =
    companies.length === 1 && primaryCompany
      ? routes.employeesNewForCompany(primaryCompany.id)
      : routes.companiesForEmployeeCreation();
  const runPayrollHref = primaryCompany ? routes.runPayrollForCompany(primaryCompany.id) : routes.runPayroll;

  const sections = [
    {
      title: "Company setup",
      actions: [
        {
          title: "Add company",
          description: "Create a company profile for payroll, employees, and documents.",
          href: routes.companiesNew,
          icon: "building" as const,
          tone: "sand" as const,
          actionTone: "core" as const,
        },
        ...(hasCompanies && !payrollSetupComplete
          ? [
              {
                title: "Complete company details",
                description: "Add tax, address, and payroll settings needed for accurate records.",
                href: companyDetailsHref,
                icon: "tax" as const,
                tone: "sand" as const,
                badge: "Setup required",
                emphasis: "setup" as const,
                actionTone: "maintenance" as const,
              },
            ]
          : []),
        ...(companyProfileHref
          ? [
              {
                title: "Edit company profile",
                description: "Update business details used across payroll and documents.",
                href: companyProfileHref,
                icon: "profile" as const,
                tone: "sand" as const,
                actionTone: "maintenance" as const,
              },
            ]
          : []),
      ],
    },
    {
      title: "Team",
      actions: [
        ...(hasCompanies
          ? [
              {
                title: "Add employee",
                description: "Create an employee profile and unlock payroll setup.",
                href: addEmployeeHref,
                icon: "userPlus" as const,
                tone: "olive" as const,
                badge: "Next step",
                emphasis: "recommended" as const,
                actionTone: "core" as const,
              },
            ]
          : []),
        {
          title: "Review team",
          description: "Check employee readiness before preparing payroll.",
          href: routes.employees,
          icon: "team" as const,
          tone: "olive" as const,
          actionTone: "subtle" as const,
        },
        ...(hasEmployees
          ? [
              {
                title: "Update employee details",
                description: "Keep roles, pay details, addresses, and employment records current.",
                href: routes.employees,
                icon: "person" as const,
                tone: "olive" as const,
                actionTone: "subtle" as const,
              },
            ]
          : []),
      ],
    },
    ...(hasEmployees
      ? [
          {
            title: "Payroll",
            actions: [
              {
                title: "Run payroll",
                description: "Prepare a payroll run for the selected company.",
                href: payrollSetupComplete ? runPayrollHref : undefined,
                icon: "payroll" as const,
                tone: "olive" as const,
                actionTone: "core" as const,
                lockedReason: payrollSetupComplete ? undefined : "Complete setup first",
              },
              {
                title: "Review upcoming payroll",
                description: "Check dates, employees, and expected totals before running payroll.",
                href: payrollSetupComplete || hasPayrollRuns ? routes.payroll : undefined,
                icon: "activity" as const,
                tone: "sand" as const,
                actionTone: "subtle" as const,
                lockedReason: payrollSetupComplete || hasPayrollRuns ? undefined : "Complete setup first",
              },
            ],
          },
        ]
      : []),
    ...(hasPayrollRuns || hasDocuments
      ? [
          {
            title: "Documents",
            actions: [
              {
                title: "View documents",
                description: "Review pay stubs, records, and payroll files.",
                href: routes.documents,
                icon: "document" as const,
                tone: "sand" as const,
                actionTone: "maintenance" as const,
              },
            ],
          },
        ]
      : []),
    ...(hasPayrollRuns
      ? [
          {
            title: "Records and reports",
            actions: [
              {
                title: "View payroll history",
                description: "Review past payroll runs and totals.",
                href: routes.payroll,
                icon: "report" as const,
                tone: "sand" as const,
                actionTone: "subtle" as const,
              },
            ],
          },
        ]
      : []),
  ];

  return <WorkflowsPage sections={sections} />;
}
