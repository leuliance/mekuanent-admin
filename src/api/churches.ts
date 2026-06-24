import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertSuperAdmin } from "@/lib/server-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Tables } from "@/types/database.types";

export type Church = Tables<"churches">;
export type ChurchCategory = Database["public"]["Enums"]["church_category"];
export type ChurchInsert = Database["public"]["Tables"]["churches"]["Insert"];
export type ChurchUpdate = Database["public"]["Tables"]["churches"]["Update"];

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// Supported content languages (matches the DB `language` check constraint).
const languageSchema = z.enum(["en", "am", "or", "ti", "so"]);

// Schemas
const getChurchesSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),
	category: z.enum(["church", "monastery", "female-monastery"]).optional(),
	search: z.string().optional(),
});

const getChurchSchema = z.object({
	id: z.string(),
});

const createChurchSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional().default(""),
	language: languageSchema.optional().default("en"),
	category: z.enum(["church", "monastery", "female-monastery"]),
	phone_number: z.string(),
	email: z.string().optional(),
	website: z.string().optional(),
	city: z.string().optional(),
	address: z.string().optional(),
	country: z.string().optional(),
	founded_year: z.number().optional(),
});

const updateChurchStatusSchema = z.object({
	id: z.string(),
	status: z.enum(["pending", "approved", "rejected", "suspended"]),
	rejected_reason: z.string().optional(),
	verified_by: z.string().optional(),
});

const updateChurchSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	language: languageSchema.optional(),
	category: z.enum(["church", "monastery", "female-monastery"]).optional(),
	phone_number: z.string().optional(),
	email: z.string().optional(),
	website: z.string().optional(),
	city: z.string().optional(),
	address: z.string().optional(),
	country: z.string().optional(),
	founded_year: z.number().optional(),
});

const deleteChurchSchema = z.object({
	id: z.string(),
});

// Get all churches with pagination and filters
export const getChurches = createServerFn({ method: "GET" })
	.validator(getChurchesSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const page = data.page || 1;
		const limit = data.limit || 10;
		const offset = (page - 1) * limit;

		let query = supabase
			.from("churches")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (data.status) {
			query = query.eq("status", data.status);
		}

		if (data.category) {
			query = query.eq("category", data.category);
		}

		if (data.search) {
			query = query.or(
				`name.ilike.%${data.search}%,phone_number.ilike.%${data.search}%`,
			);
		}

		const { data: churches, error, count } = await query;

		if (error) {
			throw new Error(error.message);
		}

		return serialize({
			churches: churches || [],
			total: count || 0,
			page,
			limit,
			totalPages: Math.ceil((count || 0) / limit),
		});
	});

// Get single church by ID
export const getChurch = createServerFn({ method: "GET" })
	.validator(getChurchSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: church, error } = await supabase
			.from("churches")
			.select(
				`
          *,
          bank_accounts(*),
          church_images(*),
          church_payment_methods(*, payment_gateways(*), bank_accounts(*))
        `,
			)
			.eq("id", data.id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(church);
	});

// Update church status (approve, reject, suspend)
export const updateChurchStatus = createServerFn({ method: "POST" })
	.validator(updateChurchStatusSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const updateData: ChurchUpdate = {
			status: data.status,
			rejected_reason: data.rejected_reason || null,
		};

		if (data.status === "approved") {
			updateData.verified_at = new Date().toISOString();
			updateData.verified_by = data.verified_by;
		}

		const { data: church, error } = await supabase
			.from("churches")
			.update(updateData)
			.eq("id", data.id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(church);
	});

// Create a new church
export const createChurch = createServerFn({ method: "POST" })
	.validator(createChurchSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const insertData: ChurchInsert = {
			name: data.name,
			description: data.description ?? "",
			language: data.language ?? "en",
			category: data.category,
			phone_number: data.phone_number,
			email: data.email || null,
			website: data.website || null,
			city: data.city || null,
			address: data.address || null,
			country: data.country || null,
			founded_year: data.founded_year || null,
			coordinates: null,
			status: "pending",
		};

		const { data: church, error } = await supabase
			.from("churches")
			.insert(insertData)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(church);
	});

// Update church details
export const updateChurch = createServerFn({ method: "POST" })
	.validator(updateChurchSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const updateData: ChurchUpdate = {};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined)
			updateData.description = data.description;
		if (data.language !== undefined) updateData.language = data.language;
		if (data.category) updateData.category = data.category;
		if (data.phone_number) updateData.phone_number = data.phone_number;
		if (data.email !== undefined) updateData.email = data.email || null;
		if (data.website !== undefined) updateData.website = data.website || null;
		if (data.city !== undefined) updateData.city = data.city || null;
		if (data.address !== undefined) updateData.address = data.address || null;
		if (data.country !== undefined) updateData.country = data.country || null;
		if (data.founded_year !== undefined)
			updateData.founded_year = data.founded_year;

		const { data: church, error } = await supabase
			.from("churches")
			.update(updateData)
			.eq("id", data.id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(church);
	});

// Delete a church
export const deleteChurch = createServerFn({ method: "POST" })
	.validator(deleteChurchSchema)
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("churches")
			.delete()
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// ============ BANK ACCOUNTS ============

const createBankAccountSchema = z.object({
	church_id: z.string(),
	bank_name: z.string().min(1),
	account_number: z.string(),
	account_holder_name: z.string(),
	branch_name: z.string().optional(),
	swift_code: z.string().optional(),
	is_primary: z.boolean().optional(),
});

const updateBankAccountSchema = z.object({
	id: z.string(),
	bank_name: z.string().optional(),
	account_number: z.string().optional(),
	account_holder_name: z.string().optional(),
	branch_name: z.string().optional(),
	swift_code: z.string().optional(),
	is_primary: z.boolean().optional(),
	is_active: z.boolean().optional(),
});

const deleteBankAccountSchema = z.object({ id: z.string() });

export const createBankAccount = createServerFn({ method: "POST" })
	.validator(createBankAccountSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: account, error } = await supabase
			.from("bank_accounts")
			.insert({
				church_id: data.church_id,
				bank_name: data.bank_name,
				account_number: data.account_number,
				account_holder_name: data.account_holder_name,
				branch_name: data.branch_name || null,
				swift_code: data.swift_code || null,
				is_primary: data.is_primary ?? false,
			})
			.select()
			.single();

		if (error) throw new Error(error.message);
		return serialize(account);
	});

export const updateBankAccount = createServerFn({ method: "POST" })
	.validator(updateBankAccountSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		// biome-ignore lint/suspicious/noExplicitAny: Dynamic update object
		const updateData: any = {};
		if (data.bank_name !== undefined) updateData.bank_name = data.bank_name;
		if (data.account_number !== undefined)
			updateData.account_number = data.account_number;
		if (data.account_holder_name !== undefined)
			updateData.account_holder_name = data.account_holder_name;
		if (data.branch_name !== undefined)
			updateData.branch_name = data.branch_name || null;
		if (data.swift_code !== undefined)
			updateData.swift_code = data.swift_code || null;
		if (data.is_primary !== undefined) updateData.is_primary = data.is_primary;
		if (data.is_active !== undefined) updateData.is_active = data.is_active;

		const { data: account, error } = await supabase
			.from("bank_accounts")
			.update(updateData)
			.eq("id", data.id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return serialize(account);
	});

export const deleteBankAccount = createServerFn({ method: "POST" })
	.validator(deleteBankAccountSchema)
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("bank_accounts")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

// ============ CHURCH IMAGES ============

const addChurchImageSchema = z.object({
	church_id: z.string(),
	image_url: z.string(),
	display_order: z.number().optional(),
});

const deleteChurchImageSchema = z.object({ id: z.string() });

export const addChurchImage = createServerFn({ method: "POST" })
	.validator(addChurchImageSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: image, error } = await supabase
			.from("church_images")
			.insert({
				church_id: data.church_id,
				image_url: data.image_url,
				display_order: data.display_order ?? 0,
			})
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(image);
	});

export const deleteChurchImage = createServerFn({ method: "POST" })
	.validator(deleteChurchImageSchema)
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("church_images")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

// Get church statistics
export const getChurchStats = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const [pending, approved, rejected, suspended] = await Promise.all([
			supabase
				.from("churches")
				.select("*", { count: "exact", head: true })
				.eq("status", "pending"),
			supabase
				.from("churches")
				.select("*", { count: "exact", head: true })
				.eq("status", "approved"),
			supabase
				.from("churches")
				.select("*", { count: "exact", head: true })
				.eq("status", "rejected"),
			supabase
				.from("churches")
				.select("*", { count: "exact", head: true })
				.eq("status", "suspended"),
		]);

		return {
			pending: pending.count || 0,
			approved: approved.count || 0,
			rejected: rejected.count || 0,
			suspended: suspended.count || 0,
			total:
				(pending.count || 0) +
				(approved.count || 0) +
				(rejected.count || 0) +
				(suspended.count || 0),
		};
	},
);
