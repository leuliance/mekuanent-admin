import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, s as string, _ as _enum, n as number } from "../_libs/zod.mjs";
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
const getDonationsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["pending", "completed", "failed", "refunded"]).optional(),
  campaign_id: string().optional(),
  search: string().optional()
});
const getCampaignsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["draft", "active", "paused", "completed", "cancelled"]).optional(),
  church_id: string().optional(),
  search: string().optional()
});
const getCampaignSchema = object({
  id: string()
});
const getCampaignGoalChangesSchema = object({
  campaign_id: string()
});
const getCampaignPaymentMethodsSchema = object({
  campaign_id: string()
});
const updateCampaignStatusSchema = object({
  id: string(),
  status: _enum(["draft", "active", "paused", "completed", "cancelled"]),
  rejected_reason: string().optional(),
  verified_by: string().optional()
});
const deleteCampaignSchema = object({
  id: string()
});
const getDonations_createServerFn_handler = createServerRpc({
  id: "2f915e502125867cde0494a0237ad49b5bd6a74d851434cec58f91318c04741e",
  name: "getDonations",
  filename: "src/api/donations.ts"
}, (opts, signal) => getDonations.__executeServer(opts, signal));
const getDonations = createServerFn({
  method: "GET"
}).inputValidator(getDonationsSchema).handler(getDonations_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 10;
  const offset = (page - 1) * limit;
  let query = supabase.from("donations").select(`
          *,
          profiles(first_name, last_name, avatar_url, email, phone_number),
          donation_campaigns(title, churches(name)),
          payments(id, payment_method, payment_gateway, gateway_transaction_id, status, gateway_reference)
        `, {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.status) {
    query = query.eq("status", data.status);
  }
  if (data.campaign_id) {
    query = query.eq("campaign_id", data.campaign_id);
  }
  const {
    data: donations,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return serialize({
    donations: donations || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getCampaigns_createServerFn_handler = createServerRpc({
  id: "2f997a5a50f5eeb22c8aedcebcd6a88c5bcc883cdb1f47159024c6109233dbdb",
  name: "getCampaigns",
  filename: "src/api/donations.ts"
}, (opts, signal) => getCampaigns.__executeServer(opts, signal));
const getCampaigns = createServerFn({
  method: "GET"
}).inputValidator(getCampaignsSchema).handler(getCampaigns_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 10;
  const offset = (page - 1) * limit;
  let query = supabase.from("donation_campaigns").select(`
          *,
          churches(name, logo_url),
          profiles!donation_campaigns_created_by_fkey(first_name, last_name),
          donation_categories(name, icon, color),
          donations(id, amount, status)
        `, {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.status) {
    query = query.eq("status", data.status);
  }
  if (data.church_id) {
    query = query.eq("church_id", data.church_id);
  }
  if (data.search) {
    query = query.or(`title->>en.ilike.%${data.search}%,title->>am.ilike.%${data.search}%`);
  }
  const {
    data: campaigns,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return serialize({
    campaigns: campaigns || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getCampaign_createServerFn_handler = createServerRpc({
  id: "d5c924b58a83f199282592e469566ecbe5552322b98dff1f7cf795a3ee337bff",
  name: "getCampaign",
  filename: "src/api/donations.ts"
}, (opts, signal) => getCampaign.__executeServer(opts, signal));
const getCampaign = createServerFn({
  method: "GET"
}).inputValidator(getCampaignSchema).handler(getCampaign_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: campaign,
    error
  } = await supabase.from("donation_campaigns").select(`
          *,
          churches(name, logo_url),
          profiles!donation_campaigns_created_by_fkey(first_name, last_name, avatar_url),
          donation_categories(name, icon, color),
          donations(*, profiles(first_name, last_name, avatar_url))
        `).eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(campaign);
});
const updateCampaignStatus_createServerFn_handler = createServerRpc({
  id: "51c5f708e402389192fdbe9429196f31868870e2fa780e68c1a90cbbb74f811f",
  name: "updateCampaignStatus",
  filename: "src/api/donations.ts"
}, (opts, signal) => updateCampaignStatus.__executeServer(opts, signal));
const updateCampaignStatus = createServerFn({
  method: "POST"
}).inputValidator(updateCampaignStatusSchema).handler(updateCampaignStatus_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const updateData = {
    status: data.status,
    rejected_reason: data.rejected_reason || null
  };
  if (data.status === "active" && data.verified_by) {
    updateData.verified_at = (/* @__PURE__ */ new Date()).toISOString();
    updateData.verified_by = data.verified_by;
  }
  const {
    error
  } = await supabase.from("donation_campaigns").update(updateData).eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const deleteCampaign_createServerFn_handler = createServerRpc({
  id: "966cea9471ea756acda5c64736fdfef68a151d0e6852ec2bdbb5facecfba9297",
  name: "deleteCampaign",
  filename: "src/api/donations.ts"
}, (opts, signal) => deleteCampaign.__executeServer(opts, signal));
const deleteCampaign = createServerFn({
  method: "POST"
}).inputValidator(deleteCampaignSchema).handler(deleteCampaign_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("donation_campaigns").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const getCampaignGoalChanges_createServerFn_handler = createServerRpc({
  id: "22abfeb3a75d1e1803b693950008e6b357db403235545ccc562bd113f67b791c",
  name: "getCampaignGoalChanges",
  filename: "src/api/donations.ts"
}, (opts, signal) => getCampaignGoalChanges.__executeServer(opts, signal));
const getCampaignGoalChanges = createServerFn({
  method: "GET"
}).inputValidator(getCampaignGoalChangesSchema).handler(getCampaignGoalChanges_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: changes,
    error
  } = await supabase.from("campaign_goal_changes").select("*, profiles:changed_by(first_name, last_name)").eq("campaign_id", data.campaign_id).order("changed_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return serialize(changes || []);
});
const getCampaignPaymentMethods_createServerFn_handler = createServerRpc({
  id: "8a16b3a841c85ce3c8d57997a9317c391343367a2ced1546538f5e2466bcbcae",
  name: "getCampaignPaymentMethods",
  filename: "src/api/donations.ts"
}, (opts, signal) => getCampaignPaymentMethods.__executeServer(opts, signal));
const getCampaignPaymentMethods = createServerFn({
  method: "GET"
}).inputValidator(getCampaignPaymentMethodsSchema).handler(getCampaignPaymentMethods_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: methods,
    error
  } = await supabase.from("campaign_payment_methods").select("*, church_payment_methods(*, payment_gateways(name, slug, display_name, icon_url, color))").eq("campaign_id", data.campaign_id);
  if (error) throw new Error(error.message);
  return serialize(methods || []);
});
const getDonationStats_createServerFn_handler = createServerRpc({
  id: "c9d66b61319a199b0e87c9fe133f8d5dfcc08b7ed3d118fc7f66e6d3d7619448",
  name: "getDonationStats",
  filename: "src/api/donations.ts"
}, (opts, signal) => getDonationStats.__executeServer(opts, signal));
const getDonationStats = createServerFn({
  method: "GET"
}).handler(getDonationStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const [totalDonations, completedDonations, activeCampaigns, totalRaised] = await Promise.all([supabase.from("donations").select("*", {
    count: "exact",
    head: true
  }), supabase.from("donations").select("*", {
    count: "exact",
    head: true
  }).eq("status", "completed"), supabase.from("donation_campaigns").select("*", {
    count: "exact",
    head: true
  }).eq("status", "active"), supabase.from("donations").select("amount").eq("status", "completed")]);
  const totalAmount = totalRaised.data?.reduce((sum, d) => sum + d.amount, 0) || 0;
  return {
    totalDonations: totalDonations.count || 0,
    completedDonations: completedDonations.count || 0,
    activeCampaigns: activeCampaigns.count || 0,
    totalRaised: totalAmount
  };
});
export {
  deleteCampaign_createServerFn_handler,
  getCampaignGoalChanges_createServerFn_handler,
  getCampaignPaymentMethods_createServerFn_handler,
  getCampaign_createServerFn_handler,
  getCampaigns_createServerFn_handler,
  getDonationStats_createServerFn_handler,
  getDonations_createServerFn_handler,
  updateCampaignStatus_createServerFn_handler
};
