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
const getPaymentsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["pending", "completed", "failed", "refunded"]).optional(),
  search: string().optional()
});
const getPayments_createServerFn_handler = createServerRpc({
  id: "9f0fa00ed9c962a8a7689ffd8089f801453e3343dd40bdb8cb06d5aa4151cf43",
  name: "getPayments",
  filename: "src/api/payments.ts"
}, (opts, signal) => getPayments.__executeServer(opts, signal));
const getPayments = createServerFn({
  method: "GET"
}).inputValidator(getPaymentsSchema).handler(getPayments_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 20;
  const offset = (page - 1) * limit;
  let query = supabase.from("payments").select(`
        *,
        profiles!payments_user_id_fkey(first_name, last_name, avatar_url, email, phone_number)
      `, {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.status) {
    query = query.eq("status", data.status);
  }
  if (data.search) {
    query = query.or(`gateway_reference.ilike.%${data.search}%,gateway_transaction_id.ilike.%${data.search}%`);
  }
  const {
    data: payments,
    error,
    count
  } = await query;
  if (error) throw new Error(error.message);
  return serialize({
    payments: payments || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getPaymentStats_createServerFn_handler = createServerRpc({
  id: "05fdee696d535b20c2aac7cbf621ef7f3481efecd91a09553f3924c8de0523a0",
  name: "getPaymentStats",
  filename: "src/api/payments.ts"
}, (opts, signal) => getPaymentStats.__executeServer(opts, signal));
const getPaymentStats = createServerFn({
  method: "GET"
}).handler(getPaymentStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const [total, completed, failed, totalAmount] = await Promise.all([supabase.from("payments").select("*", {
    count: "exact",
    head: true
  }), supabase.from("payments").select("*", {
    count: "exact",
    head: true
  }).eq("status", "completed"), supabase.from("payments").select("*", {
    count: "exact",
    head: true
  }).eq("status", "failed"), supabase.from("payments").select("amount").eq("status", "completed")]);
  const sum = totalAmount.data?.reduce((s, p) => s + p.amount, 0) || 0;
  return {
    total: total.count || 0,
    completed: completed.count || 0,
    failed: failed.count || 0,
    totalAmount: sum
  };
});
export {
  getPaymentStats_createServerFn_handler,
  getPayments_createServerFn_handler
};
