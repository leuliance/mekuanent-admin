import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useForm } from "../_chunks/_libs/@tanstack/react-form.mjs";
import { ab as Route$5, ac as createContentItem } from "./router-deJypcsT.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D6RZxBhq.mjs";
import { R as RichTextEditor } from "./rich-text-editor-CmB5h5F3.mjs";
import { ag as ArrowLeft, L as LoaderCircle, z as Save } from "../_libs/lucide-react.mjs";
import { o as object, _ as _enum, s as string } from "../_libs/zod.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_chunks/_libs/@tanstack/form-core.mjs";
import "../_chunks/_libs/@tanstack/store.mjs";
import "../_chunks/_libs/@tanstack/pacer-lite.mjs";
import "../_chunks/_libs/@tanstack/devtools-event-client.mjs";
import "../_chunks/_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import "../_chunks/_libs/@tanstack/react-query.mjs";
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_libs/sonner.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zustand.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
import "../_chunks/_libs/@platejs/basic-nodes.mjs";
import "../_chunks/_libs/@platejs/core.mjs";
import "../_chunks/_libs/@platejs/slate.mjs";
import "../_chunks/_libs/@udecode/utils.mjs";
import "../_libs/slate.mjs";
import "../_libs/slate-dom.mjs";
import "../_libs/is-hotkey.mjs";
import "../_libs/lodash.mjs";
import "../_libs/nanoid.mjs";
import "node:crypto";
import "../_libs/zustand-x.mjs";
import "../_libs/immer.mjs";
import "../_libs/mutative.mjs";
import "../_libs/react-tracked.mjs";
import "../_libs/proxy-compare.mjs";
import "../_libs/slate-hyperscript.mjs";
import "../_libs/is-plain-object.mjs";
import "../_libs/slate-react.mjs";
import "../_libs/direction.mjs";
import "../_libs/scroll-into-view-if-needed.mjs";
import "../_libs/compute-scroll-into-view.mjs";
import "../_chunks/_libs/@juggle/resize-observer.mjs";
import "../_libs/react-compiler-runtime.mjs";
import "../_chunks/_libs/@udecode/react-hotkeys.mjs";
import "../_libs/jotai-x.mjs";
import "../_libs/jotai.mjs";
import "../_libs/use-deep-compare.mjs";
import "../_libs/dequal.mjs";
import "../_chunks/_libs/@udecode/react-utils.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_libs/jotai-optics.mjs";
import "../_libs/optics-ts.mjs";
import "../_chunks/_libs/@platejs/utils.mjs";
import "./tooltip-BpKl2fwd.mjs";
function getErrorMessage(error) {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    if ("message" in error) {
      const msg = error.message;
      if (typeof msg === "string") return msg;
    }
    if ("issues" in error && Array.isArray(error.issues)) {
      const issues = error.issues;
      return issues[0]?.message || "";
    }
  }
  try {
    const str = JSON.stringify(error);
    if (str && str !== "{}") return str;
  } catch {
  }
  return "";
}
function FieldError({
  errors
}) {
  if (!errors || errors.length === 0) return null;
  const msg = getErrorMessage(errors[0]);
  if (!msg) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: msg });
}
const createContentSchema = object({
  title_en: string().min(1, "English title is required"),
  title_am: string().min(1, "Amharic title is required"),
  description_en: string(),
  description_am: string(),
  content_type: _enum(["audio", "video", "article", "story", "room"]),
  church_id: string().min(1, "Church is required"),
  thumbnail_url: string(),
  status: _enum(["draft", "pending_approval", "approved", "rejected", "archived"])
});
function SectionCard({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-4", children: title }),
    children
  ] });
}
function NewContentPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const {
    locale
  } = useLocaleStore();
  const {
    churches
  } = Route$5.useLoaderData();
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const form = useForm({
    defaultValues: {
      title_en: "",
      title_am: "",
      description_en: "",
      description_am: "",
      content_type: "video",
      church_id: "",
      thumbnail_url: "",
      status: "draft"
    },
    validators: {
      onBlur: createContentSchema
    },
    onSubmit: async ({
      value
    }) => {
      setIsSubmitting(true);
      try {
        await createContentItem({
          data: {
            title_en: value.title_en,
            title_am: value.title_am,
            description_en: value.description_en || void 0,
            description_am: value.description_am || void 0,
            content_type: value.content_type,
            church_id: value.church_id,
            thumbnail_url: value.thumbnail_url || void 0,
            status: value.status,
            created_by: ""
            // Will be set server-side in a real app
          }
        });
        router.invalidate();
        navigate({
          to: "/dashboard/content",
          search: {
            page: 1,
            search: void 0
          }
        });
      } catch (error) {
        console.error("Failed to create content:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });
  const hasRequiredFields = !!form.state.values.title_en && !!form.state.values.title_am && !!form.state.values.church_id;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/content", search: {
      page: 1,
      search: void 0
    } }), nativeButton: false, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
      "Back to Content"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Add New Content" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Fill in the content details. Fields marked with * are required in English and Amharic." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }, className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Content Title *", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "title_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "English *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Content title in English", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "title_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Amharic (አማርኛ) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Content title in Amharic", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Basic Information", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "content_type", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Content Type *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.state.value, onValueChange: (v) => field.handleChange(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "video", children: "Video" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "audio", children: "Audio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "article", children: "Article" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "story", children: "Story" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "room", children: "Room" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "church_id", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Church *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.state.value, onValueChange: (v) => field.handleChange(v || ""), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a church" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: churches.map((church) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: church.id, children: getLocalizedText(church.name, locale) }, church.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "status", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.state.value, onValueChange: (v) => field.handleChange(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending_approval", children: "Pending Approval" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "approved", children: "Approved" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "thumbnail_url", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Thumbnail URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "https://...", value: field.state.value, onChange: (e) => field.handleChange(e.target.value) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "en", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "en", children: "EN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "am", children: "AM" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "en", children: /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "description_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextEditor, { value: field.state.value, onChange: (html) => field.handleChange(html), placeholder: "Describe the content in English..." }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "am", children: /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "description_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextEditor, { value: field.state.value, onChange: (html) => field.handleChange(html), placeholder: "Describe the content in Amharic..." }) }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/content", search: {
          page: 1,
          search: void 0
        } }), nativeButton: false, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isSubmitting || !hasRequiredFields, children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Creating..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
          "Create Content"
        ] }) })
      ] })
    ] })
  ] }) }) });
}
export {
  NewContentPage as component
};
