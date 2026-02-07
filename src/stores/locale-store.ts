import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "en" | "am" | "or" | "so" | "ti";

export const LOCALES: { value: Locale; label: string; nativeLabel: string }[] =
  [
    { value: "en", label: "English", nativeLabel: "English" },
    { value: "am", label: "Amharic", nativeLabel: "አማርኛ" },
    { value: "or", label: "Oromo", nativeLabel: "Afaan Oromoo" },
    { value: "so", label: "Somali", nativeLabel: "Soomaali" },
    { value: "ti", label: "Tigrinya", nativeLabel: "ትግርኛ" },
  ];

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "mekuanent-locale",
    }
  )
);

/**
 * Extract text from a localized JSON field { en: string, am: string, ... }
 * Falls back through locales if the preferred one is empty.
 */
export function getLocalizedText(
  value: unknown,
  locale: Locale = "en"
): string {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, string>;
    if (obj[locale]) return obj[locale];
    // Fallback chain: en -> am -> or -> so -> ti
    for (const loc of ["en", "am", "or", "so", "ti"]) {
      if (obj[loc]) return obj[loc];
    }
    // Last resort: any non-empty value
    for (const val of Object.values(obj)) {
      if (val) return String(val);
    }
    return "";
  }
  return String(value ?? "");
}
