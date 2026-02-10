import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useDebouncer } from "../_chunks/_libs/@tanstack/react-pacer.mjs";
import { u as useSuspenseQuery, q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { C as Route$d, D as getDonations, E as getCampaigns, G as updateCampaignStatus, H as deleteCampaign, F as getDonationStats } from "./router-deJypcsT.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { c as canDelete } from "./roles-B1zM8dwz.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-gUnlM3z5.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D6RZxBhq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as DollarSign, o as TrendingUp, Y as CircleCheckBig, a8 as Target, p as Funnel, _ as ChevronLeft, g as ChevronRight, c as Calendar, L as LoaderCircle, N as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_chunks/_libs/@radix-ui/react-avatar.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-use-is-hydrated.mjs";
const donationsQueryOptions = (params) => queryOptions({
  queryKey: ["donations", params],
  queryFn: () => getDonations({
    data: {
      page: params.page,
      limit: 10,
      status: params.status
    }
  })
});
const campaignsQueryOptions = (params) => queryOptions({
  queryKey: ["campaigns", params],
  queryFn: () => getCampaigns({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      search: params.search || ""
    }
  })
});
const donationStatsQueryOptions = () => queryOptions({
  queryKey: ["donation-stats"],
  queryFn: () => getDonationStats()
});
function DonationsPage() {
  const searchParams = Route$d.useSearch();
  const navigate = useNavigate({
    from: Route$d.fullPath
  });
  const {
    locale
  } = useLocaleStore();
  const {
    user
  } = Route$d.useRouteContext();
  const showDelete = !!user && canDelete(user.role);
  const [campaignSearchInput, setCampaignSearchInput] = reactExports.useState(searchParams.search || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [deletingCampaignId, setDeletingCampaignId] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [statusChanging, setStatusChanging] = reactExports.useState(null);
  const donationsQuery = useSuspenseQuery(donationsQueryOptions({
    page: searchParams.page,
    status: searchParams.status
  }));
  const campaignsQuery = useSuspenseQuery(campaignsQueryOptions({
    page: searchParams.campaignPage || 1,
    status: searchParams.campaignStatus,
    search: searchParams.search
  }));
  const statsQuery = useSuspenseQuery(donationStatsQueryOptions());
  const stats = statsQuery.data;
  const debouncedSearch = useDebouncer((value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: value.trim() || void 0,
        campaignPage: 1
      })
    });
  }, {
    wait: 500
  });
  reactExports.useEffect(() => {
    debouncedSearch.maybeExecute(campaignSearchInput);
  }, [campaignSearchInput]);
  const formatCurrency = (amount, currency = "ETB") => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0
  }).format(amount);
  const getInitials = (firstName, lastName) => ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "A";
  const donationStatusColors = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
  };
  const campaignStatusColors = {
    draft: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  };
  const handleDonationStatusFilter = (value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: !value || value === "all" ? void 0 : value,
        page: 1
      })
    });
  };
  const handleCampaignStatusFilter = (value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        campaignStatus: !value || value === "all" ? void 0 : value,
        campaignPage: 1
      })
    });
  };
  const handleCampaignStatusChange = async (campaignId, newStatus) => {
    setStatusChanging(campaignId);
    try {
      await updateCampaignStatus({
        data: {
          id: campaignId,
          status: newStatus,
          verified_by: newStatus === "active" ? user?.id : void 0
        }
      });
      toast.success(`Campaign ${newStatus}`);
      campaignsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setStatusChanging(null);
    }
  };
  const handleDeleteCampaign = async () => {
    if (!deletingCampaignId) return;
    setIsDeleting(true);
    try {
      await deleteCampaign({
        data: {
          id: deletingCampaignId
        }
      });
      setDeleteDialogOpen(false);
      setDeletingCampaignId(null);
      toast.success("Campaign deleted successfully");
      campaignsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(`Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleTabChange = (tab) => {
    navigate({
      search: (prev) => ({
        ...prev,
        tab
      })
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Donations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "View and manage all platform donations and campaigns" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-5 h-5 text-green-600 dark:text-green-400" }), iconBg: "bg-green-100 dark:bg-green-900/30", label: "Total Raised", value: formatCurrency(stats.totalRaised) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }), iconBg: "bg-blue-100 dark:bg-blue-900/30", label: "Total Donations", value: String(stats.totalDonations) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-cyan-600 dark:text-cyan-400" }), iconBg: "bg-cyan-100 dark:bg-cyan-900/30", label: "Completed", value: String(stats.completedDonations) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-5 h-5 text-purple-600 dark:text-purple-400" }), iconBg: "bg-purple-100 dark:bg-purple-900/30", label: "Active Campaigns", value: String(stats.activeCampaigns) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: searchParams.tab || "donations", onValueChange: handleTabChange, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "donations", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 mr-1.5" }),
            "Donations"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "campaigns", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 mr-1.5" }),
            "Campaigns"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "donations", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.status || "all", onValueChange: handleDonationStatusFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-[180px]", children: [
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
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Donor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Campaign" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Payment" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Date" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: donationsQuery.data.donations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-6 w-6 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No donations found" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Donations will appear here once people contribute." })
              ] }) }) }) : donationsQuery.data.donations.map((donation) => {
                const d = donation;
                const isAnon = Boolean(d.is_anonymous);
                const fromWallet = Boolean(d.from_wallet);
                const paymentInfo = d.payments;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: d.profiles?.avatar_url || "" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs bg-primary/10 text-primary", children: isAnon ? "A" : getInitials(d.profiles?.first_name, d.profiles?.last_name) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: isAnon ? "Anonymous" : `${d.profiles?.first_name || ""} ${d.profiles?.last_name || ""}`.trim() || "Unknown" }),
                        isAnon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", children: "Anon" }),
                        fromWallet && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400", children: "Wallet" })
                      ] }),
                      !isAnon && d.profiles?.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: d.profiles.email })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-1", children: getLocalizedText(d.donation_campaigns?.title, locale) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: getLocalizedText(d.donation_campaigns?.churches?.name, locale) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-green-600 dark:text-green-400", children: formatCurrency(donation.amount, donation.currency || "ETB") }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: paymentInfo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium capitalize", children: paymentInfo.payment_gateway || paymentInfo.payment_method || "-" }),
                    paymentInfo.gateway_transaction_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-mono", children: [
                      String(paymentInfo.gateway_transaction_id).slice(0, 12),
                      "..."
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "-" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${donationStatusColors[donation.status] || ""}`, children: donation.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: new Date(donation.created_at).toLocaleDateString() })
                ] }, donation.id);
              }) })
            ] }) }),
            donationsQuery.data.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Showing ",
                (donationsQuery.data.page - 1) * 10 + 1,
                " to",
                " ",
                Math.min(donationsQuery.data.page * 10, donationsQuery.data.total),
                " ",
                "of ",
                donationsQuery.data.total
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: donationsQuery.data.page <= 1, onClick: () => navigate({
                  search: (prev) => ({
                    ...prev,
                    page: donationsQuery.data.page - 1
                  })
                }), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                  "Previous"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: donationsQuery.data.page >= donationsQuery.data.totalPages, onClick: () => navigate({
                  search: (prev) => ({
                    ...prev,
                    page: donationsQuery.data.page + 1
                  })
                }), children: [
                  "Next",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "campaigns", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search campaigns...", value: campaignSearchInput, onChange: (e) => setCampaignSearchInput(e.target.value), className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.campaignStatus || "all", onValueChange: handleCampaignStatusFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[180px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "paused", children: "Paused" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
              ] })
            ] })
          ] }) }),
          campaignsQuery.data.campaigns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-7 w-7 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No campaigns found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Donation campaigns created by churches will appear here." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: campaignsQuery.data.campaigns.map((campaign) => {
            const campaignTitle = getLocalizedText(campaign.title, locale);
            const churchName = campaign.churches ? getLocalizedText(campaign.churches.name, locale) : "";
            const donations = campaign.donations;
            const donationCount = donations?.length || 0;
            const raisedAmount = donations?.filter((d) => d.status === "completed").reduce((s, d) => s + d.amount, 0) || 0;
            const goalAmount = campaign.goal_amount || 0;
            const progress = goalAmount ? Math.min(100, Math.round(raisedAmount / goalAmount * 100)) : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden group hover:shadow-md transition-shadow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-2/1 bg-muted relative", children: [
                campaign.cover_image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: campaign.cover_image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-8 h-8 text-muted-foreground/40" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${campaignStatusColors[campaign.status] || ""}`, children: campaign.status }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-sm line-clamp-1", children: campaignTitle || "Untitled Campaign" }),
                  churchName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: churchName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-green-600 dark:text-green-400", children: formatCurrency(raisedAmount, campaign.currency || "ETB") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: goalAmount ? `${progress}% of ${formatCurrency(goalAmount, campaign.currency || "ETB")}` : `${donationCount} donations` })
                  ] }),
                  goalAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-green-500 transition-all", style: {
                    width: `${progress}%`
                  } }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                  new Date(campaign.start_date).toLocaleDateString(),
                  " ",
                  campaign.end_date ? `- ${new Date(campaign.end_date).toLocaleDateString()}` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: campaign.status, onValueChange: (v) => handleCampaignStatusChange(campaign.id, v), disabled: statusChanging === campaign.id, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-7 w-[110px] text-xs", children: statusChanging === campaign.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "paused", children: "Paused" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
                    ] })
                  ] }),
                  showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-destructive hover:text-destructive", onClick: () => {
                    setDeletingCampaignId(campaign.id);
                    setDeleteDialogOpen(true);
                  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
                ] })
              ] })
            ] }, campaign.id);
          }) }),
          campaignsQuery.data.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Showing",
              " ",
              (campaignsQuery.data.page - 1) * 10 + 1,
              " to",
              " ",
              Math.min(campaignsQuery.data.page * 10, campaignsQuery.data.total),
              " ",
              "of ",
              campaignsQuery.data.total
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: campaignsQuery.data.page <= 1, onClick: () => navigate({
                search: (prev) => ({
                  ...prev,
                  campaignPage: campaignsQuery.data.page - 1
                })
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                "Previous"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: campaignsQuery.data.page >= campaignsQuery.data.totalPages, onClick: () => navigate({
                search: (prev) => ({
                  ...prev,
                  campaignPage: campaignsQuery.data.page + 1
                })
              }), children: [
                "Next",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Campaign" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Are you sure you want to delete this campaign? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteDialogOpen(false), disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDeleteCampaign, disabled: isDeleting, children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) })
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
  DonationsPage as component
};
