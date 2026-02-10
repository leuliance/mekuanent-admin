import { b as create, p as persist } from "../_libs/zustand.mjs";
const LOCALES = [
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "am", label: "Amharic", nativeLabel: "አማርኛ" },
  { value: "or", label: "Oromo", nativeLabel: "Afaan Oromoo" },
  { value: "so", label: "Somali", nativeLabel: "Soomaali" },
  { value: "ti", label: "Tigrinya", nativeLabel: "ትግርኛ" }
];
const useLocaleStore = create()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale })
    }),
    {
      name: "mekuanent-locale"
    }
  )
);
function getLocalizedText(value, locale = "en") {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const obj = value;
    if (obj[locale]) return obj[locale];
    for (const loc of ["en", "am", "or", "so", "ti"]) {
      if (obj[loc]) return obj[loc];
    }
    for (const val of Object.values(obj)) {
      if (val) return String(val);
    }
    return "";
  }
  return String(value ?? "");
}
export {
  LOCALES as L,
  getLocalizedText as g,
  useLocaleStore as u
};
