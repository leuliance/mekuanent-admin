import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import "../_chunks/_libs/@supabase/ssr.mjs";
import "../_chunks/_libs/@supabase/supabase-js.mjs";
import "../_chunks/_libs/@supabase/postgrest-js.mjs";
import "../_chunks/_libs/@supabase/realtime-js.mjs";
import "../_chunks/_libs/@supabase/storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_chunks/_libs/@supabase/auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_chunks/_libs/@supabase/functions-js.mjs";
import "../_libs/cookie.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_chunks/_libs/react.mjs";
import "../_chunks/_libs/@tanstack/react-router.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const serialize = (data) => JSON.parse(JSON.stringify(data));
const getDashboardStats_createServerFn_handler = createServerRpc({
  id: "007a21bb7589e150891997b50aac3dd707bc489310036957f976351564b60607",
  name: "getDashboardStats",
  filename: "src/api/dashboard.ts"
}, (opts, signal) => getDashboardStats.__executeServer(opts, signal));
const getDashboardStats = createServerFn({
  method: "GET"
}).handler(getDashboardStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const now = /* @__PURE__ */ new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const [totalChurches, pendingChurches, approvedChurches, totalUsers, newUsersThisMonth, totalContent, pendingContent, completedDonations, activeCampaigns, totalEvents, upcomingEvents] = await Promise.all([
    // Churches
    supabase.from("churches").select("*", {
      count: "exact",
      head: true
    }),
    supabase.from("churches").select("*", {
      count: "exact",
      head: true
    }).eq("status", "pending"),
    supabase.from("churches").select("*", {
      count: "exact",
      head: true
    }).eq("status", "approved"),
    // Users
    supabase.from("profiles").select("*", {
      count: "exact",
      head: true
    }),
    supabase.from("profiles").select("*", {
      count: "exact",
      head: true
    }).gte("created_at", firstDayOfMonth),
    // Content
    supabase.from("content_items").select("*", {
      count: "exact",
      head: true
    }),
    supabase.from("content_items").select("*", {
      count: "exact",
      head: true
    }).eq("status", "pending_approval"),
    // Donations
    supabase.from("donations").select("amount").eq("status", "completed"),
    supabase.from("donation_campaigns").select("*", {
      count: "exact",
      head: true
    }).eq("status", "active"),
    // Events
    supabase.from("events").select("*", {
      count: "exact",
      head: true
    }),
    supabase.from("events").select("*", {
      count: "exact",
      head: true
    }).eq("status", "published").gte("start_time", now.toISOString())
  ]);
  const totalDonationAmount = completedDonations.data?.reduce((sum, d) => sum + d.amount, 0) || 0;
  return {
    churches: {
      total: totalChurches.count || 0,
      pending: pendingChurches.count || 0,
      approved: approvedChurches.count || 0
    },
    users: {
      total: totalUsers.count || 0,
      newThisMonth: newUsersThisMonth.count || 0
    },
    content: {
      total: totalContent.count || 0,
      pending: pendingContent.count || 0
    },
    donations: {
      totalAmount: totalDonationAmount,
      totalCount: completedDonations.data?.length || 0,
      activeCampaigns: activeCampaigns.count || 0
    },
    events: {
      total: totalEvents.count || 0,
      upcoming: upcomingEvents.count || 0
    }
  };
});
const getRecentActivities_createServerFn_handler = createServerRpc({
  id: "504bf72cda5df332f8a2a841b2798be3bc4c47891ababacd361bdf5bfbabb23f",
  name: "getRecentActivities",
  filename: "src/api/dashboard.ts"
}, (opts, signal) => getRecentActivities.__executeServer(opts, signal));
const getRecentActivities = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getRecentActivities_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const limit = data.limit || 10;
  const [recentChurches, recentContent, recentDonations] = await Promise.all([supabase.from("churches").select("id, name, status, created_at").order("created_at", {
    ascending: false
  }).limit(limit), supabase.from("content_items").select("id, title, status, content_type, created_at, churches(name)").order("created_at", {
    ascending: false
  }).limit(limit), supabase.from("donations").select("id, amount, status, created_at, profiles(first_name, last_name), donation_campaigns(title)").eq("status", "completed").order("created_at", {
    ascending: false
  }).limit(limit)]);
  return serialize({
    recentChurches: recentChurches.data || [],
    recentContent: recentContent.data || [],
    recentDonations: recentDonations.data || []
  });
});
export {
  getDashboardStats_createServerFn_handler,
  getRecentActivities_createServerFn_handler
};
