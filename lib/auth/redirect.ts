import { routes } from "@/lib/routes";

const INTERNAL_REDIRECT_ORIGIN = "https://credo.local";

export function getSafeRedirectPath(value: string | null | undefined, fallback: string = routes.overview) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const parsed = new URL(value, INTERNAL_REDIRECT_ORIGIN);
    if (parsed.origin !== INTERNAL_REDIRECT_ORIGIN) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function getCurrentPathWithSearch(pathname: string, search = "") {
  return `${pathname}${search}`;
}
