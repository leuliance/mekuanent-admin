import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, s as string, e as email } from "../_libs/zod.mjs";
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
const loginInputSchema = object({
  email: email(),
  password: string().min(1)
});
const loginAdmin_createServerFn_handler = createServerRpc({
  id: "5909636ce7d90039623b5f81fb83e3c99d4b48e120873e19a0a0926f321e6c78",
  name: "loginAdmin",
  filename: "src/routes/login.tsx"
}, (opts, signal) => loginAdmin.__executeServer(opts, signal));
const loginAdmin = createServerFn({
  method: "POST"
}).inputValidator((data) => loginInputSchema.parse(data)).handler(loginAdmin_createServerFn_handler, async ({
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
  } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id).in("role", ["super_admin", "admin"]);
  if (rolesError) {
    await supabase.auth.signOut();
    throw new Error("Failed to verify admin access");
  }
  if (!userRoles || userRoles.length === 0) {
    await supabase.auth.signOut();
    throw new Error("Access denied. Only administrators can access this portal.");
  }
  return {
    success: true
  };
});
export {
  loginAdmin_createServerFn_handler
};
