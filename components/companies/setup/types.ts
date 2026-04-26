export type CompanySetupValues = {
  companyName: string;
  legalName: string;
  sameAsCompanyName: boolean;
  establishedDate: string;
  addressSearchQuery: string;
  streetAddress: string;
  unitSuite: string;
  city: string;
  provinceState: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  binNumber: string;
  payrollNumber: string;
  hstNumber: string;
  businessNumber: string;
  fiscalYearEnd: string;
  directorName: string;
  directorTitle: string;
};

export type CompanySetupStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
