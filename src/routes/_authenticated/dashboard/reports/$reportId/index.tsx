import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { AlertCircle, ArrowLeft, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getReport, updateReportStatus } from "@/api/reports";
import { Button } from "@/components/ui/button";
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

// biome-ignore lint/suspicious/noExplicitAny: Supabase rows are serialized to JSON.
type AnyRow = any;

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

export const Route = createFileRoute(
	"/_authenticated/dashboard/reports/$reportId/",
)({
	loader: async ({ params }) => {
		return await getReport({ data: { id: params.reportId } });
	},
	pendingComponent: () => (
		<div className="flex-1 overflow-auto p-6">
			<div className="mx-auto max-w-3xl space-y-6">
				<Skeleton className="h-8 w-40" />
				<Skeleton className="h-40 rounded-xl" />
				<Skeleton className="h-48 rounded-xl" />
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
				<Link to="/dashboard/reports">
					<Button variant="outline">Back to Reports</Button>
				</Link>
			</div>
		</div>
	),
	component: ReportDetailPage,
});

function ReportDetailPage() {
	const loaderData = Route.useLoaderData() as {
		report: AnyRow;
		reason: AnyRow;
		reporter: AnyRow;
		target: AnyRow;
		targetLabel: string | null;
		targetChurch: string | null;
		canReview: boolean;
	};
	const { report, reason, reporter, targetLabel, targetChurch, canReview } =
		loaderData;
	const router = useRouter();

	const [status, setStatus] = useState<string>(report.status);
	const [note, setNote] = useState<string>(report.resolution_note ?? "");
	const [submitting, setSubmitting] = useState(false);

	const handleSave = async () => {
		setSubmitting(true);
		try {
			await updateReportStatus({
				data: {
					id: report.id,
					status: status as (typeof STATUSES)[number],
					resolution_note: note.trim() || undefined,
				},
			});
			toast.success("Report updated");
			router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update");
		} finally {
			setSubmitting(false);
		}
	};

	const reporterName =
		`${reporter?.first_name ?? ""} ${reporter?.last_name ?? ""}`.trim() ||
		reporter?.email ||
		"Unknown";

	return (
		<div className="flex-1 overflow-auto p-6">
			<div className="mx-auto max-w-3xl space-y-6">
				<Link
					to="/dashboard/reports"
					className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Reports
				</Link>

				<div className="rounded-xl border bg-card p-5">
					<div className="flex items-start justify-between">
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-xl font-bold capitalize">
									{report.target_type} report
								</h1>
								<span
									className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
										STATUS_STYLE[report.status] ?? "bg-muted"
									}`}
								>
									{report.status.replace("_", " ")}
								</span>
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								Reported {format(new Date(report.created_at), "PPP")}
							</p>
						</div>
					</div>

					<dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
						<div>
							<dt className="text-xs text-muted-foreground">Target</dt>
							<dd className="font-medium">
								{targetLabel || (
									<span className="font-mono text-xs">{report.target_id}</span>
								)}
							</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Reason</dt>
							<dd className="font-medium">
								{localized(reason?.label) || report.reason_key}
							</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Reporter</dt>
							<dd className="font-medium">{reporterName}</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Owning church</dt>
							<dd className="font-medium">
								{targetChurch ? (
									<span className="font-mono text-xs">{targetChurch}</span>
								) : (
									"—"
								)}
							</dd>
						</div>
					</dl>

					{report.description && (
						<div className="mt-4">
							<dt className="text-xs text-muted-foreground">Reporter's note</dt>
							<p className="mt-1 rounded-lg bg-muted/50 p-3 text-sm">
								{report.description}
							</p>
						</div>
					)}
				</div>

				{/* Moderation / status change */}
				<div className="rounded-xl border bg-card p-5">
					<h2 className="font-semibold">Moderation</h2>
					{!canReview ? (
						<div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
							<Lock className="h-4 w-4 shrink-0" />
							You don't have permission to review this report (church-scoped).
						</div>
					) : (
						<div className="mt-4 space-y-4">
							<div className="space-y-1.5">
								<Label className="text-xs">Status</Label>
								<Select
									value={status}
									onValueChange={(v) => setStatus(v ?? status)}
								>
									<SelectTrigger className="w-full sm:w-64">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{STATUSES.map((s) => (
											<SelectItem key={s} value={s} className="capitalize">
												{s.replace("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Resolution note</Label>
								<Textarea
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder="Explain the action taken or why this was dismissed…"
									rows={4}
								/>
							</div>
							<div className="flex justify-end">
								<Button onClick={handleSave} disabled={submitting}>
									{submitting ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Saving...
										</>
									) : (
										"Save changes"
									)}
								</Button>
							</div>
							{report.resolved_at && (
								<p className="text-xs text-muted-foreground">
									Last resolved {format(new Date(report.resolved_at), "PPP p")}
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
