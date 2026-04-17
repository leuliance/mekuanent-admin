import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertSuperAdmin } from "@/lib/server-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// ============ EVENT CATEGORIES ============

export const getEventCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();
		const { data, error } = await supabase
			.from("event_categories")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) throw new Error(error.message);
		return serialize(data || []);
	},
);

const createEventCategorySchema = z.object({
	name: z.record(z.string(), z.string()),
	description: z.record(z.string(), z.string()),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
});

export const createEventCategory = createServerFn({ method: "POST" })
	.inputValidator(createEventCategorySchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.from("event_categories").insert({
			name: data.name,
			description: data.description,
			icon: data.icon || null,
			color: data.color || null,
		});
		if (error) throw new Error(error.message);
		return { success: true };
	});

const updateEventCategorySchema = z.object({
	id: z.string(),
	name: z.record(z.string(), z.string()).optional(),
	description: z.record(z.string(), z.string()).optional(),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
});

export const updateEventCategory = createServerFn({ method: "POST" })
	.inputValidator(updateEventCategorySchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, ...updateData } = data;
		const cleanData = Object.fromEntries(
			Object.entries(updateData).filter(([_, v]) => v !== undefined),
		);
		const { error } = await supabase
			.from("event_categories")
			.update(cleanData)
			.eq("id", id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

const deleteEventCategorySchema = z.object({ id: z.string() });

export const deleteEventCategory = createServerFn({ method: "POST" })
	.inputValidator(deleteEventCategorySchema)
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("event_categories")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

// ============ REGION CATEGORIES ============

export const getRegionCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();
		const { data, error } = await supabase
			.from("region_categories")
			.select("*")
			.order("display_order", { ascending: true });
		if (error) throw new Error(error.message);
		return serialize(data || []);
	},
);

const createRegionCategorySchema = z.object({
	name: z.string().min(1),
	slug: z.string().min(1),
	display_name: z.record(z.string(), z.string()),
	description: z.record(z.string(), z.string()).optional(),
	color_start: z.string(),
	color_end: z.string(),
	display_order: z.number(),
	is_active: z.boolean(),
});

export const createRegionCategory = createServerFn({ method: "POST" })
	.inputValidator(createRegionCategorySchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.from("region_categories").insert({
			name: data.name,
			slug: data.slug,
			display_name: data.display_name,
			description: data.description || null,
			color_start: data.color_start,
			color_end: data.color_end,
			display_order: data.display_order,
			is_active: data.is_active,
		});
		if (error) throw new Error(error.message);
		return { success: true };
	});

const updateRegionCategorySchema = z.object({
	id: z.string(),
	display_name: z.record(z.string(), z.string()).optional(),
	description: z.record(z.string(), z.string()).optional(),
	color_start: z.string().optional(),
	color_end: z.string().optional(),
	display_order: z.number().optional(),
	is_active: z.boolean().optional(),
});

export const updateRegionCategory = createServerFn({ method: "POST" })
	.inputValidator(updateRegionCategorySchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, ...updateData } = data;
		const cleanData = Object.fromEntries(
			Object.entries(updateData).filter(([_, v]) => v !== undefined),
		);
		const { error } = await supabase
			.from("region_categories")
			.update(cleanData)
			.eq("id", id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

const deleteRegionCategorySchema = z.object({ id: z.string() });

export const deleteRegionCategory = createServerFn({ method: "POST" })
	.inputValidator(deleteRegionCategorySchema)
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("region_categories")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

// ============ DONATION CATEGORIES ============

export const getDonationCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();
		const { data, error } = await supabase
			.from("donation_categories")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) throw new Error(error.message);
		return serialize(data || []);
	},
);

const createDonationCategorySchema = z.object({
	name: z.record(z.string(), z.string()),
	description: z.record(z.string(), z.string()),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
});

export const createDonationCategory = createServerFn({ method: "POST" })
	.inputValidator(createDonationCategorySchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.from("donation_categories").insert({
			name: data.name,
			description: data.description,
			icon: data.icon || null,
			color: data.color || null,
		});
		if (error) throw new Error(error.message);
		return { success: true };
	});

const updateDonationCategorySchema = z.object({
	id: z.string(),
	name: z.record(z.string(), z.string()).optional(),
	description: z.record(z.string(), z.string()).optional(),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
});

export const updateDonationCategory = createServerFn({ method: "POST" })
	.inputValidator(updateDonationCategorySchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, ...updateData } = data;
		const cleanData = Object.fromEntries(
			Object.entries(updateData).filter(([_, v]) => v !== undefined),
		);
		const { error } = await supabase
			.from("donation_categories")
			.update(cleanData)
			.eq("id", id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

const deleteDonationCategorySchema = z.object({ id: z.string() });

export const deleteDonationCategory = createServerFn({ method: "POST" })
	.inputValidator(deleteDonationCategorySchema)
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("donation_categories")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});
