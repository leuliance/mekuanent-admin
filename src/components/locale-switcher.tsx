import { useLocaleStore, LOCALES } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const current = LOCALES.find((l) => l.value === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs font-semibold"
          />
        }
      >
        <Languages className="h-4 w-4" />
        {current?.value.toUpperCase() || "EN"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc.value}
            onClick={() => setLocale(loc.value)}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium w-6">
                {loc.value.toUpperCase()}
              </span>
              <span className="text-muted-foreground text-xs flex-1">
                {loc.nativeLabel}
              </span>
              {locale === loc.value && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
