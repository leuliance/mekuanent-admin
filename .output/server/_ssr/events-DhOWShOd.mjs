import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, s as string, _ as _enum, n as number, b as boolean, r as record } from "../_libs/zod.mjs";
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
const getEventsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["draft", "published", "cancelled", "completed"]).optional(),
  church_id: string().optional(),
  search: string().optional()
});
const getEventSchema = object({
  id: string()
});
const updateEventStatusSchema = object({
  id: string(),
  status: _enum(["draft", "published", "cancelled", "completed"])
});
const updateEventSchema = object({
  id: string(),
  title: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  start_time: string().optional(),
  end_time: string().optional(),
  is_online: boolean().optional(),
  meeting_url: string().optional().nullable(),
  address: record(string(), string()).optional().nullable(),
  location: record(string(), string()).optional().nullable(),
  cover_image_url: string().optional().nullable(),
  max_attendees: number().optional().nullable(),
  rsvp_deadline: string().optional().nullable(),
  has_donation: boolean().optional(),
  donation_goal_amount: number().optional().nullable(),
  donation_currency: string().optional().nullable()
});
const deleteEventSchema = object({
  id: string()
});
const getEvents_createServerFn_handler = createServerRpc({
  id: "446166fbb6961e1ab2e3307bb5687d2629c9df32a877a85a55d99250353dbea6",
  name: "getEvents",
  filename: "src/api/events.ts"
}, (opts, signal) => getEvents.__executeServer(opts, signal));
const getEvents = createServerFn({
  method: "GET"
}).inputValidator(getEventsSchema).handler(getEvents_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 10;
  const offset = (page - 1) * limit;
  let query = supabase.from("events").select(`
          *,
          churches(name, logo_url),
          profiles!events_created_by_fkey(first_name, last_name),
          event_categories(name, icon, color),
          event_rsvps(id, status)
        `, {
    count: "exact"
  }).order("start_time", {
    ascending: false
  }).range(offset, offset + limit - 1);
  if (data.status) {
    query = query.eq("status", data.status);
  }
  if (data.church_id) {
    query = query.eq("church_id", data.church_id);
  }
  if (data.search) {
    query = query.or(`title->>en.ilike.%${data.search}%,title->>am.ilike.%${data.search}%`);
  }
  const {
    data: events,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return serialize({
    events: events || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getEvent_createServerFn_handler = createServerRpc({
  id: "9632a6df8fe7dce8ae00c4478b2da58ec0fb89d496dfd13df0f7fb6fec2a6dc6",
  name: "getEvent",
  filename: "src/api/events.ts"
}, (opts, signal) => getEvent.__executeServer(opts, signal));
const getEvent = createServerFn({
  method: "GET"
}).inputValidator(getEventSchema).handler(getEvent_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: event,
    error
  } = await supabase.from("events").select(`
          *,
          churches(name, logo_url, phone_number),
          profiles!events_created_by_fkey(first_name, last_name, avatar_url),
          event_categories(name, icon, color),
          event_rsvps(*, profiles(first_name, last_name, avatar_url)),
          event_co_hosts(*, churches(name, logo_url))
        `).eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(event);
});
const getEventDonations_createServerFn_handler = createServerRpc({
  id: "d764e313fd68cc1f8e1a008b3613f68592bd7ab30caecc2f490444be21881b6f",
  name: "getEventDonations",
  filename: "src/api/events.ts"
}, (opts, signal) => getEventDonations.__executeServer(opts, signal));
const getEventDonations = createServerFn({
  method: "GET"
}).inputValidator(getEventSchema).handler(getEventDonations_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: donations,
    error
  } = await supabase.from("donations").select(`
          *,
          profiles(first_name, last_name, avatar_url)
        `).eq("event_id", data.id).order("created_at", {
    ascending: false
  });
  if (error) {
    throw new Error(error.message);
  }
  return serialize(donations || []);
});
const updateEventStatus_createServerFn_handler = createServerRpc({
  id: "620d348b9cbf59fddb4a9438b77aef2729d964f130ea46244a7c4c95158d2c9c",
  name: "updateEventStatus",
  filename: "src/api/events.ts"
}, (opts, signal) => updateEventStatus.__executeServer(opts, signal));
const updateEventStatus = createServerFn({
  method: "POST"
}).inputValidator(updateEventStatusSchema).handler(updateEventStatus_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("events").update({
    status: data.status
  }).eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const updateEvent_createServerFn_handler = createServerRpc({
  id: "92ab24991e9a6cf511b86c729727bde091ad2d4a6f316592c88a04ef6883feb8",
  name: "updateEvent",
  filename: "src/api/events.ts"
}, (opts, signal) => updateEvent.__executeServer(opts, signal));
const updateEvent = createServerFn({
  method: "POST"
}).inputValidator(updateEventSchema).handler(updateEvent_createServerFn_handler, async ({
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
  } = await supabase.from("events").update(cleanData).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const deleteEvent_createServerFn_handler = createServerRpc({
  id: "a8641be271b447d958bc3a0309843dde257d35d85704450d710e0896871a796b",
  name: "deleteEvent",
  filename: "src/api/events.ts"
}, (opts, signal) => deleteEvent.__executeServer(opts, signal));
const deleteEvent = createServerFn({
  method: "POST"
}).inputValidator(deleteEventSchema).handler(deleteEvent_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("events").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const getEventStats_createServerFn_handler = createServerRpc({
  id: "b4beec82a5024d3a9c4af7dcf99789c2bced8bfd1c9a8b41811e11d8d21690c0",
  name: "getEventStats",
  filename: "src/api/events.ts"
}, (opts, signal) => getEventStats.__executeServer(opts, signal));
const getEventStats = createServerFn({
  method: "GET"
}).handler(getEventStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const [total, upcoming, completed, totalRsvps] = await Promise.all([supabase.from("events").select("*", {
    count: "exact",
    head: true
  }), supabase.from("events").select("*", {
    count: "exact",
    head: true
  }).eq("status", "published").gte("start_time", now), supabase.from("events").select("*", {
    count: "exact",
    head: true
  }).eq("status", "completed"), supabase.from("event_rsvps").select("*", {
    count: "exact",
    head: true
  }).eq("status", "going")]);
  return {
    total: total.count || 0,
    upcoming: upcoming.count || 0,
    completed: completed.count || 0,
    totalRsvps: totalRsvps.count || 0
  };
});
export {
  deleteEvent_createServerFn_handler,
  getEventDonations_createServerFn_handler,
  getEventStats_createServerFn_handler,
  getEvent_createServerFn_handler,
  getEvents_createServerFn_handler,
  updateEventStatus_createServerFn_handler,
  updateEvent_createServerFn_handler
};
