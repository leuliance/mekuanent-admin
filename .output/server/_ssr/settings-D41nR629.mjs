import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, _ as _enum, b as boolean, s as string, r as record, u as unknown } from "../_libs/zod.mjs";
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
const getFeatureFlagsSchema = object({
  scope: _enum(["global", "church"]).optional()
});
const updateFeatureFlagSchema = object({
  id: string(),
  is_enabled: boolean()
});
const createFeatureFlagSchema = object({
  key: string().min(1),
  name: record(string(), string()),
  description: record(string(), string()).optional(),
  is_enabled: boolean(),
  scope: _enum(["global", "church"]),
  created_by: string()
});
const deleteFeatureFlagSchema = object({
  id: string()
});
const getFeatureFlags_createServerFn_handler = createServerRpc({
  id: "5cd8ef9e2af59efd9e64c5a5791c9e2115d7036e53e9996a1a86f034523fc64b",
  name: "getFeatureFlags",
  filename: "src/api/settings.ts"
}, (opts, signal) => getFeatureFlags.__executeServer(opts, signal));
const getFeatureFlags = createServerFn({
  method: "GET"
}).inputValidator(getFeatureFlagsSchema).handler(getFeatureFlags_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  let query = supabase.from("feature_flags").select("*").order("created_at", {
    ascending: false
  });
  if (data.scope) {
    query = query.eq("scope", data.scope);
  }
  const {
    data: flags,
    error
  } = await query;
  if (error) throw new Error(error.message);
  return serialize(flags || []);
});
const updateFeatureFlag_createServerFn_handler = createServerRpc({
  id: "aa05a7d234f5890a0b5ec2cc5ddd5fe87c5e362581fa5abc42f146c5d6772ad0",
  name: "updateFeatureFlag",
  filename: "src/api/settings.ts"
}, (opts, signal) => updateFeatureFlag.__executeServer(opts, signal));
const updateFeatureFlag = createServerFn({
  method: "POST"
}).inputValidator(updateFeatureFlagSchema).handler(updateFeatureFlag_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("feature_flags").update({
    is_enabled: data.is_enabled
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const createFeatureFlag_createServerFn_handler = createServerRpc({
  id: "51c9c5ea9f760e728623d5a691f8c485732b334922f83b840cc70435708aefa0",
  name: "createFeatureFlag",
  filename: "src/api/settings.ts"
}, (opts, signal) => createFeatureFlag.__executeServer(opts, signal));
const createFeatureFlag = createServerFn({
  method: "POST"
}).inputValidator(createFeatureFlagSchema).handler(createFeatureFlag_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("feature_flags").insert({
    key: data.key,
    name: data.name,
    description: data.description || null,
    is_enabled: data.is_enabled,
    scope: data.scope,
    created_by: data.created_by
  });
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const deleteFeatureFlag_createServerFn_handler = createServerRpc({
  id: "b534ce809bf5c4b82fa425f81c3fe5f5534926ff0fd2eaa7e77b196273b1de37",
  name: "deleteFeatureFlag",
  filename: "src/api/settings.ts"
}, (opts, signal) => deleteFeatureFlag.__executeServer(opts, signal));
const deleteFeatureFlag = createServerFn({
  method: "POST"
}).inputValidator(deleteFeatureFlagSchema).handler(deleteFeatureFlag_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("feature_flags").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getPaymentGateways_createServerFn_handler = createServerRpc({
  id: "ec939cbd3e160bdf7aec76103177d8737a89799090351166e5aaa2072caf7159",
  name: "getPaymentGateways",
  filename: "src/api/settings.ts"
}, (opts, signal) => getPaymentGateways.__executeServer(opts, signal));
const getPaymentGateways = createServerFn({
  method: "GET"
}).handler(getPaymentGateways_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: gateways,
    error
  } = await supabase.from("payment_gateways").select("*").order("name", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return serialize(gateways || []);
});
const updatePaymentGatewaySchema = object({
  id: string(),
  display_name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  is_active: boolean().optional(),
  test_mode: boolean().optional(),
  api_key: string().optional().nullable(),
  webhook_secret: string().optional().nullable(),
  config: record(string(), unknown()).optional().nullable()
});
const updatePaymentGateway_createServerFn_handler = createServerRpc({
  id: "fa3fb6a3349c85c4cacc5dbeb4d6d1bbb83f217b7d9f7e62cd3f942aae3f4384",
  name: "updatePaymentGateway",
  filename: "src/api/settings.ts"
}, (opts, signal) => updatePaymentGateway.__executeServer(opts, signal));
const updatePaymentGateway = createServerFn({
  method: "POST"
}).inputValidator(updatePaymentGatewaySchema).handler(updatePaymentGateway_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    id,
    ...updateData
  } = data;
  const cleanData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== void 0));
  const {
    error
  } = await supabase.from("payment_gateways").update(cleanData).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const createPaymentGatewaySchema = object({
  name: string().min(1),
  slug: string().min(1),
  display_name: record(string(), string()),
  description: record(string(), string()).optional(),
  icon_url: string().optional().nullable(),
  color: string().optional().nullable(),
  is_active: boolean(),
  test_mode: boolean()
});
const createPaymentGateway_createServerFn_handler = createServerRpc({
  id: "8356125b7a64d1a2d7f23de7aac4fd57785ffb2de4b02d4489c1120a34e468c4",
  name: "createPaymentGateway",
  filename: "src/api/settings.ts"
}, (opts, signal) => createPaymentGateway.__executeServer(opts, signal));
const createPaymentGateway = createServerFn({
  method: "POST"
}).inputValidator(createPaymentGatewaySchema).handler(createPaymentGateway_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("payment_gateways").insert({
    name: data.name,
    slug: data.slug,
    display_name: data.display_name,
    description: data.description || null,
    icon_url: data.icon_url || null,
    color: data.color || null,
    is_active: data.is_active,
    test_mode: data.test_mode
  });
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const deletePaymentGatewaySchema = object({
  id: string()
});
const deletePaymentGateway_createServerFn_handler = createServerRpc({
  id: "b8ce51d5ed4746ab6a759ad845c4300ce9c2b9418989b238a5915354ea5a7f88",
  name: "deletePaymentGateway",
  filename: "src/api/settings.ts"
}, (opts, signal) => deletePaymentGateway.__executeServer(opts, signal));
const deletePaymentGateway = createServerFn({
  method: "POST"
}).inputValidator(deletePaymentGatewaySchema).handler(deletePaymentGateway_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("payment_gateways").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getAppOverviewStats_createServerFn_handler = createServerRpc({
  id: "7a89bab8f14fb6d097ad0cc189d5873f872e2494cf0845e4361c2c9c3cb5d18a",
  name: "getAppOverviewStats",
  filename: "src/api/settings.ts"
}, (opts, signal) => getAppOverviewStats.__executeServer(opts, signal));
const getAppOverviewStats = createServerFn({
  method: "GET"
}).handler(getAppOverviewStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const [users, churches, events, donations, content] = await Promise.all([supabase.from("profiles").select("*", {
    count: "exact",
    head: true
  }), supabase.from("churches").select("*", {
    count: "exact",
    head: true
  }), supabase.from("events").select("*", {
    count: "exact",
    head: true
  }), supabase.from("donations").select("amount").eq("status", "completed"), supabase.from("content_items").select("*", {
    count: "exact",
    head: true
  })]);
  const totalDonations = donations.data?.reduce((s, d) => s + d.amount, 0) || 0;
  return {
    users: users.count || 0,
    churches: churches.count || 0,
    events: events.count || 0,
    totalDonations,
    content: content.count || 0
  };
});
export {
  createFeatureFlag_createServerFn_handler,
  createPaymentGateway_createServerFn_handler,
  deleteFeatureFlag_createServerFn_handler,
  deletePaymentGateway_createServerFn_handler,
  getAppOverviewStats_createServerFn_handler,
  getFeatureFlags_createServerFn_handler,
  getPaymentGateways_createServerFn_handler,
  updateFeatureFlag_createServerFn_handler,
  updatePaymentGateway_createServerFn_handler
};
