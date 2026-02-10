import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
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
const getContentItems_createServerFn_handler = createServerRpc({
  id: "d3f3988455893cc809e64179ae268b2848bddd8201cd2f60e989940142f4afb8",
  name: "getContentItems",
  filename: "src/api/content.ts"
}, (opts, signal) => getContentItems.__executeServer(opts, signal));
const getContentItems = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getContentItems_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 10;
  const offset = (page - 1) * limit;
  let query = supabase.from("content_items").select(`
          *,
          churches(name, logo_url),
          profiles!content_items_created_by_fkey(first_name, last_name, avatar_url)
        `, {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.status) {
    query = query.eq("status", data.status);
  }
  if (data.content_type) {
    query = query.eq("content_type", data.content_type);
  }
  if (data.church_id) {
    query = query.eq("church_id", data.church_id);
  }
  if (data.search) {
    query = query.or(`title->>en.ilike.%${data.search}%,title->>am.ilike.%${data.search}%`);
  }
  const {
    data: content,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return serialize({
    content: content || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getContentItem_createServerFn_handler = createServerRpc({
  id: "09fd6c9e9fd0455b5604a1f9028e1f22ce76509dc659537e35a14d69f5c059aa",
  name: "getContentItem",
  filename: "src/api/content.ts"
}, (opts, signal) => getContentItem.__executeServer(opts, signal));
const getContentItem = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getContentItem_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: content,
    error
  } = await supabase.from("content_items").select(`
          *,
          churches(name, logo_url),
          creator:profiles!content_items_created_by_fkey(first_name, last_name, avatar_url),
          approver:profiles!content_items_approved_by_fkey(first_name, last_name),
          audio_content(*),
          video_content(*),
          article_content(*),
          story_content(*),
          room_content(*)
        `).eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(content);
});
const approveContent_createServerFn_handler = createServerRpc({
  id: "63d408531ec0c9b0119edeb3718367cffe049676e212ef8498bd435cf16a84e6",
  name: "approveContent",
  filename: "src/api/content.ts"
}, (opts, signal) => approveContent.__executeServer(opts, signal));
const approveContent = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(approveContent_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("content_items").update({
    status: "approved",
    approved_at: (/* @__PURE__ */ new Date()).toISOString(),
    approved_by: data.approved_by,
    published_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const rejectContent_createServerFn_handler = createServerRpc({
  id: "0315e9011fae06aa7045db409ea92b6701bd49f1d5e9d7156f294afab48cc004",
  name: "rejectContent",
  filename: "src/api/content.ts"
}, (opts, signal) => rejectContent.__executeServer(opts, signal));
const rejectContent = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(rejectContent_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("content_items").update({
    status: "rejected",
    rejected_reason: data.rejected_reason
  }).eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const createContentItem_createServerFn_handler = createServerRpc({
  id: "0eee45c60c19d69dd15877f0f08c988dce08e5321e40e1a3a5081e4bffd6fde9",
  name: "createContentItem",
  filename: "src/api/content.ts"
}, (opts, signal) => createContentItem.__executeServer(opts, signal));
const createContentItem = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createContentItem_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: content,
    error
  } = await supabase.from("content_items").insert({
    title: {
      en: data.title_en,
      am: data.title_am
    },
    description: {
      en: data.description_en || "",
      am: data.description_am || ""
    },
    content_type: data.content_type,
    church_id: data.church_id,
    created_by: data.created_by,
    thumbnail_url: data.thumbnail_url || null,
    status: data.status || "draft"
  }).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(content);
});
const deleteContentItem_createServerFn_handler = createServerRpc({
  id: "5794aa598a4af5e3e7e948e7ee5e4c4454cd27e276b4f0f1035d6a36f3047d57",
  name: "deleteContentItem",
  filename: "src/api/content.ts"
}, (opts, signal) => deleteContentItem.__executeServer(opts, signal));
const deleteContentItem = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(deleteContentItem_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("content_items").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const updateContentStatus_createServerFn_handler = createServerRpc({
  id: "d1da1e744e2aeb49a0d3fc8c8416c5be6709c2dcdd05d45dfcc2e51b4cd2bc51",
  name: "updateContentStatus",
  filename: "src/api/content.ts"
}, (opts, signal) => updateContentStatus.__executeServer(opts, signal));
const updateContentStatus = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(updateContentStatus_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("content_items").update({
    status: data.status
  }).eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const getContentStats_createServerFn_handler = createServerRpc({
  id: "2f08f0eb4a334da2169abd45d94f19503a2ab8b6681eea564f06b67ac5e21725",
  name: "getContentStats",
  filename: "src/api/content.ts"
}, (opts, signal) => getContentStats.__executeServer(opts, signal));
const getContentStats = createServerFn({
  method: "GET"
}).handler(getContentStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const [pending, approved, rejected, byType] = await Promise.all([supabase.from("content_items").select("*", {
    count: "exact",
    head: true
  }).eq("status", "pending_approval"), supabase.from("content_items").select("*", {
    count: "exact",
    head: true
  }).eq("status", "approved"), supabase.from("content_items").select("*", {
    count: "exact",
    head: true
  }).eq("status", "rejected"), supabase.from("content_items").select("content_type")]);
  const typeCounts = {
    audio: 0,
    video: 0,
    article: 0,
    story: 0,
    room: 0
  };
  byType.data?.forEach((item) => {
    if (item.content_type in typeCounts) {
      typeCounts[item.content_type]++;
    }
  });
  return {
    pending: pending.count || 0,
    approved: approved.count || 0,
    rejected: rejected.count || 0,
    total: (pending.count || 0) + (approved.count || 0) + (rejected.count || 0),
    byType: typeCounts
  };
});
export {
  approveContent_createServerFn_handler,
  createContentItem_createServerFn_handler,
  deleteContentItem_createServerFn_handler,
  getContentItem_createServerFn_handler,
  getContentItems_createServerFn_handler,
  getContentStats_createServerFn_handler,
  rejectContent_createServerFn_handler,
  updateContentStatus_createServerFn_handler
};
