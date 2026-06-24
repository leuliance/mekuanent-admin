import { useForm } from "@tanstack/react-form";
import {
	createFileRoute,
	Link,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, CalendarIcon, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { type ChurchCategory, createChurch } from "@/api/churches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LOCALES } from "@/stores/locale-store";

// ============ HELPERS ============

/** Extract a human-readable message from any TanStack Form error value. */
function getErrorMessage(error: unknown): string {
	if (!error) return "";
	if (typeof error === "string") return error;
	if (typeof error === "object" && error !== null) {
		// TanStack Form + Zod wraps errors as { message: string, ... }
		if ("message" in error) {
			const msg = (error as Record<string, unknown>).message;
			if (typeof msg === "string") return msg;
		}
		// Array of issues from Zod
		if (
			"issues" in error &&
			Array.isArray((error as Record<string, unknown>).issues)
		) {
			const issues = (error as { issues: Array<{ message: string }> }).issues;
			return issues[0]?.message || "";
		}
	}
	// Last resort – avoid [object Object]
	try {
		const str = JSON.stringify(error);
		if (str && str !== "{}") return str;
	} catch {
		// ignore
	}
	return "";
}

/** Render the first error for a field, if any. */
function FieldError({ errors }: { errors: unknown[] }) {
	if (!errors || errors.length === 0) return null;
	const msg = getErrorMessage(errors[0]);
	if (!msg) return null;
	return <p className="text-xs text-destructive">{msg}</p>;
}

// ============ SCHEMA ============
const createChurchFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	language: z.enum(["en", "am", "or", "ti", "so"]),
	category: z.enum(["church", "monastery", "female-monastery"]),
	phone_number: z.string().min(1, "Phone number is required"),
	email: z
		.string()
		.refine(
			(val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
			"Please enter a valid email address",
		),
	website: z.string(),
	city: z.string(),
	address: z.string(),
	country: z.string(),
	founded_year: z.string(),
});

export const Route = createFileRoute("/_authenticated/dashboard/churches/new/")(
	{
		component: NewChurchPage,
	},
);

// ============ SECTION CARD ============
function SectionCard({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-xl border bg-card p-5">
			<h2 className="text-sm font-semibold text-foreground mb-4">{title}</h2>
			{children}
		</div>
	);
}

// ============ YEAR PICKER ============
function YearPicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (year: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const currentYear = new Date().getFullYear();

	// Generate years from 100 AD to current year
	const years: number[] = [];
	for (let y = currentYear; y >= 100; y--) {
		years.push(y);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="outline"
						data-empty={!value}
						className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
					/>
				}
				nativeButton={false}
			>
				{value ? `Year ${value}` : "Select year"}
				<CalendarIcon className="h-4 w-4 opacity-50" />
			</PopoverTrigger>
			<PopoverContent className="w-[220px] p-0" align="start">
				<div className="flex flex-col">
					<div className="px-3 py-2 border-b">
						<Input
							placeholder="Search year..."
							value={value}
							onChange={(e) => {
								const v = e.target.value.replace(/\D/g, "").slice(0, 4);
								onChange(v);
							}}
							className="h-8"
						/>
					</div>
					<div className="max-h-[200px] overflow-y-auto p-1">
						{years
							.filter((y) => !value || String(y).includes(value))
							.slice(0, 100)
							.map((year) => (
								<button
									key={year}
									type="button"
									className={`w-full px-3 py-1.5 text-sm text-left rounded-md hover:bg-accent transition-colors ${
										value === String(year)
											? "bg-primary text-primary-foreground hover:bg-primary/90"
											: ""
									}`}
									onClick={() => {
										onChange(String(year));
										setOpen(false);
									}}
								>
									{year}
								</button>
							))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

// ============ MAIN PAGE ============
function NewChurchPage() {
	const navigate = useNavigate();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm({
		defaultValues: {
			name: "",
			description: "",
			language: "en" as "en" | "am" | "or" | "ti" | "so",
			category: "church" as ChurchCategory,
			phone_number: "",
			email: "",
			website: "",
			city: "",
			address: "",
			country: "",
			founded_year: "",
		},
		validators: {
			onBlur: createChurchFormSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				await createChurch({
					data: {
						name: value.name,
						description: value.description,
						language: value.language,
						category: value.category,
						phone_number: value.phone_number,
						email: value.email || undefined,
						website: value.website || undefined,
						city: value.city || undefined,
						address: value.address || undefined,
						country: value.country || undefined,
						founded_year: value.founded_year
							? Number(value.founded_year)
							: undefined,
					},
				});
				router.invalidate();
				navigate({
					to: "/dashboard/churches",
					search: {
						status: undefined,
						category: undefined,
						page: 1,
						search: undefined,
					},
				});
			} catch (error) {
				console.error("Failed to create church:", error);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	// Check if all required fields are filled
	const hasRequiredFields =
		!!form.state.values.name &&
		!!form.state.values.description &&
		!!form.state.values.phone_number &&
		!!form.state.values.category;

	return (
		<div className="flex-1 overflow-auto p-6">
			<div className="max-w-3xl mx-auto space-y-6">
				<Button
					variant="ghost"
					size="sm"
					render={
						<Link
							to="/dashboard/churches"
							search={{
								status: undefined,
								category: undefined,
								page: 1,
								search: undefined,
							}}
						/>
					}
					nativeButton={false}
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Churches
				</Button>

				<div>
					<h1 className="text-2xl font-bold tracking-tight">Add New Church</h1>
					<p className="text-muted-foreground mt-1">
						Fill in the church details. Fields marked with * are required in
						English and Amharic.
					</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-8"
				>
					{/* Name & Language Section */}
					<SectionCard title="Church Name *">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<form.Field name="name">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Name *</Label>
										<Input
											placeholder="Church name"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
										/>
										<FieldError errors={field.state.meta.errors} />
									</div>
								)}
							</form.Field>
							<form.Field name="language">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Language *</Label>
										<Select
											value={field.state.value}
											onValueChange={(v) =>
												field.handleChange(
													(v || "en") as "en" | "am" | "or" | "ti" | "so",
												)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{LOCALES.map((loc) => (
													<SelectItem key={loc.value} value={loc.value}>
														{loc.nativeLabel}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>
						</div>
					</SectionCard>

					{/* Category & Contact */}
					<SectionCard title="Basic Information">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<form.Field name="category">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Category *</Label>
										<Select
											value={field.state.value}
											onValueChange={(v) =>
												field.handleChange(v as ChurchCategory)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="church">Church</SelectItem>
												<SelectItem value="monastery">Monastery</SelectItem>
												<SelectItem value="female-monastery">
													Female Monastery
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>
							<form.Field name="phone_number">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Phone Number *</Label>
										<PhoneInput
											defaultCountry="ET"
											value={field.state.value}
											onChange={(val) => field.handleChange(val || "")}
											onBlur={field.handleBlur}
										/>
										<FieldError errors={field.state.meta.errors} />
									</div>
								)}
							</form.Field>
							<form.Field name="email">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Email</Label>
										<Input
											type="email"
											placeholder="email@example.com"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
										/>
										<FieldError errors={field.state.meta.errors} />
									</div>
								)}
							</form.Field>
							<form.Field name="website">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Website</Label>
										<Input
											placeholder="https://..."
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="founded_year">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Founded Year</Label>
										<YearPicker
											value={field.state.value}
											onChange={(year) => field.handleChange(year)}
										/>
									</div>
								)}
							</form.Field>
						</div>
					</SectionCard>

					{/* Description */}
					<SectionCard title="Description *">
						<form.Field name="description">
							{(field) => (
								<div className="space-y-1.5">
									<RichTextEditor
										value={field.state.value}
										onChange={(html) => field.handleChange(html)}
										placeholder="Describe the church..."
									/>
									<FieldError errors={field.state.meta.errors} />
								</div>
							)}
						</form.Field>
					</SectionCard>

					{/* Location */}
					<SectionCard title="Location">
						<div className="grid grid-cols-1 gap-3">
							<form.Field name="city">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">City</Label>
										<Input
											placeholder="City"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="address">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Address</Label>
										<Input
											placeholder="Address"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="country">
								{(field) => (
									<div className="space-y-1.5">
										<Label className="text-xs">Country</Label>
										<Input
											placeholder="Country"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</div>
								)}
							</form.Field>
						</div>
					</SectionCard>

					{/* Submit */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							render={
								<Link
									to="/dashboard/churches"
									search={{
										status: undefined,
										category: undefined,
										page: 1,
										search: undefined,
									}}
								/>
							}
							nativeButton={false}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting || !hasRequiredFields}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Create Church
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
