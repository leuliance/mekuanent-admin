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

// Helper to build localized JSON from flat fields
function buildLocalizedJson(
	data: Record<string, unknown>,
	prefix: string,
): Record<string, string> | null {
	const locales = ["en", "am", "or", "so", "ti"];
	const result: Record<string, string> = {};
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

function hasAnyLocaleField(
	data: Record<string, unknown>,
	prefix: string,
): boolean {
	return ["en", "am", "or", "so", "ti"].some(
		(loc) => data[`${prefix}_${loc}`] !== undefined,
	);
}

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
	name_en: z.string(),
	name_am: z.string(),
	name_or: z.string().optional(),
	name_so: z.string().optional(),
	name_ti: z.string().optional(),
	description_en: z.string(),
	description_am: z.string(),
	description_or: z.string().optional(),
	description_so: z.string().optional(),
	description_ti: z.string().optional(),
	category: z.enum(["church", "monastery", "female-monastery"]),
	phone_number: z.string(),
	email: z.string().optional(),
	website: z.string().optional(),
	city_en: z.string().optional(),
	city_am: z.string().optional(),
	city_or: z.string().optional(),
	city_so: z.string().optional(),
	city_ti: z.string().optional(),
	address_en: z.string().optional(),
	address_am: z.string().optional(),
	address_or: z.string().optional(),
	address_so: z.string().optional(),
	address_ti: z.string().optional(),
	country_en: z.string().optional(),
	country_am: z.string().optional(),
	country_or: z.string().optional(),
	country_so: z.string().optional(),
	country_ti: z.string().optional(),
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
	name_en: z.string().optional(),
	name_am: z.string().optional(),
	name_or: z.string().optional(),
	name_so: z.string().optional(),
	name_ti: z.string().optional(),
	description_en: z.string().optional(),
	description_am: z.string().optional(),
	description_or: z.string().optional(),
	description_so: z.string().optional(),
	description_ti: z.string().optional(),
	category: z.enum(["church", "monastery", "female-monastery"]).optional(),
	phone_number: z.string().optional(),
	email: z.string().optional(),
	website: z.string().optional(),
	city_en: z.string().optional(),
	city_am: z.string().optional(),
	city_or: z.string().optional(),
	city_so: z.string().optional(),
	city_ti: z.string().optional(),
	address_en: z.string().optional(),
	address_am: z.string().optional(),
	address_or: z.string().optional(),
	address_so: z.string().optional(),
	address_ti: z.string().optional(),
	country_en: z.string().optional(),
	country_am: z.string().optional(),
	country_or: z.string().optional(),
	country_so: z.string().optional(),
	country_ti: z.string().optional(),
	founded_year: z.number().optional(),
});

const deleteChurchSchema = z.object({
	id: z.string(),
});

// Get all churches with pagination and filters
export const getChurches = createServerFn({ method: "GET" })
	.inputValidator(getChurchesSchema)
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
				`name->>en.ilike.%${data.search}%,name->>am.ilike.%${data.search}%,phone_number.ilike.%${data.search}%`,
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
	.inputValidator(getChurchSchema)
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
	.inputValidator(updateChurchStatusSchema)
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
	.inputValidator(createChurchSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const dataRecord = data as unknown as Record<string, unknown>;

		const insertData: ChurchInsert = {
			name: buildLocalizedJson(dataRecord, "name") || {
				en: data.name_en,
				am: data.name_am,
			},
			description: buildLocalizedJson(dataRecord, "description") || {
				en: data.description_en,
				am: data.description_am,
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
	.inputValidator(updateChurchSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const dataRecord = data as unknown as Record<string, unknown>;

		const updateData: ChurchUpdate = {};

		if (hasAnyLocaleField(dataRecord, "name")) {
			updateData.name = buildLocalizedJson(dataRecord, "name");
		}
		if (hasAnyLocaleField(dataRecord, "description")) {
			updateData.description = buildLocalizedJson(dataRecord, "description");
		}
		if (data.category) updateData.category = data.category;
		if (data.phone_number) updateData.phone_number = data.phone_number;
		if (data.email !== undefined) updateData.email = data.email || null;
		if (data.website !== undefined) updateData.website = data.website || null;
		if (hasAnyLocaleField(dataRecord, "city")) {
			updateData.city = buildLocalizedJson(dataRecord, "city");
		}
		if (hasAnyLocaleField(dataRecord, "address")) {
			updateData.address = buildLocalizedJson(dataRecord, "address");
		}
		if (hasAnyLocaleField(dataRecord, "country")) {
			updateData.country = buildLocalizedJson(dataRecord, "country");
		}
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
	.inputValidator(deleteChurchSchema)
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
	bank_name_en: z.string(),
	bank_name_am: z.string(),
	bank_name_or: z.string().optional(),
	bank_name_so: z.string().optional(),
	bank_name_ti: z.string().optional(),
	account_number: z.string(),
	account_holder_name: z.string(),
	branch_name: z.string().optional(),
	swift_code: z.string().optional(),
	is_primary: z.boolean().optional(),
});

const updateBankAccountSchema = z.object({
	id: z.string(),
	bank_name_en: z.string().optional(),
	bank_name_am: z.string().optional(),
	bank_name_or: z.string().optional(),
	bank_name_so: z.string().optional(),
	bank_name_ti: z.string().optional(),
	account_number: z.string().optional(),
	account_holder_name: z.string().optional(),
	branch_name: z.string().optional(),
	swift_code: z.string().optional(),
	is_primary: z.boolean().optional(),
	is_active: z.boolean().optional(),
});

const deleteBankAccountSchema = z.object({ id: z.string() });

export const createBankAccount = createServerFn({ method: "POST" })
	.inputValidator(createBankAccountSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const dataRecord = data as unknown as Record<string, unknown>;

		const { data: account, error } = await supabase
			.from("bank_accounts")
			.insert({
				church_id: data.church_id,
				bank_name: buildLocalizedJson(dataRecord, "bank_name") || {
					en: data.bank_name_en,
					am: data.bank_name_am,
				},
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
	.inputValidator(updateBankAccountSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const dataRecord = data as unknown as Record<string, unknown>;

		// biome-ignore lint/suspicious/noExplicitAny: Dynamic update object
		const updateData: any = {};
		if (hasAnyLocaleField(dataRecord, "bank_name")) {
			updateData.bank_name = buildLocalizedJson(dataRecord, "bank_name");
		}
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
	.inputValidator(deleteBankAccountSchema)
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
	.inputValidator(addChurchImageSchema)
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
	.inputValidator(deleteChurchImageSchema)
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
