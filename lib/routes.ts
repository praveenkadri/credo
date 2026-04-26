type SearchParamValue = string | number | boolean | null | undefined;
type SearchParamRecord = Record<string, SearchParamValue>;

const COMPANY_DETAIL_PATTERN = /^\/companies\/([^/]+)$/;
const COMPANY_CHILD_PATTERN = /^\/companies\/([^/]+)(?:\/|$)/;
const COMPANY_DELETE_PATTERN = /^\/companies\/[^/]+\/delete$/;
const COMPANY_PROFILE_PATTERN = /^\/companies\/[^/]+\/profile$/;
const COMPANY_PROFILE_EDIT_PATTERN = /^\/companies\/[^/]+\/profile\/edit$/;
const COMPANY_PROFILE_SECTION_EDIT_PATTERN = /^\/companies\/[^/]+\/profile\/[^/]+\/edit$/;
const COMPANY_CONFIRM_PATTERN = /^\/companies\/[^/]+\/confirm$/;

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function withSearch(pathname: string, searchParams?: SearchParamRecord) {
  if (!searchParams) {
    return pathname;
  }

  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `${pathname}?${serialized}` : pathname;
}

function matches(pathname: string, pattern: RegExp) {
  return pattern.test(normalizePathname(pathname));
}

export const routes = {
  home: "/",
  overview: "/app",
  dashboardAlias: "/dashboard",
  companiesAlias: "/companies",
  companiesNew: "/companies/new",
  documents: "/documents",
  payroll: "/payroll",
  runPayroll: "/payroll/run",
  team: "/team",
  insights: "/insights",
  compliance: "/compliance",
  documentsView: (searchParams?: SearchParamRecord) => withSearch("/documents", searchParams),
  firstCompanySetup: () => withSearch("/companies/new", { mode: "first" }),
  overviewDeleted: () => withSearch("/app", { deleted: 1 }),
  company: (companyId: string) => `/companies/${companyId}`,
  companyCreated: (companyId: string) => withSearch(`/companies/${companyId}`, { created: 1 }),
  companyConfirmed: (companyId: string) => withSearch(`/companies/${companyId}`, { confirmed: 1 }),
  companyProfile: (companyId: string) => `/companies/${companyId}/profile`,
  companyProfileSaved: (companyId: string) => withSearch(`/companies/${companyId}/profile`, { saved: 1 }),
  companyProfileEdit: (companyId: string) => `/companies/${companyId}/profile/edit`,
  companyProfileSectionEdit: (companyId: string, section: string) => `/companies/${companyId}/profile/${section}/edit`,
  companyConfirm: (companyId: string) => `/companies/${companyId}/confirm`,
  companyDelete: (companyId: string) => `/companies/${companyId}/delete`,
} as const;

export function getRouteCompanyId(pathname: string) {
  const match = normalizePathname(pathname).match(COMPANY_CHILD_PATTERN);
  return match?.[1] ?? null;
}

export function isOverviewPath(pathname: string) {
  const normalized = normalizePathname(pathname);
  return normalized === routes.overview || normalized === routes.dashboardAlias;
}

export function isPayrollPath(pathname: string) {
  return normalizePathname(pathname).startsWith(routes.payroll);
}

export function isCompanyDetailPath(pathname: string) {
  return matches(pathname, COMPANY_DETAIL_PATTERN);
}

export function isCompanyDeletePath(pathname: string) {
  return matches(pathname, COMPANY_DELETE_PATTERN);
}

export function isCompanyProfilePath(pathname: string) {
  return matches(pathname, COMPANY_PROFILE_PATTERN);
}

export function isCompanyProfileEditPath(pathname: string) {
  return matches(pathname, COMPANY_PROFILE_EDIT_PATTERN);
}

export function isCompanyProfileSectionEditPath(pathname: string) {
  return matches(pathname, COMPANY_PROFILE_SECTION_EDIT_PATTERN);
}

export function isCompanyConfirmPath(pathname: string) {
  return matches(pathname, COMPANY_CONFIRM_PATTERN);
}

export function isFirstCompanySetupPath(pathname: string, mode: string | null | undefined) {
  return normalizePathname(pathname) === routes.companiesNew && mode === "first";
}

export function shouldHideRightRail(pathname: string) {
  return (
    isPayrollPath(pathname) ||
    normalizePathname(pathname) === routes.companiesNew ||
    isCompanyDeletePath(pathname) ||
    isCompanyProfilePath(pathname) ||
    isCompanyProfileEditPath(pathname) ||
    isCompanyProfileSectionEditPath(pathname) ||
    isCompanyConfirmPath(pathname)
  );
}
