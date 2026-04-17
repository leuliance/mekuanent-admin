import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	AlertCircle,
	Calendar,
	DollarSign,
	Loader2,
	MapPin,
	Pencil,
	Plus,
	Tags,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	createDonationCategory,
	createEventCategory,
	createRegionCategory,
	deleteDonationCategory,
	deleteEventCategory,
	deleteRegionCategory,
	getDonationCategories,
	getEventCategories,
	getRegionCategories,
	updateDonationCategory,
	updateEventCategory,
	updateRegionCategory,
} from "@/api/categories";
import { ResponsiveTabs } from "@/components/responsive-tabs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { canDelete } from "@/lib/roles";
import { useLocaleStore } from "@/stores/locale-store";

export const Route = createFileRoute("/_authenticated/dashboard/categories/")({
	loader: async () => {
		const [eventCategories, donationCategories, regionCategories] =
			await Promise.all([
				getEventCategories(),
				getDonationCategories(),
				getRegionCategories(),
			]);
		return { eventCategories, donationCategories, regionCategories };
	},
	pendingComponent: () => (
		<>
			<div className="flex-1 overflow-auto p-6">
				<div className="max-w-4xl mx-auto space-y-6">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-96 rounded-xl" />
				</div>
			</div>
		</>
	),
	errorComponent: ({ error }: { error: Error }) => (
		<>
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="text-center max-w-md">
					<div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
						<AlertCircle className="w-8 h-8 text-destructive" />
					</div>
					<h2 className="text-xl font-semibold mb-2">Failed to Load</h2>
					<p className="text-muted-foreground mb-4">{error.message}</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</div>
			</div>
		</>
	),
	component: CategoriesPage,
});

// Helper to safely get localized text from unknown typed data
function safeLocalizedText(data: unknown, locale: string): string {
	if (!data) return "";
	if (typeof data === "string") return data;
	if (typeof data === "object" && data !== null) {
		const obj = data as Record<string, string>;
		return obj[locale] || obj.en || obj.am || Object.values(obj)[0] || "";
	}
	return String(data);
}

function CategoriesPage() {
	const { eventCategories, donationCategories, regionCategories } =
		Route.useLoaderData();
	const { locale } = useLocaleStore();
	const router = useRouter();
	const { user } = Route.useRouteContext();
	const showDelete = !!user && canDelete(user.role);
	const [categoryTab, setCategoryTab] = useState("event");

	// biome-ignore lint/suspicious/noExplicitAny: Dynamic data
	const typedEventCats = eventCategories as any[];
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic data
	const typedDonationCats = donationCategories as any[];
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic data
	const typedRegionCats = regionCategories as any[];

	// --- Generic category dialog state ---
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Record<
		string,
		unknown
	> | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [categoryType, setCategoryType] = useState<"event" | "donation">(
		"event",
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [nameEn, setNameEn] = useState("");
	const [nameAm, setNameAm] = useState("");
	const [descEn, setDescEn] = useState("");
	const [descAm, setDescAm] = useState("");
	const [icon, setIcon] = useState("");
	const [color, setColor] = useState("#6366f1");

	// --- Region category dialog state ---
	const [regionDialogOpen, setRegionDialogOpen] = useState(false);
	const [editingRegion, setEditingRegion] = useState<Record<
		string,
		unknown
	> | null>(null);
	const [regionDeleteDialogOpen, setRegionDeleteDialogOpen] = useState(false);
	const [deletingRegionId, setDeletingRegionId] = useState<string | null>(null);

	const [regionNameEn, setRegionNameEn] = useState("");
	const [regionNameAm, setRegionNameAm] = useState("");
	const [regionSlug, setRegionSlug] = useState("");
	const [regionDescEn, setRegionDescEn] = useState("");
	const [regionDescAm, setRegionDescAm] = useState("");
	const [regionColorStart, setRegionColorStart] = useState("#6366f1");
	const [regionColorEnd, setRegionColorEnd] = useState("#8b5cf6");
	const [regionOrder, setRegionOrder] = useState(0);
	const [regionActive, setRegionActive] = useState(true);

	// --- Generic category handlers ---
	const openCreate = (type: "event" | "donation") => {
		setCategoryType(type);
		setEditingCategory(null);
		resetForm();
		setDialogOpen(true);
	};

	const openEdit = (
		cat: Record<string, unknown>,
		type: "event" | "donation",
	) => {
		setCategoryType(type);
		setEditingCategory(cat);
		const name = cat.name as Record<string, string> | null;
		const desc = cat.description as Record<string, string> | null;
		setNameEn(name?.en || "");
		setNameAm(name?.am || "");
		setDescEn(desc?.en || "");
		setDescAm(desc?.am || "");
		setIcon((cat.icon as string) || "");
		setColor((cat.color as string) || "#6366f1");
		setDialogOpen(true);
	};

	const resetForm = () => {
		setNameEn("");
		setNameAm("");
		setDescEn("");
		setDescAm("");
		setIcon("");
		setColor("#6366f1");
	};

	const handleSubmit = async () => {
		if (!nameEn.trim()) {
			toast.error("English name is required");
			return;
		}
		setIsSubmitting(true);
		try {
			const payload = {
				name: { en: nameEn.trim(), am: nameAm.trim() || nameEn.trim() },
				description: { en: descEn.trim(), am: descAm.trim() || descEn.trim() },
				icon: icon.trim() || null,
				color: color || null,
			};
			if (editingCategory) {
				if (categoryType === "event")
					await updateEventCategory({
						data: { id: editingCategory.id as string, ...payload },
					});
				else
					await updateDonationCategory({
						data: { id: editingCategory.id as string, ...payload },
					});
				toast.success("Category updated");
			} else {
				if (categoryType === "event")
					await createEventCategory({ data: payload });
				else await createDonationCategory({ data: payload });
				toast.success("Category created");
			}
			setDialogOpen(false);
			resetForm();
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!deletingId) return;
		setIsSubmitting(true);
		try {
			if (categoryType === "event")
				await deleteEventCategory({ data: { id: deletingId } });
			else await deleteDonationCategory({ data: { id: deletingId } });
			toast.success("Category deleted");
			setDeleteDialogOpen(false);
			setDeletingId(null);
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// --- Region category handlers ---
	const openRegionCreate = () => {
		setEditingRegion(null);
		setRegionNameEn("");
		setRegionNameAm("");
		setRegionSlug("");
		setRegionDescEn("");
		setRegionDescAm("");
		setRegionColorStart("#6366f1");
		setRegionColorEnd("#8b5cf6");
		setRegionOrder(typedRegionCats.length);
		setRegionActive(true);
		setRegionDialogOpen(true);
	};

	const openRegionEdit = (r: Record<string, unknown>) => {
		setEditingRegion(r);
		const dn = r.display_name as Record<string, string> | null;
		const desc = r.description as Record<string, string> | null;
		setRegionNameEn(dn?.en || "");
		setRegionNameAm(dn?.am || "");
		setRegionSlug((r.slug as string) || "");
		setRegionDescEn(desc?.en || "");
		setRegionDescAm(desc?.am || "");
		setRegionColorStart((r.color_start as string) || "#6366f1");
		setRegionColorEnd((r.color_end as string) || "#8b5cf6");
		setRegionOrder((r.display_order as number) || 0);
		setRegionActive(Boolean(r.is_active));
		setRegionDialogOpen(true);
	};

	const handleRegionSubmit = async () => {
		if (!regionNameEn.trim() || !regionSlug.trim()) {
			toast.error("Name and slug are required");
			return;
		}
		setIsSubmitting(true);
		try {
			if (editingRegion) {
				await updateRegionCategory({
					data: {
						id: editingRegion.id as string,
						display_name: {
							en: regionNameEn.trim(),
							am: regionNameAm.trim() || regionNameEn.trim(),
						},
						description: regionDescEn.trim()
							? {
									en: regionDescEn.trim(),
									am: regionDescAm.trim() || regionDescEn.trim(),
								}
							: undefined,
						color_start: regionColorStart,
						color_end: regionColorEnd,
						display_order: regionOrder,
						is_active: regionActive,
					},
				});
				toast.success("Region updated");
			} else {
				await createRegionCategory({
					data: {
						name: regionSlug.trim(),
						slug: regionSlug.trim().toLowerCase().replace(/\s+/g, "-"),
						display_name: {
							en: regionNameEn.trim(),
							am: regionNameAm.trim() || regionNameEn.trim(),
						},
						description: regionDescEn.trim()
							? {
									en: regionDescEn.trim(),
									am: regionDescAm.trim() || regionDescEn.trim(),
								}
							: undefined,
						color_start: regionColorStart,
						color_end: regionColorEnd,
						display_order: regionOrder,
						is_active: regionActive,
					},
				});
				toast.success("Region created");
			}
			setRegionDialogOpen(false);
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRegionDelete = async () => {
		if (!deletingRegionId) return;
		setIsSubmitting(true);
		try {
			await deleteRegionCategory({ data: { id: deletingRegionId } });
			toast.success("Region deleted");
			setRegionDeleteDialogOpen(false);
			setDeletingRegionId(null);
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderCategoryList = (
		categories: Record<string, unknown>[],
		type: "event" | "donation",
	) => {
		if (categories.length === 0)
			return (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
					<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
						<Tags className="h-7 w-7 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-1">No categories</h3>
					<p className="text-sm text-muted-foreground max-w-sm mb-4">
						Create categories to organize your{" "}
						{type === "event" ? "events" : "donation campaigns"}.
					</p>
					<Button onClick={() => openCreate(type)}>
						<Plus className="h-4 w-4 mr-1.5" />
						Create Category
					</Button>
				</div>
			);

		return (
			<div className="rounded-xl border bg-card overflow-hidden">
				<div className="divide-y">
					{categories.map((cat) => (
						<div
							key={cat.id as string}
							className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
						>
							<div className="flex items-center gap-3 min-w-0 flex-1">
								<div
									className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[10px] font-bold leading-none text-white"
									style={{
										backgroundColor: (cat.color as string) || "#6366f1",
									}}
								>
									<span className="block max-w-full truncate text-center">
										{(() => {
											const raw = (cat.icon as string)?.trim();
											if (raw && [...raw].length > 0) return [...raw][0];
											const letter =
												safeLocalizedText(cat.name, locale)?.[0]?.toUpperCase();
											return letter || "?";
										})()}
									</span>
								</div>
								<div className="min-w-0">
									<p className="font-medium text-sm truncate">
										{String(safeLocalizedText(cat.name, locale))}
									</p>
									{!!cat.description && (
										<p className="text-xs text-muted-foreground truncate">
											{String(safeLocalizedText(cat.description, locale))}
										</p>
									)}
								</div>
							</div>
							<div className="flex items-center gap-1 shrink-0">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={() => openEdit(cat, type)}
								>
									<Pencil className="h-3.5 w-3.5" />
								</Button>
								{showDelete && (
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-destructive hover:text-destructive"
										onClick={() => {
											setCategoryType(type);
											setDeletingId(cat.id as string);
											setDeleteDialogOpen(true);
										}}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="flex-1 overflow-auto p-6">
				<div className="max-w-4xl mx-auto space-y-6">
					<div>
						<h1 className="text-2xl font-bold">Categories</h1>
						<p className="text-muted-foreground mt-1">
							Manage event, donation, and region categories
						</p>
					</div>

					<ResponsiveTabs
						value={categoryTab}
						onValueChange={setCategoryTab}
						selectPlaceholder="Category type"
						listClassName="flex w-full flex-wrap gap-1"
						items={[
							{
								value: "event",
								label: `Events (${typedEventCats.length})`,
								trigger: (
									<>
										<Calendar className="h-4 w-4 mr-1.5" />
										Events ({typedEventCats.length})
									</>
								),
							},
							{
								value: "donation",
								label: `Donations (${typedDonationCats.length})`,
								trigger: (
									<>
										<DollarSign className="h-4 w-4 mr-1.5" />
										Donations ({typedDonationCats.length})
									</>
								),
							},
							{
								value: "region",
								label: `Regions (${typedRegionCats.length})`,
								trigger: (
									<>
										<MapPin className="h-4 w-4 mr-1.5" />
										Regions ({typedRegionCats.length})
									</>
								),
							},
						]}
					>
						<TabsContent value="event" className="mt-4 space-y-4">
							<div className="flex justify-end">
								<Button size="sm" onClick={() => openCreate("event")}>
									<Plus className="h-4 w-4 mr-1.5" />
									Add Event Category
								</Button>
							</div>
							{renderCategoryList(typedEventCats, "event")}
						</TabsContent>

						<TabsContent value="donation" className="mt-4 space-y-4">
							<div className="flex justify-end">
								<Button size="sm" onClick={() => openCreate("donation")}>
									<Plus className="h-4 w-4 mr-1.5" />
									Add Donation Category
								</Button>
							</div>
							{renderCategoryList(typedDonationCats, "donation")}
						</TabsContent>

						<TabsContent value="region" className="mt-4 space-y-4">
							<div className="flex justify-end">
								<Button size="sm" onClick={openRegionCreate}>
									<Plus className="h-4 w-4 mr-1.5" />
									Add Region
								</Button>
							</div>
							{typedRegionCats.length === 0 ? (
								<div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
									<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
										<MapPin className="h-7 w-7 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-1">No regions</h3>
									<p className="text-sm text-muted-foreground max-w-sm mb-4">
										Add regions to categorize churches by location.
									</p>
									<Button onClick={openRegionCreate}>
										<Plus className="h-4 w-4 mr-1.5" />
										Create Region
									</Button>
								</div>
							) : (
								<div className="rounded-xl border bg-card overflow-hidden">
									<div className="divide-y">
										{typedRegionCats.map((r: any) => (
											<div
												key={r.id}
												className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
											>
												<div className="flex items-center gap-3 min-w-0 flex-1">
													<div
														className="h-8 w-16 rounded-lg shrink-0"
														style={{
															background: `linear-gradient(135deg, ${r.color_start}, ${r.color_end})`,
														}}
													/>
													<div className="min-w-0">
														<div className="flex items-center gap-2">
															<p className="font-medium text-sm truncate">
																{safeLocalizedText(r.display_name, locale)}
															</p>
															<code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
																{r.slug}
															</code>
															{!r.is_active && (
																<span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
																	Inactive
																</span>
															)}
														</div>
														{r.description && (
															<p className="text-xs text-muted-foreground truncate">
																{safeLocalizedText(r.description, locale)}
															</p>
														)}
														<p className="text-[10px] text-muted-foreground">
															Order: {r.display_order}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-1 shrink-0">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														onClick={() => openRegionEdit(r)}
													>
														<Pencil className="h-3.5 w-3.5" />
													</Button>
													{showDelete && (
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-destructive hover:text-destructive"
															onClick={() => {
																setDeletingRegionId(r.id);
																setRegionDeleteDialogOpen(true);
															}}
														>
															<Trash2 className="h-3.5 w-3.5" />
														</Button>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</TabsContent>
					</ResponsiveTabs>
				</div>
			</div>

			{/* Create/Edit Event/Donation Category Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingCategory ? "Edit" : "Create"}{" "}
							{categoryType === "event" ? "Event" : "Donation"} Category
						</DialogTitle>
						<DialogDescription>
							{editingCategory
								? "Update the category details."
								: "Add a new category."}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Name (English) *</Label>
								<Input
									value={nameEn}
									onChange={(e) => setNameEn(e.target.value)}
									placeholder="English name"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Name (Amharic)</Label>
								<Input
									value={nameAm}
									onChange={(e) => setNameAm(e.target.value)}
									placeholder="የአማርኛ ስም"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Description (English)</Label>
								<Input
									value={descEn}
									onChange={(e) => setDescEn(e.target.value)}
									placeholder="Brief description"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Description (Amharic)</Label>
								<Input
									value={descAm}
									onChange={(e) => setDescAm(e.target.value)}
									placeholder="አጭር መግለጫ"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Icon (emoji)</Label>
								<Input
									value={icon}
									onChange={(e) => setIcon(e.target.value)}
									placeholder="e.g. 🎉"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Color</Label>
								<div className="flex items-center gap-2">
									<input
										type="color"
										value={color}
										onChange={(e) => setColor(e.target.value)}
										className="h-9 w-12 rounded border cursor-pointer"
									/>
									<Input
										value={color}
										onChange={(e) => setColor(e.target.value)}
										className="flex-1 font-mono text-xs"
									/>
								</div>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDialogOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting || !nameEn.trim()}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									{editingCategory ? "Saving..." : "Creating..."}
								</>
							) : editingCategory ? (
								"Save"
							) : (
								"Create"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Event/Donation Category Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Category</DialogTitle>
						<DialogDescription>
							This may affect items using this category.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Create/Edit Region Category Dialog */}
			<Dialog open={regionDialogOpen} onOpenChange={setRegionDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingRegion ? "Edit" : "Create"} Region
						</DialogTitle>
						<DialogDescription>
							{editingRegion
								? "Update region details."
								: "Add a new region category."}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Name (English) *</Label>
								<Input
									value={regionNameEn}
									onChange={(e) => setRegionNameEn(e.target.value)}
									placeholder="English name"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Name (Amharic)</Label>
								<Input
									value={regionNameAm}
									onChange={(e) => setRegionNameAm(e.target.value)}
									placeholder="የአማርኛ ስም"
								/>
							</div>
						</div>
						{!editingRegion && (
							<div className="space-y-1.5">
								<Label className="text-xs">Slug *</Label>
								<Input
									value={regionSlug}
									onChange={(e) =>
										setRegionSlug(
											e.target.value
												.toLowerCase()
												.replace(/\s+/g, "-")
												.replace(/[^a-z0-9-]/g, ""),
										)
									}
									placeholder="e.g. addis-ababa"
									className="font-mono"
								/>
							</div>
						)}
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Description (English)</Label>
								<Input
									value={regionDescEn}
									onChange={(e) => setRegionDescEn(e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Description (Amharic)</Label>
								<Input
									value={regionDescAm}
									onChange={(e) => setRegionDescAm(e.target.value)}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Gradient Start</Label>
								<div className="flex items-center gap-2">
									<input
										type="color"
										value={regionColorStart}
										onChange={(e) => setRegionColorStart(e.target.value)}
										className="h-9 w-12 rounded border cursor-pointer"
									/>
									<Input
										value={regionColorStart}
										onChange={(e) => setRegionColorStart(e.target.value)}
										className="flex-1 font-mono text-xs"
									/>
								</div>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Gradient End</Label>
								<div className="flex items-center gap-2">
									<input
										type="color"
										value={regionColorEnd}
										onChange={(e) => setRegionColorEnd(e.target.value)}
										className="h-9 w-12 rounded border cursor-pointer"
									/>
									<Input
										value={regionColorEnd}
										onChange={(e) => setRegionColorEnd(e.target.value)}
										className="flex-1 font-mono text-xs"
									/>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Display Order</Label>
								<Input
									type="number"
									value={regionOrder}
									onChange={(e) => setRegionOrder(Number(e.target.value))}
								/>
							</div>
							<div className="space-y-1.5 flex items-end">
								<div className="flex items-center gap-2 pb-2">
									<Switch
										checked={regionActive}
										onCheckedChange={setRegionActive}
									/>
									<Label className="text-xs">Active</Label>
								</div>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setRegionDialogOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							onClick={handleRegionSubmit}
							disabled={
								isSubmitting ||
								!regionNameEn.trim() ||
								(!editingRegion && !regionSlug.trim())
							}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									{editingRegion ? "Saving..." : "Creating..."}
								</>
							) : editingRegion ? (
								"Save"
							) : (
								"Create"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Region Dialog */}
			<Dialog
				open={regionDeleteDialogOpen}
				onOpenChange={setRegionDeleteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Region</DialogTitle>
						<DialogDescription>
							Churches using this region may be affected.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setRegionDeleteDialogOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleRegionDelete}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
