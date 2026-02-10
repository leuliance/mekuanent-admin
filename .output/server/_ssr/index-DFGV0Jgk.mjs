import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useDebouncer } from "../_chunks/_libs/@tanstack/react-pacer.mjs";
import { u as useSuspenseQuery, q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { z as Route$e, S as Skeleton, A as getEvents, B as getEventStats } from "./router-deJypcsT.mjs";
import { E as EventStatusBadge } from "./event-status-badge-Cc4u8kjj.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { p as Funnel, c as Calendar, a5 as Video, E as Eye, n as Clock, a6 as ExternalLink, a7 as MapPin, U as Users, _ as ChevronLeft, g as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_chunks/_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@tanstack/pacer.mjs";
import "../_chunks/_libs/@tanstack/devtools-event-client.mjs";
import "../_chunks/_libs/@tanstack/store.mjs";
import "../_chunks/_libs/@tanstack/query-core.mjs";
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
const eventsQueryOptions = (params) => queryOptions({
  queryKey: ["events", params],
  queryFn: () => getEvents({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      search: params.search || ""
    }
  })
});
const eventStatsQueryOptions = () => queryOptions({
  queryKey: ["event-stats"],
  queryFn: () => getEventStats()
});
function EventsEmptyState({
  hasFilters,
  onClearFilters
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-7 w-7 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: hasFilters ? "No matching events" : "No events yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-5", children: hasFilters ? "Try adjusting your search or filter criteria." : "Events created by churches will appear here." }),
    hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClearFilters, children: "Clear Filters" })
  ] });
}
function EventsPage() {
  const searchParams = Route$e.useSearch();
  const navigate = useNavigate({
    from: Route$e.fullPath
  });
  const {
    locale
  } = useLocaleStore();
  const [searchInput, setSearchInput] = reactExports.useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = reactExports.useState(false);
  const eventsQuery = useSuspenseQuery(eventsQueryOptions({
    page: searchParams.page,
    status: searchParams.status,
    search: searchParams.search
  }));
  const statsQuery = useSuspenseQuery(eventStatsQueryOptions());
  const {
    events,
    total,
    page,
    totalPages
  } = eventsQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && eventsQuery.isRefetching;
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
        status: !value || value === "all" ? void 0 : value,
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
        search: void 0
      }
    });
  };
  const hasFilters = !!(searchParams.search || searchParams.status);
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const formatTime = (date) => new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Events" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage church events and gatherings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400", children: [
          stats.upcoming,
          " Upcoming"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400", children: [
          stats.totalRsvps,
          " RSVPs"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-slate-100 dark:bg-slate-900/30 rounded-full text-sm font-medium text-slate-700 dark:text-slate-400", children: [
          stats.total,
          " Total"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search events by title...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.status || "all", onValueChange: handleStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[180px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "published", children: "Published" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
        ] })
      ] })
    ] }) }),
    isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
      ] })
    ] }, i)) }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EventsEmptyState, { hasFilters, onClearFilters: handleClearFilters }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: events.map((event) => {
        const title = getLocalizedText(event.title, locale);
        const churchName = event.churches ? getLocalizedText(event.churches.name, locale) : "";
        const rsvpCount = event.event_rsvps?.filter((r) => r.status === "going").length || 0;
        const locationText = getLocalizedText(event.location, locale);
        const addressText = getLocalizedText(event.address, locale);
        const displayLocation = locationText || addressText;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden group hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-muted relative", children: [
            event.cover_image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: event.cover_image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-8 h-8 text-muted-foreground/40" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 flex gap-1.5", children: Boolean(event.is_online) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-3 h-3" }),
              "Online"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventStatusBadge, { status: event.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", className: "h-8", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/events/$eventId", params: {
              eventId: event.id
            } }), nativeButton: false, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 mr-1" }),
              "View"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-sm line-clamp-1", children: title || "Untitled Event" }),
              churchName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: churchName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 shrink-0" }),
                formatDate(event.start_time)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 shrink-0" }),
                formatTime(event.start_time),
                " -",
                " ",
                formatTime(event.end_time)
              ] }),
              event.is_online && event.meeting_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: event.meeting_url, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 text-xs text-primary hover:underline", onClick: (e) => e.stopPropagation(), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Join Meeting" })
              ] }) : displayLocation ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: displayLocation })
              ] }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                rsvpCount,
                " attending",
                event.max_attendees ? ` / ${String(event.max_attendees)} max` : null
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/events/$eventId", params: {
                eventId: event.id
              } }), nativeButton: false, children: "View" })
            ] })
          ] })
        ] }, event.id);
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
          " events"
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
  ] }) }) });
}
export {
  EventsPage as component
};
