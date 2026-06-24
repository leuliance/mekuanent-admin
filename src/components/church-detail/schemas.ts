import { z } from "zod";

export const churchEditSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	language: z.enum(["en", "am", "or", "ti", "so"]),
	category: z.enum(["church", "monastery", "female-monastery"]),
	phone_number: z.string().min(1, "Phone number is required"),
	email: z.string(),
	website: z.string(),
	city: z.string(),
	address: z.string(),
	country: z.string(),
	founded_year: z.string(),
});

export const bankAccountSchema = z.object({
	bank_name: z.string().min(1, "Bank name is required"),
	account_number: z.string().min(1, "Account number is required"),
	account_holder_name: z.string().min(1, "Account holder name is required"),
	branch_name: z.string(),
	swift_code: z.string(),
	is_primary: z.boolean(),
});
