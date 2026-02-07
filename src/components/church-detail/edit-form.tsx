import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { LOCALES } from "@/stores/locale-store";
import { SectionCard } from "./section-card";
import { FieldError } from "./field-error";

export function EditForm({
  form,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Form typing with dynamic field names
  form: any;
}) {
  return (
    <div className="space-y-6">
      {/* Name Section */}
      <SectionCard title="Church Name *">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOCALES.map((loc) => (
            <form.Field key={loc.value} name={`name_${loc.value}`}>
              {(field: {
                state: { value: string; meta: { errors: unknown[] } };
                handleChange: (v: string) => void;
                handleBlur: () => void;
              }) => (
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

      {/* Basic Information */}
      <SectionCard title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <form.Field name="category">
            {(field: {
              state: { value: string };
              handleChange: (v: string) => void;
            }) => (
              <div className="space-y-1.5">
                <Label className="text-xs">Category *</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value || "")}
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
            {(field: {
              state: { value: string; meta: { errors: unknown[] } };
              handleChange: (v: string) => void;
              handleBlur: () => void;
            }) => (
              <div className="space-y-1.5">
                <Label className="text-xs">Phone Number *</Label>
                <Input
                  placeholder="+251..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>
          <form.Field name="email">
            {(field: {
              state: { value: string };
              handleChange: (v: string) => void;
            }) => (
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="website">
            {(field: {
              state: { value: string };
              handleChange: (v: string) => void;
            }) => (
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
            {(field: {
              state: { value: string };
              handleChange: (v: string) => void;
            }) => (
              <div className="space-y-1.5">
                <Label className="text-xs">Founded Year</Label>
                <Input
                  type="number"
                  placeholder="1900"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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
              <form.Field name={`description_${loc.value}`}>
                {(field: {
                  state: { value: string; meta: { errors: unknown[] } };
                  handleChange: (v: string) => void;
                }) => (
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
                <form.Field name={`city_${loc.value}`}>
                  {(field: {
                    state: { value: string };
                    handleChange: (v: string) => void;
                  }) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">City ({loc.label})</Label>
                      <Input
                        placeholder={`City in ${loc.label}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name={`address_${loc.value}`}>
                  {(field: {
                    state: { value: string };
                    handleChange: (v: string) => void;
                  }) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Address ({loc.label})</Label>
                      <Input
                        placeholder={`Address in ${loc.label}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name={`country_${loc.value}`}>
                  {(field: {
                    state: { value: string };
                    handleChange: (v: string) => void;
                  }) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Country ({loc.label})</Label>
                      <Input
                        placeholder={`Country in ${loc.label}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </SectionCard>
    </div>
  );
}
