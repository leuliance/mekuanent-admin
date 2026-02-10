import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
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
const loginSchema = object({
  email: string().email(),
  password: string().min(1)
});
const loginAdmin_createServerFn_handler = createServerRpc({
  id: "a22835464017e84bbc79f0ddf69d6f8b2b781ca158c0781a6ff7a205d55e5c7d",
  name: "loginAdmin",
  filename: "src/api/auth.ts"
}, (opts, signal) => loginAdmin.__executeServer(opts, signal));
const loginAdmin = createServerFn({
  method: "POST"
}).inputValidator(loginSchema).handler(loginAdmin_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: authData,
    error: authError
  } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });
  if (authError) {
    throw new Error(authError.message);
  }
  if (!authData.user) {
    throw new Error("Login failed");
  }
  const {
    data: userRoles,
    error: rolesError
  } = await supabase.from("user_roles").select("role, church_id").eq("user_id", authData.user.id).in("role", ["super_admin", "admin"]);
  if (rolesError) {
    throw new Error("Failed to verify admin access");
  }
  if (!userRoles || userRoles.length === 0) {
    await supabase.auth.signOut();
    throw new Error("Access denied. Only administrators can access this portal.");
  }
  const {
    data: profile
  } = await supabase.from("profiles").select("*").eq("id", authData.user.id).single();
  return serialize({
    user: {
      id: authData.user.id,
      email: profile?.email || authData.user.email,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      avatar_url: profile?.avatar_url,
      role: userRoles[0].role,
      church_id: userRoles[0].church_id
    },
    session: authData.session
  });
});
const getSession_createServerFn_handler = createServerRpc({
  id: "4eb0c01dba3360c4fb5fd4f9944fc0e51c41e541a851f7619eeb8d9eaf05c49e",
  name: "getSession",
  filename: "src/api/auth.ts"
}, (opts, signal) => getSession.__executeServer(opts, signal));
const getSession = createServerFn({
  method: "GET"
}).handler(getSession_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: {
      session
    }
  } = await supabase.auth.getSession();
  if (!session) {
    return null;
  }
  const {
    data: userRoles
  } = await supabase.from("user_roles").select("role, church_id").eq("user_id", session.user.id).in("role", ["super_admin", "admin"]);
  if (!userRoles || userRoles.length === 0) {
    return null;
  }
  const {
    data: profile
  } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
  return serialize({
    user: {
      id: session.user.id,
      email: profile?.email || session.user.email,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      avatar_url: profile?.avatar_url,
      role: userRoles[0].role,
      church_id: userRoles[0].church_id
    },
    session
  });
});
const logout_createServerFn_handler = createServerRpc({
  id: "09ce32683f41a7f1c6b569399c6bd0f1e9aeafb53cd69b043bd4aac5b7d62831",
  name: "logout",
  filename: "src/api/auth.ts"
}, (opts, signal) => logout.__executeServer(opts, signal));
const logout = createServerFn({
  method: "POST"
}).handler(logout_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return {
    success: true
  };
});
export {
  getSession_createServerFn_handler,
  loginAdmin_createServerFn_handler,
  logout_createServerFn_handler
};
