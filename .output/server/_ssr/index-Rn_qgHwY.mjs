import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useSuspenseQuery, q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { u as useDebouncer } from "../_chunks/_libs/@tanstack/react-pacer.mjs";
import { N as Route$b, S as Skeleton, O as getChurches, P as getChurchStats } from "./router-deJypcsT.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { C as ChurchStatusBadge } from "./church-status-badge-CobafqzG.mjs";
import { H as Plus, p as Funnel, a as Church, a7 as MapPin, r as Phone, E as Eye, _ as ChevronLeft, g as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/sonner.mjs";
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
const churchesQueryOptions = (params) => queryOptions({
  queryKey: ["churches", params],
  queryFn: () => getChurches({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      category: params.category,
      search: params.search || ""
    }
  })
});
const churchStatsQueryOptions = () => queryOptions({
  queryKey: ["church-stats"],
  queryFn: () => getChurchStats()
});
function ChurchesEmptyState({
  hasFilters,
  onClearFilters
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "h-7 w-7 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: hasFilters ? "No matching churches" : "No churches yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-5", children: hasFilters ? "Try adjusting your search or filter criteria to find what you're looking for." : "Get started by adding your first church to the platform." }),
    hasFilters ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClearFilters, children: "Clear Filters" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/churches/new" }), nativeButton: false, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      "Add Church"
    ] })
  ] });
}
function ChurchesPage() {
  const searchParams = Route$b.useSearch();
  const navigate = useNavigate({
    from: Route$b.fullPath
  });
  const {
    locale
  } = useLocaleStore();
  const [searchInput, setSearchInput] = reactExports.useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = reactExports.useState(false);
  const churchesQuery = useSuspenseQuery(churchesQueryOptions({
    page: searchParams.page,
    status: searchParams.status,
    category: searchParams.category,
    search: searchParams.search
  }));
  const statsQuery = useSuspenseQuery(churchStatsQueryOptions());
  const {
    churches,
    total,
    page,
    totalPages
  } = churchesQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && churchesQuery.isRefetching;
  const debouncedSearch = useDebouncer((value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: value.trim() || void 0,
        // Only set if non-empty
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
        status: !value || value === "all" ? void 0 : value,
        page: 1
      })
    });
  };
  const handleCategoryFilter = (value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: !value || value === "all" ? void 0 : value,
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
        category: void 0,
        search: void 0
      }
    });
  };
  const hasFilters = !!(searchParams.search || searchParams.status || searchParams.category);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Churches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage and review church registrations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/churches/new" }), nativeButton: false, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Add Church"
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
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name or phone...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), className: "w-full" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.status || "Status: All", onValueChange: handleStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[180px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status: All" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Status: All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "approved", children: "Approved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "rejected", children: "Rejected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "suspended", children: "Suspended" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.category || "Category: All", onValueChange: handleCategoryFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[180px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Category: All" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Category: All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "church", children: "Church" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "monastery", children: "Monastery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "female-monastery", children: "Female Monastery" })
        ] })
      ] })
    ] }) }),
    isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Church" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: Array.from({
        length: 5
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8" }) })
      ] }, i)) })
    ] }) }) }) : churches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChurchesEmptyState, { hasFilters, onClearFilters: handleClearFilters }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Church" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: churches.map((church) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10", children: church.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: church.logo_url, alt: "", className: "h-full w-full rounded-lg object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "h-4 w-4 text-primary/40" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: getLocalizedText(church.name, locale) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: church.email || "No email" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-sm", children: church.category.replace("-", " ") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[120px]", children: getLocalizedText(church.city, locale) || "Unknown" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: church.phone_number })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChurchStatusBadge, { status: church.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/churches/$churchId", params: {
            churchId: church.id
          } }), nativeButton: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) }) })
        ] }, church.id)) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Showing ",
          (page - 1) * 10 + 1,
          " to ",
          Math.min(page * 10, total),
          " ",
          "of ",
          total,
          " churches"
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
    ] }) })
  ] }) }) });
}
export {
  ChurchesPage as component
};
