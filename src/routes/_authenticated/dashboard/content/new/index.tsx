import {
  createFileRoute,
  useNavigate,
  useRouter,
  Link,
} from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { createContentItem } from "@/api/content";
import { getChurches } from "@/api/churches";
import { useLocaleStore, getLocalizedText } from "@/stores/locale-store";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { Database } from "@/types/database.types";

type ContentType = Database["public"]["Enums"]["content_type"];
type ContentStatus = Database["public"]["Enums"]["content_status"];

// ============ HELPERS ============
function getErrorMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    if ("message" in error) {
      const msg = (error as Record<string, unknown>).message;
      if (typeof msg === "string") return msg;
    }
    if (
      "issues" in error &&
      Array.isArray((error as Record<string, unknown>).issues)
    ) {
      const issues = (error as { issues: Array<{ message: string }> }).issues;
      return issues[0]?.message || "";
    }
  }
  try {
    const str = JSON.stringify(error);
    if (str && str !== "{}") return str;
  } catch {
    /* ignore */
  }
  return "";
}

function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors || errors.length === 0) return null;
  const msg = getErrorMessage(errors[0]);
  if (!msg) return null;
  return <p className="text-xs text-destructive">{msg}</p>;
}

// ============ SCHEMA ============
const createContentSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_am: z.string().min(1, "Amharic title is required"),
  description_en: z.string(),
  description_am: z.string(),
  content_type: z.enum(["audio", "video", "article", "story", "room"]),
  church_id: z.string().min(1, "Church is required"),
  thumbnail_url: z.string(),
  status: z.enum([
    "draft",
    "pending_approval",
    "approved",
    "rejected",
    "archived",
  ]),
});

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

export const Route = createFileRoute(
  "/_authenticated/dashboard/content/new/"
)({
  loader: async () => {
    // Load churches for the dropdown
    const churchesData = await getChurches({
      data: { page: 1, limit: 100 },
    });
    return { churches: churchesData.churches };
  },
  component: NewContentPage,
});

function NewContentPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { locale } = useLocaleStore();
  const { churches } = Route.useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title_en: "",
      title_am: "",
      description_en: "",
      description_am: "",
      content_type: "video" as ContentType,
      church_id: "",
      thumbnail_url: "",
      status: "draft" as ContentStatus,
    },
    validators: {
      onBlur: createContentSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await createContentItem({
          data: {
            title_en: value.title_en,
            title_am: value.title_am,
            description_en: value.description_en || undefined,
            description_am: value.description_am || undefined,
            content_type: value.content_type,
            church_id: value.church_id,
            thumbnail_url: value.thumbnail_url || undefined,
            status: value.status,
            created_by: "", // Will be set server-side in a real app
          },
        });
        router.invalidate();
        navigate({ to: "/dashboard/content", search: { page: 1, search: undefined } });
      } catch (error) {
        console.error("Failed to create content:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const hasRequiredFields =
    !!form.state.values.title_en &&
    !!form.state.values.title_am &&
    !!form.state.values.church_id;

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button
            variant="ghost"
            size="sm"
            render={<Link to="/dashboard/content" search={{ page: 1, search: undefined }} />}
            nativeButton={false}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Add New Content
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the content details. Fields marked with * are required in
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
            {/* Title Section */}
            <SectionCard title="Content Title *">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <form.Field name="title_en">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">English *</Label>
                      <Input
                        placeholder="Content title in English"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                </form.Field>
                <form.Field name="title_am">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Amharic (አማርኛ) *</Label>
                      <Input
                        placeholder="Content title in Amharic"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                </form.Field>
              </div>
            </SectionCard>

            {/* Basic Information */}
            <SectionCard title="Basic Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <form.Field name="content_type">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Content Type *</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) =>
                          field.handleChange(v as ContentType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="room">Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
                <form.Field name="church_id">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Church *</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v || "")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a church" />
                        </SelectTrigger>
                        <SelectContent>
                          {churches.map(
                            (church: { id: string; name: unknown }) => (
                              <SelectItem key={church.id} value={church.id}>
                                {getLocalizedText(church.name, locale)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                </form.Field>
                <form.Field name="status">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) =>
                          field.handleChange(v as ContentStatus)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending_approval">
                            Pending Approval
                          </SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
                <form.Field name="thumbnail_url">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Thumbnail URL</Label>
                      <Input
                        placeholder="https://..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </SectionCard>

            {/* Description */}
            <SectionCard title="Description">
              <Tabs defaultValue="en">
                <TabsList>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="am">AM</TabsTrigger>
                </TabsList>
                <TabsContent value="en">
                  <form.Field name="description_en">
                    {(field) => (
                      <div className="space-y-1.5">
                        <RichTextEditor
                          value={field.state.value}
                          onChange={(html) => field.handleChange(html)}
                          placeholder="Describe the content in English..."
                        />
                      </div>
                    )}
                  </form.Field>
                </TabsContent>
                <TabsContent value="am">
                  <form.Field name="description_am">
                    {(field) => (
                      <div className="space-y-1.5">
                        <RichTextEditor
                          value={field.state.value}
                          onChange={(html) => field.handleChange(html)}
                          placeholder="Describe the content in Amharic..."
                        />
                      </div>
                    )}
                  </form.Field>
                </TabsContent>
              </Tabs>
            </SectionCard>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                render={<Link to="/dashboard/content" search={{ page: 1, search: undefined }} />}
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
                    Create Content
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
