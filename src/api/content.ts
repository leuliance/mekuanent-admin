import { createServerFn } from "@tanstack/react-start";
import { assertSuperAdmin } from "@/lib/server-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Tables } from "@/types/database.types";

export type ContentItem = Tables<"content_items">;

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// Get all content with pagination and filters
export const getContentItems = createServerFn({ method: "GET" })
	.inputValidator(
		(data: {
			page?: number;
			limit?: number;
			status?: Database["public"]["Enums"]["content_status"];
			content_type?: Database["public"]["Enums"]["content_type"];
			church_id?: string;
			search?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const page = data.page || 1;
		const limit = data.limit || 10;
		const offset = (page - 1) * limit;

		let query = supabase
			.from("content_items")
			.select(
				`
          *,
          churches(name, logo_url),
          profiles!content_items_created_by_fkey(first_name, last_name, avatar_url)
        `,
				{ count: "exact" },
			)
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

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
			// Use ->> to extract JSONB fields as text for ILIKE search
			query = query.or(
				`title->>en.ilike.%${data.search}%,title->>am.ilike.%${data.search}%`,
			);
		}

		const { data: content, error, count } = await query;

		if (error) {
			throw new Error(error.message);
		}

		return serialize({
			content: content || [],
			total: count || 0,
			page,
			limit,
			totalPages: Math.ceil((count || 0) / limit),
		});
	});

// Get single content item with type-specific data
export const getContentItem = createServerFn({ method: "GET" })
	.inputValidator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: content, error } = await supabase
			.from("content_items")
			.select(
				`
          *,
          churches(name, logo_url),
          creator:profiles!content_items_created_by_fkey(first_name, last_name, avatar_url),
          approver:profiles!content_items_approved_by_fkey(first_name, last_name),
          audio_content(*),
          video_content(*),
          article_content(*),
          story_content(*),
          room_content(*)
        `,
			)
			.eq("id", data.id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(content);
	});

// Approve content
export const approveContent = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string; approved_by: string }) => data)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("content_items")
			.update({
				status: "approved",
				approved_at: new Date().toISOString(),
				approved_by: data.approved_by,
				published_at: new Date().toISOString(),
			})
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// Reject content
export const rejectContent = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string; rejected_reason: string }) => data)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("content_items")
			.update({
				status: "rejected",
				rejected_reason: data.rejected_reason,
			})
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// Create content item
export const createContentItem = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			title_en: string;
			title_am: string;
			description_en?: string;
			description_am?: string;
			content_type: Database["public"]["Enums"]["content_type"];
			church_id: string;
			created_by: string;
			thumbnail_url?: string;
			status?: Database["public"]["Enums"]["content_status"];
		}) => data,
	)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: content, error } = await supabase
			.from("content_items")
			.insert({
				title: { en: data.title_en, am: data.title_am },
				description: {
					en: data.description_en || "",
					am: data.description_am || "",
				},
				content_type: data.content_type,
				church_id: data.church_id,
				created_by: data.created_by,
				thumbnail_url: data.thumbnail_url || null,
				status: data.status || "draft",
			})
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(content);
	});

// Delete content item
export const deleteContentItem = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("content_items")
			.delete()
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// Update content status
export const updateContentStatus = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			id: string;
			status: Database["public"]["Enums"]["content_status"];
		}) => data,
	)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("content_items")
			.update({ status: data.status })
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// Get content statistics
export const getContentStats = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const [pending, approved, rejected, byType] = await Promise.all([
			supabase
				.from("content_items")
				.select("*", { count: "exact", head: true })
				.eq("status", "pending_approval"),
			supabase
				.from("content_items")
				.select("*", { count: "exact", head: true })
				.eq("status", "approved"),
			supabase
				.from("content_items")
				.select("*", { count: "exact", head: true })
				.eq("status", "rejected"),
			supabase.from("content_items").select("content_type"),
		]);

		// Count by type
		const typeCounts = {
			audio: 0,
			video: 0,
			article: 0,
			story: 0,
			room: 0,
		};

		byType.data?.forEach((item) => {
			if (item.content_type in typeCounts) {
				typeCounts[item.content_type as keyof typeof typeCounts]++;
			}
		});

		return {
			pending: pending.count || 0,
			approved: approved.count || 0,
			rejected: rejected.count || 0,
			total:
				(pending.count || 0) + (approved.count || 0) + (rejected.count || 0),
			byType: typeCounts,
		};
	},
);
