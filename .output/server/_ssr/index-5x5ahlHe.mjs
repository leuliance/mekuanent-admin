import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useSuspenseQuery, q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { u as useDebouncer } from "../_chunks/_libs/@tanstack/react-pacer.mjs";
import { p as Route$g, q as getPayments, r as getPaymentStats } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-gUnlM3z5.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BpN664B5.mjs";
import { e as CreditCard, Y as CircleCheckBig, Z as CircleX, o as TrendingUp, p as Funnel, E as Eye, _ as ChevronLeft, g as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
import "../_chunks/_libs/@radix-ui/react-avatar.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-use-is-hydrated.mjs";
const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
};
const paymentsQueryOptions = (params) => queryOptions({
  queryKey: ["payments", params],
  queryFn: () => getPayments({
    data: {
      page: params.page,
      limit: 20,
      status: params.status,
      search: params.search
    }
  })
});
const paymentStatsQueryOptions = () => queryOptions({
  queryKey: ["payment-stats"],
  queryFn: () => getPaymentStats()
});
function PaymentsPage() {
  const searchParams = Route$g.useSearch();
  const navigate = useNavigate({
    from: Route$g.fullPath
  });
  const [searchInput, setSearchInput] = reactExports.useState(searchParams.search || "");
  const [detailPayment, setDetailPayment] = reactExports.useState(null);
  const paymentsQuery = useSuspenseQuery(paymentsQueryOptions({
    page: searchParams.page,
    status: searchParams.status,
    search: searchParams.search
  }));
  const statsQuery = useSuspenseQuery(paymentStatsQueryOptions());
  const stats = statsQuery.data;
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
    debouncedSearch.maybeExecute(searchInput);
  }, [searchInput]);
  const formatCurrency = (amount, currency = "ETB") => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0
  }).format(amount);
  const getInitials = (fn, ln) => ((fn?.[0] || "") + (ln?.[0] || "")).toUpperCase() || "U";
  const handleStatusFilter = (value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: !value || value === "all" ? void 0 : value,
        page: 1
      })
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Payments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "All payment transactions made by users" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }), iconBg: "bg-blue-100 dark:bg-blue-900/30", label: "Total Payments", value: String(stats.total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-600 dark:text-green-400" }), iconBg: "bg-green-100 dark:bg-green-900/30", label: "Completed", value: String(stats.completed) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-red-600 dark:text-red-400" }), iconBg: "bg-red-100 dark:bg-red-900/30", label: "Failed", value: String(stats.failed) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }), iconBg: "bg-emerald-100 dark:bg-emerald-900/30", label: "Total Volume", value: formatCurrency(stats.totalAmount) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by reference or transaction ID...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.status || "all", onValueChange: handleStatusFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[180px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "failed", children: "Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "refunded", children: "Refunded" })
          ] })
        ] })
      ] }) }),
      paymentsQuery.data.payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-8 w-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No payments found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Payments will appear here once users make transactions." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Gateway" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: paymentsQuery.data.payments.map((payment) => {
            const profile = payment.profiles;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile?.avatar_url || "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs bg-primary/10 text-primary", children: getInitials(profile?.first_name, profile?.last_name) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Unknown" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: profile?.email || profile?.phone_number || "" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-green-600 dark:text-green-400", children: formatCurrency(payment.amount, payment.currency || "ETB") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground capitalize", children: payment.payment_method || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground capitalize", children: payment.payment_gateway || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${paymentStatusColors[payment.status] || ""}`, children: payment.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: new Date(payment.created_at).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => setDetailPayment(payment), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) }) })
            ] }, payment.id);
          }) })
        ] }) }),
        paymentsQuery.data.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            (paymentsQuery.data.page - 1) * 20 + 1,
            " to ",
            Math.min(paymentsQuery.data.page * 20, paymentsQuery.data.total),
            " of ",
            paymentsQuery.data.total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: paymentsQuery.data.page <= 1, onClick: () => navigate({
              search: (prev) => ({
                ...prev,
                page: paymentsQuery.data.page - 1
              })
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Previous"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: paymentsQuery.data.page >= paymentsQuery.data.totalPages, onClick: () => navigate({
              search: (prev) => ({
                ...prev,
                page: paymentsQuery.data.page + 1
              })
            }), children: [
              "Next ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!detailPayment, onOpenChange: (open) => !open && setDetailPayment(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Payment Details" }) }),
      detailPayment && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Amount", value: formatCurrency(detailPayment.amount, detailPayment.currency || "ETB") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Currency", value: detailPayment.currency || "ETB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Status", value: detailPayment.status || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Method", value: detailPayment.payment_method || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Gateway", value: detailPayment.payment_gateway || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Gateway Ref", value: detailPayment.gateway_reference || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Transaction ID", value: detailPayment.gateway_transaction_id || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Created", value: new Date(detailPayment.created_at).toLocaleString() }),
          !!detailPayment.completed_at && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Completed", value: new Date(String(detailPayment.completed_at)).toLocaleString() }),
          !!detailPayment.failed_at && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Failed At", value: new Date(String(detailPayment.failed_at)).toLocaleString() })
        ] }),
        !!detailPayment.error_message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-destructive/10 text-destructive text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
          " ",
          String(detailPayment.error_message)
        ] }),
        !!detailPayment.payment_details && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Payment Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-3 rounded-lg bg-muted text-xs font-mono overflow-auto max-h-40", children: JSON.stringify(detailPayment.payment_details, null, 2) })
        ] }),
        !!detailPayment.gateway_response && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Gateway Response" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-3 rounded-lg bg-muted text-xs font-mono overflow-auto max-h-40", children: JSON.stringify(detailPayment.gateway_response, null, 2) })
        ] })
      ] })
    ] }) })
  ] });
}
function InfoRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: value })
  ] });
}
function StatCard({
  icon,
  iconBg,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl p-4 border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${iconBg}`, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: value })
    ] })
  ] }) });
}
export {
  PaymentsPage as component
};
