import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { c as createServerFn } from "./index.mjs";
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
const getAdminUser_createServerFn_handler = createServerRpc({
  id: "1dc60576230e5b3f3ae1e63f06a1ef85f0255b45b98a675f3dc802641b3397f9",
  name: "getAdminUser",
  filename: "src/routes/__root.tsx"
}, (opts, signal) => getAdminUser.__executeServer(opts, signal));
const getAdminUser = createServerFn({
  method: "GET"
}).handler(getAdminUser_createServerFn_handler, async () => {
  const {
    getSupabaseServerClient
  } = await import("./server-DDesMkLt.mjs");
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    },
    error
  } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  const {
    data: userRoles
  } = await supabase.from("user_roles").select("role, church_id").eq("user_id", user.id).in("role", ["super_admin", "admin"]);
  if (!userRoles || userRoles.length === 0) {
    return null;
  }
  const {
    data: profile
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return {
    id: user.id,
    email: profile?.email || user.email || null,
    first_name: profile?.first_name || null,
    last_name: profile?.last_name || null,
    avatar_url: profile?.avatar_url || null,
    role: userRoles[0].role,
    church_id: userRoles[0].church_id
  };
});
export {
  getAdminUser_createServerFn_handler
};
