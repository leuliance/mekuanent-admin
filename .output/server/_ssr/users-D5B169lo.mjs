import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, _ as _enum, s as string, n as number } from "../_libs/zod.mjs";
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
const getUsersSchema = object({
  page: number().optional(),
  limit: number().optional(),
  search: string().optional(),
  role: _enum(["super_admin", "admin", "church_admin", "content_admin", "content_creator", "user"]).optional()
});
const getUserSchema = object({
  id: string()
});
const assignUserRoleSchema = object({
  user_id: string(),
  role: _enum(["super_admin", "admin", "church_admin", "content_admin", "content_creator", "user"]),
  church_id: string().optional(),
  assigned_by: string()
});
const removeUserRoleSchema = object({
  role_id: string()
});
const getUsers_createServerFn_handler = createServerRpc({
  id: "3a1692bea565954feff4245e4fbb84a80a972be31b2b0a2bc6be860e6db5aa00",
  name: "getUsers",
  filename: "src/api/users.ts"
}, (opts, signal) => getUsers.__executeServer(opts, signal));
const getUsers = createServerFn({
  method: "GET"
}).inputValidator(getUsersSchema).handler(getUsers_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 10;
  const offset = (page - 1) * limit;
  let query = supabase.from("profiles").select(`
          *,
          user_roles!user_roles_user_id_fkey(role, church_id, churches(name))
        `, {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.search) {
    query = query.or(`first_name.ilike.%${data.search}%,last_name.ilike.%${data.search}%,email.ilike.%${data.search}%,phone_number.ilike.%${data.search}%`);
  }
  const {
    data: users,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  let filteredUsers = users || [];
  if (data.role) {
    filteredUsers = filteredUsers.filter((user) => user.user_roles?.some((r) => r.role === data.role));
  }
  return serialize({
    users: filteredUsers,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getUser_createServerFn_handler = createServerRpc({
  id: "0ad622c84a88f4110451a2b7dfc786d1dbc78244d8854a27d923e800f4440579",
  name: "getUser",
  filename: "src/api/users.ts"
}, (opts, signal) => getUser.__executeServer(opts, signal));
const getUser = createServerFn({
  method: "GET"
}).inputValidator(getUserSchema).handler(getUser_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: user,
    error
  } = await supabase.from("profiles").select(`
          *,
          user_roles!user_roles_user_id_fkey(*, churches(name, logo_url)),
          user_follows(church_id, churches(name, logo_url)),
          donations(id, amount, status, created_at),
          event_rsvps(id, event_id, status)
        `).eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(user);
});
const assignUserRole_createServerFn_handler = createServerRpc({
  id: "cdccb35a387e2259c74eeb509397a96ca1d0ded037d5c2571889cfe74fd31439",
  name: "assignUserRole",
  filename: "src/api/users.ts"
}, (opts, signal) => assignUserRole.__executeServer(opts, signal));
const assignUserRole = createServerFn({
  method: "POST"
}).inputValidator(assignUserRoleSchema).handler(assignUserRole_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: role,
    error
  } = await supabase.from("user_roles").insert({
    user_id: data.user_id,
    role: data.role,
    church_id: data.church_id || null,
    assigned_by: data.assigned_by
  }).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(role);
});
const removeUserRole_createServerFn_handler = createServerRpc({
  id: "b01dd809b803a14f4618f0ec43822986aca0825acdfe46f68a1511817907d0a4",
  name: "removeUserRole",
  filename: "src/api/users.ts"
}, (opts, signal) => removeUserRole.__executeServer(opts, signal));
const removeUserRole = createServerFn({
  method: "POST"
}).inputValidator(removeUserRoleSchema).handler(removeUserRole_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("user_roles").delete().eq("id", data.role_id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const updateUserStatusSchema = object({
  user_id: string(),
  status: _enum(["active", "inactive", "suspended", "banned"]),
  reason: string().optional(),
  changed_by: string()
});
const updateUserStatus_createServerFn_handler = createServerRpc({
  id: "11b7c8172a60af17a88c77f4d7a180ccc723cace74aa30f0cd2bb2406e9fac6d",
  name: "updateUserStatus",
  filename: "src/api/users.ts"
}, (opts, signal) => updateUserStatus.__executeServer(opts, signal));
const updateUserStatus = createServerFn({
  method: "POST"
}).inputValidator(updateUserStatusSchema).handler(updateUserStatus_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: profile
  } = await supabase.from("profiles").select("status").eq("id", data.user_id).single();
  const oldStatus = profile?.status ?? "active";
  const {
    error: updateError
  } = await supabase.from("profiles").update({
    status: data.status
  }).eq("id", data.user_id);
  if (updateError) throw new Error(updateError.message);
  try {
    await supabase.from("user_status_log").insert({
      user_id: data.user_id,
      old_status: oldStatus,
      new_status: data.status,
      reason: data.reason || null,
      changed_by: data.changed_by
    });
  } catch (e) {
    console.error("Failed to log status change:", e);
  }
  return {
    success: true
  };
});
const getUserStats_createServerFn_handler = createServerRpc({
  id: "34bdd4ffa68af3eb1f9633399fd568aa5aa8f0e21e376a1042493aae0170cd4d",
  name: "getUserStats",
  filename: "src/api/users.ts"
}, (opts, signal) => getUserStats.__executeServer(opts, signal));
const getUserStats = createServerFn({
  method: "GET"
}).handler(getUserStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const [total, superAdmins, churchAdmins, contentAdmins] = await Promise.all([supabase.from("profiles").select("*", {
    count: "exact",
    head: true
  }), supabase.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "super_admin"), supabase.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "church_admin"), supabase.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "content_admin")]);
  return {
    total: total.count || 0,
    superAdmins: superAdmins.count || 0,
    churchAdmins: churchAdmins.count || 0,
    contentAdmins: contentAdmins.count || 0
  };
});
export {
  assignUserRole_createServerFn_handler,
  getUserStats_createServerFn_handler,
  getUser_createServerFn_handler,
  getUsers_createServerFn_handler,
  removeUserRole_createServerFn_handler,
  updateUserStatus_createServerFn_handler
};
