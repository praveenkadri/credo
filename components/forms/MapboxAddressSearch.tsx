"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui-primitives/input";
import { Button } from "@/components/ui-primitives/button";
import { SoftNotice } from "@/components/system/SoftNotice";

type MapboxAddressSuggestion = {
  id: string;
  label: string;
  streetAddress: string;
  city: string;
  provinceState: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

const MAPBOX_CANADA_COUNTRY_CODE = "ca";

function parseSuggestion(feature: any): MapboxAddressSuggestion {
  const context = Array.isArray(feature?.context) ? feature.context : [];
  const text = String(feature?.text ?? "").trim();
  const addressNumber = String(feature?.address ?? "").trim();

  const getContextByPrefix = (prefix: string) =>
    context.find((entry: any) => String(entry?.id ?? "").startsWith(prefix));

  const place = getContextByPrefix("place");
  const locality = getContextByPrefix("locality");
  const district = getContextByPrefix("district");
  const region = getContextByPrefix("region");
  const postcode = getContextByPrefix("postcode");
  const country = getContextByPrefix("country");

  const city = String(place?.text ?? locality?.text ?? district?.text ?? "").trim();
  const provinceState = String(region?.text ?? "").trim();
  const postalCode = String(postcode?.text ?? "").trim();
  const countryLabel = String(country?.text ?? feature?.properties?.short_code?.toUpperCase?.() ?? "").trim();

  const coordinates = Array.isArray(feature?.center) ? feature.center : [];
  const longitude = Number(coordinates?.[0]);
  const latitude = Number(coordinates?.[1]);

  return {
    id: String(feature?.id ?? `${feature?.place_name ?? text}-${Math.random()}`),
    label: String(feature?.place_name ?? "").trim() || `${addressNumber} ${text}`.trim(),
    streetAddress: `${addressNumber} ${text}`.trim() || text,
    city,
    provinceState,
    postalCode,
    country: countryLabel,
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
  };
}

function isCanadianSuggestion(suggestion: MapboxAddressSuggestion) {
  const country = suggestion.country.trim().toLowerCase();
  return country === "canada" || country === "ca";
}

export function MapboxAddressSearch({
  query,
  onQueryChange,
  onSelect,
  onManualEntry,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (suggestion: MapboxAddressSuggestion) => void;
  onManualEntry: () => void;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<MapboxAddressSuggestion[]>([]);

  const hasToken = useMemo(() => !!token, [token]);

  useEffect(() => {
    if (!hasToken) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const endpoint =
          "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          `${encodeURIComponent(trimmed)}.json?autocomplete=true&limit=6&country=${MAPBOX_CANADA_COUNTRY_CODE}&types=address,place,postcode&access_token=${token}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("address_search_failed");
        }

        const payload = (await response.json()) as { features?: any[] };
        const nextSuggestions = (payload.features ?? [])
          .map(parseSuggestion)
          .filter((item) => item.streetAddress && isCanadianSuggestion(item));

        if (!cancelled) {
          setSuggestions(nextSuggestions);
          setOpen(true);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setError("Address search is unavailable right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 240);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hasToken, query, token]);

  return (
    <div className="space-y-3">
      <label className="block space-y-2">
        <span className="text-[12px] font-medium text-neutral-600">Address search</span>
        <div className="relative">
          <Input
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length) {
                setOpen(true);
              }
            }}
            placeholder="Search for an address"
            className="h-[56px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40"
          />

          {open && suggestions.length > 0 ? (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl bg-white/95 p-1.5 ring-1 ring-neutral-200/60 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <ul className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-left text-[13px] text-neutral-700 transition-colors duration-[160ms] hover:bg-neutral-100/70 hover:text-neutral-900"
                      onClick={() => {
                        onSelect(suggestion);
                        setOpen(false);
                      }}
                    >
                      {suggestion.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </label>

      {!hasToken ? (
        <SoftNotice
          title="Address search is unavailable"
          description="Continue with manual address entry."
          variant="warning"
        />
      ) : null}

      {loading ? (
        <SoftNotice
          title="Searching for address…"
          description="Choose a suggestion or continue with manual entry."
          variant="info"
        />
      ) : null}
      {error ? <SoftNotice title="Address search failed" description={error} variant="error" /> : null}
      {!loading && !error && hasToken && query.trim().length >= 3 && suggestions.length === 0 ? (
        <SoftNotice
          title="We couldn’t find that address"
          description="Enter the address manually."
          variant="warning"
        />
      ) : null}

      <Button type="button" variant="secondary" onClick={onManualEntry}>
        I don&apos;t see my address
      </Button>
    </div>
  );
}

export type { MapboxAddressSuggestion };
