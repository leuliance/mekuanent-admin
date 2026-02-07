import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Tables } from "@/types/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Event = Tables<"events">;

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// Schemas
const getEventsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
  church_id: z.string().optional(),
  search: z.string().optional(),
});

const getEventSchema = z.object({
  id: z.string(),
});

const updateEventStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["draft", "published", "cancelled", "completed"]),
});

const updateEventSchema = z.object({
  id: z.string(),
  title: z.record(z.string(), z.string()).optional(),
  description: z.record(z.string(), z.string()).optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  is_online: z.boolean().optional(),
  meeting_url: z.string().optional().nullable(),
  address: z.record(z.string(), z.string()).optional().nullable(),
  location: z.record(z.string(), z.string()).optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  max_attendees: z.number().optional().nullable(),
  rsvp_deadline: z.string().optional().nullable(),
  has_donation: z.boolean().optional(),
  donation_goal_amount: z.number().optional().nullable(),
  donation_currency: z.string().optional().nullable(),
});

const deleteEventSchema = z.object({
  id: z.string(),
});

// Get all events with pagination
export const getEvents = createServerFn({ method: "GET" })
  .inputValidator(getEventsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("events")
      .select(
        `
          *,
          churches(name, logo_url),
          profiles!events_created_by_fkey(first_name, last_name),
          event_categories(name, icon, color),
          event_rsvps(id, status)
        `,
        { count: "exact" }
      )
      .order("start_time", { ascending: false })
      .range(offset, offset + limit - 1);

    if (data.status) {
      query = query.eq("status", data.status);
    }

    if (data.church_id) {
      query = query.eq("church_id", data.church_id);
    }

    if (data.search) {
      query = query.or(
        `title->>en.ilike.%${data.search}%,title->>am.ilike.%${data.search}%`
      );
    }

    const { data: events, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return serialize({
      events: events || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  });

// Get single event with full details
export const getEvent = createServerFn({ method: "GET" })
  .inputValidator(getEventSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: event, error } = await supabase
      .from("events")
      .select(
        `
          *,
          churches(name, logo_url, phone_number),
          profiles!events_created_by_fkey(first_name, last_name, avatar_url),
          event_categories(name, icon, color),
          event_rsvps(*, profiles(first_name, last_name, avatar_url)),
          event_co_hosts(*, churches(name, logo_url))
        `
      )
      .eq("id", data.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return serialize(event);
  });

// Get donations for an event
export const getEventDonations = createServerFn({ method: "GET" })
  .inputValidator(getEventSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: donations, error } = await supabase
      .from("donations")
      .select(
        `
          *,
          profiles(first_name, last_name, avatar_url)
        `
      )
      .eq("event_id", data.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return serialize(donations || []);
  });

// Update event status
export const updateEventStatus = createServerFn({ method: "POST" })
  .inputValidator(updateEventStatusSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("events")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

// Update event details
export const updateEvent = createServerFn({ method: "POST" })
  .inputValidator(updateEventSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { id, ...updateData } = data;

    // Filter out undefined values
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    const { error } = await supabase
      .from("events")
      .update(cleanData)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

// Delete event
export const deleteEvent = createServerFn({ method: "POST" })
  .inputValidator(deleteEventSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", data.id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

// Get event statistics
export const getEventStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();
    const now = new Date().toISOString();

    const [total, upcoming, completed, totalRsvps] = await Promise.all([
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .gte("start_time", now),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),
      supabase
        .from("event_rsvps")
        .select("*", { count: "exact", head: true })
        .eq("status", "going"),
    ]);

    return {
      total: total.count || 0,
      upcoming: upcoming.count || 0,
      completed: completed.count || 0,
      totalRsvps: totalRsvps.count || 0,
    };
  }
);
