import type { Json } from "@/types/database.types";

/**
 * Extract localized string from a multilingual JSON object
 * Falls back to English -> Amharic -> raw string
 */
export function getLocalizedText(
  value: Json | null | undefined,
  fallback = "Unknown"
): string {
  if (!value) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    if (typeof obj.en === "string" && obj.en) return obj.en;
    if (typeof obj.am === "string" && obj.am) return obj.am;
    // Try first string value
    const firstValue = Object.values(obj).find((v) => typeof v === "string");
    if (firstValue) return firstValue as string;
  }

  return fallback;
}

/**
 * Format currency with proper locale
 */
export function formatCurrency(
  amount: number,
  currency = "ETB",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date with various styles
 */
export function formatDate(
  date: string | Date,
  style: "short" | "medium" | "long" | "full" = "medium"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { month: "numeric", day: "numeric", year: "2-digit" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  }[style];

  return d.toLocaleDateString("en-US", options);
}

/**
 * Format time
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(d, "medium");
}

/**
 * Get initials from name
 */
export function getInitials(
  firstName?: string | null,
  lastName?: string | null
): string {
  const first = firstName?.[0]?.toUpperCase() || "";
  const last = lastName?.[0]?.toUpperCase() || "";
  return first + last || "?";
}

/**
 * Calculate percentage
 */
export function calculatePercentage(
  current: number,
  total: number,
  maxValue = 100
): number {
  if (total === 0) return 0;
  return Math.min((current / total) * 100, maxValue);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Pluralize a word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const pluralForm = plural || singular + "s";
  return count === 1 ? singular : pluralForm;
}
