import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, s as string, _ as _enum, n as number, b as boolean } from "../_libs/zod.mjs";
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
function buildLocalizedJson(data, prefix) {
  const locales = ["en", "am", "or", "so", "ti"];
  const result = {};
  let hasValue = false;
  for (const loc of locales) {
    const val = data[`${prefix}_${loc}`];
    if (typeof val === "string" && val) {
      result[loc] = val;
      hasValue = true;
    } else {
      result[loc] = "";
    }
  }
  return hasValue ? result : null;
}
function hasAnyLocaleField(data, prefix) {
  return ["en", "am", "or", "so", "ti"].some((loc) => data[`${prefix}_${loc}`] !== void 0);
}
const getChurchesSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["pending", "approved", "rejected", "suspended"]).optional(),
  category: _enum(["church", "monastery", "female-monastery"]).optional(),
  search: string().optional()
});
const getChurchSchema = object({
  id: string()
});
const createChurchSchema = object({
  name_en: string(),
  name_am: string(),
  name_or: string().optional(),
  name_so: string().optional(),
  name_ti: string().optional(),
  description_en: string(),
  description_am: string(),
  description_or: string().optional(),
  description_so: string().optional(),
  description_ti: string().optional(),
  category: _enum(["church", "monastery", "female-monastery"]),
  phone_number: string(),
  email: string().optional(),
  website: string().optional(),
  city_en: string().optional(),
  city_am: string().optional(),
  city_or: string().optional(),
  city_so: string().optional(),
  city_ti: string().optional(),
  address_en: string().optional(),
  address_am: string().optional(),
  address_or: string().optional(),
  address_so: string().optional(),
  address_ti: string().optional(),
  country_en: string().optional(),
  country_am: string().optional(),
  country_or: string().optional(),
  country_so: string().optional(),
  country_ti: string().optional(),
  founded_year: number().optional()
});
const updateChurchStatusSchema = object({
  id: string(),
  status: _enum(["pending", "approved", "rejected", "suspended"]),
  rejected_reason: string().optional(),
  verified_by: string().optional()
});
const updateChurchSchema = object({
  id: string(),
  name_en: string().optional(),
  name_am: string().optional(),
  name_or: string().optional(),
  name_so: string().optional(),
  name_ti: string().optional(),
  description_en: string().optional(),
  description_am: string().optional(),
  description_or: string().optional(),
  description_so: string().optional(),
  description_ti: string().optional(),
  category: _enum(["church", "monastery", "female-monastery"]).optional(),
  phone_number: string().optional(),
  email: string().optional(),
  website: string().optional(),
  city_en: string().optional(),
  city_am: string().optional(),
  city_or: string().optional(),
  city_so: string().optional(),
  city_ti: string().optional(),
  address_en: string().optional(),
  address_am: string().optional(),
  address_or: string().optional(),
  address_so: string().optional(),
  address_ti: string().optional(),
  country_en: string().optional(),
  country_am: string().optional(),
  country_or: string().optional(),
  country_so: string().optional(),
  country_ti: string().optional(),
  founded_year: number().optional()
});
const deleteChurchSchema = object({
  id: string()
});
const getChurches_createServerFn_handler = createServerRpc({
  id: "4576afe9e3a9b0e8d641bc4f425074ac2384138714167d6bde1c6e84772ef98b",
  name: "getChurches",
  filename: "src/api/churches.ts"
}, (opts, signal) => getChurches.__executeServer(opts, signal));
const getChurches = createServerFn({
  method: "GET"
}).inputValidator(getChurchesSchema).handler(getChurches_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 10;
  const offset = (page - 1) * limit;
  let query = supabase.from("churches").select("*", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.status) {
    query = query.eq("status", data.status);
  }
  if (data.category) {
    query = query.eq("category", data.category);
  }
  if (data.search) {
    query = query.or(`name->>en.ilike.%${data.search}%,name->>am.ilike.%${data.search}%,phone_number.ilike.%${data.search}%`);
  }
  const {
    data: churches,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return serialize({
    churches: churches || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getChurch_createServerFn_handler = createServerRpc({
  id: "9fabc4b30983169a50258a3f3fae1d56bf0b2b006ba33733b4231b5699a4e718",
  name: "getChurch",
  filename: "src/api/churches.ts"
}, (opts, signal) => getChurch.__executeServer(opts, signal));
const getChurch = createServerFn({
  method: "GET"
}).inputValidator(getChurchSchema).handler(getChurch_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: church,
    error
  } = await supabase.from("churches").select(`
          *,
          bank_accounts(*),
          church_images(*),
          church_payment_methods(*, payment_gateways(*), bank_accounts(*))
        `).eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(church);
});
const updateChurchStatus_createServerFn_handler = createServerRpc({
  id: "d86e30fc01892b4cbe00858b1efd7e4802cff0cca775bf709d4b6981c2541c83",
  name: "updateChurchStatus",
  filename: "src/api/churches.ts"
}, (opts, signal) => updateChurchStatus.__executeServer(opts, signal));
const updateChurchStatus = createServerFn({
  method: "POST"
}).inputValidator(updateChurchStatusSchema).handler(updateChurchStatus_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const updateData = {
    status: data.status,
    rejected_reason: data.rejected_reason || null
  };
  if (data.status === "approved") {
    updateData.verified_at = (/* @__PURE__ */ new Date()).toISOString();
    updateData.verified_by = data.verified_by;
  }
  const {
    data: church,
    error
  } = await supabase.from("churches").update(updateData).eq("id", data.id).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(church);
});
const createChurch_createServerFn_handler = createServerRpc({
  id: "b07882c0ec867177e82e875b6f8f533bef1d5a610264da26f6cf785593e71f79",
  name: "createChurch",
  filename: "src/api/churches.ts"
}, (opts, signal) => createChurch.__executeServer(opts, signal));
const createChurch = createServerFn({
  method: "POST"
}).inputValidator(createChurchSchema).handler(createChurch_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const dataRecord = data;
  const insertData = {
    name: buildLocalizedJson(dataRecord, "name") || {
      en: data.name_en,
      am: data.name_am
    },
    description: buildLocalizedJson(dataRecord, "description") || {
      en: data.description_en,
      am: data.description_am
    },
    category: data.category,
    phone_number: data.phone_number,
    email: data.email || null,
    website: data.website || null,
    city: buildLocalizedJson(dataRecord, "city"),
    address: buildLocalizedJson(dataRecord, "address"),
    country: buildLocalizedJson(dataRecord, "country"),
    founded_year: data.founded_year || null,
    coordinates: null,
    status: "pending"
  };
  const {
    data: church,
    error
  } = await supabase.from("churches").insert(insertData).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(church);
});
const updateChurch_createServerFn_handler = createServerRpc({
  id: "a41e722e40caeff835b61245173e16db89f35b6b96262ebb69e79ec479c64be4",
  name: "updateChurch",
  filename: "src/api/churches.ts"
}, (opts, signal) => updateChurch.__executeServer(opts, signal));
const updateChurch = createServerFn({
  method: "POST"
}).inputValidator(updateChurchSchema).handler(updateChurch_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const dataRecord = data;
  const updateData = {};
  if (hasAnyLocaleField(dataRecord, "name")) {
    updateData.name = buildLocalizedJson(dataRecord, "name");
  }
  if (hasAnyLocaleField(dataRecord, "description")) {
    updateData.description = buildLocalizedJson(dataRecord, "description");
  }
  if (data.category) updateData.category = data.category;
  if (data.phone_number) updateData.phone_number = data.phone_number;
  if (data.email !== void 0) updateData.email = data.email || null;
  if (data.website !== void 0) updateData.website = data.website || null;
  if (hasAnyLocaleField(dataRecord, "city")) {
    updateData.city = buildLocalizedJson(dataRecord, "city");
  }
  if (hasAnyLocaleField(dataRecord, "address")) {
    updateData.address = buildLocalizedJson(dataRecord, "address");
  }
  if (hasAnyLocaleField(dataRecord, "country")) {
    updateData.country = buildLocalizedJson(dataRecord, "country");
  }
  if (data.founded_year !== void 0) updateData.founded_year = data.founded_year;
  const {
    data: church,
    error
  } = await supabase.from("churches").update(updateData).eq("id", data.id).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(church);
});
const deleteChurch_createServerFn_handler = createServerRpc({
  id: "6431f569bde83eee2bfd651a0ad8707af2581d5e5eb69544e719554fac62e06b",
  name: "deleteChurch",
  filename: "src/api/churches.ts"
}, (opts, signal) => deleteChurch.__executeServer(opts, signal));
const deleteChurch = createServerFn({
  method: "POST"
}).inputValidator(deleteChurchSchema).handler(deleteChurch_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("churches").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const createBankAccountSchema = object({
  church_id: string(),
  bank_name_en: string(),
  bank_name_am: string(),
  bank_name_or: string().optional(),
  bank_name_so: string().optional(),
  bank_name_ti: string().optional(),
  account_number: string(),
  account_holder_name: string(),
  branch_name: string().optional(),
  swift_code: string().optional(),
  is_primary: boolean().optional()
});
const updateBankAccountSchema = object({
  id: string(),
  bank_name_en: string().optional(),
  bank_name_am: string().optional(),
  bank_name_or: string().optional(),
  bank_name_so: string().optional(),
  bank_name_ti: string().optional(),
  account_number: string().optional(),
  account_holder_name: string().optional(),
  branch_name: string().optional(),
  swift_code: string().optional(),
  is_primary: boolean().optional(),
  is_active: boolean().optional()
});
const deleteBankAccountSchema = object({
  id: string()
});
const createBankAccount_createServerFn_handler = createServerRpc({
  id: "09434b04ddfb9bc8dd23161238256bb177429fc231fd294daabd236ba5d50114",
  name: "createBankAccount",
  filename: "src/api/churches.ts"
}, (opts, signal) => createBankAccount.__executeServer(opts, signal));
const createBankAccount = createServerFn({
  method: "POST"
}).inputValidator(createBankAccountSchema).handler(createBankAccount_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const dataRecord = data;
  const {
    data: account,
    error
  } = await supabase.from("bank_accounts").insert({
    church_id: data.church_id,
    bank_name: buildLocalizedJson(dataRecord, "bank_name") || {
      en: data.bank_name_en,
      am: data.bank_name_am
    },
    account_number: data.account_number,
    account_holder_name: data.account_holder_name,
    branch_name: data.branch_name || null,
    swift_code: data.swift_code || null,
    is_primary: data.is_primary ?? false
  }).select().single();
  if (error) throw new Error(error.message);
  return serialize(account);
});
const updateBankAccount_createServerFn_handler = createServerRpc({
  id: "1d5f890ab567f7d0d2f26001dfa8b95e52d74262d8de4843bf0d0c41059d7ee9",
  name: "updateBankAccount",
  filename: "src/api/churches.ts"
}, (opts, signal) => updateBankAccount.__executeServer(opts, signal));
const updateBankAccount = createServerFn({
  method: "POST"
}).inputValidator(updateBankAccountSchema).handler(updateBankAccount_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const dataRecord = data;
  const updateData = {};
  if (hasAnyLocaleField(dataRecord, "bank_name")) {
    updateData.bank_name = buildLocalizedJson(dataRecord, "bank_name");
  }
  if (data.account_number !== void 0) updateData.account_number = data.account_number;
  if (data.account_holder_name !== void 0) updateData.account_holder_name = data.account_holder_name;
  if (data.branch_name !== void 0) updateData.branch_name = data.branch_name || null;
  if (data.swift_code !== void 0) updateData.swift_code = data.swift_code || null;
  if (data.is_primary !== void 0) updateData.is_primary = data.is_primary;
  if (data.is_active !== void 0) updateData.is_active = data.is_active;
  const {
    data: account,
    error
  } = await supabase.from("bank_accounts").update(updateData).eq("id", data.id).select().single();
  if (error) throw new Error(error.message);
  return serialize(account);
});
const deleteBankAccount_createServerFn_handler = createServerRpc({
  id: "afca037115020fd75c128bf4041f5001640d37537871b19b247698d378ad74df",
  name: "deleteBankAccount",
  filename: "src/api/churches.ts"
}, (opts, signal) => deleteBankAccount.__executeServer(opts, signal));
const deleteBankAccount = createServerFn({
  method: "POST"
}).inputValidator(deleteBankAccountSchema).handler(deleteBankAccount_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("bank_accounts").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const addChurchImageSchema = object({
  church_id: string(),
  image_url: string(),
  display_order: number().optional()
});
const deleteChurchImageSchema = object({
  id: string()
});
const addChurchImage_createServerFn_handler = createServerRpc({
  id: "94898f40caf014eba8f736b12ed372a4862e3d2a93696a4a5b02e955602a0591",
  name: "addChurchImage",
  filename: "src/api/churches.ts"
}, (opts, signal) => addChurchImage.__executeServer(opts, signal));
const addChurchImage = createServerFn({
  method: "POST"
}).inputValidator(addChurchImageSchema).handler(addChurchImage_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: image,
    error
  } = await supabase.from("church_images").insert({
    church_id: data.church_id,
    image_url: data.image_url,
    display_order: data.display_order ?? 0
  }).select().single();
  if (error) throw new Error(error.message);
  return serialize(image);
});
const deleteChurchImage_createServerFn_handler = createServerRpc({
  id: "2225cde09b6b52d7024254faa62bb3d62cad989cff370751df0e12185d165473",
  name: "deleteChurchImage",
  filename: "src/api/churches.ts"
}, (opts, signal) => deleteChurchImage.__executeServer(opts, signal));
const deleteChurchImage = createServerFn({
  method: "POST"
}).inputValidator(deleteChurchImageSchema).handler(deleteChurchImage_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("church_images").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getChurchStats_createServerFn_handler = createServerRpc({
  id: "023a581d4cf1baa3062630c1cee168c1db8bf75eef9b60a28f196d64349f3bb2",
  name: "getChurchStats",
  filename: "src/api/churches.ts"
}, (opts, signal) => getChurchStats.__executeServer(opts, signal));
const getChurchStats = createServerFn({
  method: "GET"
}).handler(getChurchStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const [pending, approved, rejected, suspended] = await Promise.all([supabase.from("churches").select("*", {
    count: "exact",
    head: true
  }).eq("status", "pending"), supabase.from("churches").select("*", {
    count: "exact",
    head: true
  }).eq("status", "approved"), supabase.from("churches").select("*", {
    count: "exact",
    head: true
  }).eq("status", "rejected"), supabase.from("churches").select("*", {
    count: "exact",
    head: true
  }).eq("status", "suspended")]);
  return {
    pending: pending.count || 0,
    approved: approved.count || 0,
    rejected: rejected.count || 0,
    suspended: suspended.count || 0,
    total: (pending.count || 0) + (approved.count || 0) + (rejected.count || 0) + (suspended.count || 0)
  };
});
export {
  addChurchImage_createServerFn_handler,
  createBankAccount_createServerFn_handler,
  createChurch_createServerFn_handler,
  deleteBankAccount_createServerFn_handler,
  deleteChurchImage_createServerFn_handler,
  deleteChurch_createServerFn_handler,
  getChurchStats_createServerFn_handler,
  getChurch_createServerFn_handler,
  getChurches_createServerFn_handler,
  updateBankAccount_createServerFn_handler,
  updateChurchStatus_createServerFn_handler,
  updateChurch_createServerFn_handler
};
