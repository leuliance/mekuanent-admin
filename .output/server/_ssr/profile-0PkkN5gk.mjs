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
const getProfile_createServerFn_handler = createServerRpc({
  id: "596094f5439992d50f4193961481bc9e7def6ccb0e992bd4640854896f0f1bde",
  name: "getProfile",
  filename: "src/api/profile.ts"
}, (opts, signal) => getProfile.__executeServer(opts, signal));
const getProfile = createServerFn({
  method: "GET"
}).handler(getProfile_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not authenticated");
  const {
    data: profile,
    error
  } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) throw new Error(error.message);
  return serialize(profile);
});
const updateProfileSchema = object({
  first_name: string().optional().nullable(),
  last_name: string().optional().nullable(),
  email: string().optional().nullable(),
  phone_number: string().optional().nullable(),
  bio: string().optional().nullable(),
  city: string().optional().nullable(),
  country: string().optional().nullable(),
  date_of_birth: string().optional().nullable(),
  gender: string().optional().nullable(),
  language_preference: string().optional().nullable()
});
const updateProfile_createServerFn_handler = createServerRpc({
  id: "8ba5aafb7d36e01beda344c72a9b902260ffcf2de00c58697e537d663ca5e3bb",
  name: "updateProfile",
  filename: "src/api/profile.ts"
}, (opts, signal) => updateProfile.__executeServer(opts, signal));
const updateProfile = createServerFn({
  method: "POST"
}).inputValidator(updateProfileSchema).handler(updateProfile_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not authenticated");
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== void 0));
  const {
    error
  } = await supabase.from("profiles").update(cleanData).eq("id", user.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const changePasswordSchema = object({
  newPassword: string().min(6)
});
const changePassword_createServerFn_handler = createServerRpc({
  id: "cf9385d1cf921b35f39a11ebe470cc0ef2e4fa92cbea0b38db20a0421631023d",
  name: "changePassword",
  filename: "src/api/profile.ts"
}, (opts, signal) => changePassword.__executeServer(opts, signal));
const changePassword = createServerFn({
  method: "POST"
}).inputValidator(changePasswordSchema).handler(changePassword_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.auth.updateUser({
    password: data.newPassword
  });
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
export {
  changePassword_createServerFn_handler,
  getProfile_createServerFn_handler,
  updateProfile_createServerFn_handler
};
