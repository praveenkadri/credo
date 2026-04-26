export type AddressSource = "mapbox" | "manual" | "";

export type AddressValue = {
  line1: string;
  unit: string;
  hasSubpremise: boolean;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  formattedAddress: string;
  source: AddressSource;
  verified: boolean;
};

export type AddressSuggestion = {
  id: string;
  label: string;
  line1: string;
  hasSubpremise: boolean;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formattedAddress: string;
};

const PROVINCE_BY_CODE: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

const PROVINCE_CODE_BY_NAME = Object.fromEntries(
  Object.entries(PROVINCE_BY_CODE).map(([code, name]) => [name.toLowerCase(), code])
);

const MAPBOX_CANADA_COUNTRY_CODE = "ca";

function findContext(context: any[], prefix: string) {
  return context.find((entry) => String(entry?.id ?? "").startsWith(prefix));
}

export function normalizeProvince(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const upper = trimmed.toUpperCase();
  if (PROVINCE_BY_CODE[upper]) return upper;
  return PROVINCE_CODE_BY_NAME[trimmed.toLowerCase()] ?? trimmed;
}

export function normalizeCountry(input: string, defaultCountry = "CA") {
  const trimmed = input.trim();
  if (!trimmed) return defaultCountry;

  if (trimmed.toLowerCase() === "canada") return "CA";
  if (trimmed.toLowerCase() === "united states" || trimmed.toLowerCase() === "usa") return "US";
  if (trimmed.length === 2) return trimmed.toUpperCase();

  return trimmed;
}

export function normalizePostalCode(input: string) {
  const compact = input.toUpperCase().replace(/\s+/g, "").trim();
  if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(compact)) {
    return `${compact.slice(0, 3)} ${compact.slice(3)}`;
  }
  return compact;
}

export function toAddressSuggestion(feature: any, defaultCountry = "CA"): AddressSuggestion {
  const context = Array.isArray(feature?.context) ? feature.context : [];
  const addressNumber = String(feature?.address ?? "").trim();
  const streetText = String(feature?.text ?? "").trim();

  const place = findContext(context, "place");
  const locality = findContext(context, "locality");
  const district = findContext(context, "district");
  const region = findContext(context, "region");
  const postcode = findContext(context, "postcode");
  const country = findContext(context, "country");

  const line1 = `${addressNumber} ${streetText}`.trim() || streetText;
  const city = String(place?.text ?? locality?.text ?? district?.text ?? "").trim();
  const province = normalizeProvince(String(region?.short_code ?? region?.text ?? ""));
  const postalCode = normalizePostalCode(String(postcode?.text ?? ""));
  const countryValue = normalizeCountry(String(country?.short_code ?? country?.text ?? ""), defaultCountry);

  const center = Array.isArray(feature?.center) ? feature.center : [];
  const longitude = Number(center[0]);
  const latitude = Number(center[1]);

  const label = String(feature?.place_name ?? line1).trim();
  const hasSubpremise =
    /\b(unit|suite|apt|apartment|ste|floor|fl)\b/i.test(label) ||
    /#\s*\w+/i.test(label) ||
    /^\d+\s*-\s*\d+/.test(line1);

  return {
    id: String(feature?.id ?? `${feature?.place_name ?? line1}-${Math.random()}`),
    label,
    line1,
    hasSubpremise,
    city,
    province,
    postalCode,
    country: countryValue,
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
    formattedAddress: String(feature?.place_name ?? line1).trim(),
  };
}

export async function searchMapboxAddresses({
  query,
  token,
  defaultCountry = "CA",
}: {
  query: string;
  token: string;
  defaultCountry?: string;
}) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [] as AddressSuggestion[];
  }

  const endpoint =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    `${encodeURIComponent(trimmed)}.json?autocomplete=true&limit=6&country=${MAPBOX_CANADA_COUNTRY_CODE}&types=address,place,postcode&access_token=${token}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("mapbox_search_failed");
  }

  const payload = (await response.json()) as { features?: any[] };
  return (payload.features ?? [])
    .map((feature) => toAddressSuggestion(feature, defaultCountry))
    .filter((suggestion) => normalizeCountry(suggestion.country, defaultCountry) === "CA");
}

export function toAddressValueFromSuggestion(suggestion: AddressSuggestion): AddressValue {
  return {
    line1: suggestion.line1.trim(),
    unit: "",
    hasSubpremise: suggestion.hasSubpremise,
    city: suggestion.city.trim(),
    province: normalizeProvince(suggestion.province),
    postalCode: normalizePostalCode(suggestion.postalCode),
    country: normalizeCountry(suggestion.country, "CA"),
    latitude: suggestion.latitude != null ? String(suggestion.latitude) : "",
    longitude: suggestion.longitude != null ? String(suggestion.longitude) : "",
    formattedAddress: suggestion.formattedAddress,
    source: "mapbox",
    verified: true,
  };
}

export function normalizeAddressValue(input: Partial<AddressValue>, defaultCountry = "CA"): AddressValue {
  return {
    line1: String(input.line1 ?? "").trim(),
    unit: String(input.unit ?? "").trim(),
    hasSubpremise: Boolean(input.hasSubpremise),
    city: String(input.city ?? "").trim(),
    province: normalizeProvince(String(input.province ?? "")),
    postalCode: normalizePostalCode(String(input.postalCode ?? "")),
    country: normalizeCountry(String(input.country ?? ""), defaultCountry),
    latitude: String(input.latitude ?? "").trim(),
    longitude: String(input.longitude ?? "").trim(),
    formattedAddress: String(input.formattedAddress ?? "").trim(),
    source: (input.source as AddressSource) ?? "",
    verified: Boolean(input.verified),
  };
}

export function isAddressComplete(value: AddressValue) {
  return Boolean(value.line1.trim() || value.formattedAddress.trim());
}
