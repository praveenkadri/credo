const SENSITIVE_KEY_PATTERN = /(sin|social|bank|account|routing|payroll_account|birth|dob|address|hst|bin|business_number)/i;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function sanitizeAuditDetails<T extends Record<string, unknown>>(details: T): Record<string, JsonValue> {
  return sanitizeObject(details);
}

export function stringifyAuditDetails(details: Record<string, unknown>) {
  return JSON.stringify(sanitizeAuditDetails(details));
}

export function sanitizeForDeveloperLog(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeForDeveloperLog);
  }

  if (!value || typeof value !== "object") {
    return typeof value === "string" ? redactSensitiveString(value) : value;
  }

  return sanitizeObject(value as Record<string, unknown>);
}

function sanitizeObject(value: Record<string, unknown>): Record<string, JsonValue> {
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      key,
      SENSITIVE_KEY_PATTERN.test(key) ? "[redacted]" : sanitizeValue(nested),
    ])
  );
}

function sanitizeValue(value: unknown): JsonValue {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return redactSensitiveString(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (typeof value === "object") {
    return sanitizeObject(value as Record<string, unknown>);
  }

  return String(value);
}

function redactSensitiveString(value: string) {
  return value.replace(/\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/g, "[redacted]");
}
