import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { u as useRouter } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { Q as Route$a, T as updateEventCategory, U as updateDonationCategory, V as createEventCategory, W as createDonationCategory, X as deleteEventCategory, Y as deleteDonationCategory, Z as updateRegionCategory, _ as createRegionCategory, $ as deleteRegionCategory } from "./router-deJypcsT.mjs";
import { u as useLocaleStore } from "./locale-store-Cb3Cdr7y.mjs";
import { c as canDelete } from "./roles-B1zM8dwz.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { S as Switch } from "./switch-DFkPXkmz.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D6RZxBhq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as Calendar, D as DollarSign, a7 as MapPin, H as Plus, Q as Pencil, N as Trash2, L as LoaderCircle, f as Tags } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/zustand.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
function safeLocalizedText(data, locale) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    const obj = data;
    return obj[locale] || obj.en || obj.am || Object.values(obj)[0] || "";
  }
  return String(data);
}
function CategoriesPage() {
  const {
    eventCategories,
    donationCategories,
    regionCategories
  } = Route$a.useLoaderData();
  const {
    locale
  } = useLocaleStore();
  const router = useRouter();
  const {
    user
  } = Route$a.useRouteContext();
  const showDelete = !!user && canDelete(user.role);
  const typedEventCats = eventCategories;
  const typedDonationCats = donationCategories;
  const typedRegionCats = regionCategories;
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [editingCategory, setEditingCategory] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [categoryType, setCategoryType] = reactExports.useState("event");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [nameEn, setNameEn] = reactExports.useState("");
  const [nameAm, setNameAm] = reactExports.useState("");
  const [descEn, setDescEn] = reactExports.useState("");
  const [descAm, setDescAm] = reactExports.useState("");
  const [icon, setIcon] = reactExports.useState("");
  const [color, setColor] = reactExports.useState("#6366f1");
  const [regionDialogOpen, setRegionDialogOpen] = reactExports.useState(false);
  const [editingRegion, setEditingRegion] = reactExports.useState(null);
  const [regionDeleteDialogOpen, setRegionDeleteDialogOpen] = reactExports.useState(false);
  const [deletingRegionId, setDeletingRegionId] = reactExports.useState(null);
  const [regionNameEn, setRegionNameEn] = reactExports.useState("");
  const [regionNameAm, setRegionNameAm] = reactExports.useState("");
  const [regionSlug, setRegionSlug] = reactExports.useState("");
  const [regionDescEn, setRegionDescEn] = reactExports.useState("");
  const [regionDescAm, setRegionDescAm] = reactExports.useState("");
  const [regionColorStart, setRegionColorStart] = reactExports.useState("#6366f1");
  const [regionColorEnd, setRegionColorEnd] = reactExports.useState("#8b5cf6");
  const [regionOrder, setRegionOrder] = reactExports.useState(0);
  const [regionActive, setRegionActive] = reactExports.useState(true);
  const openCreate = (type) => {
    setCategoryType(type);
    setEditingCategory(null);
    resetForm();
    setDialogOpen(true);
  };
  const openEdit = (cat, type) => {
    setCategoryType(type);
    setEditingCategory(cat);
    const name = cat.name;
    const desc = cat.description;
    setNameEn(name?.en || "");
    setNameAm(name?.am || "");
    setDescEn(desc?.en || "");
    setDescAm(desc?.am || "");
    setIcon(cat.icon || "");
    setColor(cat.color || "#6366f1");
    setDialogOpen(true);
  };
  const resetForm = () => {
    setNameEn("");
    setNameAm("");
    setDescEn("");
    setDescAm("");
    setIcon("");
    setColor("#6366f1");
  };
  const handleSubmit = async () => {
    if (!nameEn.trim()) {
      toast.error("English name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        name: {
          en: nameEn.trim(),
          am: nameAm.trim() || nameEn.trim()
        },
        description: {
          en: descEn.trim(),
          am: descAm.trim() || descEn.trim()
        },
        icon: icon.trim() || null,
        color: color || null
      };
      if (editingCategory) {
        if (categoryType === "event") await updateEventCategory({
          data: {
            id: editingCategory.id,
            ...payload
          }
        });
        else await updateDonationCategory({
          data: {
            id: editingCategory.id,
            ...payload
          }
        });
        toast.success("Category updated");
      } else {
        if (categoryType === "event") await createEventCategory({
          data: payload
        });
        else await createDonationCategory({
          data: payload
        });
        toast.success("Category created");
      }
      setDialogOpen(false);
      resetForm();
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    try {
      if (categoryType === "event") await deleteEventCategory({
        data: {
          id: deletingId
        }
      });
      else await deleteDonationCategory({
        data: {
          id: deletingId
        }
      });
      toast.success("Category deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const openRegionCreate = () => {
    setEditingRegion(null);
    setRegionNameEn("");
    setRegionNameAm("");
    setRegionSlug("");
    setRegionDescEn("");
    setRegionDescAm("");
    setRegionColorStart("#6366f1");
    setRegionColorEnd("#8b5cf6");
    setRegionOrder(typedRegionCats.length);
    setRegionActive(true);
    setRegionDialogOpen(true);
  };
  const openRegionEdit = (r) => {
    setEditingRegion(r);
    const dn = r.display_name;
    const desc = r.description;
    setRegionNameEn(dn?.en || "");
    setRegionNameAm(dn?.am || "");
    setRegionSlug(r.slug || "");
    setRegionDescEn(desc?.en || "");
    setRegionDescAm(desc?.am || "");
    setRegionColorStart(r.color_start || "#6366f1");
    setRegionColorEnd(r.color_end || "#8b5cf6");
    setRegionOrder(r.display_order || 0);
    setRegionActive(Boolean(r.is_active));
    setRegionDialogOpen(true);
  };
  const handleRegionSubmit = async () => {
    if (!regionNameEn.trim() || !regionSlug.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingRegion) {
        await updateRegionCategory({
          data: {
            id: editingRegion.id,
            display_name: {
              en: regionNameEn.trim(),
              am: regionNameAm.trim() || regionNameEn.trim()
            },
            description: regionDescEn.trim() ? {
              en: regionDescEn.trim(),
              am: regionDescAm.trim() || regionDescEn.trim()
            } : void 0,
            color_start: regionColorStart,
            color_end: regionColorEnd,
            display_order: regionOrder,
            is_active: regionActive
          }
        });
        toast.success("Region updated");
      } else {
        await createRegionCategory({
          data: {
            name: regionSlug.trim(),
            slug: regionSlug.trim().toLowerCase().replace(/\s+/g, "-"),
            display_name: {
              en: regionNameEn.trim(),
              am: regionNameAm.trim() || regionNameEn.trim()
            },
            description: regionDescEn.trim() ? {
              en: regionDescEn.trim(),
              am: regionDescAm.trim() || regionDescEn.trim()
            } : void 0,
            color_start: regionColorStart,
            color_end: regionColorEnd,
            display_order: regionOrder,
            is_active: regionActive
          }
        });
        toast.success("Region created");
      }
      setRegionDialogOpen(false);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRegionDelete = async () => {
    if (!deletingRegionId) return;
    setIsSubmitting(true);
    try {
      await deleteRegionCategory({
        data: {
          id: deletingRegionId
        }
      });
      toast.success("Region deleted");
      setRegionDeleteDialogOpen(false);
      setDeletingRegionId(null);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderCategoryList = (categories, type) => {
    if (categories.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tags, { className: "h-7 w-7 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground max-w-sm mb-4", children: [
        "Create categories to organize your ",
        type === "event" ? "events" : "donation campaigns",
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openCreate(type), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
        "Create Category"
      ] })
    ] });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-muted/30 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", style: {
          backgroundColor: cat.color || "#6366f1"
        }, children: cat.icon || safeLocalizedText(cat.name, locale)?.[0]?.toUpperCase() || "?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: String(safeLocalizedText(cat.name, locale)) }),
          !!cat.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: String(safeLocalizedText(cat.description, locale)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => openEdit(cat, type), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
        showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-destructive hover:text-destructive", onClick: () => {
          setCategoryType(type);
          setDeletingId(cat.id);
          setDeleteDialogOpen(true);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, cat.id)) }) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Categories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage event, donation, and region categories" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "event", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "event", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 mr-1.5" }),
            "Events (",
            typedEventCats.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "donation", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 mr-1.5" }),
            "Donations (",
            typedDonationCats.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "region", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 mr-1.5" }),
            "Regions (",
            typedRegionCats.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "event", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => openCreate("event"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
            "Add Event Category"
          ] }) }),
          renderCategoryList(typedEventCats, "event")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "donation", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => openCreate("donation"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
            "Add Donation Category"
          ] }) }),
          renderCategoryList(typedDonationCats, "donation")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "region", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openRegionCreate, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
            "Add Region"
          ] }) }),
          typedRegionCats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-7 w-7 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No regions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-4", children: "Add regions to categorize churches by location." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openRegionCreate, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
              "Create Region"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: typedRegionCats.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-16 rounded-lg shrink-0", style: {
                background: `linear-gradient(135deg, ${r.color_start}, ${r.color_end})`
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: safeLocalizedText(r.display_name, locale) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono", children: r.slug }),
                  !r.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", children: "Inactive" })
                ] }),
                r.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: safeLocalizedText(r.description, locale) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  "Order: ",
                  r.display_order
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => openRegionEdit(r), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
              showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-destructive hover:text-destructive", onClick: () => {
                setDeletingRegionId(r.id);
                setRegionDeleteDialogOpen(true);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] })
          ] }, r.id)) }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
          editingCategory ? "Edit" : "Create",
          " ",
          categoryType === "event" ? "Event" : "Donation",
          " Category"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingCategory ? "Update the category details." : "Add a new category." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name (English) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: nameEn, onChange: (e) => setNameEn(e.target.value), placeholder: "English name" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name (Amharic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: nameAm, onChange: (e) => setNameAm(e.target.value), placeholder: "የአማርኛ ስም" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: descEn, onChange: (e) => setDescEn(e.target.value), placeholder: "Brief description" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description (Amharic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: descAm, onChange: (e) => setDescAm(e.target.value), placeholder: "አጭር መግለጫ" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Icon (emoji)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: icon, onChange: (e) => setIcon(e.target.value), placeholder: "e.g. 🎉" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: color, onChange: (e) => setColor(e.target.value), className: "h-9 w-12 rounded border cursor-pointer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: color, onChange: (e) => setColor(e.target.value), className: "flex-1 font-mono text-xs" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), disabled: isSubmitting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSubmit, disabled: isSubmitting || !nameEn.trim(), children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          editingCategory ? "Saving..." : "Creating..."
        ] }) : editingCategory ? "Save" : "Create" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "This may affect items using this category." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteDialogOpen(false), disabled: isSubmitting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: isSubmitting, children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: regionDialogOpen, onOpenChange: setRegionDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
          editingRegion ? "Edit" : "Create",
          " Region"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingRegion ? "Update region details." : "Add a new region category." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name (English) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: regionNameEn, onChange: (e) => setRegionNameEn(e.target.value), placeholder: "English name" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name (Amharic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: regionNameAm, onChange: (e) => setRegionNameAm(e.target.value), placeholder: "የአማርኛ ስም" })
          ] })
        ] }),
        !editingRegion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Slug *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: regionSlug, onChange: (e) => setRegionSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")), placeholder: "e.g. addis-ababa", className: "font-mono" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: regionDescEn, onChange: (e) => setRegionDescEn(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description (Amharic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: regionDescAm, onChange: (e) => setRegionDescAm(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Gradient Start" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: regionColorStart, onChange: (e) => setRegionColorStart(e.target.value), className: "h-9 w-12 rounded border cursor-pointer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: regionColorStart, onChange: (e) => setRegionColorStart(e.target.value), className: "flex-1 font-mono text-xs" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Gradient End" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: regionColorEnd, onChange: (e) => setRegionColorEnd(e.target.value), className: "h-9 w-12 rounded border cursor-pointer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: regionColorEnd, onChange: (e) => setRegionColorEnd(e.target.value), className: "flex-1 font-mono text-xs" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Display Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: regionOrder, onChange: (e) => setRegionOrder(Number(e.target.value)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: regionActive, onCheckedChange: setRegionActive }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Active" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRegionDialogOpen(false), disabled: isSubmitting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleRegionSubmit, disabled: isSubmitting || !regionNameEn.trim() || !editingRegion && !regionSlug.trim(), children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          editingRegion ? "Saving..." : "Creating..."
        ] }) : editingRegion ? "Save" : "Create" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: regionDeleteDialogOpen, onOpenChange: setRegionDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Region" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Churches using this region may be affected." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRegionDeleteDialogOpen(false), disabled: isSubmitting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleRegionDelete, disabled: isSubmitting, children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) })
  ] });
}
export {
  CategoriesPage as component
};
