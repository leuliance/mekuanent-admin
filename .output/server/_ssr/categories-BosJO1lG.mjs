import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, s as string, r as record, b as boolean, n as number } from "../_libs/zod.mjs";
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
const getEventCategories_createServerFn_handler = createServerRpc({
  id: "1218da09bf96ef013b9b404ef15793fe1b54861a584beea5c944aa940955e237",
  name: "getEventCategories",
  filename: "src/api/categories.ts"
}, (opts, signal) => getEventCategories.__executeServer(opts, signal));
const getEventCategories = createServerFn({
  method: "GET"
}).handler(getEventCategories_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data,
    error
  } = await supabase.from("event_categories").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return serialize(data || []);
});
const createEventCategorySchema = object({
  name: record(string(), string()),
  description: record(string(), string()),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const createEventCategory_createServerFn_handler = createServerRpc({
  id: "b43020ea87f034acea57dcd95974f7ef2a023b24c734b61b4c70e31b78c7a0fe",
  name: "createEventCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => createEventCategory.__executeServer(opts, signal));
const createEventCategory = createServerFn({
  method: "POST"
}).inputValidator(createEventCategorySchema).handler(createEventCategory_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("event_categories").insert({
    name: data.name,
    description: data.description,
    icon: data.icon || null,
    color: data.color || null
  });
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const updateEventCategorySchema = object({
  id: string(),
  name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const updateEventCategory_createServerFn_handler = createServerRpc({
  id: "ba4910ed0a0570ffcaecdef31bd82390a62a86fb7c3bbdebd3a38cc97d132aac",
  name: "updateEventCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => updateEventCategory.__executeServer(opts, signal));
const updateEventCategory = createServerFn({
  method: "POST"
}).inputValidator(updateEventCategorySchema).handler(updateEventCategory_createServerFn_handler, async ({
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
  } = await supabase.from("event_categories").update(cleanData).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const deleteEventCategorySchema = object({
  id: string()
});
const deleteEventCategory_createServerFn_handler = createServerRpc({
  id: "e71d97cfec0109a22decce286915dc7d39af1e9df9a373eff86f5b87c5b9148d",
  name: "deleteEventCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => deleteEventCategory.__executeServer(opts, signal));
const deleteEventCategory = createServerFn({
  method: "POST"
}).inputValidator(deleteEventCategorySchema).handler(deleteEventCategory_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("event_categories").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getRegionCategories_createServerFn_handler = createServerRpc({
  id: "eae2b2298318ef09914a943281f133663f24d6e6cd0185c13b9eba3262b98de1",
  name: "getRegionCategories",
  filename: "src/api/categories.ts"
}, (opts, signal) => getRegionCategories.__executeServer(opts, signal));
const getRegionCategories = createServerFn({
  method: "GET"
}).handler(getRegionCategories_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data,
    error
  } = await supabase.from("region_categories").select("*").order("display_order", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return serialize(data || []);
});
const createRegionCategorySchema = object({
  name: string().min(1),
  slug: string().min(1),
  display_name: record(string(), string()),
  description: record(string(), string()).optional(),
  color_start: string(),
  color_end: string(),
  display_order: number(),
  is_active: boolean()
});
const createRegionCategory_createServerFn_handler = createServerRpc({
  id: "295117c54582021d54cee981a0fd3ba09b206fca8c96d7b2f67754ee07300732",
  name: "createRegionCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => createRegionCategory.__executeServer(opts, signal));
const createRegionCategory = createServerFn({
  method: "POST"
}).inputValidator(createRegionCategorySchema).handler(createRegionCategory_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("region_categories").insert({
    name: data.name,
    slug: data.slug,
    display_name: data.display_name,
    description: data.description || null,
    color_start: data.color_start,
    color_end: data.color_end,
    display_order: data.display_order,
    is_active: data.is_active
  });
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const updateRegionCategorySchema = object({
  id: string(),
  display_name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  color_start: string().optional(),
  color_end: string().optional(),
  display_order: number().optional(),
  is_active: boolean().optional()
});
const updateRegionCategory_createServerFn_handler = createServerRpc({
  id: "f7b709e58bccd5dcd737f91016a76c69a9164443d8ef5ade574b13d16a3a7c64",
  name: "updateRegionCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => updateRegionCategory.__executeServer(opts, signal));
const updateRegionCategory = createServerFn({
  method: "POST"
}).inputValidator(updateRegionCategorySchema).handler(updateRegionCategory_createServerFn_handler, async ({
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
  } = await supabase.from("region_categories").update(cleanData).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const deleteRegionCategorySchema = object({
  id: string()
});
const deleteRegionCategory_createServerFn_handler = createServerRpc({
  id: "02e85b2bac4aa206af5c7bfc7c519b1287486f0d9630219870da0fbc21c199a9",
  name: "deleteRegionCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => deleteRegionCategory.__executeServer(opts, signal));
const deleteRegionCategory = createServerFn({
  method: "POST"
}).inputValidator(deleteRegionCategorySchema).handler(deleteRegionCategory_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("region_categories").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getDonationCategories_createServerFn_handler = createServerRpc({
  id: "309002e200ea3912d224afd6d9532f9c994b85a84a98c6b97c72722574a4de08",
  name: "getDonationCategories",
  filename: "src/api/categories.ts"
}, (opts, signal) => getDonationCategories.__executeServer(opts, signal));
const getDonationCategories = createServerFn({
  method: "GET"
}).handler(getDonationCategories_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data,
    error
  } = await supabase.from("donation_categories").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return serialize(data || []);
});
const createDonationCategorySchema = object({
  name: record(string(), string()),
  description: record(string(), string()),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const createDonationCategory_createServerFn_handler = createServerRpc({
  id: "944a802e2f2822698ab7e618f7899e6b4b01cf0d312f97a574ce6f99570656ea",
  name: "createDonationCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => createDonationCategory.__executeServer(opts, signal));
const createDonationCategory = createServerFn({
  method: "POST"
}).inputValidator(createDonationCategorySchema).handler(createDonationCategory_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("donation_categories").insert({
    name: data.name,
    description: data.description,
    icon: data.icon || null,
    color: data.color || null
  });
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const updateDonationCategorySchema = object({
  id: string(),
  name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const updateDonationCategory_createServerFn_handler = createServerRpc({
  id: "45d4484b7fbc3da996274d4b6c9dfe3736bd54e0340cb8da77a0281ef27f73f8",
  name: "updateDonationCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => updateDonationCategory.__executeServer(opts, signal));
const updateDonationCategory = createServerFn({
  method: "POST"
}).inputValidator(updateDonationCategorySchema).handler(updateDonationCategory_createServerFn_handler, async ({
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
  } = await supabase.from("donation_categories").update(cleanData).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const deleteDonationCategorySchema = object({
  id: string()
});
const deleteDonationCategory_createServerFn_handler = createServerRpc({
  id: "72881f6f5d0a9c7765f12128225791fdbc2df958a4fb0f017ac4b856c8fe8231",
  name: "deleteDonationCategory",
  filename: "src/api/categories.ts"
}, (opts, signal) => deleteDonationCategory.__executeServer(opts, signal));
const deleteDonationCategory = createServerFn({
  method: "POST"
}).inputValidator(deleteDonationCategorySchema).handler(deleteDonationCategory_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("donation_categories").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
export {
  createDonationCategory_createServerFn_handler,
  createEventCategory_createServerFn_handler,
  createRegionCategory_createServerFn_handler,
  deleteDonationCategory_createServerFn_handler,
  deleteEventCategory_createServerFn_handler,
  deleteRegionCategory_createServerFn_handler,
  getDonationCategories_createServerFn_handler,
  getEventCategories_createServerFn_handler,
  getRegionCategories_createServerFn_handler,
  updateDonationCategory_createServerFn_handler,
  updateEventCategory_createServerFn_handler,
  updateRegionCategory_createServerFn_handler
};
