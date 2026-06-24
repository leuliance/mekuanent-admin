import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
	differenceInCalendarDays,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import {
	AlertCircle,
	CalendarDays,
	ChevronRight,
	Loader2,
	Pencil,
	Plus,
	Sparkles,
	Trash2,
	Utensils,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	createFastingPeriod,
	deleteFastingPeriod,
	getFastingPeriods,
	getFastsInRange,
	updateFastingPeriod,
} from "@/api/fasting";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
	ethiopianToGregorian,
	formatEthiopian,
	gregorianToEthiopian,
	parseISODate,
} from "@/lib/ethiopian-date";
import { canDelete } from "@/lib/roles";

// biome-ignore lint/suspicious/noExplicitAny: Supabase rows are serialized to JSON.
type FastingPeriod = any;
type RangeRow = {
	d: string;
	fasting_keys: string[];
	is_fasting: boolean;
	names: unknown;
	tier: string | null;
};

type FastType = "movable" | "fixed" | "weekly";
type Severity = "major" | "minor" | "weekly";

const TYPE_OPTIONS: { value: FastType; label: string; hint: string }[] = [
	{ value: "fixed", label: "Fixed", hint: "Same Ethiopian dates every year" },
	{ value: "movable", label: "Movable", hint: "Dates shift each year" },
	{ value: "weekly", label: "Weekly", hint: "Wednesday & Friday" },
];

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
	{ value: "major", label: "Major fast" },
	{ value: "minor", label: "Minor / eve fast" },
	{ value: "weekly", label: "Weekly fast" },
];

function localized(value: unknown): string {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) {
		return value.map(localized).filter(Boolean).join(", ");
	}
	if (typeof value === "object") {
		const obj = value as Record<string, unknown>;
		const pick = obj.am ?? obj.en ?? Object.values(obj)[0];
		return typeof pick === "string" ? pick : pick != null ? localized(pick) : "";
	}
	return String(value);
}

const TIER_META: Record<
	string,
	{ label: string; dot: string; modClass: string }
> = {
	strict: {
		label: "Strict",
		dot: "bg-red-500",
		modClass: "bg-red-500/15 text-red-700 dark:text-red-400 font-semibold",
	},
	major: {
		label: "Major",
		dot: "bg-orange-500",
		modClass:
			"bg-orange-500/15 text-orange-700 dark:text-orange-400 font-semibold",
	},
	weekly: {
		label: "Weekly",
		dot: "bg-amber-400",
		modClass: "bg-amber-400/20 text-amber-700 dark:text-amber-400",
	},
	fast: {
		label: "Fasting",
		dot: "bg-emerald-500",
		modClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
	},
};

function tierKey(tier: string | null): keyof typeof TIER_META {
	if (tier && tier in TIER_META) return tier as keyof typeof TIER_META;
	if (tier === "major") return "major";
	return "fast";
}

export const Route = createFileRoute("/_authenticated/dashboard/fasting/")({
	loader: async () => {
		const now = new Date();
		const start = startOfWeek(startOfMonth(now), { weekStartsOn: 1 });
		const end = endOfWeek(endOfMonth(now), { weekStartsOn: 1 });
		const [periods, range] = await Promise.all([
			getFastingPeriods(),
			getFastsInRange({
				data: {
					start: format(start, "yyyy-MM-dd"),
					end: format(end, "yyyy-MM-dd"),
				},
			}),
		]);
		return { periods, range };
	},
	pendingComponent: () => (
		<div className="flex-1 overflow-auto p-6">
			<div className="mx-auto max-w-7xl space-y-6">
				<Skeleton className="h-8 w-56" />
				<div className="grid gap-6 lg:grid-cols-3">
					<Skeleton className="h-128 rounded-xl lg:col-span-2" />
					<Skeleton className="h-128 rounded-xl" />
				</div>
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
	component: FastingPage,
});

function FastingCalendar({ initialRange }: { initialRange: RangeRow[] }) {
	const [month, setMonth] = useState(new Date());
	const [range, setRange] = useState<RangeRow[]>(initialRange);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<Date | undefined>(undefined);

	const loadMonth = useCallback(async (target: Date) => {
		const start = startOfWeek(startOfMonth(target), { weekStartsOn: 1 });
		const end = endOfWeek(endOfMonth(target), { weekStartsOn: 1 });
		setLoading(true);
		try {
			const rows = (await getFastsInRange({
				data: {
					start: format(start, "yyyy-MM-dd"),
					end: format(end, "yyyy-MM-dd"),
				},
			})) as RangeRow[];
			setRange(rows);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to load");
		} finally {
			setLoading(false);
		}
	}, []);

	const byDate = useMemo(() => new Map(range.map((r) => [r.d, r])), [range]);

	const modifiers = useMemo(() => {
		const groups: Record<string, Date[]> = {
			strict: [],
			major: [],
			weekly: [],
			fast: [],
		};
		for (const r of range) {
			if (!r.is_fasting) continue;
			const dt = parseISODate(r.d);
			if (!dt) continue;
			groups[tierKey(r.tier)].push(dt);
		}
		return groups;
	}, [range]);

	const modifiersClassNames = {
		strict: TIER_META.strict.modClass,
		major: TIER_META.major.modClass,
		weekly: TIER_META.weekly.modClass,
		fast: TIER_META.fast.modClass,
	};

	const selectedRow = selected
		? byDate.get(format(selected, "yyyy-MM-dd"))
		: undefined;
	const selectedEth = selected ? gregorianToEthiopian(selected) : undefined;

	return (
		<div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm">
			<div className="mb-4 flex items-center gap-2">
				<CalendarDays className="h-5 w-5 text-muted-foreground" />
				<h2 className="text-base font-semibold">Calendar</h2>
				{loading && (
					<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
				)}
			</div>

			<div className="flex justify-center">
				<Calendar
					mode="single"
					month={month}
					onMonthChange={(m) => {
						setMonth(m);
						void loadMonth(m);
					}}
					selected={selected}
					onSelect={setSelected}
					weekStartsOn={1}
					showOutsideDays
					modifiers={modifiers}
					modifiersClassNames={modifiersClassNames}
					className="p-0 [--cell-size:2.75rem] sm:[--cell-size:3.25rem] lg:[--cell-size:3.75rem]"
					classNames={{
						caption_label: "text-base font-semibold",
						weekday:
							"flex-1 rounded-md text-sm font-medium text-muted-foreground select-none",
					}}
				/>
			</div>

			{selected && (
				<div className="mt-5 rounded-lg border bg-muted/40 p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium">
								{format(selected, "EEEE, MMM d, yyyy")}
							</p>
							{selectedEth && (
								<p className="text-xs text-muted-foreground">
									{formatEthiopian(selectedEth)}
								</p>
							)}
						</div>
						{selectedRow?.is_fasting ? (
							<span
								className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TIER_META[tierKey(selectedRow.tier)].modClass}`}
							>
								<span
									className={`h-2 w-2 rounded-full ${TIER_META[tierKey(selectedRow.tier)].dot}`}
								/>
								{TIER_META[tierKey(selectedRow.tier)].label}
							</span>
						) : (
							<span className="rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground">
								No fast
							</span>
						)}
					</div>
					{selectedRow?.is_fasting && localized(selectedRow.names) && (
						<p className="mt-2 text-sm text-foreground">
							{localized(selectedRow.names)}
						</p>
					)}
				</div>
			)}

			<div className="mt-auto flex flex-wrap gap-3 pt-5 text-[11px] text-muted-foreground">
				{Object.values(TIER_META).map((t) => (
					<span key={t.label} className="flex items-center gap-1">
						<span className={`h-2 w-2 rounded-full ${t.dot}`} /> {t.label}
					</span>
				))}
			</div>
		</div>
	);
}

function FastingPage() {
	const { periods, range } = Route.useLoaderData();
	const router = useRouter();
	const { user } = Route.useRouteContext();
	const showDelete = !!user && canDelete(user.role);
	const typedPeriods = periods as FastingPeriod[];

	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [editing, setEditing] = useState<FastingPeriod | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// Form state
	const [nameAm, setNameAm] = useState("");
	const [nameEn, setNameEn] = useState("");
	const [descAm, setDescAm] = useState("");
	const [type, setType] = useState<FastType>("fixed");
	const [severity, setSeverity] = useState<Severity>("major");
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);

	const resetForm = () => {
		setNameAm("");
		setNameEn("");
		setDescAm("");
		setType("fixed");
		setSeverity("major");
		setStartDate(undefined);
		setEndDate(undefined);
	};

	const openCreate = () => {
		setEditing(null);
		resetForm();
		setDialogOpen(true);
	};

	const openEdit = (p: FastingPeriod) => {
		setEditing(p);
		setNameAm(localized(p.name));
		setNameEn((p.name as Record<string, string>)?.en ?? "");
		setDescAm(localized(p.description));
		const t = (p.type ?? "fixed") as FastType;
		setType(t);
		setSeverity((p.severity ?? "major") as Severity);
		// Prefill fixed dates from the recurring Ethiopian month/day using the
		// current Ethiopian year as a representative anchor.
		if (t === "fixed" && p.start_eth_month && p.start_eth_day) {
			const refYear = gregorianToEthiopian(new Date()).year;
			setStartDate(
				ethiopianToGregorian(refYear, p.start_eth_month, p.start_eth_day),
			);
			setEndDate(
				p.end_eth_month && p.end_eth_day
					? ethiopianToGregorian(refYear, p.end_eth_month, p.end_eth_day)
					: undefined,
			);
		} else {
			setStartDate(undefined);
			setEndDate(undefined);
		}
		setDialogOpen(true);
	};

	// Auto-calculated duration (inclusive) for fixed fasts.
	const duration =
		type === "fixed" && startDate && endDate
			? differenceInCalendarDays(endDate, startDate) + 1
			: null;

	const datesValid =
		type !== "fixed" ||
		(!!startDate && !!endDate && endDate.getTime() >= startDate.getTime());

	const canSubmit = nameAm.trim().length > 0 && datesValid && !submitting;

	const handleTypeChange = (next: FastType) => {
		setType(next);
		if (next === "weekly") setSeverity("weekly");
		else if (severity === "weekly") setSeverity("major");
	};

	const handleSubmit = async () => {
		if (!nameAm.trim()) {
			toast.error("Amharic name is required");
			return;
		}
		if (type === "fixed") {
			if (!startDate || !endDate) {
				toast.error("Pick a start and end date");
				return;
			}
			if (endDate.getTime() < startDate.getTime()) {
				toast.error("End date must be on or after the start date");
				return;
			}
		}
		setSubmitting(true);
		try {
			const isWeekly = type === "weekly";
			const startEth = startDate ? gregorianToEthiopian(startDate) : null;
			const endEth = endDate ? gregorianToEthiopian(endDate) : null;

			const payload = {
				name: {
					am: nameAm.trim(),
					...(nameEn.trim() ? { en: nameEn.trim() } : {}),
				},
				description: descAm.trim() ? { am: descAm.trim() } : undefined,
				type,
				severity,
				is_weekly: isWeekly,
				weekly_days: isWeekly ? ["Wednesday", "Friday"] : null,
				start_eth_month: type === "fixed" ? (startEth?.month ?? null) : null,
				start_eth_day: type === "fixed" ? (startEth?.day ?? null) : null,
				end_eth_month: type === "fixed" ? (endEth?.month ?? null) : null,
				end_eth_day: type === "fixed" ? (endEth?.day ?? null) : null,
				duration_days: type === "fixed" ? duration : null,
			};
			if (editing) {
				await updateFastingPeriod({ data: { id: editing.id, ...payload } });
				toast.success("Fasting period updated");
			} else {
				await createFastingPeriod({ data: payload });
				toast.success("Fasting period created");
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
			await deleteFastingPeriod({ data: { id: deletingId } });
			toast.success("Fasting period deleted");
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
			<div className="mx-auto max-w-7xl space-y-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold">Fasting Calendar</h1>
							<p className="text-muted-foreground mt-1">
								Manage Ethiopian Orthodox fasting periods and yearly occurrences
							</p>
						</div>
						<Button onClick={openCreate} className="w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-1.5" />
							Add Period
						</Button>
					</div>

					<div className="grid gap-6 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<FastingCalendar initialRange={range as RangeRow[]} />
						</div>

						<div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
							<div className="flex items-center justify-between border-b p-4">
								<div>
									<h2 className="font-semibold">Fasting Periods</h2>
									<p className="text-xs text-muted-foreground">
										{typedPeriods.length} defined
									</p>
								</div>
							</div>
							{typedPeriods.length === 0 ? (
								<div className="flex flex-col items-center justify-center p-12 text-center">
									<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
										<Utensils className="h-7 w-7 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-1">
										No fasting periods
									</h3>
									<p className="text-sm text-muted-foreground max-w-sm mb-4">
										Define fasting periods like Tsome Nebiyat, Hudade, or weekly
										Wednesday/Friday fasts.
									</p>
									<Button onClick={openCreate}>
										<Plus className="h-4 w-4 mr-1.5" />
										Create Period
									</Button>
								</div>
							) : (
								<div className="divide-y">
									{typedPeriods.map((p) => {
										const sev = TIER_META[tierKey(p.severity)];
										return (
											<div
												key={p.id}
												className="group flex items-center gap-3 p-3 transition-colors hover:bg-muted/40"
											>
												<span
													className={`h-9 w-1 rounded-full ${sev.dot}`}
													aria-hidden
												/>
												<Link
													to="/dashboard/fasting/$fastingId"
													params={{ fastingId: p.id }}
													className="min-w-0 flex-1"
												>
													<p className="truncate font-medium hover:underline">
														{localized(p.name)}
													</p>
													<div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px]">
														<span className="rounded bg-muted px-1.5 py-0.5 capitalize text-muted-foreground">
															{p.type}
														</span>
														<span className="rounded bg-muted px-1.5 py-0.5 capitalize text-muted-foreground">
															{p.severity}
														</span>
														{p.is_weekly && (
															<span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
																{(p.weekly_days ?? []).join(" & ") || "weekly"}
															</span>
														)}
														{p.duration_days ? (
															<span className="text-muted-foreground">
																{p.duration_days} days
															</span>
														) : null}
													</div>
												</Link>
												<div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														onClick={() => openEdit(p)}
													>
														<Pencil className="h-3.5 w-3.5" />
													</Button>
													{showDelete && (
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-destructive hover:text-destructive"
															onClick={() => {
																setDeletingId(p.id);
																setDeleteOpen(true);
															}}
														>
															<Trash2 className="h-3.5 w-3.5" />
														</Button>
													)}
												</div>
												<Link
													to="/dashboard/fasting/$fastingId"
													params={{ fastingId: p.id }}
													className="text-muted-foreground"
												>
													<ChevronRight className="h-4 w-4" />
												</Link>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Create / Edit Period Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{editing ? "Edit" : "Create"} Fasting Period
						</DialogTitle>
						<DialogDescription>
							A stable key and ordering are generated automatically.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label className="text-xs">Name (Amharic) *</Label>
								<Input
									value={nameAm}
									onChange={(e) => setNameAm(e.target.value)}
									placeholder="ጾመ ነቢያት"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Name (English)</Label>
								<Input
									value={nameEn}
									onChange={(e) => setNameEn(e.target.value)}
									placeholder="Advent Fast"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs">Description (Amharic)</Label>
							<Textarea
								value={descAm}
								onChange={(e) => setDescAm(e.target.value)}
								placeholder="Optional description"
								rows={2}
							/>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label className="text-xs">Type</Label>
								<Select
									value={type}
									onValueChange={(v) =>
										handleTypeChange((v as FastType) ?? type)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{TYPE_OPTIONS.map((o) => (
											<SelectItem key={o.value} value={o.value}>
												{o.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<p className="text-[11px] text-muted-foreground">
									{TYPE_OPTIONS.find((o) => o.value === type)?.hint}
								</p>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Severity</Label>
								<Select
									value={severity}
									onValueChange={(v) =>
										setSeverity((v as Severity) ?? severity)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SEVERITY_OPTIONS.map((o) => (
											<SelectItem key={o.value} value={o.value}>
												{o.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{type === "weekly" && (
							<div className="rounded-lg border bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
								<div className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-300">
									<Sparkles className="h-4 w-4" />
									Weekly fast
								</div>
								<p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
									Recurs every <strong>Wednesday</strong> and{" "}
									<strong>Friday</strong>. No dates needed.
								</p>
							</div>
						)}

						{type === "movable" && (
							<div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
								Movable fasts shift each year. Save this period, then add the
								concrete dates per Ethiopian year from its detail page.
							</div>
						)}

						{type === "fixed" && (
							<>
								<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
									<div className="space-y-1.5">
										<Label className="text-xs">Start date *</Label>
										<DatePicker
											value={startDate}
											onChange={setStartDate}
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
										{duration
											? `${duration} day${duration === 1 ? "" : "s"}`
											: "—"}
									</span>
									<span className="ml-1 text-xs text-muted-foreground">
										(auto-calculated)
									</span>
								</div>
							</>
						)}
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
						<DialogTitle>Delete Fasting Period</DialogTitle>
						<DialogDescription>
							This deletes the period and all its yearly occurrences. This
							cannot be undone.
						</DialogDescription>
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
