import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { differenceInCalendarDays, format } from "date-fns";
import {
	AlertCircle,
	ArrowLeft,
	CalendarRange,
	Loader2,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	createFastingOccurrence,
	deleteFastingOccurrence,
	getFastingPeriod,
	updateFastingOccurrence,
} from "@/api/fasting";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	formatEthiopian,
	gregorianToEthiopian,
	parseISODate,
	toISODate,
} from "@/lib/ethiopian-date";
import { canDelete } from "@/lib/roles";

// biome-ignore lint/suspicious/noExplicitAny: Supabase rows are serialized to JSON.
type Occurrence = any;

function localized(value: unknown): string {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (typeof value === "object") {
		const obj = value as Record<string, string>;
		return obj.am || obj.en || Object.values(obj)[0] || "";
	}
	return String(value);
}

export const Route = createFileRoute(
	"/_authenticated/dashboard/fasting/$fastingId/",
)({
	loader: async ({ params }) => {
		return await getFastingPeriod({ data: { id: params.fastingId } });
	},
	pendingComponent: () => (
		<div className="flex-1 overflow-auto p-6">
			<div className="mx-auto max-w-4xl space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-32 rounded-xl" />
				<Skeleton className="h-72 rounded-xl" />
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
				<Link to="/dashboard/fasting">
					<Button variant="outline">Back to Fasting Calendar</Button>
				</Link>
			</div>
		</div>
	),
	component: FastingDetailPage,
});

function FastingDetailPage() {
	const { period, occurrences } = Route.useLoaderData() as {
		period: Occurrence;
		occurrences: Occurrence[];
	};
	const router = useRouter();
	const { user } = Route.useRouteContext();
	const showDelete = !!user && canDelete(user.role);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [editing, setEditing] = useState<Occurrence | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const [ethYear, setEthYear] = useState("");
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);

	const resetForm = () => {
		setEthYear("");
		setStartDate(undefined);
		setEndDate(undefined);
	};

	const openCreate = () => {
		setEditing(null);
		resetForm();
		setDialogOpen(true);
	};

	const openEdit = (o: Occurrence) => {
		setEditing(o);
		setEthYear(String(o.ethiopian_year ?? ""));
		setStartDate(
			o.start_gregorian_date ? parseISODate(o.start_gregorian_date) : undefined,
		);
		setEndDate(
			o.end_gregorian_date ? parseISODate(o.end_gregorian_date) : undefined,
		);
		setDialogOpen(true);
	};

	// Keep the Ethiopian year in sync with the chosen start date for convenience.
	const handleStartChange = (d: Date | undefined) => {
		setStartDate(d);
		if (d && !ethYear) setEthYear(String(gregorianToEthiopian(d).year));
	};

	const duration =
		startDate && endDate
			? differenceInCalendarDays(endDate, startDate) + 1
			: null;

	const datesValid =
		!!startDate && !!endDate && endDate.getTime() >= startDate.getTime();
	const canSubmit = !!Number(ethYear) && datesValid && !submitting;

	const handleSubmit = async () => {
		const year = Number(ethYear);
		if (!year) {
			toast.error("Ethiopian year is required");
			return;
		}
		if (!startDate || !endDate) {
			toast.error("Pick a start and end date");
			return;
		}
		if (endDate.getTime() < startDate.getTime()) {
			toast.error("End date must be on or after the start date");
			return;
		}
		setSubmitting(true);
		try {
			const startEth = gregorianToEthiopian(startDate);
			const endEth = gregorianToEthiopian(endDate);
			const payload = {
				fasting_id: period.id as string,
				ethiopian_year: year,
				start_eth_year: startEth.year,
				start_eth_month: startEth.month,
				start_eth_day: startEth.day,
				end_eth_year: endEth.year,
				end_eth_month: endEth.month,
				end_eth_day: endEth.day,
				start_gregorian_date: toISODate(startDate),
				end_gregorian_date: toISODate(endDate),
			};
			if (editing) {
				await updateFastingOccurrence({ data: { id: editing.id, ...payload } });
				toast.success("Occurrence updated");
			} else {
				await createFastingOccurrence({ data: payload });
				toast.success("Occurrence created");
			}
			setDialogOpen(false);
			router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!deletingId) return;
		setSubmitting(true);
		try {
			await deleteFastingOccurrence({ data: { id: deletingId } });
			toast.success("Occurrence deleted");
			setDeleteOpen(false);
			setDeletingId(null);
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
				<div className="mx-auto max-w-4xl space-y-6">
					<Link
						to="/dashboard/fasting"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Fasting Calendar
					</Link>

					<div className="rounded-xl border bg-card p-5">
						<div className="flex items-start justify-between">
							<div>
								<h1 className="text-2xl font-bold">{localized(period.name)}</h1>
								<p className="text-sm text-muted-foreground font-mono mt-0.5">
									{period.fasting_key}
								</p>
								{localized(period.description) && (
									<p className="text-sm text-muted-foreground mt-2">
										{localized(period.description)}
									</p>
								)}
							</div>
						</div>
						<div className="mt-4 flex flex-wrap gap-2 text-xs">
							<span className="rounded-full bg-muted px-2.5 py-1 capitalize">
								Type: {period.type}
							</span>
							<span className="rounded-full bg-muted px-2.5 py-1 capitalize">
								Severity: {period.severity}
							</span>
							{period.is_weekly && (
								<span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
									Weekly: {(period.weekly_days ?? []).join(", ")}
								</span>
							)}
							{period.duration_days && (
								<span className="rounded-full bg-muted px-2.5 py-1">
									{period.duration_days} days
								</span>
							)}
						</div>
					</div>

					<div className="rounded-xl border bg-card overflow-hidden">
						<div className="flex items-center justify-between border-b p-4">
							<div>
								<h2 className="font-semibold">Yearly Occurrences</h2>
								<p className="text-xs text-muted-foreground">
									Concrete Gregorian dates per Ethiopian year
								</p>
							</div>
							{!period.is_weekly && (
								<Button size="sm" onClick={openCreate}>
									<Plus className="h-4 w-4 mr-1.5" />
									Add Occurrence
								</Button>
							)}
						</div>

						{period.is_weekly ? (
							<div className="p-8 text-center text-sm text-muted-foreground">
								Weekly fasts repeat every week and don't need per-year
								occurrences.
							</div>
						) : occurrences.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-12 text-center">
								<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
									<CalendarRange className="h-7 w-7 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold mb-1">
									No occurrences yet
								</h3>
								<p className="text-sm text-muted-foreground max-w-sm mb-4">
									Add the concrete start/end dates for each Ethiopian year.
								</p>
								<Button onClick={openCreate}>
									<Plus className="h-4 w-4 mr-1.5" />
									Add Occurrence
								</Button>
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Eth. Year</TableHead>
											<TableHead>Start</TableHead>
											<TableHead>End</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{occurrences.map((o) => (
											<TableRow key={o.id}>
												<TableCell className="font-medium">
													{o.ethiopian_year}
												</TableCell>
												<TableCell>
													{format(
														new Date(o.start_gregorian_date),
														"MMM d, yyyy",
													)}
													{o.start_eth_month && (
														<span className="block text-[11px] text-muted-foreground">
															{o.start_eth_month}/{o.start_eth_day} E.C.
														</span>
													)}
												</TableCell>
												<TableCell>
													{format(
														new Date(o.end_gregorian_date),
														"MMM d, yyyy",
													)}
													{o.end_eth_month && (
														<span className="block text-[11px] text-muted-foreground">
															{o.end_eth_month}/{o.end_eth_day} E.C.
														</span>
													)}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() => openEdit(o)}
														>
															<Pencil className="h-3.5 w-3.5" />
														</Button>
														{showDelete && (
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-destructive hover:text-destructive"
																onClick={() => {
																	setDeletingId(o.id);
																	setDeleteOpen(true);
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
					</div>
				</div>
			</div>

			{/* Create / Edit Occurrence Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{editing ? "Edit" : "Add"} Occurrence</DialogTitle>
						<DialogDescription>
							Pick the Gregorian start and end dates. The Ethiopian dates are
							derived automatically.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-1.5">
							<Label className="text-xs">Ethiopian Year *</Label>
							<Input
								type="number"
								value={ethYear}
								onChange={(e) => setEthYear(e.target.value)}
								placeholder="e.g. 2018"
							/>
						</div>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label className="text-xs">Start date *</Label>
								<DatePicker
									value={startDate}
									onChange={handleStartChange}
									placeholder="Start"
								/>
								{startDate && (
									<p className="text-[11px] text-muted-foreground">
										{formatEthiopian(gregorianToEthiopian(startDate))}
									</p>
								)}
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">End date *</Label>
								<DatePicker
									value={endDate}
									onChange={setEndDate}
									placeholder="End"
									fromDate={startDate}
								/>
								{endDate && (
									<p className="text-[11px] text-muted-foreground">
										{formatEthiopian(gregorianToEthiopian(endDate))}
									</p>
								)}
							</div>
						</div>
						{!datesValid && startDate && endDate && (
							<p className="text-xs text-destructive">
								End date must be on or after the start date.
							</p>
						)}
						<div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
							Duration:{" "}
							<span className="font-semibold">
								{duration ? `${duration} day${duration === 1 ? "" : "s"}` : "—"}
							</span>
							<span className="ml-1 text-xs text-muted-foreground">
								(auto-calculated)
							</span>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDialogOpen(false)}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={!canSubmit}>
							{submitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									{editing ? "Saving..." : "Creating..."}
								</>
							) : editing ? (
								"Save"
							) : (
								"Create"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Occurrence</DialogTitle>
						<DialogDescription>This cannot be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteOpen(false)}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
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
