import {
  createFileRoute,
  useNavigate,
  useRouter,
  Link,
} from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { createChurch, type ChurchCategory } from "@/api/churches";
import { LOCALES } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, Loader2, Save, CalendarIcon } from "lucide-react";

// ============ HELPERS ============

/** Extract a human-readable message from any TanStack Form error value. */
function getErrorMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    // TanStack Form + Zod wraps errors as { message: string, ... }
    if ("message" in error) {
      const msg = (error as Record<string, unknown>).message;
      if (typeof msg === "string") return msg;
    }
    // Array of issues from Zod
    if ("issues" in error && Array.isArray((error as Record<string, unknown>).issues)) {
      const issues = (error as { issues: Array<{ message: string }> }).issues;
      return issues[0]?.message || "";
    }
  }
  // Last resort – avoid [object Object]
  try {
    const str = JSON.stringify(error);
    if (str && str !== "{}") return str;
  } catch {
    // ignore
  }
  return "";
}

/** Render the first error for a field, if any. */
function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors || errors.length === 0) return null;
  const msg = getErrorMessage(errors[0]);
  if (!msg) return null;
  return <p className="text-xs text-destructive">{msg}</p>;
}

// ============ SCHEMA ============
const createChurchFormSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_am: z.string().min(1, "Amharic name is required"),
  name_or: z.string(),
  name_so: z.string(),
  name_ti: z.string(),
  description_en: z.string().min(1, "English description is required"),
  description_am: z.string().min(1, "Amharic description is required"),
  description_or: z.string(),
  description_so: z.string(),
  description_ti: z.string(),
  category: z.enum(["church", "monastery", "female-monastery"]),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z
    .string()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Please enter a valid email address"
    ),
  website: z.string(),
  city_en: z.string(),
  city_am: z.string(),
  city_or: z.string(),
  city_so: z.string(),
  city_ti: z.string(),
  address_en: z.string(),
  address_am: z.string(),
  address_or: z.string(),
  address_so: z.string(),
  address_ti: z.string(),
  country_en: z.string(),
  country_am: z.string(),
  country_or: z.string(),
  country_so: z.string(),
  country_ti: z.string(),
  founded_year: z.string(),
});

export const Route = createFileRoute(
  "/_authenticated/dashboard/churches/new/"
)({
  component: NewChurchPage,
});

// ============ SECTION CARD ============
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ============ YEAR PICKER ============
function YearPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (year: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // Generate years from 100 AD to current year
  const years: number[] = [];
  for (let y = currentYear; y >= 100; y--) {
    years.push(y);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={
        <Button
          type="button"
          variant="outline"
          data-empty={!value}
          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        />
      }
      nativeButton={false}
      >
        {value ? `Year ${value}` : "Select year"}
        <CalendarIcon className="h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b">
            <Input
              placeholder="Search year..."
              value={value}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                onChange(v);
              }}
              className="h-8"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {years
              .filter((y) => !value || String(y).includes(value))
              .slice(0, 100)
              .map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`w-full px-3 py-1.5 text-sm text-left rounded-md hover:bg-accent transition-colors ${
                    value === String(year)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : ""
                  }`}
                  onClick={() => {
                    onChange(String(year));
                    setOpen(false);
                  }}
                >
                  {year}
                </button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============ MAIN PAGE ============
function NewChurchPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      name_en: "",
      name_am: "",
      name_or: "",
      name_so: "",
      name_ti: "",
      description_en: "",
      description_am: "",
      description_or: "",
      description_so: "",
      description_ti: "",
      category: "church" as ChurchCategory,
      phone_number: "",
      email: "",
      website: "",
      city_en: "",
      city_am: "",
      city_or: "",
      city_so: "",
      city_ti: "",
      address_en: "",
      address_am: "",
      address_or: "",
      address_so: "",
      address_ti: "",
      country_en: "",
      country_am: "",
      country_or: "",
      country_so: "",
      country_ti: "",
      founded_year: "",
    },
    validators: {
      onBlur: createChurchFormSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await createChurch({
          data: {
            name_en: value.name_en,
            name_am: value.name_am,
            name_or: value.name_or || undefined,
            name_so: value.name_so || undefined,
            name_ti: value.name_ti || undefined,
            description_en: value.description_en,
            description_am: value.description_am,
            description_or: value.description_or || undefined,
            description_so: value.description_so || undefined,
            description_ti: value.description_ti || undefined,
            category: value.category,
            phone_number: value.phone_number,
            email: value.email || undefined,
            website: value.website || undefined,
            city_en: value.city_en || undefined,
            city_am: value.city_am || undefined,
            city_or: value.city_or || undefined,
            city_so: value.city_so || undefined,
            city_ti: value.city_ti || undefined,
            address_en: value.address_en || undefined,
            address_am: value.address_am || undefined,
            address_or: value.address_or || undefined,
            address_so: value.address_so || undefined,
            address_ti: value.address_ti || undefined,
            country_en: value.country_en || undefined,
            country_am: value.country_am || undefined,
            country_or: value.country_or || undefined,
            country_so: value.country_so || undefined,
            country_ti: value.country_ti || undefined,
            founded_year: value.founded_year
              ? Number(value.founded_year)
              : undefined,
          },
        });
        router.invalidate();
        navigate({
          to: "/dashboard/churches",
          search: {
            status: undefined,
            category: undefined,
            page: 1,
            search: undefined,
          },
        });
      } catch (error) {
        console.error("Failed to create church:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Check if all required fields are filled
  const hasRequiredFields =
    !!form.state.values.name_en &&
    !!form.state.values.name_am &&
    !!form.state.values.description_en &&
    !!form.state.values.description_am &&
    !!form.state.values.phone_number &&
    !!form.state.values.category;

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link
                to="/dashboard/churches"
                search={{
                  status: undefined,
                  category: undefined,
                  page: 1,
                  search: undefined,
                }}
              />
            }
            nativeButton={false}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Churches
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Add New Church
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the church details. Fields marked with * are required in
              English and Amharic.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* Name Section */}
            <SectionCard title="Church Name *">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LOCALES.map((loc) => (
                  <form.Field
                    key={loc.value}
                    name={`name_${loc.value}` as "name_en"}
                  >
                    {(field) => (
                      <div className="space-y-1.5">
                        <Label className="text-xs">
                          {loc.nativeLabel}
                          {(loc.value === "en" || loc.value === "am") && " *"}
                        </Label>
                        <Input
                          placeholder={`Church name in ${loc.label}`}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    )}
                  </form.Field>
                ))}
              </div>
            </SectionCard>

            {/* Category & Contact */}
            <SectionCard title="Basic Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <form.Field name="category">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category *</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) =>
                          field.handleChange(v as ChurchCategory)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="church">Church</SelectItem>
                          <SelectItem value="monastery">Monastery</SelectItem>
                          <SelectItem value="female-monastery">
                            Female Monastery
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
                <form.Field name="phone_number">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Phone Number *</Label>
                      <PhoneInput
                        defaultCountry="ET"
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val || "")}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                </form.Field>
                <form.Field name="email">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Email</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                </form.Field>
                <form.Field name="website">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Website</Label>
                      <Input
                        placeholder="https://..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="founded_year">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Founded Year</Label>
                      <YearPicker
                        value={field.state.value}
                        onChange={(year) => field.handleChange(year)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </SectionCard>

            {/* Description */}
            <SectionCard title="Description *">
              <Tabs defaultValue="en">
                <TabsList>
                  {LOCALES.map((loc) => (
                    <TabsTrigger key={loc.value} value={loc.value}>
                      {loc.value.toUpperCase()}
                      {(loc.value === "en" || loc.value === "am") && " *"}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((loc) => (
                  <TabsContent key={loc.value} value={loc.value}>
                    <form.Field
                      name={`description_${loc.value}` as "description_en"}
                    >
                      {(field) => (
                        <div className="space-y-1.5">
                          <RichTextEditor
                            value={field.state.value}
                            onChange={(html) => field.handleChange(html)}
                            placeholder={`Describe the church in ${loc.label}...`}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </div>
                      )}
                    </form.Field>
                  </TabsContent>
                ))}
              </Tabs>
            </SectionCard>

            {/* Location */}
            <SectionCard title="Location">
              <Tabs defaultValue="en">
                <TabsList>
                  {LOCALES.map((loc) => (
                    <TabsTrigger key={loc.value} value={loc.value}>
                      {loc.value.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((loc) => (
                  <TabsContent key={loc.value} value={loc.value}>
                    <div className="grid grid-cols-1 gap-3">
                      <form.Field name={`city_${loc.value}` as "city_en"}>
                        {(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              City ({loc.label})
                            </Label>
                            <Input
                              placeholder={`City in ${loc.label}`}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </div>
                        )}
                      </form.Field>
                      <form.Field
                        name={`address_${loc.value}` as "address_en"}
                      >
                        {(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              Address ({loc.label})
                            </Label>
                            <Input
                              placeholder={`Address in ${loc.label}`}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </div>
                        )}
                      </form.Field>
                      <form.Field
                        name={`country_${loc.value}` as "country_en"}
                      >
                        {(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              Country ({loc.label})
                            </Label>
                            <Input
                              placeholder={`Country in ${loc.label}`}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </SectionCard>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                render={
                  <Link
                    to="/dashboard/churches"
                    search={{
                      status: undefined,
                      category: undefined,
                      page: 1,
                      search: undefined,
                    }}
                  />
                }
                nativeButton={false}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !hasRequiredFields}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Church
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
