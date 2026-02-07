import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type NotificationType = Database["public"]["Enums"]["notification_type"];
type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];

// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// ============ GET NOTIFICATIONS ============

const getNotificationsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  type: z.string().optional(),
});

export const getNotifications = createServerFn({ method: "GET" })
  .inputValidator(getNotificationsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const page = data.page || 1;
    const limit = data.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("notifications")
      .select("*, profiles(first_name, last_name, avatar_url)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (data.type) {
      query = query.eq("type", data.type as NotificationType);
    }

    const { data: notifications, error, count } = await query;

    if (error) throw new Error(error.message);

    return serialize({
      notifications: notifications || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  });

// ============ SEND NOTIFICATION ============
// Broadcast (all users): inserts 1 row with user_id = NULL, is_broadcast = true
// Targeted (specific users): inserts 1 row per user with is_broadcast = false
// This is scalable — broadcast doesn't create N rows for N users.

const sendNotificationSchema = z.object({
  title: z.record(z.string(), z.string()),
  body: z.record(z.string(), z.string()),
  type: z.enum([
    "verse_of_day",
    "new_content",
    "event_reminder",
    "event_update",
    "donation_received",
    "role_invitation",
    "content_approved",
    "content_rejected",
    "room_started",
    "donation_campaign_update",
    "prayer_request",
    "church_announcement",
    "system_message",
    "achievement",
  ]),
  data: z.record(z.string(), z.unknown()).optional().nullable(),
  // If user_ids provided, send to specific users. Otherwise broadcast to all.
  user_ids: z.array(z.string()).optional(),
  sent_by: z.string().optional(),
});

export const sendNotification = createServerFn({ method: "POST" })
  .inputValidator(sendNotificationSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const isBroadcast = !data.user_ids || data.user_ids.length === 0;

    if (isBroadcast) {
      // Single row for broadcast — user_id is NULL
      const row: NotificationInsert = {
        user_id: null,
        type: data.type,
        title: data.title,
        body: data.body,
        data: data.data as NotificationInsert["data"],
        is_read: false,
        is_broadcast: true,
        sent_by: data.sent_by || null,
      };

      const { error } = await supabase.from("notifications").insert(row);
      if (error) throw new Error(error.message);

      return { success: true, sent: 1, broadcast: true };
    }

    // Targeted: insert one row per specified user
    const notifications: NotificationInsert[] = (data.user_ids ?? []).map((userId) => ({
      user_id: userId,
      type: data.type,
      title: data.title,
      body: data.body,
      data: data.data as NotificationInsert["data"],
      is_read: false,
      is_broadcast: false,
      sent_by: data.sent_by || null,
    }));

    const { error } = await supabase.from("notifications").insert(notifications);
    if (error) throw new Error(error.message);

    return { success: true, sent: notifications.length, broadcast: false };
  });

// ============ SEARCH USERS (for targeted notifications) ============

const searchUsersSchema = z.object({
  query: z.string().min(1),
});

export const searchUsersForNotification = createServerFn({ method: "GET" })
  .inputValidator(searchUsersSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, avatar_url")
      .or(
        `first_name.ilike.%${data.query}%,last_name.ilike.%${data.query}%,email.ilike.%${data.query}%,phone_number.ilike.%${data.query}%`
      )
      .limit(10);
    if (error) throw new Error(error.message);
    return serialize(users || []);
  });

// ============ DELETE NOTIFICATION ============

const deleteNotificationSchema = z.object({
  id: z.string(),
});

export const deleteNotification = createServerFn({ method: "POST" })
  .inputValidator(deleteNotificationSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ============ NOTIFICATION STATS ============

export const getNotificationStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();

    const [total, unread, systemMessages] = await Promise.all([
      supabase
        .from("notifications")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("type", "system_message"),
    ]);

    return {
      total: total.count || 0,
      unread: unread.count || 0,
      systemMessages: systemMessages.count || 0,
    };
  }
);
