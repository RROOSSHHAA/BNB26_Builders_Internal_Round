/**
 * Black Box Security, Privacy & Redaction Engine
 * 
 * Provides automated detection and redaction of sensitive credentials,
 * API tokens, PII, and private keys before telemetry persistence or export.
 */

export interface SecurityPolicy {
  autoRedactApiKeys: boolean;
  autoRedactTokens: boolean;
  autoRedactPii: boolean;
  retentionDays: number;
  deploymentMode: "cloud" | "private";
  sandboxIsolationLevel: "container_gvisor" | "ephemeral_vm";
  exportSanitization: boolean;
}

export const DEFAULT_SECURITY_POLICY: SecurityPolicy = {
  autoRedactApiKeys: true,
  autoRedactTokens: true,
  autoRedactPii: true,
  retentionDays: 30,
  deploymentMode: "cloud",
  sandboxIsolationLevel: "container_gvisor",
  exportSanitization: true,
};

// Patterns for sensitive data detection
const SENSITIVE_PATTERNS = [
  // OpenAI / generic API keys
  { regex: /sk-[a-zA-Z0-9_\-]{20,}/g, replacement: "sk-[REDACTED:API_KEY]" },
  { regex: /bb_[a-zA-Z0-9_\-]{20,}/g, replacement: "bb_[REDACTED:BLACKBOX_KEY]" },
  { regex: /gh[pousr]_[a-zA-Z0-9]{30,}/g, replacement: "gh[REDACTED:GITHUB_TOKEN]" },
  { regex: /AIza[0-9A-Za-z-_]{35}/g, replacement: "AIza[REDACTED:GOOGLE_KEY]" },
  // Bearer Authorization tokens
  { regex: /Bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi, replacement: "Bearer [REDACTED:TOKEN]" },
  // Passwords in URLs or key-value pairs
  { regex: /password=["']?[^"'\s,;]+["']?/gi, replacement: "password=[REDACTED]" },
  { regex: /secret=["']?[^"'\s,;]+["']?/gi, replacement: "secret=[REDACTED]" },
  // Private keys
  { regex: /-----BEGIN\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+PRIVATE\s+KEY-----/gi, replacement: "-----BEGIN PRIVATE KEY-----\n[REDACTED:PRIVATE_KEY]\n-----END PRIVATE KEY-----" },
  // Email addresses (PII)
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: "[REDACTED:EMAIL]" },
];

/**
 * Automatically sanitizes text strings by replacing sensitive credentials with redaction markers.
 */
export function redactSensitiveText(input: string): string {
  if (!input) return input;
  let sanitized = input;
  for (const { regex, replacement } of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(regex, replacement);
  }
  return sanitized;
}

/**
 * Deep sanitizes objects or JSON structures recursively.
 */
export function redactSensitiveData<T>(data: T): T {
  if (!data) return data;

  if (typeof data === "string") {
    return redactSensitiveText(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("password") ||
        lowerKey.includes("secret") ||
        lowerKey.includes("private_key") ||
        lowerKey.includes("api_key") ||
        lowerKey.includes("authorization")
      ) {
        if (typeof value === "string") {
          cleaned[key] = "[REDACTED]";
        } else {
          cleaned[key] = redactSensitiveData(value);
        }
      } else {
        cleaned[key] = redactSensitiveData(value);
      }
    }
    return cleaned as T;
  }

  return data;
}

/**
 * Retrieve active security policy from localStorage with fallback to default
 */
export function getSecurityPolicy(): SecurityPolicy {
  if (typeof window === "undefined") return DEFAULT_SECURITY_POLICY;
  try {
    const stored = localStorage.getItem("blackbox_security_policy");
    if (stored) {
      return { ...DEFAULT_SECURITY_POLICY, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SECURITY_POLICY;
}

/**
 * Persist updated security policy to localStorage
 */
export function saveSecurityPolicy(policy: Partial<SecurityPolicy>): SecurityPolicy {
  if (typeof window === "undefined") return DEFAULT_SECURITY_POLICY;
  try {
    const current = getSecurityPolicy();
    const updated = { ...current, ...policy };
    localStorage.setItem("blackbox_security_policy", JSON.stringify(updated));
    return updated;
  } catch {}
  return DEFAULT_SECURITY_POLICY;
}
