"use client";

import { useCallback, useEffect, useState } from "react";

type SetValueAction<T> = T | ((previous: T) => T);

export function useSessionDraft<T>(key: string, initialValue: T) {
  const [value, setValueState] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.sessionStorage.getItem(key);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as T;
      setValueState(parsed);
    } catch {
      window.sessionStorage.removeItem(key);
    }
  }, [key]);

  const setValue = useCallback(
    (next: SetValueAction<T>) => {
      setValueState((previous) => {
        const resolved = typeof next === "function" ? (next as (previous: T) => T)(previous) : next;

        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // Ignore quota/serialization issues and keep in-memory state.
          }
        }

        return resolved;
      });
    },
    [key]
  );

  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(key);
    }
    setValueState(initialValue);
  }, [initialValue, key]);

  return { value, setValue, clearDraft };
}
