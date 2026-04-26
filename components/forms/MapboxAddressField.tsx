"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui-primitives/input";
import { SoftNotice } from "@/components/system/SoftNotice";
import {
  isAddressComplete,
  normalizeAddressValue,
  normalizePostalCode,
  searchMapboxAddresses,
  toAddressValueFromSuggestion,
  type AddressSuggestion,
  type AddressValue,
} from "@/lib/mapbox/address-search";
import { useContent } from "@/lib/useContent";

const FIELD_CLASS =
  "h-[56px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";

type MapboxAddressFieldProps = {
  value: AddressValue;
  onChange: (nextValue: AddressValue) => void;
  onTouchedChange?: (touched: boolean) => void;
  showUnitSuite?: boolean;
  onShowUnitSuiteChange?: (nextValue: boolean) => void;
  required?: boolean;
  defaultCountry?: string;
  allowManualEntry?: boolean;
  showRequiredError?: boolean;
  requiredErrorMessage?: string;
};

function manualAddressFrom(value: AddressValue, defaultCountry: string) {
  return normalizeAddressValue(
    {
      ...value,
      source: "manual",
      verified: false,
      country: value.country || defaultCountry,
    },
    defaultCountry
  );
}

function suggestionSecondaryLabel(suggestion: AddressSuggestion) {
  const values = [suggestion.city, suggestion.province, suggestion.country].filter(Boolean);
  return values.join(", ");
}

export function MapboxAddressField({
  value,
  onChange,
  onTouchedChange,
  showUnitSuite = false,
  onShowUnitSuiteChange,
  required = false,
  defaultCountry = "CA",
  allowManualEntry = true,
  showRequiredError = false,
  requiredErrorMessage = "Select a verified address or enter it manually.",
}: MapboxAddressFieldProps) {
  const c = useContent();
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const hasToken = useMemo(() => Boolean(token), [token]);

  const normalizedValue = useMemo(() => normalizeAddressValue(value, defaultCountry), [defaultCountry, value]);
  const [query, setQuery] = useState(normalizedValue.formattedAddress || normalizedValue.line1);
  const [manualMode, setManualMode] = useState(!hasToken);
  const [isTouched, setIsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const requestIdRef = useRef(0);

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasToken) {
      setManualMode(true);
    }
  }, [hasToken]);

  useEffect(() => {
    if (!hasToken) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 3 || manualMode) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const nextSuggestions = await searchMapboxAddresses({
          query: trimmed,
          token: token!,
          defaultCountry,
        });

        if (!cancelled && requestIdRef.current === requestId) {
          setSuggestions(nextSuggestions.slice(0, 4));
          setOpen(true);
        }
      } catch {
        if (!cancelled && requestIdRef.current === requestId) {
          setSuggestions([]);
          setSearchError(c.addressField.searchUnavailableError);
        }
      } finally {
        if (!cancelled && requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [defaultCountry, hasToken, manualMode, query, token]);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  function handleSuggestionSelect(suggestion: AddressSuggestion) {
    const next = toAddressValueFromSuggestion(suggestion);
    onChange(normalizeAddressValue(next, defaultCountry));
    onShowUnitSuiteChange?.(Boolean(next.hasSubpremise));
    setQuery(suggestion.label);
    setManualMode(false);
    setOpen(false);
  }

  function updateAddress(partial: Partial<AddressValue>) {
    onChange(
      normalizeAddressValue(
        {
          ...normalizedValue,
          ...partial,
        },
        defaultCountry
      )
    );
  }

  const showSelectedSummary = normalizedValue.verified && Boolean(normalizedValue.formattedAddress);
  const showManualInputs = manualMode;
  const showUnitSuiteForVerifiedAddress =
    showSelectedSummary &&
    !showManualInputs &&
    (showUnitSuite || Boolean(normalizedValue.unit) || normalizedValue.hasSubpremise);
  const showAddressError =
    required &&
    !isAddressComplete(normalizedValue) &&
    (showRequiredError || isTouched);
  const addressFieldClass = showAddressError
    ? "h-[52px] rounded-2xl bg-rose-50/40 px-4 text-[14px] text-[#4b1d1d] ring-1 ring-red-200/70 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-rose-50/60 focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-red-200/80"
    : "h-[52px] rounded-2xl bg-white/80 px-4 text-[14px] text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-neutral-300/40";
  const addressFieldClassTall = showAddressError
    ? "h-[56px] rounded-2xl bg-rose-50/40 px-4 text-[14px] text-[#4b1d1d] ring-1 ring-red-200/70 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-rose-50/60 focus:bg-white focus:text-[#1f221c] focus:ring-2 focus:ring-red-200/80"
    : FIELD_CLASS;
  const showOverlay =
    open &&
    !manualMode &&
    !showSelectedSummary &&
    query.trim().length >= 3 &&
    allowManualEntry &&
    (!loading || suggestions.length > 0);

  return (
    <div ref={rootRef} className="space-y-3">
      <label className="block space-y-2">
        <span className="text-[12px] font-medium text-neutral-600">{c.company.create.addressLabel}</span>
        <div className="relative">
          <Input
            value={query}
            onChange={(event) => {
              if (showSelectedSummary && !showManualInputs) return;
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              setSearchError(null);
              if (!nextQuery.trim()) {
                setOpen(false);
                setSuggestions([]);
              } else {
                setOpen(true);
              }

              if (normalizedValue.verified) {
                updateAddress({
                  line1: "",
                  city: "",
                  province: "",
                  postalCode: "",
                  formattedAddress: "",
                  latitude: "",
                  longitude: "",
                  source: "",
                  verified: false,
                });
              }
            }}
            onFocus={() => {
              if (showSelectedSummary && !showManualInputs) {
                return;
              }
              if (query.trim().length >= 3) {
                setOpen(true);
              }
            }}
            onBlur={() => {
              setIsTouched(true);
              onTouchedChange?.(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder={c.company.create.addressPlaceholder}
            aria-invalid={showAddressError}
            className={addressFieldClassTall}
            readOnly={showSelectedSummary && !showManualInputs}
          />

          {showOverlay ? (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl bg-white/95 p-1.5 ring-1 ring-neutral-200/60 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <ul className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-left transition-colors duration-[160ms] hover:bg-neutral-100/70"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <p className="text-[13px] text-neutral-800">{suggestion.line1 || suggestion.label}</p>
                      {suggestionSecondaryLabel(suggestion) ? (
                        <p className="mt-0.5 text-[12px] text-neutral-500">{suggestionSecondaryLabel(suggestion)}</p>
                      ) : null}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setManualMode(true);
                      setOpen(false);
                      onChange(manualAddressFrom(normalizedValue, defaultCountry));
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-[13px] text-neutral-700 transition-colors duration-[160ms] hover:bg-neutral-100/70 hover:text-neutral-900"
                  >
                    {c.addressField.manualEntryCta}
                  </button>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </label>

      {!hasToken ? (
        <SoftNotice
          title={c.addressField.searchUnavailableTitle}
          description={c.addressField.searchUnavailableDetail}
          variant="warning"
        />
      ) : null}

      {showSelectedSummary && !showManualInputs ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onShowUnitSuiteChange?.(true);
            }}
            className="inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-medium text-neutral-600 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/60 hover:text-neutral-900"
          >
            {c.addressField.addUnitSuite}
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              setManualMode(false);
              onShowUnitSuiteChange?.(false);
              updateAddress({
                line1: "",
                unit: "",
                hasSubpremise: false,
                city: "",
                province: "",
                postalCode: "",
                formattedAddress: "",
                latitude: "",
                longitude: "",
                source: "",
                verified: false,
              });
            }}
            className="inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-medium text-neutral-600 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/60 hover:text-neutral-900"
          >
            {c.addressField.changeAddress}
          </button>
        </div>
      ) : null}

      {showUnitSuiteForVerifiedAddress ? (
        <label className="block space-y-2">
          <span className="text-[12px] font-medium text-neutral-600">{c.addressField.unitSuiteOptional}</span>
          <Input
            value={normalizedValue.unit}
            onChange={(event) =>
              updateAddress({
                unit: event.target.value,
                hasSubpremise: Boolean(event.target.value.trim()) || normalizedValue.hasSubpremise,
                source: normalizedValue.source || "mapbox",
              })
            }
            className={addressFieldClass}
          />
        </label>
      ) : null}

      {showManualInputs ? (
        <div className="space-y-3 rounded-2xl bg-white/60 p-3 ring-1 ring-neutral-200/50">
          <label className="block space-y-2">
            <span className="text-[12px] font-medium text-neutral-600">{c.company.create.addressLabel}</span>
            <Input
              value={normalizedValue.line1}
              onChange={(event) => updateAddress({ line1: event.target.value, source: "manual", verified: false })}
              onBlur={() => {
                setIsTouched(true);
                onTouchedChange?.(true);
              }}
              className={addressFieldClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[12px] font-medium text-neutral-600">{c.addressField.manualUnitSuiteOptional}</span>
            <Input
              value={normalizedValue.unit}
              onChange={(event) =>
                updateAddress({
                  unit: event.target.value,
                  hasSubpremise: Boolean(event.target.value.trim()),
                  source: "manual",
                  verified: false,
                })
              }
              onBlur={() => {
                setIsTouched(true);
                onTouchedChange?.(true);
              }}
              className={addressFieldClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[12px] font-medium text-neutral-600">{c.addressField.city}</span>
            <Input
              value={normalizedValue.city}
              onChange={(event) => updateAddress({ city: event.target.value, source: "manual", verified: false })}
              onBlur={() => {
                setIsTouched(true);
                onTouchedChange?.(true);
              }}
              className={addressFieldClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[12px] font-medium text-neutral-600">{c.addressField.provinceState}</span>
            <Input
              value={normalizedValue.province}
              onChange={(event) => updateAddress({ province: event.target.value, source: "manual", verified: false })}
              onBlur={() => {
                setIsTouched(true);
                onTouchedChange?.(true);
              }}
              className={addressFieldClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[12px] font-medium text-neutral-600">{c.addressField.postalCode}</span>
            <Input
              value={normalizedValue.postalCode}
              onChange={(event) => updateAddress({ postalCode: event.target.value, source: "manual", verified: false })}
              onBlur={(event) => {
                setIsTouched(true);
                onTouchedChange?.(true);
                updateAddress({
                  postalCode: normalizePostalCode(event.target.value),
                  source: "manual",
                  verified: false,
                  hasSubpremise: Boolean(normalizedValue.unit),
                });
              }}
              className={addressFieldClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[12px] font-medium text-neutral-600">{c.addressField.country}</span>
            <Input
              value={normalizedValue.country}
              onChange={(event) => updateAddress({ country: event.target.value, source: "manual", verified: false })}
              onBlur={() => {
                setIsTouched(true);
                onTouchedChange?.(true);
              }}
              className={addressFieldClass}
            />
          </label>
        </div>
      ) : null}

      {showAddressError ? <p className="text-[12px] text-rose-900">{requiredErrorMessage}</p> : null}

      <input type="hidden" name="streetAddress" value={normalizedValue.line1 || normalizedValue.formattedAddress} />
      <input type="hidden" name="unitSuite" value={normalizedValue.unit} />
      <input type="hidden" name="city" value={normalizedValue.city} />
      <input type="hidden" name="provinceState" value={normalizedValue.province} />
      <input type="hidden" name="postalCode" value={normalizedValue.postalCode} />
      <input type="hidden" name="country" value={normalizedValue.country} />
      <input type="hidden" name="formattedAddress" value={normalizedValue.formattedAddress} />
      <input type="hidden" name="addressSource" value={normalizedValue.source} />
      <input type="hidden" name="addressVerified" value={String(normalizedValue.verified)} />
      <input type="hidden" name="addressHasSubpremise" value={String(normalizedValue.hasSubpremise)} />
      <input type="hidden" name="latitude" value={normalizedValue.latitude} />
      <input type="hidden" name="longitude" value={normalizedValue.longitude} />
      {/* TODO(db): persist address source/verified/coordinates once dedicated columns are added. */}
    </div>
  );
}
