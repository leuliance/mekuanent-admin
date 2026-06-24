import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	AlertCircle,
	Flag,
	Loader2,
	Pencil,
	Plus,
	ShieldAlert,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	createReportReason,
	deleteReportReason,
	getReportReasons,
	getReports,
	updateReportReason,
} from "@/api/reports";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { canDelete } from "@/lib/roles";

// biome-ignore lint/suspicious/noExplicitAny: Supabase rows are serialized to JSON.
type AnyRow = any;

const TARGET_TYPES = ["event", "donation", "content", "church"] as const;
const STATUSES = [
	"pending",
	"reviewing",
	"resolved",
	"dismissed",
	"action_taken",
] as const;

const STATUS_STYLE: Record<string, string> = {
	pending:
		"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	resolved:
		"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	dismissed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
	action_taken:
		"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

function localized(value: unknown): string {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (typeof value === "object") {
		const obj = value as Record<string, string>;
		return obj.en || obj.am || Object.values(obj)[0] || "";
	}
	return String(value);
}

export const Route = createFileRoute("/_authenticated/dashboard/reports/")({
	loader: async () => {
		const [list, reasons] = await Promise.all([
			getReports({ data: { page: 1, limit: 20 } }),
			getReportReasons(),
		]);
		return { list, reasons };
	},
	pendingComponent: () => (
		<div className="flex-1 overflow-auto p-6">
			<div className="mx-auto max-w-5xl space-y-6">
				<Skeleton className="h-8 w-40" />
				<Skeleton className="h-12 w-full rounded-lg" />
				<Skeleton className="h-96 rounded-xl" />
			</div>
		</div>
	),
	errorComponent: ({ error }: { error: Error }) => (
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
	),
	component: ReportsPage,
});

function ReportsPage() {
	const { list, reasons } = Route.useLoaderData();
	const router = useRouter();
	const { user } = Route.useRouteContext();
	const showDelete = !!user && canDelete(user.role);

	const [view, setView] = useState<"reports" | "reasons">("reports");

	// --- Reports list state ---
	const [data, setData] = useState(list as AnyRow);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let active = true;
		setLoading(true);
		getReports({
			data: {
				page,
				limit: 20,
				status: statusFilter === "all" ? undefined : (statusFilter as AnyRow),
				target_type: typeFilter === "all" ? undefined : (typeFilter as AnyRow),
			},
		})
			.then((res) => {
				if (active) setData(res);
			})
			.catch((err) =>
				toast.error(err instanceof Error ? err.message : "Failed to load"),
			)
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [statusFilter, typeFilter, page]);

	const reports = (data?.reports ?? []) as AnyRow[];

	// --- Reasons CRUD state ---
	const typedReasons = reasons as AnyRow[];
	const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
	const [reasonDeleteOpen, setReasonDeleteOpen] = useState(false);
	const [deletingReasonId, setDeletingReasonId] = useState<string | null>(null);
	const [editingReason, setEditingReason] = useState<AnyRow | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const [reasonKey, setReasonKey] = useState("");
	const [reasonTargetType, setReasonTargetType] =
		useState<(typeof TARGET_TYPES)[number]>("event");
	const [labelEn, setLabelEn] = useState("");
	const [labelAm, setLabelAm] = useState("");
	const [reasonActive, setReasonActive] = useState(true);
	const [reasonOrder, setReasonOrder] = useState("0");

	const openCreateReason = () => {
		setEditingReason(null);
		setReasonKey("");
		setReasonTargetType("event");
		setLabelEn("");
		setLabelAm("");
		setReasonActive(true);
		setReasonOrder(String(typedReasons.length));
		setReasonDialogOpen(true);
	};

	const openEditReason = (r: AnyRow) => {
		setEditingReason(r);
		setReasonKey(r.reason_key ?? "");
		setReasonTargetType(r.target_type ?? "event");
		setLabelEn((r.label as Record<string, string>)?.en ?? "");
		setLabelAm((r.label as Record<string, string>)?.am ?? "");
		setReasonActive(Boolean(r.is_active));
		setReasonOrder(String(r.sort_order ?? 0));
		setReasonDialogOpen(true);
	};

	const handleReasonSubmit = async () => {
		if (!reasonKey.trim() || !labelEn.trim()) {
			toast.error("Reason key and English label are required");
			return;
		}
		setSubmitting(true);
		try {
			const label = {
				en: labelEn.trim(),
				...(labelAm.trim() ? { am: labelAm.trim() } : {}),
			};
			if (editingReason) {
				await updateReportReason({
					data: {
						id: editingReason.id,
						label,
						is_active: reasonActive,
						sort_order: Number(reasonOrder) || 0,
					},
				});
				toast.success("Reason updated");
			} else {
				await createReportReason({
					data: {
						reason_key: reasonKey.trim(),
						target_type: reasonTargetType,
						label,
						is_active: reasonActive,
						sort_order: Number(reasonOrder) || 0,
					},
				});
				toast.success("Reason created");
			}
			setReasonDialogOpen(false);
			router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save");
		} finally {
			setSubmitting(false);
		}
	};

	const handleReasonDelete = async () => {
		if (!deletingReasonId) return;
		setSubmitting(true);
		try {
			await deleteReportReason({ data: { id: deletingReasonId } });
			toast.success("Reason deleted");
			setReasonDeleteOpen(false);
			setDeletingReasonId(null);
			router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to delete");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<div className="flex-1 overflow-auto p-6">
				<div className="mx-auto max-w-5xl space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold">Reports</h1>
							<p className="text-muted-foreground mt-1">
								Moderate user-submitted reports and manage report reasons
							</p>
						</div>
						<div className="flex rounded-lg border p-0.5">
							<button
								type="button"
								onClick={() => setView("reports")}
								className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
									view === "reports"
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								Reports
							</button>
							<button
								type="button"
								onClick={() => setView("reasons")}
								className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
									view === "reasons"
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								Reasons
							</button>
						</div>
					</div>

					{view === "reports" ? (
						<>
							<div className="flex flex-wrap items-center gap-3">
								<Select
									value={statusFilter}
									onValueChange={(v) => {
										setPage(1);
										setStatusFilter(v ?? "all");
									}}
								>
									<SelectTrigger className="w-44">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All statuses</SelectItem>
										{STATUSES.map((s) => (
											<SelectItem key={s} value={s} className="capitalize">
												{s.replace("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select
									value={typeFilter}
									onValueChange={(v) => {
										setPage(1);
										setTypeFilter(v ?? "all");
									}}
								>
									<SelectTrigger className="w-44">
										<SelectValue placeholder="Target type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All targets</SelectItem>
										{TARGET_TYPES.map((t) => (
											<SelectItem key={t} value={t} className="capitalize">
												{t}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{loading && (
									<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								)}
							</div>

							{reports.length === 0 ? (
								<div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
									<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
										<Flag className="h-7 w-7 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-1">No reports</h3>
									<p className="text-sm text-muted-foreground max-w-sm">
										There are no reports matching the current filters.
									</p>
								</div>
							) : (
								<div className="rounded-xl border bg-card overflow-hidden">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Target</TableHead>
												<TableHead>Reason</TableHead>
												<TableHead>Reporter</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Date</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{reports.map((r) => (
												<TableRow key={r.id}>
													<TableCell>
														<Link
															to="/dashboard/reports/$reportId"
															params={{ reportId: r.id }}
															className="font-medium capitalize hover:underline"
														>
															{r.target_type}
														</Link>
													</TableCell>
													<TableCell>
														{localized(r.reason_label) || (
															<span className="font-mono text-xs text-muted-foreground">
																{r.reason_key}
															</span>
														)}
													</TableCell>
													<TableCell className="text-sm">
														{r.reporter
															? `${r.reporter.first_name ?? ""} ${
																	r.reporter.last_name ?? ""
																}`.trim() ||
																r.reporter.email ||
																"—"
															: "—"}
													</TableCell>
													<TableCell>
														<span
															className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
																STATUS_STYLE[r.status] ?? "bg-muted"
															}`}
														>
															{r.status.replace("_", " ")}
														</span>
													</TableCell>
													<TableCell className="text-sm text-muted-foreground">
														{format(new Date(r.created_at), "MMM d, yyyy")}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
									<div className="flex items-center justify-between border-t p-3 text-sm">
										<span className="text-muted-foreground">
											{data.total} total · Page {data.page} of {data.totalPages}
										</span>
										<div className="flex gap-1">
											<Button
												variant="outline"
												size="sm"
												disabled={page <= 1 || loading}
												onClick={() => setPage((p) => p - 1)}
											>
												Previous
											</Button>
											<Button
												variant="outline"
												size="sm"
												disabled={page >= data.totalPages || loading}
												onClick={() => setPage((p) => p + 1)}
											>
												Next
											</Button>
										</div>
									</div>
								</div>
							)}
						</>
					) : (
						<>
							<div className="flex justify-end">
								<Button size="sm" onClick={openCreateReason}>
									<Plus className="h-4 w-4 mr-1.5" />
									Add Reason
								</Button>
							</div>
							{typedReasons.length === 0 ? (
								<div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
									<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
										<ShieldAlert className="h-7 w-7 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-1">No reasons</h3>
									<p className="text-sm text-muted-foreground max-w-sm mb-4">
										Add report reasons per target type for users to choose from.
									</p>
									<Button onClick={openCreateReason}>
										<Plus className="h-4 w-4 mr-1.5" />
										Create Reason
									</Button>
								</div>
							) : (
								<div className="rounded-xl border bg-card overflow-hidden">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Label</TableHead>
												<TableHead>Target</TableHead>
												<TableHead>Key</TableHead>
												<TableHead>Active</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{typedReasons.map((r) => (
												<TableRow key={r.id}>
													<TableCell className="font-medium">
														{localized(r.label)}
													</TableCell>
													<TableCell className="capitalize">
														{r.target_type}
													</TableCell>
													<TableCell className="font-mono text-xs text-muted-foreground">
														{r.reason_key}
													</TableCell>
													<TableCell>
														{r.is_active ? (
															<span className="text-green-600">Active</span>
														) : (
															<span className="text-muted-foreground">
																Inactive
															</span>
														)}
													</TableCell>
													<TableCell className="text-right">
														<div className="flex items-center justify-end gap-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => openEditReason(r)}
															>
																<Pencil className="h-3.5 w-3.5" />
															</Button>
															{showDelete && (
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-8 w-8 text-destructive hover:text-destructive"
																	onClick={() => {
																		setDeletingReasonId(r.id);
																		setReasonDeleteOpen(true);
																	}}
																>
																	<Trash2 className="h-3.5 w-3.5" />
																</Button>
															)}
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Create / Edit Reason Dialog */}
			<Dialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingReason ? "Edit" : "Create"} Report Reason
						</DialogTitle>
						<DialogDescription>
							Reasons are grouped per target type.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Reason Key *</Label>
								<Input
									value={reasonKey}
									disabled={!!editingReason}
									onChange={(e) =>
										setReasonKey(
											e.target.value.toLowerCase().replace(/\s+/g, "_"),
										)
									}
									placeholder="e.g. spam"
									className="font-mono"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Target Type</Label>
								<Select
									value={reasonTargetType}
									onValueChange={(v) =>
										setReasonTargetType(v as (typeof TARGET_TYPES)[number])
									}
									disabled={!!editingReason}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{TARGET_TYPES.map((t) => (
											<SelectItem key={t} value={t} className="capitalize">
												{t}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Label (English) *</Label>
								<Input
									value={labelEn}
									onChange={(e) => setLabelEn(e.target.value)}
									placeholder="Spam or misleading"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Label (Amharic)</Label>
								<Input
									value={labelAm}
									onChange={(e) => setLabelAm(e.target.value)}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Sort Order</Label>
								<Input
									type="number"
									value={reasonOrder}
									onChange={(e) => setReasonOrder(e.target.value)}
								/>
							</div>
							<div className="flex items-end gap-2 pb-2">
								<Switch
									checked={reasonActive}
									onCheckedChange={setReasonActive}
								/>
								<Label className="text-xs">Active</Label>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setReasonDialogOpen(false)}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button onClick={handleReasonSubmit} disabled={submitting}>
							{submitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									{editingReason ? "Saving..." : "Creating..."}
								</>
							) : editingReason ? (
								"Save"
							) : (
								"Create"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Reason Dialog */}
			<Dialog open={reasonDeleteOpen} onOpenChange={setReasonDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Reason</DialogTitle>
						<DialogDescription>This cannot be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setReasonDeleteOpen(false)}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleReasonDelete}
							disabled={submitting}
						>
							{submitting ? (
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
