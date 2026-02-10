import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, s as string, n as number, a as array, r as record, u as unknown, _ as _enum } from "../_libs/zod.mjs";
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
const getNotificationsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  type: string().optional()
});
const getNotifications_createServerFn_handler = createServerRpc({
  id: "b50907fadc152289c50b1e0f194a4b2990ed09d09b402d8a1435cd6f50fe392e",
  name: "getNotifications",
  filename: "src/api/notifications.ts"
}, (opts, signal) => getNotifications.__executeServer(opts, signal));
const getNotifications = createServerFn({
  method: "GET"
}).inputValidator(getNotificationsSchema).handler(getNotifications_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 20;
  const offset = (page - 1) * limit;
  let query = supabase.from("notifications").select("*, profiles(first_name, last_name, avatar_url)", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.type) {
    query = query.eq("type", data.type);
  }
  const {
    data: notifications,
    error,
    count
  } = await query;
  if (error) throw new Error(error.message);
  return serialize({
    notifications: notifications || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const sendNotificationSchema = object({
  title: record(string(), string()),
  body: record(string(), string()),
  type: _enum(["verse_of_day", "new_content", "event_reminder", "event_update", "donation_received", "role_invitation", "content_approved", "content_rejected", "room_started", "donation_campaign_update", "prayer_request", "church_announcement", "system_message", "achievement"]),
  data: record(string(), unknown()).optional().nullable(),
  // If user_ids provided, send to specific users. Otherwise broadcast to all.
  user_ids: array(string()).optional(),
  sent_by: string().optional()
});
const sendNotification_createServerFn_handler = createServerRpc({
  id: "67b57209bafbfb9e7cace316e5dd2691ee5e7d4f86b8a9c112884482022a7c02",
  name: "sendNotification",
  filename: "src/api/notifications.ts"
}, (opts, signal) => sendNotification.__executeServer(opts, signal));
const sendNotification = createServerFn({
  method: "POST"
}).inputValidator(sendNotificationSchema).handler(sendNotification_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const isBroadcast = !data.user_ids || data.user_ids.length === 0;
  if (isBroadcast) {
    const row = {
      user_id: null,
      type: data.type,
      title: data.title,
      body: data.body,
      data: data.data,
      is_read: false,
      is_broadcast: true,
      sent_by: data.sent_by || null
    };
    const {
      error: error2
    } = await supabase.from("notifications").insert(row);
    if (error2) throw new Error(error2.message);
    return {
      success: true,
      sent: 1,
      broadcast: true
    };
  }
  const notifications = (data.user_ids ?? []).map((userId) => ({
    user_id: userId,
    type: data.type,
    title: data.title,
    body: data.body,
    data: data.data,
    is_read: false,
    is_broadcast: false,
    sent_by: data.sent_by || null
  }));
  const {
    error
  } = await supabase.from("notifications").insert(notifications);
  if (error) throw new Error(error.message);
  return {
    success: true,
    sent: notifications.length,
    broadcast: false
  };
});
const searchUsersSchema = object({
  query: string().min(1)
});
const searchUsersForNotification_createServerFn_handler = createServerRpc({
  id: "3da8679799672c76a0eead857d967f8d412f1b0c4b7635bdf9b047ac9de6f60c",
  name: "searchUsersForNotification",
  filename: "src/api/notifications.ts"
}, (opts, signal) => searchUsersForNotification.__executeServer(opts, signal));
const searchUsersForNotification = createServerFn({
  method: "GET"
}).inputValidator(searchUsersSchema).handler(searchUsersForNotification_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: users,
    error
  } = await supabase.from("profiles").select("id, first_name, last_name, email, avatar_url").or(`first_name.ilike.%${data.query}%,last_name.ilike.%${data.query}%,email.ilike.%${data.query}%,phone_number.ilike.%${data.query}%`).limit(10);
  if (error) throw new Error(error.message);
  return serialize(users || []);
});
const deleteNotificationSchema = object({
  id: string()
});
const deleteNotification_createServerFn_handler = createServerRpc({
  id: "a19c724e2042280bfea76308cfd0b69677ec14876cd3fcdd59260f3bc77cff26",
  name: "deleteNotification",
  filename: "src/api/notifications.ts"
}, (opts, signal) => deleteNotification.__executeServer(opts, signal));
const deleteNotification = createServerFn({
  method: "POST"
}).inputValidator(deleteNotificationSchema).handler(deleteNotification_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("notifications").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getNotificationStats_createServerFn_handler = createServerRpc({
  id: "153b734f98cdf66f05757b2393e89cb114a74c06da6c22027bcf4bbbb9b1309a",
  name: "getNotificationStats",
  filename: "src/api/notifications.ts"
}, (opts, signal) => getNotificationStats.__executeServer(opts, signal));
const getNotificationStats = createServerFn({
  method: "GET"
}).handler(getNotificationStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const [total, unread, systemMessages] = await Promise.all([supabase.from("notifications").select("*", {
    count: "exact",
    head: true
  }), supabase.from("notifications").select("*", {
    count: "exact",
    head: true
  }).eq("is_read", false), supabase.from("notifications").select("*", {
    count: "exact",
    head: true
  }).eq("type", "system_message")]);
  return {
    total: total.count || 0,
    unread: unread.count || 0,
    systemMessages: systemMessages.count || 0
  };
});
export {
  deleteNotification_createServerFn_handler,
  getNotificationStats_createServerFn_handler,
  getNotifications_createServerFn_handler,
  searchUsersForNotification_createServerFn_handler,
  sendNotification_createServerFn_handler
};
