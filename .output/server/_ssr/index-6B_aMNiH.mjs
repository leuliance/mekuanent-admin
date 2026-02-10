import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useSuspenseQuery, q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { u as useDebouncer } from "../_chunks/_libs/@tanstack/react-pacer.mjs";
import { I as Route$c, S as Skeleton, J as getContentItems, L as updateContentStatus, M as deleteContentItem, K as getContentStats } from "./router-deJypcsT.mjs";
import { C as ContentTypeBadge, a as ContentStatusBadge } from "./content-type-badge-B63Xn81M.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as canDelete } from "./roles-B1zM8dwz.mjs";
import { H as Plus, a5 as Video, a9 as Music, p as Funnel, F as FileText, E as Eye, N as Trash2, L as LoaderCircle, l as Check, X, _ as ChevronLeft, g as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@tanstack/pacer.mjs";
import "../_chunks/_libs/@tanstack/devtools-event-client.mjs";
import "../_chunks/_libs/@tanstack/store.mjs";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
const contentQueryOptions = (params) => queryOptions({
  queryKey: ["content", params],
  queryFn: () => getContentItems({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      content_type: params.content_type,
      search: params.search || ""
    }
  })
});
const contentStatsQueryOptions = () => queryOptions({
  queryKey: ["content-stats"],
  queryFn: () => getContentStats()
});
function ContentEmptyState({
  hasFilters,
  onClearFilters
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: hasFilters ? "No matching content" : "No content yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-5", children: hasFilters ? "Try adjusting your search or filter criteria." : "Get started by adding your first content item." }),
    hasFilters ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClearFilters, children: "Clear Filters" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/content/new" }), nativeButton: false, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      "Add Content"
    ] })
  ] });
}
function ContentPage() {
  const searchParams = Route$c.useSearch();
  const navigate = useNavigate({
    from: Route$c.fullPath
  });
  const {
    locale
  } = useLocaleStore();
  const {
    user
  } = Route$c.useRouteContext();
  const showDelete = !!user && canDelete(user.role);
  const [searchInput, setSearchInput] = reactExports.useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = reactExports.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [statusChanging, setStatusChanging] = reactExports.useState(null);
  const contentQuery = useSuspenseQuery(contentQueryOptions({
    page: searchParams.page,
    status: searchParams.status,
    content_type: searchParams.type,
    search: searchParams.search
  }));
  const statsQuery = useSuspenseQuery(contentStatsQueryOptions());
  const {
    content,
    total,
    page,
    totalPages
  } = contentQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && contentQuery.isRefetching;
  const debouncedSearch = useDebouncer((value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: value.trim() || void 0,
        page: 1
      })
    });
  }, {
    wait: 500
  });
  reactExports.useEffect(() => {
    if (searchInput || searchParams.search) {
      setHasSearched(true);
    }
    debouncedSearch.maybeExecute(searchInput);
  }, [searchInput, searchParams.search]);
  const handleStatusFilter = (value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: !value || value === "Status: All" ? void 0 : value,
        page: 1
      })
    });
  };
  const handleTypeFilter = (value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: !value || value === "Type: All" ? void 0 : value,
        page: 1
      })
    });
  };
  const handlePageChange = (newPage) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage
      })
    });
  };
  const handleClearFilters = () => {
    setSearchInput("");
    setHasSearched(false);
    navigate({
      search: {
        page: 1,
        status: void 0,
        type: void 0,
        search: void 0
      }
    });
  };
  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteContentItem({
        data: {
          id: deletingId
        }
      });
      setDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success("Content deleted successfully");
      contentQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast.error(`Failed to delete content: ${error instanceof Error ? error.message : "Unknown error"}`, {
        style: {
          background: "red"
        }
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const handleStatusChange = async (id, newStatus) => {
    setStatusChanging(id);
    try {
      await updateContentStatus({
        data: {
          id,
          status: newStatus
        }
      });
      toast.success(`Content ${newStatus === "approved" ? "approved" : newStatus === "rejected" ? "rejected" : "updated"} successfully`);
      contentQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(`Failed to update status: ${error instanceof Error ? error.message : "Unknown error"}`, {
        style: {
          background: "red"
        }
      });
    } finally {
      setStatusChanging(null);
    }
  };
  const hasFilters = !!(searchParams.search || searchParams.status || searchParams.type);
  const getLocalizedName = (obj) => {
    return getLocalizedText(obj, locale);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage and review all content items" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/content/new" }), nativeButton: false, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Add Content"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-400", children: [
          stats.pending,
          " Pending"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400", children: [
          stats.approved,
          " Approved"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-sm font-medium text-red-700 dark:text-red-400", children: [
          stats.rejected,
          " Rejected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "inline h-3 w-3 mr-1" }),
          stats.byType.video,
          " Videos"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "inline h-3 w-3 mr-1" }),
          stats.byType.audio,
          " Audio"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search content by title...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), className: "w-full" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.status || "Status: All", onValueChange: handleStatusFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status: All" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Status: All", children: "Status: All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending_approval", children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "approved", children: "Approved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "rejected", children: "Rejected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "archived", children: "Archived" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.type || "Type: All", onValueChange: handleTypeFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[180px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Type: All" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Type: All", children: "Type: All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "video", children: "Video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "audio", children: "Audio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "article", children: "Article" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "story", children: "Story" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "room", children: "Room" })
          ] })
        ] })
      ] }) }),
      isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full" })
          ] })
        ] })
      ] }, i)) }) : content.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ContentEmptyState, { hasFilters, onClearFilters: handleClearFilters }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: content.map((item) => {
          const title = getLocalizedName(item.title);
          const churchName = item.churches ? getLocalizedName(item.churches.name) : "";
          const creator = item.profiles;
          const creatorName = creator ? `${creator.first_name || ""} ${creator.last_name || ""}`.trim() : "Unknown";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden group hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 bg-muted", children: [
              item.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.thumbnail_url, alt: title, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center", children: item.content_type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-10 w-10 text-muted-foreground/40" }) : item.content_type === "audio" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-10 w-10 text-muted-foreground/40" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground/40" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", className: "h-8", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/content/$contentId", params: {
                  contentId: item.id
                } }), nativeButton: false, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 mr-1" }),
                  "View"
                ] }),
                showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", size: "sm", className: "h-8", onClick: () => {
                  setDeletingId(item.id);
                  setDeleteDialogOpen(true);
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-sm line-clamp-1", children: title || "Untitled" }),
                churchName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: churchName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ContentTypeBadge, { type: item.content_type }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ContentStatusBadge, { status: item.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: creatorName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(item.created_at).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: item.status === "pending_approval" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", disabled: statusChanging === item.id, onClick: () => handleStatusChange(item.id, "approved"), children: statusChanging === item.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-green-600" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", disabled: statusChanging === item.id, onClick: () => handleStatusChange(item.id, "rejected"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 text-red-600" }) })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  item.view_count || 0,
                  " views"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  item.like_count || 0,
                  " likes"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  item.share_count || 0,
                  " shares"
                ] })
              ] })
            ] })
          ] }, item.id);
        }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            (page - 1) * 10 + 1,
            " to",
            " ",
            Math.min(page * 10, total),
            " of ",
            total,
            " items"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page - 1), disabled: page <= 1, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              "Previous"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page + 1), disabled: page >= totalPages, children: [
              "Next",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Are you sure you want to delete this content item? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteDialogOpen(false), disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) })
  ] });
}
export {
  ContentPage as component
};
