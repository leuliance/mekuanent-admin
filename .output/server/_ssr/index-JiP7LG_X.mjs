import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { a0 as Route$9, G as updateCampaignStatus } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { p as Funnel, a8 as Target, K as Building, E as Eye, l as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/sonner.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
function CampaignsPage() {
  const {
    campaigns,
    total,
    page,
    totalPages
  } = Route$9.useLoaderData();
  const {
    status
  } = Route$9.useSearch();
  const navigate = useNavigate({
    from: Route$9.fullPath
  });
  const getLocalizedName = (name) => {
    if (typeof name === "object" && name !== null) {
      const nameObj = name;
      return nameObj.en || nameObj.am || "Unknown";
    }
    return String(name || "Unknown");
  };
  const handleStatusFilter = (newStatus) => {
    navigate({
      search: {
        status: newStatus === "all" ? void 0 : newStatus,
        page: 1
      }
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
  const handleStatusUpdate = async (campaignId, newStatus) => {
    try {
      await updateCampaignStatus({
        data: {
          id: campaignId,
          status: newStatus
        }
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update campaign status:", error);
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0
    }).format(amount);
  };
  const statusColors = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  };
  const calculateProgress = (current, goal) => {
    return Math.min(current / goal * 100, 100);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Donation Campaigns" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-slate-400 mt-1", children: "Manage and review donation campaigns" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: status || "all", onValueChange: (value) => handleStatusFilter(value || ""), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "paused", children: "Paused" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: campaigns.map((campaign) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-slate-100 dark:bg-slate-700 relative", children: [
        campaign.cover_image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: campaign.cover_image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-8 h-8 text-slate-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[campaign.status]}`, children: campaign.status }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-slate-900 dark:text-white line-clamp-1", children: getLocalizedName(campaign.title) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "w-3 h-3" }),
          getLocalizedName(campaign.churches?.name)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-slate-400", children: "Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-900 dark:text-white", children: [
              calculateProgress(campaign.current_amount, campaign.goal_amount).toFixed(0),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-linear-to-r from-cyan-500 to-blue-600 rounded-full", style: {
            width: `${calculateProgress(campaign.current_amount, campaign.goal_amount)}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-slate-400", children: formatCurrency(campaign.current_amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-slate-400", children: formatCurrency(campaign.goal_amount) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 dark:text-slate-400 mt-3", children: [
          new Date(campaign.start_date).toLocaleDateString(),
          " -",
          " ",
          campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : "Ongoing"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/dashboard/campaigns/${campaign.id}`, className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4 mr-1" }),
            "View"
          ] }) }),
          campaign.status === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "text-green-600 hover:text-green-700", onClick: () => handleStatusUpdate(campaign.id, "active"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) }),
          campaign.status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "text-yellow-600 hover:text-yellow-700", onClick: () => handleStatusUpdate(campaign.id, "paused"), children: "Pause" })
        ] })
      ] })
    ] }, campaign.id)) }),
    campaigns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-slate-400", children: "No campaigns found" }) }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: [
        "Showing ",
        (page - 1) * 10 + 1,
        " to ",
        Math.min(page * 10, total),
        " of",
        " ",
        total,
        " campaigns"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === 1, onClick: () => handlePageChange(page - 1), children: "Previous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === totalPages, onClick: () => handlePageChange(page + 1), children: "Next" })
      ] })
    ] })
  ] }) }) });
}
export {
  CampaignsPage as component
};
