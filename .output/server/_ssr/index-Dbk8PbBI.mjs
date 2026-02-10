import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { b as Route$j } from "./router-deJypcsT.mjs";
import { a as Church, U as Users, F as FileText, D as DollarSign, c as Calendar, A as ArrowRight, n as Clock, o as TrendingUp } from "../_libs/lucide-react.mjs";
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
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-500 dark:text-slate-400", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-slate-900 dark:text-white mt-2", children: value }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: subtitle }),
      trend && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-green-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-green-500 font-medium", children: trend })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-xl ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 text-white" }) })
  ] }) });
}
function DashboardPage() {
  const {
    stats,
    activities
  } = Route$j.useLoaderData();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0
    }).format(amount);
  };
  const getLocalizedName = (name) => {
    if (typeof name === "object" && name !== null) {
      const nameObj = name;
      return nameObj.en || nameObj.am || "Unknown";
    }
    return String(name || "Unknown");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Dashboard Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-slate-400 mt-1", children: "Welcome back! Here's what's happening with your platform." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Churches", value: stats.churches.total, subtitle: `${stats.churches.pending} pending approval`, icon: Church, color: "bg-gradient-to-br from-cyan-500 to-blue-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Users", value: stats.users.total, subtitle: `${stats.users.newThisMonth} new this month`, icon: Users, color: "bg-gradient-to-br from-purple-500 to-pink-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Content Items", value: stats.content.total, subtitle: `${stats.content.pending} pending review`, icon: FileText, color: "bg-gradient-to-br from-orange-500 to-red-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Donations", value: formatCurrency(stats.donations.totalAmount), subtitle: `${stats.donations.activeCampaigns} active campaigns`, icon: DollarSign, color: "bg-gradient-to-br from-green-500 to-emerald-600" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Upcoming Events", value: stats.events.upcoming, subtitle: `${stats.events.total} total events`, icon: Calendar, color: "bg-gradient-to-br from-indigo-500 to-violet-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Approved Churches", value: stats.churches.approved, subtitle: `${(stats.churches.approved / stats.churches.total * 100).toFixed(0)}% approval rate`, icon: Church, color: "bg-gradient-to-br from-teal-500 to-cyan-600" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white", children: "Recent Churches" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/churches", search: {
            status: void 0,
            category: void 0,
            page: 1,
            search: ""
          }, className: "text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1", children: [
            "View all ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-200 dark:divide-slate-700", children: [
          activities.recentChurches.map((church) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: getLocalizedName(church.name) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                new Date(church.created_at).toLocaleDateString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${church.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : church.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`, children: church.status })
          ] }, church.id)),
          activities.recentChurches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-4 text-slate-500 dark:text-slate-400 text-center", children: "No recent churches" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white", children: "Recent Donations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/donations", search: {
            status: void 0,
            page: 1
          }, className: "text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1", children: [
            "View all ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-200 dark:divide-slate-700", children: [
          activities.recentDonations.map((donation) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-slate-900 dark:text-white", children: [
                donation.profiles?.first_name,
                " ",
                donation.profiles?.last_name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: getLocalizedName(donation.donation_campaigns?.title) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-green-600 dark:text-green-400", children: formatCurrency(donation.amount) })
          ] }, donation.id)),
          activities.recentDonations.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-4 text-slate-500 dark:text-slate-400 text-center", children: "No recent donations" })
        ] })
      ] })
    ] })
  ] }) }) });
}
export {
  DashboardPage as component
};
